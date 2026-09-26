
"use client";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { useRef, useState } from "react";

interface WithdrawalPinInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

const PIN_LENGTH = 6;

export default function WithdrawalPinInput({
  value,
  onChange,
  disabled = false,
  error,
}: WithdrawalPinInputProps) {
  const [showPin, setShowPin] =
    useState(false);

  const inputRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);

  const focusBox = (index: number): void => {
    if (index >= 0 && index < PIN_LENGTH) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  const updateValue = (
    index: number,
    rawValue: string,
  ): void => {
    const digits = rawValue.replace(/\D/g, "");

    if (!digits) {
      return;
    }

    if (digits.length > 1) {
      const pastedDigits = digits.slice(
        0,
        PIN_LENGTH - index,
      );

      const values = value.split("");

      while (values.length < PIN_LENGTH) {
        values.push("");
      }

      pastedDigits.split("").forEach(
        (digit, offset) => {
          values[index + offset] = digit;
        },
      );

      const nextValue = values
        .join("")
        .slice(0, PIN_LENGTH);

      onChange(nextValue);

      focusBox(
        Math.min(
          index + pastedDigits.length,
          PIN_LENGTH - 1,
        ),
      );

      return;
    }

    const values = value.split("");

    while (values.length < PIN_LENGTH) {
      values.push("");
    }

    values[index] = digits[0];

    onChange(
      values.join("").slice(0, PIN_LENGTH),
    );

    if (index < PIN_LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === "Backspace") {
      if (value[index]) {
        const values = value.split("");

        while (values.length < PIN_LENGTH) {
          values.push("");
        }

        values[index] = "";

        onChange(
          values.join("").slice(0, PIN_LENGTH),
        );

        return;
      }

      if (index > 0) {
        const values = value.split("");

        while (values.length < PIN_LENGTH) {
          values.push("");
        }

        values[index - 1] = "";

        onChange(
          values.join("").slice(0, PIN_LENGTH),
        );

        focusBox(index - 1);
      }

      return;
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      event.preventDefault();
      focusBox(index - 1);
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
    event: React.ClipboardEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();

    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH - index);

    if (!digits) {
      return;
    }

    const values = value.split("");

    while (values.length < PIN_LENGTH) {
      values.push("");
    }

    digits.split("").forEach(
      (digit, offset) => {
        values[index + offset] = digit;
      },
    );

    onChange(
      values.join("").slice(0, PIN_LENGTH),
    );

    focusBox(
      Math.min(
        index + digits.length,
        PIN_LENGTH - 1,
      ),
    );
  };

  const isComplete =
    value.length === PIN_LENGTH;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LockKeyhole
            className={[
              "h-4 w-4",
              error
                ? "text-red-400"
                : "text-emerald-400",
            ].join(" ")}
          />

          <label
            htmlFor="withdrawal-pin"
            className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
          >
            Wallet PIN
          </label>
        </div>

        {isComplete && !error && (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 gap-1.5 sm:gap-2">
          {Array.from(
            { length: PIN_LENGTH },
            (_, index) => {
              const digit = value[index] ?? "";

              return (
                <input
                  key={`withdrawal-pin-${index}`}
                  ref={(element) => {
                    inputRefs.current[index] =
                      element;
                  }}
                  id={
                    index === 0
                      ? "withdrawal-pin"
                      : undefined
                  }
                  name={
                    index === 0
                      ? "withdrawal_pin"
                      : undefined
                  }
                  type={
                    showPin ? "text" : "password"
                  }
                  inputMode="numeric"
                  autoComplete={
                    index === 0
                      ? "one-time-code"
                      : "off"
                  }
                  maxLength={1}
                  pattern="\d"
                  value={digit}
                  onChange={(event) =>
                    updateValue(
                      index,
                      event.target.value,
                    )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                  onPaste={(event) =>
                    handlePaste(index, event)
                  }
                  disabled={disabled}
                  aria-label={`Wallet PIN digit ${index + 1}`}
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error
                      ? "withdrawal-pin-error"
                      : "withdrawal-pin-help"
                  }
                  className={[
                    "h-13 min-w-0 flex-1 rounded-xl border bg-[#07101F]",
                    "text-center text-lg font-bold text-white outline-none",
                    "transition focus:ring-2",
                    error
                      ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/10"
                      : "border-white/10 focus:border-emerald-400 focus:ring-emerald-400/10",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "sm:h-14 sm:text-xl",
                  ].join(" ")}
                />
              );
            },
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setShowPin(
              (current) => !current,
            )
          }
          disabled={
            disabled || value.length === 0
          }
          aria-label={
            showPin
              ? "Hide Wallet PIN"
              : "Show Wallet PIN"
          }
          className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-[#07101F] text-slate-400 transition hover:border-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14"
        >
          {showPin ? (
            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </div>

      {error ? (
        <p
          id="withdrawal-pin-error"
          className="text-[10px] leading-5 text-red-400"
        >
          {error}
        </p>
      ) : (
        <p
          id="withdrawal-pin-help"
          className="text-[10px] leading-5 text-slate-500"
        >
          Enter your 6-digit Wallet PIN to authorize
          this transaction. Never share your Wallet PIN
          with anyone.
        </p>
      )}
    </div>
  );
}

