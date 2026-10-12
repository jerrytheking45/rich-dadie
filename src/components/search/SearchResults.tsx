
"use client";

import { SearchX } from "lucide-react";

import type { SearchResult } from "@/src/lib/types/search";

import SearchResultItem from "./SearchResultItem";

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

  /* ==========================================
     NO RESULTS
  ========================================== */

  if (!results.length) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-[#07101F] px-4 py-10 text-center sm:py-12">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E60033]/5 blur-[50px]"
        />

        <div className="relative">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
            <SearchX size={21} aria-hidden="true" />
          </div>

          <h3 className="mt-4 text-sm font-black text-white">
            No results found
          </h3>

          <p className="mx-auto mt-2 max-w-xs wrap-break-word text-[11px] leading-5 text-white/50">
            Nothing matched &ldquo;{query}&rdquo;.
            Try another search term or select a different category.
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================
     RESULTS LIST
  ========================================== */

  return (
    <div className="min-w-0">

      {/* SUMMARY */}
      <div className="mb-3 flex min-w-0 items-center justify-between gap-3 px-1">

        <div className="flex shrink-0 items-center gap-2">

          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Results
          </span>

          <span className="rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2 py-0.5 text-[10px] font-black tabular-nums text-[#FF476B]">
            {total}
          </span>
        </div>

        <p className="min-w-0 max-w-[55%] truncate text-right text-[10px] text-white/40">
          &ldquo;{query}&rdquo;
        </p>
      </div>

      {/* ITEMS */}
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