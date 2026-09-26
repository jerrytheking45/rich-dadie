
'use client';

import {
  ArrowLeft,
  Loader2,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { useSearch } from '@/src/hooks/useSearch';
import type { SearchQueryType } from '@/src/lib/types/search';

import SearchInput from './SearchInput';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import SearchEmptyState from './SearchEmptyState';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({
  open,
  onClose,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<SearchQueryType>('all');

  const {
    data,
    results,
    loading,
    error,
    search,
    clear,
  } = useSearch();

  /*
   * Search with a small debounce.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

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
    open,
    query,
    type,
    search,
    clear,
  ]);

  /*
   * Prevent background page scrolling.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /*
   * Escape closes the modal.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const hasQuery = query.trim().length > 0;

  /*
   * Clear the current search without closing the modal.
   */
  const handleClear = () => {
    setQuery('');
    clear();
  };

  /*
   * Close the modal.
   *
   * Reset local state here instead of inside a useEffect.
   * This avoids synchronous setState calls from effects.
   */
  const handleClose = () => {
    setQuery('');
    setType('all');
    clear();
    onClose();
  };

  const handleRetry = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    void search(trimmedQuery, type);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        items-start
        justify-center
        bg-slate-950/40
        p-0
        backdrop-blur-[2px]
        sm:p-4
      "
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          bg-[#f6f8f6]
          sm:h-auto
          sm:max-h-[calc(100vh-2rem)]
          sm:max-w-2xl
          sm:rounded-[28px]
          sm:border
          sm:border-slate-200
          sm:shadow-2xl
          lg:max-w-3xl
        "
      >
        {/* Header */}
        <header
          className="
            flex
            shrink-0
            items-center
            gap-3
            border-b
            border-slate-100
            bg-white
            px-4
            py-3
            sm:px-5
          "
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-50
              hover:text-slate-900
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/30
            "
          >
            <ArrowLeft
              size={19}
              aria-hidden="true"
            />
          </button>

          <div className="min-w-0">
            <h2 className="text-[17px] font-extrabold text-slate-900">
              Search
            </h2>

            <p className="truncate text-[11px] text-slate-400">
              Find anything in your investment account
            </p>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-4 pb-8 pt-4 sm:px-5 sm:pt-5">
            {/* Search input */}
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={handleClear}
              autoFocus
            />

            {/* Filters */}
            <div className="mt-3">
              <SearchFilters
                value={type}
                onChange={setType}
              />
            </div>

            {/* Content */}
            <div className="mt-5">
              {/* Loading */}
              {loading && (
                <div
                  className="
                    flex
                    min-h-55
                    items-center
                    justify-center
                  "
                >
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />

                    <span>Searching...</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div
                  className="
                    rounded-[22px]
                    border
                    border-red-100
                    bg-white
                    px-5
                    py-8
                    text-center
                    shadow-sm
                  "
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                    <Search
                      size={18}
                      className="text-red-400"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-800">
                    Search failed
                  </h3>

                  <p className="mx-auto mt-1 max-w-xs text-[11px] leading-5 text-slate-400">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="
                      mt-4
                      rounded-xl
                      bg-emerald-600
                      px-4
                      py-2.5
                      text-xs
                      font-bold
                      text-white
                      transition
                      hover:bg-emerald-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-emerald-500/30
                    "
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty / initial */}
              {!loading &&
                !error &&
                !hasQuery && (
                  <SearchEmptyState />
                )}

              {/* Results */}
              {!loading &&
                !error &&
                hasQuery &&
                data && (
                  <SearchResults
                    results={results}
                    query={data.query}
                    total={data.total}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}