import Link from 'next/link';
import {
  ArrowRight,
  Gift,
  Sparkles,
  Users,
} from 'lucide-react';

export default function LandingReferralCTA() {
  return (
    <section className="relative overflow-hidden bg-[#07101F] px-4 py-14 sm:px-6 sm:py-18 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F7C948]/8 blur-[100px] sm:h-96 sm:w-96 sm:blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-linear-to-br from-[#101D33] via-[#0B1729] to-[#07101F] px-5 py-8 shadow-2xl sm:rounded-[2.25rem] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#F7C948]/10 sm:-right-20 sm:-top-20 sm:h-64 sm:w-64" />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#F7C948]/8 sm:-right-10 sm:-top-10 sm:h-44 sm:w-44" />

          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F7C948]/15 bg-[#F7C948]/8 text-[#F7C948] sm:h-11 sm:w-11 sm:rounded-2xl">
                  <Gift size={18} />
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  <Sparkles size={11} />
                  Referral program
                </div>
              </div>

              <h2 className="mt-5 text-[1.85rem] font-black leading-[1.08] tracking-[-0.03em] text-white sm:mt-6 sm:text-4xl lg:text-5xl">
                Grow your network.
                <span className="block text-[#F7C948]">
                  Grow together.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/40 sm:mt-5 sm:text-base sm:leading-7">
                Once you have an account, invite eligible friends
                through the REDIQ referral program and track
                eligible rewards directly from your account.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/45 sm:px-3.5 sm:py-2">
                  <Users size={13} className="text-emerald-300" />
                  Invite friends
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/45 sm:px-3.5 sm:py-2">
                  <Gift size={13} className="text-[#F7C948]" />
                  Eligible rewards
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#F7C948] px-6 py-3 text-sm font-black text-[#050B18] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#FFD96A] sm:min-h-12 sm:w-fit sm:px-7 sm:py-3.5"
            >
              Join REDIQ
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
