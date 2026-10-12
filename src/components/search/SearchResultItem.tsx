
"use client";

import {
  ArrowUpRight,
  CircleDollarSign,
  FileText,
  Headphones,
  Landmark,
  Receipt,
  Wallet,
} from "lucide-react";

import { useRouter } from "next/navigation";

import type { SearchResult } from "@/src/lib/types/search";

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
  investment: "Investment",
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  plan: "Investment plan",
  transaction: "Transaction",
  support: "Support",
};

export default function SearchResultItem({
  result,
}: SearchResultItemProps) {
  const router = useRouter();

  const Icon = icons[result.type];

  const handleClick = () => {
    if (!result.route) return;

    router.push(result.route);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!result.route}
      className="group flex w-full min-w-0 items-center gap-2.5 rounded-xl border border-white/8 bg-[#07101F] p-2.5 text-left transition duration-200 hover:border-[#E60033]/25 hover:bg-[#101D30] active:scale-[0.995] disabled:cursor-default disabled:opacity-70 sm:gap-3 sm:p-3.5"
    >

      {/* ICON */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B] sm:h-10 sm:w-10">
        <Icon size={17} aria-hidden="true" />
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">

        <div className="flex min-w-0 items-center gap-2">

          <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-white/85 transition group-hover:text-white sm:text-[13px]">
            {result.title}
          </span>

          {result.status && (
            <span className="hidden max-w-28 shrink-0 truncate rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white/55 sm:inline-flex">
              {result.status}
            </span>
          )}
        </div>

        {/* CATEGORY + SUBTITLE */}
        <div className="mt-1 flex min-w-0 items-center gap-1.5">

          <span className="shrink-0 text-[9px] font-bold text-[#FF476B] sm:text-[10px]">
            {labels[result.type]}
          </span>

          {result.subtitle && (
            <>
              <span
                aria-hidden="true"
                className="shrink-0 text-white/25"
              >
                •
              </span>

              <span className="min-w-0 truncate text-[9px] text-white/45 sm:text-[10px]">
                {result.subtitle}
              </span>
            </>
          )}
        </div>

        {/* MOBILE STATUS */}
        {result.status && (
          <span className="mt-1.5 inline-flex max-w-full truncate rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white/50 sm:hidden">
            {result.status}
          </span>
        )}
      </div>

      {/* NAVIGATION ARROW */}
      {result.route && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/5 text-white/35 transition group-hover:border-[#E60033]/20 group-hover:bg-[#E60033]/10 group-hover:text-[#FF476B]">
          <ArrowUpRight size={15} aria-hidden="true" />
        </div>
      )}
    </button>
  );
}