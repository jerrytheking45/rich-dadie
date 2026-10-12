
// src/app/investment/profile/wallet/page.tsx


"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpFromLine,
  ChevronRight,
  FileText,
  History,
  LockKeyhole,
  PlusCircle,
  RefreshCw,
  Repeat2,
  TrendingUp,
  Wallet as WalletIcon,
  CreditCard,
} from "lucide-react";

import { useSettings } from "@/src/context/useSettings";
import { investmentApi } from "@/src/lib/api/investmentApi";
import { formatUSDT } from "@/src/lib/utils/currency";

import type { BalanceSummary } from "@/src/lib/types/investment";

interface WalletAction {
  label: string;
  description: string;
  path: string;
  icon: typeof WalletIcon;
}

const walletActions: WalletAction[] = [
  {
    label: "Wallet Binding",
    description: "Manage your connected withdrawal wallet.",
    path: "/investment/profile/payments",
    icon: WalletIcon,
  },
  {
    label: "Account Deposit",
    description: "Add USDT to your available account balance.",
    path: "/investment/profile/account-deposit",
    icon: ArrowDownToLine,
  },
  {
    label: "Investment Deposit",
    description: "Fund a pending investment using its deposit address.",
    path: "/investment/profile/deposit",
    icon: TrendingUp,
  },
  {
    label: "Withdraw",
    description: "Withdraw funds from your available balance.",
    path: "/investment/profile/withdraw",
    icon: ArrowUpFromLine,
  },
  {
    label: "Reinvest",
    description: "Explore plans for another investment.",
    path: "/investment/plans",
    icon: Repeat2,
  },
  {
    label: "Transaction History",
    description: "Review your transactions and investment activity.",
    path: "/investment/profile/transactions",
    icon: History,
  },
  {
    label: "Statements",
    description: "View account statements and ledger entries.",
    path: "/investment/profile/statements",
    icon: FileText,
  },
  {
    label: "Payments",
    description: "Manage your payment and wallet settings.",
    path: "/investment/profile/payments",
    icon: CreditCard,
  },
];

