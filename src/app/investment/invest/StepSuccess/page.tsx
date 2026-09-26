
// src/app/investment/pages/invest/StepSuccess/page.tsx

"use client";

import {
  CheckCircle2,
  Eye,
} from "lucide-react";

import { useSettings } from "../../../../context/useSettings";
import { useTranslation } from "../../../../i18n/translations";
import { formatCurrency } from "../../../../lib/utils/currency";

interface StepSuccessProps {
  planName: string;
  amount: number;
  investmentId: string;
  onViewInvestment: () => void;
}

const StepSuccess = ({
  planName,
  amount,
  investmentId,
  onViewInvestment,
}: StepSuccessProps) => {
  const { currency } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      {/* Success icon */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-4.5 rounded-full bg-emerald-400/10 blur-2xl"
        />

        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
            <CheckCircle2
              size={38}
              className="text-emerald-300"
              strokeWidth={2.2}
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <div className="mb-2 inline-flex rounded-full border border-emerald-400/15 bg-emerald-400/8 px-3 py-1">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-300">
            Investment created
          </span>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white">
          {t("success.title")}
        </h2>

        <p className="mt-2 text-sm leading-5 text-white/35">
          {t("success.subtitle")}
        </p>
      </div>

      {/* Summary */}
      <section className="w-full rounded-3xl border border-white/8 bg-[#0B1426] p-5 text-left shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
        <SuccessRow
          label={t(
            "success.investment_id",
          )}
          value={investmentId}
          mono
        />

        <SuccessRow
          label={t("success.plan")}
          value={planName}
        />

        <SuccessRow
          label={t("success.amount")}
          value={formatCurrency(
            amount,
            currency,
          )}
          valueClassName="text-emerald-300"
        />
      </section>

      {/* CTA */}
      <button
        type="button"
        onClick={onViewInvestment}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-400 py-4 text-sm font-black text-[#03130C] shadow-[0_15px_35px_-15px_rgba(52,211,153,0.7)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
      >
        <Eye size={18} />

        {t("success.view_investment")}
      </button>
    </div>
  );
};

function SuccessRow({
  label,
  value,
  valueClassName = "text-white/75",
  mono = false,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="text-xs text-white/35">
        {label}
      </span>

      <span
        className={[
          "max-w-[65%] truncate text-right text-sm font-bold",
          valueClassName,
          mono ? "font-mono text-[11px]" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

export default StepSuccess;
