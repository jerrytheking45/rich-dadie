
"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { useSearchParams } from "next/navigation";
import {
  FormEvent,
  Suspense,
  useRef,
  useState,
} from "react";

import { withdrawalPinApi } from "@/src/lib/api/withdrawalPin";

const PIN_LENGTH = 6;

type PINField = "pin" | "confirm";

function ResetWithdrawalPINContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [pin, setPin] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");

  const [showPIN, setShowPIN] = useState(false);
  const [showConfirmPIN, setShowConfirmPIN] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pinRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);
  const confirmPINRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);

  const getPINValue = (field: PINField): string => {
    return field === "pin" ? pin : confirmPIN;
  };

  const setPINValue = (
    field: PINField,
    value: string,
  ): void => {
    if (field === "pin") {
      setPin(value);
    } else {
      setConfirmPIN(value);
    }
  };

  const getRefs = (
    field: PINField,
  ): Array<HTMLInputElement | null> => {
    return field === "pin"
      ? pinRefs.current
      : confirmPINRefs.current;
  };

  const focusPINBox = (
    field: PINField,
    index: number,
  ): void => {
    const refs = getRefs(field);

    if (index >= 0 && index < PIN_LENGTH) {
      refs[index]?.focus();
      refs[index]?.select();
    }
  };

  const handlePINBoxChange = (
    field: PINField,
    index: number,
    value: string,
  ): void => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      return;
    }

    const currentValue = getPINValue(field);
    const values = currentValue
      .padEnd(PIN_LENGTH, "")
      .split("");

    values[index] = digits[digits.length - 1];

    const nextValue = values
      .map((digit) => digit || "")
      .join("")
      .slice(0, PIN_LENGTH);

    setPINValue(field, nextValue);
    setError("");

    if (index < PIN_LENGTH - 1) {
      focusPINBox(field, index + 1);
    }
  };

  const handlePINBoxKeyDown = (
    field: PINField,
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    const currentValue = getPINValue(field);

    if (event.key === "Backspace") {
      if (currentValue[index]) {
        const values = currentValue.split("");

        values[index] = "";

        setPINValue(
          field,
          values.join("").slice(0, PIN_LENGTH),
        );
        setError("");
        return;
      }

      if (index > 0) {
        const values = currentValue.split("");

        values[index - 1] = "";

        setPINValue(
          field,
          values.join("").slice(0, PIN_LENGTH),
        );

        focusPINBox(field, index - 1);
        setError("");
      }

      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusPINBox(field, index - 1);
      return;
    }

    if (
      event.key === "ArrowRight" &&
      index < PIN_LENGTH - 1
    ) {
      event.preventDefault();
      focusPINBox(field, index + 1);
    }
  };

  const handlePINPaste = (
    field: PINField,
    event: React.ClipboardEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH);

    if (!pastedDigits) {
      return;
    }

    setPINValue(field, pastedDigits);
    setError("");

    const focusIndex = Math.min(
      pastedDigits.length,
      PIN_LENGTH - 1,
    );

    focusPINBox(field, focusIndex);
  };

  const handlePINFocus = (
    field: PINField,
    index: number,
  ): void => {
    const currentValue = getPINValue(field);

    if (currentValue[index]) {
      return;
    }

    const firstEmptyIndex = currentValue.length;

    if (
      firstEmptyIndex >= 0 &&
      firstEmptyIndex < PIN_LENGTH &&
      index > firstEmptyIndex
    ) {
      focusPINBox(field, firstEmptyIndex);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This PIN reset link is invalid or incomplete. Please request a new reset link.",
      );
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setError(
        "Your wallet PIN must contain exactly 6 digits.",
      );
      return;
    }

    if (!/^\d{6}$/.test(confirmPIN)) {
      setError(
        "Please confirm your 6-digit wallet PIN.",
      );
      return;
    }

    if (pin !== confirmPIN) {
      setError(
        "The PIN confirmation does not match.",
      );
      return;
    }

    try {
      setSubmitting(true);

      await withdrawalPinApi.resetPIN({
        token,
        pin,
      });

      /*
       * Clear the PIN values immediately after a
       * successful reset so they are not retained
       * in component state unnecessarily.
       */
      setPin("");
      setConfirmPIN("");
      setSuccess(true);
    } catch (requestError: unknown) {
      let message =
        "Unable to reset your wallet PIN. The reset link may have expired or already been used.";

      if (
        requestError &&
        typeof requestError === "object" &&
        "response" in requestError
      ) {
        const response = (
          requestError as {
            response?: {
              data?: {
                message?: string;
                error?: string;
              };
            };
          }
        ).response;

        if (response?.data?.error) {
          message = response.data.error;
        } else if (response?.data?.message) {
          message = response.data.message;
        }
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderPINBoxes = (
    field: PINField,
    value: string,
    showValue: boolean,
    inputRefs: React.MutableRefObject<
      Array<HTMLInputElement | null>
    >,
    label: string,
  ) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label
            className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
          >
            {label}
          </label>

          <span className="text-[10px] font-medium text-slate-500">
            {value.length}/{PIN_LENGTH}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1.5 sm:gap-2.5">
          {Array.from(
            { length: PIN_LENGTH },
            (_, index) => {
              const digit = value[index] ?? "";

              return (
                <input
                  key={`${field}-${index}`}
                  ref={(element) => {
                    inputRefs.current[index] =
                      element;
                  }}
                  id={
                    index === 0
                      ? `withdrawal-reset-${field}`
                      : undefined
                  }
                  type={
                    showValue ? "text" : "password"
                  }
                  inputMode="numeric"
                  autoComplete={
                    index === 0
                      ? "one-time-code"
                      : "off"
                  }
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handlePINBoxChange(
                      field,
                      index,
                      event.target.value,
                    )
                  }
                  onKeyDown={(event) =>
                    handlePINBoxKeyDown(
                      field,
                      index,
                      event,
                    )
                  }
                  onPaste={(event) =>
                    handlePINPaste(field, event)
                  }
                  onFocus={() =>
                    handlePINFocus(field, index)
                  }
                  disabled={submitting}
                  autoFocus={
                    field === "pin" && index === 0
                  }
                  aria-label={`${label} digit ${index + 1}`}
                  className="h-14 min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#07101F] text-center text-xl font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:bg-[#0A1729] focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:text-2xl"
                />
              );
            },
          )}
        </div>

        <p className="text-[10px] leading-5 text-slate-500">
          {field === "pin"
            ? "Enter exactly 6 digits."
            : "Re-enter the same 6-digit PIN."}
        </p>
      </div>
    );
  };

  if (success) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050B18] px-4 py-10 text-white">
        <div className="pointer-events-none fixed right-0 top-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="pointer-events-none fixed bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative mx-auto flex min-h-[80vh] w-full max-w-md items-center justify-center">
          <section className="w-full rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-emerald-400/10 bg-emerald-400/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <div className="mt-5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                Security updated
              </p>

              <h1 className="mt-2 text-[21px] font-extrabold tracking-tight text-white">
                Wallet PIN reset successful
              </h1>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Your wallet PIN has been updated
                successfully. You can now return to your
                investment account and make withdrawals
                using your new PIN.
              </p>
            </div>

            <Link
              href="/investment/profile/withdraw"
              className="mt-7 flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-500 px-5 text-xs font-bold text-[#04100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
            >
              Return to withdrawals
            </Link>

            <p className="mt-5 text-center text-[10px] leading-5 text-slate-500">
              For your security, keep your wallet PIN
              private and never share it with anyone.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B18] px-4 py-8 text-white sm:py-10">
      {/* Ambient background */}
      <div className="pointer-events-none fixed right-0 top-0 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none fixed left-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-[85vh] w-full max-w-md items-center justify-center">
        <section className="w-full rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-2xl shadow-black/20 sm:p-7">
          {/* Header icon */}
