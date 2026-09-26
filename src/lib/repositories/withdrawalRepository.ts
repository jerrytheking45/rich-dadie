// src/lib/repositories/withdrawalRepository.ts

import { withdrawalApi } from '@/src/lib/api/withdrawal';

import type {
  CreateWithdrawalRequest,
  Withdrawal,
} from '@/src/lib/types/investment';

export const withdrawalRepository = {
  create: async (
    data: CreateWithdrawalRequest,
  ): Promise<Withdrawal> => {
    return withdrawalApi.createWithdrawal(data);
  },

  getById: async (
    withdrawalId: string,
  ): Promise<Withdrawal> => {
    return withdrawalApi.getWithdrawal(withdrawalId);
  },
};