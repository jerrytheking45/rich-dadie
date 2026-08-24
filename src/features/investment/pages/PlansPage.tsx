
// src/features/investment/pages/PlansPage.tsx

import {
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import InvestmentBottomNav from "../components/InvestmentBottomNav";
import InvestmentPlanCard from "../components/InvestmentPlanCard";

import { investmentPlans } from "../data/investment-demo";

const PlansPage = () => {
  const navigate = useNavigate();

  /**
   * Only display investment plans that are currently active.
   */
  const activePlans = investmentPlans.filter(
    (plan) => plan.status === "ACTIVE",
  );

  const handleBack = () => {
    navigate("/investment");
  };

  const handlePlanClick = (planId: string) => {
    navigate(`/investment/invest/${planId}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-32 pt-5 sm:px-6">
        {/* =========================================================
            HEADER
        ========================================================= */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-slate-600
                shadow-sm
                transition
                hover:bg-slate-50
                active:scale-95
              "
              aria-label="Back to investment home"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Explore
              </p>

              <h1 className="text-[19px] font-extrabold tracking-tight text-slate-900">
                Investment Plans
              </h1>
            </div>
          </div>

          <div
            className="
              flex
              h-10
              min-w-10
              items-center
              justify-center
              rounded-full
              bg-emerald-50
              px-3
              text-xs
              font-extrabold
              text-emerald-600
            "
          >
            {activePlans.length}
          </div>
        </header>

        {/* =========================================================
            INTRODUCTION
        ========================================================= */}
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-amber-50
                text-amber-500
              "
            >
              <Sparkles size={15} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Opportunities for your team
              </p>

              <p className="text-[10px] text-slate-400">
                Choose an investment plan that suits your goals.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            FEATURED INFORMATION CARD
        ========================================================= */}
        <section className="mt-5">
          <div
            className="
              overflow-hidden
              rounded-[24px]
              bg-gradient-to-br
              from-emerald-700
              to-emerald-500
              p-5
              text-white
              shadow-sm
            "
          >
            <div className="relative">
              {/* Decorative circle */}
              <div
                className="
                  absolute
                  -right-12
                  -top-16
                  h-36
                  w-36
                  rounded-full
                  bg-white/10
                "
              />

              <div className="relative">
                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-white/15
                    px-2.5
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wide
                  "
                >
                  Employee investment
                </span>

                <h2 className="mt-3 text-xl font-extrabold tracking-tight">
                  Grow your future.
                </h2>

                <p className="mt-1 max-w-sm text-[10px] leading-5 text-white/70">
                  Explore investment opportunities created
                  specifically for company team members.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                    <Sparkles size={13} />
                  </div>

                  <span className="text-[10px] font-semibold text-white/80">
                    {activePlans.length > 0
                      ? `${activePlans.length} active ${
                          activePlans.length === 1
                            ? "plan"
                            : "plans"
                        } available`
                      : "No active plans currently"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            PLANS SECTION HEADER
        ========================================================= */}
        <section className="mt-7">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">
                Available Plans
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Select a plan to view its details.
              </p>
            </div>

            {activePlans.length > 0 && (
              <span className="text-[10px] font-semibold text-emerald-600">
                {activePlans.length}{" "}
                {activePlans.length === 1 ? "option" : "options"}
              </span>
            )}
          </div>
        </section>

        {/* =========================================================
            PLANS GRID
        ========================================================= */}
        {activePlans.length > 0 ? (
          <section className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              {activePlans.map((plan) => (
                <InvestmentPlanCard
                  key={plan.id}
                  plan={plan}
                  onClick={() => handlePlanClick(plan.id)}
                />
              ))}
            </div>
          </section>
        ) : (
          /* =======================================================
             EMPTY STATE
          ======================================================= */
          <section className="mt-4">
            <div
              className="
                rounded-[24px]
                border
                border-dashed
                border-slate-200
                bg-white
                px-6
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
              >
                ✨
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-800">
                No investment plans available
              </h3>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
                There are currently no active investment
                plans available for team members. New
                opportunities will appear here when they
                become available.
              </p>

              <button
                type="button"
                onClick={handleBack}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:bg-slate-800
                  active:scale-95
                "
              >
                Back to investments
                <ChevronRight size={14} />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================
            INFORMATION NOTICE
        ========================================================= */}
        {activePlans.length > 0 && (
          <section className="mt-6">
            <div
              className="
                rounded-[20px]
                border
                border-slate-200
                bg-white
                p-4
              "
            >
              <div className="flex gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-50
                    text-emerald-600
                  "
                >
                  <Sparkles size={15} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Before you invest
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-400">
                    Review the investment amount, duration,
                    expected earnings and applicable terms
                    before placing an investment order.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ===========================================================
          BOTTOM NAVIGATION
      =========================================================== */}
      <InvestmentBottomNav />
    </div>
  );
};

export default PlansPage;