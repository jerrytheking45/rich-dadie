
// src/features/admin/components/UserStatsCard.tsx

// src/features/admin/components/UserStatsCard.tsx

'use client';

import { Users } from 'lucide-react';

import type { AdminUserStats } from '@/src/lib/types/admin';

interface UserStatsCardProps {
  stats: AdminUserStats;
  loading?: boolean;
}

export default function UserStatsCard({
  stats,
  loading = false,
}: UserStatsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/12">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-emerald-500/8 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-white/45">
              Total Users
            </p>

            {loading ? (
              <div className="mt-2 h-9 w-20 animate-pulse rounded-lg bg-white/6" />
            ) : (
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                {stats.total.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-white/6 pt-4 text-[11px] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />

          <span>
            {stats.verified.toLocaleString()} verified users
          </span>
        </div>
      </div>
    </div>
  );
}