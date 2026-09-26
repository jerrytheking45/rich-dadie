
'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Copy,
  Hash,
  Loader2,
  Network,
  UserRound,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import type { AdminAccountDeposit } from '@/src/lib/api/admin';

import DepositStatusBadge from '../deposits/DepositStatusBadge';

interface AccountDepositDetailsModalProps {
  deposit: AdminAccountDeposit | null;
  onClose: () => void;
  onReject: (deposit: AdminAccountDeposit) => void;
  processing?: boolean;
}

type CopyTarget = 'transaction' | 'address' | 'sender';

export default function AccountDepositDetailsModal({
  deposit,
  onClose,
  onReject,
  processing = false,
}: AccountDepositDetailsModalProps) {
  const [copied, setCopied] =
    useState<CopyTarget | null>(null);

  if (!deposit) {
    return null;
  }

  const normalizedStatus =
    deposit.status.trim().toUpperCase();

  const canReject =
    normalizedStatus === 'PENDING' ||
    normalizedStatus === 'VERIFYING' ||
    normalizedStatus === 'PROCESSING';

  const handleCopy = async (
    value: string,
    target: CopyTarget,
  ) => {
    if (
      !value ||
      value === 'Not submitted' ||
      value === 'Not available'
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      setCopied(target);

      window.setTimeout(() => {
        setCopied(null);
      }, 1800);
    } catch (error) {
      console.error(
        'Failed to copy value:',
        error,
      );
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
        aria-labelledby="account-deposit-details-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1426] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
        onClick={(event) =>
          event.stopPropagation()
        }
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
                  Account deposit
                </p>

                <h2
                  id="account-deposit-details-title"
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
              aria-label="Close account deposit details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-white/40 transition hover:border-white/15 hover:bg-white/6 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
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
                <DepositStatusBadge
                  status={deposit.status}
                />
              </div>
            </div>
          </div>

          {/* Account information */}
          <Section title="Account Information">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Detail
                icon={
                  <UserRound className="h-3.5 w-3.5" />
                }
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
                icon={
                  <Network className="h-3.5 w-3.5" />
                }
                label="Network"
                value={deposit.network_name}
              />

              <Detail
                label="Expected Amount"
                value={`${deposit.expected_amount} ${deposit.asset_symbol}`}
              />

              <Detail
                label="Received Amount"
                value={`${deposit.received_amount} ${deposit.asset_symbol}`}
              />

              <Detail
                label="Confirmations"
                value={`${deposit.confirmations} / ${deposit.required_confirmations}`}
              />

              <Detail
                label="Verification Attempts"
                value={String(
                  deposit.verification_attempts,
                )}
              />
            </div>
          </Section>

          {/* Blockchain */}
          <Section title="Blockchain Information">
            <div className="space-y-3">
              <CopyableDetail
                icon={
                  <Hash className="h-3.5 w-3.5" />
                }
                label="Transaction Hash"
                value={
                  deposit.tx_hash ||
                  'Not submitted'
                }
                copied={
                  copied === 'transaction'
                }
                onCopy={() =>
                  void handleCopy(
                    deposit.tx_hash || '',
                    'transaction',
                  )
                }
              />

              <CopyableDetail
                label="Company Deposit Address"
                value={
                  deposit.company_deposit_address
                }
                copied={copied === 'address'}
                onCopy={() =>
                  void handleCopy(
                    deposit.company_deposit_address,
                    'address',
                  )
                }
              />

              <CopyableDetail
                label="Sender Address"
                value={
                  deposit.sender_address ||
                  'Not available'
                }
                copied={copied === 'sender'}
                onCopy={() =>
                  void handleCopy(
                    deposit.sender_address || '',
                    'sender',
                  )
                }
              />

              <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2">
                <Detail
                  label="Block Number"
                  value={
                    deposit.block_number > 0
                      ? String(
                          deposit.block_number,
                        )
                      : 'Not available'
                  }
                />

                <Detail
                  label="Token Contract"
                  value={
                    deposit.token_contract ||
                    'Not available'
                  }
                  mono
                />
              </div>
            </div>
          </Section>

          {/* Verification */}
          <Section title="Verification">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Detail
                icon={
                  <Clock3 className="h-3.5 w-3.5" />
                }
                label="Created"
                value={formatDate(
                  deposit.created_at,
                )}
              />

              <Detail
                icon={
                  <Clock3 className="h-3.5 w-3.5" />
                }
                label="Last Updated"
                value={formatDate(
                  deposit.updated_at,
                )}
              />

              {deposit.failed_at && (
                <Detail
                  label="Failed At"
                  value={formatDate(
                    deposit.failed_at,
                  )}
                />
              )}

              {deposit.confirmed_at && (
                <Detail
                  label="Confirmed At"
                  value={formatDate(
                    deposit.confirmed_at,
                  )}
                />
              )}
            </div>
          </Section>

          {/* Failure reason */}
          {deposit.failure_reason && (
            <div className="mb-6 rounded-2xl border border-red-400/10 bg-red-400/5 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/8 text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-300/70">
                    Failure Reason
                  </p>

                  <p className="mt-1.5 text-sm leading-6 text-red-200/75">
                    {deposit.failure_reason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/7 bg-[#080F1D]/95 px-5 py-4 sm:px-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {canReject && (
              <button
                type="button"
                onClick={() => onReject(deposit)}
                disabled={processing}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/7 px-5 text-sm font-semibold text-red-300 transition hover:border-red-400/25 hover:bg-red-400/12 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}

                {processing
                  ? 'Processing...'
                  : 'Reject Deposit'}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/8 bg-white/3 px-5 text-sm font-semibold text-white/60 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
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
      ? 'border-purple-400/10 bg-purple-400/5'
      : 'border-emerald-400/10 bg-emerald-400/5';

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
  icon?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
        {icon}
        <span>{label}</span>
      </div>

      <p
        className={`mt-1.5 break-all ${
          mono
            ? 'font-mono text-xs leading-6 text-white/55'
            : 'text-sm font-medium text-white/75'
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
  icon?: ReactNode;
}) {
  const canCopy =
    value !== 'Not submitted' &&
    value !== 'Not available';

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
          value === 'Not submitted' ||
          value === 'Not available'
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