
import {
  ArrowDownToLine,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function SearchEmptyState() {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-dashed border-white/10 bg-[#0B1426] px-4 py-9 text-center sm:px-6 sm:py-12">

      {/* BACKGROUND ACCENT */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E60033]/5 blur-[50px]"
      />

      <div className="relative">

        {/* ICON */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B] sm:h-14 sm:w-14">
          <Search size={22} aria-hidden="true" />
        </div>

        {/* TITLE */}
        <h2 className="mt-4 text-[13px] font-black text-white sm:text-base">
          Search your account
        </h2>

        {/* DESCRIPTION */}
        <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/50 sm:text-xs sm:leading-6">
          Find your investments, deposits, withdrawals,
          plans, transactions and support records
          in one convenient place.
        </p>

        {/* CATEGORY EXAMPLES */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">

          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-3 py-1.5 text-[10px] font-semibold text-[#FF7895]">
            <TrendingUp size={12} aria-hidden="true" />
            Investments
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/60">
            <ArrowDownToLine size={12} aria-hidden="true" />
            Deposits
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/60">
            <Wallet size={12} aria-hidden="true" />
            Withdrawals
          </div>
        </div>
      </div>
    </div>
  );
}