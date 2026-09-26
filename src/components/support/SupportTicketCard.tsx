'use client';

import {
  ChevronRight,
  Headphones,
} from 'lucide-react';

import type { SupportTicket } from '@/src/lib/types/support';

import SupportTicketStatus from './SupportTicketStatus';

interface SupportTicketCardProps {
  ticket: SupportTicket;
  onClick?: () => void;
}

const categoryLabels: Record<
  SupportTicket['category'],
  string
> = {
  ACCOUNT: 'Account',
  DEPOSIT: 'Deposit',
  INVESTMENT: 'Investment',
  WITHDRAWAL: 'Withdrawal',
  WALLET: 'Wallet',
  PAYMENT: 'Payment',
  VERIFICATION: 'Verification',
  SECURITY: 'Security',
  OTHER: 'Other',
};

const priorityLabels: Record<
  SupportTicket['priority'],
  string
> = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  URGENT: 'Urgent',
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default function SupportTicketCard({
  ticket,
  onClick,
}: SupportTicketCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group w-full min-w-0 text-left',
        'rounded-[22px] border border-white/7',
        'bg-[#0B1426]',
        'p-4 sm:p-5',
        'shadow-lg shadow-black/10',
        'transition-all duration-200',
        'hover:-translate-y-0.5',
        'hover:border-emerald-300/15',
        'hover:bg-[#0D172B]',
        'hover:shadow-xl hover:shadow-black/20',
        'active:scale-[0.99]',
        'focus:outline-none focus:ring-2 focus:ring-emerald-300/20',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/10">
          <Headphones
            size={17}
            className="text-purple-300"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-white/25">
              #{ticket.ticket_number}
            </span>

            <span className="truncate text-[9px] font-medium text-white/25">
              {formatDate(ticket.created_at)}
            </span>
          </div>

          <h3 className="mt-1 truncate text-[13px] font-black text-white sm:text-sm">
            {ticket.subject}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-white/6 bg-white/4 px-2.5 py-1 text-[9px] font-bold text-white/45">
              {categoryLabels[ticket.category]}
            </span>

            {ticket.priority !== 'NORMAL' && (
              <span
                className={[
                  'rounded-full border px-2.5 py-1',
                  'text-[9px] font-bold',
                  ticket.priority === 'URGENT'
                    ? 'border-rose-400/15 bg-rose-400/10 text-rose-300'
                    : ticket.priority === 'HIGH'
                      ? 'border-orange-400/15 bg-orange-400/10 text-orange-300'
                      : 'border-white/6 bg-white/4 text-white/35',
                ].join(' ')}
              >
                {priorityLabels[ticket.priority]}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <SupportTicketStatus
              status={ticket.status}
            />
          </div>

          <ChevronRight
            size={17}
            className="text-white/20 transition group-hover:translate-x-0.5 group-hover:text-emerald-300"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 sm:hidden">
        <SupportTicketStatus
          status={ticket.status}
        />

        <span className="text-[9px] font-medium text-white/20">
          View conversation
        </span>
      </div>
    </button>
  );
}