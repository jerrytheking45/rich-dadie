
// src/features/admin/components/LedgerStatsCard.tsx

// src/features/admin/components/LedgerStatsCard.tsx

'use client';

import {
  BookOpen,
  CircleDollarSign,
} from 'lucide-react';

import type {
  AdminLedgerStats,
} from '@/src/lib/types/admin';

interface LedgerStatsCardProps {
  stats: AdminLedgerStats;
  loading?: boolean;
}

export default function LedgerStatsCard({
  stats,
  loading = false,
}: LedgerStatsCardProps) {
  if (loading) {
    return (
      <div className="rounded-[22px] border border-white/8 bg-[#0B1426] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded bg-white/6" />
          <div className="mt-4 h-9 w-28 rounded-lg bg-white/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/12">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-cyan-500/8 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-white/45">
              Ledger Balance
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {stats.balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
            <CircleDollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-white/6 pt-4 text-[11px] text-white/35">
          <BookOpen className="h-3.5 w-3.5 text-cyan-300/60" />

          <span>
            {stats.entries.toLocaleString()} USDT ledger entries
          </span>
        </div>
      </div>
    </div>
  );
}