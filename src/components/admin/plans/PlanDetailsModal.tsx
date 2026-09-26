
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#07182F] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {plan.name}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Plan ID: {plan.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
            aria-label="Close plan details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {plan.image && (
            <div className="relative h-48 w-full overflow-hidden rounded-xl">
              <Image
                src={plan.image}
                alt={plan.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="h-48 w-full rounded-xl object-cover"
                priority
              />
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-white">
                Description
              </h3>

              <PlanStatusBadge status={plan.status} />
            </div>

            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-400">
              {plan.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-gray-500">Minimum</p>
              <p className="mt-1 font-semibold text-white">
                {plan.minimumAmount} USDT
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-gray-500">Duration</p>
              <p className="mt-1 font-semibold text-white">
                {plan.durationDays === 0
                  ? 'Instant'
                  : `${plan.durationDays} days`}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-gray-500">Return</p>
              <p className="mt-1 font-semibold text-green-400">
                {plan.expectedReturnRate}%
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-gray-500">Featured</p>
              <p className="mt-1 font-semibold text-white">
                {plan.featured ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {plan.status === 'DRAFT' && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="text-sm font-medium text-yellow-400">
                Coming Soon
              </p>

              <p className="mt-1 text-xs text-gray-400">
                This plan is currently a draft and cannot receive
                investments until it is published.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 text-xs text-gray-500 sm:grid-cols-2">
            <p>
              Created:{' '}
              {new Date(plan.createdAt).toLocaleString()}
            </p>

            <p>
              Updated:{' '}
              {new Date(plan.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}