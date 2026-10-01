import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function LandingFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#07101F] px-4 py-14 sm:px-6 sm:py-18 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-[110px] sm:h-125 sm:w-125 sm:blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-linear-to-br from-[#101D33] via-[#0B1729] to-[#07101F] px-5 py-9 text-center shadow-2xl sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/2.5 sm:h-105 sm:w-105" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F7C948]/5 sm:h-75 sm:w-75" />

          <div className="relative">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#F7C948]/10 bg-[#F7C948]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#F7C948]/80 sm:px-3.5 sm:py-2">
              <Sparkles size={12} />
              Start your journey
            </div>

            <h2 className="mx-auto mt-5 max-w-3xl text-[1.85rem] font-black leading-[1.08] tracking-[-0.035em] text-white sm:mt-6 sm:text-4xl lg:text-5xl">
              Your next financial chapter
              <span className="block text-[#F7C948]">
                starts here.
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40 sm:mt-5 sm:text-base sm:leading-7">
              Create your REDIQ account and explore the
              investment opportunities currently available on the
              platform.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
              <Link
                href="/register"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#F7C948] px-6 py-3 text-sm font-black text-[#050B18] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#FFD96A] sm:min-h-12 sm:px-7 sm:py-3.5"
              >
                Create account
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white sm:min-h-12 sm:px-7 sm:py-3.5"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:mt-8 sm:gap-x-5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/30">
                <CheckCircle2 size={12} className="text-emerald-300" />
                Create your account
              </span>

              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/30">
                <CheckCircle2 size={12} className="text-emerald-300" />
                Explore plans
              </span>

              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/30">
                <CheckCircle2 size={12} className="text-emerald-300" />
                Track your portfolio
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
