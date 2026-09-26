
// src/app/investment/investments/page.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react';

import { isZeroUUID } from '@/src/lib/utils/uuid';
import { usePendingInvestmentDeposits } from '@/src/hooks/usePendingInvestmentDeposits';
import InvestmentOrderCard from '@/src/components/InvestmentOrderCard';
import InvestmentFilter, {
  type InvestmentFilterValue,
} from '@/src/components/InvestmentFilter';
import { investmentApi } from '@/src/lib/api/investmentApi';
import { useSettings } from '@/src/context/useSettings';
import { formatUSDT } from '@/src/lib/utils/currency';
import { getUniqueKey } from '@/src/lib/utils/uniqueKey';
import type {
  Investment,
  PendingInvestmentDeposit,
} from '@/src/lib/types/investment';
import type { CurrencyCode } from '@/src/constants/settings';

export default function InvestmentsPage() {
  const router = useRouter();
  const { currency } = useSettings();

  const [allInvestments, setAllInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] =
    useState<InvestmentFilterValue>('ALL');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const {
    pendingInvestments,
    loading: pendingLoading,
    error: pendingError,
  } = usePendingInvestmentDeposits();

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await investmentApi.getInvestments(1, 50);

        setAllInvestments(
          data.investments.filter(
            (investment) => !isZeroUUID(investment.id),
          ),
        );
      } catch (err) {
        console.error('Fetch investments error:', err);
        setError('Failed to load investments');
      } finally {
        setLoading(false);
      }
    };

    void fetchInvestments();
  }, []);

  const summary = useMemo(() => {
    const activeInvestments = allInvestments.filter(
      (investment) => investment.status === 'ACTIVE',
    );

    return {
      totalInvested: activeInvestments.reduce(
        (sum, investment) => sum + investment.amount,
        0,
      ),
      currentValue: activeInvestments.reduce(
        (sum, investment) =>
          sum + investment.projectedValue,
        0,
      ),
      projectedEarnings: activeInvestments.reduce(
        (sum, investment) =>
          sum + investment.expectedReturn,
        0,
      ),
      activeInvestments: activeInvestments.length,
    };
  }, [allInvestments]);

  const filteredInvestments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allInvestments.filter((investment) => {
      const matchesFilter =
        filter === 'ALL' ||
        investment.status === filter;

      const planName = investment.planName || '';

      const matchesSearch =
        !normalizedSearch ||
        planName
          .toLowerCase()
          .includes(normalizedSearch) ||
        investment.id
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search, allInvestments]);

  const handleNewInvestment = () => {
    router.push('/investment/plans');
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilter('ALL');
  };

  return (
    <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-xl transition hover:border-white/15 hover:bg-white/10 hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
              Portfolio
            </p>

            <h1 className="truncate text-[19px] font-extrabold tracking-tight text-white">
              My Investments
            </h1>

            <p className="truncate text-[10px] text-white/35">
              Manage your investment portfolio
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNewInvestment}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition hover:bg-emerald-400 active:scale-95"
          aria-label="New investment"
        >
          <Plus size={19} />
        </button>
      </header>

      {/* Portfolio summary */}
      <section className="mt-5 overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <div className="relative p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                <Wallet size={18} />
              </div>

              <div>
                <p className="text-[10px] font-medium text-white/40">
                  Total invested
                </p>

                <p className="mt-0.5 text-xl font-extrabold tracking-tight text-white">
                  {formatUSDT(
                    summary.totalInvested,
                    currency,
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <SummaryItem
                label="Current value"
                value={summary.currentValue}
                currency={currency}
              />

              <SummaryItem
                label="Projected"
                value={summary.projectedEarnings}
                currency={currency}
                positive
              />

              <div className="rounded-xl border border-white/6 bg-white/4 p-3">
                <p className="text-[9px] text-white/35">
                  Active
                </p>

                <p className="mt-1 text-sm font-extrabold text-white">
                  {summary.activeInvestments}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mt-5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              aria-hidden="true"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search investments..."
              aria-label="Search investments"
              className="h-11 w-full rounded-xl border border-white/8 bg-[#0B1426] pl-10 pr-3 text-xs text-white outline-none placeholder:text-white/25 transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setShowFilters((current) => !current)
            }
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
              showFilters
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                : 'border-white/8 bg-[#0B1426] text-white/45 hover:bg-white/7 hover:text-white'
            }`}
            aria-label="Filter investments"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>
      </section>

      {showFilters && (
        <section className="mt-4">
          <InvestmentFilter
            value={filter}
            onChange={setFilter}
          />
        </section>
      )}

      {!showFilters && filter !== 'ALL' && (
        <section className="mt-4">
          <InvestmentFilter
            value={filter}
            onChange={setFilter}
          />
        </section>
      )}

      {/* Pending investments */}
      {!pendingLoading &&
        pendingInvestments.length > 0 && (
          <PendingInvestmentRecovery
            pendingInvestments={pendingInvestments}
            onContinue={(investmentId) =>
              router.push(
                `/investment/investments/${investmentId}`,
              )
            }
          />
        )}

      {pendingError && (
        <section className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/8 p-3">
          <p className="text-[10px] font-medium leading-4 text-amber-200">
            {pendingError}
          </p>
        </section>
      )}

      {/* Investment orders */}
      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-white">
              Investment Orders
            </h2>

            <p className="mt-0.5 text-[10px] text-white/30">
              {filteredInvestments.length} investment
              {filteredInvestments.length === 1
                ? ''
                : 's'}
            </p>
          </div>

          {(search || filter !== 'ALL') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[10px] font-bold text-emerald-300 transition hover:text-emerald-200"
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/8 bg-[#0B1426] px-5 py-12 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />

            <p className="mt-4 text-xs text-white/35">
              Loading investments...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/15 bg-red-400/8 p-4">
            <p className="text-xs text-red-200">
              {error}
            </p>
          </div>
        ) : filteredInvestments.length > 0 ? (
          <div className="space-y-4">
            {filteredInvestments.map(
              (investment, index) => (
                <InvestmentOrderCard
                  key={getUniqueKey(
                    investment.id,
                    index,
                  )}
                  investment={investment}
                  onView={() =>
                    router.push(
                      `/investment/investments/${investment.id}`,
                    )
                  }
                />
              ),
            )}
          </div>
        ) : (
          <EmptyInvestments
            search={search}
            hasFilter={filter !== 'ALL'}
            onClear={handleClearFilters}
            onExplore={handleNewInvestment}
          />
        )}
      </section>

      {/* Available plans */}
      <section className="mt-8">
        <div className="relative overflow-hidden rounded-[26px] border border-emerald-400/10 bg-[#0B1426] p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl"
          />

          <div className="relative">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              New opportunity
            </p>

            <h2 className="mt-1 text-lg font-extrabold text-white">
              Looking for another plan?
            </h2>

            <p className="mt-1 text-xs leading-5 text-white/40">
              Explore investment plans currently
              available to company team members.
            </p>

            <button
              type="button"
              onClick={handleNewInvestment}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_25px_rgba(16,185,129,0.15)] transition hover:bg-emerald-400 active:scale-95"
            >
              Explore plans
              <Plus size={14} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

interface SummaryItemProps {
  label: string;
  value: number;
  currency: CurrencyCode;
  positive?: boolean;
}

function SummaryItem({
  label,
  value,
  currency,
  positive = false,
}: SummaryItemProps) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/4 p-3">
      <p className="text-[9px] text-white/35">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-extrabold ${
          positive
            ? 'text-emerald-300'
            : 'text-white'
        }`}
      >
        {formatUSDT(value, currency)}
      </p>
    </div>
  );
}

