'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  ExternalLink,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import { useAuth } from '@/src/components/AuthProvider';
import AdminDashboard from '@/src/components/admin/AdminDashboard';

import {
  notificationApi,
  type Notification,
} from '@/src/lib/api/notification';

import { getNotificationTarget } from '@/src/lib/utils/adminNotificationNavigation';

const PAGE_SIZE = 20;

function sortNotifications(
  items: Notification[],
): Notification[] {
  return [...items].sort((a, b) => {
    const aUnread = !a.isRead;
    const bUnread = !b.isRead;

    if (aUnread !== bUnread) {
      return aUnread ? -1 : 1;
    }

    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();

    if (Number.isNaN(aTime)) {
      return 1;
    }

    if (Number.isNaN(bTime)) {
      return -1;
    }

    return bTime - aTime;
  });
}

function getNotificationIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'deposit_confirmed':
    case 'deposit_credited':
    case 'withdrawal_completed':
      return CircleCheck;

    case 'deposit_failed':
    case 'deposit_rejected':
    case 'withdrawal_failed':
    case 'withdrawal_rejected':
    case 'withdrawal_cancelled':
      return CircleAlert;

    case 'deposit_submitted':
    case 'investment_created':
    case 'withdrawal_requested':
    case 'withdrawal_processing':
    case 'withdrawal_broadcast':
    case 'withdrawal_confirming':
      return Clock3;

    case 'support_ticket_created':
    case 'ticket_created':
    case 'new_ticket':
      return Bell;

    default:
      return Bell;
  }
}

function getNotificationTypeLabel(
  type: string,
): string {
  switch (type.toLowerCase()) {
    case 'support_ticket_created':
    case 'ticket_created':
    case 'new_ticket':
      return 'New Support Ticket';

    case 'deposit_submitted':
      return 'Deposit Submitted';

    case 'deposit_confirmed':
      return 'Deposit Confirmed';

    case 'deposit_credited':
      return 'Deposit Credited';

    case 'deposit_failed':
      return 'Deposit Failed';

    case 'deposit_rejected':
      return 'Deposit Rejected';

    case 'investment_created':
      return 'Investment';

    case 'withdrawal_requested':
      return 'Withdrawal Requested';

    case 'withdrawal_processing':
      return 'Withdrawal Processing';

    case 'withdrawal_broadcast':
      return 'Withdrawal Broadcast';

    case 'withdrawal_confirming':
      return 'Withdrawal Confirming';

    case 'withdrawal_completed':
      return 'Withdrawal Completed';

    case 'withdrawal_failed':
      return 'Withdrawal Failed';

    case 'withdrawal_rejected':
      return 'Withdrawal Rejected';

    case 'withdrawal_cancelled':
      return 'Withdrawal Cancelled';

    case 'payment_received':
      return 'Payment';

    default:
      return type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) =>
          char.toUpperCase(),
        );
  }
}

function formatNotificationDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getNotificationTypeClasses(
  type: string,
): {
  icon: string;
  iconBackground: string;
} {
  const normalizedType =
    type.toLowerCase();

  if (
    normalizedType.includes('failed') ||
    normalizedType.includes('rejected') ||
    normalizedType.includes('cancelled')
  ) {
    return {
      icon: 'text-red-300',
      iconBackground:
        'bg-red-500/10 border-red-500/15',
    };
  }

  if (
    normalizedType.includes('confirmed') ||
    normalizedType.includes('credited') ||
    normalizedType.includes('completed')
  ) {
    return {
      icon: 'text-emerald-300',
      iconBackground:
        'bg-emerald-500/10 border-emerald-500/15',
    };
  }

  if (
    normalizedType.includes('submitted') ||
    normalizedType.includes('processing') ||
    normalizedType.includes('requested') ||
    normalizedType.includes('broadcast') ||
    normalizedType.includes('confirming')
  ) {
    return {
      icon: 'text-purple-300',
      iconBackground:
        'bg-purple-500/10 border-purple-500/15',
    };
  }

  return {
    icon: 'text-slate-300',
    iconBackground:
      'bg-white/[0.04] border-white/10',
  };
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const requestInProgress = useRef(false);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [selectedType, setSelectedType] =
    useState('all');

  /*
   * Redirect unauthenticated users.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  /*
   * Load notifications.
   */
  const loadNotifications = useCallback(
    async (
      targetPage: number,
      silent = false,
    ) => {
      if (!isAuthenticated) {
        return;
      }

      if (requestInProgress.current) {
        return;
      }

      requestInProgress.current = true;

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        const response =
          await notificationApi.getNotifications(
            targetPage,
            PAGE_SIZE,
          );

        const notificationList =
          Array.isArray(response.notifications)
            ? response.notifications
            : [];

        const responseTotal =
          response.pagination?.total ?? 0;

        const responsePage =
          response.pagination?.page ?? targetPage;

        setNotifications(
          sortNotifications(
            notificationList,
          ),
        );

        setTotal(responseTotal);
        setPage(responsePage);
      } catch (requestError: unknown) {
        console.error(
          'Failed to load administrator notifications:',
          requestError,
        );

        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load administrator notifications.';

        setError(message);
      } finally {
        requestInProgress.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isAuthenticated],
  );

  /*
   * Initial notification loading.
   *
   * The request is scheduled for the next task so that
   * the effect itself does not synchronously trigger
   * the loading state updates.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadNotifications(1, false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isAuthenticated, loadNotifications]);

  const filteredNotifications =
    useMemo(() => {
      if (selectedType === 'all') {
        return notifications;
      }

      return notifications.filter(
        (notification) =>
          notification.type.toLowerCase() ===
          selectedType.toLowerCase(),
      );
    }, [
      notifications,
      selectedType,
    ]);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE),
  );

  const notificationTypes =
    useMemo(
      () =>
        Array.from(
          new Set(
            notifications.map(
              (notification) =>
                notification.type,
            ),
          ),
        ),
      [notifications],
    );

  const markAsRead =
    useCallback(
      async (
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
            sortNotifications(
              current.map((item) =>
                item.id === notification.id
                  ? {
                      ...item,
                      isRead: true,
                    }
                  : item,
              ),
            ),
          );

          return true;
        } catch (requestError: unknown) {
          console.error(
            'Failed to mark notification as read:',
            requestError,
          );

          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to mark notification as read.',
          );

          return false;
        }
      },
      [],
    );

  const handleNotificationClick =
    useCallback(
      async (
        notification: Notification,
      ) => {
        const target =
          getNotificationTarget(
            notification,
          );

        await markAsRead(notification);

        if (target) {
          router.push(target);
        }
      },
      [markAsRead, router],
    );

  const markAllAsRead =
    useCallback(async () => {
      if (unreadCount === 0) {
        return;
      }

      try {
        await notificationApi.markAllAsRead();

        setNotifications((current) =>
          sortNotifications(
            current.map(
              (notification) => ({
                ...notification,
                isRead: true,
              }),
            ),
          ),
        );
      } catch (requestError: unknown) {
        console.error(
          'Failed to mark notifications as read:',
          requestError,
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to mark notifications as read.',
        );
      }
    }, [unreadCount]);

  const deleteNotification =
    useCallback(
      async (id: string) => {
        if (
          !window.confirm(
            'Delete this notification?',
          )
        ) {
          return;
        }

        try {
          await notificationApi.deleteNotification(
            id,
          );

          setNotifications((current) =>
            current.filter(
              (notification) =>
                notification.id !== id,
            ),
          );

          setTotal((current) =>
            Math.max(current - 1, 0),
          );
        } catch (requestError: unknown) {
          console.error(
            'Failed to delete notification:',
            requestError,
          );

          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to delete notification.',
          );
        }
      },
      [],
    );

  const goToPage =
    useCallback(
      (targetPage: number) => {
        if (
          targetPage < 1 ||
          targetPage > totalPages ||
          targetPage === page ||
          refreshing
        ) {
          return;
        }

        void loadNotifications(
          targetPage,
          false,
        );
      },
      [
        loadNotifications,
        page,
        totalPages,
        refreshing,
      ],
    );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminDashboard title="Notifications">
      {loading ? (
        <div className="space-y-5">
          <div className="animate-pulse">
            <div className="h-8 w-64 rounded-lg bg-white/6" />

            <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/4" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl border border-white/8 bg-[#0B1426]"
                />
              ),
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426]">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse gap-4 border-b border-white/6 p-5 last:border-b-0"
                >
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-white/6" />

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-4 w-1/3 rounded bg-white/6" />

                    <div className="h-3 w-24 rounded bg-white/4" />

                    <div className="h-3 w-3/4 rounded bg-white/4" />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10 text-purple-300 shadow-lg shadow-purple-950/20">
                <Bell size={22} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#07101F] bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount > 99
                      ? '99+'
                      : unreadCount}
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-purple-300">
                  Administration
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Notifications
                </h2>

                <p className="mt-0.5 text-sm text-slate-400">
                  Administrator alerts and platform activity.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  void loadNotifications(
                    page,
                    true,
                  )
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/15 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {refreshing ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <RefreshCw size={15} />
                )}

                {refreshing
                  ? 'Refreshing...'
                  : 'Refresh'}
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    void markAllAsRead()
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#03120B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
                >
                  <Check size={16} />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Total notifications
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                  <Bell size={17} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-white">
                {total.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Unread on this page
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <CircleCheck size={17} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-emerald-300">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Current page
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                  <Clock3 size={17} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-white">
                {page}{' '}
                <span className="text-base font-medium text-slate-500">
                  / {totalPages}
                </span>
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedType('all')
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedType === 'all'
                    ? 'bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/30'
                    : 'bg-white/3 text-slate-400 ring-1 ring-white/8 hover:bg-white/6 hover:text-slate-200'
                }`}
              >
                All
              </button>

              {notificationTypes.map(
                (type) => {
                  const active =
                    selectedType.toLowerCase() ===
                    type.toLowerCase();

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setSelectedType(type)
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? 'bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/30'
                          : 'bg-white/3 text-slate-400 ring-1 ring-white/8 hover:bg-white/6 hover:text-slate-200'
                      }`}
                    >
                      {getNotificationTypeLabel(
                        type,
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              <div className="flex items-center gap-3">
                <CircleAlert
                  size={18}
                  className="shrink-0"
                />

                <span>{error}</span>
              </div>

              <button
                type="button"
                onClick={() => setError('')}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Notifications */}
          {filteredNotifications.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-12 text-center shadow-xl shadow-black/10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/4 text-slate-500">
                <Bell size={28} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                No notifications
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Administrator notifications will appear here when there is new platform activity.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
              {filteredNotifications.map(
                (notification) => {
                  const Icon =
                    getNotificationIcon(
                      notification.type,
                    );

                  const target =
                    getNotificationTarget(
                      notification,
                    );

                  const isUnread =
                    !notification.isRead;

                  const typeClasses =
                    getNotificationTypeClasses(
                      notification.type,
                    );

                  return (
                    <div
                      key={notification.id}
                      className={`border-b border-white/6 p-5 transition last:border-b-0 sm:p-6 ${
                        isUnread
                          ? 'bg-purple-500/2.5'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                            isUnread
                              ? 'border-purple-400/20 bg-purple-400/10 text-purple-300'
                              : `${typeClasses.iconBackground} ${typeClasses.icon}`
                          }`}
                        >
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3
                                  className={`text-sm font-semibold ${
                                    isUnread
                                      ? 'text-white'
                                      : 'text-slate-200'
                                  }`}
                                >
                                  {notification.title}
                                </h3>

                                {isUnread && (
                                  <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-purple-300">
                                    New
                                  </span>
                                )}
                              </div>

                              <span className="mt-1 inline-block text-xs text-slate-500">
                                {getNotificationTypeLabel(
                                  notification.type,
                                )}
                              </span>
                            </div>

                            <span className="shrink-0 text-xs text-slate-500">
                              {formatNotificationDate(
                                notification.createdAt,
                              )}
                            </span>
                          </div>

                          <p
                            className={`mt-3 max-w-4xl text-sm leading-6 ${
                              isUnread
                                ? 'text-slate-300'
                                : 'text-slate-400'
                            }`}
                          >
                            {notification.message}
                          </p>

                          {target ? (
                            <button
                              type="button"
                              onClick={() =>
                                void handleNotificationClick(
                                  notification,
                                )
                              }
                              className="group mt-4 inline-flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-400/10 px-3.5 py-2 text-xs font-semibold text-purple-300 transition hover:border-purple-400/30 hover:bg-purple-400/15"
                            >
                              <ExternalLink
                                size={14}
                              />

                              Open related item

                              <span className="transition-transform group-hover:translate-x-0.5">
                                →
                              </span>
                            </button>
                          ) : (
                            <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-600">
                              <Bell size={12} />
                              Informational notification
                            </span>
                          )}

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {isUnread && (
                              <button
                                type="button"
                                onClick={() =>
                                  void markAsRead(
                                    notification,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/15"
                              >
                                <Check size={14} />
                                Mark as read
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                void deleteNotification(
                                  notification.id,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/15 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/25 hover:bg-red-500/10"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/8 bg-[#0B1426] px-4 py-3 shadow-xl shadow-black/10">
              <button
                type="button"
                onClick={() =>
                  goToPage(page - 1)
                }
                disabled={
                  page <= 1 || refreshing
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/3 px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm text-slate-500">
                Page{' '}
                <span className="font-medium text-slate-300">
                  {page}
                </span>{' '}
                of{' '}
                <span className="font-medium text-slate-300">
                  {totalPages}
                </span>
              </span>

              <button
                type="button"
                onClick={() =>
                  goToPage(page + 1)
                }
                disabled={
                  page >= totalPages ||
                  refreshing
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/3 px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </AdminDashboard>
  );
}