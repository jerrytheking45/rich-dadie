
'use client';

import {
  ArrowUpRight,
  CircleDollarSign,
  FileText,
  Headphones,
  Landmark,
  Receipt,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import type {
  SearchResult,
} from '@/src/lib/types/search';

interface SearchResultItemProps {
  result: SearchResult;
}

const icons = {
  investment: Landmark,
  deposit: CircleDollarSign,
  withdrawal: Wallet,
  plan: FileText,
  transaction: Receipt,
  support: Headphones,
};

const labels = {
  investment: 'Investment',
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  plan: 'Investment plan',
  transaction: 'Transaction',
  support: 'Support',
};

const iconStyles = {
  investment:
    'bg-emerald-400/10 text-emerald-400 border-emerald-400/10',
  deposit:
    'bg-blue-400/10 text-blue-400 border-blue-400/10',
  withdrawal:
    'bg-purple-400/10 text-purple-300 border-purple-400/10',
  plan:
    'bg-indigo-400/10 text-indigo-300 border-indigo-400/10',
  transaction:
    'bg-amber-400/10 text-amber-400 border-amber-400/10',
  support:
    'bg-cyan-400/10 text-cyan-300 border-cyan-400/10',
};

export default function SearchResultItem({
  result,
}: SearchResultItemProps) {
  const router = useRouter();

  const Icon = icons[result.type];

  const handleClick = () => {
    if (!result.route) {
      return;
    }

    router.push(result.route);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!result.route}
      className="
        group
        flex
        w-full
        min-w-0
        items-center
        gap-3
        rounded-[20px]
        border
        border-white/8
        bg-[#07101F]
        p-3
        text-left
        shadow-lg
        shadow-black/5
        transition
        hover:border-white/12
        hover:bg-[#0A1628]
        hover:shadow-xl
        active:scale-[0.995]
        disabled:cursor-default
        sm:gap-4
        sm:p-4
      "
    >
      {/* ICON */}
      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          sm:h-11
          sm:w-11
          ${iconStyles[result.type]}
        `}
      >
        <Icon size={18} />
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="
              min-w-0
              flex-1
              truncate
              text-[13px]
              font-bold
              text-white/80
              transition
              group-hover:text-white
              sm:text-sm
            "
          >
            {result.title}
          </span>

          {result.status && (
            <span
              className="
                hidden
                shrink-0
                rounded-full
                border
                border-white/8
                bg-white/4
                px-2
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-wide
                text-white/30
                sm:inline-flex
              "
            >
              {result.status}
            </span>
          )}
        </div>

        <div className="mt-1 flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-[10px] font-semibold text-emerald-400/70 sm:text-[11px]">
            {labels[result.type]}
          </span>

          {result.subtitle && (
            <>
              <span className="shrink-0 text-white/15">
                •
              </span>

              <span
                className="
                  min-w-0
                  truncate
                  text-[10px]
                  text-white/30
                  sm:text-[11px]
                "
              >
                {result.subtitle}
              </span>
            </>
          )}
        </div>

        {/* MOBILE STATUS */}
        {result.status && (
          <span className="mt-1.5 inline-block rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white/30 sm:hidden">
            {result.status}
          </span>
        )}
      </div>

      {/* ARROW */}
      {result.route && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/4 text-white/20 transition group-hover:bg-emerald-400/10 group-hover:text-emerald-400">
          <ArrowUpRight size={16} />
        </div>
      )}
    </button>
  );
}