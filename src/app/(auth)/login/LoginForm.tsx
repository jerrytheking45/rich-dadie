
"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/src/components/AuthProvider";

interface ApiError {
  response?: {
    data?: {
      code?: string;
      error?: string;
    };
  };
  message?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = searchParams.get("redirect") || undefined;

  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const roleDefaultPaths: Record<string, string> = {
      employee: "/investment",
      admin: "/admin",
      superadmin: "/superadmin",
    };

    const defaultPath = roleDefaultPaths[user.role] || "/investment";
    const targetPath = redirectPath || defaultPath;

    router.replace(targetPath);
  }, [isAuthenticated, user, redirectPath, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password, redirectPath);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const code = apiError.response?.data?.code;

      if (code === "INVALID_CREDENTIALS") {
        setError("No existing account found with the credentials.");
        return;
      }

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
          {/* Brand / Information panel */}
          <section className="relative hidden min-h-160 overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative">
              {/* Desktop logo */}
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
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Secure investment dashboard
                </p>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                  Manage your money with a{" "}
                  <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    smarter interface.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-white/55">
                  Access your investments, wallet, transactions and account
                  activity from one secure financial dashboard.
                </p>
              </div>

              {/* Feature cards */}
              <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/4.5 p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10">
                    <ShieldCheck
                      className="h-5 w-5 text-emerald-300"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Secure access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Protected account authentication
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/4.5 p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                    <ShieldCheck
                      className="h-5 w-5 text-cyan-300"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    One dashboard
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Wallet, investments and activity
                  </p>
                </div>
              </div>
            </div>

            <p className="relative text-xs text-white/30">
              Your account information is protected during authentication.
            </p>
          </section>

          {/* Login panel */}
          <section className="flex items-center p-5 sm:p-8 lg:p-10 xl:p-14">
            <div className="mx-auto w-full max-w-md">
              {/* Mobile logo */}
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

              {/* Heading */}
              <div>
                <p className="mb-3 text-sm font-medium text-emerald-300">
                  Welcome back
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Sign in to your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/45">
                  Enter your credentials to continue to your investment
                  dashboard.
                </p>
              </div>

              {/* Error */}
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

              {/* Login form */}
              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit}
              >
                {/* Email */}
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
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5.5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/15 focus:border-emerald-400/50 focus:bg-white/7.5 focus:ring-4 focus:ring-emerald-400/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-white/75"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="group relative">
                    <LockKeyhole
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-emerald-300"
                      aria-hidden="true"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5.5 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/15 focus:border-emerald-400/50 focus:bg-white/7.5 focus:ring-4 focus:ring-emerald-400/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      className="absolute right-0 top-0 flex h-14 w-12 items-center justify-center rounded-r-2xl text-white/30 transition-colors hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      title={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <Eye
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Security indicator */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                    <ShieldCheck
                      className="h-4 w-4 text-emerald-300"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white/70">
                      Secure authentication
                    </p>

                    <p className="mt-0.5 text-[11px] text-white/30">
                      Your credentials are transmitted securely.
                    </p>
                  </div>

                  <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 px-5 text-sm font-bold text-[#06121a] shadow-[0_12px_35px_rgba(45,212,191,0.18)] transition-all hover:shadow-[0_16px_45px_rgba(45,212,191,0.28)] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#06121a]/25 border-t-[#06121a]" />

                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>

                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Register */}
              <div className="mt-8 text-center">
                <p className="text-sm text-white/40">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 border-t border-white/8 pt-5 text-center">
                <p className="text-[11px] leading-5 text-white/25">
                  By continuing, you agree to the terms and conditions of the
                  platform.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


