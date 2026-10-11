
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
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Wallet,
  BarChart3,
  CheckCircle2,
  Loader2,
  ArrowLeft,
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

  const requestedRedirect = searchParams.get("redirect");

  // Accept only local application paths.
  const redirectPath =
    requestedRedirect &&
    requestedRedirect.startsWith("/") &&
    !requestedRedirect.startsWith("//") &&
    !requestedRedirect.includes("\\")
      ? requestedRedirect
      : undefined;

  const { login, isAuthenticated, user } = useAuth();

  /* AUTHENTICATED USER REDIRECT */
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const roleDefaultPaths: Record<string, string> = {
      employee: "/investment",
      admin: "/admin",
      superadmin: "/superadmin",
    };

    const defaultPath =
      roleDefaultPaths[user.role] || "/investment";

    router.replace(redirectPath || defaultPath);
  }, [isAuthenticated, user, redirectPath, router]);

  /* LOGIN SUBMISSION */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(
        email.trim(),
        password,
        redirectPath
      );
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const code = apiError.response?.data?.code;

      if (code === "INVALID_CREDENTIALS") {
        setError("Invalid email or password.");
        return;
      }

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Login failed. Please try again."
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
        className="pointer-events-none -z-20 object-cover object-center opacity-25"
      />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#050B18]/75" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#050B18]/95 via-[#07101F]/90 to-[#101426]/85" />

      {/* REDIQ ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-[#E60033]/10 blur-[90px]"
      />

      {/* MAIN LAYOUT */}
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

        <div className="grid w-full max-w-215 overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1426]/95 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT — BRAND PANEL */}
          <section className="relative hidden min-w-0 overflow-hidden border-r border-white/8 bg-linear-to-br from-[#131E32] via-[#101A2D] to-[#091324] p-6 lg:flex lg:flex-col lg:justify-between">

            {/* Decorative glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#E60033]/12 blur-[65px]"
            />

            <div className="relative">

              {/* Brand */}
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

              {/* Intro */}
              <div className="mt-9">

                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                  <ShieldCheck size={12} />
                  Your investment workspace
                </div>

                <h1 className="mt-4 text-[28px] font-black leading-[1.13] tracking-tight text-white">
                  Your financial journey,
                  <span className="block text-[#FF476B]">
                    one platform.
                  </span>
                </h1>

                <p className="mt-3 max-w-xs text-xs leading-5 text-white/50">
                  Access your investments, wallet,
                  transactions and account activity
                  from your REDIQ dashboard.
                </p>
              </div>

              {/* FEATURE CARDS */}
              <div className="mt-6 grid grid-cols-2 gap-2.5">

                <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <Wallet size={15} />
                  </div>

                  <p className="mt-2.5 text-[11px] font-bold text-white">
                    Your wallet
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-white/40">
                    View your account activity
                  </p>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <BarChart3 size={15} />
                  </div>

                  <p className="mt-2.5 text-[11px] font-bold text-white">
                    Investments
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-white/40">
                    Track plans and portfolio
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom brand information */}
            <div className="relative mt-8 flex items-center gap-2 border-t border-white/8 pt-4">

              <CheckCircle2
                size={13}
                className="shrink-0 text-[#FF476B]"
              />

              <p className="text-[10px] text-white/40">
                Manage your REDIQ account in one place.
              </p>
            </div>
          </section>

          {/* RIGHT — LOGIN FORM */}
          <section className="flex min-w-0 items-center px-4 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-8">

            <div className="mx-auto w-full max-w-87.5">

              {/* Mobile brand */}
              <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">

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
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:text-white"
                >
                  <ArrowLeft size={15} />
                </Link>
              </div>

              {/* FORM HEADING */}
              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                  Welcome back
                </p>

                <h2 className="mt-2 text-[23px] font-black leading-tight tracking-tight text-white sm:text-[27px]">
                  Sign in to REDIQ
                </h2>

                <p className="mt-2 text-[11px] leading-5 text-white/45 sm:text-xs">
                  Enter your credentials to access your
                  investment dashboard.
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

              {/* LOGIN FORM */}
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

                {/* PASSWORD */}
                <div>

                  <div className="mb-1.5 flex items-center justify-between gap-2">

                    <label
                      htmlFor="password"
                      className="text-[11px] font-semibold text-white/75"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-[10px] font-semibold text-[#FF476B] transition hover:text-[#FF7895]"
                    >
                      Forgot password?
                    </Link>
                  </div>

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
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-9 pr-10 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    {/* Password visibility */}
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

                {/* SECURITY INFORMATION */}
                <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/2.5 px-3 py-2.5">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <ShieldCheck size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-white/70">
                      Account authentication
                    </p>

                    <p className="mt-0.5 text-[9px] leading-4 text-white/40">
                      Sign in using your REDIQ credentials.
                    </p>
                  </div>
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* REGISTER */}
              <div className="mt-5 text-center">

                <p className="text-[11px] text-white/45">
                  Don&apos;t have an account?{" "}

                  <Link
                    href="/register"
                    className="font-bold text-[#FF476B] transition hover:text-[#FF7895]"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              {/* TERMS */}
              <div className="mt-5 border-t border-white/8 pt-3.5 text-center">

                <p className="text-[10px] leading-4 text-white/35">
                  By continuing, you agree to the{" "}

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