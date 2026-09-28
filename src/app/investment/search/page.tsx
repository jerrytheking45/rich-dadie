
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  Search,
  //Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

//import InvestmentBottomNav from '@/src/components/InvestmentBottomNav';
import SupportFloatingButton from '@/src/components/support/SupportFloatingButton';

import { useSearch } from '@/src/hooks/useSearch';
import type {
  SearchQueryType,
} from '@/src/lib/types/search';

import SearchInput from '@/src/components/search/SearchInput';
import SearchFilters from '@/src/components/search/SearchFilters';
import SearchResults from '@/src/components/search/SearchResults';
import SearchEmptyState from '@/src/components/search/SearchEmptyState';

export default function SearchPage() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [type, setType] =
    useState<SearchQueryType>('all');

  const {
    data,
    results,
    loading,
    error,
    search,
    clear,
  } = useSearch();

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      clear();
      return;
    }

    const timeout = window.setTimeout(() => {
      void search(trimmedQuery, type);
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    query,
    type,
    search,
    clear,
  ]);

  const handleClear = () => {
    setQuery('');
    clear();
  };

  const handleTypeChange = (
    nextType: SearchQueryType,
  ) => {
    setType(nextType);
  };

  const handleRetry = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    void search(trimmedQuery, type);
  };

  const hasQuery =
    query.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      {/* ----------------------------------------------------------
          BACKGROUND GLOW
      ----------------------------------------------------------- */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute -left-32 top-[38%] h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* ========================================================
            HEADER
        ========================================================= */}
        <header className="flex items-center justify-between gap-3">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white/8
                bg-[#0B1426]
                text-white/55
                shadow-lg
                shadow-black/10
                transition
                hover:bg-[#101D33]
                hover:text-white
                active:scale-95
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-300/30
              "
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400/60">
                REDIQ
              </p>

              <h1 className="mt-0.5 truncate text-[20px] font-extrabold tracking-tight text-white sm:text-[22px]">
                Search
              </h1>

              <p className="truncate text-[10px] text-white/30 sm:text-[11px]">
                Find information across your account
              </p>
            </div>
          </div>

          {/* RIGHT â€” SEARCH ICON */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-purple-400/10 bg-purple-400/10 text-purple-300">
            <Search
              size={17}
              aria-hidden="true"
            />
          </div>
        </header>

        {/* ========================================================
            SEARCH HERO
        ========================================================= */}
        <section className="relative mt-5 overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-xl shadow-black/10 sm:p-6">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="relative">
            {/* TITLE */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-emerald-400">
                <Search size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400/70">
                  Account Search
                </p>

                <h2 className="mt-1 text-[15px] font-extrabold text-white">
                  What are you looking for?
                </h2>

                <p className="mt-0.5 text-[10px] leading-5 text-white/35">
                  Search investments, transactions,
                  members and account information.
                </p>
              </div>
            </div>

            {/* SEARCH INPUT */}
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
                onChange={handleTypeChange}
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            SEARCH STATUS
        ========================================================= */}
        {hasQuery && !loading && !error && data && (
          <div className="mt-4 flex items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-white/30">
                Search results for
              </p>

              <p className="mt-0.5 truncate text-xs font-bold text-white/70">
                â€œ{data.query}â€
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-2.5 py-1.5">
              <span className="text-[9px] font-bold text-white/35">
                Results
              </span>

              <span className="text-[10px] font-extrabold tabular-nums text-emerald-400">
                {data.total}
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            SEARCH CONTENT
        ========================================================= */}
        <section className="mt-5">
          {/* ------------------------------------------------------
              LOADING
          ------------------------------------------------------- */}
          {loading && (
            <div className="overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
              <div className="flex min-h-60 flex-col items-center justify-center px-5 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/10">
                  <Loader2
                    size={19}
                    className="animate-spin text-emerald-400"
                  />
                </div>

                <p className="mt-4 text-sm font-bold text-white/75">
                  Searching...
                </p>

                <p className="mt-1 text-[10px] text-white/30">
                  Looking through your REDIQ account
                </p>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------
              ERROR
          ------------------------------------------------------- */}
          {!loading && error && (
            <div className="overflow-hidden rounded-[26px] border border-red-400/10 bg-[#0B1426] shadow-xl shadow-black/10">
              <div className="px-5 py-9 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/10">
                  <Search
                    size={19}
                    className="text-red-400"
                  />
                </div>

                <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-red-400/60">
                  Search Error
                </p>

                <h3 className="mt-1 text-sm font-extrabold text-white">
                  Search failed
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/35">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-emerald-400/10
                    bg-emerald-400/10
                    px-5
                    py-2.5
                    text-[10px]
                    font-bold
                    text-emerald-400
                    transition
                    hover:bg-emerald-400/15
                    hover:text-emerald-300
                    active:scale-95
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-400/20
                  "
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

{!loading && !error && !hasQuery && <SearchEmptyState />}

          {/* ------------------------------------------------------
              RESULTS
          ------------------------------------------------------- */}
          {!loading &&
            !error &&
            hasQuery &&
            data && (
              <div className="overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
                <SearchResults
                  results={results}
                  query={data.query}
                  total={data.total}
                />
              </div>
            )}
        </section>

        {/* ========================================================
            FOOTER
        ========================================================= */}
        <div className="pb-2 pt-7 text-center">
          <p className="text-[9px] text-white/20">
            REDIQ Search
          </p>

          <p className="mt-0.5 text-[8px] text-white/15">
            Secure investment account search
          </p>
        </div>
      </main>

      {/* FLOATING SUPPORT */}
      <SupportFloatingButton /> 
    </div>
  );
}

