'use client';

import {
  Check,
  CheckCheck,
} from 'lucide-react';

import type { SupportMessage } from '@/src/lib/types/support';

interface SupportMessageBubbleProps {
  message: SupportMessage;
  isMine: boolean;
}

export default function SupportMessageBubble({
  message,
  isMine,
}: SupportMessageBubbleProps) {
  const formattedTime =
    new Date(message.created_at).toLocaleTimeString(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
      },
    );

  const showReadReceipt =
    isMine && !message.is_internal;

  const isSeen = message.seen === true;

  return (
    <div
      className={`flex w-full ${
        isMine
          ? 'justify-end'
          : 'justify-start'
      }`}
    >
      <div
        className={[
          'flex max-w-[82%] flex-col',
          isMine
            ? 'items-end'
            : 'items-start',
        ].join(' ')}
      >
        <div
          className={[
            'rounded-[20px] px-4 py-3',
            'text-sm leading-relaxed',
            'shadow-lg shadow-black/10',
            isMine
              ? [
                  'rounded-br-md',
                  'border border-emerald-300/10',
                  'bg-linear-to-br from-emerald-400 to-emerald-500',
                  'text-[#04110B]',
                ].join(' ')
              : [
                  'rounded-bl-md',
                  'border border-white/7',
                  'bg-[#101D33]',
                  'text-white/85',
                ].join(' '),
          ].join(' ')}
        >
          <p className="whitespace-pre-wrap wrap-break-word">
            {message.message}
          </p>
        </div>

        <div
          className={[
            'mt-1 flex items-center gap-1 px-1',
            'text-[9px] font-medium text-white/25',
            isMine
              ? 'justify-end'
              : 'justify-start',
          ].join(' ')}
        >
          <span>{formattedTime}</span>

          {message.updated_at !==
            message.created_at && (
            <span>(edited)</span>
          )}

          {showReadReceipt && (
            <span
              className="ml-0.5 inline-flex items-center"
              title={
                isSeen
                  ? 'Seen by support'
                  : 'Sent'
              }
              aria-label={
                isSeen
                  ? 'Seen by support'
                  : 'Sent'
              }
            >
              {isSeen ? (
                <CheckCheck
                  size={13}
                  strokeWidth={2.5}
                  className="text-sky-400"
                />
              ) : (
                <Check
                  size={13}
                  strokeWidth={2.5}
                  className="text-white/30"
                />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}