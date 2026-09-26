'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import AdminDashboard from '@/src/components/admin/AdminDashboard';

import AdminSupportControls from '@/src/components/support/admin/AdminSupportControls';
import AdminSupportEventList from '@/src/components/support/admin/AdminSupportEventList';
import AdminSupportMessageComposer from '@/src/components/support/admin/AdminSupportMessageComposer';
import AdminSupportMessageList from '@/src/components/support/admin/AdminSupportMessageList';
import AdminSupportTicketHeader from '@/src/components/support/admin/AdminSupportTicketHeader';

import { adminSupportService } from '@/src/lib/services/adminSupportService';

import type {
  SupportAttachment,
  SupportMessage,
  SupportTicket,
  SupportTicketEvent,
  SupportTicketPriority,
  SupportTicketStatus,
} from '@/src/lib/types/support';

interface PageData {
  ticket: SupportTicket;
  messages: SupportMessage[];
  attachments: SupportAttachment[];
  events: SupportTicketEvent[];
}

function getErrorMessage(
  error: unknown,
): string {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return 'Something went wrong while loading the support ticket.';
}

function ErrorBanner({
  title,
  message,
  onDismiss,
}: {
  title: string;
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-400/15 bg-red-400/8 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
          <AlertCircle size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-200">
            {title}
          </p>

          <p className="mt-0.5 wrap-break-word text-sm text-red-300/70">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs font-semibold text-red-300/70 transition hover:text-red-200"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function AdminSupportTicketPage() {
  const params =
    useParams<{
      ticketId: string;
    }>();

  const router = useRouter();

  const ticketId = params?.ticketId;

  const [data, setData] =
    useState<PageData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [sendingMessage, setSendingMessage] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const loadTicket = useCallback(
    async (showFullLoader = true) => {
      if (!ticketId) {
        setError(
          'Support ticket ID is missing.',
        );

        setLoading(false);

        return;
      }

      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      try {
        const [
          ticketResponse,
          messagesResponse,
          attachmentsResponse,
          eventsResponse,
        ] = await Promise.all([
          adminSupportService.getTicket(
            ticketId,
          ),
          adminSupportService.getMessages(
            ticketId,
          ),
          adminSupportService.getAttachments(
            ticketId,
          ),
          adminSupportService.getEvents(
            ticketId,
          ),
        ]);

        const nextData: PageData = {
          ticket:
            ticketResponse.ticket,
          messages:
            messagesResponse.messages,
          attachments:
            attachmentsResponse.attachments,
          events:
            eventsResponse.events,
        };

        setData(nextData);

        const hasUnreadCustomerMessages =
          messagesResponse.messages.some(
            (message) =>
              !message.is_internal &&
              message.sender_id ===
                ticketResponse.ticket
                  .user_id &&
              !message.seen,
          );

        if (
          hasUnreadCustomerMessages
        ) {
          try {
            await adminSupportService.markSupportMessagesSeen(
              ticketId,
            );
          } catch (
            requestError
          ) {
            console.error(
              'Failed to mark support messages as seen:',
              requestError,
            );
          }
        }
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError,
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [ticketId],
  );

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadTicket();
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadTicket]);

  const handleStatusChange =
    async (
      status: SupportTicketStatus,
    ) => {
      if (!ticketId || !data) {
        return;
      }

      setActionLoading(true);
      setActionError(null);
      setDeleteError(null);

      try {
        await adminSupportService.updateStatus(
          ticketId,
          status,
        );

        await loadTicket(false);
      } catch (requestError) {
        setActionError(
          getErrorMessage(
            requestError,
          ),
        );

        throw requestError;
      } finally {
        setActionLoading(false);
      }
    };

  const handlePriorityChange =
    async (
      priority: SupportTicketPriority,
    ) => {
      if (!ticketId || !data) {
        return;
      }

      setActionLoading(true);
      setActionError(null);
      setDeleteError(null);

      try {
        await adminSupportService.updatePriority(
          ticketId,
          priority,
        );

        await loadTicket(false);
      } catch (requestError) {
        setActionError(
          getErrorMessage(
            requestError,
          ),
        );

        throw requestError;
      } finally {
        setActionLoading(false);
      }
    };

  const handleAssignmentChange =
    async (
      assignedTo: string | null,
    ) => {
      if (!ticketId || !data) {
        return;
      }

      setActionLoading(true);
      setActionError(null);
      setDeleteError(null);

      try {
        await adminSupportService.assignTicket(
          ticketId,
          assignedTo,
        );

        await loadTicket(false);
      } catch (requestError) {
        setActionError(
          getErrorMessage(
            requestError,
          ),
        );

        throw requestError;
      } finally {
        setActionLoading(false);
      }
    };

  const handleSendMessage =
    async (
      message: string,
      isInternal: boolean,
    ) => {
      if (!ticketId || !data) {
        return;
      }

      setSendingMessage(true);
      setActionError(null);
      setDeleteError(null);

      try {
        await adminSupportService.addMessage(
          ticketId,
          message,
          isInternal,
        );

        await loadTicket(false);
      } catch (requestError) {
        const messageText =
          getErrorMessage(
            requestError,
          );

        setActionError(messageText);

        throw requestError;
      } finally {
        setSendingMessage(false);
      }
    };

  const handleDeleteTicket =
    async () => {
      if (!ticketId || !data) {
        return;
      }

      if (
        data.ticket.status !==
        'CLOSED'
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete support ticket #${data.ticket.ticket_number}? This will permanently delete the ticket and its messages. This action cannot be undone.`,
        );

      if (!confirmed) {
        return;
      }

      setDeleting(true);
      setDeleteError(null);
      setActionError(null);

      try {
        await adminSupportService.deleteTicket(
          ticketId,
        );

        router.push(
          '/admin/support',
        );
      } catch (requestError) {
        setDeleteError(
          getErrorMessage(
            requestError,
          ),
        );

        setDeleting(false);
      }
    };

  if (loading) {
    return (
      <AdminDashboard title="Support Ticket">
        <div className="flex min-h-[60vh] items-center justify-center bg-[#050B18]">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/5">
              <Loader2
                size={25}
                className="animate-spin text-emerald-400"
              />
            </div>

            <p className="mt-4 text-sm text-white/35">
              Loading support ticket...
            </p>
          </div>
        </div>
      </AdminDashboard>
    );
  }

  if (error || !data) {
    return (
      <AdminDashboard title="Support Ticket">
        <div className="min-h-[60vh] bg-[#050B18]">
          <div className="mx-auto max-w-3xl">
            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin/support',
                )
              }
              className="mb-6 inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/60 transition hover:bg-white/8 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to support
            </button>

            <div className="rounded-3xl border border-red-400/15 bg-[#0B1426] p-6 shadow-2xl shadow-black/10">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                  <AlertCircle size={21} />
                </div>

                <div>
                  <h1 className="text-base font-semibold text-white">
                    Unable to load ticket
                  </h1>

                  <p className="mt-1 text-sm leading-6 text-white/45">
                    {error ??
                      'The requested support ticket could not be loaded.'}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void loadTicket()
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:from-emerald-400 hover:to-emerald-500"
                  >
                    <RefreshCw size={16} />
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminDashboard>
    );
  }

  const isClosed =
    data.ticket.status ===
    'CLOSED';

  return (
    <AdminDashboard title="Support Ticket">
      <div className="min-h-screen bg-[#050B18] pb-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/support',
              )
            }
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/60 transition hover:bg-white/8 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to support
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {isClosed && (
              <button
                type="button"
                onClick={() =>
                  void handleDeleteTicket()
                }
                disabled={
                  deleting ||
                  refreshing ||
                  actionLoading
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/8 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}

                {deleting
                  ? 'Deleting...'
                  : 'Delete ticket'}
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                void loadTicket(false)
              }
              disabled={
                refreshing ||
                deleting
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/60 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? 'animate-spin'
                    : undefined
                }
              />
              Refresh
            </button>
          </div>
        </div>

        <AdminSupportTicketHeader
          ticket={data.ticket}
        />

        <div className="mt-5 space-y-3">
          {deleteError && (
            <ErrorBanner
              title="Unable to delete ticket"
              message={deleteError}
              onDismiss={() =>
                setDeleteError(null)
              }
            />
          )}

          {actionError && (
            <ErrorBanner
              title="Action failed"
              message={actionError}
              onDismiss={() =>
                setActionError(null)
              }
            />
          )}
        </div>

        <div className="mt-5">
          <AdminSupportControls
            ticket={data.ticket}
            updating={actionLoading}
            onStatusChange={
              handleStatusChange
            }
            onPriorityChange={
              handlePriorityChange
            }
            onAssignmentChange={
              handleAssignmentChange
            }
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <AdminSupportMessageList
              messages={
                data.messages
              }
              customerId={
                data.ticket.user_id
              }
              loading={refreshing}
            />

            <AdminSupportMessageComposer
              disabled={
                actionLoading ||
                isClosed ||
                deleting
              }
              sending={
                sendingMessage
              }
              onSend={
                handleSendMessage
              }
            />
          </div>

          <aside className="min-w-0">
            <AdminSupportEventList
              events={data.events}
              loading={refreshing}
            />
          </aside>
        </div>

        {data.attachments.length >
          0 && (
          <section className="mt-5 overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#0B1426] via-[#0B1426] to-[#11102B] shadow-2xl shadow-black/10">
            <div className="border-b border-white/8 px-5 py-5">
              <h2 className="text-base font-semibold text-white">
                Attachments
              </h2>

              <p className="mt-1 text-sm text-white/35">
                {data.attachments.length}{' '}
                {data.attachments.length ===
                1
                  ? 'attachment'
                  : 'attachments'}{' '}
                associated with this ticket.
              </p>
            </div>

            <div className="divide-y divide-white/6">
              {data.attachments.map(
                (attachment) => (
                  <div
                    key={
                      attachment.id
                    }
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/75">
                        {
                          attachment.file_name
                        }
                      </p>

                      <p className="mt-1 text-[10px] text-white/30">
                        {
                          attachment.content_type
                        }{' '}
                        ·{' '}
                        {attachment.file_size.toLocaleString()}{' '}
                        bytes
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] text-white/25">
                      {new Date(
                        attachment.created_at,
                      ).toLocaleDateString(
                        'en-UG',
                      )}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>
        )}
      </div>
    </AdminDashboard>
  );
}