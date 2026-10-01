import {
  ArrowUpRight,
  BarChart3,
  Gift,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    number: '01',
    title: 'Account security',
    text: 'Security-focused account and transaction workflows help keep your investment experience organized and protected.',
  },
  {
    icon: BarChart3,
    number: '02',
    title: 'Clear plan details',
    text: 'Review minimum amounts, durations, and expected return rates before choosing an investment opportunity.',
  },
  {
    icon: LockKeyhole,
    number: '03',
    title: 'Protected workflows',
    text: 'Investment, deposit, and withdrawal actions follow dedicated account and transaction workflows.',
  },
  {
    icon: Gift,
    number: '04',
    title: 'Referral rewards',
    text: 'Invite eligible friends through the REDIQ referral program and track eligible rewards from your account.',
  },
];

export default function LandingWhyUs() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-[#07101F]"
    >
      <div className="absolute left-[-18%] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px] sm:h-96 sm:w-96 sm:blur-[130px]" />
      <div className="absolute right-[-15%] top-10 h-64 w-64 rounded-full bg-emerald-400/5 blur-[100px] sm:right-[-10%] sm:h-80 sm:w-80 sm:blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 md:px-8 md:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 xl:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7C948]" />
              Built around your journey
            </div>

            <h2 className="mt-4 text-[1.85rem] font-black leading-[1.08] tracking-[-0.03em] text-white sm:mt-5 sm:text-4xl lg:text-5xl">
              Everything you need to manage your investment journey.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/40 sm:mt-5 sm:text-base sm:leading-7">
              REDIQ brings your investment plans, deposits,
              portfolio activity, and account information together
              in one platform.
            </p>

            <div className="mt-6 flex items-center gap-3 sm:mt-8">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F7C948]/15 bg-[#F7C948]/5 text-[#F7C948] sm:h-10 sm:w-10">
                <BarChart3 size={16} className="sm:hidden" />
                <BarChart3 size={17} className="hidden sm:block" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Designed for clarity
                </p>

                <p className="mt-0.5 text-[10px] text-white/30">
                  Follow your account from one place.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  className="group rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-4 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/5.5 sm:rounded-[1.6rem] sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-[#0B192B] text-emerald-300 transition group-hover:border-emerald-400/20 sm:h-11 sm:w-11 sm:rounded-2xl">
                      <Icon size={17} className="sm:hidden" />
                      <Icon size={18} className="hidden sm:block" />
                    </div>

                    <span className="text-[10px] font-black tracking-[0.14em] text-white/15">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-black text-white sm:mt-6">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/35 sm:leading-6">
                    {item.text}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3 sm:mt-5 sm:pt-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/20">
                      REDIQ
                    </span>

                    <ArrowUpRight
                      size={14}
                      className="text-white/15 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F7C948]"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
