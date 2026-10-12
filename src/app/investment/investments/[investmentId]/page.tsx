
// src/app/investment/investments/[investmentId]/page.tsx


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Download,
  MoreVertical,
  RefreshCw,
  TrendingUp,
  Wallet,
} from "lucide-react";

import InvestmentProgress from "@/src/components/InvestmentProgress";
import InvestmentTransactionList, {
  type InvestmentTransaction,
  type InvestmentTransactionType,
  type InvestmentTransactionStatus,
} from "@/src/components/InvestmentTransactionList";

import { investmentApi } from "@/src/lib/api/investmentApi";
import { useSettings } from "@/src/context/useSettings";
import { formatUSDT } from "@/src/lib/utils/currency";
import type { Investment } from "@/src/lib/types/investment";

const REFRESH_INTERVAL = 10000;

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InvestmentDetailsPage() {
  const router = useRouter();
  const { investmentId } = useParams<{ investmentId: string }>();
  const { currency } = useSettings();

  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
  if (!investmentId) {
    return;
  }

  let cancelled = false;
  let requestInFlight = false;

  async function load(initial = false) {
    if (requestInFlight) {
      return;
    }

    requestInFlight = true;

    try {
      const data =
        await investmentApi.getInvestment(
          investmentId,
        );

      if (cancelled) {
        return;
      }

      setInvestment(data);
      setError("");
    } catch (err) {
      if (cancelled) {
        return;
      }

      console.error(
        "Failed to load investment:",
        err,
      );

      if (initial) {
        setInvestment(null);
        setError(
          "Unable to load investment details.",
        );
      }
    } finally {
      requestInFlight = false;

      if (!cancelled && initial) {
        setLoading(false);
      }
    }
  }

  void load(true);

  const interval = window.setInterval(() => {
    void load(false);
  }, REFRESH_INTERVAL);

  return () => {
    cancelled = true;
    window.clearInterval(interval);
  };
}, [investmentId]);

  const refresh = async () => {
    if (!investmentId || refreshing) return;

    setRefreshing(true);

    try {
      const data = await investmentApi.getInvestment(investmentId);
      setInvestment(data);
      setError("");
    } catch (err) {
      console.error("Investment refresh failed:", err);
      setError("Could not refresh investment details.");
    } finally {
      setRefreshing(false);
    }
  };

  const back = () => router.push("/investment/investments");

  if (!investmentId) {
  return (
    <PageShell>
      <div className="mx-auto max-w-xl rounded-[22px] border border-white/10 bg-[#0B1426] p-8 text-center">
        <AlertCircle
          size={27}
          className="mx-auto text-[#FF476B]"
        />

        <h1 className="mt-4 text-lg font-black">
          Invalid investment ID
        </h1>

        <p className="mt-2 text-xs text-white/50">
          The requested investment ID is missing.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push("/investment/investments")
          }
          className="mt-5 rounded-xl bg-[#E60033] px-5 py-3 text-xs font-bold text-white"
        >
          Back to investments
        </button>
      </div>
    </PageShell>
  );
}

  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl animate-pulse space-y-4">
          <div className="h-10 w-44 rounded-xl bg-white/10" />
          <div className="h-64 rounded-[22px] bg-[#0B1426]" />
          <div className="h-32 rounded-[22px] bg-[#0B1426]" />
        </div>
      </PageShell>
    );
  }

  if (!investment) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl rounded-[22px] border border-white/10 bg-[#0B1426] p-8 text-center">
          <AlertCircle size={27} className="mx-auto text-[#FF476B]" />
          <h1 className="mt-4 text-lg font-black">Investment unavailable</h1>
          <p className="mt-2 text-xs text-white/50">
            {error || "This investment could not be found."}
          </p>
          <button
            type="button"
            onClick={back}
            className="mt-5 rounded-xl bg-[#E60033] px-5 py-3 text-xs font-bold text-white"
          >
            Back to investments
          </button>
        </div>
      </PageShell>
    );
  }

  const isPendingDeposit = investment.status === "PENDING";


