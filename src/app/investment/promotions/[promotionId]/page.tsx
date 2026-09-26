
// src/app/investment/promotions/[promotionId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Gift,
  Percent,
  Timer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import promotionsApi from "@/src/lib/api/promotionsApi";
import type { PromotionWithPlan } from "@/src/lib/types/promotion";

export default function PromotionDetailsPage() {
  const router = useRouter();
  const params = useParams<{ promotionId: string }>();

  const promotionId = params.promotionId;

  const [promotion, setPromotion] =
    useState<PromotionWithPlan | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!promotionId) {
      return;
    }

    const loadPromotion = async () => {
      try {
        const data =
          await promotionsApi.getActive(promotionId);

        setPromotion(data);
        setNotFound(false);
      } catch (error) {
        console.error("Failed to load promotion:", error);

        setPromotion(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    void loadPromotion();
  }, [promotionId]);

  if (loading) {
    return (
      <main className="w-full">
        <div className="mx-auto w-full max-w-xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs font-semibold text-white/50 transition hover:border-white/15 hover:bg-white/7 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />

            <p className="mt-4 text-xs font-medium text-white/40">
              Loading promotion...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !promotion) {
    return (
      <main className="w-full">
        <div className="mx-auto w-full max-w-xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs font-semibold text-white/50 transition hover:border-white/15 hover:bg-white/7 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="rounded-3xl border border-white/8 bg-[#0B1426] px-5 py-14 text-center shadow-[0_16px_50px_rgba(0,0,0,0.2)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-400/8">
              <Gift className="h-6 w-6 text-[#F7C948]" />
            </div>

            <h1 className="mt-4 text-lg font-bold text-white">
              Promotion unavailable
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/40">
              This promotion is no longer active or could not
              be found.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/investment/promotions")
              }
              className="mt-6 rounded-2xl bg-emerald-500 px-5 py-3 text-xs font-bold text-[#04110D] shadow-[0_10px_30px_rgba(16,185,129,0.18)] transition hover:bg-emerald-400"
            >
              View promotions
            </button>
          </div>
        </div>
      </main>
    );
  }

  const image =
    promotion.image ?? promotion.plan_image;

  const minimumAmount =
    promotion.plan_minimum_amount;

  const duration =
    promotion.plan_duration_days;

  const returnRate =
    promotion.plan_expected_return_rate;

  const formatDate = (value?: string): string | null => {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString();
  };

  const startDate = formatDate(promotion.starts_at);
  const endDate = formatDate(promotion.ends_at);

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs font-semibold text-white/50 transition hover:border-white/15 hover:bg-white/7 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <article className="overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
          {image ? (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={image}
                alt={promotion.title}
                fill
                sizes="(max-width: 640px) 100vw, 576px"
                className="object-cover"
                priority
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#050B18] via-[#050B18]/20 to-transparent" />

              <div className="absolute bottom-4 left-4">
                <span className="rounded-full border border-white/10 bg-[#050B18]/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {promotion.type.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative flex h-48 items-center justify-center bg-linear-to-br from-[#101D33] to-[#0B1426]">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_55%)]"
              />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/8">
                <Gift className="h-7 w-7 text-emerald-400" />
              </div>

              <div className="absolute bottom-4 left-4">
                <span className="rounded-full border border-white/10 bg-[#050B18]/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {promotion.type.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6">
            {promotion.plan_name && (
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                {promotion.plan_name}
              </p>
            )}

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              {promotion.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              {promotion.description}
            </p>

            {(minimumAmount !== undefined ||
              duration !== undefined ||
              returnRate !== undefined) && (
              <div className="mt-6 grid grid-cols-3 gap-2">
                {minimumAmount !== undefined && (
                  <div className="rounded-2xl border border-white/6 bg-[#07101F] p-3">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-white/30">
                      Minimum
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {minimumAmount} USDT
                    </p>
                  </div>
                )}

                {duration !== undefined && (
                  <div className="rounded-2xl border border-white/6 bg-[#07101F] p-3">
                    <div className="flex items-center gap-1 text-white/30">
                      <Timer className="h-3 w-3" />

                      <span className="text-[9px] font-medium uppercase tracking-wide">
                        Duration
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-white">
                      {duration} days
                    </p>
                  </div>
                )}

                {returnRate !== undefined && (
                  <div className="rounded-2xl border border-white/6 bg-[#07101F] p-3">
                    <div className="flex items-center gap-1 text-white/30">
                      <Percent className="h-3 w-3" />

                      <span className="text-[9px] font-medium uppercase tracking-wide">
                        Return
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-emerald-400">
                      {returnRate}%
                    </p>
                  </div>
                )}
              </div>
            )}

            {(startDate || endDate) && (
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/6 bg-white/3 px-4 py-3 text-xs text-white/40">
                <CalendarDays className="h-4 w-4 shrink-0 text-white/30" />

                <span>
                  {startDate ?? "Now"}
                  {" — "}
                  {endDate ?? "Ongoing"}
                </span>
              </div>
            )}

            {promotion.cta_text &&
              promotion.cta_url && (
                <Link
                  href={promotion.cta_url}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-[#04110D] shadow-[0_12px_32px_rgba(16,185,129,0.18)] transition hover:bg-emerald-400"
                >
                  {promotion.cta_text}

                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
          </div>
        </article>
      </div>
    </main>
  );
}