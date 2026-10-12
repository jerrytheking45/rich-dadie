// src/components/promotions/PromotionCard.tsx


"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
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
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PromotionCard({
  promotion,
}: PromotionCardProps) {
  const image = promotion.image ?? promotion.plan_image;
  const startDate = formatDate(promotion.starts_at);
  const endDate = formatDate(promotion.ends_at);

  const hasMinimum = promotion.plan_minimum_amount != null;
  const hasDuration = promotion.plan_duration_days != null;
  const hasReturn = promotion.plan_expected_return_rate != null;

  const hasPlanDetails = hasMinimum || hasDuration || hasReturn;

  return (
    <Link
      href={`/investment/promotions/${promotion.id}`}
      aria-label={`View promotion: ${promotion.title}`}
      className="group block min-w-0 rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033] sm:rounded-[26px]"
    >
      <article className="relative min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] shadow-xl shadow-black/15 transition duration-300 group-hover:border-[#E60033]/35 group-hover:bg-[#101A2D] sm:rounded-[26px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-[#E60033]/80 to-transparent"
        />

        {/* IMAGE */}
        {image ? (
          <div className="relative aspect-16/8 w-full overflow-hidden sm:aspect-16/7">
            <Image
              src={image}
              alt={promotion.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-linear-to-t from-[#050B18]/90 via-[#050B18]/15 to-transparent" />

            <span className="absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded-lg border border-white/15 bg-[#050B18]/80 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md sm:bottom-4 sm:left-4">
              {formatPromotionType(promotion.type)}
            </span>
          </div>
        ) : (
          <div className="relative flex h-28 items-center justify-center overflow-hidden bg-linear-to-br from-[#251020] via-[#101D33] to-[#0B1426] sm:h-36">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,0,51,0.18),transparent_65%)]"
            />

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E60033]/25 bg-[#E60033]/10 text-[#FF476B] sm:h-14 sm:w-14">
              <Gift size={23} aria-hidden="true" />
            </div>

            <span className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-[#050B18]/75 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white">
              {formatPromotionType(promotion.type)}
            </span>
          </div>
        )}

        {/* CONTENT */}
        <div className="min-w-0 p-3.5 min-[375px]:p-4 sm:p-5">
          {promotion.plan_name && (
            <p className="truncate text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#FF476B]">
              {promotion.plan_name}
            </p>
          )}

          <div className="mt-1.5 flex min-w-0 items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-[15px] font-black leading-snug tracking-tight text-white sm:text-lg">
              {promotion.title}
            </h3>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B] transition group-hover:bg-[#E60033] group-hover:text-white sm:h-9 sm:w-9">
              <ArrowUpRight size={17} aria-hidden="true" />
            </div>
          </div>

          {promotion.description && (
            <p className="mt-2 line-clamp-2 text-[10px] leading-4.5 text-white/50 sm:text-xs sm:leading-5">
              {promotion.description}
            </p>
          )}

          {/* PLAN INFORMATION */}
          {hasPlanDetails && (
            <div className="mt-4 grid grid-cols-2 gap-2 min-[420px]:grid-cols-3">
              {hasMinimum && (
                <div className="min-w-0 rounded-xl border border-white/8 bg-[#07101F] p-2.5 sm:p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-white/40">
                    Minimum
                  </p>

                  <p className="mt-1 wrap-break-words text-[11px] font-extrabold text-white sm:text-xs">
                    {promotion.plan_minimum_amount} USDT
                  </p>
                </div>
              )}

              {hasDuration && (
                <div className="min-w-0 rounded-xl border border-white/8 bg-[#07101F] p-2.5 sm:p-3">
                  <div className="flex items-center gap-1 text-white/40">
                    <Timer size={12} aria-hidden="true" />
                    <span className="text-[9px] font-semibold uppercase tracking-wide">
                      Duration
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] font-extrabold text-white sm:text-xs">
                    {promotion.plan_duration_days} days
                  </p>
                </div>
              )}

              {hasReturn && (
                <div className="min-w-0 rounded-xl border border-white/8 bg-[#07101F] p-2.5 sm:p-3">
                  <div className="flex items-center gap-1 text-white/40">
                    <Percent size={12} aria-hidden="true" />
                    <span className="text-[9px] font-semibold uppercase tracking-wide">
                      Est. return
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] font-extrabold text-white sm:text-xs">
                    {promotion.plan_expected_return_rate}%
                  </p>
                </div>
              )}
            </div>
          )}

          {hasReturn && (
            <p className="mt-2 text-[9px] leading-4 text-white/35">
              Expected returns are estimates, not guaranteed profit.
              Investment involves risk.
            </p>
          )}

          {(startDate || endDate) && (
            <div className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-white/40">
              <CalendarDays
                size={13}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />

              <span>
                {startDate ?? "Now"} — {endDate ?? "Ongoing"}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
              View details
            </span>

            <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#FF476B]">
              Explore
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}