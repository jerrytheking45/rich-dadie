
// src/hooks/useAdminDashboard.ts

'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { adminService } from '../lib/services/adminService';

import type {
  AdminDashboardStats,
} from '@/src/lib/types/admin';

interface UseAdminDashboardResult {
  data: AdminDashboardStats | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

export function useAdminDashboard(): UseAdminDashboardResult {
  const [data, setData] =
    useState<AdminDashboardStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const result =
        await adminService.getDashboardStats();

      setData(result);
    } catch (error) {
      console.error(
        'Failed to load admin dashboard:',
        error,
      );

      setError(
        'Failed to load dashboard statistics.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadInitialDashboard = async () => {
      try {
        setError('');

        const result =
          await adminService.getDashboardStats();

        if (cancelled) {
          return;
        }

        setData(result);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load admin dashboard:',
          error,
        );

        setError(
          'Failed to load dashboard statistics.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
  };
}