
// src/app/investment/profile/wallet/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronRight,
  FileText,
  History,
  Lock,
  PlusCircle,
  RefreshCw,
  TrendingUp,
  Wallet as WalletIcon,
  Repeat2,
} from 'lucide-react';

//import InvestmentBottomNav from '@/src/components/InvestmentBottomNav';
import { useSettings } from '@/src/context/useSettings';
import { investmentApi } from '@/src/lib/api/investmentApi';
import { formatUSDT } from '@/src/lib/utils/currency';
import type { BalanceSummary } from '@/src/lib/types/investment';

interface WalletAction {
  label: string;
  description: string;
  path: string;
  icon: typeof WalletIcon;
  iconClassName: string;
  iconBackground: string;
}

export default function WalletPage() {
  const router = useRouter();
  const { currency } = useSettings();

  const [balanceSummary, setBalanceSummary] =
    useState<BalanceSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadWallet = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      /*
       * IMPORTANT:
       *
       * The backend balance-summary endpoint is now the
       * authoritative source for wallet balances.
       *
       * We intentionally do NOT calculate the available
       * balance from investments or call ledgerApi.getBalance().
       */
      const summary = await investmentApi.getBalanceSummary();

      setBalanceSummary(summary);
    } catch (err) {
      console.error('Failed to load wallet balance summary:', err);

      setError('Failed to load your wallet information.');
      setBalanceSummary(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initializeWallet = async () => {
      if (cancelled) {
        return;
      }

      await loadWallet();
    };

    void initializeWallet();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ---------------------------------------------------------------------------
   * Backend balance summary
   * ---------------------------------------------------------------------------
   */

  const activeBalance = balanceSummary?.activeBalance ?? 0;
  const totalInvested = balanceSummary?.totalInvested ?? 0;
  const totalExpectedProfit = balanceSummary?.totalExpectedProfit ?? 0;
  const totalLockedBalance = balanceSummary?.totalLockedBalance ?? 0;
  const activeInvestments = balanceSummary?.activeInvestments ?? 0;
  const maturedInvestments = balanceSummary?.maturedInvestments ?? 0;
  const assetSymbol = balanceSummary?.assetSymbol || 'USDT';

  /*
   * Only activeBalance is withdrawable/reinvestable.
   *
   * totalInvested,
   * totalExpectedProfit,
   * totalLockedBalance
   *
   * are portfolio figures and must never be treated as
   * available account funds.
   */
  const hasAvailableBalance =
    Number.isFinite(activeBalance) && activeBalance > 0;

  const walletActions: WalletAction[] = [
    {
      label: 'Wallet Binding',
      description: 'Manage your connected withdrawal wallet address.',
      path: '/investment/profile/payments',
      icon: WalletIcon,
      iconClassName: 'text-emerald-300',
      iconBackground: 'bg-emerald-400/10 border border-emerald-400/10',
    },
    {
      label: 'Account Deposit',
      description: 'Deposit USDT directly into your available account balance.',
      path: '/investment/profile/account-deposit',
      icon: ArrowDownToLine,
      iconClassName: 'text-sky-300',
      iconBackground: 'bg-sky-400/10 border border-sky-400/10',
    },
    {
      label: 'Investment Deposit',
      description: 'Fund a pending investment using its assigned deposit address.',
      path: '/investment/profile/deposit',
      icon: TrendingUp,
      iconClassName: 'text-violet-300',
      iconBackground: 'bg-violet-400/10 border border-violet-400/10',
    },
    {
      label: 'Withdraw',
      description:
        'Withdraw available account funds using your protected withdrawal wallet.',
      path: '/investment/profile/withdraw',
      icon: ArrowUpFromLine,
      iconClassName: 'text-amber-300',
      iconBackground: 'bg-amber-400/10 border border-amber-400/10',
    },
    {
      label: 'Reinvest',
      description:
        'Use your available account balance to start another investment.',
      path: '/investment/plans',
      icon: Repeat2,
      iconClassName: 'text-emerald-300',
      iconBackground: 'bg-emerald-400/10 border border-emerald-400/10',
    },
    {
      label: 'Transaction History',
      description: 'View your investment activity and transaction records.',
      path: '/investment/profile/transactions',
      icon: History,
      iconClassName: 'text-violet-300',
      iconBackground: 'bg-violet-400/10 border border-violet-400/10',
    },
    {
      label: 'Statements',
      description:
        'View your real ledger entries, balances and account activity.',
      path: '/investment/profile/statements',
      icon: FileText,
      iconClassName: 'text-white/70',
      iconBackground: 'bg-white/5 border border-white/8',
    },
    {
      label: 'Payments',
      description:
        'View your real ledger entries, balances and account activity.',
      path: '/investment/profile/payments',
      icon: FileText,
      iconClassName: 'text-white/70',
      iconBackground: 'bg-white/5 border border-white/8',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B18] text-white">
        <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-5">
          <div className="flex flex-col items-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/15 bg-[#0B1426] shadow-[0_0_35px_rgba(16,185,129,0.08)]">
              <div className="absolute inset-0 rounded-2xl bg-emerald-400/5 blur-xl" />
              <RefreshCw
                size={20}
                className="relative animate-spin text-emerald-300"
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-white/75">
              Loading wallet
            </p>

            <p className="mt-1 text-xs text-white/35">
              Securely retrieving your balance...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* Background atmosphere */}
        <div className="pointer-events-none absolute -left-32 top-24 h-64 w-64 rounded-full bg-violet-600/8 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-72 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl" />

        {/* Header */}
        <header className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/investment/profile')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/65 shadow-lg shadow-black/10 transition hover:border-white/15 hover:bg-[#101D33] hover:text-white active:scale-95"
              aria-label="Back to profile"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300/65">
                Account
              </p>

              <h1 className="truncate text-xl font-extrabold tracking-tight text-white">
                Wallet
              </h1>

              <p className="text-[10px] text-white/35">
                Manage your funds and financial activity
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadWallet(true)}
            disabled={refreshing}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/55 shadow-lg transition hover:border-white/15 hover:bg-[#101D33] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Refresh wallet"
          >
            <RefreshCw
              size={17}
              className={refreshing ? 'animate-spin' : ''}
            />
          </button>
        </header>

        {/* Error */}
        {error && (
          <section
            role="alert"
            className="relative mt-5 overflow-hidden rounded-2xl border border-red-400/15 bg-red-500/8 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                <span className="text-sm font-black">!</span>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-red-200">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadWallet(true)}
                  className="mt-3 rounded-xl border border-red-400/15 bg-red-400/10 px-4 py-2 text-xs font-bold text-red-200 transition hover:bg-red-400/15"
                >
                  Try Again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Available Balance */}
        <section className="relative mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-2xl shadow-black/20 sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10">
                  <WalletIcon
                    size={19}
                    className="text-emerald-300"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                    Available Balance
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white/60">
                    {assetSymbol}
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-emerald-400/15 bg-emerald-400/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                Available
              </span>
            </div>

            <p className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {formatUSDT(activeBalance, currency)}
            </p>

            <p className="mt-2 max-w-md text-[10px] leading-5 text-white/40">
              Funds currently available in your account. This balance can be
              withdrawn or used for a new investment.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push('/investment/profile/account-deposit')
                }
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/7 px-3 py-2.5 text-[10px] font-bold text-white transition hover:bg-white/12 active:scale-[0.98]"
              >
                <ArrowDownToLine size={14} />
                Deposit
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push('/investment/profile/withdraw')
                }
                disabled={!hasAvailableBalance}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[10px] font-bold text-white transition active:scale-[0.98] ${
                  hasAvailableBalance
                    ? 'border-white/10 bg-white/7 hover:bg-white/12'
                    : 'cursor-not-allowed border-white/5 bg-white/4 text-white/25'
                }`}
              >
                <ArrowUpFromLine size={14} />
                Withdraw
              </button>

              <button
                type="button"
                onClick={() => router.push('/investment/plans')}
                disabled={!hasAvailableBalance}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[10px] font-bold text-white transition active:scale-[0.98] ${
                  hasAvailableBalance
                    ? 'border-white/10 bg-white/7 hover:bg-white/12'
                    : 'cursor-not-allowed border-white/5 bg-white/4 text-white/25'
                }`}
              >
                <Repeat2 size={14} />
                Reinvest
              </button>
            </div>
          </div>
        </section>

        {/* Portfolio Summary */}
        <section className="relative mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-4 shadow-xl shadow-black/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
              <TrendingUp size={18} />
            </div>

            <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
              Total Invested
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {formatUSDT(totalInvested, currency)}
            </p>

            <p className="mt-1 text-[10px] text-white/30">
              {activeInvestments}{' '}
              {activeInvestments === 1
                ? 'active investment'
                : 'active investments'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-4 shadow-xl shadow-black/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/8 text-amber-300">
              <Lock size={18} />
            </div>

            <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
              Locked Balance
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {formatUSDT(totalLockedBalance, currency)}
            </p>

            <p className="mt-1 text-[10px] text-white/30">
              Funds currently locked in active investments
            </p>
          </div>
        </section>

        {/* Financial Activity */}
        <section className="relative mt-5 overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
          <div className="border-b border-white/6 px-5 pb-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/8 text-violet-300">
                <WalletIcon size={18} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-white">
                  Wallet & Financial Activity
                </h2>

                <p className="mt-0.5 text-[10px] text-white/30">
                  Manage deposits, withdrawals, wallets and account records.
                </p>
              </div>
            </div>
          </div>

          <div>
            {walletActions.map((action, index) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => router.push(action.path)}
                  className={`group flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/3 active:bg-white/5 ${
                    index !== walletActions.length - 1
                      ? 'border-b border-white/6'
                      : ''
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconBackground}`}
                    >
                      <Icon size={18} className={action.iconClassName} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white/85">
                        {action.label}
                      </p>

                      <p className="mt-0.5 max-w-72.5 text-[10px] leading-4 text-white/30">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={17}
                    className="ml-3 shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/50"
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Investment Summary */}
        <section className="relative mt-5 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/8 text-violet-300">
              <TrendingUp size={18} />
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-white">
                Investment Summary
              </h2>

              <p className="mt-0.5 text-[10px] text-white/30">
                Current investment portfolio activity
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <InfoRow
              label="Active investments"
              value={String(activeInvestments)}
            />

            <InfoRow
              label="Matured investments"
              value={String(maturedInvestments)}
            />

            <InfoRow
              label="Total invested"
              value={formatUSDT(totalInvested, currency)}
            />

            <InfoRow
              label="Expected profit"
              value={formatUSDT(totalExpectedProfit, currency)}
              valueClassName="text-emerald-300"
            />

            <InfoRow
              label="Locked balance"
              value={formatUSDT(totalLockedBalance, currency)}
              valueClassName="text-amber-300"
            />

            <div className="my-3 border-t border-white/6" />

            <InfoRow
              label="Available account balance"
              value={formatUSDT(activeBalance, currency)}
              valueClassName="text-emerald-300"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="relative mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              router.push('/investment/profile/payments')
            }
            className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0B1426] p-4 text-left shadow-xl shadow-black/10 transition hover:border-emerald-400/15 hover:bg-[#101D33] active:scale-[0.99]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
              <PlusCircle size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-white/85">
                Add Wallet
              </p>

              <p className="mt-0.5 text-[9px] text-white/30">
                Payment method
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push('/investment/profile/statements')
            }
            className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0B1426] p-4 text-left shadow-xl shadow-black/10 transition hover:border-violet-400/15 hover:bg-[#101D33] active:scale-[0.99]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/65">
              <FileText size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-white/85">
                Statements
              </p>

              <p className="mt-0.5 text-[9px] text-white/30">
                Ledger activity
              </p>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClassName = 'text-white/80',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-white/40">{label}</span>

      <span className={`text-xs font-bold ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}