<div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] border border-white/10   shadow-black/20">
  <Image
    src="/images/logo.png"
    alt="Rich Dadie"
    width={64}
    height={64}
    priority
    className="h-full w-full rounded-3xl object-cover"
  />
</div>

          {/* Heading */}
          <div className="mt-5 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-purple-300">
              Wallet security
            </p>

            <h1 className="mt-2 text-[21px] font-extrabold tracking-tight text-white">
              Reset wallet PIN
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-400">
              Create a new 6-digit PIN for securing your
              withdrawals.
            </p>
          </div>

          {/* Invalid token */}
          {!token && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/10 p-3.5 text-xs text-red-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <p className="leading-5">
                This reset link is invalid or incomplete.
                Please request a new wallet PIN reset
                link.
              </p>
            </div>
          )}

          {/* Error */}
          {error && token && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/10 p-3.5 text-xs text-red-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <p className="leading-5">{error}</p>
            </div>
          )}

          {token && (
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-6"
              noValidate
            >
              {/* New PIN */}
              <div className="rounded-[22px] border border-white/8 bg-[#091321]/80 p-4">
                {renderPINBoxes(
                  "pin",
                  pin,
                  showPIN,
                  pinRefs,
                  "New wallet PIN",
                )}

                <button
                  type="button"
                  onClick={() =>
                    setShowPIN(
                      (previous) => !previous,
                    )
                  }
                  disabled={submitting}
                  aria-label={
                    showPIN
                      ? "Hide PIN"
                      : "Show PIN"
                  }
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 transition hover:text-white disabled:opacity-50"
                >
                  {showPIN ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}

                  {showPIN
                    ? "Hide PIN"
                    : "Show PIN"}
                </button>
              </div>

              {/* Confirm PIN */}
              <div className="rounded-[22px] border border-white/8 bg-[#091321]/80 p-4">
                {renderPINBoxes(
                  "confirm",
                  confirmPIN,
                  showConfirmPIN,
                  confirmPINRefs,
                  "Confirm new PIN",
                )}

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPIN(
                      (previous) => !previous,
                    )
                  }
                  disabled={submitting}
                  aria-label={
                    showConfirmPIN
                      ? "Hide PIN"
                      : "Show PIN"
                  }
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 transition hover:text-white disabled:opacity-50"
                >
                  {showConfirmPIN ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}

                  {showConfirmPIN
                    ? "Hide PIN"
                    : "Show PIN"}
                </button>
              </div>

              {/* PIN match indicator */}
              {pin.length === PIN_LENGTH &&
                confirmPIN.length === PIN_LENGTH && (
                  <div
                    className={`flex items-center gap-2 rounded-2xl border p-3 ${
                      pin === confirmPIN
                        ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                        : "border-red-400/15 bg-red-400/10 text-red-300"
                    }`}
                  >
                    {pin === confirmPIN ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0" />
                    )}

                    <p className="text-[10px] font-semibold">
                      {pin === confirmPIN
                        ? "PINs match."
                        : "PINs do not match."}
                    </p>
                  </div>
                )}

              {/* Security information */}
              <div className="rounded-2xl border border-white/8 bg-[#07101F] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                  <div>
                    <p className="text-xs font-bold text-white">
                      Secure PIN reset
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-500">
                      Your PIN is securely protected. Never
                      share it with another person,
                      including anyone claiming to be
                      support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  submitting ||
                  !/^\d{6}$/.test(pin) ||
                  !/^\d{6}$/.test(confirmPIN)
                }
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-xs font-extrabold text-[#04100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04100B]/30 border-t-[#04100B]" />
                    Resetting PIN...
                  </>
                ) : (
                  <>
                    <LockKeyhole className="h-4 w-4" />
                    Reset wallet PIN
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/investment/profile/withdraw"
              className="text-[10px] font-semibold text-purple-300 transition hover:text-purple-200"
            >
              Back to withdrawals
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ResetWithdrawalPINPage() {
  return (
    <Suspense
      fallback={
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050B18] text-white">
          <div className="pointer-events-none fixed right-0 top-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="relative flex items-center gap-3 text-xs text-slate-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
            Loading secure reset...
          </div>
        </main>
      }
    >
      <ResetWithdrawalPINContent />
    </Suspense>
  );
}

