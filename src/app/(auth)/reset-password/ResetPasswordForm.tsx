
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
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
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

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token")?.trim() || "";

  useEffect(() => {
    if (!token && !success) {
      router.replace("/login");
    }
  }, [token, success, router]);

  const passwordLengthValid = password.length >= 8;

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading || success) return;

    setError("");

    if (!passwordLengthValid) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError(
        "This reset link is invalid. Please request a new one."
      );
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword(token, password);

      // Clear sensitive fields after a successful reset.
      setPassword("");
      setConfirmPassword("");

      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Password reset failed. Please try again."
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

      {/* Dark overlays */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#050B18]/75" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#050B18]/95 via-[#07101F]/90 to-[#101426]/85" />

      {/* Ambient brand effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

        <div className="grid w-full max-w-215 overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1426]/95 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT — BRAND PANEL */}
          <section className="relative hidden min-w-0 overflow-hidden border-r border-white/8 bg-linear-to-br from-[#131E32] via-[#101A2D] to-[#091324] p-6 lg:flex lg:flex-col lg:justify-between">

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#E60033]/10 blur-[70px]"
            />

            <div className="relative">

              {/* REDIQ LOGO */}
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

              {/* LEFT PANEL MESSAGE */}
              <div className="mt-9">

                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                  {success ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <KeyRound size={12} />
                  )}

                  {success
                    ? "Password updated"
                    : "Account recovery"}
                </div>

                <h1 className="mt-4 text-[28px] font-black leading-[1.13] tracking-tight text-white">
                  {success ? (
                    <>
                      Your account is ready
                      <span className="block text-[#FF476B]">
                        for a fresh start.
                      </span>
                    </>
                  ) : (
                    <>
                      Create a new password.
                      <span className="block text-[#FF476B]">
                        Get back to REDIQ.
                      </span>
                    </>
                  )}
                </h1>

                <p className="mt-3 max-w-xs text-xs leading-5 text-white/50">
                  {success
                    ? "Your password has been updated. You can now return to the login page and access your REDIQ account."
                    : "Choose a new password for your account. Once the reset is completed, you can sign in using your updated credentials."}
                </p>
              </div>

              {/* SECURITY FEATURES */}
              <div className="mt-6 space-y-2.5">

                <div className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.035] p-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <ShieldCheck size={15} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-white">
                      {success
                        ? "Password change completed"
                        : "Password recovery"}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/40">
                      {success
                        ? "Your password reset request was completed successfully."
                        : "Your reset link is used to authorize this password change."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.035] p-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <LockKeyhole size={15} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-white">
                      Protect your account
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/40">
                      Keep your password private and avoid
                      reusing it across other accounts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT FOOTER */}
            <div className="relative mt-8 flex items-center gap-2 border-t border-white/8 pt-4">

              <ShieldCheck
                size={13}
                className="shrink-0 text-[#FF476B]"
              />

              <p className="text-[10px] leading-4 text-white/40">
                Never share your reset link with anyone.
              </p>
            </div>
          </section>

          {/* RIGHT — RESET PASSWORD PANEL */}
          <section className="flex min-w-0 items-center px-4 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-9">

            <div className="mx-auto w-full max-w-87.5">

              {/* MOBILE LOGO */}
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:text-white"
                >
                  <ArrowLeft size={15} />
                </Link>
              </div>

              {success ? (

                /* SUCCESS STATE */
                <div
                  aria-live="polite"
                  className="text-center"
                >

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">

                    <CheckCircle2
                      size={25}
                      className="text-emerald-300"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                    Password updated
                  </p>

                  <h2 className="mt-2 text-[24px] font-black leading-tight tracking-tight text-white sm:text-[28px]">
                    Reset successful
                  </h2>

                  <p className="mt-3 text-[11px] leading-5 text-white/55 sm:text-xs">
                    Your password has been changed successfully.
                    You can now sign in to REDIQ using your
                    new password.
                  </p>

                  {/* SUCCESS DETAILS */}
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.035] p-3 text-left">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-white">
                        You&apos;re ready to sign in
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-white/45">
                        Use your updated password on the
                        REDIQ login page.
                      </p>
                    </div>
                  </div>

                  {/* LOGIN BUTTON */}
                  <Link
                    href="/login"
                    className="group mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/15 transition hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B]"
                  >
                    Go to login

                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

              ) : (

                /* RESET PASSWORD FORM */
                <>

                  {/* HEADING */}
                  <div>

                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                      <LockKeyhole size={12} />
                      Password recovery
                    </div>

                    <h2 className="mt-2 text-[23px] font-black leading-tight tracking-tight text-white sm:text-[27px]">
                      Reset your password
                    </h2>

                    <p className="mt-2 text-[11px] leading-5 text-white/45 sm:text-xs">
                      Enter and confirm your new
                      REDIQ account password below.
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

                    {/* NEW PASSWORD */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-1.5 block text-[11px] font-semibold text-white/75"
                      >
                        New password
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
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          autoComplete="new-password"
                          required
                          minLength={8}
                          disabled={loading || !token}
                          value={password}
                          onChange={(event) =>
                            setPassword(event.target.value)
                          }
                          placeholder="Enter your new password"
                          className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-9 pr-10 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            setShowPassword(
                              (previous) => !previous
                            )
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
                            <EyeOff
                              size={16}
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye
                              size={16}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="mb-1.5 block text-[11px] font-semibold text-white/75"
                      >
                        Confirm new password
                      </label>

                      <div className="group relative">

                        <LockKeyhole
                          size={15}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#FF476B]"
                        />

                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          autoComplete="new-password"
                          required
                          minLength={8}
                          disabled={loading || !token}
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          placeholder="Confirm your new password"
                          className="h-10 w-full rounded-xl border border-white/10 bg-[#07101F] pl-9 pr-10 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                              ? "Hide confirmation password"
                              : "Show confirmation password"
                          }
                          aria-pressed={showConfirmPassword}
                          className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-r-xl text-white/40 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 disabled:opacity-50"
                        >
                          {showConfirmPassword ? (
                            <EyeOff
                              size={16}
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye
                              size={16}
                              aria-hidden="true"
                            />
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

                        {passwordLengthValid &&
                          passwordsMatch && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                              <Check size={12} />
                              Ready
                            </span>
                          )}
                      </div>

                      <div className="mt-2 grid gap-2 sm:grid-cols-2">

                        {/* Length requirement */}
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
                              <Check
                                size={10}
                                aria-hidden="true"
                              />
                            )}
                          </span>

                          At least 8 characters
                        </div>

                        {/* Match requirement */}
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
                              <Check
                                size={10}
                                aria-hidden="true"
                              />
                            )}
                          </span>

                          Passwords match
                        </div>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                      type="submit"
                      disabled={loading || !token}
                      className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/15 transition-all duration-300 hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1426] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                            aria-hidden="true"
                          />

                          Resetting password...
                        </>
                      ) : (
                        <>
                          Reset password

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

                  {/* SECURITY NOTICE */}
                  <div className="mt-5 border-t border-white/8 pt-3.5 text-center">

                    <p className="text-[10px] leading-4 text-white/35">
                      Never share your password or
                      password reset link with anyone.
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