
// src/components/NotificationBell.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import {
  notificationApi,
  type Notification,
} from '@/src/lib/api/notification';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] =
    useState(0);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  const fetchUnreadCount = async () => {
    try {
      const count =
        await notificationApi.getUnreadCount();

      setUnreadCount(count);
    } catch {
      // Ignore notification polling errors.
    }
  };

  /*
   * Always prioritize:
   *
   * 1. Unread notifications
   * 2. Newest unread notifications
   * 3. Read notifications
   * 4. Newest read notifications
   *
   * This is intentionally enforced on the frontend as well
   * as relying on the backend ordering.
   */
  const sortNotifications = (
    items: Notification[],
  ): Notification[] => {
    return [...items].sort((a, b) => {
      const aUnread = !a.isRead;
      const bUnread = !b.isRead;

      // Unread always comes before read.
      if (aUnread !== bUnread) {
        return aUnread ? -1 : 1;
      }

      // Within the same read/unread group,
      // newest notification comes first.
      const aTime = new Date(
        a.createdAt,
      ).getTime();

      const bTime = new Date(
        b.createdAt,
      ).getTime();

      return bTime - aTime;
    });
  };

  const fetchRecentNotifications =
    async () => {
      setLoading(true);

      try {
        const data =
          await notificationApi.getNotifications(
            1,
            20,
          );

        const sortedNotifications =
          sortNotifications(
            data.notifications ?? [],
          );

        /*
         * Keep unread/new notifications at the top
         * regardless of the order returned by the API.
         */
        setNotifications(
          sortedNotifications.slice(0, 5),
        );

        /*
         * Refresh the count at the same time so
         * the badge remains authoritative.
         */
        void fetchUnreadCount();
      } catch {
        // Ignore notification loading errors.
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void fetchUnreadCount();
      }, 0);

    const interval =
      window.setInterval(() => {
        void fetchUnreadCount();
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
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowDropdown(false);
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
   * Close dropdown on Escape.
   */
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, []);

  const handleBellClick = () => {
    setShowDropdown((prev) => {
      const next = !prev;

      if (next) {
        void fetchRecentNotifications();
      }

      return next;
    });
  };

  const markAsRead = async (
    id: string,
  ) => {
    try {
      await notificationApi.markAsRead(id);

      setNotifications((prev) =>
        sortNotifications(
          prev.map((notification) =>
            notification.id === id
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification,
          ),
        ),
      );

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0),
      );
    } catch {
      // Ignore.
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();

      setNotifications((prev) =>
        sortNotifications(
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        ),
      );

      setUnreadCount(0);
    } catch {
      // Ignore.
    }
  };

  const hasUnreadNotifications =
    notifications.some(
      (notification) =>
        !notification.isRead,
    );

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        onClick={handleBellClick}
        className={[
          'group relative flex h-10 w-10',
          'items-center justify-center',
          'shadow-sm',
          'transition-all duration-200',
          'hover:-translate-y-0.5',
          'hover:border-emerald-200',
          'hover:text-emerald-600',
          'hover:shadow-md',
          'active:scale-95',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-emerald-500/30',
          'focus:ring-offset-2',
        ].join(' ')}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        aria-expanded={showDropdown}
        aria-haspopup="menu"
      >
        <Bell
          size={18}
          aria-hidden="true"
          className={[
            'transition-transform duration-200',
            unreadCount > 0
              ? 'group-hover:rotate-[-8deg]'
              : '',
          ].join(' ')}
        />

        {unreadCount > 0 && (
          <span
            className={[
              'absolute -right-1 -top-1',
              'flex min-h-5 min-w-5',
              'items-center justify-center',
              'rounded-full border-2 border-white',
              'bg-red-500 px-1',
              'text-[9px] font-bold leading-none text-white',
              'shadow-sm',
              'animate-in fade-in zoom-in-75 duration-200',
            ].join(' ')}
          >
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div
          className={[
            'absolute right-0 z-50 mt-3',
            'w-[min(20rem,calc(100vw-2rem))]',
            'overflow-hidden',
            'rounded-2xl border border-slate-200',
            'bg-white',
            'shadow-xl shadow-slate-900/10',
            'animate-in fade-in slide-in-from-top-2',
            'duration-200',
          ].join(' ')}
          role="menu"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                <Bell
                  size={15}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Notifications
                </p>

                {unreadCount > 0 && (
                  <p className="text-[11px] text-slate-400">
                    {unreadCount}{' '}
                    unread
                  </p>
                )}
              </div>
            </div>

            {hasUnreadNotifications && (
              <button
                type="button"
                onClick={() =>
                  void markAllAsRead()
                }
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 transition hover:text-emerald-700"
              >
                <CheckCheck
                  size={14}
                />
                Mark all read
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Loading notifications...
              </div>
            </div>
          ) : notifications.length ===
            0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center px-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Bell
                  size={18}
                  className="text-slate-400"
                />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700">
                You are all caught up
              </p>

              <p className="mt-1 text-xs text-slate-400">
                No notifications yet.
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(
                (notification) => (
                  <button
                    key={
                      notification.id
                    }
                    type="button"
                    onClick={() =>
                      void markAsRead(
                        notification.id,
                      )
                    }
                    className={[
                      'w-full border-b',
                      'border-slate-100 px-4 py-3',
                      'text-left transition',
                      'hover:bg-slate-50',
                      'focus:bg-slate-50',
                      'focus:outline-none',
                      !notification.isRead
                        ? 'bg-emerald-50/50'
                        : 'bg-white',
                    ].join(' ')}
                    role="menuitem"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={[
                          'mt-0.5 h-2 w-2',
                          'shrink-0 rounded-full',
                          !notification.isRead
                            ? 'bg-emerald-500'
                            : 'bg-transparent',
                        ].join(' ')}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {
                            notification.title
                          }
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                          {
                            notification.message
                          }
                        </p>

                        <p className="mt-1.5 text-[10px] text-slate-400">
                          {new Date(
                            notification.createdAt,
                          ).toLocaleDateString(
                            'en-UG',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <span className="mt-1 shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                          New
                        </span>
                      )}
                    </div>
                  </button>
                ),
              )}
            </div>
          )}

          {/* Footer */}
          {!loading &&
            notifications.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/70 p-2.5 text-center">
                <Link
                  href="/investment/profile/notifications"
                  onClick={() =>
                    setShowDropdown(
                      false,
                    )
                  }
                  className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  View all notifications
                </Link>
              </div>
            )}
        </div>
      )}
    </div>
  );
}