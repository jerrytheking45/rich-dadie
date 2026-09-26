
'use client';

import { X } from 'lucide-react';

import type {
  AdminPlanWithInvestors,
} from '@/src/lib/types/admin';

import PlanStatusBadge from './PlanStatusBadge';

interface PlanInvestorsModalProps {
  data: AdminPlanWithInvestors | null;
  loading: boolean;
  onClose: () => void;
}

function money(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString();
}

export default function PlanInvestorsModal({
  data,
  loading,
  onClose,
}: PlanInvestorsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#07182F] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {data?.plan.name ?? 'Plan Investors'}
            </h2>

            {data && (
              <div className="mt-1 flex items-center gap-2">
                <PlanStatusBadge
                  status={data.plan.status}
                />

                <span className="text-xs text-gray-500">
                  Investor overview
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-75 items-center justify-center">
            <p className="text-sm text-gray-400">
              Loading investors...
            </p>
          </div>
        ) : !data ? (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-400">
              Unable to load investor information.
            </p>
          </div>
        ) : (
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                <p className="text-xs text-gray-500">
                  Total Investors
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {data.summary.totalUsers}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                <p className="text-xs text-gray-500">
                  Active
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {data.summary.activeUsers}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                <p className="text-xs text-gray-500">
                  Matured
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {data.summary.maturedUsers}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                <p className="text-xs text-gray-500">
                  Total Invested
                </p>

                <p className="mt-1 text-xl font-semibold text-green-400">
                  {money(
                    data.summary.totalInvested,
                  )}{' '}
                  USDT
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="max-h-[55vh] overflow-auto">
                <table className="min-w-287.5 w-full">
                  <thead className="sticky top-0 bg-[#0C2244]">
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Investor
                      </th>

                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Employee ID
                      </th>

                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Expected
                      </th>

                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Actual
                      </th>

                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Projected
                      </th>

                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Progress
                      </th>

                      <th className="px-4 py-3 text-left text-xs text-gray-400">
                        Maturity
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-10 text-center text-sm text-gray-500"
                        >
                          No investors yet.
                        </td>
                      </tr>
                    ) : (
                      data.users.map((investor) => (
                        <tr
                          key={investor.investmentId}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="px-4 py-4">
                            <p className="font-medium text-white">
                              {investor.userName}
                            </p>

                            <p className="text-xs text-gray-500">
                              {investor.email}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-300">
                            {investor.employeeId || '—'}
                          </td>

                          <td className="px-4 py-4 text-sm text-white">
                            {money(investor.amount)} USDT
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-300">
                            {money(
                              investor.expectedReturn,
                            )}{' '}
                            USDT
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-300">
                            {money(
                              investor.actualReturn,
                            )}{' '}
                            USDT
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-green-400">
                            {money(
                              investor.projectedValue,
                            )}{' '}
                            USDT
                          </td>

                          <td className="px-4 py-4">
                            <span className="text-xs font-medium text-gray-300">
                              {investor.status}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="w-28">
                              <div className="mb-1 flex justify-between text-xs">
                                <span className="text-gray-500">
                                  Progress
                                </span>

                                <span className="text-gray-300">
                                  {investor.progress}%
                                </span>
                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div
                                  className="h-full rounded-full bg-green-400"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        investor.progress,
                                      ),
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-300">
                            {formatDate(investor.maturityDate)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}