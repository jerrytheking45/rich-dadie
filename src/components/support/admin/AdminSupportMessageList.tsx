'use client';

import { useMemo } from 'react';
import {
  Check,
  CheckCheck,
  FileText,
  MessageSquare,
  Shield,
} from 'lucide-react';

import type { SupportMessage } from '@/src/lib/types/support';

interface AdminSupportMessageListProps {
  messages: SupportMessage[];
  customerId?: string | null;
  loading?: boolean;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function sortMessages(
  messages: SupportMessage[],
): SupportMessage[] {
  return [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime(),
  );
}

function MessageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-white/5" />
      </div>

      <div className="flex justify-end">
        <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-white/8" />
      </div>

      <div className="flex justify-start">
        <div className="h-20 w-3/4 animate-pulse rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}

function ReadReceipt({
  seen,
  light = false,
}: {
  seen: boolean;
  light?: boolean;
}) {
  const className = light
    ? seen
      ? 'text-sky-300'
      : 'text-white/35'
    : seen
      ? 'text-sky-400'
      : 'text-white/25';

  return (
    <span
      className={`inline-flex shrink-0 items-center ${className}`}
      title={seen ? 'Seen' : 'Sent'}
      aria-label={
        seen ? 'Seen' : 'Sent'
      }
    >
      {seen ? (
        <CheckCheck
          size={13}
          strokeWidth={2.4}
        />
      ) : (
        <Check
          size={13}
          strokeWidth={2.4}
        />
      )}
    </span>
  );
}

export default function AdminSupportMessageList({
  messages,
  customerId,
  loading = false,
}: AdminSupportMessageListProps) {
  const sortedMessages = useMemo(
    () => sortMessages(messages),
    [messages],
  );

  if (loading) {
    return <MessageSkeleton />;
  }

  if (sortedMessages.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-[#0B1426] px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/10 bg-purple-400/10 text-purple-300">
          <MessageSquare size={22} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-white/80">
          No messages yet
        </h3>

        <p className="mt-1 text-sm text-white/35">
          Messages and internal notes will appear here.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      {sortedMessages.map((message) => {
        const isInternal =
          message.is_internal;

        const isCustomer =
          Boolean(customerId) &&
          message.sender_id ===
            customerId;

        const isStaff = !isCustomer;

        return (
          <div
            key={message.id}
            className={`flex w-full ${
              isCustomer
                ? 'justify-start'
                : 'justify-end'
            }`}
          >
            <article
              className={[
                'max-w-[90%] rounded-[20px] px-4 py-3 shadow-lg sm:max-w-[82%]',
                isInternal
                  ? 'rounded-br-md border border-amber-400/15 bg-amber-400/8 text-amber-50'
                  : isStaff
                    ? 'rounded-br-md border border-emerald-400/10 bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-950/20'
                    : 'rounded-bl-md border border-white/8 bg-[#101D33] text-white/85',
              ].join(' ')}
            >
              <div
                className={`mb-2 flex items-center gap-2 ${
                  isCustomer
                    ? 'justify-start'
                    : 'justify-end'
                }`}
              >
                {isInternal && (
                  <Shield
                    size={14}
                    className="shrink-0 text-amber-300"
                  />
                )}

                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    isInternal
                      ? 'text-amber-300'
                      : isStaff
                        ? 'text-white/65'
                        : 'text-white/35'
                  }`}
                >
                  {isInternal
                    ? 'Internal note'
                    : isStaff
                      ? 'You'
                      : 'Customer'}
                </span>

                {isInternal && (
                  <span className="rounded-full border border-amber-400/15 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                    STAFF ONLY
                  </span>
                )}
              </div>

              <p className="whitespace-pre-wrap wrap-break-words text-sm leading-6">
                {message.message}
              </p>

              <div
                className={`mt-2 flex items-center gap-2 text-[10px] ${
                  isCustomer
                    ? 'justify-start text-white/25'
                    : isInternal
                      ? 'justify-end text-amber-300/50'
                      : 'justify-end text-white/45'
                }`}
              >
                <time
                  dateTime={
                    message.created_at
                  }
                >
                  {formatDate(
                    message.created_at,
                  )}
                </time>

                {message.updated_at !==
                  message.created_at && (
                  <>
                    <FileText size={11} />
                    <span>Edited</span>
                  </>
                )}

                {!isInternal && (
                  <ReadReceipt
                    seen={message.seen}
                    light={isStaff}
                  />
                )}
              </div>
            </article>
          </div>
        );
      })}
    </section>
  );
}