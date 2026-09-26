
"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/src/components/AuthProvider";

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, isAuthenticated } = useAuth();

  const referralCode = searchParams.get("ref")?.trim() || "";

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/investment");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(
        trimmedEmail,
        password,
        trimmedName,
        referralCode,
      );
    } catch (err: unknown) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordLengthValid = password.length >= 8;
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#070b24] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -right-40 top-20 h-125 w-125 rounded-full bg-purple-600/15 blur-3xl" />

        <div className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_28%),linear-gradient(135deg,#070b24_0%,#0b1033_50%,#130d2c_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-4xl border border-white/10 bg-white/3 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
          {/* =========================================================
              LEFT BRANDING PANEL
          ========================================================== */}
          <section className="relative hidden min-h-175 overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
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

              {/* Main message */}
              <div className="max-w-lg">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  Start your investment journey
                </p>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                  Build your financial future with a{" "}
                  <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    smarter platform.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-white/55">
                  Create your account and access your investments, wallet,
                  transactions and account activity from one secure
                  dashboard.
                </p>
              </div>

              {/* Benefits */}
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
                      Secure account
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Your account information is protected during
                      authentication.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/4.5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                    <UserRound
                      className="h-5 w-5 text-cyan-300"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Personalized dashboard
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Manage your investment activity from one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="relative text-xs text-white/30">
              Create your account to continue to the investment platform.
            </p>
          </section>

          {/* =========================================================
              REGISTRATION PANEL
          ========================================================== */}
          <section className="flex items-center p-5 sm:p-8 lg:p-10 xl:p-14">
            <div className="mx-auto w-full max-w-md">
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
                  <p className="text-lg font-bold tracking-tight text-white">
                    Rich Dadie
                  </p>

                  <p className="text-xs text-white/45">
                    Investment Platform
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div>
                <p className="mb-3 text-sm font-medium text-emerald-300">
                  Create your account
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Join the platform
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/45">
                  Create your account to access your investment dashboard.
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

              {/* Registration form */}
              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit}
              >
                {/* Full name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Full name
                  </label>

                  <div className="group relative">
                    <UserRound
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-emerald-300"
                      aria-hidden="true"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/15 focus:border-emerald-400/50 focus:bg-white/8 focus:ring-4 focus:ring-emerald-400/10"
                    />
                  </div>
                </div>

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
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/15 focus:border-emerald-400/50 focus:bg-white/8 focus:ring-4 focus:ring-emerald-400/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Password
                  </label>

                  <div className="group relative">
                    <LockKeyhole
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-emerald-300"
                      aria-hidden="true"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/15 focus:border-emerald-400/50 focus:bg-white/8 focus:ring-4 focus:ring-emerald-400/10"
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

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Confirm password
                  </label>

                  <div className="group relative">
                    <LockKeyhole
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-emerald-300"
                      aria-hidden="true"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm your password"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/25 hover:border-white/15 focus:border-emerald-400/50 focus:bg-white/8 focus:ring-4 focus:ring-emerald-400/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous,
                        )
                      }
                      className="absolute right-0 top-0 flex h-14 w-12 items-center justify-center rounded-r-2xl text-white/30 transition-colors hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      title={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
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

                {/* Password requirements */}
                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Password requirements
                    </p>

                    {passwordLengthValid && passwordsMatch && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-300">
                        <Check
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        Ready
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        passwordLengthValid
                          ? "text-emerald-300"
                          : "text-white/35"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          passwordLengthValid
                            ? "bg-emerald-400/15"
                            : "bg-white/5"
                        }`}
                      >
                        {passwordLengthValid && (
                          <Check
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      At least 8 characters
                    </div>

                    <div
                      className={`flex items-center gap-2 text-xs ${
                        passwordsMatch
                          ? "text-emerald-300"
                          : "text-white/35"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          passwordsMatch
                            ? "bg-emerald-400/15"
                            : "bg-white/5"
                        }`}
                      >
                        {passwordsMatch && (
                          <Check
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      Passwords match
                    </div>
                  </div>
                </div>

                {/* Referral indicator */}
                {referralCode && (
                  <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-3">
                    <p className="text-xs font-medium text-cyan-300">
                      Referral code detected
                    </p>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {referralCode}
                    </p>
                  </div>
                )}

                {/* Register button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 px-5 text-sm font-bold text-[#06121a] shadow-[0_12px_35px_rgba(45,212,191,0.18)] transition-all hover:shadow-[0_16px_45px_rgba(45,212,191,0.28)] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#06121a]/25 border-t-[#06121a]" />

                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>

                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-white/40">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 border-t border-white/8 pt-5 text-center">
                <p className="text-[11px] leading-5 text-white/25">
                  By creating an account, you agree to the terms and
                  conditions of the platform.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

