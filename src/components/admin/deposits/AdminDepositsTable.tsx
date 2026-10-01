'use client';

import {
  CheckCircle2,
  Eye,
  Loader2,
  UserRound,
  XCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';

import type { AdminDeposit } from '@/src/lib/api/admin';

import DepositStatusBadge from './DepositStatusBadge';

interface AdminDepositsTableProps {
  deposits: AdminDeposit[];
  loading?: boolean;
  processingId?: string | null;
  onView: (deposit: AdminDeposit) => void;
  onVerify: (deposit: AdminDeposit) => void;
  onReject: (deposit: AdminDeposit) => void;
}

export default function AdminDepositsTable({
  deposits,
  loading = false,
  processingId,
  onView,
  onVerify,
  onReject,
}: AdminDepositsTableProps) {
  if (loading) {
    return (
      <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-3 rounded-xl border border-white/5 bg-white/2.5 p-3 sm:rounded-2xl sm:p-4"
          >
            <div className="h-9 w-9 shrink-0 rounded-xl bg-white/6 sm:h-10 sm:w-10" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-28 rounded bg-white/6" />
              <div className="h-2.5 w-40 max-w-full rounded bg-white/4" />
            </div>

            <div className="hidden h-3 w-20 rounded bg-white/5 sm:block" />
            <div className="hidden h-6 w-20 rounded-full bg-white/5 md:block" />
          </div>
        ))}
      </div>
    );
  }

  if (!deposits.length) {
    return (
      <div className="p-8 text-center sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-white/20 sm:h-14 sm:w-14 sm:rounded-2xl">
          <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-white/75 sm:mt-4">
          No deposits found
        </h3>

        <p className="mx-auto mt-1 max-w-xs text-xs text-white/30">
          Try changing your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="space-y-2.5 p-3 md:hidden">
        {deposits.map((deposit) => {
          const processing = processingId === deposit.id;
          const normalizedStatus = deposit.status.trim().toUpperCase();
          const pending = normalizedStatus === 'PENDING';

          const confirmationPercentage =
            deposit.required_confirmations > 0
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    (deposit.confirmations /
                      deposit.required_confirmations) *
                      100,
                  ),
                )
              : 0;

          const initial =
            deposit.user_name?.trim().charAt(0).toUpperCase() || 'U';

          return (
            <article
              key={deposit.id}
              className="rounded-xl border border-white/[0.07] bg-[#07101F] p-3"
            >
              {/* User + status */}
              <div className="flex min-w-0 items-start justify-between gap-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-400/10 bg-purple-400/8 text-xs font-bold text-purple-300">
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white/85">
                      {deposit.user_name}
                    </p>

                    <p className="truncate text-[10px] text-white/30">
                      {deposit.user_email}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <DepositStatusBadge status={deposit.status} />
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-white/5 pt-3">
                <MobileField
                  label="Amount"
                  value={`${deposit.expected_amount} ${deposit.asset_symbol}`}
                />

                <MobileField
                  label="Network"
                  value={deposit.network_name}
                />

                <MobileField
                  label="Received"
                  value={`${deposit.received_amount} ${deposit.asset_symbol}`}
                />

                <MobileField
                  label="Confirmations"
                  value={`${deposit.confirmations} / ${deposit.required_confirmations}`}
                />
              </div>

              {/* Progress */}
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[9px]">
                  <span className="uppercase tracking-wide text-white/25">
                    Blockchain progress
                  </span>

                  <span className="font-semibold text-white/45">
                    {Math.round(confirmationPercentage)}%
                  </span>
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-400 transition-all"
                    style={{
                      width: `${confirmationPercentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onView(deposit)}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/7 bg-white/3 text-[10px] font-semibold text-white/55 transition hover:bg-white/7 hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>

                {pending ? (
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => onVerify(deposit)}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-400/5 text-[10px] font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {processing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}

                    {processing ? 'Processing' : 'Verify'}
                  </button>
                ) : (
                  <div />
                )}
              </div>

              {pending && (
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => onReject(deposit)}
                  className="mt-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/5 text-[10px] font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject Deposit
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/7 bg-white/[0.018]">
              <Th>User</Th>
              <Th>Amount</Th>
              <Th>Asset</Th>
              <Th>Network</Th>
              <Th>Status</Th>
              <Th>Confirmations</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {deposits.map((deposit) => {
              const processing = processingId === deposit.id;
              const normalizedStatus = deposit.status.trim().toUpperCase();
              const pending = normalizedStatus === 'PENDING';

              const confirmationPercentage =
                deposit.required_confirmations > 0
                  ? Math.max(
                      0,
                      Math.min(
                        100,
                        (deposit.confirmations /
                          deposit.required_confirmations) *
                          100,
                      ),
                    )
                  : 0;

              const initial =
                deposit.user_name?.trim().charAt(0).toUpperCase() || 'U';

              return (
                <tr
                  key={deposit.id}
                  className="group transition hover:bg-white/2.5"
                >
                  <td className="px-3 py-3.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-400/10 bg-purple-400/8 text-xs font-bold text-purple-300">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-40 truncate text-xs font-semibold text-white/80">
                          {deposit.user_name}
                        </p>

                        <p className="mt-0.5 max-w-40 truncate text-[10px] text-white/30">
                          {deposit.user_email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <p className="text-xs font-semibold text-white/80">
                      {deposit.expected_amount}
                    </p>

                    {deposit.received_amount !==
                      deposit.expected_amount && (
                      <p className="mt-0.5 text-[10px] text-white/30">
                        Received: {deposit.received_amount}
                      </p>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <span className="rounded-md border border-white/7 bg-white/4 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white/55">
                      {deposit.asset_symbol}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5 text-[10px] text-white/45">
                    {deposit.network_name}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <DepositStatusBadge status={deposit.status} />
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <div className="min-w-24">
                      <div className="mb-1 flex items-center justify-between text-[9px]">
                        <span className="font-semibold text-white/55">
                          {deposit.confirmations}
                        </span>

                        <span className="text-white/25">
                          {deposit.required_confirmations}
                        </span>
                      </div>

                      <div className="h-1 overflow-hidden rounded-full bg-white/6">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-400 transition-all"
                          style={{
                            width: `${confirmationPercentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(deposit)}
                        className="inline-flex items-center gap-1 rounded-md border border-white/7 bg-white/3 px-2 py-1.5 text-[9px] font-semibold text-white/45 transition hover:bg-white/7 hover:text-white"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      {pending && (
                        <>
                          <button
                            type="button"
                            disabled={processing}
                            onClick={() => onVerify(deposit)}
                            className="inline-flex items-center gap-1 rounded-md border border-emerald-400/10 bg-emerald-400/5 px-2 py-1.5 text-[9px] font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            {processing ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {processing ? 'Processing' : 'Verify'}
                          </button>

                          <button
                            type="button"
                            disabled={processing}
                            onClick={() => onReject(deposit)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-400/10 bg-red-400/5 px-2 py-1.5 text-[9px] font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <XCircle className="h-3 w-3" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MobileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-white/25">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[11px] font-medium text-white/65">
        {value}
      </p>
    </div>
  );
}

function Th({
  children,
  align = 'left',
}: {
  children: ReactNode;
  align?: 'left' | 'right';
}) {
  const alignment =
    align === 'right' ? 'text-right' : 'text-left';

  return (
    <th
      className={`px-3 py-2.5 ${alignment} text-[9px] font-semibold uppercase tracking-[0.12em] text-white/25`}
    >
      {children}
    </th>
  );
}
