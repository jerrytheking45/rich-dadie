'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
} from 'lucide-react';

import { useAuth } from '@/src/components/AuthProvider';
import {
  activityApi,
  type TransactionActivity,
} from '@/src/lib/api/activity';

const FETCH_INTERVAL = 60_000;
const DISPLAY_INTERVAL = 7_000;
const TRANSITION_DELAY = 350;
const INITIAL_FETCH_DELAY = 0;

function formatAmount(
  amount: number,
  symbol: string,
): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${symbol}`;
}

function formatActivityTime(
  dateString: string,
): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const seconds = Math.floor(
    (Date.now() - date.getTime()) / 1000,
  );

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

function formatUserName(name: string): string {
  const cleanName = name.trim();

  if (!cleanName) {
    return 'A user';
  }

  const parts = cleanName.split(/\s+/);

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
}

export default function TransactionActivityToast() {
  const { user, loading: authLoading } = useAuth();

  const [activities, setActivities] = useState<
    TransactionActivity[]
  >([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const loadActivities = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const data = await activityApi.list(20);

      setActivities((current) => {
        const unchanged =
          current.length === data.length &&
          current.every((item, index) => {
            const next = data[index];

            if (!next) {
              return false;
            }

            return (
              item.activity_at === next.activity_at &&
              item.user_name === next.user_name &&
              item.activity_type === next.activity_type &&
              item.amount === next.amount &&
              item.asset_symbol === next.asset_symbol
            );
          });

        return unchanged ? current : data;
      });
    } catch {
      // Transaction activity is non-critical.
    }
  }, [user]);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;

    const initialTimer = window.setTimeout(() => {
      if (!cancelled) {
        void loadActivities();
      }
    }, INITIAL_FETCH_DELAY);

    const interval = window.setInterval(() => {
      if (!cancelled) {
        void loadActivities();
      }
    }, FETCH_INTERVAL);

    return () => {
      cancelled = true;
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [authLoading, user, loadActivities]);

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      activities.length === 0 ||
      dismissed
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex(
        (current) => current % activities.length,
      );

      setVisible(true);
    }, INITIAL_FETCH_DELAY);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    authLoading,
    user,
    activities.length,
    dismissed,
  ]);

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      activities.length === 0 ||
      dismissed
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setVisible(false);

      window.setTimeout(() => {
        setCurrentIndex(
          (current) =>
            (current + 1) % activities.length,
        );

        setVisible(true);
      }, TRANSITION_DELAY);
    }, DISPLAY_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    authLoading,
    user,
    activities.length,
    dismissed,
  ]);

  const activity = useMemo(
    () => activities[currentIndex] ?? null,
    [activities, currentIndex],
  );

  /*
   * Important:
   * This component is completely absent for logged-out visitors.
   */
  if (
    authLoading ||
    !user ||
    !activity ||
    dismissed
  ) {
    return null;
  }

  const isDeposit =
    activity.activity_type === 'DEPOSIT';

  return (
    <div
      className={[
        'fixed bottom-24 left-4 z-50',
        'w-[calc(100%-2rem)] max-w-85',
        'transition-all duration-300 ease-out',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <div
        className={[
          'relative overflow-hidden',
          'rounded-[18px]',
          'border border-white/10',
          'bg-[#0B1426]/95',
          'px-3 py-3 pr-9',
          'shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)]',
          'backdrop-blur-2xl',
          isDeposit
            ? 'border-l-2 border-l-emerald-400'
            : 'border-l-2 border-l-[#F7C948]',
        ].join(' ')}
      >
        <div className="flex items-center">
          <div
            className={[
              'flex h-9 w-9 shrink-0 items-center justify-center',
              'rounded-xl border',
              isDeposit
                ? 'border-emerald-300/10 bg-emerald-300/10 text-emerald-300'
                : 'border-[#F7C948]/10 bg-[#F7C948]/10 text-[#F7C948]',
            ].join(' ')}
          >
            {isDeposit ? (
              <ArrowDownToLine
                className="h-4 w-4"
                strokeWidth={2.3}
              />
            ) : (
              <ArrowUpFromLine
                className="h-4 w-4"
                strokeWidth={2.3}
              />
            )}
          </div>

          <div className="ml-3 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="truncate text-[11px] font-bold leading-4 text-white">
                {formatUserName(activity.user_name)}
              </span>

              <span className="shrink-0 text-[10px] text-white/35">
                {isDeposit ? 'deposited' : 'withdrew'}
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-2">
              <span
                className={[
                  'text-[12px] font-black leading-4',
                  isDeposit
                    ? 'text-emerald-300'
                    : 'text-[#F7C948]',
                ].join(' ')}
              >
                {formatAmount(
                  activity.amount,
                  activity.asset_symbol,
                )}
              </span>

              <span className="text-[9px] font-medium text-white/25">
                • {formatActivityTime(activity.activity_at)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setDismissed(true);
          }}
          className="
            absolute right-2 top-1/2
            flex h-6 w-6
            -translate-y-1/2
            items-center justify-center
            rounded-full
            text-white/25
            transition
            hover:bg-white/5
            hover:text-white
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-emerald-400
          "
          aria-label="Dismiss transaction activity"
        >
          <X
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
        </button>

        <div
          className={[
            'absolute bottom-0 left-0 h-0.5',
            'transition-all duration-7000 ease-linear',
            visible ? 'w-full' : 'w-0',
            isDeposit
              ? 'bg-emerald-400/70'
              : 'bg-[#F7C948]/60',
          ].join(' ')}
        />
      </div>
    </div>
  );
}