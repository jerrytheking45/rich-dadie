
// src/features/investment/components/InvestmentPlanCard.tsx

import {
  ArrowRight,
  Clock3,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { InvestmentPlan } from "../types/investment";
import { useTranslation } from "../i18n/translations";
import { formatCurrency } from "../utils/currency";

interface InvestmentPlanCardProps {
  plan: InvestmentPlan;
  onClick?: () => void;
}

export default function InvestmentPlanCard({
  plan,
  onClick,
}: InvestmentPlanCardProps) {
  const { t, language } = useTranslation();

  /**
   * Format monetary values using the user's selected
   * currency from the global investment settings.
   */
  const formattedMinimumAmount = formatCurrency(
    plan.minimumAmount,
  );

  /**
   * Localized number formatting.
   */
  const formattedDuration = new Intl.NumberFormat(
    language,
  ).format(plan.durationDays);

  const formattedReturnRate = new Intl.NumberFormat(
    language,
    {
      maximumFractionDigits: 2,
    },
  ).format(plan.expectedReturnRate);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${plan.name} - ${t(
        "plans.title",
      )}`}
      className="
        group
        relative
        flex
        w-full
        flex-col
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        text-left
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500
        focus:ring-offset-2
      "
    >
      {/* ---------------------------------------------------------------- */}
      {/* Image                                                            */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative h-32 overflow-hidden bg-emerald-50">
        {plan.image ? (
          <img
            src={plan.image}
            alt={plan.name}
            loading="lazy"
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
            <TrendingUp
              size={34}
              className="text-emerald-500"
            />
          </div>
        )}

        {/* Featured */}
        {plan.featured && (
          <div className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            {t("plans.featured")}
          </div>
        )}

        {/* Risk */}
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 backdrop-blur">
          {getRiskLabel(t, plan.riskLevel)}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Content                                                          */}
      {/* ---------------------------------------------------------------- */}

      <div className="p-4">
        {/* Plan name */}
        <h3 className="line-clamp-1 text-[15px] font-bold text-slate-900">
          {plan.name}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-400">
          {plan.description}
        </p>

        {/* Minimum amount + duration */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {/* Minimum investment */}
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[9px] uppercase tracking-wide text-slate-400">
              {t("plans.from")}
            </p>

            <p className="mt-1 text-xs font-bold text-slate-800">
              {formattedMinimumAmount}
            </p>
          </div>

          {/* Duration */}
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[9px] uppercase tracking-wide text-slate-400">
              {t("investment.duration")}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-800">
              <Clock3
                size={12}
                aria-hidden="true"
              />

              {formattedDuration}{" "}
              {getDayLabel(
                plan.durationDays,
                language,
              )}
            </p>
          </div>
        </div>

        {/* Expected return */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-wide text-slate-400">
              {t("invest.expected_return")}
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-sm font-extrabold text-emerald-600">
              <TrendingUp
                size={14}
                aria-hidden="true"
              />

              {formattedReturnRate}%
            </p>
          </div>

          {/* Open */}
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-emerald-50
              text-emerald-600
              transition
              group-hover:bg-emerald-600
              group-hover:text-white
            "
            aria-hidden="true"
          >
            <ArrowRight size={17} />
          </div>
        </div>

        {/* Employee plan indicator */}
        <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-400">
          <ShieldCheck
            size={12}
            className="text-emerald-500"
            aria-hidden="true"
          />

          {t("plans.employee_plan")}
        </div>
      </div>
    </button>
  );
}

/* ========================================================================== */
/* Risk Translation                                                            */
/* ========================================================================== */

function getRiskLabel(
  t: ReturnType<typeof useTranslation>["t"],
  riskLevel: InvestmentPlan["riskLevel"],
): string {
  switch (riskLevel) {
    case "LOW":
      return t("plans.risk_low");

    case "MEDIUM":
      return t("plans.risk_medium");

    case "HIGH":
      return t("plans.risk_high");

    default:
      return riskLevel;
  }
}

/* ========================================================================== */
/* Localized Day Label                                                         */
/* ========================================================================== */

function getDayLabel(
  days: number,
  language: string,
): string {
  const pluralRules = new Intl.PluralRules(language);

  const category = pluralRules.select(days);

  if (category === "one") {
    return getLocalizedDay(language, true);
  }

  return getLocalizedDay(language, false);
}

/**
 * We deliberately use Intl.RelativeTimeFormat here only
 * for the localized unit vocabulary.
 */
function getLocalizedDay(
  language: string,
  singular: boolean,
): string {
  const formatter = new Intl.RelativeTimeFormat(
    language,
    {
      numeric: "always",
    },
  );

  const value = singular ? -1 : -2;

  const formatted = formatter.format(value, "day");

  /**
   * Extract the localized day unit from the relative
   * time result without hard-coding English.
   *
   * Example:
   * English → "1 day"
   * French  → "il y a 1 jour"
   * Spanish → "hace 1 día"
   */
  const numeric = new Intl.NumberFormat(
    language,
  ).format(Math.abs(value));

  return formatted
    .replace(numeric, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^il y a\s+/i, "")
    .replace(/^hace\s+/i, "")
    .replace(/^vor\s+/i, "")
    .replace(/^há\s+/i, "")
    .replace(/^ago\s+/i, "")
    .replace(/^في\s+/i, "")
    .replace(/^منذ\s+/i, "")
    .replace(/^قبل\s+/i, "");
}