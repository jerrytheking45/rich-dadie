'use client';

import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Copy,
  //ExternalLink,
  Hash,
  Mail,
  Network,
  User,
  WalletCards,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { AdminInvestment } from '@/src/lib/api/admin';
import InvestmentStatusBadge from './InvestmentStatusBadge';

interface InvestmentDetailsModalProps {
  investment: AdminInvestment | null;
  onClose: () => void;
}

export default function InvestmentDetailsModal({
  investment,
  onClose,
}: InvestmentDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!investment) return null;

  const copyAddress = async () => {
    if (!investment.deposit_address) return;

    try {
      await navigator.clipboard.writeText(investment.deposit_address);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="investment-details-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#07111F] shadow-2xl shadow-black/40"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#07111F]/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10">
                  <WalletCards className="h-4 w-4 text-purple-300" />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-300">
                  Investment Details
                </p>
              </div>

              <h2
                id="investment-details-title"
                className="mt-3 truncate text-xl font-bold text-white"
              >
                {investment.plan_name}
              </h2>

              <p className="mt-1 break-all font-mono text-[11px] text-slate-500">
                {investment.id}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close investment details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-400 transition hover:border-white/15 hover:bg-white/6 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-3">
          <SummaryCard
            icon={CircleDollarSign}
            label="Invested"
            value={`${investment.amount.toLocaleString()} ${investment.asset_symbol}`}
          />

          <SummaryCard
            icon={WalletCards}
            label="Projected Value"
            value={`${investment.projected_value.toLocaleString()} ${investment.asset_symbol}`}
          />

          <div className="rounded-2xl border border-white/8 bg-white/2.5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Status
            </p>

            <div className="mt-3">
              <InvestmentStatusBadge status={investment.status} />
            </div>
          </div>
        </div>

        {/* Investment information */}
        <div className="px-6 pb-6">
          <SectionTitle title="Investment information" />

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 rounded-2xl border border-white/8 bg-white/2 p-5 sm:grid-cols-2">
            <Detail
              icon={User}
              label="User"
              value={investment.user_name}
            />

            <Detail
              icon={Mail}
              label="Email"
              value={investment.user_email}
            />

            <Detail
              icon={Hash}
              label="Investment ID"
              value={investment.id}
              mono
            />

            <Detail
              icon={WalletCards}
              label="Plan"
              value={investment.plan_name}
            />

            <Detail
              icon={Clock3}
              label="Duration"
              value={`${investment.duration_days} days`}
            />

            <Detail
              icon={CircleDollarSign}
              label="Daily Return"
              value={`${investment.expected_return_rate}%`}
            />

            <Detail
              icon={CircleDollarSign}
              label="Asset"
              value={investment.asset_symbol}
              mono
            />

            <Detail
              icon={Network}
              label="Network"
              value={investment.network_name}
            />

            <Detail
              icon={CircleDollarSign}
              label="Progress"
              value={`${investment.progress}%`}
            />

            <Detail
              icon={CalendarDays}
              label="Start Date"
              value={
                investment.start_date
                  ? new Date(investment.start_date).toLocaleDateString()
                  : '—'
              }
            />

            <Detail
              icon={CalendarDays}
              label="Maturity Date"
              value={
                investment.maturity_date
                  ? new Date(investment.maturity_date).toLocaleDateString()
                  : '—'
              }
            />

            <Detail
              icon={CalendarDays}
              label="Created"
              value={
                investment.created_at
                  ? new Date(investment.created_at).toLocaleString()
                  : '—'
              }
            />
          </div>
        </div>

        {/* Deposit address */}
        <div className="px-6 pb-6">
          <SectionTitle title="Deposit destination" />

          <div className="rounded-2xl border border-purple-400/10 bg-purple-400/4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-300">
                  Deposit Address
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Wallet address associated with this investment.
                </p>
              </div>

              {investment.deposit_address && (
                <button
                  type="button"
                  onClick={copyAddress}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/8 hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-white/8 bg-[#050B18] px-4 py-3">
              <p className="break-all font-mono text-xs leading-6 text-slate-300">
                {investment.deposit_address || 'No deposit address available'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 pb-6">
          <SectionTitle title="Investment progress" />

          <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">
                Completion
              </span>

              <span className="text-sm font-bold text-white">
                {investment.progress}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-linear-to-r from-purple-500 to-purple-300 transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, investment.progress))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-white/8 bg-white/1.5 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/4 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CircleDollarSign;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/2.5 p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-400/10">
          <Icon className="h-4 w-4 text-purple-300" />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-4 wrap-break-word text-lg font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-600" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 break-all text-sm font-medium text-slate-300 ${
          mono ? 'font-mono text-xs' : ''
        }`}
      >
        {value || '—'}
      </p>
    </div>
  );
}