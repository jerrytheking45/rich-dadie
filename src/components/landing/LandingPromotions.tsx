
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
      <div className="absolute left-[-10%] top-20 h-80 w-80 rounded-full bg-[#F7C948]/5 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-0 h-96 w-96 rounded-full bg-emerald-400/5 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F7C948]/10 bg-[#F7C948]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#F7C948]/80">
              <Sparkles size={12} />
              Latest opportunities
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              Discover what is
              <span className="block text-white/35">
                happening on REDIQ.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
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
        <div className="mt-10 rounded-4x1 border border-white/8 bg-white/2.5 p-3 sm:p-4">
          <PromotionCarousel
            title=""
            description=""
            limit={6}
          />
        </div>

        {/* Bottom information */}
        <div className="mt-7 flex flex-col gap-4 rounded-3xl border border-white/7 bg-white/2.5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7C948]/8 text-[#F7C948]">
              <Megaphone size={15} />
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


