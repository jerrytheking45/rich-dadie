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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-10">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/95 shadow-lg shadow-black/10 sm:h-10 sm:w-10 sm:rounded-[13px]">
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

            <div className="min-w-0 leading-tight">
              <p className="text-sm font-black tracking-tight text-white">
                REDIQ
              </p>

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/35 sm:text-[9px] sm:tracking-[0.2em]">
                Investment
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex lg:gap-8">
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/download"
              className="hidden rounded-full border border-white/10 px-4 py-2.5 text-sm font-bold text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Download App
            </Link>

            <Link
              href="/register"
              className="group inline-flex min-h-9 items-center gap-1 rounded-full bg-[#F7C948] px-3 py-2 text-[10px] font-black leading-none text-[#050B18] shadow-lg shadow-[#F7C948]/10 transition hover:-translate-y-0.5 hover:bg-[#FFD96A] sm:min-h-10 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              Get started

              <ArrowRight
                size={12}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-3.75 sm:w-3.75"
              />
            </Link>

            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white sm:h-10 sm:w-10 md:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

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

      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className={[
          'fixed right-0 top-0 z-70 flex h-dvh w-[min(88vw,390px)] flex-col border-l border-white/10 bg-[#07101F] shadow-2xl transition-transform duration-300 ease-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 px-4 sm:h-18 sm:px-5">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 sm:gap-3"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-5 sm:py-6">
          <nav className="space-y-1.5 sm:space-y-2">
            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-center justify-between rounded-xl border border-transparent px-3.5 py-3.5 text-sm font-bold text-white/80 transition hover:border-white/8 hover:bg-white/5 hover:text-white sm:rounded-2xl sm:px-4 sm:py-4 sm:text-base"
              >
                <span>{item.label}</span>

                <span className="text-[10px] font-bold text-white/20 transition group-hover:text-[#F7C948] sm:text-xs">
                  0{index + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/8 pt-5 sm:pt-6">
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex min-h-11 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/download"
              onClick={closeMenu}
              className="mt-2.5 flex min-h-11 w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Download App
            </Link>

            <Link
              href="/register"
              onClick={closeMenu}
              className="mt-2.5 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#F7C948] px-5 py-3 text-sm font-black text-[#050B18] transition hover:bg-[#FFD96A]"
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
