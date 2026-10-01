//src/app/s
'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

import adminSupportService from '@/src/lib/services/adminSupportService';

import type {
  SupportTicket,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from '@/src/lib/types/support';

import AdminDashboard from '@/src/components/admin/AdminDashboard';

const PAGE_SIZE = 20;
const POLL_INTERVAL = 15000;

const STATUS_OPTIONS: Array<{
  value: SupportTicketStatus | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  {
    value: 'IN_PROGRESS',
    label: 'In progress',
  },
  {
    value: 'WAITING_FOR_USER',
    label: 'Waiting for user',
  },
  {
    value: 'RESOLVED',
    label: 'Resolved',
  },
  {
    value: 'CLOSED',
    label: 'Closed',
  },
];

const PRIORITY_OPTIONS: Array<{
  value: SupportTicketPriority | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'All priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const CATEGORY_OPTIONS: Array<{
  value: SupportTicketCategory | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'All categories' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'DEPOSIT', label: 'Deposit' },
  {
    value: 'INVESTMENT',
    label: 'Investment',
  },
  {
    value: 'WITHDRAWAL',
    label: 'Withdrawal',
  },
  { value: 'WALLET', label: 'Wallet' },
  { value: 'PAYMENT', label: 'Payment' },
  {
    value: 'VERIFICATION',
    label: 'Verification',
  },
  {
    value: 'SECURITY',
    label: 'Security',
  },
  { value: 'OTHER', label: 'Other' },
];

function statusLabel(
  status: SupportTicketStatus,
) {
  return status.replaceAll('_', ' ');
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    'en-UG',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(date);
}

function statusClass(
  status: SupportTicketStatus,
) {
  switch (status) {
    case 'OPEN':
      return 'border-emerald-400/15 bg-emerald-400/10 text-emerald-300';

    case 'IN_PROGRESS':
      return 'border-sky-400/15 bg-sky-400/10 text-sky-300';

    case 'WAITING_FOR_USER':
      return 'border-amber-400/15 bg-amber-400/10 text-amber-300';

    case 'RESOLVED':
      return 'border-violet-400/15 bg-violet-400/10 text-violet-300';

    case 'CLOSED':
      return 'border-white/8 bg-white/5 text-white/40';

    default:
      return 'border-white/8 bg-white/5 text-white/40';
  }
}

function priorityClass(
  priority: SupportTicketPriority,
) {
  switch (priority) {
    case 'URGENT':
      return 'border-red-400/15 bg-red-400/10 text-red-300';

    case 'HIGH':
      return 'border-orange-400/15 bg-orange-400/10 text-orange-300';

    case 'NORMAL':
      return 'border-sky-400/15 bg-sky-400/10 text-sky-300';

    case 'LOW':
      return 'border-white/8 bg-white/5 text-white/40';

    default:
      return 'border-white/8 bg-white/5 text-white/40';
  }
}

