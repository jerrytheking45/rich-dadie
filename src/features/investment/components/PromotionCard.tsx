
// src/features/investment/components/PromotionCard.tsx

import { CalendarDays, Sparkles } from "lucide-react";

import type { Promotion } from "../types/investment";
import { useSettings } from "../context/useSettings";
import { useTranslation } from "../i18n/translations";

interface PromotionCardProps {
  promotion: Promotion;
  onClick?: () => void;
}

const PromotionCard = ({
  promotion,
  onClick,
}: PromotionCardProps) => {
  const { language } = useSettings();
  const { t } = useTranslation();

  const isActive = promotion.active;

  /**
   * Format promotion dates according to the user's
   * currently selected platform language.
   */
  const formatDate = (value: string): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    try {
      return new Intl.DateTimeFormat(language, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        text-left
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-emerald-50">
        {promotion.image ? (
          <img
            src={promotion.image}
            alt={promotion.title}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            aria-hidden="true"
          >
            <Sparkles
              size={48}
              className="text-emerald-300"
            />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute right-3 top-3">
          <span
            className={`
              rounded-full
              px-3
              py-1
              text-[10px]
              font-bold
              uppercase
              ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 text-slate-600"
              }
            `}
          >
            {isActive
              ? t("promotions.active")
              : t("promotions.expired")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[16px] font-extrabold text-slate-900">
          {promotion.title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {promotion.description}
        </p>

        {/* Promotion period */}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
          <CalendarDays
            size={14}
            aria-hidden="true"
          />

          <span>
            {formatDate(promotion.startDate)}
            {" – "}
            {formatDate(promotion.endDate)}
          </span>
        </div>

        {/* Learn more */}
        {isActive && (
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span>
              {t("promotions.learn_more")}
            </span>

            <span
              className="
                transition-transform
                group-hover:translate-x-1
              "
              aria-hidden="true"
            >
              →
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

export default PromotionCard;