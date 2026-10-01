
'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertCircle,
  ArrowLeft,
  Download,
  File,
  FileImage,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import AdminDashboard from '@/src/components/admin/AdminDashboard';

import SupportAttachmentPanel from '@/src/components/support/SupportAttachmentPanel';

import AdminSupportControls from '@/src/components/support/admin/AdminSupportControls';
import AdminSupportEventList from '@/src/components/support/admin/AdminSupportEventList';
import AdminSupportMessageComposer from '@/src/components/support/admin/AdminSupportMessageComposer';
import AdminSupportMessageList from '@/src/components/support/admin/AdminSupportMessageList';
import AdminSupportTicketHeader from '@/src/components/support/admin/AdminSupportTicketHeader';

import {
  downloadSupportAttachment,
} from '@/src/lib/support/downloadAttachment';

import {
  adminSupportService,
} from '@/src/lib/services/adminSupportService';

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

function getErrorMessage(error: unknown): string {
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
    <div className="rounded-2xl border border-red-400/15 bg-red-400/6 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
          <AlertCircle size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-200">
            {title}
          </p>

          <p className="mt-0.5 wrap-break-word text-sm leading-5 text-red-300/70">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs font-semibold text-red-300/60 transition hover:text-red-200"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getAttachmentKind(
  attachment: SupportAttachment,
): 'image' | 'pdf' | 'text' | 'file' {
  if (
    attachment.content_type.startsWith('image/')
  ) {
    return 'image';
  }

  if (
    attachment.content_type ===
    'application/pdf'
  ) {
    return 'pdf';
  }

  if (
    attachment.content_type ===
      'text/plain' ||
    attachment.content_type ===
      'text/csv'
  ) {
    return 'text';
  }

  return 'file';
}

function getAttachmentIcon(
  attachment: SupportAttachment,
  size = 16,
) {
  const kind = getAttachmentKind(attachment);

  if (kind === 'image') {
    return (
      <FileImage
        size={size}
        className="text-emerald-300"
      />
    );
  }

  if (
    kind === 'pdf' ||
    kind === 'text'
  ) {
    return (
      <FileText
        size={size}
        className="text-emerald-300"
      />
    );
  }

  return (
    <File
      size={size}
      className="text-white/40"
    />
  );
}

