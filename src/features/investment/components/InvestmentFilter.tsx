// src/features/investment/components/InvestmentFilter.tsx

import { useTranslation } from "../i18n/translations";
import type { InvestmentStatus } from "../types/investment";

export type InvestmentFilterValue =
  | "ALL"
  | InvestmentStatus;

interface InvestmentFilterProps {
  value: InvestmentFilterValue;
  onChange: (value: InvestmentFilterValue) => void;
}

/**
 * Filter configuration.
 *
 * Values are domain-level constants and must NOT be translated.
 * Only the UI labels are translated through `useTranslation()`.
 */
const filters: {
  value: InvestmentFilterValue;
  translationKey:
    | "filter.all"
    | "filter.active"
    | "filter.pending"
    | "filter.matured";
}[] = [
  {
    value: "ALL",
    translationKey: "filter.all",
  },
  {
    value: "ACTIVE",
    translationKey: "filter.active",
  },
  {
    value: "PENDING",
    translationKey: "filter.pending",
  },
  {
    value: "MATURED",
    translationKey: "filter.matured",
  },
];

export default function InvestmentFilter({
  value,
  onChange,
}: InvestmentFilterProps) {
  const { t } = useTranslation();

  return (
    <div
      className="
        flex
        gap-2
        overflow-x-auto
        pb-1
        scrollbar-hide
      "
      role="tablist"
      aria-label="Investment filters"
    >
      {filters.map((filter) => {
        const active = value === filter.value;
        const label = t(filter.translationKey);

        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter.value)}
            className={`
              shrink-0
              rounded-full
              px-4
              py-2
              text-xs
              font-semibold
              transition-all
              duration-200
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/30
              ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}