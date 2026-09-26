
'use client';

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  Hash,
  Loader2,
  Network,
  UserRound,
  Wallet,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import DepositStatusBadge from '@/src/components/admin/deposits/DepositStatusBadge';
import {
  adminApi,
  type AdminAccountDeposit,
} from '@/src/lib/api/admin';

interface AdminAccountDepositDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

type CopyTarget = 'transaction' | 'address' | 'sender';

export default function AdminAccountDepositDetailPage({
  params,
}: AdminAccountDepositDetailPageProps) {
  const [depositId, setDepositId] = useState<string | null>(null);
  const [deposit, setDeposit] =
    useState<AdminAccountDeposit | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const [copied, setCopied] =
    useState<CopyTarget | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveParams = async () => {
      const resolved = await params;

      if (!cancelled) {
        setDepositId(resolved.id);
      }
    };

    void resolveParams();

    return () => {
      cancelled = true;
    };
  }, [params]);

  const loadDeposit = useCallback(async () => {
    if (!depositId) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response =
        await adminApi.getAccountDeposit(depositId);

      setDeposit(response.data);
    } catch (err) {
      console.error(
        'Failed to load account deposit:',
        err,
      );

      setError(
        'Failed to load account deposit. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [depositId]);

useEffect(() => {
  if (!depositId) {
    return;
  }

  let cancelled = false;

  const load = async () => {
    try {
      const response = await adminApi.getAccountDeposit(depositId);

      if (!cancelled) {
        setDeposit(response.data);
      }
    } catch (err) {
      console.error('Failed to load account deposit:', err);

      if (!cancelled) {
        setError('Failed to load account deposit.');
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  void load();

  return () => {
    cancelled = true;
  };
}, [depositId]);

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
    } catch (err) {
      console.error('Failed to copy value:', err);
    }
  };

  const handleReject = async () => {
    if (!deposit) {
      return;
    }

    const reason = window.prompt(
      'Enter the reason for rejecting this account deposit:',
    );

    if (reason === null) {
      return;
    }

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      window.alert(
        'A rejection reason is required.',
      );
      return;
    }

    setProcessing(true);

    try {
      const response =
        await adminApi.rejectAccountDeposit(
          deposit.id,
          trimmedReason,
        );

      setDeposit(response.data);
    } catch (err) {
      console.error(
        'Failed to reject account deposit:',
        err,
      );

      window.alert(
        'Failed to reject account deposit.',
      );
    } finally {
      setProcessing(false);
    }
  };

  const normalizedStatus =
    deposit?.status.trim().toUpperCase() ?? '';

  const canReject =
    normalizedStatus === 'PENDING' ||
    normalizedStatus === 'VERIFYING' ||
    normalizedStatus === 'PROCESSING';

  return (
    <AdminDashboard title="Account Deposit Details">
      <div className="space-y-6">
        {/* Back navigation */}
        <div>
          <Link
            href="/admin/account-deposits"
            className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs font-semibold text-white/55 transition hover:bg-white/6 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account Deposits
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-white/[0.07] bg-[#0B1426] p-10">
            <div className="flex items-center justify-center gap-3 text-sm text-white/45">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading account deposit...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-400/10 bg-[#0B1426] p-10 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-400/70" />

            <p className="mt-3 text-sm font-medium text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadDeposit();
              }}
              className="mt-4 rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/6 hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Detail */}
        {!loading && !error && deposit && (
          <>
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B1426] shadow-xl shadow-black/10">
              <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

              <div className="pointer-events-none absolute -left-24 bottom-0 h-52 w-52 rounded-full bg-emerald-500/6 blur-3xl" />

              <div className="relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
                    <Wallet className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/70">
                      Finance
                    </p>

                    <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                      Account Deposit
                    </h1>

                    <p className="mt-1 break-all font-mono text-[11px] text-white/30">
                      {deposit.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DepositStatusBadge
                    status={deposit.status}
                  />

                  {canReject && (
                    <button
                      type="button"
                      onClick={() => {
                        void handleReject();
                      }}
                      disabled={processing}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/7 px-4 text-xs font-semibold text-red-300 transition hover:border-red-400/25 hover:bg-red-400/12 disabled:cursor-not-allowed disabled:opacity-40"
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
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Expected Amount"
                value={`${deposit.expected_amount} ${deposit.asset_symbol}`}
                accent="purple"
              />

              <SummaryCard
                label="Received Amount"
                value={`${deposit.received_amount} ${deposit.asset_symbol}`}
                accent="emerald"
              />

              <SummaryCard
                label="Confirmations"
                value={`${deposit.confirmations} / ${deposit.required_confirmations}`}
                accent="cyan"
              />

              <SummaryCard
                label="Verification Attempts"
                value={String(
                  deposit.verification_attempts,
                )}
                accent="amber"
              />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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

                  <Detail
                    label="Last Checked"
                    value={
                      deposit.last_checked_at
                        ? formatDate(
                            deposit.last_checked_at,
                          )
                        : 'Not checked'
                    }
                  />

                  <Detail
                    label="Verification Attempts"
                    value={String(
                      deposit.verification_attempts,
                    )}
                  />

                  {deposit.confirmed_at && (
                    <Detail
                      icon={
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      }
                      label="Confirmed At"
                      value={formatDate(
                        deposit.confirmed_at,
                      )}
                    />
                  )}

                  {deposit.failed_at && (
                    <Detail
                      label="Failed At"
                      value={formatDate(
                        deposit.failed_at,
                      )}
                    />
                  )}
                </div>
              </Section>
            </div>

            {/* Blockchain */}
            <Section title="Blockchain Information">
              <div className="space-y-4">
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

                <div className="grid grid-cols-1 gap-5 pt-1 sm:grid-cols-2">
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

                  <Detail
                    label="Account Deposit Address ID"
                    value={
                      deposit.account_deposit_address_id
                    }
                    mono
                  />

                  <Detail
                    label="Verification Lock Until"
                    value={
                      deposit.verification_lock_until
                        ? formatDate(
                            deposit.verification_lock_until,
                          )
                        : 'Not locked'
                    }
                  />
                </div>
              </div>
            </Section>

            {/* Confirmation progress */}
            <Section title="Confirmation Progress">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Blockchain confirmations
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {deposit.confirmations} of{' '}
                      {deposit.required_confirmations}{' '}
                      required confirmations
                    </p>
                  </div>

                  <span className="text-sm font-bold text-emerald-300">
                    {confirmationPercentage(
                      deposit.confirmations,
                      deposit.required_confirmations,
                    ).toFixed(0)}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-400 transition-all"
                    style={{
                      width: `${confirmationPercentage(
                        deposit.confirmations,
                        deposit.required_confirmations,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </Section>

            {/* Failure */}
            {deposit.failure_reason && (
              <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/8 text-red-300">
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

            {/* Bottom actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-between">
              <Link
                href="/admin/account-deposits"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 px-5 text-sm font-semibold text-white/60 transition hover:bg-white/6 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Deposits
              </Link>

              {canReject && (
                <button
                  type="button"
                  onClick={() => {
                    void handleReject();
                  }}
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
            </div>
          </>
        )}
      </div>
    </AdminDashboard>
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
    <section className="rounded-2xl border border-white/[0.07] bg-[#0B1426] p-5 shadow-xl shadow-black/10 sm:p-6">
      <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
        {title}
      </h2>

      {children}
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
  accent:
    | 'purple'
    | 'emerald'
    | 'cyan'
    | 'amber';
}) {
  const accentClass =
    accent === 'purple'
      ? 'border-purple-400/10 bg-purple-400/5'
      : accent === 'emerald'
        ? 'border-emerald-400/10 bg-emerald-400/5'
        : accent === 'cyan'
          ? 'border-cyan-400/10 bg-cyan-400/5'
          : 'border-amber-400/10 bg-amber-400/5';

  return (
    <div
      className={`rounded-2xl border p-5 ${accentClass}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
        {label}
      </p>

      <p className="mt-2 break-all text-xl font-bold tracking-tight text-white">
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
  icon?: React.ReactNode;
}) {
  const canCopy =
    value !== 'Not submitted' &&
    value !== 'Not available';

  return (
    <div className="rounded-xl border border-white/5 bg-black/10 p-4">
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

function confirmationPercentage(
  confirmations: number,
  required: number,
): number {
  if (required <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      (confirmations / required) * 100,
    ),
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
