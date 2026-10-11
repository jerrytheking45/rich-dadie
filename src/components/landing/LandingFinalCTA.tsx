
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Wallet,
  ChartNoAxesCombined,
  ArrowUpRight,
} from 'lucide-react';

export default function LandingFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#07101F] px-3 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11">

      <div className="relative mx-auto max-w-7xl">

        {/* MAIN CONTAINER */}
        <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-linear-to-br from-[#121E32] via-[#0B1729] to-[#07101F] shadow-xl shadow-black/20 sm:rounded-[24px]">

          {/* Decorative lighting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#E60033]/12 blur-[80px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-emerald-400/5 blur-[70px]"
          />

          {/* Subtle grid background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '35px 35px',
            }}
          />

          {/* CONTENT GRID */}
          <div className="relative grid items-center gap-6 px-4 py-6 sm:px-7 sm:py-8 md:grid-cols-[1.15fr_0.85fr] md:gap-7 lg:px-10 lg:py-9">

            {/* LEFT CONTENT */}
            <div className="relative z-10 min-w-0">

              {/* Brand identity */}
              <div className="flex flex-wrap items-center gap-2">

                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[#E60033] shadow-lg shadow-[#E60033]/20">
                  <Image
                    src="/images/logo.png"
                    alt="REDIQ logo"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                  <Sparkles size={11} />
                  Start your journey
                </div>
              </div>

              {/* Heading */}
              <h2 className="mt-3 max-w-xl text-[22px] font-black leading-[1.15] tracking-tight text-white sm:text-[26px] lg:text-[32px]">
                Your next financial chapter
                <span className="block text-[#FF476B]">
                  starts with REDIQ.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-2 max-w-lg text-[11px] leading-[1.7] text-white/50 sm:text-xs sm:leading-5 lg:text-[13px]">
                Create your REDIQ account, explore available
                investment opportunities and manage your
                investment journey from one modern platform.
              </p>

              {/* CTA BUTTONS */}
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">

                <Link
                  href="/register"
                  className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#E60033] px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF174B] hover:shadow-[#E60033]/30"
                >
                  Create account

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Sign in
                </Link>
              </div>

              {/* SMALL BENEFITS */}
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/8 pt-4">

                {[
                  'Create an account',
                  'Explore plans',
                  'Track investments',
                ].map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/40"
                  >
                    <CheckCircle2
                      size={12}
                      className="text-[#FF476B]"
                    />

                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT VISUAL AREA */}
            <div className="relative mx-auto flex w-full max-w-[350px] items-center justify-center sm:max-w-[390px] md:ml-auto">

              {/* Visual background glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-5 rounded-full bg-[#E60033]/10 blur-[55px]"
              />

              {/* Decorative circle */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-48 w-48 rounded-full border border-[#E60033]/10 sm:h-56 sm:w-56"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-36 w-36 rounded-full border border-white/5 sm:h-44 sm:w-44"
              />

              {/* MAIN FINANCIAL VISUAL */}
              <div className="relative w-full rounded-[20px] border border-white/10 bg-[#0C192B]/95 p-3.5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-4">

                {/* Card heading */}
                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/15 text-[#FF476B]">
                      <ChartNoAxesCombined size={16} />
                    </div>

                    <div>
                      <p className="text-[11px] font-black text-white">
                        REDIQ Investment
                      </p>

                      <p className="text-[9px] text-white/35">
                        Your journey, one platform
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2 py-1 text-[8px] font-bold text-[#FF476B]">
                    Explore
                  </span>
                </div>

                {/* Central graphic */}
                <div className="relative mt-3 overflow-hidden rounded-xl border border-white/6 bg-linear-to-br from-[#13243A] to-[#081322] px-3 py-3">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                        Investment opportunities
                      </p>

                      <p className="mt-1 text-sm font-black text-white">
                        Build your financial journey
                      </p>
                    </div>

                    <TrendingUp
                      size={18}
                      className="text-emerald-400"
                    />
                  </div>

                  {/* Decorative investment chart */}
                  <div className="relative mt-3 h-16 w-full">

                    <svg
                      viewBox="0 0 300 75"
                      preserveAspectRatio="none"
                      className="h-full w-full"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="rediqCtaChart"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#34D399"
                            stopOpacity="0.22"
                          />

                          <stop
                            offset="100%"
                            stopColor="#34D399"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <path
                        d="M0 62 L30 55 L55 59 L85 40 L110 47 L145 29 L170 35 L205 18 L230 26 L260 12 L300 5 L300 75 L0 75 Z"
                        fill="url(#rediqCtaChart)"
                      />

                      <path
                        d="M0 62 L30 55 L55 59 L85 40 L110 47 L145 29 L170 35 L205 18 L230 26 L260 12 L300 5"
                        fill="none"
                        stroke="#34D399"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>

                  <p className="mt-1 text-[8px] text-white/25">
                    Illustrative graphic · Not projected returns
                  </p>
                </div>

                {/* Bottom feature tiles */}
                <div className="mt-3 grid grid-cols-2 gap-2">

                  <div className="rounded-xl border border-white/7 bg-white/[0.035] p-2.5">

                    <div className="flex items-center gap-1.5 text-[#FF476B]">
                      <Wallet size={13} />

                      <span className="text-[9px] font-bold text-white/65">
                        Investments
                      </span>
                    </div>

                    <p className="mt-1.5 text-[9px] text-white/35">
                      Explore plans
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/7 bg-white/[0.035] p-2.5">

                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck size={13} />

                      <span className="text-[9px] font-bold text-white/65">
                        Your account
                      </span>
                    </div>

                    <p className="mt-1.5 text-[9px] text-white/35">
                      Track activity
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating decorative icon */}
              <div
                aria-hidden="true"
                className="absolute -right-2 -top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#151D30] text-[#FF476B] shadow-xl sm:-right-4"
              >
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>

          {/* BOTTOM ACCENT LINE */}
          <div className="h-px bg-linear-to-r from-transparent via-[#E60033]/40 to-transparent" />

        </div>
      </div>
    </section>
  );
}