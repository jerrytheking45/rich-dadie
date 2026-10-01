'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

import type { AdminInvestmentPlan } from '@/src/lib/types/admin';

import PlanStatusBadge from './PlanStatusBadge';

interface PlanDetailsModalProps {
  plan: AdminInvestmentPlan | null;
  onClose: () => void;
}

export default function PlanDetailsModal({
  plan,
  onClose,
}: PlanDetailsModalProps) {
  if (!plan) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
      <div className="flex max-h-[96vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#07182F] shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white sm:text-lg">
              {plan.name}
            </h2>

            <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
              Plan ID: {plan.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white sm:h-9 sm:w-9"
            aria-label="Close plan details"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="space-y-4 sm:space-y-5">
            {plan.image && (
              <div className="relative h-36 w-full overflow-hidden rounded-xl sm:h-48">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <section>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-white">
                  Description
                </h3>

                <PlanStatusBadge status={plan.status} />
              </div>

              <p className="whitespace-pre-wrap text-xs leading-5 text-gray-400 sm:text-sm sm:leading-6">
                {plan.description || 'No description provided.'}
              </p>
            </section>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              <InfoCard
                label="Minimum"
                value={`${plan.minimumAmount} USDT`}
              />

              <InfoCard
                label="Duration"
                value={
                  plan.durationDays === 0
                    ? 'Instant'
                    : `${plan.durationDays} days`
                }
              />

              <InfoCard
                label="Return"
                value={`${plan.expectedReturnRate}%`}
                accent
              />

              <InfoCard
                label="Featured"
                value={plan.featured ? 'Yes' : 'No'}
              />
            </div>

            {plan.status === 'DRAFT' && (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 sm:p-4">
                <p className="text-xs font-medium text-yellow-400 sm:text-sm">
                  Coming Soon
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-400 sm:text-xs">
                  This plan is currently a draft and cannot receive
                  investments until it is published.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 text-[10px] text-gray-500 sm:grid-cols-2 sm:gap-3 sm:text-xs">
              <p>
                Created: {new Date(plan.createdAt).toLocaleString()}
              </p>

              <p>
                Updated: {new Date(plan.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
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
      <p className="text-[10px] text-gray-500 sm:text-xs">{label}</p>

      <p
        className={[
          'mt-1 truncate text-xs font-semibold sm:text-sm',
          accent ? 'text-green-400' : 'text-white',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}
