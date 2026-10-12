
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import SupportFloatingButton from "@/src/components/support/SupportFloatingButton";

import { useSearch } from "@/src/hooks/useSearch";
import type { SearchQueryType } from "@/src/lib/types/search";

import SearchInput from "@/src/components/search/SearchInput";
import SearchFilters from "@/src/components/search/SearchFilters";
import SearchResults from "@/src/components/search/SearchResults";
import SearchEmptyState from "@/src/components/search/SearchEmptyState";

export default function SearchPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchQueryType>("all");

  const {
    data,
    results,
    loading,
    error,
    search,
    clear,
  } = useSearch();

  /* ==========================================
     DEBOUNCED SEARCH
  ========================================== */

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      clear();
      return;
    }

    const timeout = window.setTimeout(() => {
      void search(trimmed, type);
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, type, search, clear]);

  const handleClear = () => {
    setQuery("");
    clear();
  };

  const handleRetry = () => {
    const trimmed = query.trim();

    if (trimmed) {
      void search(trimmed, type);
    }
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-white">

      {/* BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -right-28 -top-24 h-72 w-72 rounded-full bg-[#E60033]/8 blur-[90px]" />

        <div className="absolute -left-28 top-[45%] h-72 w-72 rounded-full bg-[#E60033]/5 blur-[90px]" />
      </div>

      <main className="relative mx-auto w-full min-w-0 max-w-2xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:max-w-5xl lg:px-8">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="flex min-w-0 items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 transition hover:border-[#E60033]/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 sm:h-10 sm:w-10"
            >
              <ArrowLeft size={17} aria-hidden="true" />
            </button>

            <div className="min-w-0">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#FF476B]">
                REDIQ
              </p>

              <h1 className="text-[19px] font-black tracking-tight text-white sm:text-[23px]">
                Search
              </h1>

              <p className="truncate text-[10px] text-white/40 sm:text-[11px]">
                Find information across your account
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B] sm:h-10 sm:w-10">
            <Search size={17} aria-hidden="true" />
          </div>
        </header>

        {/* =====================================
            SEARCH PANEL
        ====================================== */}

        <section className="relative mt-5 min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-linear-to-br from-[#1C1020] via-[#0B1426] to-[#07101F] p-4 shadow-xl shadow-black/20 sm:rounded-[26px] sm:p-6">

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#E60033]/10 blur-[55px]"
          />

          <div className="relative">

            {/* INTRO */}
            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B] sm:h-10 sm:w-10">
                <Sparkles size={17} aria-hidden="true" />
              </div>

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FF476B]">
                  Account Search
                </p>

                <h2 className="mt-1 text-[15px] font-black tracking-tight text-white sm:text-lg">
                  What are you looking for?
                </h2>

                <p className="mt-1 max-w-md text-[10px] leading-5 text-white/50 sm:text-xs">
                  Search your investments, deposits, withdrawals,
                  plans, transactions and support records.
                </p>
              </div>
            </div>

            {/* INPUT */}
            <div className="mt-5">
              <SearchInput
                value={query}
                onChange={setQuery}
                onClear={handleClear}
                autoFocus
              />
            </div>

            {/* FILTERS */}
            <div className="mt-3">
              <SearchFilters
                value={type}
                onChange={setType}
              />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/50 to-transparent"
          />
        </section>

        {/* =====================================
            RESULTS INFORMATION
        ====================================== */}

        {hasQuery && !loading && !error && data && (
          <div className="mt-5 flex min-w-0 items-center justify-between gap-3 px-1">

            <div className="min-w-0">

              <p className="text-[10px] text-white/40">
                Search results for
              </p>

              <p className="mt-0.5 truncate text-xs font-bold text-white/80">
                &ldquo;{data.query}&rdquo;
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-3 py-1.5 text-[10px] font-bold text-[#FF476B]">
              {data.total}
              <span className="font-medium text-white/55">
                {data.total === 1 ? "result" : "results"}
              </span>
            </span>
          </div>
        )}

        {/* =====================================
            SEARCH CONTENT
        ====================================== */}

        <section
          aria-label="Search results"
          aria-live="polite"
          className="mt-4 min-w-0"
        >

          {/* LOADING */}
          {loading && (
            <div
              role="status"
              className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1426] px-4 py-9 text-center"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10">
                <Loader2
                  size={19}
                  className="animate-spin text-[#FF476B]"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-3 text-xs font-bold text-white/80">
                Searching...
              </p>

              <p className="mt-1 text-[10px] text-white/40">
                Looking through your REDIQ account
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div
              role="alert"
              className="rounded-2xl border border-[#E60033]/20 bg-[#0B1426] px-4 py-8 text-center"
            >

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                <Search size={19} aria-hidden="true" />
              </div>

              <h3 className="mt-3 text-sm font-black text-white">
                Search failed
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/50">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-5 text-[11px] font-bold text-white transition hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B]"
              >
                <RefreshCw size={14} aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {/* INITIAL */}
          {!loading && !error && !hasQuery && (
            <SearchEmptyState />
          )}

          {/* RESULTS */}
          {!loading && !error && hasQuery && data && (
            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] p-3 sm:p-4">
              <SearchResults
                results={results}
                query={data.query}
                total={data.total}
              />
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="pt-7 text-center">
          <p className="text-[9px] text-white/30">
            REDIQ Account Search
          </p>
        </footer>
      </main>

      <SupportFloatingButton />
    </div>
  );
}