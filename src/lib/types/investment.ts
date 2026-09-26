
// src/lib/types/investment.ts


export interface BalanceSummary {
  assetId: string;
  assetSymbol: string;

  totalInvested: number;
  totalExpectedProfit: number;
  totalLockedBalance: number;
  activeBalance: number;

  activeInvestments: number;
  maturedInvestments: number;
}

export interface InvestmentSummary {
  totalInvested: number;
  totalExpectedProfit: number;
  totalLockedBalance: number;
  activeBalance: number;
  activeInvestments: number;
  maturedInvestments: number;
  assetSymbol: string;
}

export interface Pagination {
  page: number;
  page_size: number;
  total: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  assetType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssetNetwork {
  id: string;
  assetId: string;
  network: string;
  depositAddress: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  assetId: string;
  networkId: string;
  walletAddress: string;
  label: string;
  isDefault?: boolean;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assetSymbol?: string;
  assetName?: string;
  networkName?: string;
  companyDepositAddress?: string;
}

export interface DepositAddress {
  assetId: string;
  assetSymbol: string;
  assetName: string;
  network: string;
  depositAddress: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  minimumAmount: number;
  durationDays: number;
  expectedReturnRate: number;
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  assetId: string;
  networkId: string;
  amount: number;
  expectedReturn: number;
  actualReturn: number;
  projectedValue: number;
  depositAddress: string;

  status: InvestmentStatus;

  startDate: string | null;
  maturityDate: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;

  planName?: string;
  durationDays?: number;
  expectedReturnRate?: number;
  riskLevel?: string;
  assetSymbol?: string;
  networkName?: string;
  image?: string;
}

export interface Deposit {
  id: string;

  investmentId: string;
  userId: string;
  planId: string;

  assetId: string;
  networkId: string;

  expectedAmount: number;
  receivedAmount: number;

  companyDepositAddress: string;
  senderAddress: string;

  txHash: string;
  proofUrl?: string;

  status:
    | 'PENDING'
    | 'VERIFYING'
    | 'CONFIRMED'
    | 'FAILED'
    | 'EXPIRED'
    | 'UNMATCHED';

  confirmations: number;
  requiredConfirmations: number;

  confirmedAt: string | null;
  failedAt: string | null;

  failureReason: string;

  createdAt: string;
  updatedAt: string;

  lastCheckedAt?: string | null;

  verificationAttempts?: number;

  blockNumber?: number;

  tokenContract?: string | null;

  paymentToken: string;

  swept?: boolean;
  sweptAt?: string | null;
  sweepTxHash?: string | null;
}

export interface PendingInvestmentDeposit {
  investment: Investment;
  deposit: Deposit;
}

export interface PendingInvestmentDepositListResponse {
  pending: PendingInvestmentDeposit[];
}

export interface DepositListResponse {
  deposits: Deposit[];
  pagination: Pagination;
}

export interface LedgerAccount {
  id: string;
  userId: string;
  assetId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  accountId: string;
  userId: string;
  assetId: string;
  transactionType:
    | 'DEPOSIT'
    | 'WITHDRAWAL'
    | 'INVESTMENT'
    | 'EARNING'
    | 'BONUS'
    | 'BONUS_UNLOCKED';
  amount: number;
  balanceAfter: number;
  referenceId: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  isBonus: boolean;
  isLocked: boolean;
  lockedUntil: string | null;
  unlockedAt: string | null;
  createdAt: string;
}

export interface BonusCondition {
  id: string;
  userId: string;
  bonusEntryId: string;
  conditionType: string;
  isMet: boolean;
  metAt: string | null;
  createdAt: string;
}


// withdrawal types
export type WithdrawalStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'BROADCAST'
  | 'CONFIRMING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface CreateWithdrawalRequest {
  amount: number;
  pin: string;
  idempotency_key: string;
}

export interface Withdrawal {
  id: string;

  userId: string;
  assetId: string;
  networkId: string;

  withdrawalWalletId: string;
  destinationAddress: string;

  amount: number;
  fee: number;
  netAmount: number;

  status: WithdrawalStatus;

  idempotencyKey: string;

  txHash?: string | null;

  confirmations: number;
  requiredConfirmations: number;

  failureReason?: string | null;

  createdAt: string;
  updatedAt: string;

  broadcastAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  cancelledAt?: string | null;
}


// investment types
export type InvestmentStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'MATURED'
  | 'WITHDRAWN'
  | 'CANCELLED';

export interface PaymentWallet {
  id: string;
  address: string;
  network: string;
  label: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'EARNING';
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description: string;
  date: string;
  reference?: string;
  walletId?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  discount?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  startDate?: string;
  endDate?: string;
}

export interface TeamMemberInvestment {
  id: string;
  userId: string;
  name: string;
  email?: string;
  avatar?: string;
  amount: number;
  status?: InvestmentStatus;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: 'employee' | 'admin' | 'superadmin';
  verified: boolean;
  createdAt: string;
  updatedAt: string;

  avatar?: string;
  wallets: PaymentWallet[];
  transactions: PaymentTransaction[];
}



// -----------------------------------------------------------------------------
// Account Deposits
// -----------------------------------------------------------------------------

export type AccountDepositStatus =
  | 'PENDING'
  | 'VERIFYING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'EXPIRED'
  | 'UNMATCHED';

export interface AccountDepositAddress {
  id: string;
  userId: string;
  assetId: string;
  networkId: string;
  derivationIndex: number;
  depositAddress: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response returned when an account deposit is prepared.
 *
 * IMPORTANT:
 * This is NOT an AccountDeposit.
 * A prepared deposit may not have received funds yet and therefore
 * should not be treated as the final deposit record.
 */
export interface PrepareAccountDepositResponse {
  id: string;
  userId: string;
  accountDepositAddressId: string;
  assetId: string;
  networkId: string;

  expectedAmount: number;

  companyDepositAddress: string;

  status: AccountDepositStatus;

  createdAt: string;
  updatedAt: string;
}

/**
 * Request used to create/prepare an account deposit.
 */
export interface PrepareAccountDepositRequest {
  assetId: string;
  networkId: string;
  amount: number;
}

/**
 * Final account deposit record.
 */
export interface AccountDeposit {
  id: string;
  userId: string;
  accountDepositAddressId: string;

  assetId: string;
  networkId: string;

  expectedAmount: number;
  receivedAmount: number;

  companyDepositAddress: string;
  senderAddress: string;

  txHash: string;

  status: AccountDepositStatus;

  confirmations: number;
  requiredConfirmations: number;

  blockNumber: number | null;
  tokenContract: string | null;

  confirmedAt: string | null;
  failedAt: string | null;

  failureReason: string;

  lastCheckedAt: string | null;

  verificationAttempts: number;

  verificationLockUntil?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AccountDepositListResponse {
  deposits: AccountDeposit[];
  pagination: Pagination;
}

