// src/features/investment/pages/invest/StepReview.tsx

import {
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import type { InvestmentPlan } from "../../types/investment";
import { useSettings } from "../../context/useSettings";
import { useTranslation } from "../../i18n/translations";
import { formatCurrency } from "../../utils/currency";

import type { PaymentMethod } from "./InvestFlow";

interface StepReviewProps {
  plan: InvestmentPlan;
  amount: number;
  paymentMethod: PaymentMethod;
  expectedReturn: number;
  totalProjected: number;
  onConfirm: () => void;
  onBack: () => void;
}

const StepReview = ({
  plan,
  amount,
  paymentMethod,
  expectedReturn,
  totalProjected,
  onConfirm,
  onBack,
}: StepReviewProps) => {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const paymentLabels: Record<
    PaymentMethod,
    string
  > = {
    mobile_money: t(
      "payment.mobile_money",
    ),
    bank: t("payment.bank_transfer"),
    balance: t(
      "payment.account_balance",
    ),
    crypto: t(
      "payment.cryptocurrency",
    ),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base font-extrabold text-slate-900">
        {t("review.title")}
      </h2>

      {/* Investment summary */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <ReviewRow
          label={t("review.plan")}
          value={plan.name}
        />

        <ReviewRow
          label={t("review.amount")}
          value={formatCurrency(
            amount,
            currency,
          )}
        />

        <ReviewRow
          label={t("review.payment_method")}
          value={paymentLabels[paymentMethod]}
        />

        <ReviewRow
          label={t("review.expected_return")}
          value={`+${formatCurrency(
            expectedReturn,
            currency,
          )}`}
          valueClassName="text-emerald-600"
        />

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="font-bold text-slate-700">
            {t("review.total_projected")}
          </span>

          <span className="font-bold text-emerald-700">
            {formatCurrency(
              totalProjected,
              currency,
            )}
          </span>
        </div>
      </section>

      {/* Terms */}
      <div className="flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs text-amber-700">
        <CheckCircle
          size={16}
          className="mt-0.5 shrink-0"
        />

        <p>
          {t("review.terms_notice")}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="
            flex
            flex-1
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-slate-200
            bg-white
            py-4
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-slate-50
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500/30
          "
        >
          <ArrowLeft size={18} />
          {t("invest.back")}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="
            flex
            flex-1
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
          "
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
  valueClassName = "text-slate-900",
}: ReviewRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={`text-right font-semibold ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

export default StepReview;