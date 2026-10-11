
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface LandingHeroProps {
  plansCount: number;
}

export default function LandingHero({
  plansCount,
}: LandingHeroProps) {
  const availablePlans = Math.max(0, plansCount);

  return (
    <section className="relative isolate overflow-hidden bg-[#050B18]">

      {/* CINEMATIC BACKGROUND */}
      <Image
        src="/images/futuristic.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover object-center opacity-95"
      />

      {/* Dark overlays */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#050B18]/65" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-[#050B18] via-[#050B18]/90 to-[#050B18]/45" />

      {/* REDIQ ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 -z-10 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-0 -z-10 h-52 w-52 rounded-full bg-[#E60033]/10 blur-[90px]"
      />

      {/* MAIN HERO GRID */}
      <div className="relative mx-auto grid max-w-7xl items-center gap-7 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:py-12">

        {/* LEFT CONTENT */}
        <div className="min-w-0">

          {/* Intro badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/25 bg-[#E60033]/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
            <Sparkles size={12} />
            Investment made clearer
          </div>

          {/* Main headline */}
          <h1 className="mt-3 max-w-xl text-[30px] font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-[36px] lg:text-[43px] xl:text-[47px]">
            Put your money
            <span className="block">
              to work.
            </span>

            <span className="mt-1 block text-[#FF476B]">
              Build with purpose.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-lg text-xs leading-[1.75] text-white/60 sm:text-[13px] sm:leading-6 lg:text-sm">
            Explore structured investment plans, manage
            your portfolio and track your investment
            journey from one modern platform.
          </p>

          {/* MAIN ACTIONS */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">

            {/* Primary CTA */}
            <Link
              href="/register"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#E60033] px-5 py-2.5 text-xs font-black text-white shadow-[0_8px_25px_rgba(230,0,51,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF174B]"
            >
              Start investing

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/download"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-white/85 backdrop-blur-md transition hover:border-white/25 hover:bg-white/10"
            >
              <Download size={15} />
              Download App

              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            {/* Explore link */}
            <a
              href="#plans"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 px-3 text-xs font-bold text-white/65 transition hover:text-[#FF476B]"
            >
              Explore plans
              <ArrowRight size={13} />
            </a>
          </div>

          {/* TRUST / FEATURE POINTS */}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2.5 border-t border-white/10 pt-4 sm:mt-6">

            <TrustPoint
              icon={ShieldCheck}
              title="Account security"
            />

            <TrustPoint
              icon={BarChart3}
              title="Clear plans"
            />

            <TrustPoint
              icon={Wallet}
              title="Portfolio tools"
            />
          </div>
        </div>

        {/* RIGHT — INVESTMENT OVERVIEW */}
        <div className="relative mx-auto w-full min-w-0 max-w-107.5 md:ml-auto">

          {/* Red outer glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-3xl bg-[#E60033]/8 blur-2xl"
          />

          {/* Main dashboard card */}
          <div className="relative overflow-hidden rounded-[20px] border border-white/12 bg-[#0B1426]/95 shadow-2xl shadow-black/25 backdrop-blur-xl sm:rounded-[22px]">

            {/* Card header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3.5">

              <div className="flex min-w-0 items-center gap-2.5">

                {/* REDIQ LOGO */}
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#E60033]">
                  <Image
                    src="/images/logo.png"
                    alt="REDIQ"
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white">
                    REDIQ Investment
                  </p>

                  <p className="mt-0.5 text-[9px] text-white/40">
                    Investment opportunities
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                <TrendingUp size={16} />
              </div>
            </div>

            {/* Overview content */}
            <div className="p-4">

              <div className="flex items-end justify-between gap-3">

                <div>
                  <p className="text-[10px] font-medium text-white/45">
                    Available investment plans
                  </p>

                  <p className="mt-1 text-[28px] font-black leading-none tracking-tight text-white sm:text-[32px]">
                    {availablePlans}
                  </p>

                  <p className="mt-1.5 text-[10px] text-white/40">
                    Published opportunities
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1.5 text-[9px] font-bold text-[#FF476B]">
                  <CheckCircle2 size={11} />
                  Explore
                </span>
              </div>

              {/* COMPACT CHART */}
              <div className="relative mt-4 h-24 overflow-hidden rounded-xl border border-white/7 bg-[#101D30] sm:h-28">

                {/* Horizontal chart lines */}
                <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-white/5" />
                <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/5" />
                <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-white/5" />

                <svg
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="rediqHeroChartFill"
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
                    d="M0 125 C45 118 55 105 90 112 C125 120 135 84 175 91 C215 98 230 65 265 74 C300 83 315 52 350 58 C390 65 405 35 440 44 C465 50 480 26 500 20 L500 150 L0 150 Z"
                    fill="url(#rediqHeroChartFill)"
                  />

                  <path
                    d="M0 125 C45 118 55 105 90 112 C125 120 135 84 175 91 C215 98 230 65 265 74 C300 83 315 52 350 58 C390 65 405 35 440 44 C465 50 480 26 500 20"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Chart indicators */}
                <div className="absolute bottom-2 left-3 text-[8px] font-semibold text-white/30">
                  START
                </div>

                <div className="absolute bottom-2 right-3 text-[8px] font-semibold text-white/30">
                  GROW
                </div>
              </div>

              {/* Illustration disclaimer */}
              <p className="mt-1.5 text-[9px] text-white/30">
                Illustrative graphic · Not projected returns
              </p>

              {/* Compact stats */}
              <div className="mt-3 grid grid-cols-2 gap-2">

                <MiniStat
                  label="Plan choices"
                  value={`${availablePlans}`}
                />

                <MiniStat
                  label="Account access"
                  value="24/7"
                />
              </div>
            </div>

            {/* Bottom action */}
            <div className="flex items-center justify-between gap-3 border-t border-white/8 bg-white/2.5 px-4 py-3">

              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white">
                  Ready to explore?
                </p>

                <p className="mt-0.5 text-[9px] text-white/40">
                  Discover available investment plans.
                </p>
              </div>

              <a
                href="#plans"
                className="group inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-[#FF476B] transition hover:text-[#FF7895]"
              >
                View plans

                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>

          {/* Floating brand accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-xl border border-[#E60033]/25 bg-[#121C30] text-[#FF476B] shadow-lg sm:-right-3"
          >
            <BarChart3 size={15} />
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#E60033]/30 to-transparent" />
    </section>
  );
}

/* TRUST POINT */

interface TrustPointProps {
  icon: typeof ShieldCheck;
  title: string;
}

function TrustPoint({
  icon: Icon,
  title,
}: TrustPointProps) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/55 sm:text-[11px]">

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
        <Icon size={12} />
      </div>

      {title}
    </div>
  );
}

/* MINI STAT */

interface MiniStatProps {
  label: string;
  value: string;
}

function MiniStat({
  label,
  value,
}: MiniStatProps) {
  return (
    <div className="rounded-xl border border-white/7 bg-white/[0.035] px-3 py-2.5">

      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-white/35">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-white">
        {value}
      </p>
    </div>
  );
}