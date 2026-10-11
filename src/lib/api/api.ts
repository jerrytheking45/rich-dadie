import axios, { type InternalAxiosRequestConfig } from "axios";

const getApiBase = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // Android emulator accessing the Windows host.
    if (hostname === "10.0.2.2") {
      return "http://10.0.2.2:9090/api/v1";
    }
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090/api/v1";
};

const API_BASE = getApiBase();

console.log("[API] Base URL:", API_BASE);
console.log(
  "[API] Hostname:",
  typeof window !== "undefined" ? window.location.hostname : "SSR"
);

const api = axios.create({
  baseURL: API_BASE,
});

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// All simultaneous 401 responses share one refresh request.
let refreshPromise: Promise<string> | null = null;

function setAuthCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  document.cookie =
    `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

function deleteAuthCookie(name: string) {
  if (typeof document === "undefined") return;

  document.cookie =
    `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

const handleAuthFailure = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  deleteAuthCookie("access_token");
  deleteAuthCookie("refresh_token");

  window.dispatchEvent(new Event("auth:logout"));
};

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    const isAuthEndpoint =
      requestUrl.includes("/investment/auth/login") ||
      requestUrl.includes("/investment/auth/refresh") ||
      requestUrl.includes("/investment/auth/logout");

    if (status === 401 && originalRequest && !isAuthEndpoint) {
      // A request already retried with a refreshed token is still unauthorized.
      if (originalRequest._retry) {
        handleAuthFailure();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refresh_token")
          : null;

      if (!refreshToken) {
        handleAuthFailure();
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${API_BASE}/investment/auth/refresh`, {
            refresh_token: refreshToken,
          })
          .then((response) => {
            const accessToken = response.data?.access_token;
            const nextRefreshToken = response.data?.refresh_token;

            if (!accessToken || !nextRefreshToken) {
              handleAuthFailure();
              throw new Error("The refresh response did not contain both tokens.");
            }

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", nextRefreshToken);

            setAuthCookie("access_token", accessToken);
            setAuthCookie("refresh_token", nextRefreshToken);

            return accessToken as string;
          })
          .catch((refreshError: unknown) => {
            // Expired/rejected refresh tokens require a new login.
            // Network errors and server errors do not automatically erase the session.
            if (
              axios.isAxiosError(refreshError) &&
              refreshError.response?.status === 401
            ) {
              handleAuthFailure();
            }

            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    console.error("[API ERROR]", {
      message: error.message,
      code: error.code,
      status,
      data: error.response?.data,
      url: requestUrl,
      baseURL: error.config?.baseURL,
    });

    return Promise.reject(error);
  }
);

export default api;
