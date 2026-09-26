
// src/features/admin/components/WithdrawalStatsCard.tsx

// src/features/admin/components/WithdrawalStatsCard.tsx

'use client';

import {
  ArrowUpFromLine,
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react';

import type {
  AdminWithdrawalStats,
} from '@/src/lib/types/admin';

interface WithdrawalStatsCardProps {
  stats: AdminWithdrawalStats;
  loading?: boolean;
}

export default function WithdrawalStatsCard({
  stats,
  loading = false,
}: WithdrawalStatsCardProps) {
  if (loading) {
    return (
      <div className="rounded-[22px] border border-white/8 bg-[#0B1426] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="animate-pulse">
          <div className="h-4 w-36 rounded bg-white/6" />
          <div className="mt-4 h-9 w-24 rounded-lg bg-white/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/12">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-slate-400/6 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-white/45">
              Withdrawals
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {stats.total.toLocaleString()}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/4 text-white/55">
            <ArrowUpFromLine className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-white/6 pt-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-amber-300/80">
            <Clock3 className="h-3.5 w-3.5" />
            {stats.pending} pending
          </span>

          <span className="flex items-center gap-1.5 text-emerald-300/80">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {stats.completed} completed
          </span>

          <span className="flex items-center gap-1.5 text-red-300/80">
            <XCircle className="h-3.5 w-3.5" />
            {stats.failed} failed
          </span>
        </div>

        <p className="mt-4 border-t border-white/6 pt-4 text-[11px] text-white/30">
          Volume:{' '}
          <span className="font-medium text-white/45">
            {stats.total_amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            USDT
          </span>
        </p>
      </div>
    </div>
  );
}