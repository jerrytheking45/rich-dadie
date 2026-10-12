
// src/app/investment/invest/StepReview/page.tsx


"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Info,
  Loader2,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import type {
  BalanceSummary,
  InvestmentPlan,
} from "../../../../lib/types/investment";
import { useSettings } from "../../../../context/useSettings";
import { useTranslation } from "../../../../i18n/translations";
import { investmentApi } from "../../../../lib/api/investmentApi";
import { formatCurrency } from "../../../../lib/utils/currency";

export type FundingSource = "deposit" | "balance";

interface StepReviewProps {
  plan: InvestmentPlan;
  amount: number;
  expectedReturn: number;
  totalProjected: number;
  fundingSource: FundingSource;
  setFundingSource: (source: FundingSource) => void;
  onConfirm: (source: FundingSource) => void;
  onBack: () => void;
  creating?: boolean;
  paymentReady?: boolean;
}

export default function StepReview({
  plan,
  amount,
  expectedReturn,
  totalProjected,
  fundingSource,
  setFundingSource,
  onConfirm,
  onBack,
  creating = false,
  paymentReady = true,
}: StepReviewProps) {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const [balanceSummary, setBalanceSummary] =
    useState<BalanceSummary | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBalance() {
      try {
        const summary =
          await investmentApi.getBalanceSummary();

        if (cancelled) return;

        setBalanceSummary(summary);
        setBalanceError("");
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load balance:", err);
        setBalanceError("Unable to retrieve your available balance.");
      } finally {
        if (!cancelled) setLoadingBalance(false);
      }
    }

    void loadBalance();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableBalance = balanceSummary?.activeBalance ?? 0;

  const sufficientBalance =
    !loadingBalance &&
    !balanceError &&
    Number.isFinite(availableBalance) &&
    availableBalance >= amount;

  const balanceSelected = fundingSource === "balance";

  const canConfirm =
    !creating &&
    paymentReady &&
    (!balanceSelected || sufficientBalance);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#FF476B]">
          Step 02
        </p>
        <h2 className="mt-1 text-lg font-black sm:text-xl">
          {t("review.title")}
        </h2>
        <p className="mt-1 text-xs leading-5 text-white/45">
          Check the figures and select how you want to fund
          this investment.
        </p>
      </div>

      <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
        <h3 className="text-sm font-black">
          Investment summary
        </h3>

        <div className="mt-3">
          <ReviewRow label={t("review.plan")} value={plan.name} />
          <ReviewRow
            label={t("review.amount")}
            value={formatCurrency(amount, currency)}
          />
          <ReviewRow
            label={t("review.expected_return")}
            value={formatCurrency(expectedReturn, currency)}
          />
          <ReviewRow
            label="Expected rate"
            value={`${plan.expectedReturnRate}%`}
          />
          <ReviewRow
            label="Duration"
            value={`${plan.durationDays} days`}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E60033]/20 bg-[#E60033]/5 p-3">
          <span className="text-[11px] font-bold text-white/65">
            {t("review.total_projected")}
          </span>
          <span className="break-all text-base font-black text-white">
            {formatCurrency(totalProjected, currency)}
          </span>
        </div>

        <p className="mt-3 text-[10px] leading-5 text-white/40">
          Expected earnings and projected totals are estimates,
          not confirmed or credited returns.
        </p>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
        <h3 className="text-sm font-black">
          {t("review.funding_source")}
        </h3>
        <p className="mt-1 text-[11px] text-white/45">
          Choose one funding method to continue.
        </p>

        <button
          type="button"
          onClick={() => setFundingSource("deposit")}
          disabled={creating}
          aria-pressed={fundingSource === "deposit"}
          className={`mt-4 flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition disabled:opacity-50 ${
            fundingSource === "deposit"
              ? "border-[#E60033]/60 bg-[#E60033]/10"
              : "border-white/10 bg-[#07101F] hover:border-white/25"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
            <CreditCard size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-white">
              {t("review.deposit")}
            </p>
            <p className="mt-1 text-[10px] leading-4 text-white/45">
              {t("review.deposit_desc")}
            </p>
          </div>

          <SelectionIndicator selected={fundingSource === "deposit"} />
        </button>

        <button
          type="button"
          onClick={() => {
            if (sufficientBalance) setFundingSource("balance");
          }}
          disabled={creating || !sufficientBalance}
          aria-pressed={balanceSelected}
          className={`mt-3 flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${
            balanceSelected
              ? "border-[#E60033]/60 bg-[#E60033]/10"
              : "border-white/10 bg-[#07101F] hover:border-white/25"
          } disabled:cursor-not-allowed disabled:opacity-55`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/65">
            {loadingBalance ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Wallet size={19} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-white">
              {t("review.account_balance")}
            </p>

            {loadingBalance ? (
              <p className="mt-1 text-[10px] text-white/45">
                Checking available balance...
              </p>
            ) : balanceError ? (
              <p className="mt-1 text-[10px] text-[#FF8BA3]">
                {balanceError}
              </p>
            ) : (
              <>
                <p className="mt-1 text-[10px] text-white/55">
                  Available:{" "}
                  <span className="font-bold text-white">
                    {formatCurrency(availableBalance, currency)}
                  </span>
                </p>

                {!sufficientBalance && (
                  <p className="mt-1 text-[10px] text-[#FF8BA3]">
                    {t("review.insufficient_balance")}
                  </p>
                )}
              </>
            )}
          </div>

          <SelectionIndicator selected={balanceSelected} />
        </button>
      </section>

      <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
        <Info
          size={16}
          className="mt-0.5 shrink-0 text-amber-300"
        />
        <p className="text-[10px] leading-5 text-white/60">
          {t("review.terms_notice")} Investments involve risk,
          including possible loss of capital. Returns are not guaranteed.
        </p>
      </div>

      {!paymentReady && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 p-3 text-[11px] text-[#FF9AAF]"
        >
          <AlertCircle size={15} />
          Payment network details are not ready yet.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={creating}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0B1426] px-3 text-xs font-bold text-white/70 transition hover:bg-white/5 disabled:opacity-40"
        >
          <ArrowLeft size={16} />
          {t("invest.back")}
        </button>

        <button
          type="button"
          onClick={() => onConfirm(fundingSource)}
          disabled={!canConfirm}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-3 text-xs font-extrabold text-white transition hover:bg-[#FF174B] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
        >
          {creating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {t("invest.confirm")}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SelectionIndicator({ selected }: { selected: boolean }) {
  return (
    <div
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
        selected
          ? "border-[#E60033] bg-[#E60033] text-white"
          : "border-white/25 bg-transparent"
      }`}
    >
      {selected && <Check size={12} strokeWidth={3} />}
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 border-b border-white/5 py-3 last:border-b-0">
      <span className="text-[11px] text-white/45">{label}</span>
      <span className="min-w-0 wrap-break-words text-right text-[11px] font-extrabold text-white/85">
        {value}
      </span>
    </div>
  );
}