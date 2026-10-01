"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface RejectWithdrawalDialogProps {
  open: boolean;
  withdrawalId: string;
  amount: number;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

export default function RejectWithdrawalDialog({
  open,
  withdrawalId,
  amount,
  onClose,
  onConfirm,
}: RejectWithdrawalDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError("A rejection reason is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onConfirm(trimmedReason);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject withdrawal.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-withdrawal-title"
    >
      <div className="flex max-h-[96vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/50 sm:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>

            <div className="min-w-0">
              <h2
                id="reject-withdrawal-title"
                className="text-sm font-semibold text-white"
              >
                Reject withdrawal
              </h2>

              <p className="mt-0.5 truncate font-mono text-[9px] text-slate-500">
                {withdrawalId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-500 transition hover:border-white/15 hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close rejection dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="rounded-xl border border-red-400/15 bg-red-400/5 p-3 sm:p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <div className="min-w-0">
                <p className="text-[11px] leading-4.5 text-red-200/75">
                  You are rejecting a withdrawal request for{" "}
                  <span className="font-semibold text-red-200">
                    {formatAmount(amount)} USDT
                  </span>
                  .
                </p>

                <p className="mt-1.5 text-[10px] leading-4 text-red-200/60">
                  Provide a clear reason for the user and audit
                  history. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="withdrawal-rejection-reason"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400"
            >
              Rejection reason
            </label>

            <textarea
              id="withdrawal-rejection-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              placeholder="Enter the reason for rejecting this withdrawal..."
              rows={4}
              disabled={submitting}
              autoFocus
              className="w-full resize-none rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-xs leading-5 text-white outline-none placeholder:text-slate-600 focus:border-red-400/30 focus:ring-1 focus:ring-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {error && (
              <p className="mt-1.5 text-[10px] font-medium text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-white/8 px-4 py-3 sm:flex-row sm:justify-end sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="min-h-10 rounded-lg border border-white/10 bg-white/3 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-9"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting || !reason.trim()}
            className="min-h-10 rounded-lg bg-red-500/90 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-9"
          >
            {submitting ? "Rejecting..." : "Reject withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
}
