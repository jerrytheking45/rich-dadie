import {
  ArrowLeft,
  CalendarDays,
  Download,
  MoreVertical,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import InvestmentBottomNav from "../components/InvestmentBottomNav";
import InvestmentProgress from "../components/InvestmentProgress";
import InvestmentTransactionList, {
  type InvestmentTransaction,
} from "../components/InvestmentTransactionList";

import { activeInvestments } from "../data/investment-demo";
import { useSettings } from "../context/useSettings";
import { formatUSDT } from "../utils/currency";

export default function InvestmentDetailsPage() {
  const navigate = useNavigate();
  const { investmentId } = useParams<{ investmentId: string }>();

  const [showMenu, setShowMenu] = useState(false);

  const { currency } = useSettings();

  const investment = useMemo(
    () =>
      activeInvestments.find(
        (item) => item.id === investmentId,
      ),
    [investmentId],
  );

  if (!investment) {
    return (
      <div className="min-h-screen bg-[#f6f8f6]">
        <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-5">
          <div className="w-full rounded-[26px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl">
              📦
            </div>

            <h1 className="mt-4 text-lg font-extrabold text-slate-900">
              Investment not found
            </h1>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              The investment you're looking for could not be
              found.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/investment/investments")
              }
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              Back to investments
            </button>
          </div>
        </main>
      </div>
    );
  }

  const transactions: InvestmentTransaction[] = [
    {
      id: `${investment.id}-1`,
      type: "INVESTMENT",
      description: "Investment created",
      amount: investment.amount,
      date: investment.startDate,
      status: "COMPLETED",
    },
    {
      id: `${investment.id}-2`,
      type: "EARNING",
      description: "Projected earnings",
      amount: investment.expectedReturn,
      date: investment.startDate,
      status: "PENDING",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-32 pt-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Go back"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="text-center">
            <p className="text-[9px] uppercase tracking-wider text-slate-400">
              Investment
            </p>

            <p className="text-sm font-extrabold text-slate-900">
              {investment.id}
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowMenu((value) => !value)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              aria-label="More options"
              aria-expanded={showMenu}
            >
              <MoreVertical size={19} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                <button
                  type="button"
                  className="flex w-full items-center px-4 py-3 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  onClick={() =>
                    setShowMenu(false)
                  }
                >
                  Report an issue
                </button>

                <button
                  type="button"
                  className="flex w-full items-center px-4 py-3 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  onClick={() =>
                    setShowMenu(false)
                  }
                >
                  Contact support
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Investment Hero */}
        <section className="mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-lg">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold">
                    {investment.status}
                  </span>

                  <h1 className="mt-3 text-2xl font-extrabold">
                    {investment.planName}
                  </h1>

                  <p className="mt-1 text-[10px] text-white/60">
                    Investment ID: {investment.id}
                  </p>
                </div>

                <div className="ml-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <TrendingUp size={28} />
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[10px] uppercase tracking-wider text-white/55">
                  Investment amount
                </p>

                <p className="mt-1 text-[30px] font-extrabold tracking-tight">
                  {formatUSDT(
                    investment.amount,
                    currency,
                  )}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
                <div>
                  <p className="text-[9px] text-white/55">
                    Expected earnings
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {formatUSDT(
                      investment.expectedReturn,
                      currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-white/55">
                    Projected value
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {formatUSDT(
                      investment.projectedValue,
                      currency,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="mt-4">
          <InvestmentProgress
            progress={investment.progress}
            durationDays={investment.durationDays}
            startDate={investment.startDate}
            maturityDate={investment.maturityDate}
          />
        </section>

        {/* Investment Summary */}
        <section className="mt-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">
                Investment Summary
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Important details
              </p>
            </div>

            <ShieldCheck
              size={21}
              className="text-emerald-500"
            />
          </div>

          <div className="mt-4 space-y-2">
            <SummaryRow
              label="Investment amount"
              value={formatUSDT(
                investment.amount,
                currency,
              )}
            />

            <SummaryRow
              label="Duration"
              value={`${investment.durationDays} days`}
            />

            <SummaryRow
              label="Expected earnings"
              value={formatUSDT(
                investment.expectedReturn,
                currency,
              )}
              positive
            />

            <SummaryRow
              label="Projected value"
              value={formatUSDT(
                investment.projectedValue,
                currency,
              )}
              highlight
            />

            <SummaryRow
              label="Investment status"
              value={investment.status}
            />
          </div>
        </section>

        {/* Dates */}
        <section className="mt-4 grid grid-cols-2 gap-3">
          <DateCard
            label="Purchase date"
            date={investment.startDate}
          />

          <DateCard
            label="Maturity date"
            date={investment.maturityDate}
          />
        </section>

        {/* Transactions */}
        <section className="mt-4">
          <InvestmentTransactionList
            transactions={transactions}
          />
        </section>

        {/* Actions */}
        <section className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={15} />
            Statement
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Wallet size={15} />
            Manage
          </button>
        </section>

        {/* Information Notice */}
        <section className="mt-4 rounded-[20px] border border-amber-100 bg-amber-50 p-4">
          <div className="flex gap-3">
            <CalendarDays
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-xs font-bold text-amber-800">
                Investment information
              </p>

              <p className="mt-1 text-[10px] leading-5 text-amber-700/80">
                Projected values shown here are estimates
                based on the investment plan. Final amounts
                are determined according to the applicable
                investment terms.
              </p>
            </div>
          </div>
        </section>
      </main>

      <InvestmentBottomNav />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  positive = false,
  highlight = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
      <span className="text-[10px] text-slate-400">
        {label}
      </span>

      <span
        className={`
          text-xs
          font-extrabold
          ${
            positive
              ? "text-emerald-600"
              : highlight
                ? "text-amber-500"
                : "text-slate-800"
          }
        `}
      >
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
  date: string;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <CalendarDays size={17} />
      </div>

      <p className="mt-3 text-[9px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-extrabold text-slate-800">
        {new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
}