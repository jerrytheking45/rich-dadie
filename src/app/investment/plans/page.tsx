
// src/app/investment/plans/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Layers3,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import InvestmentPlanCard from "@/src/components/InvestmentPlanCard";
import { investmentApi } from "@/src/lib/api/investmentApi";

import type {
  InvestmentPlan,
} from "@/src/lib/types/investment";

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState<
    InvestmentPlan[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  /* ------------------------------------------------------------------------ */
  /* Load published investment plans                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadPlans() {
      try {
        setLoading(true);
        setError("");

        const data =
          await investmentApi.getPlans();

        if (cancelled) {
          return;
        }

        setPlans(
          data.filter(
            (plan) =>
              plan.status === "PUBLISHED",
          ),
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to load investment plans:",
          err,
        );

        setError(
          "Unable to load investment plans. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPlans();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  const handlePlanClick = (planId: string) => {
    router.push(
      `/investment/plans/${encodeURIComponent(planId)}`,
    );
  };

  const handleRefresh = () => {
    if (loading) {
      return;
    }

    setRefreshKey((current) => current + 1);
  };

  /* ------------------------------------------------------------------------ */
  /* Page                                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050B18] px-3 pb-32 pt-5 text-white min-[375px]:px-4 sm:px-6 sm:pt-7 lg:px-8">

      {/* Ambient background */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E60033]/8 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-80 h-48 w-48 rounded-full bg-[#FF476B]/5 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl">

        {/* ================================================================ */}
        {/* PAGE HEADER                                                      */}
        {/* ================================================================ */}

        <header className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
                flex h-10 w-10 shrink-0 items-center
                justify-center rounded-xl
                border border-white/10
                bg-[#0B1426]
                text-white/65
                transition
                hover:border-[#E60033]/30
                hover:text-white
                active:scale-95
              "
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">

              <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#FF476B]">
                REDIQ Investments
              </p>

              <h1 className="mt-0.5 truncate text-lg font-black tracking-tight text-white sm:text-xl">
                Investment Plans
              </h1>

            </div>
          </div>

          {/* Published plan count */}

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 px-3 py-2">

            <Layers3
              size={15}
              className="text-[#FF476B]"
            />

            <span className="text-xs font-black tabular-nums text-white">
              {loading ? "—" : plans.length}
            </span>

            <span className="hidden text-[10px] font-semibold text-white/45 min-[400px]:inline">
              Plans
            </span>

          </div>
        </header>

        {/* ================================================================ */}
        {/* FEATURED INTRODUCTION                                            */}
        {/* ================================================================ */}

        <section className="mt-5 sm:mt-6">

          <div className="relative overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#241225] via-[#141426] to-[#0B1426] p-4 shadow-xl shadow-black/15 min-[375px]:p-5 sm:rounded-[26px] sm:p-6 lg:p-7">

            {/* Decorative glow */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-20 h-52 w-52 rounded-full bg-[#E60033]/15 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 rounded-full bg-[#FF476B]/8 blur-2xl"
            />

            {/* Decorative icon */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 top-5 hidden rotate-12 text-[#FF476B]/10 sm:block"
            >
              <TrendingUp size={150} strokeWidth={1} />
            </div>

            <div className="relative z-10">

              {/* Eyebrow */}

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF476B]/20 bg-[#E60033]/10 px-2.5 py-1">

                <Sparkles
                  size={11}
                  className="text-[#FF476B]"
                />

                <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#FF9AAD]">
                  Employee investment
                </span>

              </div>

              {/* Title */}

              <h2 className="mt-3 max-w-lg text-[22px] font-black leading-tight tracking-tight text-white sm:text-[26px] lg:text-[30px]">
                Build your financial future.
              </h2>

              {/* Description */}

              <p className="mt-2 max-w-lg text-[11px] leading-[19px] text-white/55 sm:text-xs sm:leading-5">
                Explore investment opportunities created
                for company team members. Choose a plan
                that aligns with your goals.
              </p>

              {/* Availability */}

              <div className="mt-5 flex flex-wrap items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#FF476B]">
                  <Layers3 size={15} />
                </div>

                <span className="text-[11px] font-semibold text-white/65">

                  {loading
                    ? "Checking available plans..."
                    : error
                      ? "Plans temporarily unavailable"
                      : `${plans.length} published ${
                          plans.length === 1
                            ? "plan"
                            : "plans"
                        } available`}

                </span>

              </div>

            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* PLANS SECTION HEADER                                             */}
        {/* ================================================================ */}

        <section className="mt-7 sm:mt-8">

          <div className="flex items-end justify-between gap-3">

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <span className="h-4 w-1 rounded-full bg-[#E60033]" />

                <h2 className="text-[15px] font-black tracking-tight text-white sm:text-[17px]">
                  Available Plans
                </h2>

              </div>

              <p className="mt-1 pl-3 text-[10px] leading-4 text-white/40 sm:text-[11px]">
                Select a plan to explore its details.
              </p>

            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh investment plans"
              title="Refresh investment plans"
              className="
                flex h-9 w-9 shrink-0 items-center
                justify-center rounded-xl
                border border-white/10
                bg-[#0B1426]
                text-white/55
                transition
                hover:border-[#E60033]/30
                hover:text-[#FF476B]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {loading ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={15} />
              )}
            </button>

          </div>

          {/* ============================================================ */}
          {/* LOADING                                                      */}
          {/* ============================================================ */}

          {loading && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-[22px] border border-white/8 bg-[#0B1426] p-4"
                  >

                    <div className="flex items-center justify-between">

                      <div className="h-10 w-10 rounded-xl bg-white/8" />

                      <div className="h-5 w-16 rounded-full bg-white/8" />

                    </div>

                    <div className="mt-5 h-4 w-3/4 rounded bg-white/10" />

                    <div className="mt-3 h-3 w-full rounded bg-white/5" />

                    <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />

                    <div className="mt-6 h-10 rounded-xl bg-white/8" />

                  </div>
                ),
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* ERROR                                                        */}
          {/* ============================================================ */}

          {!loading && error && (
            <div
              role="alert"
              className="mt-4 rounded-[22px] border border-[#E60033]/20 bg-[#E60033]/8 p-5"
            >

              <p className="text-xs font-semibold text-[#FF9AAD]">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#E60033] px-4 py-2.5 text-[11px] font-extrabold text-white transition hover:bg-[#FF174B] active:scale-95"
              >
                <RefreshCw size={13} />

                Try again
              </button>

            </div>
          )}

          {/* ============================================================ */}
          {/* PUBLISHED INVESTMENT PLANS                                   */}
          {/* ============================================================ */}

          {!loading && !error && plans.length > 0 && (

            <div
              className="
                mt-4 grid grid-cols-1
                items-stretch
                gap-3
                sm:gap-4
                md:grid-cols-2
                lg:grid-cols-4
              "
            >

              {plans.map((plan) => (

                <div
                  key={plan.id}
                  className="group min-w-0"
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

          )}

          {/* ============================================================ */}
          {/* EMPTY STATE                                                  */}
          {/* ============================================================ */}

          {!loading && !error && plans.length === 0 && (

            <div className="mt-4 rounded-[22px] border border-dashed border-white/10 bg-[#0B1426] px-5 py-10 text-center sm:px-6 sm:py-12">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                <Sparkles size={24} />
              </div>

              <h3 className="mt-4 text-sm font-black text-white">
                No investment plans available
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-white/45">
                There are currently no published
                investment plans available for team
                members. Please check again later.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/investment")
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E60033] px-4 py-3 text-[11px] font-extrabold text-white transition hover:bg-[#FF174B] active:scale-95"
              >
                Back to investments

                <ChevronRight size={15} />
              </button>

            </div>

          )}

        </section>

        {/* ================================================================ */}
        {/* BOTTOM INFORMATION                                               */}
        {/* ================================================================ */}

        {!loading && !error && plans.length > 0 && (

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/6 bg-[#0B1426]/60 px-3 py-3 sm:px-4">

            <p className="text-[10px] text-white/40">
              Showing all {plans.length} published{" "}
              {plans.length === 1 ? "plan" : "plans"}
            </p>

            <div className="flex items-center gap-1 text-[10px] font-bold text-[#FF476B]">
              Explore your options

              <ArrowUpRight size={13} />
            </div>

          </div>

        )}

      </div>
    </main>
  );
}