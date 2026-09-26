
import {
  ArrowDownRight,
  BarChart3,
  Check,
  Gift,
  Users,
  Wallet,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Create your account',
    text: 'Register and set up your Rich-Dadie investment account in a few simple steps.',
    accent: 'Account',
  },
  {
    number: '02',
    icon: Wallet,
    title: 'Fund your account',
    text: 'Use the available deposit options to add funds and prepare for your investment journey.',
    accent: 'Fund',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Choose a plan',
    text: 'Explore published investment plans and select an opportunity that fits your goals.',
    accent: 'Invest',
  },
  {
    number: '04',
    icon: Gift,
    title: 'Track your progress',
    text: 'Monitor your investments, portfolio activity, and account information from your dashboard.',
    accent: 'Track',
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#07101F]"
    >
      {/* Ambient background */}
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-emerald-400/5 blur-[110px]" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#F7C948]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        {/* Heading */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Simple process
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            From account to investment,
            <span className="block text-white/40">
              everything stays clear.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
            A straightforward experience designed to help you
            move from getting started to monitoring your investment
            activity without unnecessary complexity.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12">
          {/* Desktop connector */}
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-12 hidden h-px bg-linear-to-r from-white/5 via-emerald-400/20 to-white/5 md:block"
          />

          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative rounded-[1.75rem] border border-white/8 bg-white/[0.035] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/5.5"
                >
                  {/* Number */}
                  <div className="flex items-center justify-between">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-[#0B192B] text-emerald-300 shadow-lg shadow-black/10">
                      <Icon size={19} />
                    </div>

                    <span className="text-[11px] font-black tracking-[0.12em] text-white/15">
                      {step.number}
                    </span>
                  </div>

                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#F7C948]/65">
                    {step.accent}
                  </p>

                  <h3 className="mt-2 text-lg font-black tracking-tight text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {step.text}
                  </p>

                  {/* Completion indicator */}
                  <div className="mt-6 flex items-center gap-2 border-t border-white/6 pt-4">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <Check size={11} strokeWidth={3} />
                    </div>

                    <span className="text-[10px] font-semibold text-white/25">
                      Simple and transparent
                    </span>
                  </div>

                  {/* Arrow between cards */}
                  {index < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center rounded-full border border-white/8 bg-[#07101F] p-2 text-white/20 md:-right-5 md:bottom-auto md:left-auto md:top-9 md:translate-x-1/2"
                    >
                      <ArrowDownRight size={13} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom reassurance */}
        <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-white/7 bg-white/2.5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7C948]/10 text-[#F7C948]">
              <BarChart3 size={16} />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                Everything in one account
              </p>

              <p className="mt-0.5 text-[10px] text-white/30">
                Plans, investments and account activity.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Plans', 'Portfolio', 'Activity'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/7 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/40"
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

