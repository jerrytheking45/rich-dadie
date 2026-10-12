
// src/app/investment/pages/invest/StepSuccess/page.tsx


"use client";

import {
  ArrowRight,
  Check,
  Clock3,
  Eye,
  Info,
} from "lucide-react";

import { useSettings } from "../../../../context/useSettings";
import { useTranslation } from "../../../../i18n/translations";
import { formatCurrency } from "../../../../lib/utils/currency";

interface StepSuccessProps {
  planName: string;
  amount: number;
  investmentId: string;
  onViewInvestment: () => void;
  fundingSource?: "deposit" | "balance";
}

export default function StepSuccess({
  planName,
  amount,
  investmentId,
  onViewInvestment,
  fundingSource = "deposit",
}: StepSuccessProps) {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const isDeposit = fundingSource === "deposit";

  return (
    <div className="space-y-5">
      <section className="rounded-[22px] border border-white/10 bg-[#0B1426] px-4 py-7 text-center sm:px-6 sm:py-9">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#E60033]/25 bg-[#E60033]/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E60033] text-white">
            <Check size={30} strokeWidth={2.5} />
          </div>
        </div>

        <span className="mt-5 inline-flex rounded-lg border border-[#E60033]/25 bg-[#E60033]/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#FF8BA3]">
          {isDeposit
            ? "Transaction submitted"
            : "Investment request processed"}
        </span>

        <h2 className="mt-4 text-xl font-black tracking-tight sm:text-2xl">
          {t("success.title")}
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/50">
          {isDeposit
            ? "Your transaction information has been submitted. Deposit verification may still be pending."
            : "Your investment request has been processed. Check the investment details for its recorded status."}
        </p>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
        <h3 className="text-sm font-black">
          Investment summary
        </h3>

        <div className="mt-3">
          <SuccessRow
            label={t("success.investment_id")}
            value={investmentId || "Pending"}
            mono
          />

          <SuccessRow
            label={t("success.plan")}
            value={planName}
          />

          <SuccessRow
            label={t("success.amount")}
            value={formatCurrency(amount, currency)}
          />

          <SuccessRow
            label="Funding method"
            value={isDeposit ? "TRC20 USDT deposit" : "Account balance"}
          />
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0B1426] p-4">
        {isDeposit ? (
          <Clock3
            size={18}
            className="mt-0.5 shrink-0 text-amber-300"
          />
        ) : (
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-[#FF476B]"
          />
        )}

        <div>
          <p className="text-xs font-black">
            {isDeposit
              ? "Verification may still be pending"
              : "Check your investment status"}
          </p>
          <p className="mt-1 text-[10px] leading-5 text-white/50">
            {isDeposit
              ? "Submitting a transaction hash does not guarantee payment confirmation. Your investment details will reflect the status recorded by the system."
              : "Review the investment record to confirm its current status, applicable terms, and projected figures."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewInvestment}
        disabled={!investmentId}
        className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 text-sm font-extrabold text-white transition hover:bg-[#FF174B] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
      >
        <Eye size={17} />
        {t("success.view_investment")}
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-0.5"
        />
      </button>

      <p className="px-2 text-center text-[10px] leading-5 text-white/35">
        Investment returns are not guaranteed. Keep your payment
        transaction ID for reference.
      </p>
    </div>
  );
}

function SuccessRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 border-b border-white/5 py-3 last:border-b-0">
      <span className="shrink-0 text-[11px] text-white/45">
        {label}
      </span>

      <span
        className={`min-w-0 break-all text-right text-[11px] font-extrabold text-white/85 ${
          mono ? "font-mono text-[10px]" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}