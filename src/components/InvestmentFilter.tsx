
// src/components/InvestmentFilter.tsx

"use client";

import { useTranslation } from "../i18n/translations";
import type { InvestmentStatus } from "@/src/lib/types/investment";

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
 * Only UI labels are translated.
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
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      role="tablist"
      aria-label={t("filter.all")}
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
            className={[
              "shrink-0 rounded-full px-4 py-2",
              "text-xs font-semibold",
              "transition-all duration-200",
              "focus:outline-none",
              "focus:ring-2 focus:ring-emerald-400/30",
              active
                ? [
                    "border border-emerald-400/20",
                    "bg-emerald-400/12",
                    "text-emerald-400",
                    "shadow-[0_0_20px_rgba(16,185,129,0.08)]",
                  ].join(" ")
                : [
                    "border border-white/8",
                    "bg-[#0B1426]",
                    "text-white/45",
                    "hover:border-emerald-400/15",
                    "hover:bg-[#0E1930]",
                    "hover:text-white/80",
                  ].join(" "),
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}