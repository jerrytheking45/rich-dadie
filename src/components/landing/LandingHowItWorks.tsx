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
    text: 'Register and set up your REDIQ investment account in a few simple steps.',
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
      <div className="absolute -left-28 top-16 h-56 w-56 rounded-full bg-emerald-400/5 blur-[90px] sm:-left-40 sm:top-20 sm:h-80 sm:w-80 sm:blur-[110px]" />
      <div className="absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-[#F7C948]/5 blur-[100px] sm:-right-40 sm:h-96 sm:w-96 sm:blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 md:px-8 md:py-20 lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Simple process
          </div>

          <h2 className="mt-4 text-[1.85rem] font-black leading-[1.08] tracking-[-0.03em] text-white sm:mt-5 sm:text-4xl lg:text-5xl">
            From account to investment,
            <span className="block text-white/40">
              everything stays clear.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/45 sm:mt-5 sm:text-base sm:leading-7">
            A straightforward experience designed to help you
            move from getting started to monitoring your investment
            activity without unnecessary complexity.
          </p>
        </div>

        <div className="relative mt-8 sm:mt-10 md:mt-12">
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-10 hidden h-px bg-linear-to-r from-white/5 via-emerald-400/20 to-white/5 md:block"
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/5.5 sm:rounded-[1.6rem] sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/15 bg-[#0B192B] text-emerald-300 shadow-lg shadow-black/10 sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Icon size={18} className="sm:hidden" />
                      <Icon size={19} className="hidden sm:block" />
                    </div>

                    <span className="text-[10px] font-black tracking-[0.12em] text-white/15 sm:text-[11px]">
                      {step.number}
                    </span>
                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#F7C948]/65 sm:mt-6">
                    {step.accent}
                  </p>

                  <h3 className="mt-1.5 text-base font-black tracking-tight text-white sm:mt-2 sm:text-lg">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/40 sm:mt-3 sm:text-sm sm:leading-6">
                    {step.text}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-white/6 pt-3 sm:mt-6 sm:pt-4">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <Check size={11} strokeWidth={3} />
                    </div>

                    <span className="text-[10px] font-semibold text-white/25">
                      Simple and transparent
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center rounded-full border border-white/8 bg-[#07101F] p-1.5 text-white/20 sm:-bottom-7 sm:p-2 md:-right-5 md:bottom-auto md:left-auto md:top-9 md:translate-x-1/2"
                    >
                      <ArrowDownRight size={12} className="sm:hidden" />
                      <ArrowDownRight size={13} className="hidden sm:block" />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 rounded-[1.35rem] border border-white/7 bg-white/2.5 px-4 py-3.5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-[1.75rem] sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7C948]/10 text-[#F7C948]">
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

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {['Plans', 'Portfolio', 'Activity'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/7 bg-white/5 px-2.5 py-1.5 text-[10px] font-semibold text-white/40 sm:px-3"
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
