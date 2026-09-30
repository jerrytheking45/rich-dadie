import axios from "axios";

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

// Request interceptor – add access token
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

// Helper: clear authentication and notify AuthProvider
const handleAuthFailure = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.dispatchEvent(new Event("auth:logout"));
};

// Response interceptor – handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          handleAuthFailure();
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${API_BASE}/investment/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token, refresh_token } = response.data;

        localStorage.setItem("access_token", access_token);

        localStorage.setItem("refresh_token", refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        handleAuthFailure();

        return Promise.reject(refreshError);
      }
    }

    console.error("[API ERROR]", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });

    return Promise.reject(error);
  }
);

export default api;
