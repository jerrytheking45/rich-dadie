'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { investmentApi } from '@/src/lib/api/investmentApi';
import type {
  PendingInvestmentDeposit,
} from '@/src/lib/types/investment';

export function usePendingInvestmentDeposits() {
  const [pendingInvestments, setPendingInvestments] =
    useState<PendingInvestmentDeposit[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadPendingInvestments = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setLoading(true);
      }

      setError(null);

      try {
        const data =
          await investmentApi.getPendingInvestmentDeposits();

        setPendingInvestments(data);
      } catch (err) {
        console.error(
          'Failed to load pending investment deposits:',
          err,
        );

        setError(
          'Failed to load pending investment deposits.',
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void (async () => {
      try {
        const data =
          await investmentApi.getPendingInvestmentDeposits();

        setPendingInvestments(data);
        setError(null);
      } catch (err) {
        console.error(
          'Failed to load pending investment deposits:',
          err,
        );

        setError(
          'Failed to load pending investment deposits.',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    pendingInvestments,
    loading,
    error,
    refresh: loadPendingInvestments,
  };
}
