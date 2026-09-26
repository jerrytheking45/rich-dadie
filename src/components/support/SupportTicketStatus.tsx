'use client';

import type { SupportTicketStatus as TicketStatus } from '@/src/lib/types/support';

interface SupportTicketStatusProps {
  status: TicketStatus;
}

const statusConfig: Record<
  TicketStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  OPEN: {
    label: 'Open',
    className:
      'border-emerald-400/15 bg-emerald-400/10 text-emerald-300',
    dotClassName: 'bg-emerald-400',
  },

  IN_PROGRESS: {
    label: 'In progress',
    className:
      'border-sky-400/15 bg-sky-400/10 text-sky-300',
    dotClassName: 'bg-sky-400',
  },

  WAITING_FOR_USER: {
    label: 'Waiting for you',
    className:
      'border-amber-400/15 bg-amber-400/10 text-amber-300',
    dotClassName: 'bg-amber-400',
  },

  RESOLVED: {
    label: 'Resolved',
    className:
      'border-violet-400/15 bg-violet-400/10 text-violet-300',
    dotClassName: 'bg-violet-400',
  },

  CLOSED: {
    label: 'Closed',
    className:
      'border-white/8 bg-white/5 text-white/40',
    dotClassName: 'bg-white/30',
  },
};

export default function SupportTicketStatus({
  status,
}: SupportTicketStatusProps) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full border',
        'px-2.5 py-1',
        'text-[9px] font-black uppercase tracking-wide',
        config.className,
      ].join(' ')}
    >
      <span
        className={[
          'h-1.5 w-1.5 shrink-0 rounded-full',
          config.dotClassName,
        ].join(' ')}
        aria-hidden="true"
      />

      {config.label}
    </span>
  );
}