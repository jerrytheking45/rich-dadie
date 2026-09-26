
"use client";

// src/app/investment/invest/StepAmount/page.tsx

"use client";

import {
  ArrowRight,
  Info,
  PencilLine,
  TrendingUp,
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

const StepAmount = ({
  plan,
  amount,
  setAmount,
  onNext,
}: StepAmountProps) => {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const min = plan.minimumAmount;
  const max = Infinity;

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
    event: ChangeEvent<HTMLInputElement>,
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

  const dailyRate =
    plan.expectedReturnRate / 100;

  const dailyEarnings =
    amount * dailyRate;

  const totalExpectedEarnings =
    dailyEarnings * plan.durationDays;

  const totalProjectedValue =
    amount + totalExpectedEarnings;

  const totalProfits =
    totalExpectedEarnings;

  return (
    <div className="space-y-5">
      {/* Amount */}
      <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0B1426] p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#F7C948]/5 blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              {t("invest.amount_label")}
            </p>

            <span className="rounded-full border border-emerald-400/10 bg-emerald-400/8 px-2.5 py-1 text-[9px] font-bold text-emerald-300">
              Flexible amount
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-[#07101F] px-4 py-4 transition focus-within:border-emerald-400/40">
            <span className="shrink-0 text-sm font-black text-[#F7C948]">
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
              aria-label={t(
                "invest.amount_label",
              )}
              aria-invalid={isInvalid}
              className="w-full min-w-0 bg-transparent text-3xl font-black tracking-tight text-white outline-none placeholder:text-white/15"
              placeholder="0.00"
            />
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-sky-400/10 bg-sky-400/5 p-3">
            <PencilLine
              size={14}
              className="mt-0.5 shrink-0 text-sky-300"
            />

            <p className="text-[11px] leading-5 text-sky-200/70">
              You can adjust the investment
              amount. Enter any amount above
              the minimum (
              <span className="font-bold text-sky-200">
                {formattedMin}
              </span>
              ) to see updated earnings.
            </p>
          </div>

          <div className="mt-3 flex justify-between gap-3 text-[10px] font-medium text-white/30">
            <span>
              {t("invest.min")}:{" "}
              <span className="text-white/55">
                {formattedMin}
              </span>
            </span>

            {formattedMax && (
              <span>
                {t("invest.max")}:{" "}
                <span className="text-white/55">
                  {formattedMax}
                </span>
              </span>
            )}
          </div>

          {isInvalid && (
            <p
              role="alert"
              className="mt-2 text-xs font-medium text-red-300"
            >
              {formattedMax
                ? `${t("invest.min")}: ${formattedMin} — ${t(
                    "invest.max",
                  )}: ${formattedMax}`
                : `${t("invest.min")}: ${formattedMin}`}
            </p>
          )}
        </div>
      </section>

      {/* Expected earnings */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-linear-to-br from-emerald-400/10 via-[#0B1426] to-[#0B1426] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10">
              <Info
                size={15}
                className="text-emerald-300"
              />
            </div>

            <p className="text-xs font-bold text-emerald-200">
              {t("invest.expected_return")}
            </p>
          </div>

          <p className="mt-4 text-3xl font-black tracking-tight text-white">
            {formatCurrency(
              totalExpectedEarnings,
              currency,
            )}
          </p>

          <p className="mt-1 text-[11px] text-white/35">
            {t("invest.based_on_rate")}
          </p>

          <div className="mt-3 inline-flex rounded-full border border-emerald-400/15 bg-emerald-400/8 px-3 py-1.5">
            <span className="text-[11px] font-black text-emerald-300">
              {plan.expectedReturnRate}% / day
            </span>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="rounded-3xl border border-white/8 bg-[#0B1426] p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.75)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10">
            <TrendingUp
              size={15}
              className="text-violet-300"
            />
          </div>

          <h3 className="text-sm font-black text-white">
            Investment Details
          </h3>
        </div>

        <div className="mt-5 space-y-1">
          <DetailRow
            label="Investment amount"
            value={formatCurrency(
              amount,
              currency,
            )}
          />

          <DetailRow
            label="Daily return rate"
            value={`${plan.expectedReturnRate}%`}
            valueClassName="text-emerald-300"
          />

          <DetailRow
            label="Duration"
            value={`${plan.durationDays} days`}
          />

          <DetailRow
            label="Daily earnings"
            value={formatCurrency(
              dailyEarnings,
              currency,
            )}
            valueClassName="font-bold text-emerald-300"
          />

          <DetailRow
            label="Total expected earnings"
            value={formatCurrency(
              totalExpectedEarnings,
              currency,
            )}
            valueClassName="font-black text-emerald-300"
          />

          <DetailRow
            label="Total profits"
            value={formatCurrency(
              totalProfits,
              currency,
            )}
            valueClassName="font-black text-emerald-300"
          />

          <DetailRow
            label="Projected total value"
            value={formatCurrency(
              totalProjectedValue,
              currency,
            )}
            valueClassName="font-black text-[#F7C948]"
          />
        </div>
      </section>

      {/* Continue */}
      <button
        type="button"
        onClick={onNext}
        disabled={isInvalid}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-400 py-4 text-sm font-black text-[#03130C] shadow-[0_15px_35px_-15px_rgba(52,211,153,0.7)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("invest.continue")}

        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
};

function DetailRow({
  label,
  value,
  valueClassName = "text-white/75",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="text-xs text-white/35">
        {label}
      </span>

      <span
        className={`text-right text-xs font-semibold ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

export default StepAmount;
