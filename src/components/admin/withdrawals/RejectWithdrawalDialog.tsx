"use client";

import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useId,
  useState,
} from "react";

interface RejectWithdrawalDialogProps {
  open: boolean;
  withdrawalId: string;
  amount: number;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function RejectWithdrawalDialog({
  open,
  withdrawalId,
  amount,
  onClose,
  onConfirm,
}: RejectWithdrawalDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] =
    useState(false);
  const [error, setError] = useState("");

  const titleId = useId();
  const descriptionId = useId();

  if (!open) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError(
        "Please provide a rejection reason.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await onConfirm(trimmedReason);

      setReason("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reject withdrawal.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/8 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>

            <div>
              <h2
                id={titleId}
                className="text-base font-semibold text-white"
              >
                Reject withdrawal
              </h2>

              <p
                id={descriptionId}
                className="mt-1 text-xs leading-5 text-slate-500"
              >
                This action will fail the pending withdrawal
                and restore the requested amount through the
                refund workflow.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Withdrawal
            </p>

            <p className="mt-1 break-all font-mono text-xs text-amber-200/70">
              {withdrawalId}
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}{" "}
              <span className="text-sm font-medium text-slate-500">
                USDT
              </span>
            </p>
          </div>

          <label
            htmlFor={`${titleId}-reason`}
            className="mt-5 block"
          >
            <span className="text-xs font-semibold text-slate-300">
              Rejection reason
            </span>

            <textarea
              id={`${titleId}-reason`}
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              rows={4}
              maxLength={500}
              disabled={submitting}
              placeholder="Enter the reason this withdrawal is being rejected..."
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-[#07101F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-red-400/30 focus:ring-2 focus:ring-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <div className="mt-1 flex justify-end">
            <span className="text-[10px] text-slate-600">
              {reason.length}/500
            </span>
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-xs font-medium text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/8 bg-white/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/6 hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitting || !reason.trim()
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {submitting
              ? "Rejecting..."
              : "Reject withdrawal"}
          </button>
        </div>
      </form>
    </div>
  );
}