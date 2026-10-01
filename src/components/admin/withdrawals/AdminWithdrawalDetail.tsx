"use client";

import {
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";
import { useId, useState } from "react";

import type { AdminWithdrawal } from "@/src/lib/api/admin";

import WithdrawalStatusBadge from "./WithdrawalStatusBadge";

interface AdminWithdrawalDetailProps {
  withdrawal: AdminWithdrawal;
  onClose: () => void;
  onReject: () => void;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function shortId(value: string): string {
  if (!value) return "—";

  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 9)}…${value.slice(-7)}`;
}

export default function AdminWithdrawalDetail({
  withdrawal,
  onClose,
  onReject,
}: AdminWithdrawalDetailProps) {
  const [copied, setCopied] = useState("");

  const titleId = useId();

  const copyValue = async (
    label: string,
    value: string,
  ): Promise<void> => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);

      window.setTimeout(() => {
        setCopied("");
      }, 1600);
    } catch {
      setCopied("");
    }
  };

  const showTxLink =
    typeof withdrawal.tx_hash === "string" &&
    withdrawal.tx_hash.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="flex max-h-[96vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/50 sm:rounded-3xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 bg-[#0B1426]/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Withdrawal details
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <h2
                id={titleId}
                className="font-mono text-xs font-semibold text-white sm:text-sm"
              >
                {shortId(withdrawal.id)}
              </h2>

              <WithdrawalStatusBadge
                status={withdrawal.status}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-500 transition hover:border-white/15 hover:bg-white/6 hover:text-white sm:h-9 sm:w-9"
            aria-label="Close withdrawal details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {/* Amount summary */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
            <SummaryCard
              label="Requested"
              value={`${formatAmount(withdrawal.amount)} USDT`}
              icon={WalletCards}
            />

            <SummaryCard
              label="Fee"
              value={`${formatAmount(withdrawal.fee)} USDT`}
              icon={WalletCards}
            />

            <SummaryCard
              label="Net amount"
              value={`${formatAmount(withdrawal.net_amount)} USDT`}
              icon={CheckCircle2}
              positive
            />
          </div>

          {/* Destination */}
          <section className="mt-3 overflow-hidden rounded-xl border border-white/8 bg-white/1.5 sm:mt-4 sm:rounded-2xl">
            <SectionHeader title="Destination" />

            <div className="divide-y divide-white/5">
              <DetailRow
                label="User ID"
                value={withdrawal.user_id}
                copyLabel="user"
                copied={copied}
                onCopy={copyValue}
              />

              <DetailRow
                label="Asset ID"
                value={withdrawal.asset_id}
                copyLabel="asset"
                copied={copied}
                onCopy={copyValue}
              />

              <DetailRow
                label="Network ID"
                value={withdrawal.network_id}
                copyLabel="network"
                copied={copied}
                onCopy={copyValue}
              />

              <DetailRow
                label="Withdrawal wallet ID"
                value={withdrawal.withdrawal_wallet_id}
                copyLabel="wallet"
                copied={copied}
                onCopy={copyValue}
              />

              <DetailRow
                label="Destination address"
                value={withdrawal.destination_address}
                copyLabel="destination"
                copied={copied}
                onCopy={copyValue}
              />
            </div>
          </section>

          {/* Processing */}
          <section className="mt-3 overflow-hidden rounded-xl border border-white/8 bg-white/1.5 sm:mt-4 sm:rounded-2xl">
            <SectionHeader title="Processing" />

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5">
              <InfoItem
                label="Confirmations"
                value={`${withdrawal.confirmations} / ${withdrawal.required_confirmations}`}
              />

              <InfoItem
                label="Created"
                value={formatDate(withdrawal.created_at)}
              />

              <InfoItem
                label="Broadcast"
                value={formatDate(withdrawal.broadcast_at)}
              />

              <InfoItem
                label="Completed"
                value={formatDate(withdrawal.completed_at)}
              />

              <InfoItem
                label="Failed"
                value={formatDate(withdrawal.failed_at)}
              />

              <InfoItem
                label="Cancelled"
                value={formatDate(withdrawal.cancelled_at)}
              />
            </div>
          </section>

          {/* Transaction */}
          {showTxLink && (
            <section className="mt-3 rounded-xl border border-white/8 bg-white/1.5 p-4 sm:mt-4 sm:rounded-2xl sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-white sm:text-sm">
                    Transaction
                  </h3>

                  <p className="mt-1.5 break-all font-mono text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
                    {withdrawal.tx_hash}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      void copyValue(
                        "tx",
                        withdrawal.tx_hash,
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-500 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-300"
                    aria-label="Copy transaction hash"
                    title="Copy transaction hash"
                  >
                    {copied === "tx" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <a
                    href={`https://tronscan.org/#/transaction/${withdrawal.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-500 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-300"
                    aria-label="Open transaction"
                    title="Open transaction"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Failure */}
          {withdrawal.failure_reason && (
            <section className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-400/15 bg-red-400/5 p-4 sm:mt-4 sm:rounded-2xl">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10">
                <XCircle className="h-4 w-4 text-red-400" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-red-300">
                  Failure reason
                </h3>

                <p className="mt-1 text-[11px] leading-4.5 text-red-300/70">
                  {withdrawal.failure_reason}
                </p>
              </div>
            </section>
          )}

          {/* Pending action */}
          {withdrawal.status === "PENDING" && (
            <section className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-400/15 bg-amber-400/5 p-4 sm:mt-4 sm:rounded-2xl">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
                <Clock3 className="h-4 w-4 text-amber-300" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-amber-300">
                  Pending administrator action
                </h3>

                <p className="mt-1 text-[11px] leading-4.5 text-amber-200/70">
                  This withdrawal has not entered on-chain
                  processing. Rejecting it will mark the request
                  as failed and restore the requested amount
                  through the withdrawal refund workflow.
                </p>

                <button
                  type="button"
                  onClick={onReject}
                  className="mt-3 min-h-9 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-[11px] font-semibold text-red-300 transition hover:bg-red-500/15"
                >
                  Reject withdrawal
                </button>
              </div>
            </section>
          )}

          {/* Failed state */}
          {withdrawal.status === "FAILED" && (
            <section className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-400/15 bg-red-400/5 p-4 sm:mt-4 sm:rounded-2xl">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10">
                <XCircle className="h-4 w-4 text-red-400" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-red-300">
                  Withdrawal failed
                </h3>

                <p className="mt-1 text-[11px] leading-4.5 text-red-300/70">
                  This withdrawal is in a terminal failed state.
                  The backend refund workflow is idempotent, so
                  the withdrawal cannot be refunded twice.
                </p>
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="mt-3 rounded-xl border border-white/8 bg-white/1.5 p-4 sm:mt-4 sm:rounded-2xl sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <InfoItem
                label="Idempotency key"
                value={withdrawal.idempotency_key}
              />

              <InfoItem
                label="Updated"
                value={formatDate(withdrawal.updated_at)}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: typeof WalletCards;
  positive?: boolean;
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  positive = false,
}: SummaryCardProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        positive
          ? "border-emerald-400/15 bg-emerald-400/5"
          : "border-white/8 bg-white/2.5"
      }`}
    >
      <div
        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${
          positive
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-purple-400/10 text-purple-300"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold sm:text-base ${
          positive ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-white/8 px-4 py-3 sm:px-5 sm:py-3.5">
      <h3 className="text-xs font-semibold text-white sm:text-sm">
        {title}
      </h3>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  copyLabel: string;
  copied: string;
  onCopy: (
    label: string,
    value: string,
  ) => Promise<void>;
}

function DetailRow({
  label,
  value,
  copyLabel,
  copied,
  onCopy,
}: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </p>

        <p className="mt-0.5 break-all font-mono text-[10px] leading-4 text-slate-300 sm:text-xs sm:leading-5">
          {value || "—"}
        </p>
      </div>

      <button
        type="button"
        disabled={!value}
        onClick={() =>
          void onCopy(copyLabel, value)
        }
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-500 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-300 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
      >
        {copied === copyLabel ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-0.5 break-all text-[10px] font-medium leading-4 text-slate-300 sm:text-xs sm:leading-5">
        {value || "—"}
      </p>
    </div>
  );
}
