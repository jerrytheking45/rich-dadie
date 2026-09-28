
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { label: 'Plans', href: '#plans' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why REDIQ', href: '#why-us' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#050B18]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Brand */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] bg-white/95 shadow-lg shadow-black/10">
              <Image
                src="/images/logo.png"
                alt="REDIQ"
                fill
                sizes="40px"
                className="h-full w-full object-cover"
                priority
              />

              <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-black tracking-tight text-white">
                REDIQ
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                Investment
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-sm font-semibold text-white/55 transition hover:text-white"
              >
                {item.label}

                <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#F7C948] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#F7C948] px-4 py-2.5 text-sm font-black text-[#050B18] shadow-lg shadow-[#F7C948]/10 transition hover:-translate-y-0.5 hover:bg-[#FFD96A] hover:shadow-[#F7C948]/20"
            >
              Get started

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>

            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white md:hidden"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={[
          'fixed inset-0 z-60 bg-[#020711]/70 backdrop-blur-md transition-opacity duration-300 md:hidden',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      {/* Mobile navigation */}
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className={[
          'fixed right-0 top-0 z-70 flex h-dvh w-[min(88vw,390px)] flex-col border-l border-white/10 bg-[#07101F] shadow-2xl transition-transform duration-300 ease-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-white/8 px-5">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/95">
              <Image
                src="/images/logo.png"
                alt="REDIQ"
                fill
                sizes="36px"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-black text-white">
                REDIQ
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                Investment
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          <nav className="space-y-2">
            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-center justify-between rounded-2xl border border-transparent px-4 py-4 text-base font-bold text-white/80 transition hover:border-white/8 hover:bg-white/5 hover:text-white"
              >
                <span>{item.label}</span>

                <span className="text-xs font-bold text-white/20 transition group-hover:text-[#F7C948]">
                  0{index + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/8 pt-6">
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              onClick={closeMenu}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#F7C948] px-5 py-3.5 text-sm font-black text-[#050B18] transition hover:bg-[#FFD96A]"
            >
              Get started

              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}


