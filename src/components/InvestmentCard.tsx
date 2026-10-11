
// src/components/InvestmentCard.tsx


"use client";

import Image from "next/image";

import type { ReactNode } from "react";

import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  TrendingUp,
} from "lucide-react";

import type { Investment } from "@/src/lib/types/investment";
import { useTranslation } from "../i18n/translations";
import { useSettings } from "@/src/context/useSettings";
import { formatCurrency } from "@/src/lib/utils/currency";

interface InvestmentCardProps {
  investment: Investment;
  onClick?: () => void;
}

export default function InvestmentCard({
  investment,
  onClick,
}: InvestmentCardProps) {
  const { t, language } = useTranslation();
  const { currency } = useSettings();

  const formatAmount = (amount: number) =>
    formatCurrency(amount, currency);

  const formatDate = (
    value: string | null | undefined
  ) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    try {
      return new Intl.DateTimeFormat(language, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    }
  };

  const statusLabel = (() => {
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
  })();

  const statusClass = (() => {
    switch (investment.status) {
      case "ACTIVE":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

      case "MATURED":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

      case "PENDING":
        return "border-white/15 bg-white/5 text-white/65";

      case "CANCELLED":
        return "border-red-400/20 bg-red-400/10 text-red-300";

      default:
        return "border-white/10 bg-white/5 text-white/55";
    }
  })();

  const durationDays = investment.durationDays ?? 0;

  const rawProgress = Number(investment.progress);

  const progress = Number.isFinite(rawProgress)
    ? Math.min(Math.max(rawProgress, 0), 100)
    : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        "group w-full overflow-hidden rounded-2xl border border-white/8",
        "bg-[#0B1426] text-left shadow-lg shadow-black/10",
        "transition duration-300",
        "hover:-translate-y-0.5 hover:border-[#E60033]/25 hover:bg-[#101D30]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50",
        "disabled:cursor-default disabled:hover:translate-y-0",
      ].join(" ")}
    >
      <div className="flex min-h-44">

        {/* PLAN IMAGE */}
        <div className="relative w-[34%] min-w-25 shrink-0 overflow-hidden bg-[#07101F] sm:w-[32%]">
          {investment.image ? (
            <Image
              src={investment.image}
              alt={investment.planName || "Investment"}
              fill
              sizes="(max-width: 640px) 34vw, 240px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#E60033]/15 to-[#07101F]">
              <TrendingUp
                size={28}
                className="text-[#FF476B]/55"
                aria-hidden="true"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-[#050B18]/90 via-[#050B18]/10 to-transparent" />

          <div className="absolute bottom-2.5 left-2.5 right-2.5">
            <span className="inline-flex rounded-full border border-white/15 bg-[#050B18]/65 px-2 py-1 text-[8px] font-bold text-white/75 backdrop-blur-sm">
              Investment
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">

          {/* Title and status */}
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-xs font-black text-white sm:text-sm">
                {investment.planName || "Investment"}
              </h3>

              <span
                className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold ${statusClass}`}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-current"
                />

                {statusLabel}
              </span>
            </div>

            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="shrink-0 text-white/30 transition group-hover:text-[#FF476B]"
            />
          </div>

          {/* Statistics */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
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
              value={formatDuration(durationDays, language)}
              icon={<Clock3 size={10} aria-hidden="true" />}
            />

            <InfoItem
              label={t("details.progress_percent")}
              value={`${progress}%`}
            />
          </div>

          {/* Progress */}
          <div className="mt-auto pt-3">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[9px] text-white/45">
              <span className="truncate">
                {t("details.investment_progress")}
              </span>

              <span className="shrink-0 font-bold text-emerald-300 tabular-nums">
                {progress}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-label={t("details.investment_progress")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-1.5 overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-300 transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Maturity */}
          <div className="mt-2.5 flex min-w-0 items-center gap-1.5 text-[9px] text-white/45">
            <CalendarDays
              size={11}
              className="shrink-0 text-[#FF476B]"
              aria-hidden="true"
            />

            <span className="truncate">
              {t("investment.maturity")}{" "}
              {formatDate(investment.maturityDate)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ==========================================
   STATISTIC ITEM
========================================== */

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
    <div className="min-w-0 rounded-lg border border-white/6 bg-white/2.5 px-2 py-2 sm:px-2.5">
      <div className="flex min-w-0 items-center gap-1 text-[8px] font-semibold text-white/40">
        {icon}
        <span className="truncate">{label}</span>
      </div>

      <p
        title={value}
        className="mt-1 truncate text-[10px] font-black text-white/85 tabular-nums sm:text-[11px]"
      >
        {value}
      </p>
    </div>
  );
}

/* ==========================================
   LOCALIZED DURATION
========================================== */

function formatDuration(
  days: number,
  language: string
): string {
  const safeDays = Number.isFinite(days)
    ? Math.max(0, Math.floor(days))
    : 0;

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

  try {
    const formattedNumber = new Intl.NumberFormat(
      language
    ).format(safeDays);

    const singular = singularForms[normalizedLanguage];
    const plural = pluralForms[normalizedLanguage];

    if (!singular || !plural) {
      return `${formattedNumber} days`;
    }

    return `${formattedNumber} ${
      safeDays === 1 ? singular : plural
    }`;
  } catch {
    return `${safeDays} days`;
  }
}