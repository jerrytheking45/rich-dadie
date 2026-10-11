
import {
  ArrowRight,
  Megaphone,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import PromotionCarousel from '@/src/components/promotions/PromotionCarousel';

export default function LandingPromotions() {
  return (
    <section
      id="promotions"
      className="relative scroll-mt-20 overflow-hidden bg-[#050B18]"
    >
      {/* Subtle background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-8 h-40 w-40 rounded-full bg-[#E60033]/8 blur-[75px] sm:h-56 sm:w-56"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-emerald-400/5 blur-[80px] sm:h-56 sm:w-56"
      />

      {/* MAIN CONTAINER */}
      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11">

        {/* SECTION HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-5">

          {/* Left heading */}
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
              <Sparkles size={12} />
              Latest opportunities
            </div>

            {/* Heading */}
            <h2 className="mt-3 text-[22px] font-black leading-[1.15] tracking-tight text-white sm:text-[27px] lg:text-[30px]">
              Discover what&apos;s
              <span className="block text-[#FF476B]">
                happening on REDIQ.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-2 max-w-xl text-[11px] leading-[1.7] text-white/50 sm:text-xs sm:leading-5 lg:text-[13px]">
              Explore the latest promotions, announcements,
              offers and published investment opportunities
              available on REDIQ.
            </p>
          </div>

          {/* Desktop platform updates indicator */}
          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#E60033]/15 bg-[#E60033]/5 px-3 py-2 sm:inline-flex">

            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E60033]/10 text-[#FF476B]">
              <Megaphone size={12} />
            </div>

            <span className="text-[10px] font-bold text-white/55">
              Platform updates
            </span>
          </div>
        </div>

        {/* DYNAMIC PROMOTIONS CAROUSEL */}
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] p-2 sm:mt-6 sm:p-3">

          {/* Top accent */}
          <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-linear-to-r from-transparent via-[#E60033]/40 to-transparent" />

          <PromotionCarousel
            title=""
            description=""
            limit={6}
          />
        </div>

        {/* COMPACT INFORMATION STRIP */}
        <div className="mt-3 flex flex-col gap-3 rounded-xl border border-white/8 bg-[#0B1426] px-3.5 py-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:px-4">

          {/* Information */}
          <div className="flex min-w-0 items-center gap-2.5">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E60033]/15 bg-[#E60033]/10 text-[#FF476B]">
              <Megaphone size={15} />
            </div>

            <div className="min-w-0">

              <p className="text-[11px] font-bold text-white sm:text-xs">
                Stay up to date
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-white/40">
                Discover new announcements and investment updates.
              </p>
            </div>
          </div>

          {/* Explore action */}
          <a
            href="#plans"
            className="group inline-flex min-h-8 shrink-0 items-center gap-1.5 self-start rounded-full border border-[#E60033]/20 bg-[#E60033]/5 px-3 py-1.5 text-[10px] font-bold text-[#FF476B] transition hover:border-[#E60033]/40 hover:bg-[#E60033]/10 hover:text-white sm:self-auto"
          >
            <TrendingUp size={12} />

            Explore plans

            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}