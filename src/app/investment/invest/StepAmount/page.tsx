
"use client";

// src/app/investment/invest/StepAmount/page.tsx


"use client";

import {
  ArrowRight,
  Info,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { ChangeEvent } from "react";

import type { InvestmentPlan } from "../../../../lib/types/investment";
import { useSettings } from "../../../../context/useSettings";
import { useTranslation } from "../../../../i18n/translations";
import { formatCurrency } from "../../../../lib/utils/currency";

interface StepAmountProps {
  plan: InvestmentPlan;
  amount: number;
  setAmount: (value: number) => void;
  expectedReturn: number;
  onNext: () => void;
}

export default function StepAmount({
  plan,
  amount,
  setAmount,
  expectedReturn,
  onNext,
}: StepAmountProps) {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const minimum = plan.minimumAmount;
  const isInvalid =
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount < minimum;

  const projectedValue = amount + expectedReturn;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (!value) {
      setAmount(0);
      return;
    }

    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed >= 0) {
      setAmount(parsed);
    }
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#FF476B]">
              Step 01
            </p>
            <h2 className="mt-1 text-lg font-black sm:text-xl">
              Choose your amount
            </h2>
          </div>

          <span className="rounded-lg border border-[#E60033]/25 bg-[#E60033]/10 px-3 py-1.5 text-[10px] font-bold text-[#FF8BA3]">
            Flexible amount
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-white/45">
          Enter the amount you wish to invest in {plan.name}.
        </p>

        <label
          htmlFor="investment-amount"
          className="mt-6 block text-[10px] font-bold uppercase tracking-wide text-white/50"
        >
          {t("invest.amount_label")}
        </label>

        <div className="mt-2 flex min-h-16 items-center gap-3 rounded-xl border border-white/10 bg-[#07101F] px-4 transition focus-within:border-[#E60033]/60 focus-within:ring-2 focus-within:ring-[#E60033]/10">
          <span className="shrink-0 border-r border-white/10 pr-3 text-sm font-black text-[#FF476B]">
            {currency}
          </span>

          <input
            id="investment-amount"
            type="number"
            inputMode="decimal"
            min={minimum}
            step="any"
            value={amount === 0 ? "" : amount}
            onChange={handleChange}
            placeholder="0.00"
            aria-invalid={isInvalid}
            className="w-full min-w-0 bg-transparent py-3 text-2xl font-black text-white outline-none placeholder:text-white/20 sm:text-3xl"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="text-white/45">
            Minimum investment
          </span>
          <span className="font-extrabold text-white/85">
            {formatCurrency(minimum, currency)}
          </span>
        </div>

        {isInvalid && (
          <p role="alert" className="mt-3 text-[11px] text-[#FF8BA3]">
            Enter at least {formatCurrency(minimum, currency)}.
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#25101E] via-[#111827] to-[#0B1426] p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={17} className="text-[#FF476B]" />
          <h3 className="text-sm font-black">
            Investment projection
          </h3>
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-wide text-white/45">
          Expected earnings
        </p>

        <p className="mt-1 break-all text-2xl font-black tracking-tight text-white sm:text-3xl">
          {formatCurrency(expectedReturn, currency)}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Metric
            label="Expected rate"
            value={`${plan.expectedReturnRate}%`}
          />
          <Metric
            label="Duration"
            value={`${plan.durationDays} days`}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#07101F]/70 p-3">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-[#FF476B]" />
            <span className="text-[11px] text-white/60">
              Projected total value
            </span>
          </div>

          <span className="break-all text-sm font-black text-white">
            {formatCurrency(projectedValue, currency)}
          </span>
        </div>

        <div className="mt-4 flex items-start gap-2">
          <Info
            size={14}
            className="mt-0.5 shrink-0 text-white/40"
          />
          <p className="text-[10px] leading-5 text-white/45">
            These figures are estimates based on the plan rate.
            Returns are not guaranteed, and investment capital is
            subject to risk.
          </p>
        </div>
      </section>

      <button
        type="button"
        onClick={onNext}
        disabled={isInvalid}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 text-sm font-extrabold text-white transition hover:bg-[#FF174B] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
      >
        {t("invest.continue")}
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-[#07101F]/60 p-3">
      <p className="text-[10px] text-white/45">{label}</p>
      <p className="mt-1 wrap-break-words text-sm font-black text-white">
        {value}
      </p>
    </div>
  );
}