
// src/lib/api/admin.ts

import api from './api';

import type {
  AdminDashboardStats,
  AdminInvestmentPlan,
  AdminPlanWithInvestors,
  AdminPublishedPlansInvestorsResponse,
  CreateInvestmentPlanRequest,
  UpdateInvestmentPlanRequest,
  PublishInvestmentPlanRequest,
} from '@/src/lib/types/admin';

// -----------------------------------------------------------------------------
// API response normalization
// -----------------------------------------------------------------------------
//
// Backend JSON uses snake_case.
// Frontend models use camelCase.
//
// Example:
// minimum_amount -> minimumAmount
// duration_days -> durationDays
// created_at -> createdAt
//
// Keep this conversion at the API boundary so components do not need to know
// about backend JSON naming conventions.
// -----------------------------------------------------------------------------

function toCamelCase<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((value) => toCamelCase(value)) as unknown as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(
        /_([a-z])/g,
        (_, letter: string) => letter.toUpperCase(),
      );

      newObj[camelKey] = toCamelCase(value);
    }

    return newObj as T;
  }

  return obj as T;
}

// -----------------------------------------------------------------------------
// User types
// -----------------------------------------------------------------------------

export type UserRole =
  | 'employee'
  | 'admin'
  | 'superadmin';

export interface User {
  id: string;
  email: string;
  name: string;
  employee_id: string;
  role: UserRole;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedUsers {
  users: User[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}

// -----------------------------------------------------------------------------
// Admin investment deposits
// -----------------------------------------------------------------------------

export interface AdminDeposit {
  id: string;
  investment_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  asset_id: string;
  asset_symbol: string;
  network_id: string;
  network_name: string;
  expected_amount: number;
  received_amount: number;
  company_deposit_address: string;
  sender_address: string;
  tx_hash: string | null;
  proof_url?: string | null;
  status:
    | 'PENDING'
    | 'VERIFYING'
    | 'CONFIRMED'
    | 'FAILED'
    | 'EXPIRED'
    | 'UNMATCHED';
  confirmations: number;
  required_confirmations: number;
  confirmed_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  last_checked_at: string | null;
  verification_attempts: number;
  block_number: number;
  token_contract: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminDepositsResponse {
  deposits: AdminDeposit[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}

// -----------------------------------------------------------------------------
// Admin investments
// -----------------------------------------------------------------------------

export interface AdminInvestment {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan_id: string;
  plan_name: string;
  asset_id: string;
  asset_symbol: string;
  network_id: string;
  network_name: string;
  amount: number;
  expected_return: number;
  actual_return: number;
  projected_value: number;
  deposit_address: string;
  status:
    | 'PENDING'
    | 'ACTIVE'
    | 'MATURED'
    | 'WITHDRAWN'
    | 'CANCELLED';
  start_date: string | null;
  maturity_date: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
  duration_days: number;
  expected_return_rate: number;
}

export interface AdminInvestmentsResponse {
  investments: AdminInvestment[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}

// -----------------------------------------------------------------------------
// Admin account deposits
// -----------------------------------------------------------------------------

export type AccountDepositStatus =
  | 'PENDING'
  | 'VERIFYING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'EXPIRED'
  | 'UNMATCHED';

export interface AdminAccountDeposit {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;

  account_deposit_address_id: string;

  asset_id: string;
  asset_symbol: string;

  network_id: string;
  network_name: string;

  expected_amount: number;
  received_amount: number;

  company_deposit_address: string;
  sender_address: string;
  tx_hash: string | null;

  status: AccountDepositStatus;

  confirmations: number;
  required_confirmations: number;

  block_number: number;
  token_contract: string | null;

  confirmed_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;

  last_checked_at: string | null;
  verification_attempts: number;
  verification_lock_until: string | null;

  created_at: string;
  updated_at: string;
}

export interface AdminAccountDepositsResponse {
  deposits: AdminAccountDeposit[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}

// -----------------------------------------------------------------------------
// Admin withdrawals
// -----------------------------------------------------------------------------

export type AdminWithdrawalStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'BROADCAST'
  | 'CONFIRMING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface AdminWithdrawal {
  id: string;
  user_id: string;

  asset_id: string;
  network_id: string;

  withdrawal_wallet_id: string;
  destination_address: string;

  amount: number;
  fee: number;
  net_amount: number;

  status: AdminWithdrawalStatus;

  idempotency_key: string;

  tx_hash: string;
  confirmations: number;
  required_confirmations: number;

  failure_reason: string | null;

  created_at: string;
  updated_at: string;

  broadcast_at: string | null;
  completed_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;
}

export interface AdminWithdrawalsResponse {
  withdrawals: AdminWithdrawal[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}

export interface AdminWithdrawalListParams {
  page?: number;
  page_size?: number;
  status?: AdminWithdrawalStatus;
  user_id?: string;
}

export interface RejectAdminWithdrawalRequest {
  reason: string;
}

// -----------------------------------------------------------------------------
// Admin API
// -----------------------------------------------------------------------------

export const adminApi = {
  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  listUsers: (page = 1, pageSize = 20) =>
    api.get<PaginatedUsers>(
      `/investment/admin/users?page=${page}&page_size=${pageSize}`,
    ),

  getUser: (userId: string) =>
    api.get<User>(
      `/investment/admin/users/${userId}`,
    ),

  updateUserRole: (
    userId: string,
    role: UserRole,
  ) =>
    api.put<{ message: string }>(
      `/investment/admin/users/${userId}/role`,
      { role },
    ),

  // ---------------------------------------------------------------------------
  // Investment deposits
  // ---------------------------------------------------------------------------

  listDeposits: (page = 1, pageSize = 20) =>
    api.get<AdminDepositsResponse>(
      '/admin/deposits',
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    ),

  getDeposit: (depositId: string) =>
    api.get<AdminDeposit>(
      `/admin/deposits/${depositId}`,
    ),

  verifyDeposit: (depositId: string) =>
    api.post<AdminDeposit>(
      `/admin/deposits/${depositId}/verify`,
    ),

  rejectDeposit: (
    depositId: string,
    reason: string,
  ) =>
    api.post<AdminDeposit>(
      `/admin/deposits/${depositId}/reject`,
      {
        reason,
      },
    ),

  // ---------------------------------------------------------------------------
  // Investments
  // ---------------------------------------------------------------------------

  listInvestments: (
    page = 1,
    pageSize = 20,
  ) =>
    api.get<AdminInvestmentsResponse>(
      '/admin/investments',
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    ),

  getInvestment: (
    investmentId: string,
  ) =>
    api.get<AdminInvestment>(
      `/admin/investments/${investmentId}`,
    ),

  // ---------------------------------------------------------------------------
  // Account deposits
  // ---------------------------------------------------------------------------

  listAccountDeposits: (
    page = 1,
    pageSize = 20,
  ) =>
    api.get<AdminAccountDepositsResponse>(
      '/admin/account-deposits',
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    ),

  getAccountDeposit: (
    depositId: string,
  ) =>
    api.get<AdminAccountDeposit>(
      `/admin/account-deposits/${depositId}`,
    ),

  rejectAccountDeposit: (
    depositId: string,
    reason: string,
  ) =>
    api.post<AdminAccountDeposit>(
      `/admin/account-deposits/${depositId}/reject`,
      {
        reason,
      },
    ),

  // ---------------------------------------------------------------------------
  // Withdrawals
  // ---------------------------------------------------------------------------

  listWithdrawals: (
    params: AdminWithdrawalListParams = {},
  ) =>
    api.get<AdminWithdrawalsResponse>(
      '/admin/withdrawals',
      {
        params: {
          page: params.page ?? 1,
          page_size: params.page_size ?? 20,
          ...(params.status
            ? { status: params.status }
            : {}),
          ...(params.user_id
            ? { user_id: params.user_id }
            : {}),
        },
      },
    ),

  getWithdrawal: (
    withdrawalId: string,
  ) =>
    api.get<AdminWithdrawal>(
      `/admin/withdrawals/${withdrawalId}`,
    ),

  rejectWithdrawal: (
    withdrawalId: string,
    reason: string,
  ) =>
    api.post<AdminWithdrawal>(
      `/admin/withdrawals/${withdrawalId}/reject`,
      {
        reason,
      },
    ),

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------

  getDashboardStats:
    async (): Promise<AdminDashboardStats> => {
      const response =
        await api.get<AdminDashboardStats>(
          '/admin/dashboard/stats',
        );

      return response.data;
    },

  // ---------------------------------------------------------------------------
  // Support
  // ---------------------------------------------------------------------------

  getUnreadSupportCount: () =>
    api.get<{ unread_count: number }>(
      '/admin/support/unread-count',
    ),

  // ---------------------------------------------------------------------------
  // Investment plans
  // ---------------------------------------------------------------------------
  //
  // Read access:
  //   admin
  //   superadmin
  //
  // Backend routes:
  //   GET /admin/plans
  //   GET /admin/plans/:planId
  //   GET /admin/plans/:planId/users
  //   GET /admin/plans/published/users
  // ---------------------------------------------------------------------------

  listPlans:
    async (): Promise<AdminInvestmentPlan[]> => {
      const response = await api.get<{
        plans: unknown[];
      }>('/admin/plans');

      return toCamelCase<AdminInvestmentPlan[]>(
        response.data.plans,
      );
    },

  getPlan:
    async (
      planId: string,
    ): Promise<AdminInvestmentPlan> => {
      const response = await api.get<unknown>(
        `/admin/plans/${planId}`,
      );

      return toCamelCase<AdminInvestmentPlan>(
        response.data,
      );
    },

  getPlanInvestors:
    async (
      planId: string,
    ): Promise<AdminPlanWithInvestors> => {
      const response = await api.get<unknown>(
        `/admin/plans/${planId}/users`,
      );

      return toCamelCase<AdminPlanWithInvestors>(
        response.data,
      );
    },

  getPublishedPlanInvestors:
    async (): Promise<AdminPublishedPlansInvestorsResponse> => {
      const response = await api.get<unknown>(
        '/admin/plans/published/users',
      );

      return toCamelCase<AdminPublishedPlansInvestorsResponse>(
        response.data,
      );
    },
};

// -----------------------------------------------------------------------------
// Superadmin API
// -----------------------------------------------------------------------------

export const superadminApi = {
  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  createUser: (data: {
    email: string;
    password: string;
    name: string;
    employee_id: string;
    role: UserRole;
  }) =>
    api.post<{
      message: string;
      user: User;
    }>(
      '/investment/superadmin/users',
      data,
    ),


deleteUser: (userId: string) =>
  api.delete<{
    message?: string;
    code?: string;
    error?: string;
  }>(
    `/investment/superadmin/users/${userId}`,
    {
      validateStatus: (status) =>
        (status >= 200 && status < 300) ||
        status === 409,
    },
  ),


  // ---------------------------------------------------------------------------
  // Investments
  // ---------------------------------------------------------------------------

  listInvestments: (
    page = 1,
    pageSize = 20,
  ) =>
    api.get<AdminInvestmentsResponse>(
      '/admin/investments',
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    ),

  getInvestment: (
    investmentId: string,
  ) =>
    api.get<AdminInvestment>(
      `/admin/investments/${investmentId}`,
    ),

  // ---------------------------------------------------------------------------
  // Account deposits
  // ---------------------------------------------------------------------------

  listAccountDeposits: (
    page = 1,
    pageSize = 20,
  ) =>
    api.get<AdminAccountDepositsResponse>(
      '/admin/account-deposits',
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    ),

  getAccountDeposit: (
    depositId: string,
  ) =>
    api.get<AdminAccountDeposit>(
      `/admin/account-deposits/${depositId}`,
    ),

  rejectAccountDeposit: (
    depositId: string,
    reason: string,
  ) =>
    api.post<AdminAccountDeposit>(
      `/admin/account-deposits/${depositId}/reject`,
      {
        reason,
      },
    ),

  // ---------------------------------------------------------------------------
  // Withdrawals
  // ---------------------------------------------------------------------------

  listWithdrawals: (
    params: AdminWithdrawalListParams = {},
  ) =>
    api.get<AdminWithdrawalsResponse>(
      '/admin/withdrawals',
      {
        params: {
          page: params.page ?? 1,
          page_size: params.page_size ?? 20,
          ...(params.status
            ? { status: params.status }
            : {}),
          ...(params.user_id
            ? { user_id: params.user_id }
            : {}),
        },
      },
    ),

  getWithdrawal: (
    withdrawalId: string,
  ) =>
    api.get<AdminWithdrawal>(
      `/admin/withdrawals/${withdrawalId}`,
    ),

  rejectWithdrawal: (
    withdrawalId: string,
    reason: string,
  ) =>
    api.post<AdminWithdrawal>(
      `/admin/withdrawals/${withdrawalId}/reject`,
      {
        reason,
      },
    ),

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------

  getDashboardStats:
    async (): Promise<AdminDashboardStats> => {
      const response =
        await api.get<AdminDashboardStats>(
          '/admin/dashboard/stats',
        );

      return response.data;
    },

  // ---------------------------------------------------------------------------
  // Support
  // ---------------------------------------------------------------------------

  getUnreadSupportCount: () =>
    api.get<{ unread_count: number }>(
      '/admin/support/unread-count',
    ),

  // ---------------------------------------------------------------------------
  // Investment plans
  // ---------------------------------------------------------------------------
  //
  // Superadmin-only:
  //   POST   /admin/plans
  //   PUT    /admin/plans/:planId
  //   PATCH  /admin/plans/:planId/publish
  //   DELETE /admin/plans/:planId
  //
  // Backend registration places these routes behind:
  // RequireRole("superadmin")
  // ---------------------------------------------------------------------------

  createPlan: (
    data: CreateInvestmentPlanRequest,
  ) =>
    api
      .post<unknown>(
        '/admin/plans',
        data,
      )
      .then((response) => ({
        ...response,
        data: toCamelCase<AdminInvestmentPlan>(
          response.data,
        ),
      })),

  updatePlan: (
    planId: string,
    data: UpdateInvestmentPlanRequest,
  ) =>
    api
      .put<unknown>(
        `/admin/plans/${planId}`,
        data,
      )
      .then((response) => ({
        ...response,
        data: toCamelCase<AdminInvestmentPlan>(
          response.data,
        ),
      })),

  publishPlan: (
    planId: string,
    data: PublishInvestmentPlanRequest,
  ) =>
    api
      .patch<unknown>(
        `/admin/plans/${planId}/publish`,
        data,
      )
      .then((response) => ({
        ...response,
        data: toCamelCase<AdminInvestmentPlan>(
          response.data,
        ),
      })),

  deletePlan: (
    planId: string,
  ) =>
    api.delete<{ message: string }>(
      `/admin/plans/${planId}`,
    ),
};