'use client';

import {
  MessageCircle,
  Plus,
  ShieldCheck,
} from 'lucide-react';

interface SupportEmptyStateProps {
  onCreateTicket?: () => void;
}

export default function SupportEmptyState({
  onCreateTicket,
}: SupportEmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/7 bg-[#0B1426] px-5 py-12 text-center shadow-xl shadow-black/10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 rounded-full bg-purple-500/8 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-emerald-400/10 bg-linear-to-br from-emerald-400/15 to-purple-400/10 shadow-lg shadow-black/10">
          <MessageCircle
            size={26}
            className="text-emerald-300"
          />
        </div>

        <div className="mt-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/8 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-300">
            <ShieldCheck size={11} />
            Rich Dadie Support
          </span>
        </div>

        <h3 className="mt-4 text-base font-black text-white sm:text-lg">
          No support tickets
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/35 sm:text-xs">
          Need help with your account, deposits,
          investments, withdrawals, or anything
          else? Our support team is ready to help.
        </p>

        {onCreateTicket && (
          <button
            type="button"
            onClick={onCreateTicket}
            className={[
              'mt-6 inline-flex items-center gap-2',
              'rounded-xl',
              'bg-emerald-400 px-5 py-2.5',
              'text-xs font-black text-[#04110B]',
              'shadow-lg shadow-emerald-950/20',
              'transition',
              'hover:bg-emerald-300',
              'active:scale-[0.98]',
              'focus:outline-none focus:ring-2 focus:ring-emerald-300/30',
            ].join(' ')}
          >
            <Plus size={15} />
            Create support ticket
          </button>
        )}
      </div>
    </div>
  );
}