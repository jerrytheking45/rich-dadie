'use client';

import {
  ArrowLeft,
  CalendarDays,
  Hash,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import type {
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
} from '@/src/lib/types/support';

interface AdminSupportTicketHeaderProps {
  ticket: SupportTicket;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    'en-UG',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(date);
}

function statusClass(
  status: SupportTicketStatus,
) {
  switch (status) {
    case 'OPEN':
      return 'border-emerald-400/15 bg-emerald-400/10 text-emerald-300';

    case 'IN_PROGRESS':
      return 'border-sky-400/15 bg-sky-400/10 text-sky-300';

    case 'WAITING_FOR_USER':
      return 'border-amber-400/15 bg-amber-400/10 text-amber-300';

    case 'RESOLVED':
      return 'border-violet-400/15 bg-violet-400/10 text-violet-300';

    case 'CLOSED':
      return 'border-white/8 bg-white/5 text-white/40';

    default:
      return 'border-white/8 bg-white/5 text-white/40';
  }
}

function priorityClass(
  priority: SupportTicketPriority,
) {
  switch (priority) {
    case 'URGENT':
      return 'border-red-400/15 bg-red-400/10 text-red-300';

    case 'HIGH':
      return 'border-orange-400/15 bg-orange-400/10 text-orange-300';

    case 'NORMAL':
      return 'border-sky-400/15 bg-sky-400/10 text-sky-300';

    case 'LOW':
      return 'border-white/8 bg-white/5 text-white/40';

    default:
      return 'border-white/8 bg-white/5 text-white/40';
  }
}

function formatStatus(
  status: SupportTicketStatus,
) {
  return status.replaceAll('_', ' ');
}

export default function AdminSupportTicketHeader({
  ticket,
}: AdminSupportTicketHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() =>
          router.push('/admin/support')
        }
        className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Support
      </button>

      <div className="overflow-hidden rounded-[26px] border border-white/8 bg-linear-to-br from-[#0B1426] via-[#0B1426] to-[#11102B] p-5 shadow-2xl shadow-black/10 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white/35">
                <Hash size={14} />
                {ticket.ticket_number}
              </span>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass(
                  ticket.status,
                )}`}
              >
                {formatStatus(
                  ticket.status,
                )}
              </span>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityClass(
                  ticket.priority,
                )}`}
              >
                {ticket.priority}
              </span>
            </div>

            <h1 className="mt-3 wrap-break-word text-xl font-bold tracking-tight text-white sm:text-2xl">
              {ticket.subject}
            </h1>

            <p className="mt-2 text-sm text-white/35">
              {ticket.category}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-95">
            {[
              {
                icon: User,
                label: 'Customer',
                value: ticket.user_id,
              },
              {
                icon: User,
                label: 'Assigned to',
                value:
                  ticket.assigned_to ??
                  'Unassigned',
              },
              {
                icon: CalendarDays,
                label: 'Created',
                value: formatDate(
                  ticket.created_at,
                ),
              },
              {
                icon: CalendarDays,
                label: 'Updated',
                value: formatDate(
                  ticket.updated_at,
                ),
              },
            ].map(
              ({
                icon: Icon,
                label,
                value,
              }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/8 bg-[#07101F] p-3.5"
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                    <Icon size={13} />
                    {label}
                  </div>

                  <p className="mt-1.5 break-all text-sm font-medium text-white/70">
                    {value}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        {(ticket.resolved_at ||
          ticket.closed_at) && (
          <div className="mt-5 border-t border-white/8 pt-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/35">
              {ticket.resolved_at && (
                <span>
                  Resolved:{' '}
                  <strong className="font-medium text-white/60">
                    {formatDate(
                      ticket.resolved_at,
                    )}
                  </strong>
                </span>
              )}

              {ticket.closed_at && (
                <span>
                  Closed:{' '}
                  <strong className="font-medium text-white/60">
                    {formatDate(
                      ticket.closed_at,
                    )}
                  </strong>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}