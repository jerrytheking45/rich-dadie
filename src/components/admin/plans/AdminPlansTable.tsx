'use client';

import {
  Eye,
  Pencil,
  Power,
  Trash2,
  UserRound,
} from 'lucide-react';
import Image from 'next/image';

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

function MobileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/30">
        {label}
      </p>
      <div className="mt-0.5 text-xs text-white/70">
        {children}
      </div>
    </div>
  );
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
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center sm:p-8">
        <p className="text-sm text-white/45">
          No investment plans found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      {/* Mobile */}
      <div className="space-y-2.5 p-3 md:hidden">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className="rounded-xl border border-white/7 bg-white/[0.02] p-3"
          >
            <div className="flex items-start gap-3">
              {plan.image ? (
                <Image
                  src={plan.image}
                  alt={plan.name}
                  width={80}
                  height={80}
                  className="h-11 w-11 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold text-white/45">
                  {plan.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {plan.name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-white/30">
                      {plan.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <PlanStatusBadge status={plan.status} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-white/5 bg-black/10 p-2.5 sm:grid-cols-4">
              <MobileField label="Minimum">
                <span className="font-medium text-white/80">
                  {formatUSDT(plan.minimumAmount)} USDT
                </span>
              </MobileField>

              <MobileField label="Duration">
                {plan.durationDays === 0
                  ? 'Instant'
                  : `${plan.durationDays} days`}
              </MobileField>

              <MobileField label="Return">
                <span className="font-medium text-emerald-300">
                  {plan.expectedReturnRate}%
                </span>
              </MobileField>

              <MobileField label="Featured">
                {plan.featured ? (
                  <span className="font-medium text-yellow-300">
                    Yes
                  </span>
                ) : (
                  <span className="text-white/35">
                    No
                  </span>
                )}
              </MobileField>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onView(plan)}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 text-[11px] font-semibold text-white/65 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>

              <button
                type="button"
                onClick={() => onViewInvestors(plan)}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 text-[11px] font-semibold text-white/65 transition hover:bg-white/[0.06] hover:text-white"
              >
                <UserRound className="h-3.5 w-3.5" />
                Investors
              </button>

              {superAdmin && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(plan)}
                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 text-[11px] font-semibold text-white/65 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}

              {superAdmin && onPublish && (
                <button
                  type="button"
                  onClick={() => onPublish(plan)}
                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 text-[11px] font-semibold text-white/65 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Power className="h-3.5 w-3.5" />
                  {plan.status === 'PUBLISHED'
                    ? 'Unpublish'
                    : 'Publish'}
                </button>
              )}

              {superAdmin && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(plan)}
                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/[0.03] px-2.5 text-[11px] font-semibold text-red-300/75 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Tablet / Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead className="bg-white/[0.03]">
            <tr className="border-b border-white/10">
              <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wide text-white/35">
                Plan
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wide text-white/35">
                Minimum
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wide text-white/35">
                Duration
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wide text-white/35">
                Return
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wide text-white/35">
                Status
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wide text-white/35">
                Featured
              </th>
              <th className="px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-wide text-white/35">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    {plan.image ? (
                      <Image
                        src={plan.image}
                        alt={plan.name}
                        width={80}
                        height={80}
                        className="h-9 w-9 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold text-white/40">
                        {plan.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {plan.name}
                      </p>

                      <p className="max-w-60 truncate text-[10px] text-white/30">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 text-xs text-white/75">
                  {formatUSDT(plan.minimumAmount)} USDT
                </td>

                <td className="px-3 py-3 text-xs text-white/55">
                  {plan.durationDays === 0
                    ? 'Instant'
                    : `${plan.durationDays} days`}
                </td>

                <td className="px-3 py-3 text-xs font-medium text-emerald-300">
                  {plan.expectedReturnRate}%
                </td>

                <td className="px-3 py-3">
                  <PlanStatusBadge status={plan.status} />
                </td>

                <td className="px-3 py-3 text-xs">
                  {plan.featured ? (
                    <span className="font-medium text-yellow-300">
                      Yes
                    </span>
                  ) : (
                    <span className="text-white/30">
                      No
                    </span>
                  )}
                </td>

                <td className="px-3 py-3">
                  <div className="flex justify-end gap-0.5">
                    <button
                      type="button"
                      onClick={() => onView(plan)}
                      title="View plan"
                      className="rounded-lg p-1.5 text-white/35 transition hover:bg-white/10 hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewInvestors(plan)}
                      title="View investors"
                      className="rounded-lg p-1.5 text-white/35 transition hover:bg-white/10 hover:text-white"
                    >
                      <UserRound className="h-3.5 w-3.5" />
                    </button>

                    {superAdmin && onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(plan)}
                        title="Edit plan"
                        className="rounded-lg p-1.5 text-white/35 transition hover:bg-white/10 hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
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
                        className="rounded-lg p-1.5 text-white/35 transition hover:bg-white/10 hover:text-white"
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {superAdmin && onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(plan)}
                        title="Delete plan"
                        className="rounded-lg p-1.5 text-white/35 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