export default function WalletPage() {
  const router = useRouter();
  const { currency } = useSettings();

  const [balanceSummary, setBalanceSummary] =
    useState<BalanceSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  
/*
 * The backend balance-summary endpoint remains
 * the authoritative source for wallet balances.
 *
 * Only activeBalance represents available funds.
 */

const loadWallet = useCallback(
  async (showRefresh = false) => {
    const requestId = ++requestIdRef.current;

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const summary =
        await investmentApi.getBalanceSummary();

      // Ignore responses from superseded requests.
      if (requestId !== requestIdRef.current) {
        return;
      }

      setBalanceSummary(summary);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      console.error(
        "Failed to load wallet balance summary:",
        err
      );

      setError(
        "Unable to retrieve your wallet information. Please try again."
      );

      // Never display stale balances after a failed request.
      setBalanceSummary(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  },
  []
);

/*
 * Initial wallet request.
 *
 * State updates happen after the API promise settles,
 * rather than synchronously inside the effect.
 *
 * The initial loading state is already true.
 */
useEffect(() => {
  const requestId = ++requestIdRef.current;

  const fetchInitialWallet = async () => {
    try {
      const summary =
        await investmentApi.getBalanceSummary();

      if (requestId !== requestIdRef.current) {
        return;
      }

      setBalanceSummary(summary);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      console.error(
        "Failed to load wallet balance summary:",
        err
      );

      setError(
        "Unable to retrieve your wallet information. Please try again."
      );

      setBalanceSummary(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  void fetchInitialWallet();

  return () => {
    // Invalidate the request when the component unmounts
    // or React re-runs the effect in Strict Mode.
    requestIdRef.current += 1;
  };
}, []);

  const activeBalance =
    balanceSummary?.activeBalance ?? 0;

  const totalInvested =
    balanceSummary?.totalInvested ?? 0;

  const totalExpectedProfit =
    balanceSummary?.totalExpectedProfit ?? 0;

  const totalLockedBalance =
    balanceSummary?.totalLockedBalance ?? 0;

  const activeInvestments =
    balanceSummary?.activeInvestments ?? 0;

  const maturedInvestments =
    balanceSummary?.maturedInvestments ?? 0;

  const assetSymbol =
    balanceSummary?.assetSymbol || "USDT";

  /*
   * Only activeBalance is available account money.
   * The other figures are portfolio information.
   */
  const hasAvailableBalance =
    !error &&
    balanceSummary !== null &&
    Number.isFinite(activeBalance) &&
    activeBalance > 0;

  const balanceUnavailable =
    loading || !!error || !balanceSummary;

  const displayAmount = (amount: number) =>
    balanceUnavailable
      ? "—"
      : formatUSDT(amount, currency);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-white">

      {/* BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-24 top-16 h-64 w-64 rounded-full bg-[#E60033]/7 blur-[85px]" />
        <div className="absolute -left-24 top-[55%] h-64 w-64 rounded-full bg-[#E60033]/5 blur-[85px]" />
      </div>

      <main className="relative mx-auto w-full min-w-0 max-w-2xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:max-w-5xl lg:px-8">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="flex min-w-0 items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

            <button
              type="button"
              onClick={() =>
                router.push("/investment/profile")
              }
              aria-label="Back to profile"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 transition hover:border-[#E60033]/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 sm:h-10 sm:w-10"
            >
              <ArrowLeft size={17} aria-hidden="true" />
            </button>

            <div className="min-w-0">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#FF476B]">
                Account
              </p>

              <h1 className="text-[19px] font-black tracking-tight text-white sm:text-[23px]">
                My Wallet
              </h1>

              <p className="truncate text-[10px] text-white/40 sm:text-[11px]">
                Manage your funds and account activity
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadWallet(true)}
            disabled={loading || refreshing}
            aria-label="Refresh wallet balance"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/60 transition hover:border-[#E60033]/30 hover:text-[#FF476B] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 sm:h-10 sm:w-10"
          >
            <RefreshCw
              size={16}
              className={
                loading || refreshing ? "animate-spin" : ""
              }
              aria-hidden="true"
            />
          </button>
        </header>

        {/* =====================================
            ERROR
        ====================================== */}

        {error && (
          <section
            role="alert"
            className="mt-5 rounded-2xl border border-[#E60033]/25 bg-[#E60033]/8 p-4"
          >
            <div className="flex items-start gap-3">

              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0 text-[#FF476B]"
                aria-hidden="true"
              />

              <div className="min-w-0">

                <p className="text-xs font-bold text-white">
                  Wallet information unavailable
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/55">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadWallet(true)}
                  disabled={refreshing}
                  className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#E60033] px-4 text-[11px] font-bold text-white transition hover:bg-[#FF174B] disabled:opacity-50"
                >
                  <RefreshCw
                    size={13}
                    className={refreshing ? "animate-spin" : ""}
                    aria-hidden="true"
                  />
                  Try again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =====================================
            AVAILABLE BALANCE CARD
        ====================================== */}

        <section
          aria-label="Available account balance"
          aria-busy={loading || refreshing}
          className="relative mt-5 min-w-0 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#29101D] via-[#111525] to-[#07101F] p-4 shadow-xl shadow-black/20 min-[375px]:p-5 sm:rounded-[26px] sm:p-6"
        >

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#E60033]/15 blur-[60px]"
          />

          <div className="relative">

            <div className="flex min-w-0 items-start justify-between gap-2">

              <div className="flex min-w-0 items-center gap-2.5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF476B]/20 bg-[#E60033]/15 text-[#FF476B]">
                  <WalletIcon size={18} aria-hidden="true" />
                </div>

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/50">
                    Available Balance
                  </p>

                  <p className="mt-1 text-[11px] font-bold text-white/75">
                    {assetSymbol}
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[9px] font-bold text-white/65">
                Account Funds
              </span>
            </div>

            {/* BALANCE */}
            <div className="mt-5 min-w-0">

              {loading ? (
                <div
                  role="status"
                  className="flex items-center gap-2 text-white/65"
                >
                  <RefreshCw
                    size={19}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">
                    Loading balance...
                  </span>
                </div>
              ) : (
                <p className="min-w-0 wrap-break-word text-[clamp(1.5rem,6vw,2.5rem)] font-black leading-tight tracking-tight tabular-nums text-white">
                  {displayAmount(activeBalance)}
                </p>
              )}

              <p className="mt-2 max-w-md text-[10px] leading-5 text-white/50 sm:text-[11px]">
                Funds available in your account for withdrawal
                or use toward another investment.
              </p>
            </div>

            {/* PRIMARY ACTIONS */}
            <div className="mt-5 grid grid-cols-3 gap-1.5 min-[375px]:gap-2 sm:mt-6 sm:gap-3">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/investment/profile/account-deposit"
                  )
                }
                className="flex min-h-10 min-w-0 flex-col items-center justify-center gap-1 rounded-xl bg-[#E60033] px-1.5 py-2 text-[10px] font-bold text-white transition hover:bg-[#FF174B] active:scale-[0.98] min-[375px]:flex-row sm:text-[11px]"
              >
                <ArrowDownToLine
                  size={15}
                  aria-hidden="true"
                />
                Deposit
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/investment/profile/withdraw"
                  )
                }
                disabled={!hasAvailableBalance}
                className="flex min-h-10 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/8 px-1.5 py-2 text-[10px] font-bold text-white transition hover:bg-white/15 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 min-[375px]:flex-row sm:text-[11px]"
              >
                <ArrowUpFromLine
                  size={15}
                  aria-hidden="true"
                />
                Withdraw
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/investment/plans")
                }
                disabled={!hasAvailableBalance}
                className="flex min-h-10 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/8 px-1.5 py-2 text-[10px] font-bold text-white transition hover:bg-white/15 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 min-[375px]:flex-row sm:text-[11px]"
              >
                <Repeat2 size={15} aria-hidden="true" />
                Reinvest
              </button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/60 to-transparent"
          />
        </section>

        {/* =====================================
            PORTFOLIO OVERVIEW
        ====================================== */}

        <section className="mt-6">

          <div className="mb-3">

            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#FF476B]">
              Overview
            </p>

            <h2 className="mt-1 text-sm font-black text-white sm:text-base">
              Portfolio Summary
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 min-[375px]:gap-3">

            {/* INVESTED */}
            <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0B1426] p-3 sm:p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                <TrendingUp size={17} aria-hidden="true" />
              </div>

              <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-white/45">
                Total Invested
              </p>

              <p className="mt-1 wrap-break-word text-[clamp(0.875rem,3vw,1.125rem)] font-black leading-snug tabular-nums text-white">
                {displayAmount(totalInvested)}
              </p>

              <p className="mt-2 text-[10px] leading-4 text-white/40">
                {balanceUnavailable
                  ? "Portfolio data unavailable"
                  : `${activeInvestments} active ${
                      activeInvestments === 1
                        ? "investment"
                        : "investments"
                    }`}
              </p>
            </div>

            {/* LOCKED */}
            <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0B1426] p-3 sm:p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/75">
                <LockKeyhole size={17} aria-hidden="true" />
              </div>

              <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-white/45">
                Locked Balance
              </p>

              <p className="mt-1 wrap-break-word text-[clamp(0.875rem,3vw,1.125rem)] font-black leading-snug tabular-nums text-white">
                {displayAmount(totalLockedBalance)}
              </p>

              <p className="mt-2 text-[10px] leading-4 text-white/40">
                Funds locked in investments
              </p>
            </div>
          </div>
        </section>

        {/* =====================================
            WALLET ACTIONS
        ====================================== */}

        <section className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426]">

          <div className="border-b border-white/8 p-4 sm:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                <WalletIcon size={17} aria-hidden="true" />
              </div>

              <div className="min-w-0">

                <h2 className="text-[13px] font-black text-white sm:text-sm">
                  Wallet & Financial Activity
                </h2>

                <p className="mt-1 text-[10px] leading-4 text-white/40">
                  Manage your funds, wallets and records.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/6">

            {walletActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() =>
                    router.push(action.path)
                  }
                  className="group flex w-full min-w-0 items-center gap-3 px-3 py-3 text-left transition hover:bg-white/4 active:bg-white/6 sm:px-5 sm:py-3.5"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E60033]/15 bg-[#E60033]/8 text-[#FF476B] sm:h-10 sm:w-10">
                    <Icon size={17} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[11px] font-bold text-white/85 sm:text-xs">
                      {action.label}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/40">
                      {action.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-[#FF476B]"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* =====================================
            INVESTMENT SUMMARY
        ====================================== */}

        <section className="mt-5 min-w-0 rounded-2xl border border-white/10 bg-[#0B1426] p-4 sm:p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
              <TrendingUp size={17} aria-hidden="true" />
            </div>

            <div>

              <h2 className="text-[13px] font-black text-white sm:text-sm">
                Investment Summary
              </h2>

              <p className="mt-1 text-[10px] text-white/40">
                Your current portfolio figures
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">

            <InfoRow
              label="Active investments"
              value={
                balanceUnavailable
                  ? "—"
                  : String(activeInvestments)
              }
            />

            <InfoRow
              label="Matured investments"
              value={
                balanceUnavailable
                  ? "—"
                  : String(maturedInvestments)
              }
            />

            <InfoRow
              label="Total invested"
              value={displayAmount(totalInvested)}
            />

            <InfoRow
              label="Projected profit"
              value={displayAmount(totalExpectedProfit)}
            />

            <InfoRow
              label="Locked balance"
              value={displayAmount(totalLockedBalance)}
            />

            <div className="border-t border-white/10 pt-3">

              <InfoRow
                label="Available account balance"
                value={displayAmount(activeBalance)}
                valueClassName="text-[#FF7895]"
              />
            </div>
          </div>

          <p className="mt-4 text-[10px] leading-5 text-white/40">
            Projected profit is a portfolio estimate, not
            available account funds. Returns may vary.
          </p>
        </section>

        {/* =====================================
            QUICK ACCESS
        ====================================== */}

        <section className="mt-5 grid grid-cols-2 gap-2 min-[375px]:gap-3">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/investment/profile/payments"
              )
            }
            className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-white/10 bg-[#0B1426] p-3 text-left transition hover:border-[#E60033]/25 sm:p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
              <PlusCircle size={17} aria-hidden="true" />
            </div>

            <div className="min-w-0">

              <p className="text-[11px] font-bold text-white sm:text-xs">
                Add Wallet
              </p>

              <p className="mt-0.5 text-[9px] text-white/40">
                Payment method
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/investment/profile/statements"
              )
            }
            className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-white/10 bg-[#0B1426] p-3 text-left transition hover:border-[#E60033]/25 sm:p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
              <FileText size={17} aria-hidden="true" />
            </div>

            <div className="min-w-0">

              <p className="text-[11px] font-bold text-white sm:text-xs">
                Statements
              </p>

              <p className="mt-0.5 text-[9px] text-white/40">
                Ledger activity
              </p>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}

/* ==========================================
   SUMMARY ROW
========================================== */

function InfoRow({
  label,
  value,
  valueClassName = "text-white/85",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3">

      <span className="min-w-0 flex-1 text-[11px] leading-5 text-white/50">
        {label}
      </span>

      <span
        className={`min-w-0 max-w-[58%] wrap-break-word text-right text-[11px] font-bold leading-5 tabular-nums ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}