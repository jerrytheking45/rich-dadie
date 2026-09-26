
// src/components/InvestmentOrderCard.tsx

"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";

import type { Investment } from "@/src/lib/types/investment";
import { useTranslation } from "../i18n/translations";
import { useSettings } from "@/src/context/useSettings";
import { formatUSDT } from "@/src/lib/utils/currency";
import { isZeroUUID } from "@/src/lib/utils/uuid";

interface InvestmentOrderCardProps {
  investment: Investment;
  onView?: () => void;
}

export default function InvestmentOrderCard({
  investment,
  onView,
}: InvestmentOrderCardProps) {
  const { t, language } = useTranslation();
  const { currency } = useSettings();

  const isActive = investment.status === "ACTIVE";
  const hasValidId = !isZeroUUID(investment.id);

  const formatDate = (
    date: string | null | undefined,
  ): string => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  };

  const safeProgress = Math.min(
    Math.max(investment.progress, 0),
    100,
  );

  return (
    <article className="overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-[0_16px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:border-emerald-400/15 hover:bg-[#0E1930]">
      <div className="flex min-h-56.25">
        {/* Product image */}
        <div className="relative w-[39%] min-w-33.75 overflow-hidden bg-[#07101F]">
          {investment.image ? (
            <>
              <Image
                src={investment.image}
                alt={
                  investment.planName ||
                  "Investment"
                }
                fill
                sizes="(max-width: 640px) 39vw, 250px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#050B18]/90 via-transparent to-transparent" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-[#101D33] to-[#07101F]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/8">
                <TrendingUp
                  size={30}
                  className="text-emerald-400"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-[#050B18]/70 px-3 py-2.5 backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-wide text-white">
              {getStatusLabel(
                t,
                investment.status,
              )}
            </p>
          </div>
        </div>

        {/* Information */}
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-extrabold leading-tight text-white">
                {investment.planName ||
                  "Investment"}
              </h2>

              <p className="mt-1 truncate text-[10px] text-white/30">
                {t("investment.id")}:{" "}
                {hasValidId
                  ? investment.id
                  : "—"}
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
              value={formatUSDT(
                investment.amount,
                currency,
              )}
            />

            <MetricRow
              label={t("investment.duration")}
              value={formatDuration(
                investment.durationDays ?? 0,
                language,
              )}
              icon={
                <Clock3
                  size={12}
                  aria-hidden="true"
                />
              }
            />

            <MetricRow
              label={t(
                "investment.expected_earnings",
              )}
              value={formatUSDT(
                investment.expectedReturn,
                currency,
              )}
              valueClassName="text-emerald-400"
            />

            <MetricRow
              label={t(
                "investment.total_projected",
              )}
              value={formatUSDT(
                investment.projectedValue,
                currency,
              )}
              valueClassName="text-amber-400"
            />
          </div>

          {/* Progress */}
          <div className="mt-auto pt-3">
            <div className="mb-1 flex justify-between">
              <span className="text-[9px] text-white/30">
                {t(
                  "details.investment_progress",
                )}
              </span>

              <span className="text-[9px] font-bold text-emerald-400">
                {safeProgress}%
              </span>
            </div>

            <div
              className="h-1.5 overflow-hidden rounded-full bg-white/6"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={safeProgress}
              aria-label={`${t(
                "details.investment_progress",
              )}: ${safeProgress}%`}
            >
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{
                  width: `${safeProgress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="border-t border-white/6 px-4 py-3">
        <div className="grid grid-cols-2 gap-4">
          <DateItem
            label={t("investment.purchase")}
            date={
              investment.startDate ??
              investment.createdAt ??
              null
            }
            formatDate={formatDate}
          />

          <DateItem
            label={t("investment.maturity")}
            date={
              investment.maturityDate ??
              null
            }
            formatDate={formatDate}
          />
        </div>
      </div>

      {/* Action */}
      <div className="border-t border-white/6 p-3">
        <button
          type="button"
          onClick={() => {
            if (hasValidId) {
              onView?.();
            }
          }}
          disabled={!hasValidId}
          className={[
            "flex w-full items-center justify-center gap-2",
            "rounded-xl px-4 py-3",
            "text-xs font-bold",
            "transition focus:outline-none",
            "focus:ring-2 focus:ring-emerald-400/30",
            hasValidId
              ? "bg-emerald-500 text-[#04100B] hover:bg-emerald-400"
              : "cursor-not-allowed bg-white/8 text-white/25",
          ].join(" ")}
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

function MetricRow({
  label,
  value,
  icon,
  valueClassName = "text-white",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-white/4 bg-[#07101F] px-2.5 py-1.5">
      <span className="flex items-center gap-1 text-[10px] text-white/30">
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

function DateItem({
  label,
  date,
  formatDate,
}: {
  label: string;
  date: string | null | undefined;
  formatDate: (
    date: string | null | undefined,
  ) => string;
}) {
  return (
    <div className="flex items-center gap-2">
      <CalendarDays
        size={15}
        className="shrink-0 text-emerald-400"
        aria-hidden="true"
      />

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wide text-white/25">
          {label}
        </p>

        <p className="mt-0.5 text-[11px] font-bold text-white/75">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
}

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
      "border-emerald-400/15 bg-emerald-400/10 text-emerald-400",
    PENDING:
      "border-amber-400/15 bg-amber-400/10 text-amber-400",
    MATURED:
      "border-sky-400/15 bg-sky-400/10 text-sky-400",
    CANCELLED:
      "border-red-400/15 bg-red-400/10 text-red-400",
    WITHDRAWN:
      "border-white/8 bg-white/5 text-white/40",
  };

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1",
        "rounded-full border px-2 py-1",
        "text-[9px] font-bold",
        styles[status],
      ].join(" ")}
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

function formatDuration(
  days: number,
  language: string,
): string {
  const safeDays = Math.max(0, days);

  const pluralRules =
    new Intl.PluralRules(language);

  const category =
    pluralRules.select(safeDays);

  const unit =
    category === "one" ? "day" : "days";

  return `${new Intl.NumberFormat(
    language,
  ).format(safeDays)} ${unit}`;
}