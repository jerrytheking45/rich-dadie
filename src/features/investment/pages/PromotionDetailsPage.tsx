// src/features/investment/pages/PromotionDetailsPage.tsx

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Gift,
  Sparkles,
} from "lucide-react";
import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import InvestmentBottomNav from "../components/InvestmentBottomNav";
import { promotions } from "../data/investment-demo";

const PromotionDetailsPage = () => {
  const navigate = useNavigate();
  const { promotionId } = useParams<{
    promotionId: string;
  }>();

  const promotion = promotions.find(
    (item) => item.id === promotionId,
  );

  if (!promotion) {
    return (
      <Navigate
        to="/investment/promotions"
        replace
      />
    );
  }

  const isActive = promotion.active;

  const startDate = new Date(
    promotion.startDate,
  ).toLocaleDateString("en-UG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const endDate = new Date(
    promotion.endDate,
  ).toLocaleDateString("en-UG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-32 pt-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/investment/promotions")
              }
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
              aria-label="Go back to promotions"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Promotion
              </p>

              <h1 className="max-w-[250px] truncate text-[17px] font-extrabold text-slate-900">
                {promotion.title}
              </h1>
            </div>
          </div>

          <div
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-xl
              ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-400"
              }
            `}
          >
            <Gift size={17} />
          </div>
        </header>

        {/* Promotion hero */}
        <section className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          {/* Image */}
          <div className="relative h-60 overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100">
            {promotion.image ? (
              <img
                src={promotion.image}
                alt={promotion.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/70 text-emerald-400 shadow-sm">
                  <Gift size={38} />
                </div>

                <p className="mt-3 text-xs font-semibold text-emerald-600">
                  Investment Promotion
                </p>
              </div>
            )}

            {/* Image overlay */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Status */}
            <div className="absolute right-4 top-4">
              <span
                className={`
                  inline-flex items-center gap-1.5
                  rounded-full
                  px-3 py-1.5
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-wide
                  shadow-sm
                  ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "bg-white/90 text-slate-600"
                  }
                `}
              >
                {isActive && (
                  <CheckCircle2 size={12} />
                )}

                {isActive ? "Active" : "Expired"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <div>
              <div className="flex items-start gap-3">
                <div
                  className={`
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-2xl
                    ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-50 text-slate-400"
                    }
                  `}
                >
                  <Sparkles size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                    {promotion.title}
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Special opportunity for company team members
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {promotion.description}
              </p>
            </div>

            {/* Promotion period */}
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Promotion period
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {startDate}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    until
                  </p>

                  <p className="text-xs font-bold text-slate-800">
                    {endDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Active notice */}
            {isActive ? (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-emerald-800">
                      Promotion is active
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-emerald-700/80">
                      This offer is currently available.
                      Explore the available investment plans
                      to find an opportunity that suits you.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-700">
                  This promotion has ended
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-400">
                  You can still explore the currently
                  available investment plans.
                </p>
              </div>
            )}

            {/* CTA */}
            <button
              type="button"
              onClick={() =>
                navigate("/investment/plans")
              }
              className="
                mt-5
                flex w-full
                items-center justify-center gap-2
                rounded-2xl
                bg-emerald-600
                px-5 py-4
                text-xs font-extrabold
                text-white
                shadow-lg shadow-emerald-200
                transition
                hover:bg-emerald-700
                active:scale-[0.99]
              "
            >
              Explore Investment Plans
              <ArrowLeft
                size={17}
                className="rotate-180"
              />
            </button>
          </div>
        </section>

        {/* Bottom information */}
        <section className="mt-4 rounded-[22px] border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
              <Gift size={17} />
            </div>

            <div>
              <p className="text-xs font-bold text-amber-800">
                Promotion information
              </p>

              <p className="mt-1 text-[10px] leading-5 text-amber-700/80">
                Promotional offers are subject to the
                applicable investment terms and eligibility
                requirements. Please review the details of
                each investment plan before proceeding.
              </p>
            </div>
          </div>
        </section>
      </main>

      <InvestmentBottomNav />
    </div>
  );
};

export default PromotionDetailsPage;