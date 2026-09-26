
// src/features/admin/components/SupportStatsCard.tsx

// src/features/admin/components/SupportStatsCard.tsx

'use client';

import {
  Headphones,
  AlertTriangle,
} from 'lucide-react';

import type {
  AdminSupportStats,
} from '@/src/lib/types/admin';

interface SupportStatsCardProps {
  stats: AdminSupportStats;
  loading?: boolean;
}

export default function SupportStatsCard({
  stats,
  loading = false,
}: SupportStatsCardProps) {
  if (loading) {
    return (
      <div className="rounded-[22px] border border-white/8 bg-[#0B1426] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-white/6" />
          <div className="mt-4 h-9 w-20 rounded-lg bg-white/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/12">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-white/45">
              Support Tickets
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {stats.total.toLocaleString()}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-400/10 text-blue-300">
            <Headphones className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/6 pt-4 text-[11px]">
          <span className="text-amber-300/80">
            {stats.open} open
          </span>

          <span className="text-white/35">
            {stats.waiting_for_user} waiting
          </span>
        </div>

        {stats.urgent > 0 && (
          <div className="mt-4 flex items-center gap-1.5 rounded-xl border border-red-400/10 bg-red-400/6 px-3 py-2 text-[11px] font-medium text-red-300/80">
            <AlertTriangle className="h-3.5 w-3.5" />
            {stats.urgent} urgent
          </div>
        )}
      </div>
    </div>
  );
}