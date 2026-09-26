
// src/features/admin/components/InvestmentStatsCard.tsx

// src/features/admin/components/InvestmentStatsCard.tsx

'use client';

import {
  TrendingUp,
  Activity,
  CircleDollarSign,
} from 'lucide-react';

import type {
  AdminInvestmentStats,
} from '@/src/lib/types/admin';

interface InvestmentStatsCardProps {
  stats: AdminInvestmentStats;
  loading?: boolean;
}

export default function InvestmentStatsCard({
  stats,
  loading = false,
}: InvestmentStatsCardProps) {
  if (loading) {
    return (
      <div className="rounded-[22px] border border-white/8 bg-[#0B1426] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="animate-pulse">
          <div className="h-4 w-36 rounded bg-white/6" />
          <div className="mt-4 h-9 w-24 rounded-lg bg-white/6" />
          <div className="mt-4 h-4 w-40 rounded bg-white/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/12">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-white/45">
              Investments
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {stats.total.toLocaleString()}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10 text-purple-300">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/6 pt-4 text-[11px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/6 px-2.5 py-1 text-emerald-300/80">
            <Activity className="h-3.5 w-3.5" />
            {stats.active} active
          </span>

          <span className="inline-flex items-center rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-white/40">
            {stats.matured} matured
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-white/35">
          <CircleDollarSign className="h-3.5 w-3.5 text-emerald-300/60" />

          <span>
            AUM{' '}
            {stats.total_invested.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            USDT
          </span>
        </div>
      </div>
    </div>
  );
}