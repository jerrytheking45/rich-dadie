// src/features/investment/components/InvestmentOrderCard.tsx


import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";

import type { Investment } from "../types/investment";
import { useTranslation } from "../i18n/translations";
import { formatCurrency } from "../utils/currency";

interface InvestmentOrderCardProps {
  investment: Investment;
  onView?: () => void;
}

export default function InvestmentOrderCard({
  investment,
  onView,
}: InvestmentOrderCardProps) {
  const { t, language } = useTranslation();

  const isActive = investment.status === "ACTIVE";

  /**
   * Format dates according to the user's selected language.
   *
   * Examples:
   * en → 19 Aug 2026
   * fr → 19 août 2026
   * es → 19 ago 2026
   * de → 19. Aug. 2026
   */
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  /**
   * Currency is resolved by the shared currency/settings system.
   * Do not hard-code UGX inside this component.
   */
  const formatInvestmentCurrency = (amount: number) => {
    return formatCurrency(amount);
  };

  return (
    <article
      className="
        overflow-hidden
        rounded-[26px]
        border
        border-slate-200
        bg-white
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      <div className="flex min-h-[225px]">
        {/* Product image */}
        <div className="relative w-[39%] min-w-[135px] overflow-hidden bg-emerald-50">
          {investment.image ? (
            <img
              src={investment.image}
              alt={investment.planName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <TrendingUp
                size={40}
                className="text-emerald-500"
                aria-hidden="true"
              />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-black/45 px-3 py-2.5">
            <p className="text-[11px] font-bold text-white">
              {isActive
                ? t("investment.active")
                : getStatusLabel(t, investment.status)}
            </p>
          </div>
        </div>

        {/* Information */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-[16px] font-extrabold leading-tight text-slate-900">
                {investment.planName}
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                {t("investment.id")}: {investment.id}
              </p>
            </div>

            <StatusBadge
              status={investment.status}
              t={t}
            />
          </div>

          <div className="mt-3 space-y-2">
            <MetricRow
              label={t("investment.amount")}
              value={formatInvestmentCurrency(
                investment.amount,
              )}
            />

            <MetricRow
              label={t("investment.duration")}
              value={formatDuration(
                investment.durationDays,
                language,
              )}
              icon={<Clock3 size={12} aria-hidden="true" />}
            />

            <MetricRow
              label={t("investment.expected_earnings")}
              value={formatInvestmentCurrency(
                investment.expectedReturn,
              )}
              valueClassName="text-emerald-600"
            />

            <MetricRow
              label={t("investment.total_projected")}
              value={formatInvestmentCurrency(
                investment.projectedValue,
              )}
              valueClassName="text-amber-500"
            />
          </div>

          {/* Progress */}
          <div className="mt-auto pt-3">
            <div className="mb-1 flex justify-between">
              <span className="text-[9px] text-slate-400">
                {t("details.investment_progress")}
              </span>

              <span className="text-[9px] font-bold text-emerald-600">
                {investment.progress}%
              </span>
            </div>

            <div
              className="h-1.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.min(
                investment.progress,
                100,
              )}
              aria-label={`${t(
                "details.investment_progress",
              )}: ${investment.progress}%`}
            >
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(investment.progress, 0),
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="border-t border-slate-100 px-4 py-3">
        <div className="grid grid-cols-2 gap-4">
          <DateItem
            label={t("investment.purchase")}
            date={investment.startDate}
            formatDate={formatDate}
          />

          <DateItem
            label={t("investment.maturity")}
            date={investment.maturityDate}
            formatDate={formatDate}
          />
        </div>
      </div>

      {/* Action */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onView}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-600
            px-4
            py-3
            text-xs
            font-bold
            text-white
            transition
            hover:bg-emerald-700
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
            focus:ring-offset-2
          "
        >
          {isActive
            ? t("investment.view")
            : t("details.activity")}

          <ArrowRight
            size={14}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Metric Row                                                                  */
/* -------------------------------------------------------------------------- */

function MetricRow({
  label,
  value,
  icon,
  valueClassName = "text-slate-800",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
      <span className="flex items-center gap-1 text-[10px] text-slate-400">
        {icon}
        {label}
      </span>

      <span
        className={`text-right text-[11px] font-extrabold ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Date Item                                                                   */
/* -------------------------------------------------------------------------- */

function DateItem({
  label,
  date,
  formatDate,
}: {
  label: string;
  date: string;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="flex items-center gap-2">
      <CalendarDays
        size={15}
        className="shrink-0 text-emerald-500"
        aria-hidden="true"
      />

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-[11px] font-bold text-slate-700">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                                */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
  t,
}: {
  status: Investment["status"];
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const styles: Record<
    Investment["status"],
    string
  > = {
    ACTIVE:
      "bg-emerald-50 text-emerald-600",
    PENDING:
      "bg-amber-50 text-amber-600",
    MATURED:
      "bg-blue-50 text-blue-600",
    CANCELLED:
      "bg-red-50 text-red-600",
    WITHDRAWN:
      "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex
        shrink-0
        items-center
        gap-1
        rounded-full
        px-2
        py-1
        text-[9px]
        font-bold
        ${styles[status]}
      `}
    >
      {status === "ACTIVE" && (
        <CheckCircle2
          size={10}
          aria-hidden="true"
        />
      )}

      {getStatusLabel(t, status)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Translation                                                          */
/* -------------------------------------------------------------------------- */

function getStatusLabel(
  t: ReturnType<typeof useTranslation>["t"],
  status: Investment["status"],
): string {
  switch (status) {
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
      return status;
  }
}

/* -------------------------------------------------------------------------- */
/* Duration Formatting                                                         */
/* -------------------------------------------------------------------------- */

function formatDuration(
  days: number,
  language: string,
): string {
  /**
   * Keep the actual duration in days as the canonical value.
   * The label is localized through Intl.PluralRules.
   *
   * This intentionally does not convert:
   * 7 days → "1 week"
   *
   * because the investment platform uses durationDays as
   * the authoritative investment period.
   */

  const pluralRules = new Intl.PluralRules(language);

  const category = pluralRules.select(days);

  const units: Record<
    string,
    Record<Intl.LDMLPluralRule, string>
  > = {
    day: {
      zero: "days",
      one: "day",
      two: "days",
      few: "days",
      many: "days",
      other: "days",
    },
  };

  const unit =
    units.day[category] ?? "days";

  return `${new Intl.NumberFormat(language).format(
    days,
  )} ${unit}`;
}