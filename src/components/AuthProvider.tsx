
// src/components/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api/api';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  employee_id: string;
  role: 'employee' | 'admin' | 'superadmin';
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, redirectPath?: string) => Promise<void>;
  register: (email: string, password: string, name: string, referralCode?: string) => Promise<void>;
  verify: (code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: set a cookie
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

// Helper: delete a cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/investment/auth/me');
        setUser(response.data);
        // Sync cookie with localStorage (ensures consistency)
        setCookie('access_token', token);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        deleteCookie('access_token');
        deleteCookie('refresh_token');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);


  useEffect(() => {
  const handleAuthLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    deleteCookie("access_token");
    deleteCookie("refresh_token");

    setUser(null);
  };

  window.addEventListener(
    "auth:logout",
    handleAuthLogout,
  );

  return () => {
    window.removeEventListener(
      "auth:logout",
      handleAuthLogout,
    );
  };
}, []);

const login = async (email: string, password: string, redirectPath?: string) => {
  try {
    const response = await api.post('/investment/auth/login', {
      email,
      password,
    });

    const { access_token, refresh_token, user } = response.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    setCookie('access_token', access_token);
    setCookie('refresh_token', refresh_token);

    setUser(user);

    const roleDefaultPaths: Record<string, string> = {
      employee: '/investment',
      admin: '/admin',
      superadmin: '/superadmin',
    };

    const defaultPath = roleDefaultPaths[user.role] || '/investment';
    const finalRedirect = redirectPath || defaultPath;

    router.replace(finalRedirect);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const code = error.response?.data?.code;

      if (status === 403 && code === 'EMAIL_NOT_VERIFIED') {
        localStorage.setItem('registration_email', email);
        router.push('/verify');
        return;
      }
    }

    throw error;
  }
};



  const register = async (
  email: string,
  password: string,
  name: string,
  referralCode = ''
) => {
  const query = referralCode
    ? `?ref=${encodeURIComponent(referralCode)}`
    : '';

  await api.post(
    `/investment/auth/register${query}`,
    {
      email,
      password,
      name,
    }
  );

  localStorage.setItem('registration_email', email);
  router.push('/verify');
};

  const verify = async (code: string) => {
    await api.post('/investment/auth/verify', { code });
    router.push('/login');
  };

  const resendVerification = async (email: string) => {
    await api.post('/investment/auth/resend', { email });
  };

  const logout = async () => {
  const refreshToken =
    localStorage.getItem("refresh_token");

  try {
    if (refreshToken) {
      await api.post(
        "/investment/auth/logout",
        {
          refresh_token: refreshToken,
        },
      );
    }
  } catch (error) {
    console.error(
      "Backend logout failed:",
      error,
    );
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("registration_email");

    deleteCookie("access_token");
    deleteCookie("refresh_token");

    setUser(null);

    router.replace("/login");
  }
};

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verify,
        resendVerification,
        logout,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};