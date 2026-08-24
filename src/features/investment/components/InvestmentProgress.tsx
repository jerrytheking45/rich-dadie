import { CheckCircle2, Clock3 } from "lucide-react";

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

  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const elapsedDays = Math.round(
    (durationDays * safeProgress) / 100,
  );

  const remainingDays = Math.max(
    durationDays - elapsedDays,
    0,
  );

  /**
   * Format dates according to the user's selected language.
   *
   * We intentionally use Intl.DateTimeFormat rather than hard-coding
   * en-GB so the entire platform follows the selected language.
   */
  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <section
      className="
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {t("details.investment_progress")}
          </p>

          <h2 className="mt-1 text-xl font-extrabold text-slate-900">
            {safeProgress}%
          </h2>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-emerald-50
            text-emerald-600
          "
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
          className="h-3 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeProgress}
          aria-label={t("details.investment_progress")}
        >
          <div
            className="
              h-full
              rounded-full
              bg-emerald-500
              transition-all
              duration-700
            "
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Progress metrics */}
      <div className="mt-3 flex justify-between">
        {/* Elapsed */}
        <div>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            {t("details.elapsed")}
          </p>

          <p className="mt-1 text-xs font-bold text-slate-700">
            {elapsedDays}{" "}
            {elapsedDays === 1 ? "day" : "days"}
          </p>
        </div>

        {/* Remaining */}
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            {t("details.remaining")}
          </p>

          <p className="mt-1 text-xs font-bold text-emerald-600">
            {remainingDays}{" "}
            {remainingDays === 1 ? "day" : "days"}
          </p>
        </div>

        {/* Total */}
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            {t("details.total_days")}
          </p>

          <p className="mt-1 text-xs font-bold text-slate-700">
            {durationDays}{" "}
            {durationDays === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
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
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[9px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}