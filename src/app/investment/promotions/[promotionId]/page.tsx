
// src/app/investment/promotions/[promotionId]/page.tsx


"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Gift,
  Percent,
  RefreshCw,
  Timer,
} from "lucide-react";

import promotionsApi from "@/src/lib/api/promotionsApi";
import type { PromotionWithPlan } from "@/src/lib/types/promotion";

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

export default function PromotionDetailsPage() {
  const router = useRouter();
  const params = useParams<{ promotionId: string }>();
  const promotionId = params.promotionId;

  const [promotion, setPromotion] =
    useState<PromotionWithPlan | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPromotion() {
      if (!promotionId) {
        setLoading(false);
        setError(true);
        return;
      }

      setLoading(true);

      try {
        const data = await promotionsApi.getActive(promotionId);

        if (!mounted) return;

        setPromotion(data);
        setError(false);
      } catch (err) {
        if (!mounted) return;

        console.error("Failed to load promotion:", err);
        setPromotion(null);
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadPromotion();

    return () => {
      mounted = false;
    };
  }, [promotionId]);

  const refreshPromotion = useCallback(async () => {
    if (!promotionId || refreshing) return;

    setRefreshing(true);
    setError(false);

    try {
      const data = await promotionsApi.getActive(promotionId);
      setPromotion(data);
    } catch (err) {
      console.error("Failed to refresh promotion:", err);
      setPromotion(null);
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, [promotionId, refreshing]);

  const image = promotion?.image ?? promotion?.plan_image;

  const minimumAmount = promotion?.plan_minimum_amount;
  const duration = promotion?.plan_duration_days;
  const returnRate = promotion?.plan_expected_return_rate;

  const hasMinimum = minimumAmount != null;
  const hasDuration = duration != null;
  const hasReturn = returnRate != null;

  const startDate = formatDate(promotion?.starts_at);
  const endDate = formatDate(promotion?.ends_at);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050B18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#E60033]/8 blur-[85px]" />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-4xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8">
        {/* HEADER */}
        <header className="mb-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/investment/promotions")}
              aria-label="Back to promotions"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 transition hover:border-[#E60033]/30 hover:text-white sm:h-10 sm:w-10"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
                REDIQ Promotions
              </p>

              <h1 className="mt-0.5 truncate text-[18px] font-black tracking-tight sm:text-xl">
                Promotion Details
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refreshPromotion()}
            disabled={loading || refreshing || !promotionId}
            aria-label="Refresh promotion"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/60 transition hover:text-[#FF476B] disabled:opacity-40 sm:h-10 sm:w-10"
          >
            <RefreshCw
              size={16}
              className={loading || refreshing ? "animate-spin" : ""}
            />
          </button>
        </header>

        {/* LOADING */}
        {loading && (
          <section
            aria-label="Loading promotion details"
            aria-busy="true"
            className="animate-pulse overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426]"
          >
            <div className="aspect-video bg-white/5 sm:aspect-16/7" />

            <div className="space-y-4 p-4 sm:p-6">
              <div className="h-3 w-28 rounded bg-white/10" />
              <div className="h-6 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-full rounded bg-white/5" />
              <div className="h-3 w-2/3 rounded bg-white/5" />

              <div className="grid grid-cols-2 gap-2 pt-3 sm:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 rounded-xl bg-white/5"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* UNAVAILABLE */}
        {!loading && (error || !promotion) && (
          <section
            role="alert"
            className="rounded-[22px] border border-white/10 bg-[#0B1426] px-5 py-12 text-center sm:py-14"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
              <AlertCircle size={22} />
            </div>

            <h2 className="mt-4 text-base font-black text-white">
              Promotion unavailable
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/45">
              This promotion may no longer be active, may not exist,
              or could not be retrieved right now.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => void refreshPromotion()}
                disabled={refreshing}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-[11px] font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Retrying..." : "Try Again"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/investment/promotions")}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#E60033] px-4 text-[11px] font-extrabold text-white transition hover:bg-[#FF174B]"
              >
                All Promotions
                <ArrowRight size={14} />
              </button>
            </div>
          </section>
        )}

        {/* PROMOTION DETAILS */}
        {!loading && !error && promotion && (
          <article className="min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] shadow-xl shadow-black/20 sm:rounded-[26px]">
            {/* IMAGE */}
            {image ? (
              <div className="relative aspect-video w-full overflow-hidden sm:aspect-16/7">
                <Image
                  src={image}
                  alt={promotion.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 896px"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#050B18]/95 via-[#050B18]/15 to-transparent" />

                <span className="absolute bottom-4 left-4 rounded-lg border border-white/15 bg-[#050B18]/80 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md sm:bottom-5 sm:left-6">
                  {promotion.type.replace(/_/g, " ")}
                </span>
              </div>
            ) : (
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br from-[#25101E] via-[#101D33] to-[#0B1426] sm:h-52">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,0,51,0.18),transparent_65%)]"
                />

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E60033]/25 bg-[#E60033]/10 text-[#FF476B]">
                  <Gift size={28} />
                </div>

                <span className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#050B18]/75 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white">
                  {promotion.type.replace(/_/g, " ")}
                </span>
              </div>
            )}

            <div className="min-w-0 p-4 min-[375px]:p-5 sm:p-6 lg:p-7">
              {promotion.plan_name && (
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
                  {promotion.plan_name}
                </p>
              )}

              <h2 className="mt-2 wrap-break-words text-[21px] font-black leading-tight tracking-tight text-white sm:text-[27px]">
                {promotion.title}
              </h2>

              {promotion.description && (
                <p className="mt-3 whitespace-pre-line wrap-break-words text-xs leading-6 text-white/55 sm:text-sm sm:leading-7">
                  {promotion.description}
                </p>
              )}

              {/* PLAN METRICS */}
              {(hasMinimum || hasDuration || hasReturn) && (
                <section className="mt-5">
                  <h3 className="mb-3 text-xs font-black text-white/85">
                    Related Plan Information
                  </h3>

                  <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3 sm:gap-3">
                    {hasMinimum && (
                      <DetailMetric
                        label="Minimum Amount"
                        value={`${minimumAmount} USDT`}
                      />
                    )}

                    {hasDuration && (
                      <DetailMetric
                        label="Duration"
                        value={`${duration} days`}
                        icon={<Timer size={13} />}
                      />
                    )}

                    {hasReturn && (
                      <DetailMetric
                        label="Expected Return"
                        value={`${returnRate}%`}
                        icon={<Percent size={13} />}
                      />
                    )}
                  </div>

                  {hasReturn && (
                    <p className="mt-3 rounded-xl border border-white/10 bg-[#07101F] px-3 py-2.5 text-[10px] leading-5 text-white/45">
                      The expected return shown is an estimate, not a
                      guaranteed payout. Investments involve risk,
                      including potential loss of capital.
                    </p>
                  )}
                </section>
              )}

              {/* DATES */}
              {(startDate || endDate) && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/10 bg-[#07101F] p-3.5">
                  <CalendarDays
                    size={16}
                    className="mt-0.5 shrink-0 text-[#FF476B]"
                  />

                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/40">
                      Promotion Period
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-white/80">
                      {startDate ?? "Now"} — {endDate ?? "Ongoing"}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA */}
              {promotion.cta_text && promotion.cta_url && (
                <Link
                  href={promotion.cta_url}
                  className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-[#E60033]/10 transition hover:bg-[#FF174B] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1426] sm:text-sm"
                >
                  {promotion.cta_text}
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

function DetailMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-[#07101F] p-3 sm:p-4">
      <div className="flex items-center gap-1.5 text-white/40">
        {icon}

        <p className="text-[9px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 wrap-break-words text-[12px] font-black text-white sm:text-sm">
        {value}
      </p>
    </div>
  );
}