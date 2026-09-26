
import {
  ArrowDownToLine,
  Search,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export default function SearchEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-dashed border-white/10 bg-[#07101F] px-5 py-12 text-center sm:py-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/10 bg-purple-400/10 text-purple-300 shadow-lg shadow-purple-500/5">
          <Search size={23} />
        </div>

        <h2 className="mt-4 text-sm font-extrabold text-white sm:text-base">
          Search your account
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/35 sm:text-xs">
          Find investments, deposits, withdrawals,
          plans, transactions and support records.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-[10px] font-semibold text-emerald-400/70">
            <TrendingUp size={12} />
            Investments
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-blue-400/10 bg-blue-400/5 px-3 py-1.5 text-[10px] font-semibold text-blue-400/70">
            <ArrowDownToLine size={12} />
            Deposits
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-purple-400/10 bg-purple-400/5 px-3 py-1.5 text-[10px] font-semibold text-purple-300/70">
            <Wallet size={12} />
            Withdrawals
          </div>
        </div>
      </div>
    </div>
  );
}
