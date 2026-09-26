'use client';

import type { SupportMessage } from '@/src/lib/types/support';

import SupportMessageBubble from './SupportMessageBubble';

interface SupportMessageListProps {
  messages: SupportMessage[];
  currentUserId?: string | null;
  loading?: boolean;
}

export default function SupportMessageList({
  messages,
  currentUserId,
  loading = false,
}: SupportMessageListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-start">
          <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-white/6" />
        </div>

        <div className="flex justify-end">
          <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-emerald-400/10" />
        </div>

        <div className="flex justify-start">
          <div className="h-20 w-3/4 animate-pulse rounded-2xl bg-white/6" />
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center py-10 text-center">
        <div>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/7 bg-white/4">
            <span className="text-lg">💬</span>
          </div>

          <p className="mt-3 text-sm font-bold text-white/55">
            No messages yet
          </p>

          <p className="mt-1 text-[11px] text-white/25">
            Send a message to start the conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const isMine =
          Boolean(currentUserId) &&
          message.sender_id === currentUserId;

        return (
          <SupportMessageBubble
            key={message.id}
            message={message}
            isMine={isMine}
          />
        );
      })}
    </div>
  );
}