// src/features/investment/pages/invest/StepAmount.tsx

import {
  ArrowRight,
  Info,
} from "lucide-react";

import type { InvestmentPlan } from "../../types/investment";
import { useSettings } from "../../context/useSettings";
import { useTranslation } from "../../i18n/translations";
import { formatCurrency } from "../../utils/currency";

interface StepAmountProps {
  plan: InvestmentPlan;
  amount: number;
  setAmount: (value: number) => void;
  expectedReturn: number;
  onNext: () => void;
}

const StepAmount = ({
  plan,
  amount,
  setAmount,
  expectedReturn,
  onNext,
}: StepAmountProps) => {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const min = plan.minimumAmount;
  const max = plan.maximumAmount ?? Infinity;

  const isInvalid =
    !Number.isFinite(amount) ||
    amount < min ||
    amount > max;

  const formattedMin = formatCurrency(
    min,
    currency,
  );

  const formattedMax = Number.isFinite(max)
    ? formatCurrency(max, currency)
    : null;

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    if (value === "") {
      setAmount(0);
      return;
    }

    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
      setAmount(numericValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Investment amount */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t("invest.amount_label")}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span className="shrink-0 text-lg font-bold text-slate-500">
            {currency}
          </span>

          <input
            type="number"
            inputMode="decimal"
            value={amount === 0 ? "" : amount}
            onChange={handleAmountChange}
            min={min}
            max={
              Number.isFinite(max)
                ? max
                : undefined
            }
            aria-label={t("invest.amount_label")}
            aria-invalid={isInvalid}
            className="
              w-full
              min-w-0
              bg-transparent
              text-2xl
              font-extrabold
              text-slate-900
              outline-none
              placeholder:text-slate-300
            "
          />
        </div>

        {/* Min / Max */}
        <div className="mt-2 flex justify-between gap-3 text-xs text-slate-400">
          <span>
            {t("invest.min")}: {formattedMin}
          </span>

          {formattedMax && (
            <span>
              {t("invest.max")}: {formattedMax}
            </span>
          )}
        </div>

        {/* Validation */}
        {isInvalid && (
          <p
            role="alert"
            className="mt-2 text-xs font-medium text-red-500"
          >
            {formattedMax
              ? `${t("invest.min")}: ${formattedMin} — ${t(
                  "invest.max",
                )}: ${formattedMax}`
              : `${t("invest.min")}: ${formattedMin}`}
          </p>
        )}
      </section>

      {/* Expected return */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-center gap-2">
          <Info
            size={16}
            className="text-emerald-600"
          />

          <p className="text-xs font-medium text-emerald-700">
            {t("invest.expected_return")}
          </p>
        </div>

        <p className="mt-1 text-lg font-bold text-emerald-800">
          {formatCurrency(
            expectedReturn,
            currency,
          )}
        </p>

        <p className="text-xs text-emerald-600">
          {t("invest.based_on_rate")}
        </p>

        <p className="mt-1 text-xs font-semibold text-emerald-700">
          {plan.expectedReturnRate}%
        </p>
      </section>

      {/* Continue */}
      <button
        type="button"
        onClick={onNext}
        disabled={isInvalid}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-emerald-600
          py-4
          text-sm
          font-bold
          text-white
          shadow-lg
          shadow-emerald-200
          transition
          hover:bg-emerald-700
          focus:outline-none
          focus:ring-2
          focus:ring-emerald-500/40
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {t("invest.continue")}
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default StepAmount;