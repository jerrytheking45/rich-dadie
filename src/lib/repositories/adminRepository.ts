// src/features/admin/repository/adminRepository.ts

import { adminDashboardApi } from '../api/adminStats';

import type {
  AdminDashboardStats,
} from '@/src/lib/types/admin';

export interface AdminRepository {
  getDashboardStats(): Promise<AdminDashboardStats>;
}

class AdminRepositoryImpl implements AdminRepository {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return adminDashboardApi.getDashboardStats();
  }
}

export const adminRepository: AdminRepository =
  new AdminRepositoryImpl();