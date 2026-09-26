
'use client';

import {
  CheckCircle2,
  Clock3,
  Copy,
  Hash,
  Loader2,
  Network,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import type { AdminDeposit } from '@/src/lib/api/admin';

import DepositStatusBadge from './DepositStatusBadge';

interface DepositDetailsModalProps {
  deposit: AdminDeposit | null;
  onClose: () => void;
  onVerify: (deposit: AdminDeposit) => void;
  onReject: (deposit: AdminDeposit) => void;
  processing?: boolean;
}

export default function DepositDetailsModal({
  deposit,
  onClose,
  onVerify,
  onReject,
  processing = false,
}: DepositDetailsModalProps) {
  const [copied, setCopied] = useState<
    'transaction' | 'address' | null
  >(null);

  if (!deposit) return null;

  const pending =
    deposit.status.toUpperCase() === 'PENDING';

  const handleCopy = async (
    value: string,
    type: 'transaction' | 'address',
  ) => {
    if (!value || value === 'Not submitted') {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      setCopied(type);

      window.setTimeout(() => {
        setCopied(null);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy value:', error);
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
        aria-labelledby="deposit-details-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1426] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-white/7 px-5 py-5 sm:px-7">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="pointer-events-none absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-emerald-500/6 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
                <Wallet className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/70">
                  Investment deposit
                </p>

                <h2
                  id="deposit-details-title"
                  className="mt-1 text-lg font-bold tracking-tight text-white sm:text-xl"
                >
                  Deposit Details
                </h2>

                <p className="mt-1 truncate font-mono text-[11px] text-white/30">
                  {deposit.id}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close deposit details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-white/40 transition hover:border-white/15 hover:bg-white/6 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Expected"
              value={`${deposit.expected_amount} ${deposit.asset_symbol}`}
              accent="purple"
            />

            <SummaryCard
              label="Received"
              value={`${deposit.received_amount} ${deposit.asset_symbol}`}
              accent="emerald"
            />

            <div className="rounded-2xl border border-white/7 bg-white/2.5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Status
              </p>

              <div className="mt-3">
                <DepositStatusBadge status={deposit.status} />
              </div>
            </div>
          </div>

          {/* Deposit information */}
          <Section title="Deposit Information">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Detail
                icon={<Wallet className="h-3.5 w-3.5" />}
                label="User"
                value={deposit.user_name}
              />

              <Detail
                label="Email"
                value={deposit.user_email}
              />

              <Detail
                label="Asset"
                value={deposit.asset_symbol}
              />

              <Detail
                icon={<Network className="h-3.5 w-3.5" />}
                label="Network"
                value={deposit.network_name}
              />

              <Detail
                label="Expected Amount"
                value={String(deposit.expected_amount)}
              />

              <Detail
                label="Received Amount"
                value={String(deposit.received_amount)}
              />

              <Detail
                label="Confirmations"
                value={`${deposit.confirmations} / ${deposit.required_confirmations}`}
              />

              <Detail
                label="Investment ID"
                value={deposit.investment_id}
                mono
              />
            </div>
          </Section>

          {/* Blockchain */}
          <Section title="Blockchain Information">
            <div className="space-y-3">
              <CopyableDetail
                icon={<Hash className="h-3.5 w-3.5" />}
                label="Transaction Hash"
                value={deposit.tx_hash || 'Not submitted'}
                copied={copied === 'transaction'}
                onCopy={() =>
                  handleCopy(
                    deposit.tx_hash || '',
                    'transaction',
                  )
                }
              />

              <CopyableDetail
                label="Company Deposit Address"
                value={deposit.company_deposit_address}
                copied={copied === 'address'}
                onCopy={() =>
                  handleCopy(
                    deposit.company_deposit_address,
                    'address',
                  )
                }
              />
            </div>
          </Section>

          {/* Activity */}
          <Section title="Activity">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Detail
                icon={<Clock3 className="h-3.5 w-3.5" />}
                label="Created"
                value={formatDate(deposit.created_at)}
              />

              <Detail
                icon={<Clock3 className="h-3.5 w-3.5" />}
                label="Last Updated"
                value={formatDate(deposit.updated_at)}
              />
            </div>
          </Section>
        </div>

        {/* Footer */}
        {pending ? (
          <div className="border-t border-white/7 bg-[#080F1D]/95 px-5 py-4 sm:px-7">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => onReject(deposit)}
                disabled={processing}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/7 px-5 text-sm font-semibold text-red-300 transition hover:border-red-400/25 hover:bg-red-400/12 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <XCircle className="h-4 w-4" />
                Reject Deposit
              </button>

              <button
                type="button"
                onClick={() => onVerify(deposit)}
                disabled={processing}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-950/20 transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Verify Deposit
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end border-t border-white/7 bg-[#080F1D]/95 px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/8 bg-white/3 px-5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/6 hover:text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 last:mb-0">
      <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
        {title}
      </h3>

      <div className="rounded-2xl border border-white/7 bg-white/2.5 p-4">
        {children}
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'purple' | 'emerald';
}) {
  const accentClass =
    accent === 'purple'
      ? 'border-purple-400/10 bg-purple-400/5 text-purple-300'
      : 'border-emerald-400/10 bg-emerald-400/5 text-emerald-300';

  return (
    <div
      className={`rounded-2xl border p-4 ${accentClass}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
        {label}
      </p>

      <p className="mt-2 break-all text-lg font-bold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
  mono = false,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
        {icon}
        <span>{label}</span>
      </div>

      <p
        className={`mt-1.5 break-all text-sm ${
          mono
            ? 'font-mono text-xs leading-6 text-white/55'
            : 'font-medium text-white/75'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CopyableDetail({
  label,
  value,
  copied,
  onCopy,
  icon,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  icon?: React.ReactNode;
}) {
  const canCopy = value !== 'Not submitted';

  return (
    <div className="rounded-xl border border-white/5 bg-black/10 p-3.5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
          {icon}
          <span>{label}</span>
        </div>

        {canCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/3 px-2.5 py-1.5 text-[10px] font-semibold text-white/40 transition hover:bg-white/7 hover:text-white"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      <p
        className={`break-all font-mono text-xs leading-6 ${
          value === 'Not submitted'
            ? 'text-white/20'
            : 'text-white/55'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}