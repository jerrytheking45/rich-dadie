
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Gift,
  Sparkles,
  Users,
  UserPlus,
  CheckCircle2,
} from 'lucide-react';

export default function LandingReferralCTA() {
  return (
    <section className="relative overflow-hidden bg-[#07101F] px-3 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

      <div className="relative mx-auto max-w-7xl">

        {/* MAIN REFERRAL CONTAINER */}
        <div className="relative isolate overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1426] shadow-xl shadow-black/20 sm:rounded-3xl">

          {/* CINEMATIC BACKGROUND */}
          <Image
            src="/images/hero.png"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none -z-20 object-cover object-center opacity-30"
          />

          {/* Dark overlay */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-[#07101F]/95 via-[#07101F]/90 to-[#07101F]/65" />

          {/* Red ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#E60033]/15 blur-[70px]"
          />

          {/* Decorative circular accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border border-[#E60033]/15 sm:h-52 sm:w-52"
          />

          {/* CONTENT */}
          <div className="relative grid items-center gap-5 px-4 py-5 sm:px-6 sm:py-6 md:grid-cols-[1.1fr_0.9fr] md:gap-7 lg:px-9 lg:py-7">

            {/* LEFT SIDE */}
            <div className="relative z-10 min-w-0">

              {/* Header badges */}
              <div className="flex flex-wrap items-center gap-2">

                {/* Original REDIQ logo */}
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[#E60033] shadow-lg shadow-[#E60033]/20">
                  <Image
                    src="/images/logo.png"
                    alt="REDIQ logo"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>

                {/* Referral badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/25 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                  <Sparkles size={11} />
                  Referral program
                </div>
              </div>

              {/* MAIN HEADING */}
              <h2 className="mt-3 text-[22px] font-black leading-[1.15] tracking-tight text-white sm:text-[26px] lg:text-[30px]">
                Grow your network.
                <span className="block text-[#FF476B]">
                  Grow together.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-2 max-w-lg text-[11px] leading-[1.7] text-white/55 sm:text-xs sm:leading-5 lg:text-[13px]">
                Invite eligible friends through the REDIQ referral
                program and track your eligible rewards directly
                from your account.
              </p>

              {/* Features */}
              <div className="mt-3 flex flex-wrap gap-2">

                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-semibold text-white/60">
                  <Users
                    size={12}
                    className="text-[#FF476B]"
                  />
                  Invite friends
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-semibold text-white/60">
                  <Gift
                    size={12}
                    className="text-[#FF476B]"
                  />
                  Eligible rewards
                </div>
              </div>

              {/* CTA BUTTON */}
              <div className="mt-4">
                <Link
                  href="/register"
                  className="group inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#E60033] px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF174B] sm:w-auto"
                >
                  Join REDIQ

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE — REFERRAL VISUAL */}
            <div className="relative mx-auto w-full max-w-85 md:ml-auto">

              {/* Outer glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-5 rounded-full bg-[#E60033]/10 blur-[55px]"
              />

              {/* MAIN VISUAL CARD */}
              <div className="relative overflow-hidden rounded-[18px] border border-white/12 bg-[#101D30]/90 p-3.5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-4">

                {/* Card header */}
                <div className="flex items-center justify-between gap-2">

                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/15 text-[#FF476B]">
                      <Gift size={16} />
                    </div>

                    <div>
                      <p className="text-[11px] font-black text-white">
                        REDIQ Referrals
                      </p>

                      <p className="mt-0.5 text-[9px] text-white/40">
                        Connect and grow
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2 py-1 text-[8px] font-bold text-[#FF476B]">
                    Rewards
                  </span>
                </div>

                {/* VISUAL GRAPHIC */}
                <div className="relative mt-3 flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/7 bg-[#071322] px-3 py-4">

                  {/* Inviter */}
                  <div className="flex flex-col items-center gap-1.5">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E60033]/25 bg-[#E60033]/15 text-[#FF476B]">
                      <Users size={19} />
                    </div>

                    <span className="text-[9px] font-semibold text-white/60">
                      You
                    </span>
                  </div>

                  {/* Connection */}
                  <div className="flex min-w-0 flex-1 items-center gap-1">

                    <div className="h-px flex-1 bg-linear-to-r from-[#E60033]/50 to-[#E60033]/15" />

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                      <UserPlus size={13} />
                    </div>

                    <div className="h-px flex-1 bg-linear-to-r from-[#E60033]/15 to-[#E60033]/50" />
                  </div>

                  {/* Invited users */}
                  <div className="flex flex-col items-center gap-1.5">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E60033]/25 bg-[#E60033]/15 text-[#FF476B]">
                      <Users size={19} />
                    </div>

                    <span className="text-[9px] font-semibold text-white/60">
                      Friends
                    </span>
                  </div>

                  {/* Background glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E60033]/5 blur-2xl"
                  />
                </div>

                {/* REWARD DETAILS */}
                <div className="mt-3 grid grid-cols-2 gap-2">

                  <div className="rounded-xl border border-white/7 bg-white/[0.035] p-2.5">

                    <div className="flex items-center gap-1.5 text-[#FF476B]">
                      <UserPlus size={12} />

                      <span className="text-[10px] font-bold text-white">
                        Invite
                      </span>
                    </div>

                    <p className="mt-1 text-[9px] leading-4 text-white/40">
                      Share with eligible friends
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/7 bg-white/[0.035] p-2.5">

                    <div className="flex items-center gap-1.5 text-[#FF476B]">
                      <Gift size={12} />

                      <span className="text-[10px] font-bold text-white">
                        Rewards
                      </span>
                    </div>

                    <p className="mt-1 text-[9px] leading-4 text-white/40">
                      Track eligible rewards
                    </p>
                  </div>
                </div>

                {/* Bottom status */}
                <div className="mt-3 flex items-center gap-1.5 border-t border-white/7 pt-2.5">

                  <CheckCircle2
                    size={12}
                    className="text-[#FF476B]"
                  />

                  <p className="text-[9px] text-white/40">
                    Referral eligibility and terms apply.
                  </p>
                </div>
              </div>

              {/* Floating gift symbol */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-xl border border-[#E60033]/25 bg-[#151D30] text-[#FF476B] shadow-xl sm:-right-3"
              >
                <Gift size={17} />
              </div>
            </div>
          </div>

          {/* REDIQ ACCENT LINE */}
          <div className="h-px bg-linear-to-r from-transparent via-[#E60033]/45 to-transparent" />
        </div>
      </div>
    </section>
  );
}