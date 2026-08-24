// src/features/investment/pages/InvestmentHome.tsx

import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InvestmentBottomNav from "../components/InvestmentBottomNav";
import InvestmentHeader from "../components/InvestmentHeader";
import BalanceCard from "../components/BalanceCard";
import InvestmentCard from "../components/InvestmentCard";
import InvestmentPlanCard from "../components/InvestmentPlanCard";

import {
  activeInvestments,
  investmentPlans,
  investmentSummary,
} from "../data/investment-demo";

export default function InvestmentHome() {
  const navigate = useNavigate();

  const featuredPlans = investmentPlans.filter(
    (plan) => plan.status === "ACTIVE",
  );

  const recentInvestments = activeInvestments.slice(0, 2);
  const visiblePlans = featuredPlans.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-5 sm:px-6">
        {/* Header */}
        <InvestmentHeader
          name="Team Member"
          notificationCount={3}
        />

        {/* Welcome */}
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <Sparkles
              size={16}
              className="text-amber-500"
              aria-hidden="true"
            />

            <span className="text-xs font-semibold text-amber-600">
              Employee Investment
            </span>
          </div>

          <h1 className="mt-1 text-[25px] font-extrabold tracking-tight text-slate-900">
            Grow your future.
          </h1>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
            Manage your investments, monitor your growth and
            explore opportunities available to your team.
          </p>
        </section>

        {/* Portfolio */}
        <section className="mt-5">
          <BalanceCard summary={investmentSummary} />
        </section>

        {/* My Investments */}
        <section className="mt-7">
          <SectionHeader
            title="My Investments"
            action="View all"
            onClick={() =>
              navigate("/investment/investments")
            }
          />

          <div className="mt-3 space-y-3">
            {recentInvestments.length > 0 ? (
              recentInvestments.map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  investment={investment}
                  onClick={() =>
                    navigate(
                      `/investment/investments/${investment.id}`,
                    )
                  }
                />
              ))
            ) : (
              <EmptySection
                title="No investments yet"
                description="Start building your investment portfolio today."
                action="Explore plans"
                onClick={() =>
                  navigate("/investment/plans")
                }
              />
            )}
          </div>
        </section>

        {/* Investment Opportunities */}
        <section className="mt-8">
          <SectionHeader
            title="Investment Opportunities"
            action="See all"
            onClick={() =>
              navigate("/investment/plans")
            }
          />

          {visiblePlans.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {visiblePlans.map((plan) => (
                <InvestmentPlanCard
                  key={plan.id}
                  plan={plan}
                  onClick={() =>
                    navigate(
                      `/investment/invest/${plan.id}`,
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <EmptySection
              title="No plans available"
              description="There are currently no active investment opportunities."
            />
          )}
        </section>

        {/* Promotional Banner */}
        <section className="mt-6 overflow-hidden rounded-[24px] bg-slate-900 p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                Team opportunity
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Build your investment journey.
              </h2>

              <p className="mt-1 max-w-[250px] text-[11px] leading-4 text-white/55">
                Explore investment plans created
                specifically for company team members.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/investment/plans")
                }
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Explore plans
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
              <Sparkles
                size={30}
                className="text-emerald-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </section>
      </main>

      <InvestmentBottomNav />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section Header                                                             */
/* -------------------------------------------------------------------------- */

interface SectionHeaderProps {
  title: string;
  action: string;
  onClick: () => void;
}

function SectionHeader({
  title,
  action,
  onClick,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[16px] font-extrabold text-slate-900">
        {title}
      </h2>

      <button
        type="button"
        onClick={onClick}
        className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
      >
        {action}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty Section                                                              */
/* -------------------------------------------------------------------------- */

interface EmptySectionProps {
  title: string;
  description: string;
  action?: string;
  onClick?: () => void;
}

function EmptySection({
  title,
  description,
  action,
  onClick,
}: EmptySectionProps) {
  return (
    <div className="mt-3 rounded-[22px] border border-dashed border-slate-200 bg-white px-5 py-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
        <Sparkles
          size={18}
          className="text-slate-400"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-3 text-sm font-bold text-slate-800">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-xs text-[11px] leading-5 text-slate-400">
        {description}
      </p>

      {action && onClick && (
        <button
          type="button"
          onClick={onClick}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          {action}
        </button>
      )}
    </div>
  );
}