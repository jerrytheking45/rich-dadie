
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FilePlus2,
  MessageSquare,
  Shield,
  UserCheck,
  UserMinus,
  XCircle,
  Zap,
} from 'lucide-react';

import type {
  SupportTicketEvent,
  SupportTicketEventType,
} from '@/src/lib/types/support';

interface AdminSupportEventListProps {
  events: SupportTicketEvent[];
  loading?: boolean;
}

function formatEventType(
  eventType: SupportTicketEventType,
): string {
  return eventType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function getEventIcon(
  eventType: SupportTicketEventType,
) {
  switch (eventType) {
    case 'CREATED':
      return <Zap size={15} />;

    case 'MESSAGE_ADDED':
      return <MessageSquare size={15} />;

    case 'STATUS_CHANGED':
      return <Clock3 size={15} />;

    case 'PRIORITY_CHANGED':
      return <AlertCircle size={15} />;

    case 'ASSIGNED':
      return <UserCheck size={15} />;

    case 'UNASSIGNED':
      return <UserMinus size={15} />;

    case 'REOPENED':
      return <Zap size={15} />;

    case 'RESOLVED':
      return <CheckCircle2 size={15} />;

    case 'CLOSED':
      return <XCircle size={15} />;

    case 'ATTACHMENT_ADDED':
      return <FilePlus2 size={15} />;

    default:
      return <Shield size={15} />;
  }
}

function getEventIconClass(
  eventType: SupportTicketEventType,
): string {
  switch (eventType) {
    case 'RESOLVED':
      return 'border-emerald-400/15 bg-emerald-400/10 text-emerald-300';

    case 'CLOSED':
      return 'border-white/10 bg-white/5 text-white/45';

    case 'PRIORITY_CHANGED':
      return 'border-amber-400/15 bg-amber-400/10 text-amber-300';

    case 'STATUS_CHANGED':
    case 'REOPENED':
      return 'border-sky-400/15 bg-sky-400/10 text-sky-300';

    case 'ASSIGNED':
      return 'border-violet-400/15 bg-violet-400/10 text-violet-300';

    case 'UNASSIGNED':
      return 'border-white/10 bg-white/5 text-white/40';

    case 'ATTACHMENT_ADDED':
      return 'border-cyan-400/15 bg-cyan-400/10 text-cyan-300';

    default:
      return 'border-white/10 bg-white/5 text-white/45';
  }
}

function formatEventData(
  data?: Record<string, unknown> | null,
): string[] {
  if (!data || Object.keys(data).length === 0) {
    return [];
  }

  return Object.entries(data).map(
    ([key, value]) => {
      let formattedValue: string;

      if (
        value === null ||
        value === undefined
      ) {
        formattedValue = '—';
      } else if (typeof value === 'object') {
        try {
          formattedValue =
            JSON.stringify(value);
        } catch {
          formattedValue = String(value);
        }
      } else {
        formattedValue = String(value);
      }

      const label = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) =>
          char.toUpperCase(),
        );

      return `${label}: ${formattedValue}`;
    },
  );
}

function EventSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex animate-pulse gap-4"
        >
          <div className="h-9 w-9 shrink-0 rounded-xl bg-white/5" />

          <div className="flex-1">
            <div className="mb-2 h-3 w-40 rounded bg-white/5" />
            <div className="mb-2 h-3 w-64 rounded bg-white/5" />
            <div className="h-3 w-24 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminSupportEventList({
  events,
  loading = false,
}: AdminSupportEventListProps) {
  if (loading) {
    return <EventSkeleton />;
  }

  if (events.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-white/10 bg-[#0B1426] px-6 py-10 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/30">
          <Shield size={21} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-white/80">
          No events yet
        </h3>

        <p className="mt-1 text-sm text-white/35">
          Ticket activity will appear here as it happens.
        </p>
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime(),
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#0B1426] via-[#0B1426] to-[#11102B] shadow-2xl shadow-black/10">
      <div className="border-b border-white/8 px-5 py-5">
        <h2 className="text-base font-semibold text-white">
          Activity timeline
        </h2>

        <p className="mt-1 text-sm text-white/35">
          Audit history for this support ticket.
        </p>
      </div>

      <div className="p-5">
        <div className="relative">
          <div className="absolute bottom-4 left-4.5 top-4 w-px bg-white/8" />

          <div className="space-y-6">
            {sortedEvents.map((event) => {
              const eventData =
                formatEventData(event.data);

              return (
                <article
                  key={event.id}
                  className="relative flex gap-4"
                >
                  <div
                    className={[
                      'relative z-10 flex h-9 w-9 shrink-0',
                      'items-center justify-center rounded-xl border',
                      getEventIconClass(
                        event.event_type,
                      ),
                    ].join(' ')}
                  >
                    {getEventIcon(
                      event.event_type,
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <h3 className="text-sm font-semibold text-white/85">
                        {formatEventType(
                          event.event_type,
                        )}
                      </h3>

                      <time
                        dateTime={
                          event.created_at
                        }
                        className="shrink-0 text-[10px] text-white/30"
                      >
                        {formatDate(
                          event.created_at,
                        )}
                      </time>
                    </div>

                    <p className="mt-1 text-[11px] text-white/30">
                      Actor:{' '}
                      <span className="font-mono text-white/40">
                        {event.actor_id}
                      </span>
                    </p>

                    {eventData.length > 0 && (
                      <div className="mt-3 rounded-xl border border-white/8 bg-[#07101F] px-3 py-2.5">
                        <div className="space-y-1">
                          {eventData.map(
                            (item) => (
                              <p
                                key={item}
                                className="wrap-break-word text-[11px] leading-5 text-white/45"
                              >
                                {item}
                              </p>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}