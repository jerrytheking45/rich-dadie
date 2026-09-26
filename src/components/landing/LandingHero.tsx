
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

interface LandingHeroProps {
  plansCount: number;
}

export default function LandingHero({
  plansCount,
}: LandingHeroProps) {
  const availablePlans = plansCount > 0 ? plansCount : null;

  return (
    <section className="relative overflow-hidden bg-[#050B18]">
      {/* Background image */}
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-25"
      />

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-[#050B18]/70" />

      <div className="absolute inset-0 bg-linear-to-r from-[#050B18] via-[#050B18]/90 to-[#050B18]/55" />

      {/* Ambient lighting */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute right-[-10%] top-[-20%] h-130 w-130 rounded-full bg-[#F7C948]/8 blur-[130px]" />
      <div className="absolute bottom-[-20%] right-[20%] h-80 w-80 rounded-full bg-blue-500/8 blur-[120px]" />

      {/* Grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:pb-28 lg:pt-24">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/8 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            Investment made clearer
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.5rem]">
            Put your money to work.
            <span className="mt-2 block bg-linear-to-r from-[#F7C948] via-[#FFE08A] to-emerald-300 bg-clip-text text-transparent">
              Build with purpose.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            Explore structured investment plans, manage your
            portfolio, and keep track of your investment journey
            from one modern platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#F7C948] px-6 py-3.5 text-sm font-black text-[#050B18] shadow-xl shadow-[#F7C948]/10 transition hover:-translate-y-0.5 hover:bg-[#FFD96A]"
            >
              Start investing

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <a
              href="#plans"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/80 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
            >
              Explore plans
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <TrustPoint
              icon={ShieldCheck}
              title="Security"
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

        {/* Portfolio visual */}
        <div className="relative mx-auto w-full max-w-130 lg:ml-auto">
          {/* Outer glow */}
          <div className="absolute -inset-5 rounded-[2.5rem] bg-emerald-400/5 blur-2xl" />

          <div className="relative rounded-4x1 border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl">
            <div className="overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#0A1424]">
              {/* Card header */}
              <div className="flex items-start justify-between border-b border-white/8 px-5 py-5 sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                      Portfolio overview
                    </p>
                  </div>

                  <p className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Your investment journey
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-emerald-300">
                  <BarChart3 size={18} />
                </div>
              </div>

              {/* Portfolio balance */}
              <div className="px-5 py-6 sm:px-6">
                <p className="text-xs font-medium text-white/35">
                  Available investment plans
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black tracking-tight text-white">
                      {availablePlans ?? '—'}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      Published opportunities
                    </p>
                  </div>

                  <div className="rounded-full border border-emerald-400/15 bg-emerald-400/8 px-3 py-1.5 text-[10px] font-bold text-emerald-300">
                    Available
                  </div>
                </div>

                {/* Chart */}
                <div className="relative mt-7 h-36 overflow-hidden rounded-2xl border border-white/6 bg-white/2.5">
                  <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-white/6" />
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/6" />
                  <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-white/6" />

                  <svg
                    viewBox="0 0 500 150"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="heroChartFill"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#34D399"
                          stopOpacity="0.24"
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
                      fill="url(#heroChartFill)"
                    />

                    <path
                      d="M0 125 C45 118 55 105 90 112 C125 120 135 84 175 91 C215 98 230 65 265 74 C300 83 315 52 350 58 C390 65 405 35 440 44 C465 50 480 26 500 20"
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  <div className="absolute bottom-3 left-4 text-[9px] font-semibold text-white/20">
                    START
                  </div>

                  <div className="absolute bottom-3 right-4 text-[9px] font-semibold text-white/20">
                    GROW
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniStat
                    label="Plan choices"
                    value={availablePlans ? `${availablePlans}` : '—'}
                  />

                  <MiniStat
                    label="Account access"
                    value="24/7"
                  />
                </div>
              </div>

              {/* Bottom action */}
              <div className="border-t border-white/8 bg-white/2.5 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white">
                      Ready to explore?
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/30">
                      Browse the available investment plans.
                    </p>
                  </div>

                  <a
                    href="#plans"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F7C948] transition hover:text-[#FFE08A]"
                  >
                    View plans
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Floating verification card */}
          <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-[#101D31]/95 p-3 shadow-2xl backdrop-blur-xl sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <p className="text-[11px] font-bold text-white">
                  Your journey, one place
                </p>

                <p className="mt-0.5 text-[10px] text-white/35">
                  Plans · Portfolio · Activity
                </p>
              </div>
            </div>
          </div>

          {/* Floating plan badge */}
          <div className="absolute -right-3 top-12 hidden rounded-2xl border border-[#F7C948]/15 bg-[#111C2D]/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#F7C948]/60">
              Opportunities
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {availablePlans ?? '—'} plans
            </p>
          </div>
        </div>
      </div>

      {/* Bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

interface TrustPointProps {
  icon: typeof ShieldCheck;
  title: string;
}

function TrustPoint({
  icon: Icon,
  title,
}: TrustPointProps) {
  return (
    <div className="flex items-center gap-2.5 text-xs font-semibold text-white/45">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-emerald-300">
        <Icon size={14} />
      </div>

      {title}
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string;
}

function MiniStat({
  label,
  value,
}: MiniStatProps) {
  return (
    <div className="rounded-2xl border border-white/7 bg-white/2.5 p-3.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/25">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-black text-white">
        {value}
      </p>
    </div>
  );
}

