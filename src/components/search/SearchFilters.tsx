
'use client';

import type {
  SearchQueryType,
} from '@/src/lib/types/search';

interface SearchFiltersProps {
  value: SearchQueryType;
  onChange: (
    value: SearchQueryType,
  ) => void;
}

const filters: {
  value: SearchQueryType;
  label: string;
}[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'investments',
    label: 'Investments',
  },
  {
    value: 'deposits',
    label: 'Deposits',
  },
  {
    value: 'withdrawals',
    label: 'Withdrawals',
  },
  {
    value: 'plans',
    label: 'Plans',
  },
  {
    value: 'transactions',
    label: 'Transactions',
  },
  {
    value: 'support',
    label: 'Support',
  },
];

export default function SearchFilters({
  value,
  onChange,
}: SearchFiltersProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
      {filters.map((filter) => {
        const active =
          value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() =>
              onChange(filter.value)
            }
            className={[
              'shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold transition sm:text-xs',
              active
                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-500/5'
                : 'border-white/8 bg-white/4 text-white/40 hover:border-white/12 hover:bg-white/6 hover:text-white/70',
            ].join(' ')}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}