/*
 * Display the latest investment status returned by the backend.
 * This is an investment activity summary, not a payment ledger.
 *
 * Never default every investment to PENDING.
 */

const actualInvestmentStatus = String(
  investment.status || "UNKNOWN",
).toUpperCase();

const transactionStatus: InvestmentTransactionStatus =
  actualInvestmentStatus as InvestmentTransactionStatus;

const transactions: InvestmentTransaction[] = [
  {
    id: `${investment.id}-activity`,
    type: "INVESTMENT" as InvestmentTransactionType,

    description: `Investment order · ${actualInvestmentStatus.replace(
      /_/g,
      " ",
    )}`,

    amount: investment.amount,
    date: investment.createdAt,

    status: transactionStatus,
  },
];

  const reportIssue = () => {
    setShowMenu(false);
    router.push(
      `/investment/support/new?category=INVESTMENT&investmentId=${encodeURIComponent(
        investment.id,
      )}`,
    );
  };

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-5xl">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            aria-label="Back to investments"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/70 hover:text-white"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="min-w-0 text-center">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
              Investment Details
            </p>
            <p className="mt-0.5 truncate text-xs font-black sm:text-sm">
              {investment.planName || "Investment Plan"}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={refreshing}
              aria-label="Refresh investment"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 disabled:opacity-40"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu((value) => !value)}
                aria-label="More options"
                aria-expanded={showMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-12 z-30 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#101D33] py-1 shadow-2xl">
                  <button
                    type="button"
                    onClick={reportIssue}
                    className="w-full px-4 py-3 text-left text-xs text-white/75 hover:bg-white/10"
                  >
                    Report an issue
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/investment/support");
                    }}
                    className="w-full px-4 py-3 text-left text-xs text-white/75 hover:bg-white/10"
                  >
                    Contact support
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 p-3 text-[11px] text-[#FF8BA3]"
          >
            {error}
          </p>
        )}

        {/* HERO */}
        <section className="relative mt-5 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#25101E] via-[#101827] to-[#0B1426] p-4 sm:rounded-[26px] sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#E60033]/10 blur-3xl"
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white/80">
                {investment.status}
              </span>

              <h1 className="mt-3 wrap-break-words text-xl font-black tracking-tight sm:text-2xl">
                {investment.planName || "Investment Plan"}
              </h1>

              <p className="mt-1 break-all text-[9px] text-white/40">
                ID: {investment.id}
              </p>
            </div>

            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#07101F] sm:h-24 sm:w-24">
              {investment.image ? (
                <Image
                  src={investment.image}
                  alt={investment.planName || "Investment"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#FF476B]">
                  <TrendingUp size={26} />
                </div>
              )}
            </div>
          </div>

          <div className="relative mt-6">
            <p className="text-[10px] text-white/50">
              Investment principal
            </p>
            <p className="mt-1 wrap-break-words text-[27px] font-black tracking-tight sm:text-[34px]">
              {formatUSDT(investment.amount, currency)}
            </p>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
            <Metric
              label="Expected earnings"
              value={formatUSDT(investment.expectedReturn, currency)}
            />
            <Metric
              label="Projected value"
              value={formatUSDT(investment.projectedValue, currency)}
            />
          </div>

          <p className="relative mt-3 text-[9px] leading-4 text-white/45">
            Expected earnings and projected value are estimates,
            not confirmed earnings or available wallet balance.
          </p>
        </section>

        {/* CONTENT */}
        <div className="mt-4 grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-4">
            <InvestmentProgress
              progress={investment.progress}
              durationDays={investment.durationDays || 0}
              startDate={investment.startDate || investment.createdAt}
              maturityDate={investment.maturityDate || ""}
            />

            <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
              <h2 className="text-sm font-black">Investment Summary</h2>
              <p className="mt-1 text-[10px] text-white/40">
                Plan and investment information
              </p>

              <div className="mt-4 space-y-2">
                <SummaryRow
                  label="Investment principal"
                  value={formatUSDT(investment.amount, currency)}
                />
                <SummaryRow
                  label="Duration"
                  value={`${investment.durationDays || 0} days`}
                />
                <SummaryRow
                  label="Expected earnings"
                  value={formatUSDT(investment.expectedReturn, currency)}
                />
                <SummaryRow
                  label="Projected value"
                  value={formatUSDT(investment.projectedValue, currency)}
                />
                <SummaryRow
                  label="Expected return rate"
                  value={`${investment.expectedReturnRate || 0}%`}
                />
                <SummaryRow
                  label="Status"
                  value={investment.status}
                />
              </div>
            </section>

            <section className="grid grid-cols-2 gap-2 sm:gap-3">
              <DateCard
                label="Start date"
                date={investment.startDate || investment.createdAt}
              />
              <DateCard
                label="Maturity date"
                date={investment.maturityDate}
              />
            </section>
          </div>

          <div className="min-w-0 space-y-4">

<section className="min-w-0">
  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
    <div>
      <h2 className="text-xs font-black text-white/90">
        Order Activity
      </h2>

      <p className="mt-1 text-[10px] text-white/40">
        Latest investment information
      </p>
    </div>

    <span className="rounded-lg border border-white/10 bg-[#0B1426] px-2.5 py-1.5 text-[10px] font-extrabold text-white/80">
      {actualInvestmentStatus.replace(/_/g, " ")}
    </span>
  </div>

  <InvestmentTransactionList
    transactions={transactions}
  />

  <p className="mt-3 text-[10px] leading-5 text-white/45">
    This activity summary reflects the latest investment status
    reported by your account. It is not a verified payment
    transaction or proof of credited earnings. Consult your
    account statements for financial transaction records.
  </p>
</section>

            <section className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push("/investment/profile/statements")
                }
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0B1426] px-3 text-xs font-bold text-white/75 hover:bg-white/10"
              >
                <Download size={15} />
                Statements
              </button>

              {isPendingDeposit ? (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/investment/investments/${encodeURIComponent(
                        investment.id,
                      )}/deposit`,
                    )
                  }
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-3 text-xs font-extrabold text-white hover:bg-[#FF174B]"
                >
                  <Wallet size={15} />
                  Complete Deposit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/investment/wallet")}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-3 text-xs font-extrabold text-white hover:bg-[#FF174B]"
                >
                  <Wallet size={15} />
                  View Wallet
                </button>
              )}
            </section>

            <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-4">
              <div className="flex gap-2.5">
                <CalendarDays
                  size={17}
                  className="mt-0.5 shrink-0 text-amber-300"
                />
                <p className="text-[10px] leading-5 text-white/55">
                  Investments may involve risks, including potential loss of
                  capital. Please confirm all deposit and withdrawal addresses before submitting any transactions to avoid losses. Final results depend on the applicable
                  investment terms. Returns are not guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050B18] px-3 pb-32 pt-4 text-white min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8">
      {children}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-[#07101F]/60 p-3">
      <p className="text-[9px] text-white/45">{label}</p>
      <p className="mt-1 wrap-break-words text-xs font-black sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-white/5 bg-[#07101F] px-3 py-3">
      <span className="text-[10px] text-white/45">{label}</span>
      <span className="min-w-0 wrap-break-words text-right text-[11px] font-extrabold text-white/85">
        {value}
      </span>
    </div>
  );
}

function DateCard({
  label,
  date,
}: {
  label: string;
  date?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-[18px] border border-white/10 bg-[#0B1426] p-3 sm:p-4">
      <CalendarDays size={17} className="text-[#FF476B]" />
      <p className="mt-3 text-[9px] uppercase tracking-wide text-white/40">
        {label}
      </p>
      <p className="mt-1 text-xs font-black text-white/85">
        {formatDate(date)}
      </p>
    </div>
  );
}