
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Gift,
  RefreshCw,
} from "lucide-react";

import PromotionCard from "@/src/components/promotions/PromotionCard";
import promotionsApi from "@/src/lib/api/promotionsApi";
import type { PromotionWithPlan } from "@/src/lib/types/promotion";

export default function PromotionsPage() {
  const router = useRouter();

  const [promotions, setPromotions] = useState<PromotionWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPromotions() {
      try {
        const data = await promotionsApi.listActive();

        if (!mounted) return;

        setPromotions(data);
        setError(false);
      } catch (err) {
        if (!mounted) return;

        console.error("Failed to load promotions:", err);
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadPromotions();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshPromotions = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    setError(false);

    try {
      const data = await promotionsApi.listActive();
      setPromotions(data);
    } catch (err) {
      console.error("Failed to refresh promotions:", err);
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050B18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-[#E60033]/8 blur-[85px]" />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-5xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/investment")}
              aria-label="Back to investment home"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 transition hover:border-[#E60033]/30 hover:text-white sm:h-10 sm:w-10"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
                Discover
              </p>

              <h1 className="mt-0.5 text-[19px] font-black tracking-tight sm:text-[23px]">
                Promotions
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refreshPromotions()}
            disabled={loading || refreshing}
            aria-label="Refresh promotions"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/60 transition hover:text-[#FF476B] disabled:opacity-40 sm:h-10 sm:w-10"
          >
            <RefreshCw
              size={16}
              className={loading || refreshing ? "animate-spin" : ""}
            />
          </button>
        </header>

        {/* INTRO */}
        <section className="mt-5 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#25101E] via-[#101827] to-[#0B1426] p-4 sm:rounded-[26px] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/25 bg-[#E60033]/15 text-[#FF476B] sm:h-11 sm:w-11">
              <Gift size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-black text-white sm:text-base">
                Latest offers and opportunities
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-white/50 sm:text-xs">
                Explore currently active REDIQ promotions and review
                their details before making an investment decision.
              </p>
            </div>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div
            aria-label="Loading promotions"
            aria-busy="true"
            className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426]"
              >
                <div className="aspect-16/8 bg-white/5" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="h-5 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-full rounded bg-white/5" />
                  <div className="h-3 w-2/3 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API ERROR */}
        {!loading && error && (
          <section
            role="alert"
            className="mt-5 rounded-[22px] border border-[#E60033]/25 bg-[#0B1426] px-5 py-10 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
              <AlertCircle size={22} />
            </div>

            <h2 className="mt-4 text-sm font-black">
              Unable to load promotions
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/45">
              We could not retrieve the current offers. Please try again.
            </p>

            <button
              type="button"
              onClick={() => void refreshPromotions()}
              disabled={refreshing}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-5 text-[11px] font-extrabold text-white transition hover:bg-[#FF174B] disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Retrying..." : "Try Again"}
            </button>
          </section>
        )}

        {/* PROMOTIONS GRID */}
        {!loading && !error && promotions.length > 0 && (
          <section className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[13px] font-black text-white sm:text-sm">
                Active Promotions
              </h2>

              <span className="rounded-lg border border-white/10 bg-[#0B1426] px-2.5 py-1 text-[10px] font-bold text-white/55">
                {promotions.length} available
              </span>
            </div>

            <div className="grid min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4">
              {promotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                />
              ))}
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && promotions.length === 0 && (
          <section className="mt-5 rounded-[22px] border border-dashed border-white/15 bg-[#0B1426] px-5 py-10 text-center sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
              <Gift size={22} />
            </div>

            <h2 className="mt-4 text-sm font-black text-white">
              No active promotions
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/45">
              There are no active promotions right now. You can still
              explore the available investment plans.
            </p>

            <button
              type="button"
              onClick={() => router.push("/investment/plans")}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-5 text-[11px] font-extrabold text-white transition hover:bg-[#FF174B]"
            >
              Explore investment plans
              <ArrowRight size={15} />
            </button>
          </section>
        )}
      </div>
    </main>
  );
}