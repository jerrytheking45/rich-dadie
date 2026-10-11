
// src/components/InvestmentPlanCard.tsx


"use client";

import Image from "next/image";

import {
  ArrowRight,
  Clock3,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import type { InvestmentPlan } from "@/src/lib/types/investment";
import { formatCurrency } from "@/src/lib/utils/currency";

interface InvestmentPlanCardProps {
  plan: InvestmentPlan;
  onClick?: () => void;
}

export default function InvestmentPlanCard({
  plan,
  onClick,
}: InvestmentPlanCardProps) {
  const isPublished = plan.status === "PUBLISHED";

  return (
    <button
      type="button"
      onClick={isPublished ? onClick : undefined}
      disabled={!isPublished || !onClick}
      className={[
        "group relative flex h-full min-w-0 w-full flex-col overflow-hidden",
        "rounded-2xl border bg-[#0B1426] text-left",
        "shadow-lg shadow-black/10 transition duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50",
        isPublished
          ? "border-white/8 hover:-translate-y-0.5 hover:border-[#E60033]/30 hover:bg-[#101D30]"
          : "cursor-default border-white/8 opacity-70",
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative h-28 w-full overflow-hidden bg-[#07101F] sm:h-32">
        {plan.image ? (
          <Image
            src={plan.image}
            alt={plan.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className={[
              "object-cover transition-transform duration-500",
              isPublished
                ? "group-hover:scale-105"
                : "grayscale opacity-60",
            ].join(" ")}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-[#E60033]/15 to-[#07101F]">
            <TrendingUp
              size={30}
              className="text-[#FF476B]/55"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#050B18] via-[#050B18]/20 to-transparent" />

        {/* Availability */}
        <div className="absolute left-2 top-2">
          <span
            className={[
              "inline-flex items-center gap-1 rounded-full border px-2 py-1",
              "text-[8px] font-bold backdrop-blur-md",
              isPublished
                ? "border-emerald-400/20 bg-[#07101F]/80 text-emerald-300"
                : "border-white/10 bg-[#07101F]/80 text-white/60",
            ].join(" ")}
          >
            {isPublished ? (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            ) : (
              <Sparkles size={10} aria-hidden="true" />
            )}

            {isPublished ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Featured */}
        {plan.featured && isPublished && (
          <span className="absolute right-2 top-2 rounded-full border border-[#E60033]/30 bg-[#E60033] px-2 py-1 text-[8px] font-black text-white">
            Featured
          </span>
        )}

        {/* Name over image */}
        <div className="absolute inset-x-3 bottom-2.5">
          <h3 className="line-clamp-2 text-xs font-black leading-4 text-white sm:text-sm">
            {plan.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <p className="line-clamp-2 min-h-8 text-[10px] leading-4 text-white/45">
          {plan.description || "Explore this investment plan."}
        </p>

        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <div className="min-w-0 rounded-lg border border-white/6 bg-white/2.5 p-2">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-white/35">
              Minimum
            </p>

            <p
              title={formatCurrency(plan.minimumAmount)}
              className="mt-1 truncate text-[11px] font-black text-white tabular-nums"
            >
              {formatCurrency(plan.minimumAmount)}
            </p>
          </div>

          <div className="min-w-0 rounded-lg border border-white/6 bg-white/2.5 p-2">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-white/35">
              Duration
            </p>

            <p className="mt-1 flex items-center gap-1 text-[11px] font-black text-white tabular-nums">
              <Clock3
                size={11}
                className="shrink-0 text-white/40"
                aria-hidden="true"
              />
              {plan.durationDays} days
            </p>
          </div>
        </div>

        {/* Projected return */}
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-2">
          <div className="min-w-0">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-emerald-300/65">
              Expected return
            </p>

            <p className="mt-0.5 text-[13px] font-black text-emerald-300 tabular-nums">
              {plan.expectedReturnRate}%
            </p>
          </div>

          {isPublished ? (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/15 text-[#FF476B] transition group-hover:bg-[#E60033] group-hover:text-white">
              <ArrowRight size={14} aria-hidden="true" />
            </div>
          ) : (
            <span className="text-[9px] font-semibold text-white/35">
              Closed
            </span>
          )}
        </div>
      </div>
    </button>
  );
}