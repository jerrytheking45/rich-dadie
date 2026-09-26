'use client';

import type { SupportTicket } from '@/src/lib/types/support';

import SupportEmptyState from './SupportEmptyState';
import SupportTicketCard from './SupportTicketCard';

interface SupportTicketListProps {
  tickets: SupportTicket[];
  loading?: boolean;
  onTicketClick?: (ticket: SupportTicket) => void;
  onCreateTicket?: () => void;
}

export default function SupportTicketList({
  tickets,
  loading = false,
  onTicketClick,
  onCreateTicket,
}: SupportTicketListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={[
              'h-30 overflow-hidden rounded-[22px]',
              'border border-white/6',
              'bg-[#0B1426]',
              'animate-pulse',
            ].join(' ')}
          >
            <div className="h-full bg-linear-to-r from-transparent via-white/3 to-transparent" />
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <SupportEmptyState
        onCreateTicket={onCreateTicket}
      />
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="relative"
        >
          <SupportTicketCard
            ticket={ticket}
            onClick={() => onTicketClick?.(ticket)}
          />

          {ticket.unread_count > 0 && (
            <span
              className={[
                'pointer-events-none absolute right-3 top-3 z-10',
                'flex h-6 min-w-6 items-center justify-center',
                'rounded-full border border-rose-300/20',
                'bg-rose-500 px-2',
                'text-[9px] font-black leading-none text-white',
                'shadow-lg shadow-rose-950/30',
              ].join(' ')}
              aria-label={
                ticket.unread_count === 1
                  ? '1 new message'
                  : `${ticket.unread_count} new messages`
              }
            >
              {ticket.unread_count > 99
                ? '99+'
                : ticket.unread_count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}