
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

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
      { label: 'FAQ', href: '#faq' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/7 bg-[#050B18]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px]  shadow-lg shadow-black/10">
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

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                  Investment
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-xs leading-6 text-white/30">
              An investment platform for exploring published
              investment plans, managing your account, and tracking
              your investment activity.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/7 bg-white/2.5 px-3 py-2 text-[10px] font-semibold text-white/30">
              <ShieldCheck
                size={13}
                className="text-emerald-300"
              />
              Account-focused experience
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
                {group.label}
              </p>

              <nav className="mt-4 space-y-3">
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

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/7 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-white/20">
            © {new Date().getFullYear()} REDIQ Investment.
            All rights reserved.
          </p>

          <p className="text-[10px] text-white/20">
            Investment opportunities and platform information are
            subject to the applicable terms and conditions.
          </p>
        </div>
      </div>
    </footer>
  );
}


