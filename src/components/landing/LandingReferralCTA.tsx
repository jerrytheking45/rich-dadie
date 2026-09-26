
import Link from 'next/link';
import {
  ArrowRight,
  Gift,
  Sparkles,
  Users,
} from 'lucide-react';

export default function LandingReferralCTA() {
  return (
    <section className="relative overflow-hidden bg-[#07101F] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F7C948]/8 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-linear-to-br from-[#101D33] via-[#0B1729] to-[#07101F] px-6 py-12 shadow-2xl sm:px-10 sm:py-14 lg:px-14">
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#F7C948]/10" />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#F7C948]/8" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#F7C948]/15 bg-[#F7C948]/8 text-[#F7C948]">
                  <Gift size={19} />
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  <Sparkles size={11} />
                  Referral program
                </div>
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                Grow your network.
                <span className="block text-[#F7C948]">
                  Grow together.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                Once you have an account, invite eligible friends
                through the Rich-Dadie referral program and track
                eligible rewards directly from your account.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3.5 py-2 text-[10px] font-semibold text-white/45">
                  <Users size={13} className="text-emerald-300" />
                  Invite friends
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3.5 py-2 text-[10px] font-semibold text-white/45">
                  <Gift size={13} className="text-[#F7C948]" />
                  Eligible rewards
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F7C948] px-7 py-3.5 text-sm font-black text-[#050B18] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#FFD96A] sm:w-fit"
            >
              Join Rich-Dadie

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
