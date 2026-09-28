
// src/components/withdraw/WithdrawalPINManager.tsx

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";

type PINMode = "set" | "change";

interface WithdrawalPINManagerProps {
  mode: PINMode;
  open: boolean;
  submitting?: boolean;
  error?: string;
  forgotSuccess?: boolean;
  onClose: () => void;
  onSetPIN: (pin: string) => Promise<void>;
  onChangePIN: (
    currentPIN: string,
    newPIN: string,
  ) => Promise<void>;
  onForgotPIN: () => Promise<void>;
}

const PIN_LENGTH = 6;

function isValidPIN(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

interface PINInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  show: boolean;
  onToggleShow: () => void;
  autoFocus?: boolean;
}

function PINInput({
  id,
  label,
  value,
  onChange,
  disabled,
  show,
  onToggleShow,
  autoFocus = false,
}: PINInputProps) {
  const inputRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);

  const focusBox = (index: number): void => {
    if (
      index >= 0 &&
      index < PIN_LENGTH
    ) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  const handleChange = (
    index: number,
    rawValue: string,
  ): void => {
    const digits = rawValue.replace(
      /\D/g,
      "",
    );

    if (!digits) {
      const nextValue =
        value.slice(0, index) +
        value.slice(index + 1);

      onChange(
        nextValue.slice(0, PIN_LENGTH),
      );

      return;
    }

    const startIndex = Math.min(
      index,
      value.length,
    );

    const insertedDigits = digits.slice(
      0,
      PIN_LENGTH - startIndex,
    );

    const nextValue =
      value.slice(0, startIndex) +
      insertedDigits +
      value.slice(
        startIndex +
          insertedDigits.length,
      );

    const sanitizedValue = nextValue
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH);

    onChange(sanitizedValue);

    const nextIndex = Math.min(
      startIndex +
        insertedDigits.length,
      PIN_LENGTH - 1,
    );

    focusBox(nextIndex);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === "Backspace") {
      event.preventDefault();

      if (value[index]) {
        const nextValue =
          value.slice(0, index) +
          value.slice(index + 1);

        onChange(
          nextValue.slice(0, PIN_LENGTH),
        );

        focusBox(
          Math.min(
            index,
            PIN_LENGTH - 1,
          ),
        );

        return;
      }

      if (index > 0) {
        const nextValue =
          value.slice(0, index - 1) +
          value.slice(index);

        onChange(
          nextValue.slice(0, PIN_LENGTH),
        );

        focusBox(index - 1);
      }

      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();

      if (value[index]) {
        const nextValue =
          value.slice(0, index) +
          value.slice(index + 1);

        onChange(
          nextValue.slice(0, PIN_LENGTH),
        );
      }

      return;
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      event.preventDefault();
      focusBox(index - 1);
      return;
    }

    if (
      event.key === "ArrowRight" &&
      index < PIN_LENGTH - 1
    ) {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();

    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "");

    if (!digits) {
      return;
    }

    const startIndex = Math.min(
      index,
      value.length,
    );

    const pastedDigits = digits.slice(
      0,
      PIN_LENGTH - startIndex,
    );

    const nextValue =
      value.slice(0, startIndex) +
      pastedDigits +
      value.slice(
        startIndex +
          pastedDigits.length,
      );

    const sanitizedValue = nextValue
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH);

    onChange(sanitizedValue);

    const nextIndex = Math.min(
      startIndex +
        pastedDigits.length,
      PIN_LENGTH - 1,
    );

    focusBox(nextIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
        >
          {label}
        </label>

        <span className="text-[10px] font-medium text-slate-500">
          {value.length}/{PIN_LENGTH}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 gap-1.5 sm:gap-2">
          {Array.from(
            { length: PIN_LENGTH },
            (_, index) => {
              const digit =
                value[index] ?? "";

              return (
                <input
                  key={`${id}-${index}`}
                  ref={(element) => {
                    inputRefs.current[index] =
                      element;
                  }}
                  id={
                    index === 0
                      ? id
                      : `${id}-${index + 1}`
                  }
                  name={
                    index === 0
                      ? id
                      : `${id}-${index + 1}`
                  }
                  type={
                    show
                      ? "text"
                      : "password"
                  }
                  inputMode="numeric"
                  autoComplete={
                    index === 0
                      ? "one-time-code"
                      : "off"
                  }
                  maxLength={1}
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(event) =>
                    handleChange(
                      index,
                      event.target.value,
                    )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(
                      index,
                      event,
                    )
                  }
                  onPaste={(event) =>
                    handlePaste(
                      index,
                      event,
                    )
                  }
                  disabled={disabled}
                  autoFocus={
                    autoFocus &&
                    index === 0
                  }
                  aria-label={`${label} digit ${
                    index + 1
                  }`}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#07101F] text-center text-lg font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:bg-[#0A1729] focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:text-xl"
                />
              );
            },
          )}
        </div>

        <button
          type="button"
          onClick={onToggleShow}
          disabled={disabled}
          aria-label={
            show
              ? "Hide Wallet PIN"
              : "Show Wallet PIN"
          }
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-[#07101F] text-slate-400 transition hover:border-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14"
        >
          {show ? (
            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </div>

      <p className="text-[10px] leading-5 text-slate-500">
        Enter exactly 6 digits.
      </p>
    </div>
  );
}

export default function WithdrawalPINManager({
  mode,
  open,
  submitting = false,
  error = "",
  forgotSuccess = false,
  onClose,
  onSetPIN,
  onChangePIN,
  onForgotPIN,
}: WithdrawalPINManagerProps) {
  const [currentPIN, setCurrentPIN] =
    useState("");

  const [newPIN, setNewPIN] =
    useState("");

  const [confirmPIN, setConfirmPIN] =
    useState("");

  const [
    showCurrentPIN,
    setShowCurrentPIN,
  ] = useState(false);

  const [
    showNewPIN,
    setShowNewPIN,
  ] = useState(false);

  const [
    showConfirmPIN,
    setShowConfirmPIN,
  ] = useState(false);

  const [
    validationError,
    setValidationError,
  ] = useState("");

  const [
    forgotSubmitting,
    setForgotSubmitting,
  ] = useState(false);

  const resetForm = () => {
    setCurrentPIN("");
    setNewPIN("");
    setConfirmPIN("");

    setShowCurrentPIN(false);
    setShowNewPIN(false);
    setShowConfirmPIN(false);

    setValidationError("");
    setForgotSubmitting(false);
  };

  const handleClose = () => {
    if (
      submitting ||
      forgotSubmitting
    ) {
      return;
    }

    resetForm();
    onClose();
  };

  if (!open) {
    return null;
  }

  const title =
    mode === "set"
      ? "Set Wallet PIN"
      : "Change Wallet PIN";

  const description =
    mode === "set"
      ? "Create a 6-digit Wallet PIN to protect withdrawals and sensitive wallet operations."
      : "Enter your current Wallet PIN and create a new 6-digit Wallet PIN.";

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setValidationError("");

    if (
      mode === "change" &&
      !isValidPIN(currentPIN)
    ) {
      setValidationError(
        "Enter your current 6-digit Wallet PIN.",
      );
      return;
    }

    if (!isValidPIN(newPIN)) {
      setValidationError(
        "Your new Wallet PIN must contain exactly 6 digits.",
      );
      return;
    }

    if (!isValidPIN(confirmPIN)) {
      setValidationError(
        "Your Wallet PIN confirmation must contain exactly 6 digits.",
      );
      return;
    }

    if (newPIN !== confirmPIN) {
      setValidationError(
        "The Wallet PIN confirmation does not match.",
      );
      return;
    }

    if (
      mode === "change" &&
      currentPIN === newPIN
    ) {
      setValidationError(
        "Your new Wallet PIN must be different from your current Wallet PIN.",
      );
      return;
    }

    try {
      if (mode === "set") {
        await onSetPIN(newPIN);
      } else {
        await onChangePIN(
          currentPIN,
          newPIN,
        );
      }

      setCurrentPIN("");
      setNewPIN("");
      setConfirmPIN("");
    } catch {
      /*
       * Parent owns API error presentation.
       */
    }
  };

  const handleForgotPIN =
    async (): Promise<void> => {
      if (forgotSubmitting) {
        return;
      }

      setValidationError("");

      try {
        setForgotSubmitting(true);

        /*
         * Parent owns the actual success state.
         * If this resolves, forgotSuccess becomes
         * true in the parent page.
         */
        await onForgotPIN();
      } catch {
        /*
         * Parent owns API error presentation.
         */
      } finally {
        setForgotSubmitting(false);
      }
    };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-pin-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[28px] border border-white/8 bg-[#050B18] shadow-2xl shadow-black/40 sm:rounded-[28px]">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#07101F]/95 px-5 py-4 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/10">
              <LockKeyhole className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="min-w-0">
              <h2
                id="wallet-pin-title"
                className="truncate text-sm font-extrabold text-white sm:text-base"
              >
                {title}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Wallet security
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={
              submitting ||
              forgotSubmitting
            }
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative space-y-5 p-5">
          {/* Intro */}
          <div className="rounded-[22px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-4">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />

              <div>
                <p className="text-xs font-bold text-white">
                  Keep your Wallet PIN private
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-400">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* API error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/10 p-3.5 text-xs text-red-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="leading-5">
                {error}
              </p>
            </div>
          )}

          {/* Local validation error */}
          {validationError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/10 p-3.5 text-xs text-red-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="leading-5">
                {validationError}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            {mode === "change" && (
              <PINInput
                id="wallet-current-pin"
                label="Current Wallet PIN"
                value={currentPIN}
                onChange={(value) => {
                  setCurrentPIN(value);
                  setValidationError("");
                }}
                disabled={
                  submitting ||
                  forgotSubmitting
                }
                show={showCurrentPIN}
                onToggleShow={() =>
                  setShowCurrentPIN(
                    (previous) => !previous,
                  )
                }
                autoFocus
              />
            )}

            <PINInput
              id="wallet-new-pin"
              label={
                mode === "set"
                  ? "Wallet PIN"
                  : "New Wallet PIN"
              }
              value={newPIN}
              onChange={(value) => {
                setNewPIN(value);
                setValidationError("");
              }}
              disabled={
                submitting ||
                forgotSubmitting
              }
              show={showNewPIN}
              onToggleShow={() =>
                setShowNewPIN(
                  (previous) => !previous,
                )
              }
              autoFocus={mode === "set"}
            />

            <PINInput
              id="wallet-confirm-pin"
              label="Confirm Wallet PIN"
              value={confirmPIN}
              onChange={(value) => {
                setConfirmPIN(value);
                setValidationError("");
              }}
              disabled={
                submitting ||
                forgotSubmitting
              }
              show={showConfirmPIN}
              onToggleShow={() =>
                setShowConfirmPIN(
                  (previous) => !previous,
                )
              }
            />

            <button
              type="submit"
              disabled={
                submitting ||
                forgotSubmitting ||
                !isValidPIN(newPIN) ||
                !isValidPIN(confirmPIN)
              }
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-xs font-extrabold text-[#04100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04100B]/30 border-t-[#04100B]" />

                  {mode === "set"
                    ? "Setting Wallet PIN..."
                    : "Changing Wallet PIN..."}
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4" />

                  {mode === "set"
                    ? "Set Wallet PIN"
                    : "Change Wallet PIN"}
                </>
              )}
            </button>
          </form>

          {/* Forgot PIN */}
          {mode === "change" && (
            <div className="border-t border-white/8 pt-5">
              <div className="rounded-2xl border border-white/8 bg-[#07101F] p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white">
                      Forgot your Wallet PIN?
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-500">
                      We can send a secure Wallet PIN reset
                      link to the email address associated
                      with your account.
                    </p>

                    {forgotSuccess && (
                      <div
                        role="status"
                        aria-live="polite"
                        className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3 text-[10px] text-emerald-200"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />

                        <p className="leading-5">
                          A PIN reset link has been
                          sent to your email.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        void handleForgotPIN()
                      }
                      disabled={
                        submitting ||
                        forgotSubmitting ||
                        forgotSuccess
                      }
                      className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-purple-400/20 bg-purple-400/5 px-4 text-[10px] font-bold text-purple-300 transition hover:border-purple-400/40 hover:bg-purple-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {forgotSubmitting ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-purple-300/30 border-t-purple-300" />
                          Sending...
                        </>
                      ) : forgotSuccess ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Reset link sent
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5" />
                          Send reset link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-[10px] leading-5 text-slate-600">
            Never share your Wallet PIN with anyone.
            REDIQ support will never ask you for it.
          </p>
        </div>
      </div>
    </div>
  );
}
