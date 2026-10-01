'use client';

import {
  SearchX,
} from 'lucide-react';

import type {
  SearchResult,
} from '@/src/lib/types/search';

import SearchResultItem from './SearchResultItem';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  total: number;
}

export default function SearchResults({
  results,
  query,
  total,
}: SearchResultsProps) {
  if (!results.length) {
    return (
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-dashed
          border-white/8
          bg-[#07101F]
          px-5
          py-12
          text-center
        "
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />

        <div className="relative">
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-white/8
              bg-white/4
              text-white/25
            "
          >
            <SearchX size={19} />
          </div>

          <h3 className="mt-4 text-sm font-extrabold text-white">
            No results found
          </h3>

          <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-white/30">
            Nothing matched &quot;{query}&quot;.
            Try a different search term or category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* SUMMARY */}
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-white/30">
            Results
          </span>

          <span
            className="
              rounded-full
              border
              border-emerald-400/10
              bg-emerald-400/5
              px-2
              py-0.5
              text-[9px]
              font-extrabold
              tabular-nums
              text-emerald-400
            "
          >
            {total}
          </span>
        </div>

        <p className="min-w-0 max-w-[55%] truncate text-right text-[10px] text-white/20">
          &quot;{query}&quot;
        </p>
      </div>

      {/* RESULTS */}
      <div className="space-y-2">
        {results.map((result) => (
          <SearchResultItem
            key={`${result.type}-${result.id}`}
            result={result}
          />
        ))}
      </div>
    </div>
  );
}