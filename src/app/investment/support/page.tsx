
'use client';

import {
  ArrowLeft,
  Headphones,
  Plus,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import SupportTicketList from '@/src/components/support/SupportTicketList';
import { supportService } from '@/src/lib/services/supportService';
import type { SupportTicket } from '@/src/lib/types/support';

export default function SupportPage() {
  const router = useRouter();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadTickets = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await supportService.listMyTickets(20, 0);

      setTickets(response.tickets);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your support tickets.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initialLoad = async () => {
      try {
        const response =
          await supportService.listMyTickets(
            20,
            0,
          );

        if (cancelled) {
          return;
        }

        setTickets(response.tickets);
        setError('');
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load your support tickets.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050B18] pb-28 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute -right-32 top-80 h-72 w-72 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/6 bg-[#050B18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2.5 px-3 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className={[
                'flex h-9 w-9 shrink-0 items-center justify-center',
                'rounded-xl border border-white/7 bg-white/4',
                'text-white/45 transition',
                'hover:bg-white/7 hover:text-white',
                'focus:outline-none focus:ring-2 focus:ring-emerald-300/20',
              ].join(' ')}
              aria-label="Go back"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10">
              <Headphones
                size={19}
                className="text-emerald-300"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-black text-white sm:text-base">
                Support
              </h1>

              <p className="truncate text-[10px] font-medium text-white/30 sm:text-xs">
                We are here to help
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/investment/support/new')}
            className={[
              'flex h-9 shrink-0 items-center gap-1.5',
              'rounded-xl',
              'bg-emerald-400 px-3',
              'text-[10px] font-black text-[#04110B]',
              'shadow-lg shadow-emerald-950/20',
              'transition',
              'hover:bg-emerald-300',
              'active:scale-[0.98]',
              'sm:px-3.5 sm:text-xs',
            ].join(' ')}
          >
            <Plus size={16} aria-hidden="true" />

            <span className="hidden sm:inline">New ticket</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative mx-auto max-w-2xl px-3 py-4 sm:px-5 sm:py-5">
        {/* Hero */}
        <section className="relative mb-4 overflow-hidden rounded-[22px] border border-white/7 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-4 shadow-xl shadow-black/15 sm:p-5">
          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-purple-500/8 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10">
                <ShieldCheck
                  size={17}
                  className="text-emerald-300"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300">
                  REDIQ Care
                </p>

                <p className="mt-0.5 text-[10px] text-white/30">
                  Secure customer support
                </p>
              </div>
            </div>

            <h2 className="mt-4 text-xl font-black tracking-tight text-white sm:text-2xl">
              How can we help?
            </h2>

            <p className="mt-2 max-w-md text-[11px] leading-5 text-white/35 sm:text-xs">
              Contact the REDIQ support team whenever you need
              assistance with your account, investments, payments or
              withdrawals.
            </p>
          </div>
        </section>

        {/* Tickets heading */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
              Support center
            </p>

            <h2 className="mt-1 text-base font-black text-white sm:text-lg">
              Your tickets
            </h2>

            {!loading && (
              <p className="mt-0.5 text-[10px] font-medium text-white/30 sm:text-xs">
                {tickets.length === 0
                  ? 'No conversations yet'
                  : `${tickets.length} ticket${
                      tickets.length === 1 ? '' : 's'
                    }`}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => void loadTickets(true)}
            disabled={refreshing}
            className={[
              'flex h-9 w-9 items-center justify-center',
              'rounded-xl border border-white/7 bg-white/4',
              'text-white/40 transition',
              'hover:bg-white/7 hover:text-white',
              'disabled:opacity-40',
            ].join(' ')}
            aria-label="Refresh tickets"
          >
            <RefreshCw
              size={16}
              className={refreshing ? 'animate-spin' : undefined}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-400/15 bg-rose-400/8 px-4 py-3">
            <p className="text-xs leading-5 text-rose-300">{error}</p>

            <button
              type="button"
              onClick={() => void loadTickets()}
              className="mt-2 text-xs font-black text-rose-300 underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Ticket list */}
        <SupportTicketList
          tickets={tickets}
          loading={loading}
          onTicketClick={(ticket) =>
            router.push(
              `/investment/support/tickets/${encodeURIComponent(ticket.id)}`,
            )
          }
          onCreateTicket={() => router.push('/investment/support/new')}
        />
      </main>
    </div>
  );
}
