
'use client';

import {
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Copy,
  RefreshCw,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import InvestmentBottomNav from '@/src/components/InvestmentBottomNav';
import { useSettings } from '@/src/context/useSettings';
import { investmentApi } from '@/src/lib/api/investmentApi';
import { formatUSDT } from '@/src/lib/utils/currency';

import type {
  AccountDeposit,
} from '@/src/lib/types/investment';

export default function AccountDepositDetailPage() {
  const router = useRouter();

  const params = useParams<{
    depositId?: string | string[];
  }>();

  const { currency } = useSettings();

  const depositId =
    typeof params.depositId === 'string'
      ? params.depositId.trim()
      : Array.isArray(params.depositId)
        ? params.depositId[0]?.trim() ?? ''
        : '';

  const [deposit, setDeposit] =
    useState<AccountDeposit | null>(null);

  const [txHash, setTxHash] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState('');

  // ==========================================================
  // Load deposit
  // ==========================================================

  const loadDeposit = useCallback(
    async (showLoading = false) => {
      if (!depositId) {
        setError('Invalid account deposit ID.');
        setLoading(false);
        return;
      }

      if (showLoading) {
        setLoading(true);
      }

      try {
        const result =
          await investmentApi.getAccountDeposit(
            depositId,
          );

        setDeposit(result);

        if (result.txHash) {
          setTxHash(result.txHash);
        }

        setError('');
      } catch (err) {
        console.error(
          'Failed to load account deposit:',
          err,
        );

        setDeposit(null);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load deposit.',
        );
      } finally {
        setLoading(false);
      }
    },
    [depositId],
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!depositId) {
        if (!cancelled) {
          setError(
            'Invalid account deposit ID.',
          );
          setLoading(false);
        }

        return;
      }

      try {
        const result =
          await investmentApi.getAccountDeposit(
            depositId,
          );

        if (cancelled) {
          return;
        }

        setDeposit(result);

        if (result.txHash) {
          setTxHash(result.txHash);
        }

        setError('');
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load account deposit:',
          err,
        );

        setDeposit(null);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load deposit.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [depositId]);

  // ==========================================================
  // Refresh
  // ==========================================================

  const refreshDeposit = async () => {
    if (!depositId) {
      setError(
        'Invalid account deposit ID.',
      );
      return;
    }

    setRefreshing(true);
    setError('');

    try {
      const result =
        await investmentApi.getAccountDeposit(
          depositId,
        );

      setDeposit(result);

      if (result.txHash) {
        setTxHash(result.txHash);
      }
    } catch (err) {
      console.error(
        'Failed to refresh account deposit:',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to refresh deposit.',
      );
    } finally {
      setRefreshing(false);
    }
  };

  // ==========================================================
  // Submit transaction
  // ==========================================================

  const submitTransaction = async () => {
    if (!deposit?.id) {
      setError(
        'This account deposit could not be found.',
      );
      return;
    }

    const cleanTxHash =
      txHash.trim();

    if (!cleanTxHash) {
      setError(
        'Please enter the transaction hash.',
      );
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result =
        await investmentApi.submitAccountDeposit(
          deposit.id,
          cleanTxHash,
        );

      setDeposit(result);

      setTxHash(
        result.txHash ||
          cleanTxHash,
      );
    } catch (err) {
      console.error(
        'Failed to submit account deposit:',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit transaction.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // Verify
  // ==========================================================

  const verifyDeposit = async () => {
    if (!deposit?.id) {
      setError(
        'This account deposit could not be found.',
      );
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const result =
        await investmentApi.verifyAccountDeposit(
          deposit.id,
        );

      setDeposit(result);

      if (result.txHash) {
        setTxHash(result.txHash);
      }
    } catch (err) {
      console.error(
        'Failed to verify account deposit:',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to verify the deposit.',
      );
    } finally {
      setVerifying(false);
    }
  };

  // ==========================================================
  // Copy
  // ==========================================================

  const copyAddress = async () => {
    if (
      !deposit?.companyDepositAddress
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        deposit.companyDepositAddress,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error(
        'Failed to copy deposit address:',
        err,
      );
    }
  };

  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070916] text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-5 py-4 shadow-2xl shadow-black/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
            <RefreshCw
              size={17}
              className="animate-spin text-violet-300"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-white">
              Loading deposit
            </p>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Fetching transaction details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // Missing / invalid deposit
  // ==========================================================

  if (!deposit) {
    return (
      <div className="min-h-screen bg-[#070916] text-white">
        <main className="mx-auto w-full max-w-2xl px-4 pb-32 pt-6 sm:px-6">
          <header className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  '/investment/profile/account-deposit',
                )
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/8 active:scale-95"
              aria-label="Back to deposits"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-violet-300/70">
                Account
              </p>

              <h1 className="mt-0.5 text-xl font-extrabold tracking-tight">
                Deposit Details
              </h1>
            </div>
          </header>

          <section className="relative mt-6 overflow-hidden rounded-[28px] border border-red-500/20 bg-red-500/[0.07] p-5 shadow-2xl shadow-black/20">
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <XCircle size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-extrabold text-red-300">
                  Deposit unavailable
                </p>

                <p className="mt-1 text-xs leading-5 text-red-200/70">
                  {error ||
                    'The requested deposit could not be loaded.'}
                </p>

                {depositId && (
                  <p className="mt-3 break-all font-mono text-[9px] text-red-300/50">
                    ID: {depositId}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadDeposit(true)
              }
              disabled={!depositId}
              className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3.5 text-xs font-bold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </section>
        </main>

        <InvestmentBottomNav />
      </div>
    );
  }

  const isTerminal =
    deposit.status === 'CONFIRMED' ||
    deposit.status === 'FAILED' ||
    deposit.status === 'EXPIRED' ||
    deposit.status === 'UNMATCHED';

  const canSubmit =
    deposit.status === 'PENDING' ||
    deposit.status === 'VERIFYING';

  // ==========================================================
  // Main
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#070916] text-white">
      <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 overflow-hidden">
          <div className="absolute left-1/2 top-45 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
          <div className="absolute -right-20 top-20 h-52 w-52 rounded-full bg-indigo-500/10 blur-[90px]" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  '/investment/profile/account-deposit',
                )
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/8 active:scale-95"
              aria-label="Back to account deposits"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-violet-300/70">
                Account Wallet
              </p>

              <h1 className="truncate text-xl font-extrabold tracking-tight text-white">
                Deposit Details
              </h1>

              <p className="text-[10px] text-slate-500">
                USDT · TRON Network
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              void refreshDeposit()
            }
            disabled={refreshing}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Refresh deposit"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />
          </button>
        </header>

        {/* Error */}
        {error && (
          <section
            role="alert"
            className="relative z-10 mt-4 rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-4"
          >
            <div className="flex items-start gap-3">
              <CircleAlert
                size={17}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <p className="text-xs leading-5 text-red-300">
                {error}
              </p>
            </div>
          </section>
        )}

        {/* Hero */}
        <section className="relative z-10 mt-5 overflow-hidden rounded-[30px] border border-white/10 bg-linear-to-br from-[#15152b] via-[#101126] to-[#0d0e20] p-5 shadow-2xl shadow-black/30">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-violet-600/15 blur-[80px]" />
          <div className="absolute -bottom-24 left-10 h-44 w-44 rounded-full bg-indigo-500/10 blur-[80px]" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <Wallet size={17} />
                  </div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Account Deposit
                  </p>
                </div>

                <p className="mt-5 text-[10px] font-medium text-slate-500">
                  Expected amount
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight text-white">
                  {formatUSDT(
                    deposit.expectedAmount,
                    currency,
                  )}
                </h2>
              </div>

              <StatusBadge
                status={deposit.status}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <HeroStat
                label="Received"
                value={formatUSDT(
                  deposit.receivedAmount,
                  currency,
                )}
              />

              <HeroStat
                label="Confirmations"
                value={`${deposit.confirmations}/${deposit.requiredConfirmations}`}
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4">
              <span className="text-[10px] text-slate-500">
                Network
              </span>

              <span className="rounded-full border border-violet-400/15 bg-violet-400/6 px-2.5 py-1 text-[9px] font-bold text-violet-300">
                TRON / TRC20
              </span>
            </div>
          </div>
        </section>

        {/* Deposit status */}
        <section className="relative z-10 mt-4 rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-start gap-4">
            <StatusIcon status={deposit.status} />

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">
                Current status
              </p>

              <h2 className="mt-1 text-base font-extrabold text-white">
                {deposit.status ===
                'CONFIRMED'
                  ? 'Deposit Successful'
                  : deposit.status ===
                    'VERIFYING'
                  ? 'Verification in Progress'
                  : deposit.status ===
                    'PENDING'
                  ? 'Deposit Pending'
                  : `Deposit ${deposit.status.toLowerCase()}`}
              </h2>

              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                {deposit.status ===
                'CONFIRMED'
                  ? 'Your funds have been confirmed and credited.'
                  : deposit.status ===
                    'VERIFYING'
                  ? 'Your transaction is being checked on the TRON network.'
                  : deposit.status ===
                    'PENDING'
                  ? 'Send the requested USDT and submit your transaction hash.'
                  : 'Review the transaction details below for more information.'}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/6 bg-black/10 px-3 py-2.5">
            <p className="break-all font-mono text-[9px] leading-4 text-slate-600">
              Deposit ID: {deposit.id}
            </p>
          </div>
        </section>

        {/* Deposit destination */}
        {!isTerminal && (
          <section className="relative z-10 mt-4 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                <ArrowDownToLine size={18} />
              </div>

              <div>
                <h2 className="text-[15px] font-extrabold text-white">
                  Send USDT
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Send funds to your assigned deposit address.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-violet-400/10 bg-[#090a18] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Deposit address
                </span>

                <span className="text-[9px] font-bold text-violet-300">
                  TRC20
                </span>
              </div>

              <p className="break-all font-mono text-[11px] leading-5 text-slate-300">
                {deposit.companyDepositAddress}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void copyAddress()
              }
              disabled={
                !deposit.companyDepositAddress
              }
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-400/15 bg-violet-500/8 px-4 py-3.5 text-xs font-bold text-violet-200 transition hover:bg-violet-500/13 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? (
                <>
                  <CheckCircle2
                    size={15}
                    className="text-emerald-400"
                  />
                  Address Copied
                </>
              ) : (
                <>
                  <Copy size={15} />
                  Copy Deposit Address
                </>
              )}
            </button>

            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-3">
              <CircleAlert
                size={15}
                className="mt-0.5 shrink-0 text-amber-300"
              />

              <p className="text-[10px] leading-4 text-amber-200/70">
                Send only USDT over TRON/TRC20.
                Using another asset or network may
                result in permanent loss of funds.
              </p>
            </div>
          </section>
        )}

        {/* Transaction */}
        {canSubmit && (
          <section className="relative z-10 mt-4 rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h2 className="text-[15px] font-extrabold text-white">
                  Transaction Verification
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Submit the TRON transaction hash after sending.
                </p>
              </div>
            </div>

            <label
              htmlFor="account-deposit-tx-hash"
              className="mt-5 block text-xs font-bold text-slate-300"
            >
              Transaction Hash
            </label>

            <div className="relative mt-2">
              <input
                id="account-deposit-tx-hash"
                type="text"
                value={txHash}
                onChange={(event) =>
                  setTxHash(
                    event.target.value,
                  )
                }
                placeholder="Paste your TRON transaction hash"
                disabled={
                  deposit.status !== 'PENDING' ||
                  submitting
                }
                autoComplete="off"
                spellCheck={false}
                className="h-13 w-full rounded-2xl border border-white/10 bg-[#090a18] px-4 font-mono text-[11px] text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/40 focus:bg-[#0b0c1d] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {deposit.status ===
              'PENDING' && (
              <button
                type="button"
                onClick={() =>
                  void submitTransaction()
                }
                disabled={
                  submitting ||
                  !txHash.trim()
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-xs font-bold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    Submit Transaction
                  </>
                )}
              </button>
            )}
          </section>
        )}

        {/* Verify */}
        {deposit.status ===
          'VERIFYING' && (
          <section className="relative z-10 mt-4 overflow-hidden rounded-[26px] border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <RefreshCw
                  size={18}
                  className={
                    verifying
                      ? 'animate-spin'
                      : ''
                  }
                />
              </div>

              <div>
                <p className="text-sm font-extrabold text-amber-200">
                  Verification in progress
                </p>

                <p className="mt-1 text-[10px] leading-4 text-amber-200/60">
                  The transaction is being checked on
                  the TRON network.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void verifyDeposit()
              }
              disabled={verifying}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/10 bg-amber-400/10 px-4 py-3.5 text-xs font-bold text-amber-200 transition hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <RefreshCw
                    size={15}
                    className="animate-spin"
                  />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw size={15} />
                  Check Deposit Status
                </>
              )}
            </button>
          </section>
        )}

        {/* Success */}
        {deposit.status ===
          'CONFIRMED' && (
          <section className="relative z-10 mt-4 overflow-hidden rounded-[26px] border border-emerald-400/15 bg-emerald-400/5 p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-sm font-extrabold text-emerald-200">
                  Deposit confirmed
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-200/60">
                  {formatUSDT(
                    deposit.receivedAmount,
                    currency,
                  )}{' '}
                  has been credited directly to your
                  available account balance.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Failure */}
        {(deposit.status ===
          'FAILED' ||
          deposit.status ===
            'EXPIRED' ||
          deposit.status ===
            'UNMATCHED') && (
          <section className="relative z-10 mt-4 rounded-[26px] border border-red-400/15 bg-red-400/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                <XCircle size={21} />
              </div>

              <div>
                <p className="text-sm font-extrabold text-red-200">
                  Deposit {deposit.status.toLowerCase()}
                </p>

                {deposit.failureReason && (
                  <p className="mt-1 text-xs leading-5 text-red-200/60">
                    {deposit.failureReason}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Transaction details */}
        {deposit.txHash && (
          <section className="relative z-10 mt-4 rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10 text-slate-300">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h2 className="text-[15px] font-extrabold text-white">
                  Transaction Details
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Blockchain transaction reference
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/6 bg-[#090a18] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Transaction Hash
              </p>

              <p className="mt-2 break-all font-mono text-[10px] leading-5 text-slate-400">
                {deposit.txHash}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600">
              <ShieldCheck
                size={14}
                className="text-emerald-400"
              />

              Verified through the account deposit
              verification flow.
            </div>
          </section>
        )}

        {/* Information */}
        <section className="relative z-10 mt-4 rounded-3xl border border-white/10 bg-white/2.5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
              <Wallet size={17} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-300">
                Account balance deposit
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-600">
                Confirmed account deposits are credited
                to your available ledger balance. They
                do not create an investment automatically.
              </p>
            </div>
          </div>
        </section>
      </main>

      <InvestmentBottomNav />
    </div>
  );
}

// ============================================================
// Hero Stat
// ============================================================

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/[0.035] p-3.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-600">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-extrabold text-slate-200">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// Status Badge
// ============================================================

function StatusBadge({
  status,
}: {
  status: AccountDeposit['status'];
}) {
  const styles: Record<
    AccountDeposit['status'],
    string
  > = {
    CONFIRMED:
      'border-emerald-400/15 bg-emerald-400/10 text-emerald-300',

    FAILED:
      'border-red-400/15 bg-red-400/10 text-red-300',

    EXPIRED:
      'border-red-400/15 bg-red-400/10 text-red-300',

    UNMATCHED:
      'border-red-400/15 bg-red-400/10 text-red-300',

    VERIFYING:
      'border-amber-400/15 bg-amber-400/10 text-amber-300',

    PENDING:
      'border-violet-400/15 bg-violet-400/10 text-violet-300',
  };

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] font-extrabold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// ============================================================
// Status Icon
// ============================================================

function StatusIcon({
  status,
}: {
  status: AccountDeposit['status'];
}) {
  if (status === 'CONFIRMED') {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
        <CheckCircle2 size={21} />
      </div>
    );
  }

  if (
    status === 'FAILED' ||
    status === 'EXPIRED' ||
    status === 'UNMATCHED'
  ) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
        <XCircle size={21} />
      </div>
    );
  }

  if (status === 'VERIFYING') {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
        <RefreshCw size={20} />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
      <Wallet size={20} />
    </div>
  );
}

