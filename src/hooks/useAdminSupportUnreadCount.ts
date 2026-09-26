
// src/hooks/useAdminSupportUnreadCount.ts
'use client';

import { useCallback, useEffect, useState } from 'react';

import { adminSupportApi } from '@/src/lib/api/adminSupport';

interface UseAdminSupportUnreadCountResult {
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAdminSupportUnreadCount(): UseAdminSupportUnreadCountResult {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await adminSupportApi.getUnreadSupportCount();

      setUnreadCount(
        Math.max(
          0,
          Number(response.unread_count ?? 0),
        ),
      );
    } catch (error) {
      console.error(
        'Failed to load admin support unread count:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    const interval = window.setInterval(() => {
      void refresh();
    }, 15000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [refresh]);

  return {
    unreadCount,
    loading,
    refresh,
  };
}