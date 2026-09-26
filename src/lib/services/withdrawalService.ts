
// src/lib/services/withdrawalService.ts

import { withdrawalRepository } from '@/src/lib/repositories/withdrawalRepository';
import { generateWithdrawalIdempotencyKey } from './withdrawalIdempotency';
import { getWithdrawalErrorMessage } from './withdrawalError';

import type {
  CreateWithdrawalRequest,
  Withdrawal,
} from '@/src/lib/types/investment';

export interface SubmitWithdrawalInput {
  amount: number;
  pin: string;
}

function validateWithdrawalInput(
  input: SubmitWithdrawalInput,
): void {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('Enter a valid withdrawal amount.');
  }

  if (!input.pin.trim()) {
    throw new Error('Enter your wallet PIN.');
  }
}

export const withdrawalService = {
  create: async (
    input: SubmitWithdrawalInput,
  ): Promise<Withdrawal> => {
    validateWithdrawalInput(input);

    const request: CreateWithdrawalRequest = {
      amount: input.amount,
      pin: input.pin,
      idempotency_key:
        generateWithdrawalIdempotencyKey(),
    };

    try {
      return await withdrawalRepository.create(request);
    } catch (error) {
      throw new Error(
        getWithdrawalErrorMessage(error),
      );
    }
  },

  getById: async (
    withdrawalId: string,
  ): Promise<Withdrawal> => {
    if (!withdrawalId.trim()) {
      throw new Error('Withdrawal ID is required.');
    }

    try {
      return await withdrawalRepository.getById(
        withdrawalId,
      );
    } catch (error) {
      throw new Error(
        getWithdrawalErrorMessage(error),
      );
    }
  },
};

