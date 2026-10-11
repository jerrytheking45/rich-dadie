
"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import LandingFAQ from "@/src/components/landing/LandingFAQ";
import LandingAppDownload from "@/src/components/landing/LandingAppDownload";
import LandingFinalCTA from "@/src/components/landing/LandingFinalCTA";
import LandingFooter from "@/src/components/landing/LandingFooter";
import LandingHeader from "@/src/components/landing/LandingHeader";
import LandingHero from "@/src/components/landing/LandingHero";
import LandingHowItWorks from "@/src/components/landing/LandingHowItWorks";
import LandingPlans from "@/src/components/landing/LandingPlans";
import LandingPromotions from "@/src/components/landing/LandingPromotions";
import LandingReferralCTA from "@/src/components/landing/LandingReferralCTA";
import LandingWhyUs from "@/src/components/landing/LandingWhyUs";

import LiveCryptoMarket from "@/src/components/market/LiveCryptoMarket";

import { investmentApi } from "@/src/lib/api/investmentApi";

import type {
  InvestmentPlan,
} from "@/src/lib/types/investment";

/* ==========================================
   PUBLIC LANDING PAGE
========================================== */

export default function HomePage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);

  /* ==========================================
     LOAD INVESTMENT PLANS
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadPlans = async () => {
      try {
        const data = await investmentApi.getPlans();

        if (mounted) {
          setPlans(data);
        }
      } catch (error) {
        console.error(
          "Failed to load landing page plans:",
          error
        );

        if (mounted) {
          setPlans([]);
        }
      }
    };

    void loadPlans();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================
     FEATURED PLANS
  ========================================== */

  const featuredPlans = plans
    .filter(
      (plan) =>
        plan.status === "PUBLISHED" &&
        plan.featured
    )
    .slice(0, 4);

  const displayPlans =
    featuredPlans.length > 0
      ? featuredPlans
      : plans
          .filter(
            (plan) => plan.status === "PUBLISHED"
          )
          .slice(0, 4);

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">

      {/* =====================================
          HEADER
      ====================================== */}

      <LandingHeader />

      {/* =====================================
          HERO
      ====================================== */}

      <LandingHero plansCount={plans.length} />

      {/* =====================================
          LIVE CRYPTO MARKET
      ====================================== */}

      <section
        id="live-market"
        aria-labelledby="landing-market-heading"
        className="relative isolate overflow-hidden bg-[#050B18] py-12 text-white sm:py-16 lg:py-20"
      >
        {/* Background lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#E60033]/10 blur-[100px]" />

          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#E60033]/8 blur-[100px]" />

          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#E60033]/45 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* SECTION HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">

            <div className="min-w-0">

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/25 bg-[#E60033]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                <Activity
                  size={12}
                  aria-hidden="true"
                />

                Explore global markets
              </div>

              {/* Heading */}
              <h2
                id="landing-market-heading"
                className="mt-4 text-[26px] font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-[36px]"
              >
                Discover the
                <span className="text-[#FF476B]">
                  {" "}Crypto Market.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-xl text-xs leading-6 text-white/55 sm:text-sm">
                Follow cryptocurrency market prices,
                discover digital assets and explore
                market movements from one convenient
                dashboard.
              </p>
            </div>

            {/* Header feature */}
            <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 sm:self-end">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                <TrendingUp
                  size={16}
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[11px] font-bold text-white">
                  Global market data
                </p>

                <p className="mt-0.5 text-[9px] text-white/40">
                  Regularly refreshed prices
                </p>
              </div>

              <ArrowUpRight
                size={14}
                className="ml-1 text-[#FF476B]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* LIVE MARKET COMPONENT */}
          <LiveCryptoMarket />

          {/* MARKET DISCLAIMER */}
          <p className="mx-auto mt-4 max-w-2xl text-center text-[10px] leading-5 text-white/35">
            Cryptocurrency prices are provided for
            informational purposes and may change rapidly.
            Market information does not constitute
            investment advice.
          </p>
        </div>
      </section>

      {/* =====================================
          PROMOTIONS
      ====================================== */}

      <LandingPromotions />

      {/* =====================================
          INVESTMENT PLANS
      ====================================== */}

      <LandingPlans plans={displayPlans} />

      {/* =====================================
          HOW IT WORKS
      ====================================== */}

      <LandingHowItWorks />

      {/* =====================================
          APP DOWNLOAD
      ====================================== */}

      <LandingAppDownload />

      {/* =====================================
          WHY REDIQ
      ====================================== */}

      <LandingWhyUs />

      {/* =====================================
          REFERRAL PROGRAM
      ====================================== */}

      <LandingReferralCTA />

      {/* =====================================
          FAQ
      ====================================== */}

      <LandingFAQ />

      {/* =====================================
          FINAL CALL TO ACTION
      ====================================== */}

      <LandingFinalCTA />

      {/* =====================================
          FOOTER
      ====================================== */}

      <LandingFooter />
    </main>
  );
}