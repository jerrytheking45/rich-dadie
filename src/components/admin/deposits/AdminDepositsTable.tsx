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
      <div className="space-y-3 p-5">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex animate-pulse items-center gap-4 rounded-2xl border border-white/5 bg-white/2.5 p-4"
            >
              <div className="h-10 w-10 rounded-xl bg-white/6" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-white/6" />
                <div className="h-2.5 w-48 rounded bg-white/4" />
              </div>

              <div className="hidden h-3 w-20 rounded bg-white/5 sm:block" />

              <div className="hidden h-6 w-20 rounded-full bg-white/5 md:block" />
            </div>
          ),
        )}
      </div>
    );
  }

  if (!deposits.length) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-white/20">
          <UserRound className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-white/75">
          No deposits found
        </h3>

        <p className="mt-1 text-xs text-white/30">
          Try changing your filters or search
          criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-262.5 w-full">
        <thead>
          <tr className="border-b border-white/7 bg-white/[0.018]">
            <Th>User</Th>
            <Th>Amount</Th>
            <Th>Asset</Th>
            <Th>Network</Th>
            <Th>Status</Th>
            <Th>Confirmations</Th>
            <Th align="right">
              Actions
            </Th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {deposits.map((deposit) => {
            const processing =
              processingId === deposit.id;

            const normalizedStatus =
              deposit.status
                .trim()
                .toUpperCase();

            const pending =
              normalizedStatus === 'PENDING';

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
              deposit.user_name
                ?.trim()
                .charAt(0)
                .toUpperCase() || 'U';

            return (
              <tr
                key={deposit.id}
                className="group transition hover:bg-white/2.5"
              >
                <td className="px-5 py-4">
                  <div className="flex min-w-57.5 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/8 text-sm font-bold text-purple-300">
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/80">
                        {deposit.user_name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-white/30">
                        {deposit.user_email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <p className="text-sm font-semibold text-white/80">
                    {deposit.expected_amount}
                  </p>

                  {deposit.received_amount !==
                    deposit.expected_amount && (
                    <p className="mt-0.5 text-[11px] text-white/30">
                      Received:{' '}
                      {deposit.received_amount}
                    </p>
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className="rounded-lg border border-white/7 bg-white/4 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/55">
                    {deposit.asset_symbol}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-xs text-white/45">
                  {deposit.network_name}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <DepositStatusBadge
                    status={deposit.status}
                  />
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <div className="min-w-30">
                    <div className="mb-1.5 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-white/55">
                        {deposit.confirmations}
                      </span>

                      <span className="text-white/25">
                        {
                          deposit.required_confirmations
                        }
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

                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onView(deposit)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/7 bg-white/3 px-2.5 py-1.5 text-[10px] font-semibold text-white/45 transition hover:bg-white/7 hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>

                    {pending && (
                      <>
                        <button
                          type="button"
                          disabled={processing}
                          onClick={() =>
                            onVerify(deposit)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          {processing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}

                          {processing
                            ? 'Processing'
                            : 'Verify'}
                        </button>

                        <button
                          type="button"
                          disabled={processing}
                          onClick={() =>
                            onReject(deposit)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/5 px-2.5 py-1.5 text-[10px] font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <XCircle className="h-3.5 w-3.5" />
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
    align === 'right'
      ? 'text-right'
      : 'text-left';

  return (
    <th
      className={`px-5 py-3 ${alignment} text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25`}
    >
      {children}
    </th>
  );
}