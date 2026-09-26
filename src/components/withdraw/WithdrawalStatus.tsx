
"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";
import type { Withdrawal } from "@/src/lib/types/investment";
import { formatUSDT } from "@/src/lib/utils/currency";

interface WithdrawalStatusProps {
  withdrawal: Withdrawal;
  onNewWithdrawal: () => void;
  onBack: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

type StatusConfig = {
  title: string;
  description: string;
  icon: typeof CheckCircle2;
};

const STATUS_CONFIG: Record<
  Withdrawal["status"],
  StatusConfig
> = {
  PENDING: {
    title: "Withdrawal submitted",
    description:
      "Your withdrawal request has been received and is waiting to be processed.",
    icon: Clock3,
  },

  PROCESSING: {
    title: "Withdrawal processing",
    description:
      "Your withdrawal is being processed. Please wait while we prepare the transaction.",
    icon: Loader2,
  },

  BROADCAST: {
    title: "Transaction broadcast",
    description:
      "Your transaction has been broadcast to the blockchain and is waiting for confirmations.",
    icon: ExternalLink,
  },

  CONFIRMING: {
    title: "Confirming transaction",
    description:
      "Your transaction is on the blockchain and is waiting for the required confirmations.",
    icon: Loader2,
  },

  COMPLETED: {
    title: "Withdrawal completed",
    description:
      "Your withdrawal has been completed successfully.",
    icon: CheckCircle2,
  },

  FAILED: {
    title: "Withdrawal failed",
    description:
      "Your withdrawal could not be completed.",
    icon: XCircle,
  },

  CANCELLED: {
    title: "Withdrawal cancelled",
    description:
      "This withdrawal has been cancelled.",
    icon: XCircle,
  },
};

const STATUS_STEPS: Withdrawal["status"][] = [
  "PENDING",
  "PROCESSING",
  "BROADCAST",
  "CONFIRMING",
  "COMPLETED",
];

const STATUS_ORDER: Record<
  Withdrawal["status"],
  number
> = {
  PENDING: 0,
  PROCESSING: 1,
  BROADCAST: 2,
  CONFIRMING: 3,
  COMPLETED: 4,
  FAILED: -1,
  CANCELLED: -1,
};

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function shortenId(value: string): string {
  if (value.length <= 20) {
    return value;
  }

  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

export default function WithdrawalStatus({
  withdrawal,
  onNewWithdrawal,
  onBack,
  onRefresh,
  refreshing = false,
}: WithdrawalStatusProps) {
  const router = useRouter();

  const config =
    STATUS_CONFIG[withdrawal.status];

  const StatusIcon = config.icon;

  const isTerminal =
    withdrawal.status === "COMPLETED" ||
    withdrawal.status === "FAILED" ||
    withdrawal.status === "CANCELLED";

  const isSuccessful =
    withdrawal.status === "COMPLETED";

  const isError =
    withdrawal.status === "FAILED" ||
    withdrawal.status === "CANCELLED";

  const currentStep =
    STATUS_ORDER[withdrawal.status];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      {/* Main status */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-xl shadow-black/10 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div
            className={[
              "flex h-20 w-20 items-center justify-center rounded-[26px] border",
              isSuccessful
                ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-400"
                : isError
                  ? "border-red-400/10 bg-red-400/10 text-red-400"
                  : "border-purple-400/10 bg-purple-400/10 text-purple-300",
            ].join(" ")}
          >
            <StatusIcon
              className={[
                "h-9 w-9",
                withdrawal.status ===
                  "PROCESSING" ||
                withdrawal.status ===
                  "CONFIRMING"
                  ? "animate-spin"
                  : "",
              ].join(" ")}
            />
          </div>

          <p
            className={[
              "mt-5 text-[9px] font-bold uppercase tracking-[0.18em]",
              isSuccessful
                ? "text-emerald-400"
                : isError
                  ? "text-red-400"
                  : "text-purple-300",
            ].join(" ")}
          >
            {withdrawal.status}
          </p>

          <h1 className="mt-2 text-[21px] font-extrabold tracking-tight text-white">
            {config.title}
          </h1>

          <p className="mt-2 max-w-md text-xs leading-5 text-slate-400">
            {config.description}
          </p>

          {withdrawal.failureReason && (
            <div className="mt-5 flex w-full items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/10 p-4 text-left">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <div>
                <p className="text-xs font-bold text-red-200">
                  Reason
                </p>

                <p className="mt-1 text-[10px] leading-5 text-red-100/60">
                  {withdrawal.failureReason}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        {!isError && (
          <div className="relative mt-8">
            <div className="flex items-center justify-between gap-1">
              {STATUS_STEPS.map(
                (step, index) => {
                  const completed =
                    currentStep >= index;

                  const active =
                    withdrawal.status === step;

                  return (
                    <div
                      key={step}
                      className="flex min-w-0 flex-1 items-center"
                    >
                      <div className="flex min-w-0 flex-col items-center">
                        <div
                          className={[
                            "flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-bold",
                            completed
                              ? "border-emerald-400 bg-emerald-500 text-[#04100B]"
                              : "border-white/8 bg-[#07101F] text-slate-600",
                            active
                              ? "ring-4 ring-emerald-400/10"
                              : "",
                          ].join(" ")}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <span
                          className={[
                            "mt-2 hidden text-center text-[9px] sm:block",
                            active
                              ? "font-bold text-emerald-400"
                              : completed
                                ? "text-slate-300"
                                : "text-slate-600",
                          ].join(" ")}
                        >
                          {step}
                        </span>
                      </div>

                      {index <
                        STATUS_STEPS.length -
                          1 && (
                        <div
                          className={[
                            "mx-1 h-px flex-1",
                            currentStep > index
                              ? "bg-emerald-400"
                              : "bg-white/8",
                          ].join(" ")}
                        />
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>

      {/* Transaction summary */}
      <div className="rounded-3xl border border-white/8 bg-[#0B1426] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
            <ShieldCheck className="h-5 w-5 text-purple-300" />
          </div>

          <div>
            <h2 className="text-xs font-bold text-white">
              Withdrawal details
            </h2>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Transaction information
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-white/8">
          <DetailRow
            label="Amount"
            value={formatUSDT(
              withdrawal.amount,
            )}
          />

          <DetailRow
            label="Fee"
            value={formatUSDT(
              withdrawal.fee,
            )}
          />

          <DetailRow
            label="Net amount"
            value={formatUSDT(
              withdrawal.netAmount,
            )}
            highlight
          />

          <DetailRow
            label="Status"
            value={withdrawal.status}
          />

          <DetailRow
            label="Withdrawal ID"
            value={shortenId(
              withdrawal.id,
            )}
            title={withdrawal.id}
          />

          <DetailRow
            label="Created"
            value={formatDate(
              withdrawal.createdAt,
            )}
          />

          {withdrawal.txHash && (
            <DetailRow
              label="Transaction hash"
              value={shortenId(
                withdrawal.txHash,
              )}
              title={withdrawal.txHash}
            />
          )}

          {withdrawal.confirmations !==
            undefined && (
            <DetailRow
              label="Confirmations"
              value={`${withdrawal.confirmations} / ${withdrawal.requiredConfirmations}`}
            />
          )}
        </div>
      </div>

      {/* Blockchain transaction */}
      {withdrawal.txHash && (
        <div className="rounded-2xl border border-white/8 bg-[#07101F] p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Transaction hash
          </p>

          <p className="mt-2 break-all font-mono text-[10px] leading-5 text-white">
            {withdrawal.txHash}
          </p>
        </div>
      )}

      {/* Refresh */}
      {!isTerminal &&
        onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0B1426] text-xs font-bold text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={[
                "h-4 w-4",
                refreshing
                  ? "animate-spin"
                  : "",
              ].join(" ")}
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh withdrawal status"}
          </button>
        )}

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onNewWithdrawal}
          className="flex h-13 items-center justify-center rounded-2xl bg-emerald-500 px-5 text-xs font-extrabold text-[#04100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
        >
          New withdrawal
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/investment/profile/withdraw/${withdrawal.id}`,
            )
          }
          className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0B1426] px-4 text-xs font-bold text-white transition hover:border-purple-400/40 hover:text-purple-300"
        >
          <ExternalLink className="h-4 w-4" />
          Details
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0B1426] px-5 text-xs font-bold text-white transition hover:border-purple-400/40 hover:text-purple-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Profile
        </button>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  title?: string;
  highlight?: boolean;
}

function DetailRow({
  label,
  value,
  title,
  highlight = false,
}: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-[10px] text-slate-500">
        {label}
      </span>

      <span
        title={title}
        className={[
          "max-w-[60%] truncate text-right text-[10px]",
          highlight
            ? "font-bold text-emerald-400"
            : "text-slate-200",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

