
'use client';

import {
  Search,
  X,
} from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  autoFocus = false,
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/45"
      />

      <input
        type="search"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Search investments, deposits, withdrawals..."
        autoFocus={autoFocus}
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-white/8
          bg-[#07101F]
          pl-11
          pr-11
          text-sm
          text-white
          shadow-inner
          shadow-black/10
          outline-none
          transition
          placeholder:text-white/20
          hover:border-white/12
          focus:border-emerald-400/25
          focus:bg-[#091525]
          focus:ring-4
          focus:ring-emerald-400/5
          sm:h-13
        "
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="
            absolute
            right-2
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            text-white/25
            transition
            hover:bg-white/8
            hover:text-white/70
            active:scale-95
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}