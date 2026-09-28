
"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Request failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#070b24] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-40 top-20 h-125 w-125 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_28%),linear-gradient(135deg,#070b24_0%,#0b1033_50%,#130d2c_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-4xl border border-white/10 bg-white/3 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden min-h-175 overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative">
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/15 bg-white/10 shadow-[0_8px_30px_rgba(45,212,191,0.18)]">
                  <Image
                    src="/images/logo.png"
                    alt="REDIQ logo"
                    width={44}
                    height={44}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight text-white">
                    REDIQ
                  </p>
                  <p className="text-xs text-white/45">
                    Investment Platform
                  </p>
                </div>
              </div>

              <div className="max-w-lg">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  Account security
                </p>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                  Regain access to your{" "}
                  <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    financial dashboard.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-white/55">
                  Enter the email address connected to your account and weâ€™ll
                  help you reset your password securely.
                </p>
              </div>

              <div className="mt-10 max-w-lg space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/4.5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                    <ShieldCheck
                      className="h-5 w-5 text-emerald-300"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Secure password recovery
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      Follow the reset instructions sent to your email.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/4.5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                    <LockKeyhole
                      className="h-5 w-5 text-cyan-300"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Protect your account
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      Never share your password or reset link with anyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="relative text-xs text-white/30">
              Your account security is important to us.
            </p>
          </section>

          <section className="flex items-center p-5 sm:p-8 lg:p-10 xl:p-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/15 bg-white/10 shadow-[0_8px_30px_rgba(45,212,191,0.18)]">
                  <Image
                    src="/images/logo.png"
                    alt="REDIQ logo"
                    width={44}
                    height={44}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight text-white">
                    REDIQ
                  </p>
                  <p className="text-xs text-white/45">
                    Investment Platform
                  </p>
                </div>
              </div>

              {success ? (
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
                    <CheckCircle2
                      className="h-8 w-8 text-emerald-300"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-7 text-sm font-medium text-emerald-300">
                    Request received
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Check your email
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-white/50">
                    If an account exists for{" "}
                    <strong className="break-all font-semibold text-white/80">
                      {email.trim()}
                    </strong>
                    , a password reset link has been sent.
                  </p>

                  <p className="mt-3 text-xs leading-5 text-white/30">
                    If you do not see the email shortly, check your spam or
                    junk folder.
                  </p>

                  <Link
                    href="/login"
                    className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/20"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to login
                  </Link>
                </div>
              ) : (
                <>
                  <div>
                    <p className="mb-3 text-sm font-medium text-emerald-300">
                      Password recovery
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Forgot your password?
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Enter your email address and weâ€™ll send you a secure
                      password reset link.
                    </p>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3.5"
                    >
                      <p className="text-sm leading-5 text-red-300">
                        {error}
                      </p>
                    </div>
                  )}

                  <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-white/75"
                      >
                        Email address
                      </label>

                      <div className="group relative">
                        <Mail
                          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-emerald-300"
                          aria-hidden="true"
                        />

                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="Enter your email"
                          className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/15 focus:border-emerald-400/50 focus:bg-white/8 focus:ring-4 focus:ring-emerald-400/10"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 px-5 text-sm font-bold text-[#06121a] shadow-[0_12px_35px_rgba(45,212,191,0.18)] transition-all hover:shadow-[0_16px_45px_rgba(45,212,191,0.28)] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#06121a]/25 border-t-[#06121a]" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send reset link</span>
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Back to login
                    </Link>
                  </div>

                  <div className="mt-8 border-t border-white/8 pt-5 text-center">
                    <p className="text-[11px] leading-5 text-white/25">
                      For your security, we do not reveal whether an email
                      address is registered on the platform.
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


