
"use client";

import {
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Hash,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import type { Withdrawal } from "@/src/lib/types/investment";
import { formatUSDT } from "@/src/lib/utils/currency";

interface WithdrawalTransactionDetailsProps {
  withdrawal: Withdrawal;
  onBack?: () => void;
}

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

function shortenHash(value: string): string {
  if (value.length <= 28) {
    return value;
  }

  return `${value.slice(0, 14)}...${value.slice(-10)}`;
}

function DetailItem({
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: typeof Hash;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-400/10">
        <Icon className="h-4 w-4 text-purple-300" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>

        <p
          className={[
            "mt-1 break-all text-xs",
            highlight
              ? "font-bold text-emerald-400"
              : "text-slate-200",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function WithdrawalTransactionDetails({
  withdrawal,
}: WithdrawalTransactionDetailsProps) {
  const [copied, setCopied] =
    useState(false);

  const copyText = async (
    value: string,
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="space-y-5">
      {/* Amount */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-6 shadow-xl shadow-black/10">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Net amount
          </p>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            {formatUSDT(
              withdrawal.netAmount,
            )}
          </p>

          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {withdrawal.status}
            </span>
          </div>
        </div>
      </div>

      {/* Financial details */}
      <div className="rounded-3xl border border-white/8 bg-[#0B1426] px-5">
        <div className="border-b border-white/8 py-4">
          <h2 className="text-xs font-bold text-white">
            Transaction summary
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            Amount and withdrawal charges
          </p>
        </div>

        <div className="divide-y divide-white/8">
          <DetailItem
            label="Withdrawal amount"
            value={formatUSDT(
              withdrawal.amount,
            )}
            icon={Wallet}
          />

          <DetailItem
            label="Network fee"
            value={formatUSDT(
              withdrawal.fee,
            )}
            icon={Hash}
          />

          <DetailItem
            label="You receive"
            value={formatUSDT(
              withdrawal.netAmount,
            )}
            icon={CheckCircle2}
            highlight
          />
        </div>
      </div>

      {/* Destination */}
      <div className="rounded-3xl border border-white/8 bg-[#0B1426] px-5">
        <div className="border-b border-white/8 py-4">
          <h2 className="text-xs font-bold text-white">
            Destination
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            Wallet that received the withdrawal
          </p>
        </div>

        <div className="py-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Wallet address
          </p>

          <div className="mt-2 flex items-start gap-2">
            <div className="min-w-0 flex-1 rounded-xl border border-white/5 bg-[#07101F] p-3">
              <p
                title={
                  withdrawal.destinationAddress
                }
                className="break-all font-mono text-[10px] leading-5 text-white"
              >
                {withdrawal.destinationAddress}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                copyText(
                  withdrawal.destinationAddress,
                )
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-[#07101F] text-slate-400 transition hover:border-emerald-400/40 hover:text-emerald-400"
              aria-label="Copy destination address"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Blockchain details */}
      <div className="rounded-3xl border border-white/8 bg-[#0B1426] px-5">
        <div className="border-b border-white/8 py-4">
          <h2 className="text-xs font-bold text-white">
            Blockchain details
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            On-chain transaction information
          </p>
        </div>

        <div className="divide-y divide-white/8">
          <DetailItem
            label="Transaction ID"
            value={withdrawal.id}
            icon={Hash}
          />

          {withdrawal.txHash ? (
            <div className="flex items-start gap-3 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-400/10">
                <ExternalLink className="h-4 w-4 text-purple-300" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Transaction hash
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <p
                    title={withdrawal.txHash}
                    className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-200"
                  >
                    {shortenHash(
                      withdrawal.txHash,
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        withdrawal.txHash!,
                      )
                    }
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:text-emerald-400"
                    aria-label="Copy transaction hash"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <DetailItem
              label="Transaction hash"
              value="Not available yet"
              icon={Clock3}
            />
          )}

          <DetailItem
            label="Confirmations"
            value={`${withdrawal.confirmations} / ${withdrawal.requiredConfirmations}`}
            icon={CheckCircle2}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-3xl border border-white/8 bg-[#0B1426] px-5">
        <div className="border-b border-white/8 py-4">
          <h2 className="text-xs font-bold text-white">
            Timeline
          </h2>
        </div>

        <div className="divide-y divide-white/8">
          <TimelineItem
            label="Created"
            value={withdrawal.createdAt}
          />

          <TimelineItem
            label="Last updated"
            value={withdrawal.updatedAt}
          />

          {withdrawal.broadcastAt && (
            <TimelineItem
              label="Broadcast"
              value={withdrawal.broadcastAt}
            />
          )}

          {withdrawal.completedAt && (
            <TimelineItem
              label="Completed"
              value={withdrawal.completedAt}
            />
          )}

          {withdrawal.failedAt && (
            <TimelineItem
              label="Failed"
              value={withdrawal.failedAt}
            />
          )}

          {withdrawal.cancelledAt && (
            <TimelineItem
              label="Cancelled"
              value={withdrawal.cancelledAt}
            />
          )}
        </div>
      </div>

      {/* Failure */}
      {withdrawal.failureReason && (
        <div className="rounded-2xl border border-red-400/15 bg-red-400/10 p-4">
          <p className="text-xs font-bold text-red-200">
            Failure reason
          </p>

          <p className="mt-1 text-[10px] leading-5 text-red-100/60">
            {withdrawal.failureReason}
          </p>
        </div>
      )}
    </section>
  );
}

function TimelineItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-400/10">
          <Clock3 className="h-3.5 w-3.5 text-purple-300" />
        </div>

        <span className="text-[10px] text-slate-500">
          {label}
        </span>
      </div>

      <span className="text-right text-[10px] text-slate-200">
        {formatDate(value)}
      </span>
    </div>
  );
}

