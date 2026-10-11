
//src/app/(auth)/verify/page.tsx



"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  MailCheck,
  RefreshCw,
  ShieldCheck,
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

const CODE_LENGTH = 6;

const createEmptyCode = (): string[] =>
  Array<string>(CODE_LENGTH).fill("");

export default function VerifyPage() {
  const [code, setCode] = useState<string[]>(createEmptyCode);

  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const router = useRouter();

  const { verify, resendVerification } = useAuth();

  const isComplete = code.every((digit) => /^\d$/.test(digit));

  /* ==========================================
     INITIALIZE VERIFICATION SESSION
  ========================================== */

  useEffect(() => {
    const storedEmail =
      localStorage.getItem("registration_email")?.trim() || "";

    if (!storedEmail) {
      router.replace("/login");
      return;
    }

    // Focus is a DOM interaction, not a React state update.
    inputRefs.current[0]?.focus();
  }, [router]);

  /* ==========================================
     INPUT FOCUS
  ========================================== */

  const focusInput = (index: number) => {
    if (index < 0 || index >= CODE_LENGTH) return;

    const input = inputRefs.current[index];

    input?.focus();
    input?.select();
  };

  /* ==========================================
     INSERT ONE OR MORE DIGITS
  ========================================== */

  const insertDigits = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, CODE_LENGTH);

    setError("");
    setResendMessage("");

    if (!digits) {
      setCode((previous) => {
        const next = [...previous];
        next[index] = "";
        return next;
      });

      return;
    }

    // Supports mobile OTP autofill containing all six digits.
    if (digits.length === CODE_LENGTH) {
      setCode(digits.split(""));
      focusInput(CODE_LENGTH - 1);
      return;
    }

    setCode((previous) => {
      const next = [...previous];

      digits.split("").forEach((digit, offset) => {
        const targetIndex = index + offset;

        if (targetIndex < CODE_LENGTH) {
          next[targetIndex] = digit;
        }
      });

      return next;
    });

    const nextIndex = Math.min(
      index + digits.length,
      CODE_LENGTH - 1
    );

    focusInput(nextIndex);
  };

  /* ==========================================
     INPUT CHANGE
  ========================================== */

  const handleChange = (index: number, value: string) => {
    insertDigits(index, value);
  };

  /* ==========================================
     KEYBOARD NAVIGATION
  ========================================== */

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      setError("");
      setResendMessage("");

      if (code[index]) {
        setCode((previous) => {
          const next = [...previous];
          next[index] = "";
          return next;
        });

        return;
      }

      if (index > 0) {
        setCode((previous) => {
          const next = [...previous];
          next[index - 1] = "";
          return next;
        });

        focusInput(index - 1);
      }

      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  /* ==========================================
     PASTE VERIFICATION CODE
  ========================================== */

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pastedDigits) return;

    setError("");
    setResendMessage("");

    // Allow a complete OTP to be pasted into any input.
    if (pastedDigits.length === CODE_LENGTH) {
      setCode(pastedDigits.split(""));
      focusInput(CODE_LENGTH - 1);
      return;
    }

    insertDigits(index, pastedDigits);
  };

  /* ==========================================
     VERIFY EMAIL
  ========================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading || resending || success) return;

    setError("");
    setResendMessage("");

    if (!isComplete) {
      setError(
        "Please enter the complete 6-digit verification code."
      );

      const firstEmpty = code.findIndex((digit) => !digit);

      focusInput(firstEmpty >= 0 ? firstEmpty : 0);
      return;
    }

    // Confirm that the registration session still exists.
    const storedEmail =
      localStorage.getItem("registration_email")?.trim() || "";

    if (!storedEmail) {
      setError(
        "Your registration session has expired. Please register again."
      );

      router.replace("/register");
      return;
    }

    setLoading(true);

    try {
      await verify(code.join(""));

      localStorage.removeItem("registration_email");

      // Clear the verification code after success.
      setCode(createEmptyCode());
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     RESEND VERIFICATION CODE
  ========================================== */

  const handleResend = async () => {
    if (resending || loading || success) return;

    setError("");
    setResendMessage("");

    const storedEmail =
      localStorage.getItem("registration_email")?.trim() || "";

    if (!storedEmail) {
      setError(
        "Your registration session has expired. Please register again."
      );

      router.replace("/register");
      return;
    }

    setResending(true);

    try {
      await resendVerification(storedEmail);

      // Reset previous OTP after requesting a new code.
      setCode(createEmptyCode());

      setResendMessage(
        "If the address is eligible, a new verification code will be sent."
      );

      focusInput(0);
    } catch (err: unknown) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to resend the verification code."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-[#050B18] px-3 py-6 text-white sm:px-6 sm:py-8">

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

      {/* Ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[80px]"
      />

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-105">

        <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1426]/95 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl">

          {/* TOP BRAND */}
          <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3.5 sm:px-6">

            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#E60033] shadow-lg shadow-[#E60033]/15">

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
                <p className="text-base font-black tracking-tight text-white">
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
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>
          </div>

          {/* MAIN CONTENT */}
          <div className="px-4 py-5 sm:px-6 sm:py-6">

            {success ? (

              /* =====================================
                 SUCCESS STATE
              ====================================== */

              <div aria-live="polite" className="text-center">

                {/* Success icon */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                  <CheckCircle2
                    size={25}
                    className="text-emerald-300"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                  Verification complete
                </p>

                <h1 className="mt-2 text-[24px] font-black leading-tight tracking-tight text-white sm:text-[28px]">
                  Email verified
                </h1>

                <p className="mx-auto mt-3 max-w-xs text-[11px] leading-5 text-white/50 sm:text-xs">
                  Your email address has been successfully
                  verified. You can now sign in to your
                  REDIQ account.
                </p>

                {/* Success information */}
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.035] p-3 text-left">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 size={14} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-white">
                      Ready to continue
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/45">
                      Use your registered email and password
                      to access the REDIQ dashboard.
                    </p>
                  </div>
                </div>

                {/* Login button */}
                <Link
                  href="/login"
                  className="group mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/15 transition hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B]"
                >
                  Continue to login

                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

            ) : (

              /* =====================================
                 VERIFICATION FORM
              ====================================== */

              <>

                {/* HEADER */}
                <div className="text-center">

                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                    <MailCheck
                      size={21}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
                    Account verification
                  </p>

                  <h1 className="mt-1.5 text-[23px] font-black leading-tight tracking-tight text-white sm:text-[27px]">
                    Verify your email
                  </h1>

                  <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-white/45 sm:text-xs">
                    Enter the six-digit verification code
                    sent to your email address.
                  </p>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                  <div
                    id="verification-error"
                    role="alert"
                    aria-live="polite"
                    className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5"
                  >
                    <p className="text-[11px] leading-5 text-red-300">
                      {error}
                    </p>
                  </div>
                )}

                {/* RESEND STATUS */}
                {resendMessage && (
                  <div
                    role="status"
                    className="mt-4 rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-3 py-2.5"
                  >
                    <p className="text-[11px] leading-5 text-emerald-300">
                      {resendMessage}
                    </p>
                  </div>
                )}

                {/* OTP FORM */}
                <form
                  className="mt-5"
                  onSubmit={handleSubmit}
                >

                  {/* SIX-DIGIT INPUTS */}
                  <div
                    role="group"
                    aria-label="Six-digit email verification code"
                    className="flex w-full justify-center gap-1.5 min-[380px]:gap-2 sm:gap-2.5"
                  >
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                          index === 0
                            ? "one-time-code"
                            : "off"
                        }
                        enterKeyHint={
                          index === CODE_LENGTH - 1
                            ? "done"
                            : "next"
                        }
                        value={digit}
                        maxLength={CODE_LENGTH}
                        aria-label={`Verification digit ${index + 1}`}
                        aria-invalid={Boolean(error)}
                        aria-describedby={
                          error
                            ? "verification-error"
                            : undefined
                        }
                        onChange={(event) =>
                          handleChange(
                            index,
                            event.target.value
                          )
                        }
                        onKeyDown={(event) =>
                          handleKeyDown(index, event)
                        }
                        onPaste={(event) =>
                          handlePaste(index, event)
                        }
                        disabled={loading || resending}
                        className={[
                          "h-11 min-w-0 flex-1 rounded-lg border text-center text-base font-black",
                          "outline-none transition-all duration-200",
                          "sm:h-12 sm:rounded-xl sm:text-lg",
                          digit
                            ? "border-[#E60033]/35 bg-[#E60033]/10 text-white"
                            : "border-white/10 bg-[#07101F] text-white",
                          "focus:border-[#E60033]/60 focus:bg-[#101D30] focus:ring-2 focus:ring-[#E60033]/10",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                        ].join(" ")}
                      />
                    ))}
                  </div>

                  <p className="mt-2.5 text-center text-[10px] text-white/35">
                    Enter or paste your verification code
                  </p>

                  {/* VERIFY BUTTON */}
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      resending ||
                      !isComplete
                    }
                    className="group mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/15 transition-all duration-300 hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#E60033]"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin"
                          aria-hidden="true"
                        />

                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify email

                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* RESEND VERIFICATION */}
                <div className="mt-5 border-t border-white/8 pt-4 text-center">

                  <p className="text-[11px] text-white/40">
                    Didn&apos;t receive the code?
                  </p>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || loading}
                    className="mt-2 inline-flex min-h-8 items-center justify-center gap-1.5 text-[11px] font-bold text-[#FF476B] transition hover:text-[#FF7895] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw
                      size={13}
                      className={
                        resending ? "animate-spin" : ""
                      }
                      aria-hidden="true"
                    />

                    {resending
                      ? "Sending code..."
                      : "Resend verification code"}
                  </button>
                </div>

                {/* BACK TO REGISTRATION */}
                <div className="mt-3 text-center">

                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/40 transition hover:text-white"
                  >
                    <ArrowLeft
                      size={12}
                      className="transition-transform group-hover:-translate-x-0.5"
                    />

                    Back to registration
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* CARD FOOTER */}
          <div className="flex items-center justify-center gap-2 border-t border-white/8 bg-white/2.5 px-4 py-3">

            <ShieldCheck
              size={13}
              className="shrink-0 text-[#FF476B]"
            />

            <p className="text-center text-[10px] leading-4 text-white/40">
              Keep your verification code private.
              Never share it with anyone.
            </p>
          </div>
        </div>

        {/* BOTTOM BRAND LINE */}
        <div className="mt-4 flex items-center justify-center gap-1.5">

          <KeyRound
            size={12}
            className="text-[#FF476B]/70"
          />

          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/25">
            REDIQ Investment
          </p>
        </div>
      </div>
    </main>
  );
}