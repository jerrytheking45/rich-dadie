'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import promotionsApi from '@/src/lib/api/promotionsApi';
import type { PromotionWithPlan } from '@/src/lib/types/promotion';

import PromotionCard from './PromotionCard';

interface PromotionCarouselProps {
  title?: string;
  description?: string;
  limit?: number;
}

const AUTO_SLIDE_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;

export default function PromotionCarousel({
  title = 'Featured for you',
  description =
    'Discover the latest opportunities and platform offers.',
  limit = 6,
}: PromotionCarouselProps) {
  const [promotions, setPromotions] =
    useState<PromotionWithPlan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [current, setCurrent] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  const touchStartX =
    useRef<number | null>(null);

  const touchStartY =
    useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPromotions() {
      try {
        const data =
          await promotionsApi.listActive();

        if (!mounted) {
          return;
        }

        setPromotions(
          data.slice(0, limit),
        );
      } catch {
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadPromotions();

    return () => {
      mounted = false;
    };
  }, [limit]);

  useEffect(() => {
    if (
      promotions.length <= 1 ||
      isPaused
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setCurrent(
          (value) =>
            (value + 1) %
            promotions.length,
        );
      }, AUTO_SLIDE_INTERVAL);

    return () => {
      window.clearInterval(timer);
    };
  }, [promotions.length, isPaused]);

  if (loading) {
    return (
      <section className="py-5">
        <div className="mb-4">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/7" />

          <div className="mt-3 h-6 w-44 animate-pulse rounded-lg bg-white/7" />
        </div>

        <div className="h-72 animate-pulse rounded-3xl border border-white/7 bg-[#0B1426]" />
      </section>
    );
  }

  if (
    error ||
    promotions.length === 0
  ) {
    return null;
  }

  const total = promotions.length;

  const safeCurrent =
    current < total ? current : 0;

  const next = () => {
    setCurrent(
      (value) =>
        (value + 1) % total,
    );
  };

  const previous = () => {
    setCurrent(
      (value) =>
        (value - 1 + total) % total,
    );
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    if (total <= 1) {
      return;
    }

    const touch =
      event.touches[0];

    touchStartX.current =
      touch.clientX;

    touchStartY.current =
      touch.clientY;

    setIsPaused(true);
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      setIsPaused(false);
      return;
    }

    const touch =
      event.changedTouches[0];

    const deltaX =
      touch.clientX -
      touchStartX.current;

    const deltaY =
      touch.clientY -
      touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (
      Math.abs(deltaX) <=
      Math.abs(deltaY)
    ) {
      setIsPaused(false);
      return;
    }

    if (
      Math.abs(deltaX) >=
      SWIPE_THRESHOLD
    ) {
      if (deltaX < 0) {
        next();
      } else {
        previous();
      }
    }

    setIsPaused(false);
  };

  return (
    <section
      className="py-5"
      onMouseEnter={() =>
        setIsPaused(true)
      }
      onMouseLeave={() =>
        setIsPaused(false)
      }
      onFocus={() =>
        setIsPaused(true)
      }
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget,
          )
        ) {
          setIsPaused(false);
        }
      }}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#F7C948]/10 bg-[#F7C948]/6">
              <Sparkles
                size={13}
                className="text-[#F7C948]"
              />
            </div>

            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#F7C948]/60">
              Promotions
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs text-white/30">
            {description}
          </p>
        </div>

        {total > 1 && (
          <div className="hidden shrink-0 gap-2 sm:flex">
            <CarouselButton
              label="Previous promotion"
              onClick={previous}
              icon={
                <ChevronLeft size={16} />
              }
            />

            <CarouselButton
              label="Next promotion"
              onClick={next}
              icon={
                <ChevronRight size={16} />
              }
            />
          </div>
        )}
      </div>

      <div
        className="overflow-hidden touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${
              safeCurrent * 100
            }%)`,
          }}
        >
          {promotions.map(
            (promotion) => (
              <div
                key={promotion.id}
                className="w-full shrink-0"
              >
                <PromotionCard
                  promotion={promotion}
                />
              </div>
            ),
          )}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {promotions.map(
            (promotion, index) => (
              <button
                key={promotion.id}
                type="button"
                aria-label={`Show promotion ${
                  index + 1
                }`}
                aria-current={
                  index === safeCurrent
                    ? 'true'
                    : undefined
                }
                onClick={() =>
                  setCurrent(index)
                }
                className={[
                  'h-1.5 rounded-full transition-all duration-300',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40',
                  index === safeCurrent
                    ? 'w-6 bg-emerald-300'
                    : 'w-1.5 bg-white/15 hover:bg-white/30',
                ].join(' ')}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}

interface CarouselButtonProps {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}

function CarouselButton({
  label,
  onClick,
  icon,
}: CarouselButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-[#0B1426] text-white/40 transition hover:border-emerald-300/20 hover:bg-[#101D33] hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
    >
      {icon}
    </button>
  );
}
