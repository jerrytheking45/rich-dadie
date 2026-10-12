
// src/app/investment/plans/page.tsx


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import InvestmentPlanCard from "@/src/components/InvestmentPlanCard";
import { investmentApi } from "@/src/lib/api/investmentApi";

import type { InvestmentPlan } from "@/src/lib/types/investment";

/* ==========================================
   PLANS PAGE
========================================== */

export default function PlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  /* ==========================================
     LOAD PUBLISHED PLANS
  ========================================== */

  useEffect(() => {
    let cancelled = false;

    const loadPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await investmentApi.getPlans();

        if (cancelled) return;

        const publishedPlans = data.filter(
          (plan) => plan.status === "PUBLISHED"
        );

        setPlans(publishedPlans);
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Failed to load investment plans:",
          err
        );

        setPlans([]);

        setError(
          "Unable to load investment plans. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPlans();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  /* ==========================================
     NAVIGATION
  ========================================== */

  const handlePlanClick = (planId: string) => {
    router.push(`/investment/plans/${planId}`);
  };

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <main className="relative mx-auto w-full min-w-0 max-w-2xl overflow-x-clip px-3 pb-32 pt-4 text-white min-[375px]:px-4 sm:px-6 sm:pt-6 lg:max-w-5xl lg:px-8">

      {/* =====================================
          BACKGROUND ACCENTS
      ====================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-[#E60033]/5 blur-[90px]" />

        <div className="absolute -left-20 top-[55%] h-64 w-64 rounded-full bg-[#E60033]/5 blur-[90px]" />
      </div>

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="flex min-w-0 items-center justify-between gap-3">

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0B1426] text-white/65 transition hover:border-[#E60033]/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/60 sm:h-10 sm:w-10"
          >
            <ArrowLeft size={17} aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#FF476B]">
              Explore
            </p>

            <h1 className="truncate text-[17px] font-black tracking-tight text-white min-[375px]:text-[19px] sm:text-[23px]">
              Investment Plans
            </h1>
          </div>
        </div>

        {/* Published plan count */}
        <div
          aria-label={`${plans.length} published investment plans`}
          className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 text-[11px] font-black tabular-nums text-[#FF476B] sm:h-10 sm:min-w-10"
        >
          {loading ? "…" : plans.length}
        </div>
      </header>

      {/* =====================================
          INTRODUCTION
      ====================================== */}

      <section className="mt-6">
        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
            <Sparkles size={16} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <p className="text-[12px] font-bold text-white/85 sm:text-[13px]">
              Discover your next opportunity
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-white/45 sm:text-[11px]">
              Explore investment plans that align with your goals.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================
          FEATURED BANNER
      ====================================== */}

      <section className="mt-5">

        <div className="relative isolate min-w-0 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#29101D] via-[#111525] to-[#07101F] p-4 shadow-xl shadow-black/20 min-[375px]:p-5 sm:rounded-[26px] sm:p-6">

          {/* Background effects */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-20 -z-10 h-52 w-52 rounded-full bg-[#E60033]/15 blur-[55px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 -z-10 h-28 w-44 rounded-full bg-[#FF476B]/5 blur-[45px]"
          />

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF476B]/25 bg-[#E60033]/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[#FF7895]">
            <TrendingUp size={12} aria-hidden="true" />
            REDIQ Investments
          </span>

          {/* Heading */}
          <h2 className="mt-4 max-w-md text-[21px] font-black leading-tight tracking-tight text-white sm:text-[27px]">
            Your future starts with
            <span className="text-[#FF476B]"> a smart decision.</span>
          </h2>

          {/* Description */}
          <p className="mt-2 max-w-md text-[11px] leading-5 text-white/60 sm:text-xs sm:leading-6">
            Discover available investment opportunities,
            compare plan details, and take meaningful steps
            toward your financial goals with REDIQ.
          </p>

          {/* Available plans */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/15 text-[#FF476B]">
              <Sparkles size={13} aria-hidden="true" />
            </div>

            <span className="text-[10px] font-semibold text-white/75">
              {loading
                ? "Checking available plans..."
                : `${plans.length} published ${
                    plans.length === 1 ? "plan" : "plans"
                  } available`}
            </span>
          </div>

          {/* Bottom accent */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/50 to-transparent"
          />
        </div>
      </section>

      {/* =====================================
          PLANS SECTION HEADING
      ====================================== */}

      <section className="mt-7">

        <div className="flex min-w-0 items-end justify-between gap-3">

          <div className="min-w-0">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FF476B]">
              Opportunities
            </p>

            <h2 className="mt-1 text-[16px] font-black tracking-tight text-white sm:text-lg">
              Available Plans
            </h2>

            <p className="mt-1 text-[10px] text-white/45 sm:text-[11px]">
              Select a plan to view its full details.
            </p>
          </div>

          {!loading && !error && plans.length > 0 && (
            <span className="shrink-0 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold text-[#FF476B]">
              {plans.length}{" "}
              {plans.length === 1 ? "option" : "options"}
            </span>
          )}
        </div>
      </section>

      {/* =====================================
          LOADING STATE
          TWO CARDS ON MOBILE
      ====================================== */}

      {loading && (
        <section
          role="status"
          aria-label="Loading investment plans"
          className="mt-4 grid min-w-0 grid-cols-2 gap-2 min-[375px]:gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4"
        >
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="min-w-0 animate-pulse overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] p-3 sm:p-4"
            >
              <div className="h-8 w-8 rounded-lg bg-white/10" />

              <div className="mt-5 h-3 w-3/4 rounded bg-white/10" />

              <div className="mt-2 h-2.5 w-1/2 rounded bg-white/5" />

              <div className="mt-6 h-7 w-2/3 rounded bg-white/10" />

              <div className="mt-5 space-y-2">
                <div className="h-2.5 rounded bg-white/5" />
                <div className="h-2.5 rounded bg-white/5" />
                <div className="h-2.5 w-3/4 rounded bg-white/5" />
              </div>

              <div className="mt-6 h-9 rounded-lg bg-white/10" />
            </div>
          ))}
        </section>
      )}

      {/* =====================================
          ERROR STATE
      ====================================== */}

      {!loading && error && (
        <section className="mt-4 rounded-2xl border border-[#E60033]/25 bg-[#E60033]/8 p-5 text-center">

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#E60033]/15 text-[#FF476B]">
            <RefreshCw size={18} aria-hidden="true" />
          </div>

          <h3 className="mt-3 text-sm font-bold text-white">
            Something went wrong
          </h3>

          <p
            role="alert"
            className="mx-auto mt-1.5 max-w-xs text-[11px] leading-5 text-white/55"
          >
            {error}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-5 text-[11px] font-bold text-white transition hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B]"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Try again
          </button>
        </section>
      )}

      {/* =====================================
          INVESTMENT PLAN CARDS
      ====================================== */}

      {!loading && !error && (
        <>
          {plans.length > 0 ? (

            <section
              aria-label="Published investment plans"
              className="mt-4 min-w-0"
            >

              {/*
                RESPONSIVE GRID:

                Mobile:  2 cards
                Tablet:  3 cards
                Desktop: 4 cards

                min-w-0 prevents flex/grid content
                from forcing horizontal overflow.
              */}

              <div className="grid min-w-0 grid-cols-2 items-stretch gap-2 min-[375px]:gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">

                {plans.map((plan, index) => (
                  <div
                    key={`${plan.id}-${index}`}
                    className="min-w-0 *:h-full *:min-w-0 *:w-full"
                  >
                    <InvestmentPlanCard
                      plan={plan}
                      onClick={() =>
                        handlePlanClick(plan.id)
                      }
                    />
                  </div>
                ))}

              </div>
            </section>

          ) : (

            /* =====================================
                EMPTY STATE
            ====================================== */

            <section className="mt-4">

              <div className="rounded-2xl border border-dashed border-white/10 bg-[#0B1426] px-4 py-10 text-center sm:px-6 sm:py-12">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                  <Sparkles size={21} aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-[13px] font-black text-white sm:text-sm">
                  No investment plans available
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-white/50">
                  There are currently no published
                  investment plans. Check back later
                  for new opportunities.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/investment")
                  }
                  className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 text-[11px] font-bold text-white transition hover:bg-[#FF174B] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B]"
                >
                  Back to dashboard

                  <ChevronRight
                    size={14}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {/* =====================================
          PAGE FOOTER MESSAGE
      ====================================== */}

      {!loading && !error && plans.length > 0 && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/8 bg-[#0B1426]/70 px-3.5 py-3">

          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E60033]/10 text-[#FF476B]">
            <ArrowRight size={12} aria-hidden="true" />
          </div>

          <p className="text-[10px] leading-5 text-white/45">
            Review each plan&apos;s investment amount,
            duration, projected returns and applicable
            conditions before proceeding.
          </p>
        </div>
      )}
    </main>
  );
}