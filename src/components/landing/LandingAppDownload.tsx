
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Download,
  Smartphone,
  ShieldCheck,
  ChartNoAxesCombined,
} from 'lucide-react';

export default function LandingAppDownload() {
  return (
    <section className="overflow-hidden bg-[#050B18] px-3 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#101D30] via-[#0B1426] to-[#07101F] shadow-xl shadow-black/10">

          {/* Background decorations */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#E60033]/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-emerald-400/5 blur-3xl"
          />

          {/* Main layout */}
          <div className="relative grid items-center gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 md:grid-cols-[1fr_0.85fr] lg:gap-8 lg:px-9 lg:py-7">

            {/* LEFT CONTENT */}
            <div className="relative z-10 min-w-0">

              {/* Brand and badge */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[#E60033]">
                  <Image
                    src="/images/logo.png"
                    alt="REDIQ logo"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/25 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#FF476B]">
                  <Smartphone size={12} />
                  REDIQ for Android
                </div>
              </div>

              {/* Heading */}
              <h2 className="mt-3 max-w-lg text-[22px] font-black leading-[1.13] tracking-tight text-white sm:text-2xl lg:text-[30px]">
                Your investment journey,
                <span className="block text-[#FF476B]">
                  wherever you go.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-2 max-w-md text-xs leading-5 text-white/50 sm:text-[13px] sm:leading-6">
                Access REDIQ from your Android device.
                Monitor investments, manage deposits and
                withdrawals, and track account activity
                wherever you are.
              </p>

              {/* Features */}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/50">
                  <ChartNoAxesCombined
                    size={13}
                    className="text-emerald-400"
                  />
                  Portfolio tracking
                </span>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/50">
                  <ShieldCheck
                    size={13}
                    className="text-[#FF476B]"
                  />
                  Account security
                </span>
              </div>

              {/* Download button */}
              <div className="mt-5">
                <Link
                  href="/download"
                  className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#E60033] px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF174B] sm:w-auto"
                >
                  <Download size={15} />

                  Get the Android App

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <p className="mt-2 text-[9px] text-white/30">
                  Android APK · Installation instructions
                </p>
              </div>
            </div>

            {/* RIGHT — ANDROID APP PREVIEW */}
            <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center md:ml-auto">

              {/* Subtle red glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-8 rounded-full bg-[#E60033]/10 blur-[65px]"
              />

              {/* Phone preview image */}
              <div className="relative w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/app-preview.png"
                  alt="Illustrative REDIQ Android app dashboard and investment plan screens"
                  width={780}
                  height={920}
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 420px, 35vw"
                  className="h-auto max-h-[230px] w-full object-contain object-center sm:max-h-[280px] md:max-h-[300px] lg:max-h-[325px]"
                />
              </div>

              <span className="absolute bottom-1 right-1 rounded-full border border-white/10 bg-[#07101F]/90 px-2.5 py-1 text-[9px] font-semibold text-white/65 backdrop-blur-md">
                App concept preview
              </span>
            </div>
          </div>

          {/* Bottom branding line */}
          <div className="h-px bg-linear-to-r from-transparent via-[#E60033]/35 to-transparent" />
        </div>
      </div>
    </section>
  );
}