async function attachUnreadCounts(
  tickets: SupportTicket[],
): Promise<SupportTicket[]> {
  if (tickets.length === 0) {
    return tickets;
  }

  const results = await Promise.all(
    tickets.map(async (ticket) => {
      try {
        const response =
          await adminSupportService.getMessages(
            ticket.id,
          );

        const unreadCount =
          response.messages.filter(
            (message) =>
              !message.is_internal &&
              message.sender_id ===
                ticket.user_id &&
              !message.seen,
          ).length;

        return {
          ...ticket,
          unread_count: unreadCount,
        };
      } catch (error) {
        console.error(
          `Failed to load unread count for ticket ${ticket.id}:`,
          error,
        );

        return {
          ...ticket,
          unread_count: 0,
        };
      }
    }),
  );

  return results;
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] px-3 text-sm text-white outline-none transition focus:border-emerald-400/30 focus:ring-2 focus:ring-emerald-400/10"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-[#0B1426] text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function AdminSupportPage() {
  const router = useRouter();

  const [tickets, setTickets] =
    useState<SupportTicket[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [offset, setOffset] =
    useState(0);

  const [hasNextPage, setHasNextPage] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const [status, setStatus] =
    useState<
      SupportTicketStatus | 'ALL'
    >('ALL');

  const [priority, setPriority] =
    useState<
      SupportTicketPriority | 'ALL'
    >('ALL');

  const [category, setCategory] =
    useState<
      SupportTicketCategory | 'ALL'
    >('ALL');

  const loadTickets = useCallback(
    async (showRefresh = false) => {
      try {
        setError(null);

        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response =
          await adminSupportService.listTickets(
            PAGE_SIZE,
            offset,
          );

        const ticketsWithUnread =
          await attachUnreadCounts(
            response.tickets,
          );

        setTickets(
          ticketsWithUnread,
        );

        setHasNextPage(
          response.tickets.length ===
            PAGE_SIZE,
        );
      } catch (error) {
        console.error(
          'Failed to load support tickets:',
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load support tickets.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [offset],
  );

  const refreshTicketsSilently =
    useCallback(async () => {
      try {
        const response =
          await adminSupportService.listTickets(
            PAGE_SIZE,
            offset,
          );

        const ticketsWithUnread =
          await attachUnreadCounts(
            response.tickets,
          );

        setTickets(
          ticketsWithUnread,
        );

        setHasNextPage(
          response.tickets.length ===
            PAGE_SIZE,
        );
      } catch (error) {
        console.error(
          'Failed to silently refresh support tickets:',
          error,
        );
      }
    }, [offset]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTickets();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadTickets]);

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          'visible'
        ) {
          void refreshTicketsSilently();
        }
      };

    const handleFocus = () => {
      void refreshTicketsSilently();
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    window.addEventListener(
      'focus',
      handleFocus,
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );

      window.removeEventListener(
        'focus',
        handleFocus,
      );
    };
  }, [refreshTicketsSilently]);

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        void refreshTicketsSilently();
      }, POLL_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [refreshTicketsSilently]);

  useEffect(() => {
    const handleUnreadChanged =
      () => {
        void refreshTicketsSilently();
      };

    window.addEventListener(
      'investment:support-unread-changed',
      handleUnreadChanged,
    );

    return () => {
      window.removeEventListener(
        'investment:support-unread-changed',
        handleUnreadChanged,
      );
    };
  }, [refreshTicketsSilently]);

  const filteredTickets =
    tickets.filter((ticket) => {
      const query =
        search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        String(ticket.ticket_number)
          .toLowerCase()
          .includes(query) ||
        ticket.subject
          .toLowerCase()
          .includes(query) ||
        ticket.user_id
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === 'ALL' ||
        ticket.status === status;

      const matchesPriority =
        priority === 'ALL' ||
        ticket.priority === priority;

      const matchesCategory =
        category === 'ALL' ||
        ticket.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });

  const totalUnread =
    tickets.reduce(
      (total, ticket) =>
        total +
        (ticket.unread_count ?? 0),
      0,
    );

  const openTicket = (
    ticketId: string,
  ) => {
    router.push(
      `/admin/support/tickets/${encodeURIComponent(
        ticketId,
      )}`,
    );
  };

  const goPrevious = () => {
    setOffset((current) =>
      Math.max(
        0,
        current - PAGE_SIZE,
      ),
    );
  };

  const goNext = () => {
    if (!hasNextPage) {
      return;
    }

    setOffset(
      (current) =>
        current + PAGE_SIZE,
    );
  };

  return (
    <AdminDashboard title="Support">
      <div className="min-h-screen space-y-4 bg-[#050B18] pb-8 sm:space-y-5 sm:pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl border border-purple-400/10 bg-linear-to-br from-purple-500/15 to-blue-500/10 text-purple-300">
              <MessageCircle size={22} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Support Tickets
                </h1>

                {totalUnread > 0 && (
                  <span
                    className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full border border-red-400/20 bg-red-500 px-2 text-[10px] font-bold leading-none text-white shadow-lg shadow-red-950/20"
                    aria-label={
                      totalUnread === 1
                        ? '1 unread customer message'
                        : `${totalUnread} unread customer messages`
                    }
                  >
                    {totalUnread > 99
                      ? '99+'
                      : totalUnread}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-white/35 sm:mt-1 sm:text-sm">
                Manage customer conversations and support requests.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadTickets(true)
            }
            disabled={
              loading || refreshing
            }
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <section className="overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#0B1426] via-[#0B1426] to-[#11102B] p-3.5 shadow-2xl shadow-black/10 sm:rounded-3xl sm:p-5">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <SlidersHorizontal
              size={15}
              className="text-purple-300"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
              Filters
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search ticket number, subject or user ID..."
                className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/30 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>

            <FilterSelect
              value={status}
              onChange={(value) =>
                setStatus(
                  value as
                    | SupportTicketStatus
                    | 'ALL',
                )
              }
              options={
                STATUS_OPTIONS
              }
            />

            <FilterSelect
              value={priority}
              onChange={(value) =>
                setPriority(
                  value as
                    | SupportTicketPriority
                    | 'ALL',
                )
              }
              options={
                PRIORITY_OPTIONS
              }
            />

            <FilterSelect
              value={category}
              onChange={(value) =>
                setCategory(
                  value as
                    | SupportTicketCategory
                    | 'ALL',
                )
              }
              options={
                CATEGORY_OPTIONS
              }
            />
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/8 p-4 text-sm text-red-300">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Unable to load support tickets
              </p>

              <p className="mt-1 text-red-300/70">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Tickets */}
        <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#0B1426] shadow-2xl shadow-black/10">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center sm:min-h-56">
              <div className="flex flex-col items-center gap-3 text-sm text-white/35">
                <Loader2
                  size={24}
                  className="animate-spin text-emerald-400"
                />
                Loading support tickets...
              </div>
            </div>
          ) : filteredTickets.length ===
            0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center sm:min-h-72 sm:px-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/10 bg-purple-400/10 text-purple-300">
                <MessageCircle size={23} />
              </div>

              <h2 className="mt-4 text-base font-semibold text-white/80">
                No support tickets found
              </h2>

              <p className="mt-1 max-w-md text-sm text-white/35">
                There are no tickets matching the current filters.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/2 text-left">
                      {[
                        'Ticket',
                        'Subject',
                        'Category',
                        'Status',
                        'Priority',
                        'Updated',
                      ].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30"
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/6">
                    {filteredTickets.map(
                      (ticket) => (
                        <tr
                          key={ticket.id}
                          onClick={() =>
                            openTicket(
                              ticket.id,
                            )
                          }
                          className="cursor-pointer transition hover:bg-white/3"
                        >
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white/80">
                                #
                                {
                                  ticket.ticket_number
                                }
                              </span>

                              {ticket.unread_count >
                                0 && (
                                <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[9px] font-bold leading-none text-white">
                                  {ticket.unread_count >
                                  99
                                    ? '99+'
                                    : ticket.unread_count}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="max-w-[320px] px-5 py-4">
                            <p className="truncate text-sm font-semibold text-white/80">
                              {
                                ticket.subject
                              }
                            </p>

                            <p className="mt-1 truncate font-mono text-[10px] text-white/25">
                              {
                                ticket.user_id
                              }
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4">
                            <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[10px] font-semibold text-white/45">
                              {
                                ticket.category
                              }
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass(
                                ticket.status,
                              )}`}
                            >
                              {statusLabel(
                                ticket.status,
                              )}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityClass(
                                ticket.priority,
                              )}`}
                            >
                              {
                                ticket.priority
                              }
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-xs text-white/30">
                            {formatDate(
                              ticket.updated_at,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-white/6 md:hidden">
                {filteredTickets.map(
                  (ticket) => (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() =>
                        openTicket(
                          ticket.id,
                        )
                      }
                      className="w-full p-3.5 text-left transition hover:bg-white/3 sm:p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-white/30">
                              #
                              {
                                ticket.ticket_number
                              }
                            </p>

                            {ticket.unread_count >
                              0 && (
                              <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[9px] font-bold text-white">
                                {ticket.unread_count >
                                99
                                  ? '99+'
                                  : ticket.unread_count}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 truncate text-sm font-semibold text-white/85">
                            {ticket.subject}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${statusClass(
                            ticket.status,
                          )}`}
                        >
                          {statusLabel(
                            ticket.status,
                          )}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[10px] font-semibold text-white/40">
                          {
                            ticket.category
                          }
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityClass(
                            ticket.priority,
                          )}`}
                        >
                          {
                            ticket.priority
                          }
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="truncate font-mono text-[10px] text-white/25">
                          {ticket.user_id}
                        </span>

                        <span className="shrink-0 text-[10px] text-white/25">
                          {formatDate(
                            ticket.updated_at,
                          )}
                        </span>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </>
          )}

          {!loading &&
            tickets.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-white/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-[10px] text-white/30">
                  Showing {offset + 1}–
                  {offset +
                    tickets.length}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={
                      goPrevious
                    }
                    disabled={
                      offset === 0 ||
                      loading
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/50 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft
                      size={15}
                    />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={
                      !hasNextPage ||
                      loading
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/50 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                    <ChevronRight
                      size={15}
                    />
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </AdminDashboard>
  );
}
