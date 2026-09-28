
'use client';

import {
  AlertCircle,
  ArrowLeft,
  Download,
  File,
  FileImage,
  FileText,
  Headphones,
  RefreshCw,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
//import Image from "next/image";

import SupportAttachmentPanel from '@/src/components/support/SupportAttachmentPanel';
import SupportMessageComposer from '@/src/components/support/SupportMessageComposer';
import SupportMessageList from '@/src/components/support/SupportMessageList';
import SupportTicketHeader from '@/src/components/support/SupportTicketHeader';

import { supportService } from '@/src/lib/services/supportService';

import {
  downloadSupportAttachment,
} from '@/src/lib/support/downloadAttachment';

import type {
  SupportAttachment,
  SupportMessage,
  SupportTicket,
} from '@/src/lib/types/support';

import {
  notifySupportUnreadChanged,
} from '@/src/lib/support/supportUnreadEvents';

const POLL_INTERVAL = 5000;

function hasUnreadIncomingMessages(
  messages: SupportMessage[],
  currentUserId: string,
): boolean {
  return messages.some(
    (message) =>
      !message.is_internal &&
      message.sender_id !== currentUserId &&
      !message.seen,
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
  if (attachment.content_type.startsWith('image/')) {
    return 'image';
  }

  if (attachment.content_type === 'application/pdf') {
    return 'pdf';
  }

  if (
    attachment.content_type === 'text/plain' ||
    attachment.content_type === 'text/csv'
  ) {
    return 'text';
  }

  return 'file';
}

function AttachmentPreview({
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
      <div className="flex h-full min-h-75 items-center justify-center px-6 py-10 text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/6 bg-white/4">
            <File
              size={25}
              className="text-white/25"
            />
          </div>

          <h3 className="mt-4 text-sm font-black text-white/70">
            Select an attachment
          </h3>

          <p className="mt-1 max-w-xs text-xs leading-5 text-white/30">
            Select a file from the attachments list to preview it here.
          </p>
        </div>
      </div>
    );
  }

  const kind = getAttachmentKind(attachment);

  return (
    <div className="flex h-full min-h-75 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/6 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
            {kind === 'image' ? (
              <FileImage
                size={17}
                className="text-emerald-300"
              />
            ) : kind === 'pdf' || kind === 'text' ? (
              <FileText
                size={17}
                className="text-emerald-300"
              />
            ) : (
              <File
                size={17}
                className="text-emerald-300"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">
              {attachment.file_name}
            </p>

            <p className="mt-0.5 text-[10px] text-white/30">
              {attachment.content_type} Â·{' '}
              {formatFileSize(attachment.file_size)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/7 bg-white/4 px-3 text-[10px] font-black text-white/60 transition hover:bg-white/8 hover:text-white"
          >
            <Download size={14} />

            <span className="hidden sm:inline">
              Download
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/7 bg-white/4 text-white/35 transition hover:bg-white/8 hover:text-white"
            aria-label="Close preview"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-[#050B15] p-3 sm:p-5">
        {loading ? (
          <div className="flex h-full min-h-65 items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={22}
                className="mx-auto animate-spin text-emerald-300"
              />

              <p className="mt-3 text-xs font-medium text-white/35">
                Loading preview...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full min-h-65 items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/8">
                <AlertCircle
                  size={22}
                  className="text-rose-300"
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
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-black text-[#04120D] transition hover:bg-emerald-200"
              >
                <Download size={14} />
                Download file
              </button>
            </div>
          </div>
        ) : previewUrl && kind === 'image' ? (
          <div className="flex min-h-full items-center justify-center">
            {/* Blob URLs are downloaded attachment data, so next/image optimization is not applicable here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={attachment.file_name}
              className="max-h-160 max-w-full rounded-2xl border border-white/7 object-contain shadow-2xl"
            />
          </div>
        ) : previewUrl && kind === 'pdf' ? (
          <div className="h-full min-h-150 overflow-hidden rounded-2xl border border-white/7 bg-white">
            <iframe
              src={previewUrl}
              title={attachment.file_name}
              className="h-full min-h-150 w-full"
            />
          </div>
        ) : kind === 'text' && previewUrl ? (
          <div className="min-h-full rounded-2xl border border-white/7 bg-[#07101F] p-4 sm:p-6">
            <iframe
              src={previewUrl}
              title={attachment.file_name}
              className="min-h-120 w-full rounded-xl bg-white p-3 text-black"
            />
          </div>
        ) : (
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/7 bg-white/3 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/7 bg-white/5">
                <File
                  size={28}
                  className="text-emerald-300"
                />
              </div>

              <h3 className="mt-5 break-all text-sm font-black text-white">
                {attachment.file_name}
              </h3>

              <p className="mt-2 text-xs text-white/35">
                {attachment.content_type}
              </p>

              <p className="mt-1 text-[11px] text-white/25">
                {formatFileSize(attachment.file_size)}
              </p>

              <button
                type="button"
                onClick={onDownload}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-black text-[#04120D] transition hover:bg-emerald-200"
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

export default function SupportTicketPage() {
  const router = useRouter();

  const params = useParams<{
    ticketId: string;
  }>();

  const ticketId = Array.isArray(params.ticketId)
    ? params.ticketId[0]
    : params.ticketId;

  const [ticket, setTicket] =
    useState<SupportTicket | null>(null);

  const [messages, setMessages] =
    useState<SupportMessage[]>([]);

  const [attachments, setAttachments] =
    useState<SupportAttachment[]>([]);

  const [selectedAttachment, setSelectedAttachment] =
    useState<SupportAttachment | null>(null);

  const [previewBlob, setPreviewBlob] =
    useState<Blob | null>(null);

  const [previewLoading, setPreviewLoading] =
    useState(false);

  const [previewError, setPreviewError] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [deletingAttachment, setDeletingAttachment] =
    useState<string | null>(null);  

  const [error, setError] =
    useState('');

  const [sendError, setSendError] =
    useState('');

  const ticketRef =
    useRef<SupportTicket | null>(null);

  useEffect(() => {
    ticketRef.current = ticket;
  }, [ticket]);

  const goBack = useCallback(() => {
    router.push('/investment/support');
  }, [router]);

  const markIncomingMessagesSeen =
    useCallback(
      async (
        currentMessages: SupportMessage[],
        currentUserId: string,
      ): Promise<SupportMessage[]> => {
        if (
          !ticketId ||
          !hasUnreadIncomingMessages(
            currentMessages,
            currentUserId,
          )
        ) {
          return currentMessages;
        }

        try {
          await supportService.markMessagesSeen(
            ticketId,
          );

          notifySupportUnreadChanged();

          const updatedMessages =
            await supportService.getMessages(
              ticketId,
            );

          return updatedMessages.messages;
        } catch (seenError) {
          console.error(
            'Failed to update support read state:',
            seenError,
          );

          return currentMessages;
        }
      },
      [ticketId],
    );

  const loadConversation =
    useCallback(
      async (
        showRefreshState = false,
      ) => {
        if (!ticketId) {
          setError(
            'Invalid support ticket.',
          );
          setLoading(false);
          return;
        }

        try {
          if (showRefreshState) {
            setRefreshing(true);
          }

          setError('');

          const [
            ticketResponse,
            messagesResponse,
            attachmentsResponse,
          ] = await Promise.all([
            supportService.getTicket(ticketId),
            supportService.getMessages(ticketId),
            supportService.getAttachments(ticketId),
          ]);

          const loadedTicket =
            ticketResponse.ticket;

          const loadedMessages =
            messagesResponse.messages;

          setTicket(loadedTicket);
          setMessages(loadedMessages);
          setAttachments(
            attachmentsResponse.attachments,
          );

          const updatedMessages =
            await markIncomingMessagesSeen(
              loadedMessages,
              loadedTicket.user_id,
            );

          setMessages(updatedMessages);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load this support ticket.',
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [
        ticketId,
        markIncomingMessagesSeen,
      ],
    );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadConversation();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      ticketRef.current = null;
    };
  }, [loadConversation]);

  useEffect(() => {
    if (!ticketId) {
      return;
    }

    const interval =
      window.setInterval(
        async () => {
          if (
            ticketRef.current?.status ===
            'CLOSED'
          ) {
            return;
          }

          try {
            const [
              latestTicket,
              latestMessages,
              latestAttachments,
            ] = await Promise.all([
              supportService.getTicket(ticketId),
              supportService.getMessages(ticketId),
              supportService.getAttachments(ticketId),
            ]);

            const currentTicket =
              latestTicket.ticket;

            const currentMessages =
              latestMessages.messages;

            setTicket(currentTicket);
            setMessages(currentMessages);
            setAttachments(
              latestAttachments.attachments,
            );

            const updatedMessages =
              await markIncomingMessagesSeen(
                currentMessages,
                currentTicket.user_id,
              );

            setMessages(updatedMessages);
          } catch (pollError) {
            console.error(
              'Support conversation polling failed:',
              pollError,
            );
          }
        },
        POLL_INTERVAL,
      );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    ticketId,
    markIncomingMessagesSeen,
  ]);

  const handleSendMessage =
    async (message: string) => {
      if (!ticketId) {
        return;
      }

      try {
        setSendError('');

        await supportService.addMessage(
          ticketId,
          message,
        );

        const [
          ticketResponse,
          messagesResponse,
        ] = await Promise.all([
          supportService.getTicket(ticketId),
          supportService.getMessages(ticketId),
        ]);

        setTicket(
          ticketResponse.ticket,
        );

        setMessages(
          messagesResponse.messages,
        );
      } catch (err) {
        const messageText =
          err instanceof Error
            ? err.message
            : 'Unable to send your message.';

        setSendError(messageText);

        throw err;
      }
    };

  const handleUploadAttachment =
    async (file: File) => {
      if (!ticketId) {
        return;
      }

      try {
        setUploading(true);

        await supportService.uploadAttachment(
          ticketId,
          file,
        );

        const response =
          await supportService.getAttachments(
            ticketId,
          );

        setAttachments(
          response.attachments,
        );
      } finally {
        setUploading(false);
      }
    };

  const handleDownloadAttachment =
    async (
      attachment: SupportAttachment,
    ) => {
      if (!ticketId) {
        return;
      }

      const blob =
        await supportService.downloadAttachment(
          ticketId,
          attachment.id,
        );

      downloadSupportAttachment(
        blob,
        attachment,
      );
    };

      const handleDeleteAttachment =
    async (
      attachment: SupportAttachment,
    ) => {
      if (!ticketId) {
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

        await supportService.deleteAttachment(
          ticketId,
          attachment.id,
        );

        setAttachments((current) =>
          current.filter(
            (item) =>
              item.id !== attachment.id,
          ),
        );

        if (
          selectedAttachment?.id ===
          attachment.id
        ) {
          setSelectedAttachment(null);
          setPreviewBlob(null);
          setPreviewError('');
          setPreviewLoading(false);
        }
      } catch (err) {
        setPreviewError(
          err instanceof Error
            ? err.message
            : 'Unable to delete this attachment.',
        );
      } finally {
        setDeletingAttachment(null);
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
        setSelectedAttachment(attachment);
        setPreviewBlob(null);
        setPreviewError('');
        setPreviewLoading(true);

        const blob =
          await supportService.downloadAttachment(
            ticketId,
            attachment.id,
          );

        setPreviewBlob(blob);
      } catch (err) {
        setPreviewError(
          err instanceof Error
            ? err.message
            : 'Unable to load this attachment.',
        );
      } finally {
        setPreviewLoading(false);
      }
    };

  const closePreview = () => {
    setSelectedAttachment(null);
    setPreviewBlob(null);
    setPreviewError('');
    setPreviewLoading(false);
  };

  const isClosed =
    ticket?.status === 'CLOSED';

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      {/* Page header */}
      <header className="sticky top-0 z-30 border-b border-white/6 bg-[#07101F]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/7 bg-white/4 text-white/50 transition hover:bg-white/8 hover:text-white"
              aria-label="Back to support"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 sm:flex">
                <Headphones
                  size={18}
                  className="text-emerald-300"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300">
                  REDIQ Support
                </p>

                <h1 className="truncate text-sm font-black text-white sm:text-base">
                  {ticket
                    ? `Ticket #${ticket.ticket_number}`
                    : 'Support conversation'}
                </h1>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadConversation(true)
            }
            disabled={refreshing}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/7 bg-white/4 text-white/40 transition hover:bg-white/8 hover:text-white disabled:opacity-40"
            aria-label="Refresh ticket"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? 'animate-spin'
                  : undefined
              }
            />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {loading ? (
          <div className="space-y-5">
            <div className="h-28 animate-pulse rounded-3xl bg-white/4" />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="h-140 animate-pulse rounded-3xl bg-white/4" />
              <div className="h-140 animate-pulse rounded-3xl bg-white/4" />
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-rose-400/15 bg-rose-400/8 p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/10">
                <AlertCircle
                  size={25}
                  className="text-rose-300"
                />
              </div>

              <h2 className="mt-4 text-base font-black text-white">
                Unable to load ticket
              </h2>

              <p className="mt-2 text-xs leading-5 text-rose-200/60">
                {error}
              </p>

              <div className="mt-5 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-xs font-black text-white/60 transition hover:bg-white/8 hover:text-white"
                >
                  Back to support
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void loadConversation(true)
                  }
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-black text-[#04120D] transition hover:bg-emerald-200 disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={
                      refreshing
                        ? 'animate-spin'
                        : undefined
                    }
                  />
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : ticket ? (
          <>
            {/* Ticket information */}
            <section className="overflow-hidden rounded-3xl border border-white/6 bg-[#07101F]">
              <SupportTicketHeader
                ticket={ticket}
                onBack={goBack}
              />
            </section>

            {/* Main workspace */}
            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
              {/* Conversation */}
              <section className="flex min-h-170 flex-col overflow-hidden rounded-3xl border border-white/6 bg-[#07101F]">
                <div className="flex shrink-0 items-center justify-between border-b border-white/6 px-4 py-3 sm:px-5">
                  <div>
                    <h2 className="text-xs font-black text-white">
                      Conversation
                    </h2>

                    <p className="mt-0.5 text-[10px] text-white/25">
                      {isClosed
                        ? 'This ticket is closed'
                        : 'Messages are secured'}
                    </p>
                  </div>

                  <div className="rounded-full border border-white/6 bg-white/3 px-2.5 py-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-white/35">
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
                  <SupportMessageList
                    messages={messages}
                    currentUserId={ticket.user_id}
                    loading={false}
                  />

                  {sendError && (
                    <div className="mt-4 rounded-xl border border-rose-400/15 bg-rose-400/8 px-4 py-3">
                      <p className="text-xs text-rose-300">
                        {sendError}
                      </p>
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-white/6">
                  <SupportMessageComposer
                    onSend={handleSendMessage}
                    disabled={isClosed}
                  />
                </div>
              </section>

              {/* Attachments / Preview */}
              <aside className="flex min-h-170 flex-col gap-4">
                <section className="shrink-0 overflow-hidden rounded-3xl border border-white/6 bg-[#07101F]">
                  <SupportAttachmentPanel
                    attachments={attachments}
                    onUpload={handleUploadAttachment}
                    onDownload={handleDownloadAttachment}
                    disabled={
                      isClosed || uploading
                    }
                    title="Attachments"
                    description="Add screenshots or documents to help explain your issue."
                  />

                  {attachments.length > 0 && (
                    <div className="border-t border-white/6 px-4 py-3">
                      <p className="text-[10px] text-white/25">
                        Select an attachment below to preview it.
                      </p>

                      <div className="mt-3 space-y-1.5">
{attachments.map(
  (attachment) => {
    const isSelected =
      selectedAttachment?.id ===
      attachment.id;

    const kind =
      getAttachmentKind(
        attachment,
      );

    const isDeleting =
      deletingAttachment ===
      attachment.id;

    return (
      <div
        key={attachment.id}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition ${
          isSelected
            ? 'border-emerald-300/20 bg-emerald-300/8'
            : 'border-transparent bg-white/3'
        }`}
      >
        <button
          type="button"
          onClick={() =>
            void handlePreviewAttachment(
              attachment,
            )
          }
          disabled={isDeleting}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
            {kind === 'image' ? (
              <FileImage
                size={15}
                className="text-emerald-300"
              />
            ) : kind === 'pdf' ||
              kind === 'text' ? (
              <FileText
                size={15}
                className="text-emerald-300"
              />
            ) : (
              <File
                size={15}
                className="text-white/40"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-white/75">
              {attachment.file_name}
            </p>

            <p className="mt-0.5 text-[9px] text-white/25">
              {formatFileSize(
                attachment.file_size,
              )}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            void handleDeleteAttachment(
              attachment,
            )
          }
          disabled={
            isDeleting ||
            isClosed ||
            uploading
          }
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/25 transition hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Delete ${attachment.file_name}`}
        >
          {isDeleting ? (
            <RefreshCw
              size={14}
              className="animate-spin"
            />
          ) : (
            <X size={15} />
          )}
        </button>
      </div>
    );
  },
)}
                      </div>
                    </div>
                  )}
                </section>

                {/* Preview */}
                <section className="min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/6 bg-[#07101F]">
                  <AttachmentPreview
                    attachment={
                      selectedAttachment
                    }
                    blob={previewBlob}
                    loading={previewLoading}
                    error={previewError}
                    onClose={closePreview}
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
              </aside>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}


