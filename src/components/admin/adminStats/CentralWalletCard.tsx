
// src/features/admin/components/CentralWalletCard.tsx

'use client';

import type { ReactNode } from 'react';

import {
  Activity,
  CircleDollarSign,
  Cpu,
  Gauge,
  Radio,
  Wallet,
} from 'lucide-react';

import type {
  AdminCentralWalletStats,
  AdminCentralWalletResource,
} from '@/src/lib/types/admin';

interface CentralWalletCardProps {
  stats: AdminCentralWalletStats;
  loading?: boolean;
}

interface ResourceProps {
  label: string;
  resource: AdminCentralWalletResource;
  icon: ReactNode;
}

function formatNumber(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
}

function resourcePercentage(
  used: number,
  limit: number,
): number {
  if (limit <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((used / limit) * 100),
  );
}

function Resource({
  label,
  resource,
  icon,
}: ResourceProps) {
  const percentage = resourcePercentage(
    resource.used,
    resource.limit,
  );

  return (
    <div className="group rounded-2xl border border-white/8 bg-[#07101F]/80 p-4 transition-all duration-300 hover:border-white/12 hover:bg-[#091426]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-white/75">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white/45">
            {icon}
          </span>

          <span className="truncate">
            {label}
          </span>
        </div>

        <span className="shrink-0 rounded-full border border-white/8 bg-white/4 px-2 py-1 text-[10px] font-semibold text-white/45">
          {percentage}%
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-linear-to-r from-emerald-500 via-emerald-400 to-cyan-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-white/35">
        <span>
          Used {formatNumber(resource.used)}
        </span>

        <span className="text-right">
          Available {formatNumber(resource.available)}
        </span>
      </div>
    </div>
  );
}

export default function CentralWalletCard({
  stats,
  loading = false,
}: CentralWalletCardProps) {
  if (loading) {
    return (
      <section className="overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-6">
        <div className="animate-pulse">
          <div className="h-6 w-44 rounded-lg bg-white/6" />

          <div className="mt-4 h-4 w-full max-w-md rounded bg-white/5" />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-28 rounded-2xl bg-white/5" />
            <div className="h-28 rounded-2xl bg-white/5" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="h-28 rounded-2xl bg-white/5" />
            <div className="h-28 rounded-2xl bg-white/5" />
            <div className="h-28 rounded-2xl bg-white/5" />
            <div className="h-28 rounded-2xl bg-white/5" />
          </div>
        </div>
      </section>
    );
  }

  const statusClass =
    stats.status === 'HEALTHY'
      ? 'border-emerald-400/15 bg-emerald-400/10 text-emerald-300'
      : stats.status === 'WARNING'
        ? 'border-amber-400/15 bg-amber-400/10 text-amber-300'
        : 'border-red-400/15 bg-red-400/10 text-red-300';

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-6">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-500/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-purple-500/8 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                <Wallet className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/70">
                  Treasury
                </p>

                <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-white">
                  Central TRON Wallet
                </h3>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Wallet Address
              </p>

              <p className="break-all font-mono text-xs leading-5 text-white/50">
                {stats.address}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClass}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>

            {stats.status}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="group rounded-2xl border border-white/8 bg-[#07101F]/80 p-4 transition-all duration-300 hover:border-emerald-400/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/45">
                <CircleDollarSign className="h-4 w-4 text-emerald-300/70" />
                USDT Balance
              </div>

              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              {formatNumber(stats.usdt_balance)}
              <span className="ml-1.5 text-sm font-medium text-white/35">
                USDT
              </span>
            </p>
          </div>

          <div className="group rounded-2xl border border-white/8 bg-[#07101F]/80 p-4 transition-all duration-300 hover:border-cyan-400/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/45">
                <Radio className="h-4 w-4 text-cyan-300/70" />
                TRX Balance
              </div>

              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              {formatNumber(stats.trx_balance)}
              <span className="ml-1.5 text-sm font-medium text-white/35">
                TRX
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white/80">
                Network Resources
              </p>

              <p className="mt-0.5 text-xs text-white/30">
                Current TRON wallet resource utilization
              </p>
            </div>

            <Activity className="h-4 w-4 text-white/25" />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Resource
              label="Energy"
              resource={stats.energy}
              icon={
                <Cpu className="h-4 w-4 text-emerald-300/70" />
              }
            />

            <Resource
              label="Bandwidth"
              resource={stats.bandwidth}
              icon={
                <Gauge className="h-4 w-4 text-cyan-300/70" />
              }
            />

            <Resource
              label="Free Bandwidth"
              resource={stats.free_bandwidth}
              icon={
                <Gauge className="h-4 w-4 text-purple-300/70" />
              }
            />

            <Resource
              label="TRON Power"
              resource={stats.tron_power}
              icon={
                <Activity className="h-4 w-4 text-amber-300/70" />
              }
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-white/6 pt-4 text-[11px] text-white/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />

          <span>
            Last checked:{' '}
            {new Date(
              stats.last_checked_at,
            ).toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}