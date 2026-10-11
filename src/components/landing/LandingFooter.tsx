
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Mail,
  ChevronRight,
} from 'lucide-react';

const footerLinks = [
  {
    label: 'Explore',
    links: [
      { label: 'Investment plans', href: '/#plans' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Why REDIQ', href: '/#why-us' },
    ],
  },
  {
    label: 'Account',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'Download App', href: '/download' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-[#050B18]">

      {/* Subtle brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#E60033]/5 blur-[75px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-7 sm:px-6 sm:pb-6 sm:pt-9 lg:px-10 lg:pt-10">

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-8 lg:grid-cols-[1.5fr_0.75fr_0.75fr_1fr] lg:gap-10">

          {/* BRAND COLUMN */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">

            <Link
              href="/"
              className="group inline-flex items-center gap-2.5"
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#E60033] shadow-lg shadow-[#E60033]/15 transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="REDIQ logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>

              <div className="leading-tight">
                <p className="text-base font-black tracking-tight text-white">
                  REDIQ
                </p>

                <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Investment
                </p>
              </div>
            </Link>

            {/* Description */}
            <p className="mt-3 max-w-xs text-[11px] leading-[1.7] text-white/45 sm:text-xs">
              Explore investment opportunities, manage
              your portfolio and track account activity
              through one modern platform.
            </p>

            {/* Brand feature */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#E60033]/15 bg-[#E60033]/5 px-2.5 py-1.5">
              <ShieldCheck
                size={12}
                className="text-[#FF476B]"
              />

              <span className="text-[9px] font-semibold text-white/50">
                Account-focused experience
              </span>
            </div>
          </div>

          {/* NAVIGATION COLUMNS */}
          {footerLinks.map((group) => (
            <div key={group.label} className="min-w-0">

              <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-white">
                {group.label}
              </h3>

              <div className="mt-2 h-0.5 w-5 rounded-full bg-[#E60033]" />

              <nav
                aria-label={`${group.label} footer links`}
                className="mt-3 flex flex-col gap-2.5"
              >
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex w-fit items-center gap-1.5 text-[11px] font-medium leading-4 text-white/45 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}

                    <ArrowUpRight
                      size={11}
                      className="shrink-0 text-white/15 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FF476B]"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* QUICK ACCESS COLUMN */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">

            <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-white">
              Stay connected
            </h3>

            <div className="mt-2 h-0.5 w-5 rounded-full bg-[#E60033]" />

            <p className="mt-3 max-w-xs text-[11px] leading-[1.7] text-white/40">
              Access your REDIQ account and stay connected
              to your investment journey.
            </p>

            {/* Quick access links */}
            <div className="mt-3 flex flex-wrap gap-2">

              <Link
                href="/download"
                className="group inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-white/70 transition hover:border-[#E60033]/25 hover:bg-[#E60033]/10 hover:text-white"
              >
                <Smartphone
                  size={13}
                  className="text-[#FF476B]"
                />

                Android App

                <ChevronRight
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/register"
                className="group inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#E60033] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#FF174B]"
              >
                <TrendingUp size={13} />

                Get started

                <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* Contact notice */}
            <div className="mt-4 flex items-start gap-2 border-t border-white/7 pt-3">
              <Mail
                size={13}
                className="mt-0.5 shrink-0 text-[#FF476B]"
              />

              <p className="text-[10px] leading-4 text-white/35">
                Need assistance? Visit your REDIQ
                account for available support options.
              </p>
            </div>
          </div>
        </div>

        {/* INVESTMENT DISCLAIMER */}
        <div className="mt-6 rounded-xl border border-white/7 bg-white/2.5 px-3 py-2.5 sm:mt-7 sm:px-4">

          <div className="flex items-start gap-2">

            <ShieldCheck
              size={13}
              className="mt-0.5 shrink-0 text-[#FF476B]"
            />

            <p className="text-[10px] leading-[1.65] text-white/40">
              <span className="font-bold text-white/60">
                Investment notice:
              </span>{' '}
               Review the terms, applicable fees,
              investment duration and withdrawal conditions before
              making an investment decision.
            </p>
          </div>
        </div>

        {/* COPYRIGHT ROW */}
        <div className="mt-5 flex flex-col gap-2 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

          <p className="text-[10px] text-white/30">
            © {new Date().getFullYear()} REDIQ Investment.
            All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">

            <Link
              href="/terms"
              className="text-[10px] text-white/35 transition hover:text-[#FF476B]"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/#faq"
              className="text-[10px] text-white/35 transition hover:text-[#FF476B]"
            >
              FAQ
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF476B] transition hover:text-[#FF6B88]"
            >
              REDIQ
              <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>

      </div>

      {/* FINAL RED ACCENT */}
      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-[#E60033]/60 to-transparent" />

    </footer>
  );
}