function AdminAttachmentPreview({
  attachment,
  blob,
  loading,
  error,
  onClose,
  onDownload,
}: {
  attachment: SupportAttachment | null;
  blob: Blob | null;
  loading: boolean;
  error: string;
  onClose: () => void;
  onDownload: () => void;
}) {
  const previewUrl = useMemo(() => {
    if (!blob) {
      return null;
    }

    return window.URL.createObjectURL(blob);
  }, [blob]);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    return () => {
      window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!attachment) {
    return (
      <div className="flex min-h-100 items-center justify-center rounded-3xl border border-white/6 bg-[#07101F] px-6 py-12">
        <div className="max-w-xs text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/7 bg-white/4">
            <File
              size={27}
              className="text-white/20"
            />
          </div>

          <h3 className="mt-5 text-sm font-bold text-white/70">
            Attachment preview
          </h3>

          <p className="mt-2 text-xs leading-5 text-white/30">
            Select an attachment from the file list to preview it here.
          </p>
        </div>
      </div>
    );
  }

  const kind =
    getAttachmentKind(attachment);

  return (
    <div className="flex min-h-100 flex-col overflow-hidden rounded-3xl border border-white/6 bg-[#07101F]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/6 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/6 bg-white/4">
            {getAttachmentIcon(
              attachment,
              17,
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">
              {attachment.file_name}
            </p>

            <p className="mt-1 truncate text-[10px] text-white/30">
              {attachment.content_type}
              {' · '}
              {formatFileSize(
                attachment.file_size,
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/7 bg-white/4 px-3 text-[10px] font-bold text-white/60 transition hover:bg-white/8 hover:text-white"
          >
            <Download size={14} />

            <span className="hidden sm:inline">
              Download
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/7 bg-white/4 text-white/35 transition hover:bg-white/8 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-[#050B15] p-3 sm:p-5">
        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <Loader2
                size={23}
                className="mx-auto animate-spin text-emerald-300"
              />

              <p className="mt-3 text-xs font-medium text-white/35">
                Loading preview...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/8">
                <AlertCircle
                  size={22}
                  className="text-red-300"
                />
              </div>

              <p className="mt-3 text-xs font-bold text-white/70">
                Unable to preview this file
              </p>

              <p className="mt-1 text-[11px] leading-5 text-white/30">
                {error}
              </p>

              <button
                type="button"
                onClick={onDownload}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-bold text-[#04120D] transition hover:bg-emerald-200"
              >
                <Download size={14} />
                Download file
              </button>
            </div>
          </div>
        ) : previewUrl &&
          kind === 'image' ? (
          <div className="flex min-h-full items-center justify-center">
            {/* Blob URL — next/image optimization is not applicable here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={attachment.file_name}
              className="max-h-160 max-w-full rounded-2xl border border-white/7 object-contain shadow-2xl"
            />
          </div>
        ) : previewUrl &&
          kind === 'pdf' ? (
          <div className="h-full min-h-150 overflow-hidden rounded-2xl border border-white/7 bg-white">
            <iframe
              src={previewUrl}
              title={attachment.file_name}
              className="h-full min-h-150 w-full"
            />
          </div>
        ) : previewUrl &&
          kind === 'text' ? (
          <div className="min-h-full rounded-2xl border border-white/7 bg-[#07101F] p-4 sm:p-6">
            <iframe
              src={previewUrl}
              title={attachment.file_name}
              className="min-h-120 w-full rounded-xl bg-white p-3 text-black"
            />
          </div>
        ) : (
          <div className="flex min-h-80 items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/7 bg-white/3 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/7 bg-white/5">
                <File
                  size={28}
                  className="text-emerald-300"
                />
              </div>

              <h3 className="mt-5 break-all text-sm font-bold text-white">
                {attachment.file_name}
              </h3>

              <p className="mt-2 text-xs text-white/35">
                {attachment.content_type}
              </p>

              <p className="mt-1 text-[11px] text-white/25">
                {formatFileSize(
                  attachment.file_size,
                )}
              </p>

              <button
                type="button"
                onClick={onDownload}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-bold text-[#04120D] transition hover:bg-emerald-200"
              >
                <Download size={14} />
                Download file
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AttachmentTable({
  attachments,
  selectedAttachment,
  deletingAttachment,
  onPreview,
  onDownload,
  onDelete,
}: {
  attachments: SupportAttachment[];
  selectedAttachment: SupportAttachment | null;
  deletingAttachment: string | null;
  onPreview: (
    attachment: SupportAttachment,
  ) => void;
  onDownload: (
    attachment: SupportAttachment,
  ) => void;
  onDelete: (
    attachment: SupportAttachment,
  ) => void;
}) {
  if (attachments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/8 bg-white/2 px-6 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/4">
          <File
            size={21}
            className="text-white/20"
          />
        </div>

        <p className="mt-3 text-xs font-semibold text-white/50">
          No attachments
        </p>

        <p className="mt-1 text-[11px] text-white/25">
          Files uploaded to this ticket will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/6">
      {/* Desktop table header */}
      <div className="hidden grid-cols-[minmax(0,1fr)_150px_110px_130px] gap-4 border-b border-white/6 bg-white/2 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/25 md:grid">
        <span>File</span>
        <span>Type</span>
        <span>Size</span>
        <span className="text-right">
          Actions
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {attachments.map(
          (attachment) => {
            const isSelected =
              selectedAttachment?.id ===
              attachment.id;

            const isDeleting =
              deletingAttachment ===
              attachment.id;

            return (
              <div
                key={attachment.id}
                className={`group grid gap-3 px-4 py-3 transition md:grid-cols-[minmax(0,1fr)_150px_110px_130px] md:items-center md:gap-4 ${
                  isSelected
                    ? 'bg-emerald-300/5'
                    : 'bg-transparent hover:bg-white/2'
                }`}
              >
                {/* File */}
                <button
                  type="button"
                  onClick={() =>
                    onPreview(
                      attachment,
                    )
                  }
                  disabled={
                    isDeleting
                  }
                  className="flex min-w-0 items-center gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      isSelected
                        ? 'border-emerald-300/15 bg-emerald-300/8'
                        : 'border-white/6 bg-white/3'
                    }`}
                  >
                    {getAttachmentIcon(
                      attachment,
                      17,
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white/80">
                      {attachment.file_name}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-white/25">
                      Uploaded by{' '}
                      {attachment.uploaded_by ===
                      attachment.ticket_id
                        ? 'user'
                        : 'support'}
                    </p>
                  </div>
                </button>

                {/* Type */}
                <div className="hidden min-w-0 md:block">
                  <p className="truncate text-[10px] text-white/35">
                    {attachment.content_type}
                  </p>
                </div>

                {/* Size */}
                <div className="hidden md:block">
                  <p className="text-[10px] text-white/35">
                    {formatFileSize(
                      attachment.file_size,
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onPreview(
                        attachment,
                      )
                    }
                    disabled={
                      isDeleting
                    }
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/7 bg-white/3 px-2.5 text-[10px] font-semibold text-white/45 transition hover:bg-white/7 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FileText
                      size={13}
                    />

                    <span className="hidden sm:inline">
                      Preview
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDownload(
                        attachment,
                      )
                    }
                    disabled={
                      isDeleting
                    }
                    aria-label={`Download ${attachment.file_name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/7 bg-white/3 text-white/35 transition hover:bg-white/7 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Download
                      size={14}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        attachment,
                      )
                    }
                    disabled={
                      isDeleting
                    }
                    aria-label={`Delete ${attachment.file_name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/10 bg-red-400/5 text-red-300/55 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isDeleting ? (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2
                        size={14}
                      />
                    )}
                  </button>
                </div>

                {/* Mobile metadata */}
                <div className="flex min-w-0 items-center gap-2 md:hidden">
                  <span className="truncate text-[10px] text-white/25">
                    {attachment.content_type}
                  </span>

                  <span className="text-white/10">
                    ·
                  </span>

                  <span className="shrink-0 text-[10px] text-white/25">
                    {formatFileSize(
                      attachment.file_size,
                    )}
                  </span>
                </div>
              </div>
            );
          },
        )}
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

  const ticketId =
    params?.ticketId;

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

  const [deletingAttachment, setDeletingAttachment] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const [selectedAttachment, setSelectedAttachment] =
    useState<SupportAttachment | null>(
      null,
    );

  const [previewBlob, setPreviewBlob] =
    useState<Blob | null>(null);

  const [previewLoading, setPreviewLoading] =
    useState(false);

  const [previewError, setPreviewError] =
    useState('');

  const loadTicket =
    useCallback(
      async (
        showFullLoader = true,
      ) => {
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
                  ticketResponse
                    .ticket.user_id &&
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
        } catch (
          requestError
        ) {
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
      } catch (
        requestError
      ) {
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
      } catch (
        requestError
      ) {
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
      } catch (
        requestError
      ) {
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
      } catch (
        requestError
      ) {
        setActionError(
          getErrorMessage(
            requestError,
          ),
        );

        throw requestError;
      } finally {
        setSendingMessage(false);
      }
    };

  const handleUploadAttachment =
    async (
      file: File,
    ) => {
      if (!ticketId || !data) {
        return;
      }

      setActionError(null);

      try {
        await adminSupportService.uploadAttachment(
          ticketId,
          file,
        );

        await loadTicket(false);
      } catch (
        requestError
      ) {
        setActionError(
          getErrorMessage(
            requestError,
          ),
        );

        throw requestError;
      }
    };

  const handleDownloadAttachment =
    async (
      attachment: SupportAttachment,
    ) => {
      if (!ticketId) {
        return;
      }

      try {
        const blob =
          await adminSupportService.downloadAttachment(
            ticketId,
            attachment.id,
          );

        downloadSupportAttachment(
          blob,
          attachment,
        );
      } catch (
        requestError
      ) {
        setActionError(
          getErrorMessage(
            requestError,
          ),
        );
      }
    };

  const handlePreviewAttachment =
    async (
      attachment: SupportAttachment,
    ) => {
      if (!ticketId) {
        return;
      }

      try {
        setSelectedAttachment(
          attachment,
        );
        setPreviewBlob(null);
        setPreviewError('');
        setPreviewLoading(true);

        const blob =
          await adminSupportService.downloadAttachment(
            ticketId,
            attachment.id,
          );

        setPreviewBlob(blob);
      } catch (
        requestError
      ) {
        setPreviewError(
          getErrorMessage(
            requestError,
          ),
        );
      } finally {
        setPreviewLoading(false);
      }
    };

  const handleDeleteAttachment =
    async (
      attachment: SupportAttachment,
    ) => {
      if (!ticketId || !data) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete "${attachment.file_name}"? This attachment will be permanently deleted.`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingAttachment(
          attachment.id,
        );
        setActionError(null);

        await adminSupportService.deleteAttachment(
          ticketId,
          attachment.id,
        );

        setData(
          (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,
              attachments:
                current.attachments.filter(
                  (item) =>
                    item.id !==
                    attachment.id,
                ),
            };
          },
        );

        if (
          selectedAttachment?.id ===
          attachment.id
        ) {
          setSelectedAttachment(
            null,
          );
          setPreviewBlob(null);
          setPreviewError('');
          setPreviewLoading(false);
        }
      } catch (
        requestError
      ) {
        setActionError(
          getErrorMessage(
            requestError,
          ),
        );
      } finally {
        setDeletingAttachment(
          null,
        );
      }
    };

  const closeAttachmentPreview =
    () => {
      setSelectedAttachment(null);
      setPreviewBlob(null);
      setPreviewError('');
      setPreviewLoading(false);
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
          `Delete support ticket #${data.ticket.ticket_number}? This will permanently delete the ticket, messages, events, and attachments. This action cannot be undone.`,
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
      } catch (
        requestError
      ) {
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
        <div className="flex min-h-[70vh] items-center justify-center bg-[#050B18]">
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
        <div className="min-h-[70vh] bg-[#050B18] px-4 py-6 sm:px-6">
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

            <div className="rounded-3xl border border-red-400/15 bg-[#0B1426] p-6 shadow-2xl">
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
      <div className="min-h-screen bg-[#050B18] pb-8">
        <div className="mx-auto w-full max-w-[1600px] px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
          {/* ========================================================= */}
          {/* TOP COMMAND BAR                                           */}
          {/* ========================================================= */}

          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/6 bg-[#07101F] p-3 shadow-xl shadow-black/10 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    '/admin/support',
                  )
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white/45 transition hover:bg-white/8 hover:text-white"
                aria-label="Back to support"
              >
                <ArrowLeft size={17} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                    Support workspace
                  </span>

                  {isClosed && (
                    <span className="rounded-full border border-white/7 bg-white/4 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/35">
                      Closed
                    </span>
                  )}
                </div>

                <h1 className="mt-1 truncate text-base font-bold text-white sm:text-lg">
                  Ticket #
                  {
                    data.ticket
                      .ticket_number
                  }
                </h1>
              </div>
            </div>

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
                    actionLoading ||
                    deletingAttachment !==
                      null
                  }
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/7 px-3 text-[11px] font-bold text-red-300 transition hover:bg-red-400/12 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleting ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2
                      size={15}
                    />
                  )}

                  {deleting
                    ? 'Deleting...'
                    : 'Delete ticket'}
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  void loadTicket(
                    false,
                  )
                }
                disabled={
                  refreshing ||
                  deleting
                }
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 text-[11px] font-bold text-white/55 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCw
                  size={15}
                  className={
                    refreshing
                      ? 'animate-spin'
                      : undefined
                  }
                />

                {refreshing
                  ? 'Refreshing...'
                  : 'Refresh'}
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TICKET HEADER                                              */}
          {/* ========================================================= */}

          <section className="rounded-3xl border border-white/6 bg-[#07101F] shadow-xl shadow-black/10">
            <AdminSupportTicketHeader
              ticket={
                data.ticket
              }
            />
          </section>

          {/* ========================================================= */}
          {/* ALERTS                                                     */}
          {/* ========================================================= */}

          {(deleteError ||
            actionError) && (
            <div className="mt-4 space-y-3">
              {deleteError && (
                <ErrorBanner
                  title="Unable to delete ticket"
                  message={
                    deleteError
                  }
                  onDismiss={() =>
                    setDeleteError(
                      null,
                    )
                  }
                />
              )}

              {actionError && (
                <ErrorBanner
                  title="Action failed"
                  message={
                    actionError
                  }
                  onDismiss={() =>
                    setActionError(
                      null,
                    )
                  }
                />
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* CONTROL CENTER                                              */}
          {/* ========================================================= */}

          <section className="mt-5">
            <div className="mb-2 flex items-center justify-between px-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                  Ticket management
                </p>

                <h2 className="mt-1 text-sm font-bold text-white/75">
                  Status, priority & assignment
                </h2>
              </div>
            </div>

            <AdminSupportControls
              ticket={
                data.ticket
              }
              updating={
                actionLoading
              }
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
          </section>

          {/* ========================================================= */}
          {/* MAIN WORKSPACE                                              */}
          {/* ========================================================= */}

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* ======================================================= */}
            {/* LEFT — CONVERSATION */}
            {/* ======================================================= */}

            <main className="min-w-0 space-y-5">
              <section className="overflow-hidden rounded-3xl border border-white/6 bg-[#07101F]">
                <div className="flex items-center justify-between border-b border-white/6 px-4 py-4 sm:px-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                      Customer conversation
                    </p>

                    <h2 className="mt-1 text-sm font-bold text-white/80">
                      Messages
                    </h2>
                  </div>

                  <div className="rounded-full border border-white/6 bg-white/3 px-2.5 py-1">
                    <span className="text-[10px] font-semibold text-white/30">
                      {
                        data
                          .messages
                          .length
                      }{' '}
                      {data
                        .messages
                        .length ===
                      1
                        ? 'message'
                        : 'messages'}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-5">
                  <AdminSupportMessageList
                    messages={
                      data.messages
                    }
                    customerId={
                      data.ticket
                        .user_id
                    }
                    loading={
                      refreshing
                    }
                  />
                </div>
              </section>

              {!isClosed && (
                <section className="rounded-3xl border border-white/6 bg-[#07101F]">
                  <div className="border-b border-white/6 px-4 py-4 sm:px-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                      Response
                    </p>

                    <h2 className="mt-1 text-sm font-bold text-white/80">
                      Reply to ticket
                    </h2>
                  </div>

                  <div className="p-3 sm:p-5">
                    <AdminSupportMessageComposer
                      disabled={
                        actionLoading ||
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
                </section>
              )}

              {isClosed && (
                <div className="rounded-2xl border border-white/6 bg-white/2 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/4">
                      <AlertCircle
                        size={15}
                        className="text-white/30"
                      />
                    </div>

                    <p className="text-xs text-white/35">
                      This ticket is closed. New replies are disabled, but administrators can still manage existing attachments.
                    </p>
                  </div>
                </div>
              )}
            </main>

            {/* ======================================================= */}
            {/* RIGHT — EVENTS */}
            {/* ======================================================= */}

            <aside className="min-w-0">
              <section className="overflow-hidden rounded-3xl border border-white/6 bg-[#07101F]">
                <div className="border-b border-white/6 px-4 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                    Ticket history
                  </p>

                  <h2 className="mt-1 text-sm font-bold text-white/80">
                    Activity
                  </h2>
                </div>

                <div className="p-3 sm:p-4">
                  <AdminSupportEventList
                    events={
                      data.events
                    }
                    loading={
                      refreshing
                    }
                  />
                </div>
              </section>
            </aside>
          </div>

          {/* ========================================================= */}
          {/* ATTACHMENTS                                                 */}
          {/* ========================================================= */}

          <section className="mt-5 overflow-hidden rounded-3xl border border-white/6 bg-[#07101F]">
            <div className="border-b border-white/6 px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                      Files & evidence
                    </p>

                    <span className="rounded-full border border-white/6 bg-white/3 px-2 py-0.5 text-[9px] font-bold text-white/30">
                      {
                        data
                          .attachments
                          .length
                      }
                    </span>
                  </div>

                  <h2 className="mt-1 text-sm font-bold text-white/80">
                    Ticket attachments
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    Screenshots, documents and other files associated with this ticket.
                  </p>
                </div>

                <div className="shrink-0">
                  <SupportAttachmentPanel
                    attachments={
                      data.attachments
                    }
                    onUpload={
                      handleUploadAttachment
                    }
                    onDownload={
                      handleDownloadAttachment
                    }
                    disabled={
                      isClosed ||
                      deleting
                    }
                    title="Upload attachment"
                    description="Add a screenshot or document to this ticket."
                  />
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-5">
              <AttachmentTable
                attachments={
                  data.attachments
                }
                selectedAttachment={
                  selectedAttachment
                }
                deletingAttachment={
                  deletingAttachment
                }
                onPreview={
                  (
                    attachment,
                  ) =>
                    void handlePreviewAttachment(
                      attachment,
                    )
                }
                onDownload={
                  (
                    attachment,
                  ) =>
                    void handleDownloadAttachment(
                      attachment,
                    )
                }
                onDelete={
                  (
                    attachment,
                  ) =>
                    void handleDeleteAttachment(
                      attachment,
                    )
                }
              />
            </div>
          </section>

          {/* ========================================================= */}
          {/* PREVIEW                                                     */}
          {/* ========================================================= */}

          <section className="mt-5">
            <div className="mb-2 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                File viewer
              </p>

              <h2 className="mt-1 text-sm font-bold text-white/75">
                Attachment preview
              </h2>
            </div>

            <AdminAttachmentPreview
              attachment={
                selectedAttachment
              }
              blob={
                previewBlob
              }
              loading={
                previewLoading
              }
              error={
                previewError
              }
              onClose={
                closeAttachmentPreview
              }
              onDownload={() => {
                if (
                  selectedAttachment
                ) {
                  void handleDownloadAttachment(
                    selectedAttachment,
                  );
                }
              }}
            />
          </section>
        </div>
      </div>
    </AdminDashboard>
  );
}
