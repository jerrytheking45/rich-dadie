
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
      <div className="absolute left-[-15%] top-1/3 h-96 w-96 rounded-full bg-emerald-400/5 blur-[130px]" />
      <div className="absolute right-[-10%] bottom-0 h-96 w-96 rounded-full bg-[#F7C948]/5 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F7C948]/10 bg-[#F7C948]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#F7C948]/80">
              <TrendingUp size={12} />
              Investment opportunities
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              Choose an opportunity
              <span className="block text-white/35">
                that fits your journey.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
              Browse the investment plans currently published on
              REDIQ. Review the available details before
              deciding which opportunity works for you.
            </p>
          </div>

          <Link
            href="/register"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold text-white/70 transition hover:border-[#F7C948]/20 hover:bg-white/8 hover:text-white"
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
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-[#0A1424] shadow-2xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-white/15"
              >
                {/* Image */}
                {plan.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={plan.image}
                      alt={plan.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#0A1424] via-black/20 to-transparent" />

                    {plan.featured && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#F7C948]/20 bg-[#F7C948]/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#050B18] shadow-lg">
                        Featured
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative flex h-48 items-center justify-center overflow-hidden bg-linear-to-br from-[#101D33] to-[#07101F]">
                    <div className="absolute h-32 w-32 rounded-full bg-emerald-400/5 blur-3xl" />

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white/20">
                      <CircleDollarSign size={27} />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black tracking-tight text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">
                        Investment plan
                      </p>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/8 text-emerald-300">
                      <TrendingUp size={14} />
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 min-h-18 text-xs leading-6 text-white/35">
                    {plan.description}
                  </p>

                  {/* Main metrics */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-white/6 bg-white/2.5 p-3">
                      <div className="flex items-center gap-1.5 text-white/25">
                        <CircleDollarSign size={11} />

                        <p className="text-[9px] font-bold uppercase tracking-[0.08em]">
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

                    <div className="rounded-2xl border border-white/6 bg-white/2.5 p-3">
                      <div className="flex items-center gap-1.5 text-white/25">
                        <CalendarDays size={11} />

                        <p className="text-[9px] font-bold uppercase tracking-[0.08em]">
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
                  <div className="mt-2 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300/60">
                          Expected return rate
                        </p>

                        <p className="mt-1 text-xl font-black text-emerald-300">
                          {plan.expectedReturnRate}%
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/8 text-emerald-300">
                        <TrendingUp size={15} />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/register"
                    className="group/button mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-xs font-black text-[#050B18] transition hover:bg-[#F7C948]"
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
          <div className="mt-12 rounded-4xl border border-dashed border-white/10 bg-white/2.5 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white/25">
              <CircleDollarSign size={25} />
            </div>

            <h3 className="mt-5 text-sm font-black text-white">
              Investment plans are coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/30">
              Published investment opportunities will appear here
              when they become available.
            </p>
          </div>
        )}

        {/* Disclaimer-style information row */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/7 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[10px] leading-5 text-white/25">
            Review each investment plan carefully, including its
            minimum amount, duration, and expected return rate,
            before making an investment decision.
          </p>

          <a
            href="#faq"
            className="shrink-0 text-[10px] font-bold text-white/40 transition hover:text-[#F7C948]"
          >
            Have questions? View FAQ â†’
          </a>
        </div>
      </div>
    </section>
  );
}


