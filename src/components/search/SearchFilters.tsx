
"use client";

import type {
  SearchQueryType,
} from "@/src/lib/types/search";

interface SearchFiltersProps {
  value: SearchQueryType;
  onChange: (value: SearchQueryType) => void;
}

const filters: {
  value: SearchQueryType;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "investments", label: "Investments" },
  { value: "deposits", label: "Deposits" },
  { value: "withdrawals", label: "Withdrawals" },
  { value: "plans", label: "Plans" },
  { value: "transactions", label: "Transactions" },
  { value: "support", label: "Support" },
];

export default function SearchFilters({
  value,
  onChange,
}: SearchFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter search results"
      className="-mx-1 flex min-w-0 gap-1.5 overflow-x-auto px-1 pb-1 scrollbar-none sm:flex-wrap sm:gap-2"
    >
      {filters.map((filter) => {
        const active = value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(filter.value)}
            className={[
              "inline-flex min-h-8 shrink-0 items-center justify-center rounded-full border px-3 text-[10px] font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B] sm:min-h-9 sm:px-3.5 sm:text-[11px]",
              active
                ? "border-[#E60033] bg-[#E60033] text-white shadow-md shadow-[#E60033]/15"
                : "border-white/10 bg-white/5 text-white/55 hover:border-[#E60033]/30 hover:bg-[#E60033]/10 hover:text-white",
            ].join(" ")}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}