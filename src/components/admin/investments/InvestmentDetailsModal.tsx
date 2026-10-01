'use client';

import {
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Copy,
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
  const [openSections, setOpenSections] = useState({
    information: true,
    destination: true,
    progress: false,
  });

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-2 backdrop-blur-md sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="investment-details-title"
        className="max-h-[96vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#07111F] shadow-2xl shadow-black/40 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#07111F]/95 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-400/15 bg-purple-400/10 sm:h-9 sm:w-9 sm:rounded-xl">
                  <WalletCards className="h-4 w-4 text-purple-300" />
                </div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-purple-300 sm:text-[10px]">
                  Investment Details
                </p>
              </div>

              <h2
                id="investment-details-title"
                className="mt-2 truncate text-lg font-bold text-white sm:mt-3 sm:text-xl"
              >
                {investment.plan_name}
              </h2>

              <p className="mt-1 break-all font-mono text-[10px] text-slate-500 sm:text-[11px]">
                {investment.id}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close investment details"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-400 transition hover:border-white/15 hover:bg-white/6 hover:text-white sm:h-9 sm:w-9 sm:rounded-xl"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-3 sm:gap-3 sm:p-6">
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

          <div className="rounded-xl border border-white/8 bg-white/2.5 p-3 sm:rounded-2xl sm:p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[10px]">
              Status
            </p>

            <div className="mt-2.5 sm:mt-3">
              <InvestmentStatusBadge status={investment.status} />
            </div>
          </div>
        </div>

        {/* Investment information */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <Section
            title="Investment information"
            open={openSections.information}
            onToggle={() =>
              setOpenSections((current) => ({
                ...current,
                information: !current.information,
              }))
            }
          >
            <div className="grid grid-cols-1 gap-3 rounded-xl border border-white/8 bg-white/2 p-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:rounded-2xl sm:p-4">
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
                    ? new Date(
                        investment.start_date,
                      ).toLocaleDateString()
                    : '—'
                }
              />

              <Detail
                icon={CalendarDays}
                label="Maturity Date"
                value={
                  investment.maturity_date
                    ? new Date(
                        investment.maturity_date,
                      ).toLocaleDateString()
                    : '—'
                }
              />

              <Detail
                icon={CalendarDays}
                label="Created"
                value={
                  investment.created_at
                    ? new Date(
                        investment.created_at,
                      ).toLocaleString()
                    : '—'
                }
              />
            </div>
          </Section>
        </div>

        {/* Deposit destination */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <Section
            title="Deposit destination"
            open={openSections.destination}
            onToggle={() =>
              setOpenSections((current) => ({
                ...current,
                destination: !current.destination,
              }))
            }
          >
            <div className="rounded-xl border border-purple-400/10 bg-purple-400/4 p-3 sm:rounded-2xl sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-300">
                    Deposit Address
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">
                    Wallet address associated with this investment.
                  </p>
                </div>

                {investment.deposit_address && (
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-2.5 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/8 hover:text-white sm:rounded-xl sm:px-3 sm:text-xs"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>

              <div className="mt-3 rounded-lg border border-white/8 bg-[#050B18] px-3 py-2.5 sm:mt-4 sm:rounded-xl sm:px-4 sm:py-3">
                <p className="break-all font-mono text-[11px] leading-5 text-slate-300 sm:text-xs sm:leading-6">
                  {investment.deposit_address ||
                    'No deposit address available'}
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Progress */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <Section
            title="Investment progress"
            open={openSections.progress}
            onToggle={() =>
              setOpenSections((current) => ({
                ...current,
                progress: !current.progress,
              }))
            }
          >
            <div className="rounded-xl border border-white/8 bg-white/2 p-3 sm:rounded-2xl sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-300 sm:text-sm">
                  Completion
                </span>

                <span className="text-xs font-bold text-white sm:text-sm">
                  {investment.progress}%
                </span>
              </div>

              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/6 sm:mt-3 sm:h-2">
                <div
                  className="h-full rounded-full bg-linear-to-r from-purple-500 to-purple-300 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, investment.progress),
                    )}%`,
                  }}
                />
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-white/8 bg-white/1.5 px-4 py-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 rounded-lg border border-white/10 bg-white/4 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/8 hover:text-white sm:min-h-10 sm:rounded-xl sm:px-5 sm:text-sm"
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
    <div className="rounded-xl border border-white/8 bg-white/2.5 p-3 sm:rounded-2xl sm:p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10 sm:rounded-xl">
          <Icon className="h-4 w-4 text-purple-300" />
        </div>

        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[10px]">
          {label}
        </p>
      </div>

      <p className="mt-3 wrap-break-word text-base font-bold text-white sm:mt-4 sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
  open,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-2 text-left transition hover:bg-white/2.5"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
          {title}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/30 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && <div className="mt-1.5">{children}</div>}
    </section>
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

        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[10px]">
          {label}
        </p>
      </div>

      <p
        className={`mt-1.5 break-all text-xs font-medium text-slate-300 sm:mt-2 sm:text-sm ${
          mono ? 'font-mono text-[11px] sm:text-xs' : ''
        }`}
      >
        {value || '—'}
      </p>
    </div>
  );
}
