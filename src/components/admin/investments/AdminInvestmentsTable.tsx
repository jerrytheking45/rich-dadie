'use client';

import { Eye, Loader2, WalletCards } from 'lucide-react';
import type { AdminInvestment } from '@/src/lib/api/admin';
import InvestmentStatusBadge from './InvestmentStatusBadge';

interface AdminInvestmentsTableProps {
  investments: AdminInvestment[];
  loading: boolean;
  onView: (investment: AdminInvestment) => void;
}

export default function AdminInvestmentsTable({
  investments,
  loading,
  onView,
}: AdminInvestmentsTableProps) {
  if (loading) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2.5 p-6 sm:min-h-60 sm:gap-3 sm:p-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 sm:h-11 sm:w-11 sm:rounded-2xl">
          <Loader2 className="h-4 w-4 animate-spin text-purple-300 sm:h-5 sm:w-5" />
        </div>

        <p className="text-xs text-slate-400 sm:text-sm">
          Loading investments...
        </p>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center sm:min-h-60 sm:p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/3 sm:h-12 sm:w-12 sm:rounded-2xl">
          <WalletCards className="h-4 w-4 text-slate-500 sm:h-5 sm:w-5" />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-300 sm:mt-4">
          No investments found
        </p>

        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Investments matching the current filters will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="space-y-2.5 p-3 md:hidden">
        {investments.map((investment) => (
          <article
            key={investment.id}
            className="rounded-xl border border-white/8 bg-white/2 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-200">
                  {investment.user_name}
                </p>

                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {investment.user_email}
                </p>
              </div>

              <InvestmentStatusBadge status={investment.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
              <MobileField
                label="Plan"
                value={investment.plan_name}
              />

              <MobileField
                label="Asset"
                value={investment.asset_symbol}
                mono
              />

              <MobileField
                label="Amount"
                value={`${investment.amount.toLocaleString()} ${investment.asset_symbol}`}
              />

              <MobileField
                label="Created"
                value={new Date(
                  investment.created_at,
                ).toLocaleDateString()}
              />
            </div>

            <button
              type="button"
              onClick={() => onView(investment)}
              className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-200"
            >
              <Eye className="h-3.5 w-3.5" />
              View Investment
            </button>
          </article>
        ))}
      </div>

      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 bg-white/2">
            <tr>
              <Th>User </Th>
              <Th>Plan</Th>
              <Th>Asset</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {investments.map((investment) => (
              <tr
                key={investment.id}
                className="transition-colors hover:bg-white/2.5"
              >
                <td className="px-4 py-3">
                  <p className="max-w-44 truncate font-semibold text-slate-200">
                    {investment.user_name}
                  </p>

                  <p className="mt-0.5 max-w-52 truncate text-xs text-slate-500">
                    {investment.user_email}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <span className="font-medium text-slate-300">
                    {investment.plan_name}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-lg border border-white/8 bg-white/3 px-2 py-1 font-mono text-xs font-semibold text-slate-300">
                    {investment.asset_symbol}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="font-bold text-white">
                    {investment.amount.toLocaleString()}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <InvestmentStatusBadge status={investment.status} />
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                  {new Date(
                    investment.created_at,
                  ).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onView(investment)}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/3 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-200"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MobileField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-600">
        {label}
      </p>

      <p
        className={`mt-0.5 truncate text-xs font-medium text-slate-300 ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value || '�'}
      </p>
    </div>
  );
}

function Th({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  );
}
