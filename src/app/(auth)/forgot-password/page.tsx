

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
  KeyRound,
} from "lucide-react";

import { authApi } from "@/src/lib/api/auth";

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await authApi.forgotPassword(trimmedEmail);

      setSubmittedEmail(trimmedEmail);
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Request failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-[#050B18] text-white">

      {/* CINEMATIC BACKGROUND */}
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover object-center opacity-30"
      />

      {/* Dark background overlays */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#050B18]/75" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#050B18]/95 via-[#07101F]/90 to-[#101426]/85" />

      {/* REDIQ ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      {/* MAIN LAYOUT */}
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

        <div className="grid w-full max-w-215 overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1426]/95 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT — BRANDING PANEL */}
          <section className="relative hidden min-w-0 overflow-hidden border-r border-white/8 bg-linear-to-br from-[#131E32] via-[#101A2D] to-[#091324] p-6 lg:flex lg:flex-col lg:justify-between">

            {/* Ambient accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#E60033]/12 blur-[70px]"
            />

            <div className="relative">

              {/* REDIQ BRAND */}
              <Link
                href="/"
                className="inline-flex items-center gap-2.5"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#E60033] shadow-lg shadow-[#E60033]/20">
                  <Image
                    src="/images/logo.png"
                    alt="REDIQ logo"
                    fill
                    priority
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div className="leading-tight">
                  <p className="text-lg font-black tracking-tight text-white">
                    REDIQ
                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Investment Platform
                  </p>
                </div>
              </Link>

              {/* INTRODUCTION */}
              <div className="mt-9">

                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                  <KeyRound size={12} />
                  Account recovery
                </div>

                <h1 className="mt-4 text-[28px] font-black leading-[1.13] tracking-tight text-white">
                  Regain access to
                  <span className="block text-[#FF476B]">
                    your REDIQ account.
                  </span>
                </h1>

                <p className="mt-3 max-w-xs text-xs leading-5 text-white/50">
                  Forgotten your password? Request a reset
                  link using the email address associated
                  with your REDIQ account.
                </p>
              </div>

              {/* INFORMATION CARDS */}
              <div className="mt-6 space-y-2.5">

                {/* Recovery card */}
                <div className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.035] p-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <Mail size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white">
                      Email recovery
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/40">
                      Request instructions through your
                      registered email address.
                    </p>
                  </div>
                </div>

                {/* Security card */}
                <div className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.035] p-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <LockKeyhole size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white">
                      Protect your account
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/40">
                      Never share your password or
                      password reset link with anyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BRAND FOOTER */}
            <div className="relative mt-8 flex items-center gap-2 border-t border-white/8 pt-4">

              <ShieldCheck
                size={13}
                className="shrink-0 text-[#FF476B]"
              />

              <p className="text-[10px] leading-4 text-white/40">
                Keep your account credentials private.
              </p>
            </div>
          </section>

          {/* RIGHT — PASSWORD RECOVERY PANEL */}
          <section className="flex min-w-0 items-center px-4 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-9">

            <div className="mx-auto w-full max-w-87.5">

              {/* MOBILE BRAND */}
              <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">

                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5"
                >
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#E60033]">
                    <Image
                      src="/images/logo.png"
                      alt="REDIQ logo"
                      fill
                      priority
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>

                  <div className="leading-tight">
                    <p className="text-base font-black text-white">
                      REDIQ
                    </p>

                    <p className="text-[9px] text-white/40">
                      Investment Platform
                    </p>
                  </div>
                </Link>

                <Link
                  href="/"
                  aria-label="Back to homepage"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:text-white"
                >
                  <ArrowLeft size={15} />
                </Link>
              </div>

              {success ? (

                /* =====================================
                   SUCCESS STATE
                ====================================== */
                <div
                  aria-live="polite"
                  className="text-center"
                >

                  {/* Success icon */}
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                    <CheckCircle2
                      size={24}
                      className="text-emerald-300"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                    Request received
                  </p>

                  <h2 className="mt-2 text-[24px] font-black leading-tight tracking-tight text-white sm:text-[28px]">
                    Check your email
                  </h2>

                  <p className="mt-3 text-[11px] leading-5 text-white/55 sm:text-xs">
                    If an account exists for{" "}
                    <strong className="break-all font-semibold text-white/85">
                      {submittedEmail}
                    </strong>
                    , password reset instructions will be sent
                    to that address.
                  </p>

                  {/* Additional information */}
                  <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.035] px-3 py-3">

                    <div className="flex items-start gap-2.5 text-left">

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                        <Mail size={14} />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold text-white">
                          Cannot find the email?
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-white/45">
                          Check your spam or junk folder.
                          Delivery times may vary.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Back to login */}
                  <Link
                    href="/login"
                    className="group mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/15 transition hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B]"
                  >
                    <ArrowLeft
                      size={14}
                      className="transition-transform group-hover:-translate-x-0.5"
                    />

                    Back to login
                  </Link>

                  {/* Another request */}
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setError("");
                    }}
                    className="mt-3 text-[11px] font-semibold text-[#FF476B] transition hover:text-[#FF7895]"
                  >
                    Try another email address
                  </button>
                </div>

              ) : (

                /* =====================================
                   REQUEST FORM
                ====================================== */
                <>

                  {/* HEADING */}
                  <div>

                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                      <LockKeyhole size={12} />
                      Password recovery
                    </div>

                    <h2 className="mt-2 text-[23px] font-black leading-tight tracking-tight text-white sm:text-[27px]">
                      Forgot your password?
                    </h2>

                    <p className="mt-2 text-[11px] leading-5 text-white/45 sm:text-xs">
                      Enter your email address to request
                      a password reset link.
                    </p>
                  </div>

                  {/* ERROR MESSAGE */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5"
                    >
                      <p className="text-[11px] leading-5 text-red-300">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* FORM */}
                  <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-3.5"
                  >

                    {/* EMAIL */}
                    <div>

                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-[11px] font-semibold text-white/75"
                      >
                        Email address
                      </label>

                      <div className="group relative">

                        <Mail
                          size={15}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#FF476B]"
                        />

                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          autoCapitalize="none"
                          spellCheck={false}
                          required
                          disabled={loading}
                          value={email}
                          onChange={(event) =>
                            setEmail(event.target.value)
                          }
                          placeholder="Enter your email address"
                          className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* INFORMATION STRIP */}
                    <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/2.5 px-3 py-2.5">

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                        <ShieldCheck size={14} />
                      </div>

                      <p className="text-[10px] leading-4 text-white/45">
                        We do not confirm whether an email
                        address is registered with REDIQ.
                      </p>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/15 transition-all duration-300 hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1426] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                            aria-hidden="true"
                          />

                          Sending request...
                        </>
                      ) : (
                        <>
                          Send reset link

                          <ArrowRight
                            size={15}
                            aria-hidden="true"
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>

                  {/* BACK TO LOGIN */}
                  <div className="mt-5 text-center">

                    <Link
                      href="/login"
                      className="group inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF476B] transition hover:text-[#FF7895]"
                    >
                      <ArrowLeft
                        size={13}
                        className="transition-transform group-hover:-translate-x-0.5"
                      />

                      Back to login
                    </Link>
                  </div>

                  {/* FOOTER NOTICE */}
                  <div className="mt-5 border-t border-white/8 pt-3.5 text-center">

                    <p className="text-[10px] leading-4 text-white/35">
                      For your security, never share your
                      password or reset link with anyone.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}