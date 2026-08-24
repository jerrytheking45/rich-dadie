// src/features/investment/pages/invest/StepPayment.tsx

import {
  ArrowLeft,
  ArrowRight,
  Bitcoin,
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";

import { useTranslation } from "../../i18n/translations";
import type { PaymentMethod } from "./InvestFlow";

interface StepPaymentProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (
    method: PaymentMethod,
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPayment = ({
  paymentMethod,
  setPaymentMethod,
  onNext,
  onBack,
}: StepPaymentProps) => {
  const { t } = useTranslation();

  const methods: Array<{
    id: PaymentMethod;
    label: string;
    icon: typeof Smartphone;
  }> = [
    {
      id: "mobile_money",
      label: t("payment.mobile_money"),
      icon: Smartphone,
    },
    {
      id: "bank",
      label: t("payment.bank_transfer"),
      icon: Landmark,
    },
    {
      id: "balance",
      label: t("payment.account_balance"),
      icon: CreditCard,
    },
    {
      id: "crypto",
      label: t("payment.cryptocurrency"),
      icon: Bitcoin,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-base font-extrabold text-slate-900">
        {t("payment.choose_method")}
      </h2>

      <div
        className="space-y-3"
        role="radiogroup"
        aria-label={t(
          "payment.choose_method",
        )}
      >
        {methods.map((method) => {
          const Icon = method.icon;
          const selected =
            paymentMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() =>
                setPaymentMethod(method.id)
              }
              className={`
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                p-4
                text-left
                transition
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500/30
                ${
                  selected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-emerald-200"
                }
              `}
            >
              <div
                className={`
                  rounded-full
                  p-2
                  ${
                    selected
                      ? "bg-emerald-200"
                      : "bg-slate-100"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={
                    selected
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }
                />
              </div>

              <span className="flex-1 text-sm font-medium text-slate-900">
                {method.label}
              </span>

              {selected && (
                <div
                  className="h-3 w-3 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
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
          onClick={onNext}
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
          {t("invest.continue")}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default StepPayment;