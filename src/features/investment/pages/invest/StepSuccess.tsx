// src/features/investment/pages/invest/StepSuccess.tsx

import {
  CheckCircle2,
  Eye,
} from "lucide-react";

import { useSettings } from "../../context/useSettings";
import { useTranslation } from "../../i18n/translations";
import { formatCurrency } from "../../utils/currency";

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
      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-emerald-100
        "
      >
        <CheckCircle2
          size={40}
          className="text-emerald-600"
        />
      </div>

      {/* Message */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          {t("success.title")}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {t("success.subtitle")}
        </p>
      </div>

      {/* Investment summary */}
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">
            {t("success.investment_id")}
          </span>

          <span className="font-mono font-bold text-slate-900">
            {investmentId}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">
            {t("success.plan")}
          </span>

          <span className="text-right font-semibold text-slate-900">
            {planName}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">
            {t("success.amount")}
          </span>

          <span className="font-semibold text-slate-900">
            {formatCurrency(
              amount,
              currency,
            )}
          </span>
        </div>
      </section>

      {/* View investment */}
      <button
        type="button"
        onClick={onViewInvestment}
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
        "
      >
        <Eye size={18} />
        {t("success.view_investment")}
      </button>
    </div>
  );
};

export default StepSuccess;