'use client';

import {
  Eye,
  Loader2,
  UserRound,
  XCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';

import type { AdminAccountDeposit } from '@/src/lib/api/admin';

import DepositStatusBadge from '../deposits/DepositStatusBadge';

interface AdminAccountDepositsTableProps {
  deposits: AdminAccountDeposit[];
  loading?: boolean;
  processingId?: string | null;
  onView: (deposit: AdminAccountDeposit) => void;
  onReject: (deposit: AdminAccountDeposit) => void;
}

export default function AdminAccountDepositsTable({
  deposits,
  loading = false,
  processingId,
  onView,
  onReject,
}: AdminAccountDepositsTableProps) {
  if (loading) {
    return (
      <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-3 rounded-xl border border-white/5 bg-white/2.5 p-3 sm:gap-4 sm:rounded-2xl sm:p-4"
          >
            <div className="h-9 w-9 shrink-0 rounded-lg bg-white/6 sm:h-10 sm:w-10 sm:rounded-xl" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-28 rounded bg-white/6 sm:w-32" />
              <div className="h-2.5 w-40 max-w-full rounded bg-white/4 sm:w-48" />
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
      <div className="px-4 py-10 text-center sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-white/20 sm:h-14 sm:w-14 sm:rounded-2xl">
          <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-white/75 sm:mt-4">
          No account deposits found
        </h3>

        <p className="mx-auto mt-1 max-w-xs text-xs text-white/30">
          Try changing your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="divide-y divide-white/5 md:hidden">
        {deposits.map((deposit) => {
          const processing = processingId === deposit.id;

          const normalizedStatus = deposit.status
            .trim()
            .toUpperCase();

          const canReject =
            normalizedStatus === 'PENDING' ||
            normalizedStatus === 'VERIFYING' ||
            normalizedStatus === 'PROCESSING';

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
            <article key={deposit.id} className="p-3.5 sm:p-4">
              {/* User + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-400/10 bg-purple-400/8 text-xs font-bold text-purple-300">
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white/85">
                      {deposit.user_name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-white/30">
                      {deposit.user_email}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <DepositStatusBadge status={deposit.status} />
                </div>
              </div>

              {/* Deposit details */}
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
                <MobileField label="Amount">
                  <span className="text-xs font-semibold text-white/80">
                    {deposit.expected_amount}
                  </span>

                  {deposit.received_amount !== deposit.expected_amount && (
                    <span className="mt-0.5 block text-[9px] text-white/30">
                      Received: {deposit.received_amount}
                    </span>
                  )}
                </MobileField>

                <MobileField label="Asset">
                  <span className="inline-flex w-fit rounded-md border border-white/7 bg-white/4 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white/55">
                    {deposit.asset_symbol}
                  </span>
                </MobileField>

                <MobileField label="Network">
                  <span className="truncate text-[11px] text-white/50">
                    {deposit.network_name}
                  </span>
                </MobileField>

                <MobileField label="Confirmations">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center justify-between text-[9px]">
                      <span className="font-semibold text-white/60">
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
                </MobileField>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onView(deposit)}
                  className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/7 bg-white/3 px-2.5 text-[10px] font-semibold text-white/60 transition hover:bg-white/7 hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>

                {canReject && (
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => onReject(deposit)}
                    className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/5 px-2.5 text-[10px] font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {processing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}

                    {processing ? 'Processing' : 'Reject'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop table */}
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

              const normalizedStatus = deposit.status
                .trim()
                .toUpperCase();

              const canReject =
                normalizedStatus === 'PENDING' ||
                normalizedStatus === 'VERIFYING' ||
                normalizedStatus === 'PROCESSING';

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
                    <div className="flex min-w-48 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-400/10 bg-purple-400/8 text-xs font-bold text-purple-300">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white/80">
                          {deposit.user_name}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-white/30">
                          {deposit.user_email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <p className="text-xs font-semibold text-white/80">
                      {deposit.expected_amount}
                    </p>

                    {deposit.received_amount !== deposit.expected_amount && (
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

                  <td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-white/45">
                    {deposit.network_name}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <DepositStatusBadge status={deposit.status} />
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    <div className="w-24">
                      <div className="mb-1 flex items-center justify-between text-[9px]">
                        <span className="font-semibold text-white/55">
                          {deposit.confirmations}
                        </span>

                        <span className="text-white/25">
                          {deposit.required_confirmations}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
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
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(deposit)}
                        className="inline-flex items-center gap-1 rounded-md border border-white/7 bg-white/3 px-2 py-1.5 text-[9px] font-semibold text-white/45 transition hover:bg-white/7 hover:text-white"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      {canReject && (
                        <button
                          type="button"
                          disabled={processing}
                          onClick={() => onReject(deposit)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-400/10 bg-red-400/5 px-2 py-1.5 text-[9px] font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          {processing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}

                          {processing ? 'Processing' : 'Reject'}
                        </button>
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
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-white/25">
        {label}
      </p>
      <div className="min-w-0">{children}</div>
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
  const alignment = align === 'right' ? 'text-right' : 'text-left';

  return (
    <th
      className={`px-3 py-2.5 ${alignment} text-[9px] font-semibold uppercase tracking-widest text-white/25`}
    >
      {children}
    </th>
  );
}
