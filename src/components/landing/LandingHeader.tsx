
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Download,
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

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* MAIN HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#050B18]/90 shadow-lg shadow-black/10 backdrop-blur-2xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-10">

          {/* BRAND */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#E60033] shadow-[0_5px_20px_rgba(230,0,51,0.18)] transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
              <Image
                src="/images/logo.png"
                alt="REDIQ logo"
                fill
                priority
                sizes="44px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 leading-tight">
              <p className="text-[17px] font-black tracking-[-0.035em] text-white sm:text-xl">
                REDIQ
              </p>

              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.22em] text-white/40 sm:text-[9px]">
                Investment
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 md:flex lg:gap-9"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative py-2 text-[13px] font-semibold text-white/60 transition-colors duration-300 hover:text-white"
              >
                {item.label}

                <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-[#E60033] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* HEADER ACTIONS */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2.5 text-[13px] font-bold text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/download"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[12px] font-bold text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white lg:inline-flex"
            >
              <Download size={14} />
              Download App
            </Link>

            {/* RED PRIMARY BUTTON */}
            <Link
              href="/register"
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#E60033] px-4 py-2.5 text-[11px] font-black text-white shadow-[0_8px_25px_rgba(230,0,51,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF174B] hover:shadow-[0_10px_30px_rgba(230,0,51,0.32)] sm:px-5 sm:text-[13px]"
            >
              Get started

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-[#E60033]/30 hover:bg-[#E60033]/10 hover:text-white md:hidden"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>

        {/* BOTTOM HEADER ACCENT */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-[#E60033]/35 to-transparent" />
      </header>

      {/* MOBILE BACKDROP */}
      <button
        type="button"
        aria-label="Close mobile navigation"
        tabIndex={isOpen ? 0 : -1}
        onClick={closeMenu}
        className={[
          'fixed inset-0 z-60 bg-[#020711]/80 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isOpen
            ? 'visible pointer-events-auto opacity-100'
            : 'invisible pointer-events-none opacity-0',
        ].join(' ')}
      />

      {/* MOBILE DRAWER */}
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={[
          'fixed right-0 top-0 z-70 flex h-dvh w-[min(88vw,390px)] flex-col border-l border-white/10 bg-[#07101F] shadow-2xl transition-[transform,visibility] duration-300 ease-out md:hidden',
          isOpen
            ? 'visible translate-x-0'
            : 'invisible translate-x-full',
        ].join(' ')}
      >
        {/* DRAWER HEADER */}
        <div className="flex h-17 shrink-0 items-center justify-between border-b border-white/8 px-5">

          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#E60033] shadow-lg shadow-[#E60033]/15">
              <Image
                src="/images/logo.png"
                alt="REDIQ"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>

            <div className="leading-tight">
              <p className="text-lg font-black tracking-tight text-white">
                REDIQ
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                Investment
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:border-[#E60033]/30 hover:bg-[#E60033]/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-6">

          <div className="mb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E60033]">
              Explore REDIQ
            </p>

            <p className="mt-2 text-xs leading-5 text-white/35">
              Discover investment opportunities and explore our platform.
            </p>
          </div>

          {/* MOBILE NAVIGATION */}
          <nav aria-label="Mobile links" className="space-y-2">
            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-center justify-between rounded-2xl border border-white/6 bg-white/2.5 px-4 py-4 transition-all duration-300 hover:border-[#E60033]/25 hover:bg-[#E60033]/8"
              >
                <span className="text-sm font-bold text-white/75 transition group-hover:text-white">
                  {item.label}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-white/20 transition group-hover:text-[#E60033]">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <ArrowRight
                    size={14}
                    className="text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-[#E60033]"
                  />
                </div>
              </a>
            ))}
          </nav>

          {/* MOBILE BOTTOM ACTIONS */}
          <div className="mt-auto pt-8">

            <div className="mb-5 h-px bg-linear-to-r from-[#E60033]/30 via-white/10 to-transparent" />

            <Link
              href="/login"
              onClick={closeMenu}
              className="flex min-h-12 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/download"
              onClick={closeMenu}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <Download size={16} />
              Download App
            </Link>

            <Link
              href="/register"
              onClick={closeMenu}
              className="group mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E60033] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#E60033]/15 transition hover:bg-[#FF174B]"
            >
              Get started

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <p className="mt-6 text-center text-[10px] font-medium text-white/20">
              REDIQ Investment Platform
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}