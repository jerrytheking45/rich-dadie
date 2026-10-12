
"use client";

import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSearch } from "@/src/hooks/useSearch";

import type {
  SearchQueryType,
} from "@/src/lib/types/search";

import SearchInput from "./SearchInput";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResults";
import SearchEmptyState from "./SearchEmptyState";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({
  open,
  onClose,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [type, setType] =
    useState<SearchQueryType>("all");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    results,
    loading,
    error,
    search,
    clear,
  } = useSearch();

  /* ==========================================
     CLOSE
  ========================================== */

  const handleClose = useCallback(() => {
    setQuery("");
    setType("all");
    clear();
    onClose();
  }, [clear, onClose]);

  /* ==========================================
     AUTOFOCUS
  ========================================== */

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement;

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timeout);

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [open]);

  /* ==========================================
     DEBOUNCED SEARCH
  ========================================== */

  useEffect(() => {
    if (!open) return;

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
  }, [open, query, type, search, clear]);

  /* ==========================================
     BACKGROUND SCROLL LOCK
  ========================================== */

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /* ==========================================
     KEYBOARD HANDLING
  ========================================== */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;

      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) => element.getClientRects().length > 0
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleClose]);

  /* ==========================================
     ACTIONS
  ========================================== */

  const handleClear = () => {
    setQuery("");
    clear();

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleRetry = () => {
    const trimmed = query.trim();

    if (trimmed) {
      void search(trimmed, type);
    }
  };

  if (!open) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >

      {/* =====================================
          MODAL
      ====================================== */}

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rediq-search-title"
        className="relative flex h-[94dvh] w-full min-w-0 flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#050B18] shadow-2xl shadow-black/50 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:rounded-3xl lg:max-w-3xl"
      >

        {/* TOP ACCENT */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/60 to-transparent"
        />

        {/* HEADER */}
        <header className="relative flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#07101F] px-4 pb-3 pt-5 sm:px-5 sm:py-4">

          {/* MOBILE HANDLE */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2 h-1 w-9 -translate-x-1/2 rounded-full bg-white/20 sm:hidden"
          />

          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50"
          >
            <ArrowLeft size={17} aria-hidden="true" />
          </button>

          {/* TITLE */}
          <div className="min-w-0 flex-1">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FF476B]">
              REDIQ · Account Search
            </p>

            <h2
              id="rediq-search-title"
              className="mt-0.5 text-[16px] font-black text-white sm:text-lg"
            >
              Search
            </h2>
          </div>

          {/* ICON */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
            <Search size={16} aria-hidden="true" />
          </div>

          {/* DESKTOP CLOSE */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 sm:flex"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>

        {/* =====================================
            SCROLLABLE CONTENT
        ====================================== */}

        <div className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">

          <div className="min-w-0 px-3 pb-8 pt-4 min-[375px]:px-4 sm:px-5 sm:py-5">

            <p className="mb-4 text-[11px] leading-5 text-white/50">
              Find investments, deposits, withdrawals,
              transactions, plans and support records.
            </p>

            {/* INPUT */}
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={handleClear}
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
            <div
              aria-live="polite"
              className="mt-5 min-w-0"
            >

              {/* LOADING */}
              {loading && (
                <div
                  role="status"
                  className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1426] px-4 py-8 text-center"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                    <Loader2
                      size={19}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-3 text-xs font-bold text-white/80">
                    Searching...
                  </p>

                  <p className="mt-1 text-[10px] text-white/40">
                    Looking through your account
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
                    className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#E60033] px-5 text-[11px] font-bold text-white transition hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B]"
                  >
                    <RefreshCw size={14} aria-hidden="true" />
                    Try again
                  </button>
                </div>
              )}

              {/* INITIAL STATE */}
              {!loading && !error && !hasQuery && (
                <SearchEmptyState />
              )}

              {/* RESULTS */}
              {!loading && !error && hasQuery && data && (
                <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0B1426] p-3 sm:p-4">
                  <SearchResults
                    results={results}
                    query={data.query}
                    total={data.total}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="hidden shrink-0 border-t border-white/8 bg-[#07101F] px-5 py-3 text-center sm:block">
          <p className="text-[9px] text-white/35">
            REDIQ Account Search
          </p>
        </footer>
      </div>
    </div>
  );
}