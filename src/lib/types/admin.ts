
// src/lib/types/admin.ts

export type AdminUserRole =
  | 'employee'
  | 'admin'
  | 'superadmin';

export interface AdminUserStats {
  total: number;
  verified: number;
}

export interface AdminInvestmentStats {
  total: number;
  pending: number;
  active: number;
  matured: number;
  withdrawn: number;
  cancelled: number;
  total_invested: number;
  projected_value: number;
}

export interface AdminDepositStats {
  total: number;
  pending: number;
  verifying: number;
  confirmed: number;
  failed: number;
  expired: number;
  unmatched: number;
}

export interface AdminWithdrawalStats {
  total: number;
  pending: number;
  processing: number;
  broadcast: number;
  confirming: number;
  completed: number;
  failed: number;
  cancelled: number;
  total_amount: number;
  net_amount: number;
}

export interface AdminSupportStats {
  total: number;
  open: number;
  in_progress: number;
  waiting_for_user: number;
  resolved: number;
  closed: number;
  urgent: number;
}

export interface AdminCentralWalletResource {
  limit: number;
  used: number;
  available: number;
}

export type AdminCentralWalletStatus =
  | 'HEALTHY'
  | 'WARNING'
  | 'CRITICAL'
  | string;

export interface AdminCentralWalletStats {
  address: string;
  network: string;
  usdt_balance: number;
  trx_balance: number;
  status: AdminCentralWalletStatus;

  energy: AdminCentralWalletResource;
  bandwidth: AdminCentralWalletResource;
  free_bandwidth: AdminCentralWalletResource;
  tron_power: AdminCentralWalletResource;

  last_checked_at: string;
}

export interface AdminLedgerStats {
  balance: number;
  entries: number;
}

export interface AdminDashboardStats {
  users: AdminUserStats;
  investments: AdminInvestmentStats;
  investment_deposits: AdminDepositStats;
  account_deposits: AdminDepositStats;
  withdrawals: AdminWithdrawalStats;
  support: AdminSupportStats;
  central_wallet: AdminCentralWalletStats;
  ledger: AdminLedgerStats;
}


// -----------------------------------------------------------------------------
// Investment plan management
// -----------------------------------------------------------------------------

export type AdminPlanStatus = 'DRAFT' | 'PUBLISHED';

export interface AdminInvestmentPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  minimumAmount: number;
  durationDays: number;
  expectedReturnRate: number;
  status: AdminPlanStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestmentPlanRequest {
  name: string;
  description: string;
  image?: string;
  minimum_amount: number;
  duration_days: number;
  expected_return_rate: number;
  status?: AdminPlanStatus;
  featured?: boolean;
}

export interface UpdateInvestmentPlanRequest {
  name: string;
  description: string;
  image?: string;
  minimum_amount: number;
  duration_days: number;
  expected_return_rate: number;
  status: AdminPlanStatus;
  featured: boolean;
}

export interface PublishInvestmentPlanRequest {
  published: boolean;
}

export interface AdminPlanInvestor {
  investmentId: string;
  userId: string;
  userName: string;
  email: string;
  employeeId: string;
  amount: number;
  expectedReturn: number;
  actualReturn: number;
  projectedValue: number;
  status: string;
  startDate: string | null;
  maturityDate: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPlanInvestorSummary {
  totalUsers: number;
  activeUsers: number;
  maturedUsers: number;
  totalInvested: number;
}

export interface AdminPlanWithInvestors {
  plan: AdminInvestmentPlan;
  summary: AdminPlanInvestorSummary;
  users: AdminPlanInvestor[];
}

export interface AdminPublishedPlanInvestors {
  plan: AdminInvestmentPlan;
  summary: AdminPlanInvestorSummary;
  users: AdminPlanInvestor[];
}

export interface AdminPublishedPlansInvestorsResponse {
  plans: AdminPublishedPlanInvestors[];
}