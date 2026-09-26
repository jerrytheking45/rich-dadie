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
      <div className="flex min-h-60 flex-col items-center justify-center gap-3 p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10">
          <Loader2 className="h-5 w-5 animate-spin text-purple-300" />
        </div>
        <p className="text-sm text-slate-400">Loading investments...</p>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/3">
          <WalletCards className="h-5 w-5 text-slate-500" />
        </div>

        <p className="mt-4 text-sm font-medium text-slate-300">
          No investments found
        </p>

        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Investments matching the current filters will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-225 text-left text-sm">
        <thead className="border-b border-white/8 bg-white/2">
          <tr>
            <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              User
            </th>

            <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Plan
            </th>

            <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Asset
            </th>

            <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Amount
            </th>

            <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Status
            </th>

            <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Created
            </th>

            <th className="px-5 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/6">
          {investments.map((investment) => (
            <tr
              key={investment.id}
              className="transition-colors hover:bg-white/2.5"
            >
              <td className="px-5 py-4">
                <p className="max-w-47.5 truncate font-semibold text-slate-200">
                  {investment.user_name}
                </p>

                <p className="mt-0.5 max-w-52.5 truncate text-xs text-slate-500">
                  {investment.user_email}
                </p>
              </td>

              <td className="px-5 py-4">
                <span className="font-medium text-slate-300">
                  {investment.plan_name}
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex rounded-lg border border-white/8 bg-white/3 px-2.5 py-1 font-mono text-xs font-semibold text-slate-300">
                  {investment.asset_symbol}
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="font-bold text-white">
                  {investment.amount.toLocaleString()}
                </span>
              </td>

              <td className="px-5 py-4">
                <InvestmentStatusBadge status={investment.status} />
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                {new Date(investment.created_at).toLocaleDateString()}
              </td>

              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onView(investment)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-purple-200"
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
  );
}