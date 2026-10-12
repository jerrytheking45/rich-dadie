
// src/app/investment/investments/page.tsx


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Clock3,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";

import { isZeroUUID } from "@/src/lib/utils/uuid";
import { usePendingInvestmentDeposits } from "@/src/hooks/usePendingInvestmentDeposits";
import InvestmentOrderCard from "@/src/components/InvestmentOrderCard";
import InvestmentFilter, {
  type InvestmentFilterValue,
} from "@/src/components/InvestmentFilter";
import { investmentApi } from "@/src/lib/api/investmentApi";
import { useSettings } from "@/src/context/useSettings";
import { formatUSDT } from "@/src/lib/utils/currency";
import { getUniqueKey } from "@/src/lib/utils/uniqueKey";

import type {
  Investment,
  PendingInvestmentDeposit,
} from "@/src/lib/types/investment";
import type { CurrencyCode } from "@/src/constants/settings";

const PAGE_SIZE = 50;

export default function InvestmentsPage() {
  const router = useRouter();
  const { currency } = useSettings();

  const [allInvestments, setAllInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<InvestmentFilterValue>("ALL");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    pendingInvestments,
    loading: pendingLoading,
    error: pendingError,
  } = usePendingInvestmentDeposits();

  const fetchInvestments = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await investmentApi.getInvestments(1, PAGE_SIZE);

      if (signal?.aborted) return;

      setAllInvestments(
        data.investments.filter(
          (investment) => !isZeroUUID(investment.id),
        ),
      );
      setError("");
    } catch (err) {
      if (signal?.aborted) return;

      console.error("Fetch investments error:", err);
      setAllInvestments([]);
      setError("Unable to load your investments. Please try again.");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      setLoading(true);
      await fetchInvestments(controller.signal);

      if (!controller.signal.aborted) {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [fetchInvestments]);

  const handleRefresh = async () => {
    if (loading || refreshing) return;

    setRefreshing(true);
    await fetchInvestments();
    setRefreshing(false);
  };

  const summary = useMemo(() => {
    const active = allInvestments.filter(
      (investment) => investment.status === "ACTIVE",
    );

    return {
      totalInvested: active.reduce(
        (sum, investment) => sum + Number(investment.amount || 0),
        0,
      ),
      projectedValue: active.reduce(
        (sum, investment) =>
          sum + Number(investment.projectedValue || 0),
        0,
      ),
      projectedEarnings: active.reduce(
        (sum, investment) =>
          sum + Number(investment.expectedReturn || 0),
        0,
      ),
      activeCount: active.length,
    };
  }, [allInvestments]);

  const filteredInvestments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allInvestments.filter((investment) => {
      const matchesFilter =
        filter === "ALL" || investment.status === filter;

      const matchesSearch =
        !query ||
        (investment.planName || "").toLowerCase().includes(query) ||
        investment.id.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [allInvestments, filter, search]);

  const clearFilters = () => {
    setSearch("");
    setFilter("ALL");
  };

  const explorePlans = () => router.push("/investment/plans");

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050B18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E60033]/10 blur-[85px]"
      />

      <div className="relative mx-auto w-full max-w-5xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/investment")}
              aria-label="Back to investment home"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 transition hover:text-white sm:h-10 sm:w-10"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
                Portfolio
              </p>
              <h1 className="truncate text-[19px] font-black tracking-tight sm:text-[23px]">
                My Investments
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={loading || refreshing}
              aria-label="Refresh investments"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/60 transition hover:text-[#FF476B] disabled:opacity-40 sm:h-10 sm:w-10"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>

            <button
              type="button"
              onClick={explorePlans}
              aria-label="New investment"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E60033] text-white transition hover:bg-[#FF174B] active:scale-95 sm:h-10 sm:w-10"
            >
              <Plus size={19} />
            </button>
          </div>
        </header>

        {/* SUMMARY */}
        <section className="relative mt-5 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#25101E] via-[#101827] to-[#0B1426] p-4 sm:rounded-[26px] sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#E60033]/10 blur-3xl"
          />

          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/25 bg-[#E60033]/15 text-[#FF476B]">
              <Wallet size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-white/55">
                Active investment principal
              </p>

              <p className="mt-0.5 wrap-break-words text-[23px] font-black tracking-tight sm:text-[29px]">
                {loading
                  ? "—"
                  : formatUSDT(summary.totalInvested, currency)}
              </p>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <SummaryItem
              label="Projected value"
              value={
                loading
                  ? "—"
                  : formatUSDT(summary.projectedValue, currency)
              }
            />

            <SummaryItem
              label="Expected earnings"
              value={
                loading
                  ? "—"
                  : formatUSDT(summary.projectedEarnings, currency)
              }
            />

            <SummaryItem
              label="Active orders"
              value={loading ? "—" : String(summary.activeCount)}
              className="col-span-2 sm:col-span-1"
            />
          </div>

          <p className="relative mt-3 text-[9px] leading-4 text-white/40">
            Based on active records in the first {PAGE_SIZE} loaded
            investments. Projected amounts are estimates, not
            available wallet funds or guaranteed returns.
          </p>
        </section>

        {/* SEARCH AND FILTER */}
        <section className="mt-5">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search plan or investment ID"
                aria-label="Search investments"
                className="h-11 w-full min-w-0 rounded-xl border border-white/10 bg-[#0B1426] pl-10 pr-9 text-xs text-white outline-none placeholder:text-white/30 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              aria-label="Toggle investment filters"
              aria-expanded={showFilters}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                showFilters || filter !== "ALL"
                  ? "border-[#E60033]/40 bg-[#E60033]/10 text-[#FF476B]"
                  : "border-white/10 bg-[#0B1426] text-white/55 hover:text-white"
              }`}
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>

          {(showFilters || filter !== "ALL") && (
            <div className="mt-3 rounded-xl border border-white/10 bg-[#0B1426] p-3">
              <InvestmentFilter value={filter} onChange={setFilter} />
            </div>
          )}
        </section>

        {/* PENDING DEPOSIT RECOVERY */}
        {!pendingLoading && pendingInvestments.length > 0 && (
          <PendingInvestmentRecovery
            pendingInvestments={pendingInvestments}
            currency={currency}
            onContinue={(id) =>
              router.push(`/investment/investments/${id}`)
            }
          />
        )}

        {pendingError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-[11px] leading-5 text-amber-200"
          >
            {pendingError}
          </p>
        )}

        {/* ORDERS */}
        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-black sm:text-base">
                Investment Orders
              </h2>

              <p className="mt-0.5 text-[10px] text-white/40">
                {loading
                  ? "Loading records..."
                  : `${filteredInvestments.length} matching record${
                      filteredInvestments.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>

            {(search.trim() || filter !== "ALL") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[11px] font-bold text-[#FF476B] hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-[20px] border border-white/10 bg-[#0B1426]"
                />
              ))}
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-[20px] border border-[#E60033]/25 bg-[#0B1426] p-5 text-center"
            >
              <AlertCircle
                size={24}
                className="mx-auto text-[#FF476B]"
              />
              <p className="mt-3 text-xs text-white/70">{error}</p>
              <button
                type="button"
                onClick={() => void handleRefresh()}
                disabled={refreshing}
                className="mt-4 rounded-xl bg-[#E60033] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          ) : filteredInvestments.length ? (
            <div className="grid min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4">
              {filteredInvestments.map((investment, index) => (
                <InvestmentOrderCard
                  key={getUniqueKey(investment.id, index)}
                  investment={investment}
                  onView={() =>
                    router.push(
                      `/investment/investments/${investment.id}`,
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyInvestments
              hasFilter={Boolean(search.trim()) || filter !== "ALL"}
              onClear={clearFilters}
              onExplore={explorePlans}
            />
          )}
        </section>

        {/* EXPLORE PLANS */}
        <section className="relative mt-7 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-[#0B1426] p-4 sm:p-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#E60033]/10 blur-3xl"
          />

          <div className="relative">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
              Explore plans
            </p>

            <h2 className="mt-1 text-base font-black">
              Looking for another investment plan?
            </h2>

            <p className="mt-1 max-w-md text-[11px] leading-5 text-white/45">
              Review available plans, their terms, duration, and
              investment risks before proceeding.
            </p>

            <button
              type="button"
              onClick={explorePlans}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#E60033] px-4 text-xs font-extrabold text-white transition hover:bg-[#FF174B]"
            >
              Explore plans
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-white/10 bg-[#07101F]/70 p-3 ${className}`}
    >
      <p className="text-[9px] text-white/45">{label}</p>
      <p className="mt-1 wrap-break-words text-xs font-black text-white sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function EmptyInvestments({
  hasFilter,
  onClear,
  onExplore,
}: {
  hasFilter: boolean;
  onClear: () => void;
  onExplore: () => void;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-white/15 bg-[#0B1426] px-5 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
        <Wallet size={22} />
      </div>

      <h3 className="mt-4 text-sm font-black">
        {hasFilter ? "No matching investments" : "No investments yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-white/45">
        {hasFilter
          ? "Try another search term or clear your filters."
          : "Your investment orders will appear here once you create an investment."}
      </p>

      <button
        type="button"
        onClick={hasFilter ? onClear : onExplore}
        className="mt-5 rounded-xl bg-[#E60033] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#FF174B]"
      >
        {hasFilter ? "Clear filters" : "Explore investment plans"}
      </button>
    </div>
  );
}

function PendingInvestmentRecovery({
  pendingInvestments,
  currency,
  onContinue,
}: {
  pendingInvestments: PendingInvestmentDeposit[];
  currency: CurrencyCode;
  onContinue: (investmentId: string) => void;
}) {
  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center gap-2">
        <Clock3 size={16} className="text-amber-300" />
        <div>
          <h2 className="text-sm font-black">Complete your investments</h2>
          <p className="text-[10px] text-white/40">
            These orders still require deposit attention.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {pendingInvestments.map(({ investment, deposit }) => (
          <article
            key={investment.id}
            className="min-w-0 rounded-[20px] border border-amber-400/20 bg-[#0B1426] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-amber-300">
                  Deposit required
                </p>
                <h3 className="mt-1 wrap-break-words text-sm font-black">
                  {investment.planName || "Investment Plan"}
                </h3>
              </div>

              <span className="max-w-[45%] wrap-break-words rounded-lg border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[9px] font-bold text-amber-200">
                {deposit.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <SummaryItem
                label="Investment amount"
                value={formatUSDT(investment.amount, currency)}
              />
              <SummaryItem
                label="Expected deposit"
                value={formatUSDT(deposit.expectedAmount, currency)}
              />
            </div>

            <button
              type="button"
              onClick={() => onContinue(investment.id)}
              className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-3 text-xs font-extrabold text-white transition hover:bg-[#FF174B]"
            >
              View investment
              <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}