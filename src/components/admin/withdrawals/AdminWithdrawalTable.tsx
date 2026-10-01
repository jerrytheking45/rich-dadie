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

function MobileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <div className="mt-0.5 min-w-0 text-xs text-slate-300">
        {children}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
      {children}
    </th>
  );
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
      <div className="flex min-h-56 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426]">
        <div className="flex flex-col items-center gap-2.5">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />

          <p className="text-xs text-slate-500">
            Loading withdrawals...
          </p>
        </div>
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] px-5 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/3">
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
      {/* Mobile cards */}
      <div className="divide-y divide-white/5 md:hidden">
        {withdrawals.map((withdrawal) => (
          <article
            key={withdrawal.id}
            className="p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelect(withdrawal)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate font-mono text-xs font-semibold text-slate-200">
                  {shorten(withdrawal.id)}
                </p>

                <p className="mt-0.5 truncate font-mono text-[10px] text-slate-600">
                  {shorten(withdrawal.user_id)}
                </p>
              </button>

              <WithdrawalStatusBadge
                status={withdrawal.status}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
              <MobileField label="Amount">
                <p className="font-semibold text-white">
                  {formatAmount(withdrawal.amount)}{" "}
                  <span className="text-[10px] font-medium text-slate-500">
                    USDT
                  </span>
                </p>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Net {formatAmount(withdrawal.net_amount)} · Fee{" "}
                  {formatAmount(withdrawal.fee)}
                </p>
              </MobileField>

              <MobileField label="Created">
                <p className="text-[11px] text-slate-400">
                  {formatDate(withdrawal.created_at)}
                </p>
              </MobileField>

              <MobileField label="Destination">
                <p className="break-all font-mono text-[10px] leading-4 text-slate-400">
                  {withdrawal.destination_address}
                </p>
              </MobileField>

              <MobileField label="Network">
                <p className="font-mono text-[10px] text-slate-400">
                  {withdrawal.network_id}
                </p>
              </MobileField>
            </div>

            <button
              type="button"
              onClick={() => onSelect(withdrawal)}
              className="mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-purple-400/15 bg-purple-400/10 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-400/15"
            >
              <Eye className="h-3.5 w-3.5" />
              View withdrawal
            </button>
          </article>
        ))}
      </div>

      {/* Tablet / desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <Th>Withdrawal</Th>
              <Th>User</Th>
              <Th>Destination</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Created</Th>

              <th className="px-4 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {withdrawals.map((withdrawal) => (
              <tr
                key={withdrawal.id}
                className="transition-colors hover:bg-white/2.5"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(withdrawal)}
                    className="text-left"
                  >
                    <p className="font-mono text-[11px] font-semibold text-slate-200">
                      {shorten(withdrawal.id)}
                    </p>

                    <p className="mt-0.5 text-[9px] text-slate-600">
                      {withdrawal.asset_id.slice(0, 8)} ·{" "}
                      {withdrawal.network_id.slice(0, 8)}
                    </p>
                  </button>
                </td>

                <td className="px-4 py-3">
                  <p className="font-mono text-[11px] text-slate-400">
                    {shorten(withdrawal.user_id)}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <p className="max-w-55 truncate font-mono text-[10px] text-slate-400">
                    {withdrawal.destination_address}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <p className="text-xs font-semibold text-white">
                    {formatAmount(withdrawal.amount)}{" "}
                    <span className="text-[10px] font-medium text-slate-500">
                      USDT
                    </span>
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-600">
                    Net {formatAmount(withdrawal.net_amount)} · Fee{" "}
                    {formatAmount(withdrawal.fee)}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <WithdrawalStatusBadge
                    status={withdrawal.status}
                  />
                </td>

                <td className="px-4 py-3 text-[10px] text-slate-500">
                  {formatDate(withdrawal.created_at)}
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onSelect(withdrawal)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-2.5 py-1.5 text-[10px] font-medium text-slate-400 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-300"
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
      <div className="flex flex-col gap-2.5 border-t border-white/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-slate-600">
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

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!canPrevious}
            onClick={() =>
              onPageChange(page - 1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-500 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="min-w-20 rounded-lg border border-purple-400/15 bg-purple-400/10 px-2.5 py-2 text-center text-[10px] font-medium text-purple-300">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={!canNext}
            onClick={() =>
              onPageChange(page + 1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-500 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
