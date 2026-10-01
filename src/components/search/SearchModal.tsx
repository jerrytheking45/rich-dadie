
'use client';

import {
  ArrowLeft,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSearch } from '@/src/hooks/useSearch';
import type {
  SearchQueryType,
} from '@/src/lib/types/search';

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
  const [type, setType] =
    useState<SearchQueryType>('all');

  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const {
    data,
    results,
    loading,
    error,
    search,
    clear,
  } = useSearch();

  const handleClose = useCallback(() => {
  setQuery('');
  setType('all');
  clear();
  onClose();
}, [clear, onClose]);

  /*
   * Focus the search field whenever
   * the modal becomes visible.
   *
   * No state is changed inside this effect.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [open]);

  /*
   * Debounced search.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      clear();
      return;
    }

    const timeout = window.setTimeout(() => {
      void search(
        trimmedQuery,
        type,
      );
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
   * Lock background scrolling while
   * the search modal is open.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /*
   * Escape closes the modal.
   */
  useEffect(() => {
  if (!open) {
    return;
  }

  const handleKeyDown = (
    event: KeyboardEvent,
  ) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  window.addEventListener(
    'keydown',
    handleKeyDown,
  );

  return () => {
    window.removeEventListener(
      'keydown',
      handleKeyDown,
    );
  };
}, [open, handleClose]);

  /*
   * Reset happens from the close action,
   * not from an effect.
   */

  const handleClear = () => {
    setQuery('');
    clear();

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleRetry = () => {
    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      return;
    }

    void search(
      trimmedQuery,
      type,
    );
  };

  if (!open) {
    return null;
  }

  const hasQuery =
    query.trim().length > 0;

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        items-end
        justify-center
        bg-black/65
        px-0
        backdrop-blur-md
        sm:items-center
        sm:px-4
      "
      role="dialog"
      aria-modal="true"
      aria-label="Search your account"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      {/* BACKGROUND GLOW */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -right-24
            -top-24
            h-80
            w-80
            rounded-full
            bg-purple-600/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-24
            -left-24
            h-80
            w-80
            rounded-full
            bg-emerald-500/8
            blur-3xl
          "
        />
      </div>

      {/* MODAL */}
      <div
        className="
          relative
          flex
          h-[94vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[30px]
          border
          border-white/8
          bg-[#050B18]
          shadow-2xl
          shadow-black/50

          sm:h-auto
          sm:max-h-[calc(100vh-3rem)]
          sm:max-w-2xl
          sm:rounded-[30px]

          lg:max-w-3xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* MODAL GLOW */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-32
            h-72
            w-72
            rounded-full
            bg-purple-500/10
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-24
            bottom-0
            h-64
            w-64
            rounded-full
            bg-emerald-500/5
            blur-3xl
          "
        />

        {/* HEADER */}
        <header
          className="
            relative
            flex
            shrink-0
            items-center
            gap-3
            border-b
            border-white/8
            bg-[#07101F]/95
            px-4
            py-3.5
            backdrop-blur-xl
            sm:px-5
          "
        >
          {/* MOBILE HANDLE */}
          <div
            aria-hidden="true"
            className="
              absolute
              left-1/2
              top-1.5
              h-1
              w-10
              -translate-x-1/2
              rounded-full
              bg-white/10
              sm:hidden
            "
          />

          {/* CLOSE */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="
              mt-1
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/8
              bg-white/4
              text-white/45
              transition
              hover:bg-white/8
              hover:text-white
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-400/20
            "
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
            />
          </button>

          {/* TITLE */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-emerald-400/65
                "
              >
                REDIQ
              </span>

              <span
                aria-hidden="true"
                className="
                  h-1
                  w-1
                  rounded-full
                  bg-white/15
                "
              />

              <span className="text-[9px] font-semibold text-white/25">
                Account Search
              </span>
            </div>

            <h2 className="mt-0.5 text-[16px] font-extrabold text-white sm:text-[17px]">
              Search
            </h2>
          </div>

          {/* SEARCH ICON */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-purple-400/10
              bg-purple-400/10
              text-purple-300
            "
          >
            <Search
              size={16}
              aria-hidden="true"
            />
          </div>

          {/* DESKTOP CLOSE */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="
              hidden
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/8
              bg-white/4
              text-white/30
              transition
              hover:bg-white/8
              hover:text-white
              sm:flex
            "
          >
            <X size={16} />
          </button>
        </header>

        {/* CONTENT */}
        <div
          className="
            relative
            min-h-0
            flex-1
            overflow-y-auto
          "
        >
          <div
            className="
              px-4
              pb-8
              pt-4
              sm:px-5
              sm:pb-9
              sm:pt-5
            "
          >
            {/* INTRO */}
            <div className="mb-4">
              <p className="text-[11px] leading-5 text-white/30">
                Search across your investments,
                deposits, withdrawals,
                transactions and support.
              </p>
            </div>

            {/* INPUT */}
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={handleClear}
              autoFocus
              inputRef={inputRef}
            />

            {/* FILTERS */}
            <div className="mt-3">
              <SearchFilters
                value={type}
                onChange={setType}
              />
            </div>

            {/* RESULTS */}
            <div className="mt-5">
              {/* LOADING */}
              {loading && (
                <div
                  className="
                    flex
                    min-h-52
                    flex-col
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-white/8
                    bg-[#07101F]
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-emerald-400/10
                      bg-emerald-400/10
                    "
                  >
                    <Loader2
                      size={18}
                      className="
                        animate-spin
                        text-emerald-400
                      "
                    />
                  </div>

                  <p className="mt-3 text-xs font-bold text-white/70">
                    Searching...
                  </p>

                  <p className="mt-1 text-[10px] text-white/25">
                    Looking through your account
                  </p>
                </div>
              )}

              {/* ERROR */}
              {!loading && error && (
                <div
                  className="
                    rounded-3xl
                    border
                    border-red-400/10
                    bg-[#07101F]
                    px-5
                    py-9
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-red-400/10
                      bg-red-400/10
                    "
                  >
                    <Search
                      size={18}
                      className="text-red-400"
                    />
                  </div>

                  <p
                    className="
                      mt-3
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-red-400/60
                    "
                  >
                    Search Error
                  </p>

                  <h3 className="mt-1 text-sm font-extrabold text-white">
                    Search failed
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/30">
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
                    "
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* INITIAL */}
              {!loading &&
                !error &&
                !hasQuery && (
                  <SearchEmptyState />
                )}

              {/* RESULTS */}
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

        {/* FOOTER */}
        <div
          className="
            relative
            hidden
            shrink-0
            border-t
            border-white/6
            px-5
            py-2.5
            text-center
            sm:block
          "
        >
          <p className="text-[8px] text-white/15">
            Secure REDIQ account search
          </p>
        </div>
      </div>
    </div>
  );
}
