
// src/components/InvestmentPlanCard.tsx

'use client';

import {
  ArrowRight,
  Clock3,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';

import type { InvestmentPlan } from '@/src/lib/types/investment';
import { formatCurrency } from '@/src/lib/utils/currency';

interface InvestmentPlanCardProps {
  plan: InvestmentPlan;
  onClick?: () => void;
}

export default function InvestmentPlanCard({
  plan,
  onClick,
}: InvestmentPlanCardProps) {
  const isPublished =
    plan.status === 'PUBLISHED';

  return (
    <button
      type="button"
      onClick={
        isPublished ? onClick : undefined
      }
      disabled={!isPublished}
      className={[
        'group relative w-full overflow-hidden rounded-[22px] border bg-[#0B1426] text-left shadow-xl shadow-black/10 transition',
        isPublished
          ? 'border-white/8 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-[#101D33] hover:shadow-emerald-950/20'
          : 'cursor-default border-white/7 opacity-75',
      ].join(' ')}
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden bg-[#07101F]">
        {plan.image ? (
          <Image
            src={plan.image}
            alt={plan.name}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className={[
              'object-cover transition duration-500',
              isPublished
                ? 'group-hover:scale-105'
                : 'grayscale opacity-60',
            ].join(' ')}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-400/10 to-purple-400/5">
            <TrendingUp className="h-9 w-9 text-emerald-300/50" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#050B18] via-black/15 to-transparent" />

        {/* Status */}
        <div className="absolute left-2.5 top-2.5">
          {isPublished ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/15 bg-[#07101F]/70 px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-emerald-200 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-white/60 backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              Coming soon
            </span>
          )}
        </div>

        {plan.featured && isPublished && (
          <div className="absolute right-2.5 top-2.5">
            <span className="rounded-full bg-[#F7C948] px-2.5 py-1 text-[8px] font-black text-[#050B18] shadow-lg shadow-[#F7C948]/10">
              Featured
            </span>
          </div>
        )}

        <div className="absolute bottom-2.5 left-3 right-3">
          <h3 className="truncate text-sm font-black text-white">
            {plan.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="line-clamp-2 min-h-8 text-[10px] leading-4 text-white/35">
          {plan.description ||
            'Investment opportunity for team members.'}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/5 bg-white/2.5 p-2.5">
            <p className="text-[8px] font-bold uppercase tracking-wide text-white/25">
              Minimum
            </p>

            <p className="mt-1 truncate text-xs font-black text-white/80">
              {formatCurrency(
                plan.minimumAmount,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/2.5 p-2.5">
            <p className="text-[8px] font-bold uppercase tracking-wide text-white/25">
              Duration
            </p>

            <div className="mt-1 flex items-center gap-1">
              <Clock3 className="h-3 w-3 text-white/30" />

              <p className="text-xs font-black text-white/80">
                {plan.durationDays} days
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-300/10 bg-emerald-300/6 px-3 py-2.5">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-wide text-emerald-300/60">
              Expected return
            </p>

            <p className="mt-0.5 text-sm font-black text-emerald-200">
              {plan.expectedReturnRate}%
            </p>
          </div>

          {isPublished ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-300 transition group-hover:bg-emerald-300 group-hover:text-[#050B18]">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          ) : (
            <div className="rounded-full border border-white/7 bg-white/2.5 px-2.5 py-1 text-[8px] font-bold text-white/25">
              Not available
            </div>
          )}
        </div>
      </div>
    </button>
  );
}