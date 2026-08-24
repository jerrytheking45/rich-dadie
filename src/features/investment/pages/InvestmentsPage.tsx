
// src/features/investment/pages/InvestmentsPage.tsx


import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import InvestmentBottomNav from "../components/InvestmentBottomNav";
import InvestmentOrderCard from "../components/InvestmentOrderCard";
import InvestmentFilter, {
  type InvestmentFilterValue,
} from "../components/InvestmentFilter";

import {
  activeInvestments,
  investmentSummary,
} from "../data/investment-demo";

import { useSettings } from "../context/useSettings";
import { formatUSDT } from "../utils/currency";
import type { CurrencyCode } from "../constants/settings";

export default function InvestmentsPage() {
  const navigate = useNavigate();

  const { currency } = useSettings();

  const [filter, setFilter] =
    useState<InvestmentFilterValue>("ALL");

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Filter investments                                                       */
  /* ------------------------------------------------------------------------ */

  const filteredInvestments = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return activeInvestments.filter((investment) => {
      const matchesFilter =
        filter === "ALL" ||
        investment.status === filter;

      const matchesSearch =
        !normalizedSearch ||
        investment.planName
          .toLowerCase()
          .includes(normalizedSearch) ||
        investment.id
          .toLowerCase()
          .includes(normalizedSearch);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [filter, search]);

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  const handleNewInvestment = () => {
    navigate("/investment/plans");
  };

  /* ------------------------------------------------------------------------ */
  /* Clear search/filter                                                      */
  /* ------------------------------------------------------------------------ */

  const handleClearFilters = () => {
    setSearch("");
    setFilter("ALL");
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-5 sm:px-6">

        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-slate-600
                transition
                hover:bg-slate-50
              "
              aria-label="Go back"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-[19px] font-extrabold text-slate-900">
                My Investments
              </h1>

              <p className="text-[10px] text-slate-400">
                Manage your investment portfolio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNewInvestment}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-emerald-600
              text-white
              shadow-sm
              transition
              hover:bg-emerald-700
            "
            aria-label="New investment"
          >
            <Plus size={19} />
          </button>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* Portfolio Summary                                                  */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            mt-5
            rounded-[24px]
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
          "
        >
          <div className="flex items-center gap-2">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
              "
            >
              <Wallet size={18} />
            </div>

            <div>
              <p className="text-[10px] text-slate-400">
                Total invested
              </p>

              <p className="text-lg font-extrabold text-slate-900">
                {formatUSDT(
                  investmentSummary.totalInvested,
                  currency,
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">

            <SummaryItem
              label="Current value"
              value={
                investmentSummary.currentValue
              }
              currency={currency}
            />

            <SummaryItem
              label="Projected"
              value={
                investmentSummary.projectedEarnings
              }
              currency={currency}
              positive
            />

            <div className="rounded-xl bg-slate-50 p-2.5">
              <p className="text-[9px] text-slate-400">
                Active
              </p>

              <p className="mt-1 text-sm font-extrabold text-slate-800">
                {investmentSummary.activeInvestments}
              </p>
            </div>

          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Search + Filter                                                    */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-5">
          <div className="flex gap-2">

            <div className="relative flex-1">

              <Search
                size={17}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
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
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-10
                  pr-3
                  text-xs
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                  focus:border-emerald-400
                  focus:ring-2
                  focus:ring-emerald-100
                "
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) => !value,
                )
              }
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                transition
                ${
                  showFilters
                    ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }
              `}
              aria-label="Filter investments"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={17} />
            </button>

          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Filters                                                            */}
        {/* ------------------------------------------------------------------ */}

        {showFilters && (
          <section className="mt-4">
            <InvestmentFilter
              value={filter}
              onChange={setFilter}
            />
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Active Filter                                                      */}
        {/* ------------------------------------------------------------------ */}

        {!showFilters &&
          filter !== "ALL" && (
            <section className="mt-4">
              <InvestmentFilter
                value={filter}
                onChange={setFilter}
              />
            </section>
          )}

        {/* ------------------------------------------------------------------ */}
        {/* Investment Orders                                                  */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">
                Investment Orders
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {filteredInvestments.length}{" "}
                investment
                {filteredInvestments.length === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            {(search || filter !== "ALL") && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="
                  text-[10px]
                  font-bold
                  text-emerald-600
                  transition
                  hover:text-emerald-700
                "
              >
                Clear
              </button>
            )}

          </div>

          {filteredInvestments.length > 0 ? (
            <div className="space-y-4">

              {filteredInvestments.map(
                (investment) => (
                  <InvestmentOrderCard
                    key={investment.id}
                    investment={investment}
                    onView={() =>
                      navigate(
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
              hasFilter={filter !== "ALL"}
              onClear={handleClearFilters}
              onExplore={handleNewInvestment}
            />
          )}

        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Available Plans                                                    */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-8">

          <div
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-emerald-100
              bg-emerald-50
              p-5
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-emerald-600
              "
            >
              New opportunity
            </p>

            <h2 className="mt-1 text-lg font-extrabold text-slate-900">
              Looking for another plan?
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Explore investment plans currently
              available to company team members.
            </p>

            <button
              type="button"
              onClick={handleNewInvestment}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-emerald-600
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                transition
                hover:bg-emerald-700
              "
            >
              Explore plans
              <Plus size={14} />
            </button>
          </div>

        </section>

      </main>

      <InvestmentBottomNav />
    </div>
  );
}

/* ========================================================================== */
/* Summary Item                                                               */
/* ========================================================================== */

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
    <div className="rounded-xl bg-slate-50 p-2.5">

      <p className="text-[9px] text-slate-400">
        {label}
      </p>

      <p
        className={`
          mt-1
          text-xs
          font-extrabold
          ${
            positive
              ? "text-emerald-600"
              : "text-slate-800"
          }
        `}
      >
        {formatUSDT(
          value,
          currency,
        )}
      </p>

    </div>
  );
}

/* ========================================================================== */
/* Empty State                                                                */
/* ========================================================================== */

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
    search.trim().length > 0 ||
    hasFilter;

  return (
    <div
      className="
        rounded-[24px]
        border
        border-dashed
        border-slate-200
        bg-white
        px-5
        py-12
        text-center
      "
    >

      <div
        className="
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-slate-50
          text-2xl
        "
        aria-hidden="true"
      >
        📦
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        {hasSearchOrFilter
          ? "No matching investments"
          : "No investments yet"}
      </h3>

      <p
        className="
          mx-auto
          mt-1
          max-w-xs
          text-xs
          leading-5
          text-slate-400
        "
      >
        {hasSearchOrFilter
          ? "Try a different search term or clear your filters."
          : "Your investment orders will appear here once you make an investment."}
      </p>

      {hasSearchOrFilter ? (
        <button
          type="button"
          onClick={onClear}
          className="
            mt-4
            rounded-xl
            bg-slate-900
            px-4
            py-2.5
            text-xs
            font-bold
            text-white
            transition
            hover:bg-slate-800
          "
        >
          Clear filters
        </button>
      ) : (
        <button
          type="button"
          onClick={onExplore}
          className="
            mt-4
            rounded-xl
            bg-emerald-600
            px-4
            py-2.5
            text-xs
            font-bold
            text-white
            transition
            hover:bg-emerald-700
          "
        >
          Explore investment plans
        </button>
      )}

    </div>
  );
}