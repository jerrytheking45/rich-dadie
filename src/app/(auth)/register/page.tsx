
import { Suspense } from "react";
import Image from "next/image";
import RegisterForm from "./RegisterForm";

function RegisterLoading() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#070b24] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -right-40 top-20 h-125 w-125 rounded-full bg-purple-600/15 blur-3xl" />

        <div className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_28%),linear-gradient(135deg,#070b24_0%,#0b1033_50%,#130d2c_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-4xl border border-white/10 bg-white/[0.035] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
          {/* Desktop branding panel */}
          <section className="relative hidden min-h-160 overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative">
              {/* Logo */}
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/15 bg-white/10 shadow-[0_8px_30px_rgba(45,212,191,0.18)]">
                  <Image
                    src="/images/logo.png"
                    alt="Rich Dadie logo"
                    width={44}
                    height={44}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight text-white">
                    Rich Dadie
                  </p>

                  <p className="text-xs text-white/45">
                    Investment Platform
                  </p>
                </div>
              </div>

              {/* Loading heading */}
              <div className="max-w-lg animate-pulse">
                <div className="mb-4 h-6 w-36 rounded-full bg-emerald-400/10" />

                <div className="h-12 w-full max-w-md rounded-xl bg-white/10" />

                <div className="mt-3 h-12 w-3/4 max-w-sm rounded-xl bg-white/6" />

                <div className="mt-6 h-4 w-full max-w-md rounded-lg bg-white/5" />

                <div className="mt-2 h-4 w-4/5 max-w-sm rounded-lg bg-white/4" />
              </div>

              {/* Feature placeholders */}
              <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/4.5 p-4">
                  <div className="mb-3 h-9 w-9 rounded-xl bg-emerald-400/10" />

                  <div className="h-4 w-24 rounded bg-white/10" />

                  <div className="mt-2 h-3 w-full rounded bg-white/5" />

                  <div className="mt-1 h-3 w-3/4 rounded bg-white/4" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/4.5 p-4">
                  <div className="mb-3 h-9 w-9 rounded-xl bg-cyan-400/10" />

                  <div className="h-4 w-28 rounded bg-white/10" />

                  <div className="mt-2 h-3 w-full rounded bg-white/5" />

                  <div className="mt-1 h-3 w-3/4 rounded bg-white/4" />
                </div>
              </div>
            </div>

            <div className="relative h-3 w-72 max-w-full animate-pulse rounded bg-white/4" />
          </section>

          {/* Registration loading panel */}
          <section className="flex items-center p-5 sm:p-8 lg:p-10 xl:p-14">
            <div className="mx-auto w-full max-w-md animate-pulse">
              {/* Mobile logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/15 bg-white/10 shadow-[0_8px_30px_rgba(45,212,191,0.18)]">
                  <Image
                    src="/images/logo.png"
                    alt="Rich Dadie logo"
                    width={44}
                    height={44}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <div className="h-5 w-28 rounded bg-white/10" />

                  <div className="mt-1.5 h-3 w-24 rounded bg-white/5" />
                </div>
              </div>

              {/* Heading */}
              <div>
                <div className="h-4 w-28 rounded bg-emerald-300/10" />

                <div className="mt-4 h-9 w-full rounded-xl bg-white/10" />

                <div className="mt-3 h-4 w-full rounded-lg bg-white/5" />

                <div className="mt-2 h-4 w-4/5 rounded-lg bg-white/4" />
              </div>

              {/* Form */}
              <div className="mt-8 space-y-5">
                <div>
                  <div className="mb-2 h-4 w-24 rounded bg-white/6" />

                  <div className="h-14 rounded-2xl border border-white/10 bg-white/5.5" />
                </div>

                <div>
                  <div className="mb-2 h-4 w-24 rounded bg-white/6" />

                  <div className="h-14 rounded-2xl border border-white/10 bg-white/5.5" />
                </div>

                <div>
                  <div className="mb-2 h-4 w-32 rounded bg-white/6" />

                  <div className="h-14 rounded-2xl border border-white/10 bg-white/5.5" />
                </div>

                <div>
                  <div className="mb-2 h-4 w-28 rounded bg-white/6" />

                  <div className="h-14 rounded-2xl border border-white/10 bg-white/5.5" />
                </div>

                {/* CTA */}
                <div className="h-14 rounded-2xl bg-emerald-400/20" />
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-center">
                <div className="h-4 w-64 rounded bg-white/4" />
              </div>

              <div className="mt-8 border-t border-white/8 pt-5">
                <div className="mx-auto h-3 w-72 max-w-full rounded bg-white/[0.035]" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}

