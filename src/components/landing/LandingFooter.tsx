import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

const footerLinks = [
  {
    label: 'Explore',
    links: [
      { label: 'Investment plans', href: '#plans' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Why REDIQ', href: '#why-us' },
    ],
  },
  {
    label: 'Account',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'Download App', href: '/download' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/7 bg-[#050B18]">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 md:px-8 lg:px-10 lg:py-14">
        <div className="grid gap-7 sm:gap-9 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 sm:gap-3"
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-lg shadow-black/10 sm:h-10 sm:w-10 sm:rounded-[13px]">
                <Image
                  src="/images/logo.png"
                  alt="REDIQ"
                  fill
                  sizes="40px"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
              </div>

              <div className="leading-tight">
                <p className="text-sm font-black tracking-tight text-white">
                  REDIQ
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/25 sm:text-[9px] sm:tracking-[0.2em]">
                  Investment
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-xs leading-5 text-white/30 sm:mt-5 sm:leading-6">
              An investment platform for exploring published investment plans,
              managing your account, and tracking your investment activity.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/7 bg-white/2.5 px-3 py-1.5 text-[10px] font-semibold text-white/30 sm:mt-6 sm:py-2">
              <ShieldCheck size={13} className="text-emerald-300" />
              Account-focused experience
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
                {group.label}
              </p>

              <nav className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex w-fit items-center gap-1.5 text-xs font-semibold text-white/45 transition hover:text-white"
                  >
                    {link.label}

                    <ArrowUpRight
                      size={11}
                      className="text-white/15 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F7C948]"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2.5 border-t border-white/7 pt-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6">
          <p className="text-[10px] text-white/20">
            © {new Date().getFullYear()} REDIQ Investment. All rights reserved.
          </p>

          <p className="max-w-xl text-[10px] leading-4 text-white/20 sm:text-right">
            Investment opportunities and platform information are subject to the
            applicable terms and conditions.
          </p>
        </div>
      </div>
    </footer>
  );
}
