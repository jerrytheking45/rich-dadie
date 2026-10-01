import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  TrendingUp,
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
      className="relative overflow-hidden bg-[#050B18]"
    >
      {/* Background accents */}
      <div className="absolute left-[-15%] top-1/3 h-72 w-72 rounded-full bg-emerald-400/5 blur-[110px] sm:h-96 sm:w-96 sm:blur-[130px]" />
      <div className="absolute bottom-0 right-[-10%] h-72 w-72 rounded-full bg-[#F7C948]/5 blur-[110px] sm:h-96 sm:w-96 sm:blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 sm:gap-7 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F7C948]/10 bg-[#F7C948]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#F7C948]/80">
              <TrendingUp size={12} />
              Investment opportunities
            </div>

            <h2 className="mt-4 text-[1.85rem] font-black tracking-[-0.035em] text-white sm:mt-5 sm:text-4xl lg:text-5xl">
              Choose an opportunity
              <span className="block text-white/35">
                that fits your journey.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/40 sm:mt-5 sm:text-base sm:leading-7">
              Browse the investment plans currently published on
              REDIQ. Review the available details before deciding
              which opportunity works for you.
            </p>
          </div>

          <Link
            href="/register"
            className="group inline-flex min-h-10 w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/70 transition hover:border-[#F7C948]/20 hover:bg-white/8 hover:text-white sm:min-h-11 sm:px-5 sm:py-3"
          >
            Create an account

            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Plans */}
        {plans.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#0A1424] shadow-2xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-white/15 sm:rounded-[1.75rem]"
              >
                {/* Image */}
                {plan.image ? (
                  <div className="relative h-40 overflow-hidden sm:h-48">
                    <Image
                      src={plan.image}
                      alt={plan.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#0A1424] via-black/20 to-transparent" />

                    {plan.featured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[#F7C948]/20 bg-[#F7C948]/90 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-widest text-[#050B18] shadow-lg sm:left-4 sm:top-4 sm:px-3 sm:text-[9px]">
                        Featured
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br from-[#101D33] to-[#07101F] sm:h-48">
                    <div className="absolute h-28 w-28 rounded-full bg-emerald-400/5 blur-3xl sm:h-32 sm:w-32" />

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white/20 sm:h-14 sm:w-14">
                      <CircleDollarSign size={24} />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black tracking-tight text-white sm:text-lg">
                        {plan.name}
                      </h3>

                      <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.12em] text-white/25 sm:text-[10px]">
                        Investment plan
                      </p>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/8 text-emerald-300">
                      <TrendingUp size={14} />
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 min-h-16 text-xs leading-5 text-white/35 sm:mt-4 sm:min-h-18 sm:leading-6">
                    {plan.description}
                  </p>

                  {/* Main metrics */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
                    <div className="rounded-xl border border-white/6 bg-white/2.5 p-2.5 sm:rounded-2xl sm:p-3">
                      <div className="flex items-center gap-1.5 text-white/25">
                        <CircleDollarSign size={11} />

                        <p className="text-[8px] font-bold uppercase tracking-[0.08em] sm:text-[9px]">
                          Minimum
                        </p>
                      </div>

                      <p className="mt-1.5 text-sm font-black text-white">
                        {formatUSDT(plan.minimumAmount)}
                      </p>

                      <p className="mt-0.5 text-[9px] font-semibold text-white/25">
                        USDT
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/6 bg-white/2.5 p-2.5 sm:rounded-2xl sm:p-3">
                      <div className="flex items-center gap-1.5 text-white/25">
                        <CalendarDays size={11} />

                        <p className="text-[8px] font-bold uppercase tracking-[0.08em] sm:text-[9px]">
                          Duration
                        </p>
                      </div>

                      <p className="mt-1.5 text-sm font-black text-white">
                        {plan.durationDays}
                      </p>

                      <p className="mt-0.5 text-[9px] font-semibold text-white/25">
                        days
                      </p>
                    </div>
                  </div>

                  {/* Return */}
                  <div className="mt-2 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-3 sm:rounded-2xl sm:p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-300/60 sm:text-[9px]">
                          Expected return rate
                        </p>

                        <p className="mt-1 text-lg font-black text-emerald-300 sm:text-xl">
                          {plan.expectedReturnRate}%
                        </p>
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/8 text-emerald-300 sm:h-9 sm:w-9">
                        <TrendingUp size={14} />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/register"
                    className="group/button mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-black text-[#050B18] transition hover:bg-[#F7C948] sm:mt-5 sm:min-h-11 sm:py-3"
                  >
                    Get started

                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover/button:translate-x-0.5"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-white/10 bg-white/2.5 px-5 py-10 text-center sm:mt-12 sm:rounded-4xl sm:px-6 sm:py-14">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white/25 sm:h-14 sm:w-14">
              <CircleDollarSign size={23} />
            </div>

            <h3 className="mt-4 text-sm font-black text-white sm:mt-5">
              Investment plans are coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/30">
              Published investment opportunities will appear here
              when they become available.
            </p>
          </div>
        )}

        {/* Disclaimer-style information row */}
        <div className="mt-6 flex flex-col gap-3.5 border-t border-white/7 pt-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p className="max-w-2xl text-[10px] leading-5 text-white/25">
            Review each investment plan carefully, including its
            minimum amount, duration, and expected return rate,
            before making an investment decision.
          </p>

          <a
            href="#faq"
            className="shrink-0 text-[10px] font-bold text-white/40 transition hover:text-[#F7C948]"
          >
            Have questions? View FAQ →
          </a>
        </div>
      </div>
    </section>
  );
}
