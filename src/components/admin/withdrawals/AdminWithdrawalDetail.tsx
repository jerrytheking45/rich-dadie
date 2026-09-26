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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 bg-[#0B1426]/95 px-6 py-5 backdrop-blur">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Withdrawal details
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2
                id={titleId}
                className="font-mono text-sm font-semibold text-white"
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
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-500 transition hover:border-white/15 hover:bg-white/6 hover:text-white"
            aria-label="Close withdrawal details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(92vh-88px)] overflow-y-auto p-6">
          {/* Amount summary */}
          <div className="grid gap-3 sm:grid-cols-3">
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
          <section className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-white/1.5">
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
          <section className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-white/1.5">
            <SectionHeader title="Processing" />

            <div className="grid gap-5 p-5 sm:grid-cols-2">
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
            <section className="mt-5 rounded-2xl border border-white/8 bg-white/1.5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    Transaction
                  </h3>

                  <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-500">
                    {withdrawal.tx_hash}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      void copyValue(
                        "tx",
                        withdrawal.tx_hash,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-500 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-300"
                    aria-label="Copy transaction hash"
                    title="Copy transaction hash"
                  >
                    {copied === "tx" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  <a
                    href={`https://tronscan.org/#/transaction/${withdrawal.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-500 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-300"
                    aria-label="Open transaction"
                    title="Open transaction"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Failure */}
          {withdrawal.failure_reason && (
            <section className="mt-5 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/5 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
                <XCircle className="h-4 w-4 text-red-400" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-red-300">
                  Failure reason
                </h3>

                <p className="mt-1 text-xs leading-5 text-red-300/70">
                  {withdrawal.failure_reason}
                </p>
              </div>
            </section>
          )}

          {/* Pending action */}
          {withdrawal.status === "PENDING" && (
            <section className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                <Clock3 className="h-4 w-4 text-amber-300" />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-300">
                  Pending administrator action
                </h3>

                <p className="mt-1 text-xs leading-5 text-amber-200/70">
                  This withdrawal has not entered on-chain
                  processing. Rejecting it will mark the request
                  as failed and restore the requested amount
                  through the withdrawal refund workflow.
                </p>

                <button
                  type="button"
                  onClick={onReject}
                  className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/15"
                >
                  Reject withdrawal
                </button>
              </div>
            </section>
          )}

          {/* Failed state */}
          {withdrawal.status === "FAILED" && (
            <section className="mt-5 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/5 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
                <XCircle className="h-4 w-4 text-red-400" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-red-300">
                  Withdrawal failed
                </h3>

                <p className="mt-1 text-xs leading-5 text-red-300/70">
                  This withdrawal is in a terminal failed state.
                  The backend refund workflow is idempotent, so
                  the withdrawal cannot be refunded twice.
                </p>
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="mt-5 rounded-2xl border border-white/8 bg-white/1.5 p-5">
            <div className="grid gap-5 sm:grid-cols-2">
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
      className={`rounded-2xl border p-4 ${
        positive
          ? "border-emerald-400/15 bg-emerald-400/5"
          : "border-white/8 bg-white/2.5"
      }`}
    >
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
          positive
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-purple-400/10 text-purple-300"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-semibold ${
          positive ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="border-b border-white/8 px-5 py-4">
      <h3 className="text-sm font-semibold text-white">
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
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </p>

        <p className="mt-1 break-all font-mono text-xs leading-5 text-slate-300">
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

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 break-all text-xs font-medium leading-5 text-slate-300">
        {value || "—"}
      </p>
    </div>
  );
}