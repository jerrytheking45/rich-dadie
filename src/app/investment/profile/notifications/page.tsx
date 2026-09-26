
// src/app/investment/profile/notifications/page.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Sparkles,
} from 'lucide-react';

import { useAuth } from '@/src/components/AuthProvider';
import {
  notificationApi,
  type Notification,
} from '@/src/lib/api/notification';
import InvestmentBottomNav from '@/src/components/InvestmentBottomNav';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  /*
   * Notification priority:
   *
   * 1. Unread notifications first
   * 2. Newest unread first
   * 3. Read notifications afterward
   * 4. Newest read first
   */
  const sortNotifications = (
    items: Notification[],
  ): Notification[] => {
    return [...items].sort((a, b) => {
      const aUnread = !a.isRead;
      const bUnread = !b.isRead;

      if (aUnread !== bUnread) {
        return aUnread ? -1 : 1;
      }

      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();

      return bTime - aTime;
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadNotifications = async () => {
      try {
        const data =
          await notificationApi.getNotifications(1, 50);

        const notificationList =
          data.notifications ?? [];

        setNotifications(
          sortNotifications(notificationList),
        );

        setError('');
      } catch {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    const timer = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isAuthenticated, router]);

  const handleMarkRead = async (id: string) => {
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
    } catch {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
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
    } catch {
      setError('Failed to mark notifications as read');
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Delete this notification?',
      )
    ) {
      return;
    }

    try {
      await notificationApi.deleteNotification(id);

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification.id !== id,
        ),
      );
    } catch {
      setError('Failed to delete notification');
    }
  };

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.isRead,
      ).length,
    [notifications],
  );

  const formatNotificationDate = (
    createdAt: string,
  ): string => {
    return new Date(createdAt).toLocaleString(
      'en-UG',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      },
    );
  };

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050B18] text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="absolute -left-40 top-[38%] h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-6">
          <div className="flex flex-col items-center text-center">
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                border border-white/8
                bg-[#0B1426]
                shadow-xl shadow-black/20
              "
            >
              <Bell
                size={22}
                className="animate-pulse text-emerald-400"
              />
            </div>

            <p className="mt-4 text-xs font-semibold text-white/70">
              Loading notifications
            </p>

            <p className="mt-1 text-[10px] text-white/35">
              Please wait a moment...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute -left-40 top-[38%] h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        <div className="mx-auto w-full max-w-3xl pb-24">

          {/* Header */}
          <section className="mb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="
                    relative flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-2xl
                    border border-emerald-400/15
                    bg-emerald-500/10
                  "
                >
                  <Bell
                    size={19}
                    className="text-emerald-400"
                  />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute -right-1 -top-1
                        flex h-5 min-w-5
                        items-center justify-center
                        rounded-full
                        border-2 border-[#050B18]
                        bg-emerald-500
                        px-1
                        text-[9px]
                        font-black
                        text-[#04110C]
                      "
                    >
                      {unreadCount > 99
                        ? '99+'
                        : unreadCount}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                    Account updates
                  </p>

                  <h1 className="mt-1 text-[20px] font-black tracking-tight text-white">
                    Notifications
                  </h1>

                  <p className="mt-0.5 text-[10px] text-white/40">
                    {unreadCount > 0
                      ? `${unreadCount} unread ${
                          unreadCount === 1
                            ? 'notification'
                            : 'notifications'
                        }`
                      : 'You are all caught up'}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    void handleMarkAllRead()
                  }
                  className="
                    inline-flex h-10
                    items-center justify-center gap-2
                    rounded-xl
                    border border-emerald-400/15
                    bg-emerald-500/10
                    px-4
                    text-[10px]
                    font-bold
                    text-emerald-300
                    transition
                    hover:border-emerald-400/25
                    hover:bg-emerald-500/15
                    active:scale-[0.98]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-emerald-400/60
                  "
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>
              )}
            </div>
          </section>

          {/* Summary hero */}
          <section
            className="
              mb-5
              overflow-hidden
              rounded-[28px]
              border border-white/8
              bg-linear-to-br
              from-[#101D33]
              via-[#0B1426]
              to-[#11102B]
              p-5
              shadow-xl shadow-black/10
              sm:p-6
            "
          >
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="
                      flex h-7 w-7
                      items-center justify-center
                      rounded-lg
                      bg-purple-400/10
                    "
                  >
                    <Sparkles
                      size={13}
                      className="text-purple-300"
                    />
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-purple-300">
                    Notification center
                  </span>
                </div>

                <h2 className="text-[15px] font-bold text-white">
                  Stay up to date
                </h2>

                <p className="mt-1.5 max-w-xl text-[10px] leading-5 text-white/45">
                  Important account, investment, transaction,
                  and platform updates will appear here.
                </p>
              </div>

              <div
                className="
                  hidden h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-2xl
                  border border-white/8
                  bg-white/4
                  sm:flex
                "
              >
                <Bell
                  size={20}
                  className="text-white/50"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                className="
                  rounded-2xl
                  border border-white/6
                  bg-[#07101F]/60
                  p-3
                "
              >
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/30">
                  Total
                </p>

                <p className="mt-1 text-[18px] font-black text-white">
                  {notifications.length}
                </p>

                <p className="mt-0.5 text-[9px] text-white/35">
                  Notifications
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-emerald-400/10
                  bg-emerald-500/5
                  p-3
                "
              >
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-400/70">
                  Unread
                </p>

                <p className="mt-1 text-[18px] font-black text-emerald-300">
                  {unreadCount}
                </p>

                <p className="mt-0.5 text-[9px] text-white/35">
                  Need your attention
                </p>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div
              className="
                mb-4 flex items-start gap-3
                rounded-2xl
                border border-red-400/15
                bg-red-500/5
                p-4
              "
            >
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />

              <div>
                <p className="text-[10px] font-bold text-red-300">
                  Something went wrong
                </p>

                <p className="mt-1 text-[10px] leading-5 text-red-300/60">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Section heading */}
          {notifications.length > 0 && (
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                Recent activity
              </p>

              <p className="text-[9px] text-white/25">
                {notifications.length}{' '}
                {notifications.length === 1
                  ? 'item'
                  : 'items'}
              </p>
            </div>
          )}

          {/* Empty state */}
          {notifications.length === 0 ? (
            <section
              className="
                rounded-[26px]
                border border-white/8
                bg-[#0B1426]
                p-8
                text-center
                shadow-xl shadow-black/10
                sm:p-12
              "
            >
              <div
                className="
                  mx-auto flex h-16 w-16
                  items-center justify-center
                  rounded-2xl
                  border border-white/8
                  bg-white/4
                "
              >
                <Bell
                  size={24}
                  className="text-white/25"
                />
              </div>

              <p className="mt-5 text-[13px] font-bold text-white">
                You are all caught up
              </p>

              <p className="mx-auto mt-2 max-w-xs text-[10px] leading-5 text-white/35">
                There are no notifications at the moment.
                New account and platform updates will appear
                here.
              </p>
            </section>
          ) : (
            <div className="space-y-3">
              {notifications.map(
                (notification) => {
                  const isUnread =
                    !notification.isRead;

                  return (
                    <article
                      key={notification.id}
                      className={[
                        'group relative overflow-hidden rounded-[22px]',
                        'border p-4 transition-all duration-200',
                        isUnread
                          ? 'border-emerald-400/15 bg-[#0C172A] shadow-lg shadow-black/10'
                          : 'border-white/6 bg-[#0B1426]/80',
                        'hover:border-white/12',
                      ].join(' ')}
                    >
                      {/* Unread accent */}
                      {isUnread && (
                        <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-emerald-400" />
                      )}

                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={[
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                            isUnread
                              ? 'border-emerald-400/15 bg-emerald-400/10'
                              : 'border-white/6 bg-white/4',
                          ].join(' ')}
                        >
                          <Bell
                            size={16}
                            className={
                              isUnread
                                ? 'text-emerald-400'
                                : 'text-white/30'
                            }
                          />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={[
                                'min-w-0 text-[12px] leading-5',
                                isUnread
                                  ? 'font-bold text-white'
                                  : 'font-semibold text-white/65',
                              ].join(' ')}
                            >
                              {notification.title}
                            </h3>

                            {isUnread && (
                              <span
                                className="
                                  rounded-full
                                  border border-emerald-400/15
                                  bg-emerald-400/10
                                  px-2 py-0.5
                                  text-[8px]
                                  font-black
                                  uppercase
                                  tracking-[0.12em]
                                  text-emerald-300
                                "
                              >
                                New
                              </span>
                            )}
                          </div>

                          <p
                            className={[
                              'mt-1.5 text-[10px] leading-5',
                              isUnread
                                ? 'text-white/55'
                                : 'text-white/35',
                            ].join(' ')}
                          >
                            {notification.message}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <span
                              className={[
                                'text-[9px]',
                                isUnread
                                  ? 'text-white/35'
                                  : 'text-white/20',
                              ].join(' ')}
                            >
                              {formatNotificationDate(
                                notification.createdAt,
                              )}
                            </span>

                            {isUnread && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-white/15" />

                                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-400/70">
                                  Unread
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-1">
                          {isUnread && (
                            <button
                              type="button"
                              onClick={() =>
                                void handleMarkRead(
                                  notification.id,
                                )
                              }
                              className="
                                flex h-8 w-8
                                items-center justify-center
                                rounded-xl
                                border border-emerald-400/10
                                bg-emerald-400/5
                                text-emerald-400
                                transition
                                hover:border-emerald-400/20
                                hover:bg-emerald-400/10
                                active:scale-95
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-emerald-400/60
                              "
                              aria-label="Mark as read"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              void handleDelete(
                                notification.id,
                              )
                            }
                            className="
                              flex h-8 w-8
                              items-center justify-center
                              rounded-xl
                              border border-white/6
                              bg-white/3
                              text-white/25
                              transition
                              hover:border-red-400/15
                              hover:bg-red-400/5
                              hover:text-red-400
                              active:scale-95
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-red-400/60
                            "
                            aria-label="Delete notification"
                            title="Delete notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>

      <InvestmentBottomNav />
    </main>
  );
}

