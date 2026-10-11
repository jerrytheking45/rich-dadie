
import {
  ArrowRight,
  BarChart3,
  Check,
  Gift,
  Users,
  Wallet,
  Layers3,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Create your account',
    text: 'Register and set up your REDIQ investment account in a few simple steps.',
    accent: 'ACCOUNT',
  },
  {
    number: '02',
    icon: Wallet,
    title: 'Fund your account',
    text: 'Use the available deposit options to add funds and prepare for your investment journey.',
    accent: 'FUND',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Choose a plan',
    text: 'Explore published investment plans and select an opportunity that fits your goals.',
    accent: 'INVEST',
  },
  {
    number: '04',
    icon: Gift,
    title: 'Track your progress',
    text: 'Monitor your investments, portfolio activity, and account information from your dashboard.',
    accent: 'TRACK',
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 overflow-hidden bg-[#07101F]"
    >
      {/* Background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-[#E60033]/5 blur-[80px] sm:h-56 sm:w-56"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-emerald-400/5 blur-[80px] sm:h-56 sm:w-56"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11">

        {/* SECTION HEADER */}
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E60033]" />
            Simple process
          </div>

          {/* Heading */}
          <h2 className="mt-3 text-[22px] font-black leading-[1.15] tracking-tight text-white sm:text-[27px] lg:text-[30px]">
            From account to investment,
            <span className="block text-[#FF476B]">
              everything stays clear.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-2 max-w-xl text-[11px] leading-[1.7] text-white/45 sm:text-xs sm:leading-5 lg:text-[13px]">
            A straightforward experience designed to help you
            get started, explore investment opportunities and
            monitor your portfolio from one platform.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="relative mt-5 sm:mt-6 lg:mt-7">

          {/* Connecting line — desktop */}
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-5 hidden h-px bg-linear-to-r from-transparent via-[#E60033]/25 to-transparent lg:block"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative flex h-full flex-col rounded-2xl border border-white/8 bg-[#0B1426] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#E60033]/25 hover:bg-[#101D30] sm:p-4"
                >

                  {/* CARD HEADER */}
                  <div className="flex items-center justify-between gap-3">

                    {/* Icon */}
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B] transition-colors group-hover:bg-[#E60033]/15">
                      <Icon size={17} />
                    </div>

                    {/* Step number */}
                    <span className="text-[10px] font-black tracking-[0.12em] text-white/20">
                      {step.number}
                    </span>
                  </div>

                  {/* Accent label */}
                  <p className="mt-3 text-[9px] font-black uppercase tracking-[0.14em] text-[#FF476B]/80">
                    {step.accent}
                  </p>

                  {/* Title */}
                  <h3 className="mt-1 text-[13px] font-black leading-5 tracking-tight text-white sm:text-sm">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 flex-1 text-[11px] leading-[1.65] text-white/45 sm:text-xs sm:leading-5">
                    {step.text}
                  </p>

                  {/* Bottom indicator */}
                  <div className="mt-3 flex items-center gap-2 border-t border-white/7 pt-2.5">

                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#E60033]/10 text-[#FF476B]">
                      <Check size={10} strokeWidth={3} />
                    </span>

                    <span className="text-[9px] font-semibold text-white/30">
                      Simple process
                    </span>
                  </div>

                  {/* Connecting arrow - desktop */}
                  {index < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute -right-2.5 top-4 z-20 hidden h-5 w-5 items-center justify-center rounded-full border border-[#E60033]/20 bg-[#101D30] text-[#FF476B] lg:flex"
                    >
                      <ArrowRight size={11} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* BOTTOM INFORMATION STRIP */}
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/8 bg-[#0B1426] px-3.5 py-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:px-4">

          {/* Left information */}
          <div className="flex min-w-0 items-center gap-2.5">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
              <Layers3 size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white sm:text-xs">
                Everything in one account
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-white/35">
                Plans, investments and account activity.
              </p>
            </div>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1.5">
            {['Plans', 'Portfolio', 'Activity'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[9px] font-semibold text-white/45"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}