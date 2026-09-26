
// src/app/investment/invest/StepReview/page.tsx

"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  Wallet,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  BalanceSummary,
  InvestmentPlan,
} from "../../../../lib/types/investment";

import { useSettings } from "../../../../context/useSettings";
import { useTranslation } from "../../../../i18n/translations";
import { investmentApi } from "../../../../lib/api/investmentApi";
import { formatCurrency } from "../../../../lib/utils/currency";

export type FundingSource =
  | "deposit"
  | "balance";

interface StepReviewProps {
  plan: InvestmentPlan;
  amount: number;
  expectedReturn: number;
  totalProjected: number;
  fundingSource: FundingSource;
  setFundingSource: (
    source: FundingSource,
  ) => void;
  onConfirm: (
    source: FundingSource,
  ) => void;
  onBack: () => void;
}

const StepReview = ({
  plan,
  amount,
  expectedReturn,
  totalProjected,
  fundingSource,
  setFundingSource,
  onConfirm,
  onBack,
}: StepReviewProps) => {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const [balanceSummary, setBalanceSummary] =
    useState<BalanceSummary | null>(null);

  const [loadingBalance, setLoadingBalance] =
    useState(true);

  const [balanceError, setBalanceError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const loadBalanceSummary =
      async () => {
        try {
          const summary =
            await investmentApi.getBalanceSummary();

          if (cancelled) {
            return;
          }

          setBalanceSummary(summary);
          setBalanceError("");
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load investment balance summary:",
            error,
          );

          setBalanceSummary(null);
          setBalanceError(
            "Unable to load your available balance.",
          );
        } finally {
          if (!cancelled) {
            setLoadingBalance(false);
          }
        }
      };

    void loadBalanceSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableBalance =
    balanceSummary?.activeBalance ?? 0;

  const isBalanceSufficient =
    !loadingBalance &&
    !balanceError &&
    availableBalance >= amount;

  const formattedAvailableBalance =
    formatCurrency(
      availableBalance,
      currency,
    );

  const formattedAmount =
    formatCurrency(
      amount,
      currency,
    );

  const formattedExpectedReturn =
    formatCurrency(
      expectedReturn,
      currency,
    );

  const formattedTotalProjected =
    formatCurrency(
      totalProjected,
      currency,
    );

  const handleBalanceFunding = () => {
    if (
      loadingBalance ||
      balanceError ||
      !isBalanceSufficient
    ) {
      return;
    }

    setFundingSource("balance");
  };

  const handleConfirm = () => {
    if (
      fundingSource === "balance" &&
      !isBalanceSufficient
    ) {
      return;
    }

    onConfirm(fundingSource);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
          Investment
        </p>

        <h2 className="mt-1 text-xl font-black tracking-tight text-white">
          {t("review.title")}
        </h2>
      </div>

      {/* Summary */}
      <section className="rounded-3xl border border-white/8 bg-[#0B1426] p-5">
        <ReviewRow
          label={t("review.plan")}
          value={plan.name}
        />

        <ReviewRow
          label={t("review.amount")}
          value={formattedAmount}
        />

        <ReviewRow
          label={t("review.expected_return")}
          value={`+${formattedExpectedReturn}`}
          valueClassName="text-emerald-300"
        />

        <div className="mt-2 flex items-center justify-between gap-4 border-t border-white/8 pt-4">
          <span className="text-sm font-black text-white/65">
            {t("review.total_projected")}
          </span>

          <span className="text-sm font-black text-[#F7C948]">
            {formattedTotalProjected}
          </span>
        </div>
      </section>

      {/* Funding source */}
      <section className="rounded-3xl border border-white/8 bg-[#0B1426] p-5">
        <p className="text-sm font-black text-white">
          {t("review.funding_source")}
        </p>

        {/* Deposit */}
        <button
          type="button"
          onClick={() =>
            setFundingSource("deposit")
          }
          className={[
            "mt-4 flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition",
            fundingSource === "deposit"
              ? "border-emerald-400/40 bg-emerald-400/8"
              : "border-white/8 bg-[#07101F] hover:border-white/15",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              fundingSource === "deposit"
                ? "bg-emerald-400/10"
                : "bg-white/5",
            ].join(" ")}
          >
            <CreditCard
              size={17}
              className={
                fundingSource === "deposit"
                  ? "text-emerald-300"
                  : "text-white/35"
              }
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white/80">
              {t("review.deposit")}
            </p>

            <p className="mt-0.5 text-xs text-white/30">
              {t("review.deposit_desc")}
            </p>
          </div>

          {fundingSource === "deposit" && (
            <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
          )}
        </button>

        {/* Balance */}
        <button
          type="button"
          onClick={handleBalanceFunding}
          disabled={
            loadingBalance ||
            !!balanceError ||
            !isBalanceSufficient
          }
          className={[
            "mt-3 flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition",
            fundingSource === "balance"
              ? "border-emerald-400/40 bg-emerald-400/8"
              : "border-white/8 bg-[#07101F] hover:border-white/15",
            loadingBalance ||
            balanceError ||
            !isBalanceSufficient
              ? "cursor-not-allowed opacity-45"
              : "",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              fundingSource === "balance"
                ? "bg-emerald-400/10"
                : "bg-white/5",
            ].join(" ")}
          >
            {loadingBalance ? (
              <Loader2
                size={17}
                className="animate-spin text-white/35"
              />
            ) : (
              <Wallet
                size={17}
                className={
                  fundingSource === "balance"
                    ? "text-emerald-300"
                    : "text-white/35"
                }
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white/80">
              {t("review.account_balance")}
            </p>

            {loadingBalance && (
              <p className="mt-0.5 text-xs text-white/30">
                Checking your available balance...
              </p>
            )}

            {!loadingBalance &&
              balanceError && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-red-300">
                  <AlertCircle
                    size={13}
                    aria-hidden="true"
                  />

                  <span>
                    {balanceError}
                  </span>
                </div>
              )}

            {!loadingBalance &&
              !balanceError &&
              isBalanceSufficient && (
                <p className="text-xs text-white/30">
                  {t(
                    "review.available_balance",
                  )}
                  :{" "}
                  <span className="font-semibold text-emerald-300">
                    {formattedAvailableBalance}
                  </span>
                </p>
              )}

            {!loadingBalance &&
              !balanceError &&
              !isBalanceSufficient && (
                <p className="text-xs text-red-300">
                  {t(
                    "review.insufficient_balance",
                  )}{" "}
                  Available:{" "}
                  {formattedAvailableBalance}
                </p>
              )}
          </div>

          {fundingSource === "balance" && (
            <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
          )}
        </button>
      </section>

      {/* Backend balance */}
      {!loadingBalance &&
        !balanceError &&
        balanceSummary && (
          <section className="rounded-[22px] border border-emerald-400/10 bg-emerald-400/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                <Wallet
                  size={15}
                  className="text-emerald-300"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black text-emerald-200">
                  Available investment balance
                </p>

                <p className="mt-1 text-lg font-black text-emerald-300">
                  {formattedAvailableBalance}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-white/30">
                  This is your calculated
                  active balance after locked
                  investment funds are accounted
                  for.
                </p>
              </div>
            </div>
          </section>
        )}

      {/* Terms */}
      <div className="flex items-start gap-2.5 rounded-[22px] border border-[#F7C948]/10 bg-[#F7C948]/5 p-4">
        <CheckCircle
          size={16}
          className="mt-0.5 shrink-0 text-[#F7C948]"
        />

        <p className="text-xs leading-5 text-[#F7C948]/70">
          {t("review.terms_notice")}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0B1426] py-4 text-sm font-bold text-white/55 transition hover:bg-[#0D182C] hover:text-white"
        >
          <ArrowLeft size={18} />
          {t("invest.back")}
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={
            fundingSource === "balance" &&
            !isBalanceSufficient
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-400 py-4 text-sm font-black text-[#03130C] shadow-[0_15px_35px_-15px_rgba(52,211,153,0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("invest.confirm")}
        </button>
      </div>
    </div>
  );
};

interface ReviewRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function ReviewRow({
  label,
  value,
  valueClassName = "text-white/75",
}: ReviewRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="text-xs text-white/35">
        {label}
      </span>

      <span
        className={`text-right text-sm font-semibold ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

export default StepReview;
