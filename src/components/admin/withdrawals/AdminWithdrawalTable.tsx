"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  WalletCards,
} from "lucide-react";

import type { AdminWithdrawal } from "@/src/lib/api/admin";

import WithdrawalStatusBadge from "./WithdrawalStatusBadge";

interface AdminWithdrawalTableProps {
  withdrawals: AdminWithdrawal[];
  page: number;
  pageSize: number;
  total: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onSelect: (withdrawal: AdminWithdrawal) => void;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

function shorten(value: string): string {
  if (!value) return "—";

  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 9)}…${value.slice(-7)}`;
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

export default function AdminWithdrawalTable({
  withdrawals,
  page,
  pageSize,
  total,
  loading = false,
  onPageChange,
  onSelect,
}: AdminWithdrawalTableProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize),
  );

  const canPrevious = page > 1;
  const canNext = page < totalPages;

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-purple-400" />

          <p className="text-sm text-slate-500">
            Loading withdrawals...
          </p>
        </div>
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/3">
          <WalletCards className="h-5 w-5 text-slate-600" />
        </div>

        <p className="text-sm font-semibold text-slate-300">
          No withdrawals found
        </p>

        <p className="mt-1 max-w-sm text-xs leading-5 text-slate-600">
          Try changing the status filter or search criteria.
        </p>
      </div>
    );
  }

  const firstItem =
    total > 0
      ? Math.min(
          total,
          (page - 1) * pageSize + 1,
        )
      : 0;

  const lastItem =
    total > 0
      ? Math.min(page * pageSize, total)
      : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
      <div className="overflow-x-auto">
        <table className="min-w-275 w-full text-left">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Withdrawal
              </th>

              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                User
              </th>

              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Destination
              </th>

              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Amount
              </th>

              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Created
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {withdrawals.map((withdrawal) => (
              <tr
                key={withdrawal.id}
                className="transition-colors hover:bg-white/[2.5"
              >
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      onSelect(withdrawal)
                    }
                    className="text-left"
                  >
                    <p className="font-mono text-xs font-semibold text-slate-200">
                      {shorten(withdrawal.id)}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-600">
                      {withdrawal.asset_id.slice(0, 8)} ·{" "}
                      {withdrawal.network_id.slice(0, 8)}
                    </p>
                  </button>
                </td>

                <td className="px-5 py-4">
                  <p className="font-mono text-xs text-slate-400">
                    {shorten(withdrawal.user_id)}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="max-w-55 truncate font-mono text-xs text-slate-400">
                    {withdrawal.destination_address}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-white">
                    {formatAmount(withdrawal.amount)}{" "}
                    <span className="text-xs font-medium text-slate-500">
                      USDT
                    </span>
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Net{" "}
                    {formatAmount(
                      withdrawal.net_amount,
                    )}{" "}
                    · Fee{" "}
                    {formatAmount(withdrawal.fee)}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <WithdrawalStatusBadge
                    status={withdrawal.status}
                  />
                </td>

                <td className="px-5 py-4 text-xs text-slate-500">
                  {formatDate(withdrawal.created_at)}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      onSelect(withdrawal)
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-300"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-white/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-600">
          Showing{" "}
          <span className="font-medium text-slate-400">
            {firstItem}
          </span>{" "}
          –{" "}
          <span className="font-medium text-slate-400">
            {lastItem}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-400">
            {total}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canPrevious}
            onClick={() =>
              onPageChange(page - 1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-500 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="min-w-22 rounded-xl border border-purple-400/15 bg-purple-400/10 px-3 py-2 text-center text-xs font-medium text-purple-300">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={!canNext}
            onClick={() =>
              onPageChange(page + 1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-500 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}