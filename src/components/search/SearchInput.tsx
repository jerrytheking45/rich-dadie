
"use client";

import { Search, X } from "lucide-react";
import type { RefObject } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  autoFocus = false,
  inputRef,
}: SearchInputProps) {
  return (
    <div className="relative w-full min-w-0">

      {/* SEARCH ICON */}
      <Search
        size={17}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF476B] sm:left-4"
      />

      {/* INPUT */}
      <input
        ref={inputRef}
        type="search"
        name="rediq-search"
        aria-label="Search your REDIQ account"
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search your account..."
        className="h-11 w-full min-w-0 appearance-none rounded-xl border border-white/10 bg-[#07101F] pl-10 pr-11 text-[12px] font-medium text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-[#E60033]/50 focus:bg-[#0B1426] focus:ring-2 focus:ring-[#E60033]/10 sm:h-12 sm:pl-11 sm:text-[13px] [&::-webkit-search-cancel-button]:hidden"
      />

      {/* CLEAR */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/45 transition hover:bg-[#E60033]/10 hover:text-[#FF476B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}