
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  X,
} from "lucide-react";

import promotionsApi from "@/src/lib/api/promotionsApi";
import type { PromotionWithPlan } from "@/src/lib/types/promotion";

interface PromotionBannerProps {
  dismissible?: boolean;
}

export default function PromotionBanner({
  dismissible = true,
}: PromotionBannerProps) {
  const [promotion, setPromotion] =
    useState<PromotionWithPlan | null>(null);

  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPromotion() {
      try {
        const promotions = await promotionsApi.listActive();

        if (!mounted) return;

        setPromotion(promotions[0] ?? null);
      } catch (err) {
        // Promotions are optional dashboard content.
        console.error("Failed to load promotion banner:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadPromotion();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !promotion || dismissed) return null;

  const image = promotion.image ?? promotion.plan_image;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[20px] border border-[#E60033]/20 bg-[#0B1426] shadow-lg shadow-black/10 sm:rounded-3xl">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 900px"
          className="object-cover opacity-20"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#10101F] via-[#07101F]/95 to-[#101D33]/85" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-0.75 bg-[#E60033]"
      />

      <div className="relative flex min-w-0 items-start gap-3 p-3.5 min-[375px]:p-4 sm:items-center sm:gap-4 sm:p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/25 bg-[#E60033]/15 text-[#FF476B] sm:h-11 sm:w-11">
          <Megaphone size={18} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#FF476B]">
            {promotion.plan_name || "Featured promotion"}
          </p>

          <h3 className="mt-1 text-[13px] font-black leading-snug text-white sm:text-base">
            {promotion.title}
          </h3>

          {promotion.description && (
            <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/50 sm:text-xs sm:leading-5">
              {promotion.description}
            </p>
          )}

          {promotion.cta_text && promotion.cta_url && (
            <Link
              href={promotion.cta_url}
              className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#FF476B] transition hover:text-white focus-visible:outline-none focus-visible:underline"
            >
              {promotion.cta_text}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss promotion"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}