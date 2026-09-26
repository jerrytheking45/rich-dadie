
// src/lib/api/ledger.ts
import api from './api';
import type {  LedgerEntry, BonusCondition } from '../types/investment';
import { toCamelCase } from './utils';

export const ledgerApi = {
  getBalance: async (assetId: string): Promise<number> => {
    const response = await api.get(`/ledger/balance?asset_id=${assetId}`);
    return response.data.balance;
  },

  getEntries: async (page = 1, pageSize = 20): Promise<{ entries: LedgerEntry[]; total: number }> => {
    const response = await api.get('/ledger/entries', {
      params: { page, page_size: pageSize },
    });
    const data = response.data;
    return {
      entries: toCamelCase<LedgerEntry[]>(data.entries),
      total: data.pagination.total,
    };
  },

  getBonusStatus: async (): Promise<BonusCondition[]> => {
    const response = await api.get('/ledger/bonus');
    return toCamelCase<BonusCondition[]>(response.data);
  },
};