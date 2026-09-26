
'use client';

import { Eye, Pencil, Trash2, UserRound, Power } from 'lucide-react';
import Image from "next/image";

import type { AdminInvestmentPlan } from '@/src/lib/types/admin';

import PlanStatusBadge from './PlanStatusBadge';

interface AdminPlansTableProps {
  plans: AdminInvestmentPlan[];
  superAdmin?: boolean;
  onView: (plan: AdminInvestmentPlan) => void;
  onViewInvestors: (plan: AdminInvestmentPlan) => void;
  onEdit?: (plan: AdminInvestmentPlan) => void;
  onPublish?: (plan: AdminInvestmentPlan) => void;
  onDelete?: (plan: AdminInvestmentPlan) => void;
}

function formatUSDT(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AdminPlansTable({
  plans,
  superAdmin = false,
  onView,
  onViewInvestors,
  onEdit,
  onPublish,
  onDelete,
}: AdminPlansTableProps) {
  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/2 p-10 text-center">
        <p className="text-sm text-gray-400">
          No investment plans found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-262.5 w-full">
          <thead className="bg-white/3">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Plan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Minimum
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Return
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                Featured
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/2"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {plan.image ? (
                      <Image
                        src={plan.image}
                        alt={plan.name}
                        width={600}
                        height={400}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold text-gray-400">
                        {plan.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {plan.name}
                      </p>

                      <p className="max-w-65 truncate text-xs text-gray-500">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-white">
                  {formatUSDT(plan.minimumAmount)} USDT
                </td>

                <td className="px-4 py-4 text-sm text-gray-300">
                  {plan.durationDays === 0
                    ? 'Instant'
                    : `${plan.durationDays} days`}
                </td>

                <td className="px-4 py-4 text-sm font-medium text-green-400">
                  {plan.expectedReturnRate}%
                </td>

                <td className="px-4 py-4">
                  <PlanStatusBadge status={plan.status} />
                </td>

                <td className="px-4 py-4">
                  {plan.featured ? (
                    <span className="text-xs font-medium text-yellow-400">
                      Yes
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      No
                    </span>
                  )}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(plan)}
                      title="View plan"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewInvestors(plan)}
                      title="View investors"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <UserRound className="h-4 w-4" />
                    </button>

                    {superAdmin && onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(plan)}
                        title="Edit plan"
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}

                    {superAdmin && onPublish && (
                      <button
                        type="button"
                        onClick={() => onPublish(plan)}
                        title={
                          plan.status === 'PUBLISHED'
                            ? 'Unpublish plan'
                            : 'Publish plan'
                        }
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                    )}

                    {superAdmin && onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(plan)}
                        title="Delete plan"
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}