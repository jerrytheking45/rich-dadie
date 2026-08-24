// src/features/investment/pages/PromotionsPage.tsx

import {
  ArrowLeft,
  Gift,
  Sparkles,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import InvestmentBottomNav from "../components/InvestmentBottomNav";
import PromotionCard from "../components/PromotionCard";
import { promotions } from "../data/investment-demo";

const PromotionsPage = () => {
  const navigate = useNavigate();

  const activePromotions = promotions.filter(
    (promotion) => promotion.active,
  );

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-32 pt-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/investment")}
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-full
                border border-slate-200
                bg-white
                text-slate-600
                shadow-sm
                transition
                hover:bg-slate-50
              "
              aria-label="Go back to investment home"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Offers
              </p>

              <h1 className="text-[19px] font-extrabold tracking-tight text-slate-900">
                Promotions
              </h1>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Gift size={19} />
          </div>
        </header>

        {/* Intro */}
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
              <Sparkles
                size={14}
                className="text-amber-500"
              />
            </div>

            <span className="text-xs font-bold text-amber-600">
              {activePromotions.length}{" "}
              {activePromotions.length === 1
                ? "active promotion"
                : "active promotions"}
            </span>
          </div>

          <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-slate-900">
            Exclusive team offers.
          </h2>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
            Discover special investment opportunities and
            promotional offers available to company team
            members.
          </p>
        </section>

        {/* Featured promotion */}
        {activePromotions.length > 0 && (
          <section className="mt-6">
            <div className="overflow-hidden rounded-[24px] bg-slate-900 p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                    Team opportunity
                  </p>

                  <h2 className="mt-2 text-lg font-extrabold">
                    Make the most of your investment.
                  </h2>

                  <p className="mt-1 max-w-[280px] text-[10px] leading-5 text-white/55">
                    Explore current promotions and discover
                    opportunities designed for your investment
                    journey.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
                  <Gift
                    size={22}
                    className="text-emerald-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const firstPromotion =
                    activePromotions[0];

                  if (firstPromotion) {
                    navigate(
                      `/investment/promotions/${firstPromotion.id}`,
                    );
                  }
                }}
                className="
                  mt-4
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-emerald-500
                  px-4 py-2.5
                  text-xs font-bold
                  text-white
                  transition
                  hover:bg-emerald-400
                "
              >
                View offer
                <ChevronRight size={14} />
              </button>
            </div>
          </section>
        )}

        {/* Promotions */}
        <section className="mt-7">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">
                Available Promotions
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Current offers for team members
              </p>
            </div>

            {activePromotions.length > 0 && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                {activePromotions.length} available
              </span>
            )}
          </div>

          {activePromotions.length > 0 ? (
            <div className="mt-4 space-y-4">
              {activePromotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="overflow-hidden rounded-[24px]"
                >
                  <PromotionCard
                    promotion={promotion}
                    onClick={() =>
                      navigate(
                        `/investment/promotions/${promotion.id}`,
                      )
                    }
                  />

                  {/* Promotion metadata */}
                  <div className="mx-2 -mt-1 rounded-b-2xl border border-t-0 border-slate-200 bg-white px-4 pb-3 pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <CalendarDays
                          size={13}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate text-[9px] text-slate-400">
                          {formatDate(
                            promotion.startDate,
                          )}{" "}
                          –{" "}
                          {formatDate(
                            promotion.endDate,
                          )}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/investment/promotions/${promotion.id}`,
                          )
                        }
                        className="shrink-0 text-[9px] font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPromotions
              onExplorePlans={() =>
                navigate("/investment/plans")
              }
            />
          )}
        </section>

        {/* Investment CTA */}
        <section className="mt-7 rounded-[24px] border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <Sparkles size={19} />
            </div>

            <div>
              <p className="text-xs font-extrabold text-slate-900">
                Ready to invest?
              </p>

              <p className="mt-1 text-[10px] leading-5 text-slate-500">
                Explore the investment plans currently
                available to company team members.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/investment/plans")
            }
            className="
              mt-4
              flex w-full
              items-center justify-center gap-2
              rounded-xl
              bg-emerald-600
              px-4 py-3
              text-xs font-bold
              text-white
              transition
              hover:bg-emerald-700
            "
          >
            Explore Investment Plans
            <ChevronRight size={15} />
          </button>
        </section>
      </main>

      <InvestmentBottomNav />
    </div>
  );
};

function EmptyPromotions({
  onExplorePlans,
}: {
  onExplorePlans: () => void;
}) {
  return (
    <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
        <Gift size={30} />
      </div>

      <h3 className="mt-4 text-sm font-extrabold text-slate-800">
        No active promotions
      </h3>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
        There are no special offers available at the
        moment. Check back later for new opportunities.
      </p>

      <button
        type="button"
        onClick={onExplorePlans}
        className="
          mt-5
          inline-flex items-center gap-2
          rounded-xl
          bg-slate-900
          px-4 py-2.5
          text-xs font-bold
          text-white
          transition
          hover:bg-slate-800
        "
      >
        Explore investment plans
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default PromotionsPage;