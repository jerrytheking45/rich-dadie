// src/lib/api/index.ts
export { default as api } from './api';
export { authApi } from './auth';
export { investmentApi } from './investmentApi';
export { walletApi } from './wallet';
export { ledgerApi } from './ledger';
export type { LoginRequest, LoginResponse, RegisterRequest } from './auth';
export type { CreateInvestmentRequest, InvestmentListResponse, DepositListResponse } from './investmentApi';
export { platformSettingsApi } from './platformSettings';