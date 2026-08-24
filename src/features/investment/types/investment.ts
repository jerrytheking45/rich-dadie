// src/features/investment/types/investment.ts

export type InvestmentStatus =
  | "ACTIVE"
  | "MATURED"
  | "PENDING"
  | "CANCELLED"
  | "WITHDRAWN";

export type InvestmentRisk =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface InvestmentPlan {
  id: string;
  name: string;
  /** Optional translation key for `name` – if provided, UI should use `t(plan.nameKey)` instead of `plan.name` */
  nameKey?: string;
  description: string;
  /** Optional translation key for `description` */
  descriptionKey?: string;
  image: string;

  minimumAmount: number;
  maximumAmount?: number;

  durationDays: number;

  expectedReturnRate: number;

  riskLevel: InvestmentRisk;

  status: "ACTIVE" | "INACTIVE";

  featured?: boolean;
}

export interface Investment {
  id: string;

  planId: string;
  planName: string;

  amount: number;

  expectedReturn: number;
  projectedValue: number;

  durationDays: number;

  startDate: string;
  maturityDate: string;

  progress: number;

  status: InvestmentStatus;

  image?: string;
}

export interface InvestmentSummary {
  totalInvested: number;
  currentValue: number;
  projectedEarnings: number;

  activeInvestments: number;
  maturedInvestments: number;
}

export interface TeamMemberInvestment {
  id: string;

  name: string;
  avatar?: string;

  planName: string;

  investedAmount: number;

  status: InvestmentStatus;
}

export interface Promotion {
  id: string;

  title: string;
  /** Optional translation key for `title` */
  titleKey?: string;
  description: string;
  /** Optional translation key for `description` */
  descriptionKey?: string;

  image: string;

  startDate: string;
  endDate: string;

  active: boolean;
}


export interface Wallet {
  id: string;
  address: string;
  network: 'ERC20' | 'BEP20' | 'TRC20' | 'SOLANA';
  label: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'EARNING';
  amount: number;          // in base currency (USDT)
  currency: string;       // e.g., 'USDT', 'BTC', 'ETH' (crypto or fiat code)
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description: string;
  date: string;
  reference?: string;      // transaction hash, bank reference, etc.
  walletId?: string;       // for withdrawals/deposits
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  avatar?: string;          // base64 or URL
  wallets: Wallet[];
  transactions: PaymentTransaction[];
}