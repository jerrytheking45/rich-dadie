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

function formatDate(value: string | null): string {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
      <div className="flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#07182F] shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white sm:text-lg">
              {data?.plan.name ?? 'Plan Investors'}
            </h2>

            {data && (
              <div className="mt-1 flex min-w-0 items-center gap-2">
                <PlanStatusBadge status={data.plan.status} />

                <span className="truncate text-[10px] text-gray-500 sm:text-xs">
                  Investor overview
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white sm:h-9 sm:w-9"
            aria-label="Close investor overview"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {loading ? (
            <div className="flex min-h-60 items-center justify-center px-4 sm:min-h-75">
              <p className="text-sm text-gray-400">
                Loading investors...
              </p>
            </div>
          ) : !data ? (
            <div className="p-8 text-center sm:p-10">
              <p className="text-sm text-gray-400">
                Unable to load investor information.
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-4 sm:space-y-5 sm:p-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                <SummaryCard
                  label="Total Investors"
                  value={String(data.summary.totalUsers)}
                />

                <SummaryCard
                  label="Active"
                  value={String(data.summary.activeUsers)}
                />

                <SummaryCard
                  label="Matured"
                  value={String(data.summary.maturedUsers)}
                />

                <SummaryCard
                  label="Total Invested"
                  value={`${money(data.summary.totalInvested)} USDT`}
                  accent
                />
              </div>

              {data.users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                  <p className="text-sm text-gray-500">
                    No investors yet.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile investor cards */}
                  <div className="space-y-2.5 md:hidden">
                    {data.users.map((investor) => (
                      <InvestorCard
                        key={investor.investmentId}
                        investor={investor}
                      />
                    ))}
                  </div>

                  {/* Desktop/tablet investor table */}
                  <div className="hidden overflow-hidden rounded-xl border border-white/10 md:block">
                    <div className="max-h-[58vh] overflow-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 z-10 bg-[#0C2244]">
                          <tr className="border-b border-white/10">
                            <Th>Investor</Th>
                            <Th>Employee ID</Th>
                            <Th>Amount</Th>
                            <Th>Expected</Th>
                            <Th>Actual</Th>
                            <Th>Projected</Th>
                            <Th>Status</Th>
                            <Th>Progress</Th>
                            <Th>Maturity</Th>
                          </tr>
                        </thead>

                        <tbody>
                          {data.users.map((investor) => (
                            <tr
                              key={investor.investmentId}
                              className="border-b border-white/5 last:border-0"
                            >
                              <td className="px-3 py-3">
                                <p className="text-sm font-medium text-white">
                                  {investor.userName}
                                </p>

                                <p className="max-w-44 truncate text-[10px] text-gray-500">
                                  {investor.email}
                                </p>
                              </td>

                              <td className="px-3 py-3 text-xs text-gray-300">
                                {investor.employeeId || '—'}
                              </td>

                              <td className="px-3 py-3 text-xs text-white">
                                {money(investor.amount)} USDT
                              </td>

                              <td className="px-3 py-3 text-xs text-gray-300">
                                {money(
                                  investor.expectedReturn,
                                )}{' '}
                                USDT
                              </td>

                              <td className="px-3 py-3 text-xs text-gray-300">
                                {money(
                                  investor.actualReturn,
                                )}{' '}
                                USDT
                              </td>

                              <td className="px-3 py-3 text-xs font-medium text-green-400">
                                {money(
                                  investor.projectedValue,
                                )}{' '}
                                USDT
                              </td>

                              <td className="px-3 py-3">
                                <span className="text-[10px] font-medium text-gray-300">
                                  {investor.status}
                                </span>
                              </td>

                              <td className="px-3 py-3">
                                <Progress value={investor.progress} />
                              </td>

                              <td className="px-3 py-3 text-xs text-gray-300">
                                {formatDate(
                                  investor.maturityDate,
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/3 p-3 sm:p-4">
      <p className="truncate text-[9px] text-gray-500 sm:text-xs">
        {label}
      </p>

      <p
        className={[
          'mt-1 truncate text-sm font-semibold sm:text-xl',
          accent ? 'text-green-400' : 'text-white',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}

function InvestorCard({
  investor,
}: {
  investor: AdminPlanWithInvestors['users'][number];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/2 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {investor.userName}
          </p>

          <p className="truncate text-[10px] text-gray-500">
            {investor.email}
          </p>

          <p className="mt-0.5 text-[10px] text-gray-600">
            Employee ID: {investor.employeeId || '—'}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[9px] font-medium text-gray-300">
          {investor.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        <MobileField
          label="Amount"
          value={`${money(investor.amount)} USDT`}
        />

        <MobileField
          label="Expected"
          value={`${money(investor.expectedReturn)} USDT`}
        />

        <MobileField
          label="Actual"
          value={`${money(investor.actualReturn)} USDT`}
        />

        <MobileField
          label="Projected"
          value={`${money(investor.projectedValue)} USDT`}
          accent
        />

        <MobileField
          label="Maturity"
          value={formatDate(investor.maturityDate)}
        />
      </div>

      <div className="mt-3 border-t border-white/5 pt-2.5">
        <Progress value={investor.progress} />
      </div>
    </div>
  );
}

function MobileField({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] text-gray-600">{label}</p>

      <p
        className={[
          'truncate text-[11px] font-medium',
          accent ? 'text-green-400' : 'text-gray-300',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-[9px]">
        <span className="text-gray-600">Progress</span>

        <span className="text-gray-300">{progress}%</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-green-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-400">
      {children}
    </th>
  );
}
