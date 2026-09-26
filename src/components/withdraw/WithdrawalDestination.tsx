
"use client";

import {
  CheckCircle2,
  Copy,
  Network,
  WalletCards,
} from "lucide-react";

interface WithdrawalDestinationProps {
  address: string;
  label?: string | null;
  networkName?: string | null;
  assetSymbol?: string | null;
  copied?: boolean;
  disabled?: boolean;
  onCopy: () => void;
}

function truncateAddress(
  address: string,
): string {
  if (address.length <= 28) {
    return address;
  }

  return `${address.slice(0, 14)}...${address.slice(-10)}`;
}

export default function WithdrawalDestination({
  address,
  label,
  networkName,
  assetSymbol,
  copied = false,
  disabled = false,
  onCopy,
}: WithdrawalDestinationProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
            <WalletCards className="h-5 w-5 text-purple-300" />
          </div>

          <div>
            <p className="text-xs font-bold text-white">
              Withdrawal destination
            </p>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Payments-bound wallet
            </p>
          </div>
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-4 p-4">
        {label && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Wallet
            </p>

            <p className="mt-1 text-xs font-semibold text-white">
              {label}
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Address
            </p>

            <span className="text-[9px] font-semibold text-emerald-400">
              Verified
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="min-w-0 flex-1 rounded-xl border border-white/5 bg-[#07101F] px-3 py-3">
              <p
                className="truncate font-mono text-[11px] text-white"
                title={address}
              >
                <span className="sm:hidden">
                  {truncateAddress(address)}
                </span>

                <span className="hidden break-all sm:inline">
                  {address}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onCopy}
              disabled={disabled}
              aria-label={
                copied
                  ? "Wallet address copied"
                  : "Copy wallet address"
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-[#07101F] text-slate-400 transition hover:border-emerald-400/40 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {(assetSymbol || networkName) && (
          <div className="grid grid-cols-2 gap-3">
            {assetSymbol && (
              <div className="rounded-xl border border-white/5 bg-[#07101F] p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Asset
                </p>

                <p className="mt-1 text-xs font-bold text-white">
                  {assetSymbol}
                </p>
              </div>
            )}

            {networkName && (
              <div className="rounded-xl border border-white/5 bg-[#07101F] p-3">
                <div className="flex items-center gap-2">
                  <Network className="h-3.5 w-3.5 text-purple-300" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Network
                  </p>
                </div>

                <p className="mt-1 text-xs font-bold text-white">
                  {networkName}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-3">
          <p className="text-[10px] leading-5 text-slate-400">
            Withdrawals are sent to this bound wallet.
            Verify the address and network before
            submitting your request.
          </p>
        </div>
      </div>
    </div>
  );
}

