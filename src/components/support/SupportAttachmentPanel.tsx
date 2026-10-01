'use client';

import {
  AlertCircle,
  Download,
  File,
  FileImage,
  FileText,
  Loader2,
  Paperclip,
  Upload,
} from 'lucide-react';
import {
  ChangeEvent,
  useRef,
  useState,
} from 'react';

import type {
  SupportAttachment,
} from '@/src/lib/types/support';

interface SupportAttachmentPanelProps {
  attachments: SupportAttachment[];
  onUpload: (file: File) => Promise<void>;
  onDownload: (
    attachment: SupportAttachment,
  ) => Promise<void>;
  disabled?: boolean;
  title?: string;
  description?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(
  contentType: string,
) {
  if (contentType.startsWith('image/')) {
    return FileImage;
  }

  if (
    contentType === 'application/pdf' ||
    contentType.startsWith('text/')
  ) {
    return FileText;
  }

  return File;
}

export default function SupportAttachmentPanel({
  attachments,
  onUpload,
  onDownload,
  disabled = false,
  title = 'Attachments',
  description = 'Upload screenshots or documents to help explain your issue.',
}: SupportAttachmentPanelProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [downloadingId, setDownloadingId] =
    useState<string | null>(null);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = '';

    if (!file) {
      return;
    }

    setError(null);

    if (file.size <= 0) {
      setError('The selected file is empty.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        'The attachment must be 10 MB or smaller.',
      );
      return;
    }

    if (
      !ACCEPTED_TYPES.includes(
        file.type,
      )
    ) {
      setError(
        'This file type is not supported. Use an image, PDF, TXT, or CSV file.',
      );
      return;
    }

    try {
      setUploading(true);
      await onUpload(file);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error &&
          uploadError.message
          ? uploadError.message
          : 'Unable to upload the attachment.',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (
    attachment: SupportAttachment,
  ) => {
    setError(null);

    try {
      setDownloadingId(
        attachment.id,
      );

      await onDownload(attachment);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error &&
          downloadError.message
          ? downloadError.message
          : 'Unable to download the attachment.',
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
      <div className="border-b border-white/7 px-4 py-3.5 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
              <Paperclip size={18} />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white">
                {title}
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/35">
                {description}
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/30">
            Max 10 MB
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-400/15 bg-rose-400/8 px-3 py-2.5">
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0 text-rose-300"
            />

            <p className="text-xs leading-5 text-rose-300">
              {error}
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          disabled={
            disabled || uploading
          }
          className="hidden"
        />

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={
            disabled || uploading
          }
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/8 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/12 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploading ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Upload size={15} />
          )}

          {uploading
            ? 'Uploading...'
            : 'Upload attachment'}
        </button>

        <p className="mt-2 text-[10px] text-white/25">
          JPG, PNG, GIF, WEBP, PDF, TXT or CSV.
        </p>

        {attachments.length > 0 && (
          <div className="mt-5 divide-y divide-white/6 rounded-2xl border border-white/6">
            {attachments.map(
              (attachment) => {
                const Icon =
                  getFileIcon(
                    attachment.content_type,
                  );

                const isDownloading =
                  downloadingId ===
                  attachment.id;

                return (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/45">
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white/75">
                        {attachment.file_name}
                      </p>

                      <p className="mt-0.5 text-[9px] text-white/25">
                        {formatFileSize(
                          attachment.file_size,
                        )}
                        {' · '}
                        {new Date(
                          attachment.created_at,
                        ).toLocaleDateString(
                          'en-UG',
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void handleDownload(
                          attachment,
                        )
                      }
                      disabled={
                        disabled ||
                        isDownloading
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/7 bg-white/4 text-white/40 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Download ${attachment.file_name}`}
                      title="Download attachment"
                    >
                      {isDownloading ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Download
                          size={15}
                        />
                      )}
                    </button>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
}