interface EmptyInvestmentsProps {
  search: string;
  hasFilter: boolean;
  onClear: () => void;
  onExplore: () => void;
}

function EmptyInvestments({
  search,
  hasFilter,
  onClear,
  onExplore,
}: EmptyInvestmentsProps) {
  const hasSearchOrFilter =
    search.trim().length > 0 || hasFilter;

  return (
    <div className="rounded-[26px] border border-dashed border-white/10 bg-[#0B1426] px-5 py-12 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-2xl"
        aria-hidden="true"
      >
        📦
      </div>

      <h3 className="mt-4 text-sm font-bold text-white">
        {hasSearchOrFilter
          ? 'No matching investments'
          : 'No investments yet'}
      </h3>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-white/35">
        {hasSearchOrFilter
          ? 'Try a different search term or clear your filters.'
          : 'Your investment orders will appear here once you make an investment.'}
      </p>

      {hasSearchOrFilter ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-xs font-bold text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          Clear filters
        </button>
      ) : (
        <button
          type="button"
          onClick={onExplore}
          className="mt-4 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-400"
        >
          Explore investment plans
        </button>
      )}
    </div>
  );
}

interface PendingInvestmentRecoveryProps {
  pendingInvestments: PendingInvestmentDeposit[];
  onContinue: (investmentId: string) => void;
}

function PendingInvestmentRecovery({
  pendingInvestments,
  onContinue,
}: PendingInvestmentRecoveryProps) {
  return (
    <section className="mt-5">
      <div className="mb-3">
        <h2 className="text-[16px] font-extrabold text-white">
          Complete your investments
        </h2>

        <p className="mt-0.5 text-[10px] leading-4 text-white/35">
          These investments are waiting for their
          deposit to be completed.
        </p>
      </div>

      <div className="space-y-3">
        {pendingInvestments.map(
          ({ investment, deposit }) => (
            <div
              key={investment.id}
              className="rounded-3xl border border-amber-400/15 bg-[#0B1426] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-amber-300">
                    Deposit required
                  </p>

                  <h3 className="mt-1 truncate text-sm font-extrabold text-white">
                    {investment.planName ||
                      'Investment Plan'}
                  </h3>

                  <p className="mt-1 text-[10px] text-white/35">
                    Investment amount:{' '}
                    <span className="font-bold text-white/70">
                      {investment.amount}
                    </span>
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-amber-400/15 bg-amber-400/8 px-2.5 py-1 text-[9px] font-bold text-amber-200">
                  {deposit.status}
                </span>
              </div>

              <div className="mt-3 rounded-xl border border-white/7 bg-white/4 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-white/30">
                    Expected deposit
                  </span>

                  <span className="text-xs font-extrabold text-white">
                    {deposit.expectedAmount}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] text-white/30">
                    Deposit status
                  </span>

                  <span className="text-[10px] font-bold text-amber-300">
                    {deposit.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onContinue(investment.id)
                }
                className="mt-3 w-full rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-400 active:scale-[0.99]"
              >
                View investment
              </button>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
