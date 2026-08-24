// src/features/investment/components/InvestmentCard.tsx

import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
} from "lucide-react";
import type { ReactNode } from "react";

import type { Investment } from "../types/investment";
import { useTranslation } from "../i18n/translations";
import { formatCurrency } from "../utils/currency";

interface InvestmentCardProps {
  investment: Investment;
  onClick?: () => void;
}

export default function InvestmentCard({
  investment,
  onClick,
}: InvestmentCardProps) {
  const { t, language } = useTranslation();

  /**
   * Format currency using the user's currently selected currency.
   *
   * The currency is resolved inside the centralized currency
   * utility rather than being hard-coded to UGX.
   */
  const formatAmount = (amount: number) =>
    formatCurrency(amount);

  /**
   * Format dates according to the currently selected language.
   *
   * `Intl.DateTimeFormat` provides locale-aware formatting
   * without requiring a separate date library.
   */
  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  };

  /**
   * Translate investment status.
   *
   * Investment status values come from the backend/domain model
   * in English enum form, while the UI displays the translated
   * equivalent.
   */
  const getStatusLabel = () => {
    switch (investment.status) {
      case "ACTIVE":
        return t("investment.active");

      case "PENDING":
        return t("investment.pending");

      case "MATURED":
        return t("investment.matured");

      case "CANCELLED":
        return t("investment.cancelled");

      case "WITHDRAWN":
        return t("investment.withdrawn");

      default:
        return investment.status;
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
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500/30
        focus:ring-offset-2
      "
    >
      <div className="flex min-h-[190px]">
        {/* ------------------------------------------------------- */}
        {/* Product image                                           */}
        {/* ------------------------------------------------------- */}

        <div className="relative w-[38%] min-w-[130px] overflow-hidden bg-slate-100">
          {investment.image ? (
            <img
              src={investment.image}
              alt={investment.planName}
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
            <div className="flex h-full items-center justify-center">
              <span
                className="text-3xl"
                aria-hidden="true"
              >
                📈
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-black/45 px-3 py-2">
            <span className="text-xs font-semibold text-white">
              {t("investment.amount")}
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* Investment details                                      */}
        {/* ------------------------------------------------------- */}

        <div className="flex flex-1 flex-col p-4">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[16px] font-bold text-slate-900">
                {investment.planName}
              </h3>

              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />

                {getStatusLabel()}
              </span>
            </div>

            <ArrowUpRight
              size={18}
              className="
                shrink-0
                text-slate-400
                transition
                group-hover:text-emerald-600
              "
              aria-hidden="true"
            />
          </div>

          {/* ----------------------------------------------------- */}
          {/* Investment metrics                                    */}
          {/* ----------------------------------------------------- */}

          <div className="grid grid-cols-2 gap-2">
            <InfoItem
              label={t("investment.amount")}
              value={formatAmount(investment.amount)}
            />

            <InfoItem
              label={t("investment.total_projected")}
              value={formatAmount(investment.projectedValue)}
            />

            <InfoItem
              label={t("investment.duration")}
              value={formatDuration(
                investment.durationDays,
                language,
              )}
              icon={<Clock3 size={12} />}
            />

            <InfoItem
              label={t("details.progress_percent")}
              value={`${Math.min(
                Math.max(investment.progress, 0),
                100,
              )}%`}
            />
          </div>

          {/* ----------------------------------------------------- */}
          {/* Investment progress                                   */}
          {/* ----------------------------------------------------- */}

          <div className="mt-auto pt-3">
            <div className="mb-1 flex justify-between text-[10px] text-slate-400">
              <span>
                {t("details.investment_progress")}
              </span>

              <span>
                {Math.min(
                  Math.max(investment.progress, 0),
                  100,
                )}
                %
              </span>
            </div>

            <div
              className="h-1.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label={t("details.investment_progress")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.min(
                Math.max(investment.progress, 0),
                100,
              )}
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-emerald-500
                  transition-all
                  duration-500
                "
                style={{
                  width: `${Math.min(
                    Math.max(investment.progress, 0),
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* ----------------------------------------------------- */}
          {/* Maturity date                                         */}
          {/* ----------------------------------------------------- */}

          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
            <CalendarDays
              size={12}
              aria-hidden="true"
            />

            <span>
              {t("investment.maturity")}{" "}
              {formatDate(investment.maturityDate)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------- */
/* Info Item                                                        */
/* ---------------------------------------------------------------- */

interface InfoItemProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

function InfoItem({
  label,
  value,
  icon,
}: InfoItemProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-400">
        {icon}

        <span>{label}</span>
      </div>

      <div className="mt-0.5 truncate text-[12px] font-bold text-slate-800">
        {value}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Duration Formatter                                               */
/* ---------------------------------------------------------------- */

function formatDuration(
  days: number,
  language: string,
): string {
  const safeDays = Math.max(0, Math.floor(days));

  /**
   * The investment platform stores duration in days.
   * We intentionally keep the raw day count because the
   * investment backend uses `durationDays` as its canonical
   * representation.
   *
   * Examples:
   * 1    → 1 day
   * 7    → 7 days
   * 30   → 30 days
   * 90   → 90 days
   * 180  → 180 days
   * 360  → 360 days
   */
  try {
    const formatter = new Intl.NumberFormat(language);

    /**
     * `Intl.RelativeTimeFormat` is not used here because
     * this value represents a duration rather than a
     * relative point in time.
     *
     * The singular/plural form is handled for the most
     * commonly supported languages below.
     */
    const normalizedLanguage = language
      .toLowerCase()
      .split("-")[0];

    const singularForms: Record<string, string> = {
      en: "day",
      es: "día",
      fr: "jour",
      pt: "dia",
      sw: "siku",
      de: "Tag",
      it: "giorno",
      nl: "dag",
      ar: "يوم",
      hi: "दिन",
      zh: "天",
      ja: "日",
      ko: "일",
      tr: "gün",
      ru: "день",
      pl: "dzień",
      id: "hari",
    };

    const pluralForms: Record<string, string> = {
      en: "days",
      es: "días",
      fr: "jours",
      pt: "dias",
      sw: "siku",
      de: "Tage",
      it: "giorni",
      nl: "dagen",
      ar: "أيام",
      hi: "दिन",
      zh: "天",
      ja: "日",
      ko: "일",
      tr: "gün",
      ru: "дней",
      pl: "dni",
      id: "hari",
    };

    const singular = singularForms[normalizedLanguage];
    const plural = pluralForms[normalizedLanguage];

    if (!singular || !plural) {
      return `${formatter.format(safeDays)} days`;
    }

    return `${formatter.format(safeDays)} ${
      safeDays === 1 ? singular : plural
    }`;
  } catch {
    return `${safeDays} days`;
  }
}