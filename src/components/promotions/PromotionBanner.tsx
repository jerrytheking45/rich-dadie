'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Megaphone,
  X,
} from 'lucide-react';

import promotionsApi from '@/src/lib/api/promotionsApi';
import type { PromotionWithPlan } from '@/src/lib/types/promotion';

interface PromotionBannerProps {
  dismissible?: boolean;
}

export default function PromotionBanner({
  dismissible = true,
}: PromotionBannerProps) {
  const [promotion, setPromotion] =
    useState<PromotionWithPlan | null>(null);

  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPromotion() {
      try {
        const promotions =
          await promotionsApi.listActive();

        if (
          !mounted ||
          promotions.length === 0
        ) {
          return;
        }

        setPromotion(promotions[0]);
      } catch {
        // Promotions are optional UI.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadPromotion();

    return () => {
      mounted = false;
    };
  }, []);

  if (
    loading ||
    !promotion ||
    dismissed
  ) {
    return null;
  }

  const image =
    promotion.image ||
    promotion.plan_image;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#F7C948]/15 bg-[#0B1426] shadow-xl shadow-black/10">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-15"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-r from-[#07101F] via-[#07101F]/95 to-[#101D33]/80" />

      <div className="relative flex items-center gap-4 p-5 sm:p-6">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#F7C948]/10 bg-[#F7C948]/8 text-[#F7C948] sm:flex">
          <Megaphone size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#F7C948]/70">
            {promotion.plan_name ||
              'Featured promotion'}
          </p>

          <h3 className="mt-1 text-base font-black text-white sm:text-lg">
            {promotion.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/35">
            {promotion.description}
          </p>

          {promotion.cta_text &&
            promotion.cta_url && (
              <Link
                href={promotion.cta_url}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#F7C948] transition hover:text-white"
              >
                {promotion.cta_text}
                <ArrowRight size={14} />
              </Link>
            )}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss promotion"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/25 transition hover:bg-white/8 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </section>
  );
}
