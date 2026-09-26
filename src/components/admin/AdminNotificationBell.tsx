'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  CircleAlert,
  CircleCheck,
  Clock3,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

import {
  notificationApi,
  type Notification,
} from '@/src/lib/api/notification';

import {
  getNotificationTarget,
} from '@/src/lib/utils/adminNotificationNavigation';

function getNotificationIcon(type: string) {
  const normalizedType =
    type.toLowerCase();

  if (
    normalizedType === 'ticket_created' ||
    normalizedType === 'support_ticket_created' ||
    normalizedType === 'new_ticket' ||
    normalizedType.includes('ticket')
  ) {
    return MessageCircle;
  }

  switch (normalizedType) {
    case 'deposit_confirmed':
    case 'deposit_credited':
      return CircleCheck;

    case 'deposit_failed':
    case 'deposit_rejected':
      return CircleAlert;

    case 'deposit_submitted':
    case 'investment_created':
    case 'withdrawal_requested':
    case 'withdrawal_processing':
    case 'withdrawal_broadcast':
    case 'withdrawal_confirming':
      return Clock3;

    case 'withdrawal_completed':
      return CircleCheck;

    case 'withdrawal_failed':
    case 'withdrawal_rejected':
    case 'withdrawal_cancelled':
      return CircleAlert;

    default:
      return Bell;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AdminNotificationBell() {
  const router = useRouter();

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [navigatingId, setNavigatingId] =
    useState<string | null>(null);

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Load unread notification count.
   */
  const loadUnreadCount = async () => {
    try {
      const count =
        await notificationApi.getUnreadCount();

      setUnreadCount(count);
    } catch {
      /*
       * Notifications must never break
       * the administrator interface.
       */
    }
  };

  /*
   * Load the five most recent notifications
   * for the dropdown.
   */
  const loadRecentNotifications =
    async () => {
      setLoading(true);

      try {
        const response =
          await notificationApi.getNotifications(
            1,
            5,
          );

        setNotifications(
          response.notifications,
        );
      } catch {
        /*
         * Ignore dropdown loading failures.
         */
      } finally {
        setLoading(false);
      }
    };

  /*
   * Initial unread count + polling.
   */
  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadUnreadCount();
      }, 0);

    const interval =
      window.setInterval(() => {
        void loadUnreadCount();
      }, 30000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  /*
   * Open / close notification dropdown.
   */
  const handleOpen = () => {
    setOpen((current) => {
      const next = !current;

      if (next) {
        void loadRecentNotifications();
      }

      return next;
    });
  };

  /*
   * Mark one notification as read.
   *
   * The unread counter is only decremented
   * when the notification was actually unread.
   */
  const markAsRead = async (
    notification: Notification,
  ) => {
    if (notification.isRead) {
      return true;
    }

    try {
      await notificationApi.markAsRead(
        notification.id,
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                isRead: true,
              }
            : item,
        ),
      );

      setUnreadCount((current) =>
        Math.max(current - 1, 0),
      );

      return true;
    } catch {
      /*
       * Read-state failure must not break
       * navigation.
       */
      return false;
    }
  };

  /*
   * Notification click behavior.
   *
   * Only supported resource notifications
   * navigate:
   *
   * deposit    -> /admin/deposits/:id
   * withdrawal -> /admin/withdrawals/:id
   * support    -> /admin/support/tickets/:id
   *
   * Other notifications have no destination.
   */
  const handleNotificationClick =
    async (
      notification: Notification,
    ) => {
      const target =
        getNotificationTarget(
          notification,
        );

      /*
       * Prevent duplicate clicks while
       * navigation/read state is processing.
       */
      setNavigatingId(notification.id);

      try {
        await markAsRead(notification);

        /*
         * Close dropdown regardless of whether
         * the notification has a destination.
         */
        setOpen(false);

        /*
         * Only supported notification types
         * have a target.
         */
        if (target) {
          router.push(target);
        }
      } finally {
        setNavigatingId(null);
      }
    };

  /*
   * Mark all currently loaded notifications
   * as read.
   */
  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch {
      /*
       * Ignore.
       */
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Bell button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Administrator notifications"
        aria-expanded={open}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
          open
            ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.08)]'
            : 'border-white/10 bg-white/5 text-white/55 hover:border-white/15 hover:bg-white/8 hover:text-white'
        }`}
      >
        <Bell
          size={19}
          aria-hidden="true"
        />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#07101F] bg-red-500 px-1 text-[9px] font-bold text-white shadow-[0_0_12px_rgba(239,68,68,0.35)]">
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-90 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 bg-white/2.5 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-white/35">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : 'All caught up'}
              </p>
            </div>

            {notifications.some(
              (notification) =>
                !notification.isRead,
            ) && (
              <button
                type="button"
                onClick={() =>
                  void markAllAsRead()
                }
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-2 py-1 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/10"
              >
                <Check size={13} />
                Mark all
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="max-h-100 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-white/35">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
                <p className="mt-3">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length ===
              0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/5">
                  <Bell
                    size={22}
                    className="text-white/25"
                  />
                </div>

                <p className="mt-3 text-sm font-medium text-white/65">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-white/30">
                  New platform activity will appear here.
                </p>
              </div>
            ) : (
              notifications.map(
                (notification) => {
                  const Icon =
                    getNotificationIcon(
                      notification.type,
                    );

                  const target =
                    getNotificationTarget(
                      notification,
                    );

                  const navigating =
                    navigatingId ===
                    notification.id;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() =>
                        void handleNotificationClick(
                          notification,
                        )
                      }
                      disabled={navigating}
                      className={`group block w-full border-b border-white/6 p-4 text-left transition last:border-b-0 ${
                        !notification.isRead
                          ? 'bg-emerald-400/4.5 hover:bg-emerald-400/[0.07]'
                          : 'bg-transparent hover:bg-white/2.5'
                      } disabled:cursor-wait`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                            !notification.isRead
                              ? 'border-emerald-400/15 bg-emerald-400/10 text-emerald-300'
                              : 'border-white/8 bg-white/5 text-white/35'
                          }`}
                        >
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white/80">
                                {notification.title}
                              </p>

                              {!notification.isRead && (
                                <span className="mt-1 inline-flex rounded-full border border-emerald-400/10 bg-emerald-400/8 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-300">
                                  New
                                </span>
                              )}
                            </div>

                            {target && (
                              <ExternalLink
                                size={14}
                                className="mt-0.5 shrink-0 text-white/20 transition group-hover:text-emerald-300"
                              />
                            )}
                          </div>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">
                            {notification.message}
                          </p>

                          <p className="mt-1 text-[10px] text-white/25">
                            {formatDate(
                              notification.createdAt,
                            )}
                          </p>

                          {/* Resource hint */}
                          {target && (
                            <p className="mt-2 text-[10px] font-medium text-emerald-300/80">
                              Open related item →
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                },
              )
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/8 bg-white/2 p-3 text-center">
            <Link
              href="/admin/notifications"
              onClick={() =>
                setOpen(false)
              }
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              View all notifications
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}