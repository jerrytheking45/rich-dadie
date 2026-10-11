
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
} from "lucide-react";

import { useAuth } from "@/src/components/AuthProvider";

import {
  activityApi,
  type TransactionActivity,
} from "@/src/lib/api/activity";

const FETCH_INTERVAL = 60_000;
const DISPLAY_INTERVAL = 7_000;
const TRANSITION_DELAY = 350;

function formatAmount(
  amount: number,
  symbol: string
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${symbol}`;
}

function formatActivityTime(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  );

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function formatUserName(name: string): string {
  const cleanName = name.trim();

  if (!cleanName) return "A user";

  const parts = cleanName.split(/\s+/);

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
}

function activitiesEqual(
  current: TransactionActivity[],
  next: TransactionActivity[]
): boolean {
  return (
    current.length === next.length &&
    current.every((item, index) => {
      const nextItem = next[index];

      return (
        Boolean(nextItem) &&
        item.activity_at === nextItem.activity_at &&
        item.user_name === nextItem.user_name &&
        item.activity_type === nextItem.activity_type &&
        item.amount === nextItem.amount &&
        item.asset_symbol === nextItem.asset_symbol
      );
    })
  );
}

export default function TransactionActivityToast() {
  const { user, loading: authLoading } = useAuth();

  const [activities, setActivities] = useState<
    TransactionActivity[]
  >([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  /* ==========================================
     FETCH TRANSACTION ACTIVITY
  ========================================== */

  const loadActivities = useCallback(async () => {
    if (!user) return;

    try {
      const data = await activityApi.list(20);

      setActivities((current) =>
        activitiesEqual(current, data) ? current : data
      );
    } catch {
      // Activity notifications are non-critical.
    }
  }, [user]);

  /* ==========================================
     INITIAL FETCH + BACKGROUND REFRESH
  ========================================== */

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;
    let requestInFlight = false;

    const fetchActivity = async () => {
      if (cancelled || requestInFlight) return;

      requestInFlight = true;

      try {
        await loadActivities();
      } finally {
        requestInFlight = false;
      }
    };

    const initialTimer = window.setTimeout(() => {
      void fetchActivity();
    }, 0);

    const refreshInterval = window.setInterval(() => {
      void fetchActivity();
    }, FETCH_INTERVAL);

    return () => {
      cancelled = true;

      window.clearTimeout(initialTimer);
      window.clearInterval(refreshInterval);
    };
  }, [authLoading, user, loadActivities]);

  /* ==========================================
     INITIAL TOAST DISPLAY
  ========================================== */

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      activities.length === 0 ||
      dismissed
    ) {
      return;
    }

    const initialTimer = window.setTimeout(() => {
      setVisible(true);
    }, 0);

    return () => {
      window.clearTimeout(initialTimer);
    };
  }, [
    authLoading,
    user,
    activities.length,
    dismissed,
  ]);

  /* ==========================================
     ACTIVITY ROTATION
  ========================================== */

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      activities.length <= 1 ||
      dismissed
    ) {
      return;
    }

    let transitionTimer: number | undefined;

    const rotationInterval = window.setInterval(() => {
      // Hide the current activity.
      setVisible(false);

      // Change content after the exit transition.
      transitionTimer = window.setTimeout(() => {
        setCurrentIndex(
          (current) => (current + 1) % activities.length
        );

        setVisible(true);
      }, TRANSITION_DELAY);
    }, DISPLAY_INTERVAL);

    return () => {
      window.clearInterval(rotationInterval);

      if (transitionTimer !== undefined) {
        window.clearTimeout(transitionTimer);
      }
    };
  }, [
    authLoading,
    user,
    activities.length,
    dismissed,
  ]);

  const activity =
    activities[currentIndex % activities.length] ?? null;

  /*
   * Only show real API activity to authenticated users.
   * Never render this toast for logged-out visitors.
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
    activity.activity_type === "DEPOSIT";

  const activityLabel = isDeposit
    ? "deposited"
    : "withdrew";

  const activityTime = formatActivityTime(
    activity.activity_at
  );

  return (
    <div
      className={[
        "fixed bottom-20 left-3 z-50",
        "w-[calc(100%-1.5rem)] max-w-[320px]",
        "sm:bottom-6 sm:left-5",
        "transition-all duration-300 ease-out",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* MAIN NOTIFICATION */}
      <div
        className={[
          "relative overflow-hidden",
          "rounded-xl border border-white/10",
          "bg-[#0B1426]/95",
          "py-2.5 pl-3 pr-9",
          "shadow-[0_16px_45px_-15px_rgba(0,0,0,0.75)]",
          "backdrop-blur-xl",
          isDeposit
            ? "border-l-2 border-l-emerald-400"
            : "border-l-2 border-l-[#E60033]",
        ].join(" ")}
      >
        {/* SUBTLE BACKGROUND ACCENT */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -left-8 -top-8",
            "h-20 w-20 rounded-full blur-[35px]",
            isDeposit
              ? "bg-emerald-400/5"
              : "bg-[#E60033]/10",
          ].join(" ")}
        />

        {/* CONTENT */}
        <div className="relative flex min-w-0 items-center gap-2.5">

          {/* ACTIVITY ICON */}
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center",
              "rounded-lg border",
              isDeposit
                ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                : "border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]",
            ].join(" ")}
          >
            {isDeposit ? (
              <ArrowDownToLine
                size={16}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            ) : (
              <ArrowUpFromLine
                size={16}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            )}
          </div>

          {/* ACTIVITY INFORMATION */}
          <div className="min-w-0 flex-1">

            {/* User + action */}
            <div className="flex min-w-0 items-center gap-1.5">

              <span className="min-w-0 truncate text-[11px] font-bold leading-4 text-white">
                {formatUserName(activity.user_name)}
              </span>

              <span className="shrink-0 text-[10px] text-white/45">
                {activityLabel}
              </span>
            </div>

            {/* Amount + time */}
            <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">

              <span
                className={[
                  "min-w-0 text-[12px] font-black leading-4",
                  "tabular-nums",
                  isDeposit
                    ? "text-emerald-300"
                    : "text-[#FF476B]",
                ].join(" ")}
              >
                {formatAmount(
                  activity.amount,
                  activity.asset_symbol
                )}
              </span>

              {activityTime && (
                <span className="shrink-0 text-[9px] font-medium text-white/30">
                  • {activityTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* DISMISS BUTTON */}
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            setVisible(false);
          }}
          aria-label="Dismiss transaction activity"
          className={[
            "absolute right-1.5 top-1/2",
            "flex h-7 w-7 -translate-y-1/2",
            "items-center justify-center rounded-lg",
            "text-white/35 transition-colors",
            "hover:bg-white/5 hover:text-white",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-[#E60033]/60",
          ].join(" ")}
        >
          <X
            size={14}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>

        {/* DISPLAY-TIME PROGRESS LINE */}
        {visible && !dismissed && (
          <div
            key={`${currentIndex}-${activity.activity_at}`}
            aria-hidden="true"
            className={[
              "absolute bottom-0 left-0 h-0.5 w-full",
              "origin-left",
              "animate-[transactionToastProgress_7000ms_linear_forwards]",
              isDeposit
                ? "bg-emerald-400/70"
                : "bg-[#E60033]/80",
            ].join(" ")}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes transactionToastProgress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}