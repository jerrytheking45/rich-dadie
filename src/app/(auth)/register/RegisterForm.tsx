
"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowRight,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  Gift,
  Loader2,
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, isAuthenticated } = useAuth();

  // Preserve referral registration.
  const referralCode = searchParams.get("ref")?.trim() || "";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/investment");
    }
  }, [isAuthenticated, router]);

  const passwordLengthValid = password.length >= 8;

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

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

    if (!passwordLengthValid) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(
        trimmedEmail,
        password,
        trimmedName,
        referralCode
      );
    } catch (err: unknown) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Registration failed. Please try again."
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

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#050B18]/75" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#050B18]/95 via-[#07101F]/90 to-[#101426]/85" />

      {/* Ambient red lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center px-3 py-4 sm:px-6 sm:py-6 lg:px-8">

        <div className="grid w-full max-w-220 overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1426]/95 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT BRANDING PANEL */}
          <section className="relative hidden min-w-0 overflow-hidden border-r border-white/8 bg-linear-to-br from-[#131E32] via-[#101A2D] to-[#091324] p-6 lg:flex lg:flex-col lg:justify-between">

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#E60033]/10 blur-[70px]"
            />

            <div className="relative">

              {/* LOGO */}
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

              {/* BRAND MESSAGE */}
              <div className="mt-9">

                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                  <UserRound size={12} />
                  Start your journey
                </div>

                <h1 className="mt-4 text-[28px] font-black leading-[1.13] tracking-tight text-white">
                  Your next financial chapter
                  <span className="block text-[#FF476B]">
                    starts here.
                  </span>
                </h1>

                <p className="mt-3 max-w-xs text-xs leading-5 text-white/50">
                  Join REDIQ to explore investment plans,
                  access your wallet and monitor your
                  investment activity in one place.
                </p>
              </div>

              {/* FEATURES */}
              <div className="mt-6 grid grid-cols-2 gap-2.5">

                <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <ShieldCheck size={15} />
                  </div>

                  <p className="mt-2.5 text-[11px] font-bold text-white">
                    Your account
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-white/40">
                    Dedicated account workflows
                  </p>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <Wallet size={15} />
                  </div>

                  <p className="mt-2.5 text-[11px] font-bold text-white">
                    One dashboard
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-white/40">
                    Wallet, plans and activity
                  </p>
                </div>
              </div>
            </div>

            {/* BOTTOM BRAND MESSAGE */}
            <div className="relative mt-8 flex items-center gap-2 border-t border-white/8 pt-4">

              <Users
                size={13}
                className="shrink-0 text-[#FF476B]"
              />

              <p className="text-[10px] leading-4 text-white/40">
                Discover REDIQ investment opportunities.
              </p>
            </div>
          </section>

          {/* RIGHT — REGISTRATION PANEL */}
          <section className="flex min-w-0 items-center px-4 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-8">

            <div className="mx-auto w-full max-w-87.5">

              {/* MOBILE LOGO */}
              <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">

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

              {/* FORM HEADING */}
              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                  Create your account
                </p>

                <h2 className="mt-1.5 text-[23px] font-black leading-tight tracking-tight text-white sm:text-[27px]">
                  Join REDIQ
                </h2>

                <p className="mt-1.5 text-[11px] leading-5 text-white/45 sm:text-xs">
                  Register to access your investment dashboard.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5"
                >
                  <p className="text-[11px] leading-5 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {/* REGISTRATION FORM */}
              <form
                onSubmit={handleSubmit}
                className="mt-4 space-y-3"
              >

                {/* FULL NAME */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-[11px] font-semibold text-white/75"
                  >
                    Full name
                  </label>

                  <div className="group relative">

                    <UserRound
                      size={15}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#FF476B]"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      disabled={loading}
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:opacity-60"
                    />
                  </div>
                </div>

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
                      placeholder="Enter your email"
                      className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[11px] font-semibold text-white/75"
                  >
                    Password
                  </label>

                  <div className="group relative">

                    <LockKeyhole
                      size={15}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#FF476B]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      required
                      disabled={loading}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Create a password"
                      className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-9 pr-10 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-r-xl text-white/40 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff size={16} aria-hidden="true" />
                      ) : (
                        <Eye size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-[11px] font-semibold text-white/75"
                  >
                    Confirm password
                  </label>

                  <div className="group relative">

                    <LockKeyhole
                      size={15}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#FF476B]"
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
                      minLength={8}
                      required
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm your password"
                      className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-9 pr-10 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      aria-pressed={showConfirmPassword}
                      className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-r-xl text-white/40 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 disabled:opacity-50"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} aria-hidden="true" />
                      ) : (
                        <Eye size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* PASSWORD REQUIREMENTS */}
                <div className="rounded-xl border border-white/8 bg-white/2.5 px-3 py-2.5">

                  <div className="flex items-center justify-between gap-2">

                    <p className="text-[10px] font-bold text-white/60">
                      Password requirements
                    </p>

                    {passwordLengthValid && passwordsMatch && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                        <Check size={12} />
                        Ready
                      </span>
                    )}
                  </div>

                  <div className="mt-2 grid gap-2 sm:grid-cols-2">

                    {/* Minimum length */}
                    <div
                      className={`flex items-center gap-1.5 text-[10px] ${
                        passwordLengthValid
                          ? "text-emerald-300"
                          : "text-white/40"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          passwordLengthValid
                            ? "bg-emerald-400/15"
                            : "bg-white/5"
                        }`}
                      >
                        {passwordLengthValid && (
                          <Check size={10} />
                        )}
                      </span>

                      At least 8 characters
                    </div>

                    {/* Password confirmation */}
                    <div
                      className={`flex items-center gap-1.5 text-[10px] ${
                        passwordsMatch
                          ? "text-emerald-300"
                          : "text-white/40"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          passwordsMatch
                            ? "bg-emerald-400/15"
                            : "bg-white/5"
                        }`}
                      >
                        {passwordsMatch && (
                          <Check size={10} />
                        )}
                      </span>

                      Passwords match
                    </div>
                  </div>
                </div>

                {/* REFERRAL CODE */}
                {referralCode && (
                  <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-[#E60033]/20 bg-[#E60033]/5 px-3 py-2.5">

                    <Gift
                      size={15}
                      className="mt-0.5 shrink-0 text-[#FF476B]"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#FF476B]">
                        Referral code detected
                      </p>

                      <p className="mt-0.5 break-all text-[10px] text-white/55">
                        {referralCode}
                      </p>
                    </div>
                  </div>
                )}

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

                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account

                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* LOGIN LINK */}
              <div className="mt-4 text-center">

                <p className="text-[11px] text-white/45">
                  Already have an account?{" "}

                  <Link
                    href="/login"
                    className="font-bold text-[#FF476B] transition hover:text-[#FF7895]"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* TERMS */}
              <div className="mt-4 border-t border-white/8 pt-3 text-center">

                <p className="text-[10px] leading-4 text-white/35">
                  By creating an account, you agree to the{" "}

                  <Link
                    href="/terms"
                    className="font-semibold text-[#FF476B] transition hover:text-[#FF7895]"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  of REDIQ.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}