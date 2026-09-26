
// src/lib/api/auth.ts
import api from './api';
import type { UserProfile } from '../types/investment';
import { toCamelCase } from './utils';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/investment/auth/login', data);
    const user = toCamelCase<UserProfile>(response.data.user);
    return {
      ...response.data,
      user,
    };
  },

  register: async (data: RegisterRequest): Promise<{ message: string; user: UserProfile }> => {
    const response = await api.post('/investment/auth/register', data);
    return {
      message: response.data.message,
      user: toCamelCase<UserProfile>(response.data.user),
    };
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post('/investment/auth/refresh', { refresh_token: refreshToken });
    const user = toCamelCase<UserProfile>(response.data.user);
    return {
      ...response.data,
      user,
    };
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/investment/auth/logout', { refresh_token: refreshToken });
  },

  getMe: async (): Promise<UserProfile> => {
    const response = await api.get('/investment/auth/me');
    return toCamelCase<UserProfile>(response.data);
  },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/investment/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post('/investment/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },
  
};