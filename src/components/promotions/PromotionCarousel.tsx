
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import promotionsApi from "@/src/lib/api/promotionsApi";
import type { PromotionWithPlan } from "@/src/lib/types/promotion";
import PromotionCard from "./PromotionCard";

interface PromotionCarouselProps {
  title?: string;
  description?: string;
  limit?: number;
}

const AUTO_SLIDE_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;

export default function PromotionCarousel({
  title = "Featured for you",
  description = "Discover the latest opportunities and platform offers.",
  limit = 6,
}: PromotionCarouselProps) {
  const [promotions, setPromotions] = useState<PromotionWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPromotions() {
      setLoading(true);
      setError(false);

      try {
        const data = await promotionsApi.listActive();

        if (!mounted) return;

        setPromotions(data.slice(0, Math.max(0, limit)));
        setCurrent(0);
      } catch (err) {
        if (!mounted) return;

        console.error("Failed to load featured promotions:", err);
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadPromotions();

    return () => {
      mounted = false;
    };
  }, [limit]);

  const total = promotions.length;
  const safeCurrent = current < total ? current : 0;

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % total);
    }, AUTO_SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [total, isPaused]);

  const next = () => {
    if (total > 1) {
      setCurrent((value) => (value + 1) % total);
    }
  };

  const previous = () => {
    if (total > 1) {
      setCurrent((value) => (value - 1 + total) % total);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (total <= 1) return;

    const touch = event.touches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      setIsPaused(false);
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) >= SWIPE_THRESHOLD
    ) {
      if (deltaX < 0) next();
      else previous();
    }

    setIsPaused(false);
  };

  if (loading) {
    return (
      <section className="py-4 sm:py-5" aria-label="Loading promotions">
        <div className="mb-4 animate-pulse">
          <div className="h-3 w-24 rounded-full bg-white/10" />
          <div className="mt-3 h-5 w-44 rounded-lg bg-white/10" />
        </div>

        <div className="h-72 animate-pulse rounded-[22px] border border-white/10 bg-[#0B1426] sm:h-80" />
      </section>
    );
  }

  if (error || total === 0) return null;

  return (
    <section
      aria-label={title}
      className="min-w-0 py-4 sm:py-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="mb-3.5 flex items-end justify-between gap-3 sm:mb-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
              <Sparkles size={14} aria-hidden="true" />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FF476B]">
              REDIQ Promotions
            </span>
          </div>

          <h2 className="text-[18px] font-black tracking-tight text-white sm:text-xl">
            {title}
          </h2>

          <p className="mt-1 max-w-lg text-[10px] leading-4 text-white/45 sm:text-xs">
            {description}
          </p>
        </div>

        {total > 1 && (
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <CarouselButton
              label="Previous promotion"
              onClick={previous}
              icon={<ChevronLeft size={17} />}
            />

            <CarouselButton
              label="Next promotion"
              onClick={next}
              icon={<ChevronRight size={17} />}
            />
          </div>
        )}
      </div>

      <div
        className="min-w-0 touch-pan-y select-none overflow-hidden rounded-[22px] sm:rounded-[26px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartX.current = null;
          touchStartY.current = null;
          setIsPaused(false);
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
          style={{
            transform: `translateX(-${safeCurrent * 100}%)`,
          }}
        >
          {promotions.map((promotion, index) => (
            <div
              key={promotion.id}
              className="w-full min-w-0 shrink-0"
              aria-hidden={index !== safeCurrent}
              inert={index !== safeCurrent}
            >
              <PromotionCard promotion={promotion} />
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-3.5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous promotion"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0B1426] text-white/65 transition hover:text-[#FF476B] sm:hidden"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5">
            {promotions.map((promotion, index) => (
              <button
                key={promotion.id}
                type="button"
                aria-label={`Show promotion ${index + 1}`}
                aria-current={index === safeCurrent ? "true" : undefined}
                onClick={() => setCurrent(index)}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B]",
                  index === safeCurrent
                    ? "w-6 bg-[#E60033]"
                    : "w-1.5 bg-white/20 hover:bg-white/40",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next promotion"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0B1426] text-white/65 transition hover:text-[#FF476B] sm:hidden"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

interface CarouselButtonProps {
  label: string;
  onClick: () => void;
  icon: ReactNode;
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
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/60 transition hover:border-[#E60033]/35 hover:bg-[#E60033]/10 hover:text-[#FF476B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50"
    >
      {icon}
    </button>
  );
}