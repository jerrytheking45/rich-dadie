"use client";

import {
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { useSettings } from "../context/useSettings";
import { useTranslation } from "../i18n/translations";

interface InvestmentProgressProps {
  progress: number;
  durationDays: number;
  startDate: string;
  maturityDate: string;
}

export default function InvestmentProgress({
  progress,
  durationDays,
  startDate,
  maturityDate,
}: InvestmentProgressProps) {
  const { language } = useSettings();
  const { t } = useTranslation();

  const safeProgress = Math.min(
    Math.max(progress, 0),
    100,
  );

  const safeDuration = Math.max(
    durationDays,
    0,
  );

  const elapsedDays = Math.round(
    (safeDuration * safeProgress) / 100,
  );

  const remainingDays = Math.max(
    safeDuration - elapsedDays,
    0,
  );

  const formatDate = (
    value: string,
  ): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      language,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    ).format(date);
  };

  const formatDays = (days: number): string => {
    return `${new Intl.NumberFormat(
      language,
    ).format(days)} ${
      days === 1 ? "day" : "days"
    }`;
  };

  return (
    <section className="rounded-3xl border border-white/8 bg-[#0B1426] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
            {t(
              "details.investment_progress",
            )}
          </p>

          <h2 className="mt-1 text-xl font-extrabold text-white">
            {safeProgress}%
          </h2>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-400"
          aria-hidden="true"
        >
          {safeProgress >= 100 ? (
            <CheckCircle2 size={20} />
          ) : (
            <Clock3 size={20} />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div
          className="h-3 overflow-hidden rounded-full bg-white/6"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeProgress}
          aria-label={t(
            "details.investment_progress",
          )}
        >
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-700"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Progress metrics */}
      <div className="mt-3 flex justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wide text-white/25">
            {t("details.elapsed")}
          </p>

          <p className="mt-1 text-xs font-bold text-white/75">
            {formatDays(elapsedDays)}
          </p>
        </div>

        <div className="text-center">
          <p className="text-[9px] uppercase tracking-wide text-white/25">
            {t("details.remaining")}
          </p>

          <p className="mt-1 text-xs font-bold text-emerald-400">
            {formatDays(remainingDays)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wide text-white/25">
            {t("details.total_days")}
          </p>

          <p className="mt-1 text-xs font-bold text-white/75">
            {formatDays(safeDuration)}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/6 pt-4">
        <DateBlock
          label={t("details.started")}
          value={formatDate(startDate)}
        />

        <DateBlock
          label={t("details.maturity_date")}
          value={formatDate(maturityDate)}
        />
      </div>
    </section>
  );
}

interface DateBlockProps {
  label: string;
  value: string;
}

function DateBlock({
  label,
  value,
}: DateBlockProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#07101F] p-3">
      <p className="text-[9px] uppercase tracking-wide text-white/25">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-white/75">
        {value}
      </p>
    </div>
  );
}