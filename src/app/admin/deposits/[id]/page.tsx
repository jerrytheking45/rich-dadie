'use client';

import {
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
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import AdminDashboard from '@/src/components/admin/AdminDashboard';
import DepositStatusBadge from '@/src/components/admin/deposits/DepositStatusBadge';
import {
  adminApi,
  type AdminDeposit,
} from '@/src/lib/api/admin';

export default function AdminDepositsDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const depositId = params.id;

  const [deposit, setDeposit] =
    useState<AdminDeposit | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const [copied, setCopied] = useState<
    'transaction' | 'address' | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    const loadDeposit = async () => {
      try {
        const response =
          await adminApi.getDeposit(depositId);

        if (cancelled) {
          return;
        }

        setDeposit(response.data);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load deposit:',
          err,
        );

        setError(
          'Failed to load deposit. Please try again.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadDeposit();

    return () => {
      cancelled = true;
    };
  }, [depositId]);

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
    } catch (err) {
      console.error(
        'Failed to copy value:',
        err,
      );
    }
  };

  const handleVerify = async () => {
    if (!deposit) {
      return;
    }

    if (
      !window.confirm(
        `Verify deposit ${deposit.id}?`,
      )
    ) {
      return;
    }

    setProcessing(true);

    try {
      await adminApi.verifyDeposit(deposit.id);

      router.push('/admin/deposits');
    } catch (err) {
      console.error(
        'Failed to verify deposit:',
        err,
      );

      window.alert(
        'Failed to verify deposit.',
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
  if (!deposit) {
    return;
  }

  const reason = window.prompt(
    `Enter a reason for rejecting deposit ${deposit.id}:`,
  );

  if (reason === null) {
    return;
  }

  const trimmedReason = reason.trim();

  if (!trimmedReason) {
    window.alert('Rejection reason is required.');
    return;
  }

  if (
    !window.confirm(
      `Reject deposit ${deposit.id}?\n\nReason: ${trimmedReason}`,
    )
  ) {
    return;
  }

  setProcessing(true);

  try {
    await adminApi.rejectDeposit(
      deposit.id,
      trimmedReason,
    );

    router.push('/admin/deposits');
  } catch (err) {
    console.error(
      'Failed to reject deposit:',
      err,
    );

    window.alert(
      'Failed to reject deposit.',
    );
  } finally {
    setProcessing(false);
  }
};

  return (
    <AdminDashboard title="Deposit Details">
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : !deposit ? (
        <ErrorState error="Deposit not found." />
      ) : (
        <div className="space-y-6">
          {/* Back */}
          <div>
            <Link
              href="/admin/deposits"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to deposits
            </Link>
          </div>

          {/* Header */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B1426] shadow-xl shadow-black/10">
            <div className="relative overflow-hidden border-b border-white/[0.07] px-5 py-6 sm:px-7">
              <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-purple-600/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-emerald-500/6 blur-3xl" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
                    <Wallet className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                        Investment Deposit
                      </p>

                      <DepositStatusBadge
                        status={deposit.status}
                      />
                    </div>

                    <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                      Deposit Details
                    </h1>

                    <p className="mt-1 break-all font-mono text-[11px] text-white/30">
                      {deposit.id}
                    </p>
                  </div>
                </div>

                {isPending(deposit.status) && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={processing}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/7 px-4 text-sm font-semibold text-red-300 transition hover:border-red-400/25 hover:bg-red-400/12 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <XCircle className="h-4 w-4" />

                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={processing}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-950/20 transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {processing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}

                      {processing
                        ? 'Processing...'
                        : 'Verify Deposit'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="Expected"
                value={`${deposit.expected_amount} ${deposit.asset_symbol}`}
              />

              <SummaryCard
                label="Received"
                value={`${deposit.received_amount} ${deposit.asset_symbol}`}
              />

              <SummaryCard
                label="Confirmations"
                value={`${deposit.confirmations} / ${deposit.required_confirmations}`}
              />

              <SummaryCard
                label="Network"
                value={deposit.network_name}
              />
            </div>
          </div>

          {/* Deposit Information */}
          <Section title="Deposit Information">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                value={String(
                  deposit.expected_amount,
                )}
              />

              <Detail
                label="Received Amount"
                value={String(
                  deposit.received_amount,
                )}
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

              <Detail
                label="Deposit ID"
                value={deposit.id}
                mono
              />
            </div>
          </Section>

          {/* Confirmation Progress */}
          <Section title="Confirmation Progress">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/75">
                    Blockchain confirmations
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Required confirmations before
                    verification.
                  </p>
                </div>

                <p className="text-sm font-bold text-white">
                  {deposit.confirmations} /{' '}
                  {deposit.required_confirmations}
                </p>
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

              <p className="text-right text-[11px] text-white/25">
                {Math.round(
                  confirmationPercentage(
                    deposit.confirmations,
                    deposit.required_confirmations,
                  ),
                )}
                %
              </p>
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
                  handleCopy(
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            </div>
          </Section>

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/admin/deposits"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 px-5 text-sm font-semibold text-white/55 transition hover:bg-white/6 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Deposits
            </Link>

            {isPending(deposit.status) && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={processing}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/7 px-5 text-sm font-semibold text-red-300 transition hover:border-red-400/25 hover:bg-red-400/12 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Deposit
                </button>

                <button
                  type="button"
                  onClick={handleVerify}
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
            )}
          </div>
        </div>
      )}
    </AdminDashboard>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-36 animate-pulse rounded bg-white/6" />

      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B1426]">
        <div className="animate-pulse border-b border-white/[0.07] p-7">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/6" />

            <div className="space-y-2">
              <div className="h-3 w-32 rounded bg-white/6" />
              <div className="h-6 w-48 rounded bg-white/6" />
              <div className="h-3 w-64 rounded bg-white/4" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse bg-[#0B1426] p-5"
              >
                <div className="h-3 w-20 rounded bg-white/6" />
                <div className="mt-3 h-5 w-28 rounded bg-white/6" />
              </div>
            ),
          )}
        </div>
      </div>

      <div className="h-64 animate-pulse rounded-2xl border border-white/[0.07] bg-[#0B1426]" />
    </div>
  );
}

function ErrorState({
  error,
}: {
  error: string;
}) {
  return (
    <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/5">
        <XCircle className="h-5 w-5 text-red-300" />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-white/80">
        Unable to load deposit
      </h2>

      <p className="mt-1 text-sm text-red-300/70">
        {error}
      </p>

      <Link
        href="/admin/deposits"
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/6 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to deposits
      </Link>
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
    <section>
      <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
        {title}
      </h2>

      <div className="rounded-2xl border border-white/[0.07] bg-[#0B1426] p-5 shadow-xl shadow-black/10 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0B1426] p-5">
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
        className={`mt-1.5 break-all ${
          mono
            ? 'font-mono text-xs leading-6 text-white/55'
            : 'text-sm font-medium text-white/75'
        }`}
      >
        {value || '—'}
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
    Boolean(value) &&
    value !== 'Not submitted';

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
          canCopy
            ? 'text-white/55'
            : 'text-white/20'
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

function isPending(status: string): boolean {
  return (
    status.trim().toUpperCase() === 'PENDING'
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