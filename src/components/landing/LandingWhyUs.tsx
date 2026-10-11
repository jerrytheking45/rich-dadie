
import Image from 'next/image';

import {
  ArrowUpRight,
  BarChart3,
  Gift,
  LockKeyhole,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
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
      className="relative scroll-mt-20 overflow-hidden bg-[#07101F]"
    >
      {/* Subtle ambient effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full bg-[#E60033]/8 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-emerald-400/5 blur-[80px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11">

        {/* RESPONSIVE CONTENT GRID */}
        <div className="grid items-center gap-6 md:grid-cols-[0.85fr_1.15fr] lg:gap-9">

          {/* LEFT CONTENT */}
          <div className="min-w-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
              <Sparkles size={11} />
              Why choose REDIQ
            </div>

            {/* Heading */}
            <h2 className="mt-3 max-w-lg text-[22px] font-black leading-[1.15] tracking-tight text-white sm:text-[27px] lg:text-[30px]">
              Everything you need.
              <span className="block text-[#FF476B]">
                One investment platform.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-2 max-w-lg text-[11px] leading-[1.7] text-white/50 sm:text-xs sm:leading-5 lg:text-[13px]">
              REDIQ brings your investment plans, deposits,
              portfolio activity and account information
              together in one modern platform.
            </p>

            {/* BRAND FEATURE CARD */}
            <div className="mt-4 flex max-w-md items-center gap-3 rounded-xl border border-white/8 bg-[#0B1426] p-3">

              {/* REDIQ logo */}
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#E60033] shadow-lg shadow-[#E60033]/15">
                <Image
                  src="/images/logo.png"
                  alt="REDIQ logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black text-white sm:text-xs">
                  Designed for clarity
                </p>

                <p className="mt-0.5 text-[10px] leading-4 text-white/40">
                  Manage your investment journey from one place.
                </p>
              </div>

              <CheckCircle2
                size={16}
                className="shrink-0 text-[#FF476B]"
              />
            </div>

            {/* Small information tags */}
            <div className="mt-3 flex flex-wrap gap-2">

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-2.5 py-1.5 text-[9px] font-medium text-white/50">
                <BarChart3 size={11} className="text-[#FF476B]" />
                Portfolio tools
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-2.5 py-1.5 text-[9px] font-medium text-white/50">
                <ShieldCheck size={11} className="text-[#FF476B]" />
                Account workflows
              </span>
            </div>
          </div>

          {/* RIGHT — BENEFIT CARDS */}
          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">

            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#E60033]/25 hover:bg-[#101D30] sm:p-4"
                >

                  {/* Subtle hover accent */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#E60033]/0 to-transparent transition-all duration-300 group-hover:via-[#E60033]/50" />

                  {/* ICON AND NUMBER */}
                  <div className="flex items-center justify-between gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B] transition-colors group-hover:bg-[#E60033]/15">
                      <Icon size={17} />
                    </div>

                    <span className="text-[10px] font-black tracking-[0.12em] text-white/20">
                      {item.number}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-3 text-[13px] font-black leading-5 tracking-tight text-white sm:text-sm">
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-1.5 flex-1 text-[11px] leading-[1.65] text-white/45 sm:text-xs sm:leading-5">
                    {item.text}
                  </p>

                  {/* CARD FOOTER */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/7 pt-2.5">

                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                      REDIQ Investment
                    </span>

                    <ArrowUpRight
                      size={13}
                      aria-hidden="true"
                      className="text-[#FF476B]/65 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FF476B]"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACCENT */}
        <div className="mt-6 h-px bg-linear-to-r from-transparent via-[#E60033]/20 to-transparent" />
      </div>
    </section>
  );
}