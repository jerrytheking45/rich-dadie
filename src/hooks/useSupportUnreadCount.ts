
// src/hooks/useSupportUnreadCount.ts

'use client';

import { useCallback, useEffect, useState } from 'react';

import { supportApi } from '@/src/lib/api/support';
import {
  SUPPORT_UNREAD_CHANGED_EVENT,
} from '@/src/lib/support/supportUnreadEvents';

interface UseSupportUnreadCountResult {
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useSupportUnreadCount(): UseSupportUnreadCountResult {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response =
        await supportApi.getUnreadCount();

      setUnreadCount(
        Math.max(
          0,
          Number(response.unread_count ?? 0),
        ),
      );
    } catch (error) {
      console.error(
        'Failed to load support unread count:',
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

    const handleUnreadChanged = () => {
      void refresh();
    };

    window.addEventListener(
      SUPPORT_UNREAD_CHANGED_EVENT,
      handleUnreadChanged,
    );

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);

      window.removeEventListener(
        SUPPORT_UNREAD_CHANGED_EVENT,
        handleUnreadChanged,
      );
    };
  }, [refresh]);

  return {
    unreadCount,
    loading,
    refresh,
  };
}