// src/features/admin/services/adminService.ts

import { adminRepository } from '../repositories/adminRepository';

import type {
  AdminDashboardStats,
} from '@/src/lib/types/admin';

export interface AdminService {
  getDashboardStats(): Promise<AdminDashboardStats>;
}

class AdminServiceImpl implements AdminService {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return adminRepository.getDashboardStats();
  }
}

export const adminService: AdminService =
  new AdminServiceImpl();