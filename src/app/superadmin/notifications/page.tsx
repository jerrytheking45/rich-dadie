
'use client';

import {
  useCallback,
  useEffect,
  useMemo,
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
} from 'lucide-react';

import { useAuth } from '@/src/components/AuthProvider';

import {
  notificationApi,
  type Notification,
} from '@/src/lib/api/notification';

import {
  getNotificationTarget,
} from '@/src/lib/utils/adminNotificationNavigation';

import AdminDashboard from '@/src/components/admin/AdminDashboard';

const PAGE_SIZE = 20;

/*
 * Notification ordering:
 *
 * 1. Unread notifications first.
 * 2. Newest unread first.
 * 3. Read notifications after unread.
 * 4. Newest read first.
 *
 * This is intentionally done on the frontend as well as ideally
 * on the backend so the admin UI remains consistent after:
 *
 * - loading
 * - refreshing
 * - marking one notification as read
 * - marking all as read
 */
function sortNotifications(
  items: Notification[],
): Notification[] {
  return [...items].sort((a, b) => {
    const aUnread = !a.isRead;
    const bUnread = !b.isRead;

    /*
     * Always prioritize unread notifications.
     */
    if (aUnread !== bUnread) {
      return aUnread ? -1 : 1;
    }

    /*
     * Within the same read/unread group,
     * newest notifications come first.
     */
    const aTime = new Date(
      a.createdAt,
    ).getTime();

    const bTime = new Date(
      b.createdAt,
    ).getTime();

    /*
     * Invalid dates are pushed to the bottom
     * of their current group.
     */
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

export default function AdminNotificationsPage() {
  const router = useRouter();

  const { isAuthenticated } =
    useAuth();

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
   * Authentication redirect.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [
    isAuthenticated,
    router,
  ]);

  /*
   * Load notifications.
   *
   * Always sort the response before storing it.
   */
  const loadNotifications =
    useCallback(
      async (
        targetPage: number,
        silent = false,
      ) => {
        if (!isAuthenticated) {
          return;
        }

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
            response.notifications ?? [];

          /*
           * IMPORTANT:
           * unread/new notifications are always
           * placed before read notifications.
           */
          setNotifications(
            sortNotifications(
              notificationList,
            ),
          );

          setTotal(
            response.pagination.total,
          );

          setPage(
            response.pagination.page,
          );
        } catch (requestError) {
          console.error(
            'Failed to load administrator notifications:',
            requestError,
          );

          setError(
            'Failed to load administrator notifications.',
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [isAuthenticated],
    );

  /*
   * Initial authenticated load.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        void loadNotifications(
          1,
          false,
        );
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    isAuthenticated,
    loadNotifications,
  ]);

  /*
   * Notification type filtering.
   *
   * Sorting has already been applied to the
   * source list, so filtering preserves the
   * unread-first ordering.
   */
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

  /*
   * Unread notifications on current page.
   */
  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  /*
   * Pagination.
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      total / PAGE_SIZE,
    ),
  );

  /*
   * Available notification filters.
   */
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

  /*
   * Mark one notification as read.
   *
   * After marking it read, re-sort so that it
   * moves below all remaining unread notifications.
   */
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
        } catch (requestError) {
          console.error(
            'Failed to mark notification as read:',
            requestError,
          );

          setError(
            'Failed to mark notification as read.',
          );

          return false;
        }
      },
      [],
    );

  /*
   * Handle notification resource navigation.
   */
  const handleNotificationClick =
    useCallback(
      async (
        notification: Notification,
      ) => {
        const target =
          getNotificationTarget(
            notification,
          );

        const readSuccessfully =
          await markAsRead(
            notification,
          );

        /*
         * Navigate when there is a valid
         * supported resource target.
         */
        if (target) {
          router.push(target);
          return;
        }

        /*
         * Other notifications intentionally
         * remain without navigation.
         */
        if (!readSuccessfully) {
          return;
        }
      },
      [
        markAsRead,
        router,
      ],
    );

  /*
   * Mark all as read.
   *
   * After changing every notification to read,
   * sort again so newest notifications remain
   * at the top.
   */
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
      } catch (requestError) {
        console.error(
          'Failed to mark notifications as read:',
          requestError,
        );

        setError(
          'Failed to mark notifications as read.',
        );
      }
    }, [unreadCount]);

  /*
   * Delete one notification.
   */
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
            Math.max(
              current - 1,
              0,
            ),
          );
        } catch (requestError) {
          console.error(
            'Failed to delete notification:',
            requestError,
          );

          setError(
            'Failed to delete notification.',
          );
        }
      },
      [],
    );

  /*
   * Pagination navigation.
   */
  const goToPage =
    useCallback(
      (targetPage: number) => {
        if (
          targetPage < 1 ||
          targetPage > totalPages ||
          targetPage === page
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
      ],
    );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminDashboard title="Notifications">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-slate-200" />

          <div className="h-24 rounded-xl bg-white shadow-sm" />

          <div className="h-24 rounded-xl bg-white shadow-sm" />

          <div className="h-24 rounded-xl bg-white shadow-sm" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Bell size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {unreadCount > 99
                        ? '99+'
                        : unreadCount}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-emerald-600">
                    Administration
                  </p>

                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Notifications
                  </h2>

                  <p className="text-sm text-slate-500">
                    Administrator alerts and platform activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  void loadNotifications(
                    page,
                    true,
                  )
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {refreshing ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Bell size={15} />
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
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  <Check size={16} />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total notifications
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {total}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Unread on this page
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Current page
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {page} / {totalPages}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSelectedType('all')
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>

            {notificationTypes.map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setSelectedType(type)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedType.toLowerCase() ===
                    type.toLowerCase()
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {getNotificationTypeLabel(
                    type,
                  )}
                </button>
              ),
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  setError('')
                }
                className="shrink-0 text-xs font-medium text-red-700 hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Notifications */}
          {filteredNotifications.length ===
          0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Bell size={26} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No notifications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Administrator notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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

                  return (
                    <div
                      key={notification.id}
                      className={`border-b border-slate-100 p-5 transition last:border-b-0 ${
                        isUnread
                          ? 'bg-emerald-50/40'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            isUnread
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Heading */}
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3
                                  className={`text-sm font-semibold ${
                                    isUnread
                                      ? 'text-slate-950'
                                      : 'text-slate-800'
                                  }`}
                                >
                                  {notification.title}
                                </h3>

                                {isUnread && (
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                    New
                                  </span>
                                )}
                              </div>

                              <span className="mt-1 inline-block text-xs text-slate-400">
                                {getNotificationTypeLabel(
                                  notification.type,
                                )}
                              </span>
                            </div>

                            <span className="shrink-0 text-xs text-slate-400">
                              {formatNotificationDate(
                                notification.createdAt,
                              )}
                            </span>
                          </div>

                          {/* Message */}
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {notification.message}
                          </p>

                          {/* Open resource */}
                          {target ? (
                            <button
                              type="button"
                              onClick={() =>
                                void handleNotificationClick(
                                  notification,
                                )
                              }
                              className="group mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
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
                            <span className="mt-4 inline-flex items-center text-xs text-slate-400">
                              Informational notification
                            </span>
                          )}

                          {/* Actions */}
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {isUnread && (
                              <button
                                type="button"
                                onClick={() =>
                                  void markAsRead(
                                    notification,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
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
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
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
            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <button
                type="button"
                onClick={() =>
                  goToPage(page - 1)
                }
                disabled={
                  page <= 1 ||
                  refreshing
                }
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
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
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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

