
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  Loader2,
  XCircle,
} from "lucide-react";

import { investmentApi } from "@/src/lib/api/investmentApi";
import type { Deposit } from "@/src/lib/types/investment";

function formatAmount(amount: number): string {
  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })} USDT`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shorten(value: string): string {
  if (!value) {
    return "—";
  }

  if (value.length <= 20) {
    return value;
  }

  return `${value.slice(0, 10)}...${value.slice(-10)}`;
}

function StatusIcon({
  status,
}: {
  status: Deposit["status"];
}) {
  if (status === "CONFIRMED") {
    return <CheckCircle2 className="h-5 w-5" />;
  }

  if (
    status === "FAILED" ||
    status === "EXPIRED" ||
    status === "UNMATCHED"
  ) {
    return <XCircle className="h-5 w-5" />;
  }

  return <Clock3 className="h-5 w-5" />;
}

function statusLabel(status: Deposit["status"]): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";

    case "VERIFYING":
      return "Verifying";

    case "PENDING":
      return "Pending";

    case "FAILED":
      return "Failed";

    case "EXPIRED":
      return "Expired";

    case "UNMATCHED":
      return "Unmatched";

    default:
      return status;
  }
}

function statusClasses(status: Deposit["status"]): {
  container: string;
  icon: string;
} {
  switch (status) {
    case "CONFIRMED":
      return {
        container:
          "border-emerald-400/15 bg-emerald-500/10 text-emerald-300",
        icon: "text-emerald-400",
      };

    case "VERIFYING":
      return {
        container:
          "border-blue-400/15 bg-blue-500/10 text-blue-300",
        icon: "text-blue-400",
      };

    case "PENDING":
      return {
        container:
          "border-emerald-400/15 bg-emerald-500/10 text-emerald-300",
        icon: "text-emerald-400",
      };

    case "FAILED":
    case "EXPIRED":
    case "UNMATCHED":
      return {
        container:
          "border-red-400/15 bg-red-500/10 text-red-300",
        icon: "text-red-400",
      };

    default:
      return {
        container:
          "border-white/8 bg-white/5 text-slate-300",
        icon: "text-slate-400",
      };
  }
}

function DetailRow({
  label,
  value,
  copyValue,
  copyable = false,
}: {
  label: string;
  value: string;
  copyValue?: string;
  copyable?: boolean;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
    } catch (error) {
      console.error("Failed to copy value:", error);
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/6 py-3.5 last:border-b-0">
      <span className="shrink-0 pt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>

      <div className="flex min-w-0 items-center gap-2 text-right">
        <span className="break-all text-xs font-medium leading-5 text-slate-200">
          {value}
        </span>

        {copyable &&
          (copyValue ?? value) !== "—" && (
            <button
              type="button"
              onClick={handleCopy}
              className="
                shrink-0
                rounded-xl
                border border-white/8
                bg-white/4
                p-2
                text-slate-500
                transition
                hover:border-emerald-400/20
                hover:bg-emerald-500/10
                hover:text-emerald-400
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-emerald-500/60
              "
              aria-label={`Copy ${label}`}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
      </div>
    </div>
  );
}

export default function InvestmentDepositDetailPage() {
  const params = useParams<{
    depositId: string;
  }>();

  const depositId = params.depositId;

  const [deposit, setDeposit] =
    useState<Deposit | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!depositId) {
      return;
    }

    let cancelled = false;

    const loadDeposit = async () => {
      try {
        setLoading(true);
        setError(null);

        const result =
          await investmentApi.getDepositById(
            depositId,
          );

        if (cancelled) {
          return;
        }

        setDeposit(result);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load investment deposit:",
          err,
        );

        setError(
          "Failed to load this investment deposit.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    queueMicrotask(() => {
      if (!cancelled) {
        void loadDeposit();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [depositId]);

  const statusStyle = deposit
    ? statusClasses(deposit.status)
    : null;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#050B18] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute -left-40 top-[38%] h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        <div className="mx-auto w-full max-w-3xl pb-24 pt-2">

          {/* Header */}
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <Link
                href="/investment/profile/deposit"
                className="
                  inline-flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  border border-white/8
                  bg-[#0B1426]
                  text-slate-300
                  shadow-lg shadow-black/10
                  transition
                  hover:border-emerald-400/20
                  hover:bg-emerald-500/10
                  hover:text-emerald-400
                  active:scale-95
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-500/60
                "
                aria-label="Back to deposits"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  Payment record
                </p>

                <h1 className="mt-1 text-[20px] font-black tracking-tight text-white">
                  Deposit Details
                </h1>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Investment payment information
                </p>
              </div>
            </div>
          </header>

          {/* Loading */}
          {loading && (
            <div
              className="
                flex min-h-80
                flex-col items-center justify-center
                rounded-[26px]
                border border-white/8
                bg-[#0B1426]
                shadow-xl shadow-black/10
              "
            >
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  border border-emerald-400/15
                  bg-emerald-500/10
                "
              >
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
              </div>

              <p className="mt-4 text-xs font-semibold text-slate-300">
                Loading deposit details...
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Please wait a moment.
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              className="
                rounded-[26px]
                border border-red-400/15
                bg-[#0B1426]
                p-5
                shadow-xl shadow-black/10
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-red-400/15
                    bg-red-500/10
                    text-red-400
                  "
                >
                  <XCircle className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-red-400">
                    Deposit error
                  </p>

                  <h2 className="mt-1 text-sm font-bold text-white">
                    Unable to load deposit
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Not found */}
          {!loading &&
            !error &&
            !deposit && (
              <div
                className="
                  rounded-[26px]
                  border border-white/8
                  bg-[#0B1426]
                  p-6
                  text-center
                  shadow-xl shadow-black/10
                "
              >
                <div
                  className="
                    mx-auto flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    border border-white/8
                    bg-white/4
                    text-slate-500
                  "
                >
                  <Clock3 className="h-5 w-5" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-300">
                  Deposit not found.
                </p>

                <p className="mt-1 text-[10px] text-slate-600">
                  The requested deposit could not be located.
                </p>
              </div>
            )}

          {/* Details */}
          {!loading &&
            !error &&
            deposit && (
              <div className="space-y-4">

                {/* Status / Amount */}
                <section
                  className="
                    overflow-hidden
                    rounded-[28px]
                    border border-white/8
                    bg-linear-to-br
                    from-[#101D33]
                    via-[#0B1426]
                    to-[#11102B]
                    shadow-xl shadow-black/10
                  "
                >
                  {/* Status header */}
                  <div
                    className={`
                      border-b
                      px-5 py-4
                      ${statusStyle?.container ?? "border-white/8 bg-white/4 text-slate-300"}
                    `}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`
                            flex h-10 w-10 shrink-0
                            items-center justify-center
                            rounded-xl
                            border border-white/10
                            bg-[#07101F]/70
                            shadow-sm
                            ${statusStyle?.icon ?? "text-slate-400"}
                          `}
                        >
                          <StatusIcon
                            status={deposit.status}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold">
                            {statusLabel(
                              deposit.status,
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] opacity-60">
                            {formatDate(
                              deposit.createdAt,
                            )}
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          hidden
                          rounded-full
                          border border-white/8
                          bg-black/10
                          px-2.5 py-1
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.12em]
                          opacity-70
                          sm:inline-flex
                        "
                      >
                        Deposit
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Expected amount
                    </p>

                    <p className="mt-2 text-[28px] font-black tracking-tight text-white sm:text-[32px]">
                      {formatAmount(
                        deposit.expectedAmount,
                      )}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div
                        className="
                          rounded-2xl
                          border border-white/6
                          bg-[#07101F]/70
                          p-3.5
                        "
                      >
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          Received
                        </p>

                        <p className="mt-1.5 text-sm font-bold text-slate-200">
                          {formatAmount(
                            deposit.receivedAmount,
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          rounded-2xl
                          border border-white/6
                          bg-[#07101F]/70
                          p-3.5
                        "
                      >
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          Confirmations
                        </p>

                        <p className="mt-1.5 text-sm font-bold text-slate-200">
                          {deposit.confirmations}/
                          {
                            deposit.requiredConfirmations
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Transaction */}
                <section
                  className="
                    rounded-[26px]
                    border border-white/8
                    bg-[#0B1426]
                    p-5
                    shadow-xl shadow-black/10
                  "
                >
                  <div className="mb-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                      Blockchain
                    </p>

                    <h2 className="mt-1 text-sm font-bold text-white">
                      Transaction
                    </h2>
                  </div>

                  <DetailRow
                    label="Transaction hash"
                    value={shorten(
                      deposit.txHash,
                    )}
                    copyValue={deposit.txHash}
                    copyable={Boolean(
                      deposit.txHash,
                    )}
                  />

                  <DetailRow
                    label="Sender"
                    value={shorten(
                      deposit.senderAddress,
                    )}
                    copyValue={
                      deposit.senderAddress
                    }
                    copyable={Boolean(
                      deposit.senderAddress,
                    )}
                  />

                  <DetailRow
                    label="Deposit address"
                    value={shorten(
                      deposit.companyDepositAddress,
                    )}
                    copyValue={
                      deposit.companyDepositAddress
                    }
                    copyable={Boolean(
                      deposit.companyDepositAddress,
                    )}
                  />

                  <DetailRow
                    label="Token contract"
                    value={
                      deposit.tokenContract
                        ? shorten(
                            deposit.tokenContract,
                          )
                        : "—"
                    }
                    copyValue={
                      deposit.tokenContract ??
                      undefined
                    }
                    copyable={Boolean(
                      deposit.tokenContract,
                    )}
                  />

                  <DetailRow
                    label="Block number"
                    value={
                      deposit.blockNumber
                        ? String(
                            deposit.blockNumber,
                          )
                        : "—"
                    }
                  />
                </section>

                {/* Deposit information */}
                <section
                  className="
                    rounded-[26px]
                    border border-white/8
                    bg-[#0B1426]
                    p-5
                    shadow-xl shadow-black/10
                  "
                >
                  <div className="mb-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-purple-400">
                      Record
                    </p>

                    <h2 className="mt-1 text-sm font-bold text-white">
                      Deposit Information
                    </h2>
                  </div>

                  <DetailRow
                    label="Deposit ID"
                    value={deposit.id}
                    copyable
                  />

                  <DetailRow
                    label="Investment ID"
                    value={
                      deposit.investmentId
                    }
                    copyable
                  />

                  <DetailRow
                    label="Plan ID"
                    value={deposit.planId}
                    copyable
                  />

                  <DetailRow
                    label="Created"
                    value={formatDate(
                      deposit.createdAt,
                    )}
                  />

                  <DetailRow
                    label="Updated"
                    value={formatDate(
                      deposit.updatedAt,
                    )}
                  />

                  <DetailRow
                    label="Last checked"
                    value={formatDate(
                      deposit.lastCheckedAt,
                    )}
                  />

                  {deposit.confirmedAt && (
                    <DetailRow
                      label="Confirmed"
                      value={formatDate(
                        deposit.confirmedAt,
                      )}
                    />
                  )}
                </section>

                {/* Failure information */}
                {(deposit.status === "FAILED" ||
                  deposit.failureReason) && (
                  <section
                    className="
                      rounded-[26px]
                      border border-red-400/15
                      bg-red-500/5
                      p-5
                      shadow-lg shadow-black/10
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="
                          flex h-10 w-10 shrink-0
                          items-center justify-center
                          rounded-xl
                          border border-red-400/15
                          bg-red-500/10
                          text-red-400
                        "
                      >
                        <XCircle className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-400">
                          Payment issue
                        </p>

                        <h2 className="mt-1 text-sm font-bold text-white">
                          Failure Information
                        </h2>

                        <p className="mt-2 text-xs leading-5 text-red-300">
                          {deposit.failureReason ||
                            "The deposit could not be confirmed."}
                        </p>

                        {deposit.failedAt && (
                          <p className="mt-2 text-[10px] text-red-400/70">
                            Failed at:{" "}
                            {formatDate(
                              deposit.failedAt,
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* Action */}
                {(
                  deposit.status === "PENDING" ||
                  deposit.status === "VERIFYING"
                ) ? (
                  <Link
                    href={`/investment/investments/${encodeURIComponent(
                      deposit.investmentId,
                    )}/deposit`}
                    className="
                      group
                      flex items-center justify-center gap-2
                      rounded-2xl
                      border border-emerald-400/20
                      bg-emerald-500
                      px-4 py-3.5
                      text-xs
                      font-bold
                      text-[#03100B]
                      shadow-lg
                      shadow-emerald-500/10
                      transition
                      hover:bg-emerald-400
                      hover:shadow-emerald-500/20
                      active:scale-[0.99]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-emerald-400
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-[#050B18]
                    "
                  >
                    Continue Deposit
                  </Link>
                ) : (
                  <Link
                    href={`/investment/investments/${encodeURIComponent(
                      deposit.investmentId,
                    )}`}
                    className="
                      flex items-center justify-center
                      rounded-2xl
                      border border-white/8
                      bg-[#0B1426]
                      px-4 py-3.5
                      text-xs
                      font-bold
                      text-slate-200
                      shadow-lg
                      shadow-black/10
                      transition
                      hover:border-emerald-400/20
                      hover:bg-emerald-500/10
                      hover:text-emerald-300
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-emerald-500/60
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-[#050B18]
                    "
                  >
                    View Investment
                  </Link>
                )}

              </div>
            )}
        </div>
      </div>
    </main>
  );
}

