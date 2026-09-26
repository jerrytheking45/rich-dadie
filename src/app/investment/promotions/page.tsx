"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

import PromotionCard from "@/src/components/promotions/PromotionCard";
import promotionsApi from "@/src/lib/api/promotionsApi";
import type { PromotionWithPlan } from "@/src/lib/types/promotion";

export default function PromotionsPage() {
  const router = useRouter();

  const [promotions, setPromotions] = useState<PromotionWithPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPromotions = async (): Promise<void> => {
      try {
        const data = await promotionsApi.listActive();

        if (mounted) {
          setPromotions(data);
        }
      } catch (error) {
        console.error("Failed to load promotions:", error);

        if (mounted) {
          setPromotions([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadPromotions();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
      <div className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/10 bg-amber-400/8">
            <Gift className="h-5 w-5 text-amber-400" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Promotions
            </h1>

            <p className="mt-0.5 text-xs text-white/35">
              Discover the latest opportunities and offers.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-white/35">
            Loading promotions...
          </div>
        ) : promotions.length > 0 ? (
          <div className="mt-6 space-y-4">
            {promotions.map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-[#0B1426] px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/6 bg-white/4">
              <Gift className="h-6 w-6 text-white/30" />
            </div>

            <h2 className="mt-4 text-base font-bold text-white">
              No promotions available
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/35">
              There are no active promotions available right now.
              Check back later for new offers and investment opportunities.
            </p>

            <button
              type="button"
              onClick={() => router.push("/investment/plans")}
              className="mt-5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-[#04100B] transition hover:bg-emerald-400"
            >
              Explore investment plans
            </button>
          </div>
        )}
      </div>
    </main>
  );
}