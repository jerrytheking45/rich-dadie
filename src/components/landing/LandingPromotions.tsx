import {
  ArrowRight,
  Megaphone,
  Sparkles,
} from 'lucide-react';

import PromotionCarousel from '@/src/components/promotions/PromotionCarousel';

export default function LandingPromotions() {
  return (
    <section className="relative overflow-hidden bg-[#050B18]">
      {/* Ambient lights */}
      <div className="absolute left-[-12%] top-16 h-64 w-64 rounded-full bg-[#F7C948]/5 blur-[100px] sm:left-[-10%] sm:top-20 sm:h-80 sm:w-80 sm:blur-[120px]" />
      <div className="absolute bottom-0 right-[-12%] h-72 w-72 rounded-full bg-emerald-400/5 blur-[110px] sm:right-[-10%] sm:h-96 sm:w-96 sm:blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F7C948]/10 bg-[#F7C948]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#F7C948]/80">
              <Sparkles size={12} />
              Latest opportunities
            </div>

            <h2 className="mt-4 text-[1.85rem] font-black tracking-[-0.035em] text-white sm:mt-5 sm:text-4xl lg:text-5xl">
              Discover what is
              <span className="block text-white/35">
                happening on REDIQ.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/40 sm:mt-5 sm:text-base sm:leading-7">
              Explore current promotions, offers, announcements,
              and new investment opportunities available on the
              platform.
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-2.5 text-[10px] font-bold text-white/35 sm:inline-flex">
            <Megaphone size={13} />
            Platform updates
          </div>
        </div>

        {/* Existing dynamic carousel */}
        <div className="mt-7 rounded-[2rem] border border-white/8 bg-white/2.5 p-2.5 sm:mt-10 sm:rounded-[2.25rem] sm:p-4">
          <PromotionCarousel
            title=""
            description=""
            limit={6}
          />
        </div>

        {/* Bottom information */}
        <div className="mt-5 flex flex-col gap-3.5 rounded-2xl border border-white/7 bg-white/2.5 px-4 py-3.5 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F7C948]/8 text-[#F7C948] sm:h-9 sm:w-9">
              <Megaphone size={14} />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                Stay up to date
              </p>

              <p className="mt-0.5 text-[10px] text-white/30">
                New announcements can appear here.
              </p>
            </div>
          </div>

          <a
            href="#plans"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/40 transition hover:text-[#F7C948]"
          >
            Explore plans
            <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
