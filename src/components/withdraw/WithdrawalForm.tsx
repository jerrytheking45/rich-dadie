
// src/components/withdraw/WithdrawalForm.tsx

"use client";

import type { FormEvent } from "react";

import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  Copy,
  KeyRound,
} from "lucide-react";

import type { Asset } from "@/src/lib/types/investment";
import type { WithdrawalWalletResponse } from "@/src/lib/api/withdrawal";

import { formatUSDT } from "@/src/lib/utils/currency";
import WithdrawalPinInput from "./WithdrawalPinInput";
import WithdrawalDestination from "./WithdrawalDestination";

interface WithdrawalFormProps {
  asset: Asset | null;
  withdrawalWallet: WithdrawalWalletResponse | null;

  amount: string;
  pin: string;

  balance: number;

  submitting: boolean;
  error: string;
  copied: boolean;

  pinConfigured?: boolean;

  /*
   * Shared Forgot PIN success state from the page.
   */
  forgotPINSuccess?: boolean;

  onSetPIN?: () => void;

  onChangePIN?: () => void;

  onForgotPIN?: () => void;

  onAmountChange: (amount: string) => void;
  onPinChange: (pin: string) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;

  onCopyAddress: () => void;
}

export default function WithdrawalForm({
  asset,
  withdrawalWallet,
  amount,
  pin,
  balance,
  submitting,
  error,
  copied,
  pinConfigured,
  forgotPINSuccess = false,
  onSetPIN,
  onChangePIN,
  onForgotPIN,
  onAmountChange,
  onPinChange,
  onSubmit,
  onCopyAddress,
}: WithdrawalFormProps) {
  const hasActiveWithdrawalWallet =
    withdrawalWallet?.status === "ACTIVE";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
      noValidate
    >
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/10 p-3.5 text-xs text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="leading-5">
            {error}
          </p>
        </div>
      )}

      {/* Withdrawal asset */}
      <div className="space-y-2">
        <label
          htmlFor="withdrawal-asset"
          className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
        >
          Withdrawal asset
        </label>

        <div
          id="withdrawal-asset"
          className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-white/8 bg-[#0B1426] px-4"
        >
          {asset ? (
            <>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">
                  {asset.symbol}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  {asset.name}
                </p>
              </div>

              <span className="shrink-0 rounded-lg border border-emerald-400/15 bg-emerald-400/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-400">
                Bound asset
              </span>
            </>
          ) : (
            <p className="text-xs text-slate-500">
              No withdrawal asset available
            </p>
          )}
        </div>

        <p className="text-[10px] leading-5 text-slate-500">
          Your withdrawal asset is determined by your
          Payments-bound withdrawal wallet.
        </p>
      </div>

      {/* Authoritative destination wallet */}
      <div className="space-y-2">
        <label
          htmlFor="withdrawal-wallet"
          className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
        >
          Withdrawal wallet
        </label>

        {hasActiveWithdrawalWallet &&
          withdrawalWallet && (
            <>
              <WithdrawalDestination
                address={withdrawalWallet.address}
                assetSymbol={asset?.symbol}
                networkName={
                  withdrawalWallet.networkName
                }
                copied={copied}
                disabled={submitting}
                onCopy={onCopyAddress}
              />

              <div
                id="withdrawal-wallet"
                className="rounded-2xl border border-white/8 bg-[#07101F] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Destination address
                    </p>

                    <p
                      className="mt-2 break-all font-mono text-[11px] text-white"
                      title={
                        withdrawalWallet.address
                      }
                    >
                      {withdrawalWallet.address}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onCopyAddress}
                    disabled={submitting}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-[#0B1426] text-slate-400 transition hover:border-emerald-400/40 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Copy withdrawal wallet address"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />

                  <p className="text-[10px] leading-5 text-slate-500">
                    Verified Payments-bound wallet. This is
                    the authoritative destination for your
                    withdrawal.
                  </p>
                </div>
              </div>
            </>
          )}

        {!withdrawalWallet && (
          <div className="rounded-2xl border border-red-400/15 bg-red-400/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <div>
                <p className="text-xs font-bold text-red-200">
                  No withdrawal wallet is bound
                </p>

                <p className="mt-1 text-[10px] leading-5 text-red-100/60">
                  A verified Payments wallet must be bound
                  before you can make a withdrawal.
                </p>
              </div>
            </div>
          </div>
        )}

        {withdrawalWallet &&
          withdrawalWallet.status !==
            "ACTIVE" && (
            <div className="rounded-2xl border border-red-400/15 bg-red-400/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                <div>
                  <p className="text-xs font-bold text-red-200">
                    Withdrawal wallet is inactive
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-red-100/60">
                    Your Payments-bound wallet cannot
                    currently receive withdrawals. Please
                    resolve the wallet status from Payments
                    before trying again.
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Available balance */}
      <div className="rounded-[22px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Available balance
            </p>

            <p className="mt-1 text-xl font-extrabold text-white">
              {formatUSDT(balance)}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
            <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="withdrawal-amount"
            className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
          >
            Amount
          </label>

          <button
            type="button"
            onClick={() =>
              onAmountChange(
                balance > 0
                  ? String(balance)
                  : "",
              )
            }
            disabled={
              submitting ||
              !hasActiveWithdrawalWallet ||
              balance <= 0
            }
            className="text-[10px] font-bold tracking-wide text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            MAX
          </button>
        </div>

        <div className="relative">
          <input
            id="withdrawal-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={amount}
            onChange={(event) =>
              onAmountChange(
                event.target.value,
              )
            }
            disabled={
              submitting ||
              !hasActiveWithdrawalWallet
            }
            placeholder="0.00"
            className="h-16 w-full rounded-2xl border border-white/8 bg-[#0B1426] px-4 pr-20 text-xl font-extrabold text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {asset && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              {asset.symbol}
            </span>
          )}
        </div>
      </div>

      {/* Wallet PIN */}
      <div className="rounded-[22px] border border-white/8 bg-[#0B1426] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
          
          </div>

          {pinConfigured === false &&
            onSetPIN && (
              <button
                type="button"
                onClick={onSetPIN}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Set PIN
              </button>
            )}
        </div>

        <div className="mt-4">
          <WithdrawalPinInput
            value={pin}
            onChange={onPinChange}
            disabled={
              submitting ||
              pinConfigured === false
            }
          />
        </div>

        {pinConfigured === true && (
          <div className="mt-4 rounded-2xl border border-white/5 bg-[#07101F] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-white">
                  PIN security
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Keep your wallet PIN private.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {onForgotPIN && (
                  <button
                    type="button"
                    onClick={() => {
                      void onForgotPIN();
                    }}
                    disabled={
                      submitting ||
                      forgotPINSuccess
                    }
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {forgotPINSuccess ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Reset link sent
                      </>
                    ) : (
                      "Forgot PIN?"
                    )}
                  </button>
                )}

                {onChangePIN && (
                  <button
                    type="button"
                    onClick={onChangePIN}
                    disabled={submitting}
                    className="text-[10px] font-bold text-purple-300 transition hover:text-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Change PIN
                  </button>
                )}
              </div>
            </div>

            {forgotPINSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3 text-[10px] text-emerald-200"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />

                <p className="leading-5">
                  A PIN reset link has been sent
                  to your email.
                </p>
              </div>
            )}
          </div>
        )}

        {pinConfigured === false && (
          <div className="mt-4 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-3">
            <p className="text-[10px] leading-5 text-slate-400">
              You need to set a 6-digit wallet PIN
              before you can make a withdrawal.
            </p>
          </div>
        )}
      </div>

      {/* Security notice */}
      <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

          <div>
            <p className="text-xs font-bold text-white">
              Secure withdrawal
            </p>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              Your withdrawal is sent only to your
              verified Payments-bound wallet. The
              destination cannot be changed from this
              withdrawal page.
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={
          submitting ||
          !hasActiveWithdrawalWallet ||
          !asset ||
          balance <= 0 ||
          pinConfigured === false
        }
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-xs font-extrabold text-[#04100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04100B]/30 border-t-[#04100B]" />
            Processing...
          </>
        ) : (
          <>
            <ArrowDownToLine className="h-4 w-4" />
            Withdraw {asset?.symbol ?? ""}
          </>
        )}
      </button>
    </form>
  );
}