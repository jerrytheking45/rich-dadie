// src/lib/api/adminStats.ts

import { adminApi as legacyAdminApi } from '@/src/lib/api/admin';

import type {
  AdminDashboardStats,
} from '@/src/lib/types/admin';

export const adminDashboardApi = {
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    return legacyAdminApi.getDashboardStats();
  },
};