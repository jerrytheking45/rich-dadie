'use client';

import {
  ArrowLeft,
  Headphones,
} from 'lucide-react';

import type { SupportTicket } from '@/src/lib/types/support';

import SupportTicketStatus from './SupportTicketStatus';

interface SupportTicketHeaderProps {
  ticket: SupportTicket;
  onBack?: () => void;
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

export default function SupportTicketHeader({
  ticket,
  onBack,
}: SupportTicketHeaderProps) {
  return (
    <header className="border-b border-white/6 bg-[#0B1426]">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center',
            'rounded-xl border border-white/6 bg-white/4',
            'text-white/45 transition',
            'hover:border-white/10 hover:bg-white/7 hover:text-white',
            'focus:outline-none focus:ring-2 focus:ring-emerald-300/20',
          ].join(' ')}
          aria-label="Go back"
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10">
          <Headphones
            size={18}
            className="text-emerald-300"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-white/30">
              #{ticket.ticket_number}
            </span>

            <SupportTicketStatus
              status={ticket.status}
            />
          </div>

          <h1 className="mt-1 truncate text-sm font-black text-white">
            {ticket.subject}
          </h1>

          <p className="mt-0.5 text-[10px] font-medium text-white/35">
            {categoryLabels[ticket.category]}
          </p>
        </div>
      </div>
    </header>
  );
}