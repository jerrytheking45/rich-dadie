
import Link from 'next/link';
import Image from 'next/image';

import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

import type { InvestmentPlan } from '@/src/lib/types/investment';

interface LandingPlansProps {
  plans: InvestmentPlan[];
}

function formatUSDT(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function LandingPlans({
  plans,
}: LandingPlansProps) {
  return (
    <section
      id="plans"
      className="relative scroll-mt-20 overflow-hidden bg-[#050B18]"
    >
      {/* Background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full bg-[#E60033]/5 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-44 w-44 rounded-full bg-emerald-400/5 blur-[80px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11">

        {/* SECTION HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
              <TrendingUp size={12} />
              Investment opportunities
            </div>

            {/* Heading */}
            <h2 className="mt-3 text-[22px] font-black leading-[1.15] tracking-tight text-white sm:text-[27px] lg:text-[30px]">
              Choose an opportunity
              <span className="block text-[#FF476B]">
                that fits your journey.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-2 max-w-xl text-[11px] leading-[1.7] text-white/50 sm:text-xs sm:leading-5 lg:text-[13px]">
              Explore published REDIQ investment plans.
              Compare minimum amounts, durations and expected
              returns before making your decision.
            </p>
          </div>

          {/* Header action */}
          <Link
            href="/register"
            className="group inline-flex min-h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-[#E60033]/25 bg-[#E60033]/10 px-4 py-2.5 text-[11px] font-bold text-[#FF476B] transition hover:border-[#E60033]/40 hover:bg-[#E60033]/15 hover:text-white"
          >
            Create an account

            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* INVESTMENT PLANS */}
        {plans.length > 0 ? (
          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

            {plans.map((plan) => (
              <article
                key={plan.id}
                className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#E60033]/30 hover:shadow-[#E60033]/5"
              >

                {/* PLAN IMAGE */}
                <div className="relative h-32 overflow-hidden bg-[#101D30] sm:h-36 lg:h-32 xl:h-36">

                  {plan.image ? (
                    <Image
                      src={plan.image}
                      alt={plan.name}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#15253D] via-[#101D30] to-[#07101F]">

                      <div className="absolute h-28 w-28 rounded-full bg-[#E60033]/10 blur-3xl" />

                      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                        <CircleDollarSign size={22} />
                      </div>
                    </div>
                  )}

                  {/* Image gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0B1426] via-black/10 to-transparent" />

                  {/* Featured badge */}
                  {plan.featured && (
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#E60033] px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white shadow-lg">
                      Featured
                    </span>
                  )}

                  {/* Bottom image label */}
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[9px] font-semibold text-white/75">
                      Investment opportunity
                    </span>
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">

                  {/* Plan title */}
                  <div className="flex items-start justify-between gap-2">

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-[13px] font-black leading-5 tracking-tight text-white sm:text-sm">
                        {plan.name}
                      </h3>

                      <p className="mt-0.5 text-[9px] font-medium uppercase racking-widest text-white/30">
                        REDIQ investment plan
                      </p>
                    </div>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                      <TrendingUp size={13} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 min-h-9 text-[11px] leading-[1.65] text-white/45">
                    {plan.description}
                  </p>

                  {/* MAIN METRICS */}
                  <div className="mt-3 grid grid-cols-2 gap-2">

                    {/* Minimum */}
                    <div className="min-w-0 rounded-xl border border-white/7 bg-white/[0.035] p-2.5">

                      <div className="flex items-center gap-1.5 text-white/40">
                        <CircleDollarSign size={12} />

                        <p className="text-[9px] font-bold uppercase tracking-wide">
                          Minimum
                        </p>
                      </div>

                      <p className="mt-1.5 wrap-break-word text-[13px] font-black leading-4 text-white">
                        {formatUSDT(plan.minimumAmount)}
                      </p>

                      <p className="mt-0.5 text-[9px] font-medium text-white/35">
                        USDT
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="min-w-0 rounded-xl border border-white/7 bg-white/[0.035] p-2.5">

                      <div className="flex items-center gap-1.5 text-white/40">
                        <CalendarDays size={12} />

                        <p className="text-[9px] font-bold uppercase tracking-wide">
                          Duration
                        </p>
                      </div>

                      <p className="mt-1.5 text-[13px] font-black leading-4 text-white">
                        {plan.durationDays}
                      </p>

                      <p className="mt-0.5 text-[9px] font-medium text-white/35">
                        Days
                      </p>
                    </div>
                  </div>

                  {/* EXPECTED RETURN */}
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-3 py-2.5">

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.07em] text-emerald-300/70">
                        Expected return rate
                      </p>

                      <p className="mt-1 text-lg font-black leading-none tracking-tight text-emerald-300">
                        {plan.expectedReturnRate}%
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                      <TrendingUp size={15} />
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/register"
                    className="group/button mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#E60033] px-4 py-2.5 text-[11px] font-black text-white shadow-lg shadow-[#E60033]/10 transition-all duration-300 hover:bg-[#FF174B] hover:shadow-[#E60033]/20"
                  >
                    Get started

                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover/button:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (

          /* EMPTY STATE */
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[#0B1426] px-4 py-7 text-center sm:mt-6 sm:py-9">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#E60033]/15 bg-[#E60033]/10 text-[#FF476B]">
              <CircleDollarSign size={20} />
            </div>

            <h3 className="mt-3 text-[13px] font-black text-white">
              Investment plans are coming soon
            </h3>

            <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-5 text-white/45">
              Published REDIQ investment opportunities will
              appear here when available.
            </p>
          </div>
        )}

        {/* INVESTMENT NOTICE */}
        <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex max-w-3xl items-start gap-2">

            <ShieldCheck
              size={14}
              className="mt-0.5 shrink-0 text-[#FF476B]"
            />

            <p className="text-[10px] leading-[1.65] text-white/45">
              Review each plan&apos;s minimum amount,
              duration, fees and withdrawal conditions before investing.
            </p>
          </div>

          <a
            href="#faq"
            className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold text-[#FF476B] transition hover:text-[#FF7895]"
          >
            Have questions? View FAQ

            <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}