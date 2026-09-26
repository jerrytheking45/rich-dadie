// src/components/promotions/PromotionCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Gift,
  Percent,
  Timer,
} from "lucide-react";

import type { PromotionWithPlan } from "@/src/lib/types/promotion";

interface PromotionCardProps {
  promotion: PromotionWithPlan;
}

function formatPromotionType(type: PromotionWithPlan["type"]): string {
  return type.replace(/_/g, " ");
}

function formatDate(value?: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString();
}

export default function PromotionCard({
  promotion,
}: PromotionCardProps) {
  const image = promotion.image ?? promotion.plan_image;

  const startDate = formatDate(promotion.starts_at);
  const endDate = formatDate(promotion.ends_at);

  return (
    <Link
      href={`/investment/promotions/${promotion.id}`}
      className="group block"
      aria-label={`View promotion: ${promotion.title}`}
    >
      <article className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0B1426] shadow-[0_16px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-[#0E1930]">
        {/* Premium accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/60 to-transparent"
        />

        {image ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={image}
              alt={promotion.title}
              fill
              sizes="(max-width: 640px) 100vw, 576px"
              className="object-cover transition duration-500 group-hover:scale-[1.025]"
            />

            <div className="absolute inset-0 bg-linear-to-t from-[#050B18]/90 via-[#050B18]/10 to-transparent" />

            <div className="absolute left-4 top-4">
              <span className="rounded-full border border-white/10 bg-[#050B18]/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                {formatPromotionType(promotion.type)}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative flex h-32 items-center justify-center overflow-hidden bg-linear-to-br from-[#101D33] to-[#0B1426]">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_55%)]"
            />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/8">
              <Gift className="h-6 w-6 text-emerald-400" />
            </div>

            <div className="absolute left-4 top-4">
              <span className="rounded-full border border-white/10 bg-[#050B18]/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                {formatPromotionType(promotion.type)}
              </span>
            </div>
          </div>
        )}

        <div className="p-5">
          {promotion.plan_name && (
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
              {promotion.plan_name}
            </p>
          )}

          <div className="mt-2 flex items-start justify-between gap-4">
            <h2 className="min-w-0 flex-1 text-lg font-extrabold tracking-tight text-white">
              {promotion.title}
            </h2>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white/50 transition group-hover:border-emerald-400/20 group-hover:bg-emerald-400/8 group-hover:text-emerald-400">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/50">
            {promotion.description}
          </p>

          {(promotion.plan_minimum_amount !== undefined ||
            promotion.plan_duration_days !== undefined ||
            promotion.plan_expected_return_rate !== undefined) && (
            <div className="mt-5 grid grid-cols-3 gap-2">
              {promotion.plan_minimum_amount !== undefined && (
                <div className="rounded-2xl border border-white/6 bg-[#07101F] p-3">
                  <p className="text-[9px] font-medium uppercase tracking-wide text-white/30">
                    Minimum
                  </p>

                  <p className="mt-1 text-xs font-bold text-white">
                    {promotion.plan_minimum_amount} USDT
                  </p>
                </div>
              )}

              {promotion.plan_duration_days !== undefined && (
                <div className="rounded-2xl border border-white/6 bg-[#07101F] p-3">
                  <div className="flex items-center gap-1 text-white/30">
                    <Timer className="h-3 w-3" />
                    <span className="text-[9px] font-medium uppercase tracking-wide">
                      Duration
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-bold text-white">
                    {promotion.plan_duration_days} days
                  </p>
                </div>
              )}

              {promotion.plan_expected_return_rate !== undefined && (
                <div className="rounded-2xl border border-white/6 bg-[#07101F] p-3">
                  <div className="flex items-center gap-1 text-white/30">
                    <Percent className="h-3 w-3" />
                    <span className="text-[9px] font-medium uppercase tracking-wide">
                      Return
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-bold text-emerald-400">
                    {promotion.plan_expected_return_rate}%
                  </p>
                </div>
              )}
            </div>
          )}

          {(startDate || endDate) && (
            <div className="mt-4 flex items-center gap-2 text-[10px] text-white/30">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />

              <span>
                {startDate ?? "Now"}
                {" — "}
                {endDate ?? "Ongoing"}
              </span>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-white/6 pt-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
              View promotion
            </span>

            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
              Explore
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
