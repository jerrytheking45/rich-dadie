// src/features/investment/pages/invest/InvestFlow.tsx
// src/features/investment/pages/invest/InvestFlow.tsx

import { useMemo, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import InvestmentBottomNav from "../../components/InvestmentBottomNav";
import { investmentPlans } from "../../data/investment-demo";
import { useTranslation } from "../../i18n/translations";

import StepAmount from "./StepAmount";
import StepPayment from "./StepPayment";
import StepReview from "./StepReview";
import StepSuccess from "./StepSuccess";

type Step = "amount" | "payment" | "review" | "success";

export type PaymentMethod =
  | "mobile_money"
  | "bank"
  | "balance"
  | "crypto";

const InvestFlow = () => {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();

  const { t } = useTranslation();

  /*
   * Find the selected investment plan.
   *
   * useMemo prevents unnecessary searches whenever the component
   * re-renders without a planId change.
   */
  const plan = useMemo(
    () => investmentPlans.find((item) => item.id === planId),
    [planId],
  );

  /*
   * All hooks execute before the conditional redirect.
   */
  const [amount, setAmount] = useState<number>(
    () => plan?.minimumAmount ?? 0,
  );

  const [currentStep, setCurrentStep] =
    useState<Step>("amount");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("balance");

  const [investmentId, setInvestmentId] =
    useState<string>("");

  /*
   * If the requested plan does not exist, return the user
   * to the investment home page.
   */
  if (!plan) {
    return (
      <Navigate
        to="/investment"
        replace
      />
    );
  }

  /*
   * Derived investment calculations.
   */
  const expectedReturn = Math.round(
    amount * (plan.expectedReturnRate / 100),
  );

  const totalProjected = amount + expectedReturn;

  /*
   * Navigate backwards through the investment flow.
   */
  const handleBack = () => {
    switch (currentStep) {
      case "amount":
        navigate("/investment");
        break;

      case "payment":
        setCurrentStep("amount");
        break;

      case "review":
        setCurrentStep("payment");
        break;

      case "success":
        navigate("/investment/investments");
        break;
    }
  };

  /*
   * Advance through the investment flow.
   *
   * NOTE:
   * The investment ID below is currently demo-only.
   * Production should receive this ID from the backend
   * after successful transaction confirmation.
   */
  const handleNext = () => {
    switch (currentStep) {
      case "amount":
        setCurrentStep("payment");
        break;

      case "payment":
        setCurrentStep("review");
        break;

      case "review": {
        const newId = `GH-INV-${String(
          Math.floor(Math.random() * 1_000_000),
        ).padStart(6, "0")}`;

        setInvestmentId(newId);
        setCurrentStep("success");
        break;
      }

      case "success":
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full
              bg-white
              shadow-sm
              transition
              hover:bg-slate-50
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/30
            "
            aria-label={t("invest.back")}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-medium text-slate-400">
              {t("invest.invest_in")}
            </p>

            <h1 className="truncate text-lg font-extrabold text-slate-900">
              {plan.name}
            </h1>
          </div>
        </header>

        {/* Step content */}
        <div className="mt-6">
          {currentStep === "amount" && (
            <StepAmount
              plan={plan}
              amount={amount}
              setAmount={setAmount}
              expectedReturn={expectedReturn}
              onNext={handleNext}
            />
          )}

          {currentStep === "payment" && (
            <StepPayment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onNext={handleNext}
              onBack={() => setCurrentStep("amount")}
            />
          )}

          {currentStep === "review" && (
            <StepReview
              plan={plan}
              amount={amount}
              paymentMethod={paymentMethod}
              expectedReturn={expectedReturn}
              totalProjected={totalProjected}
              onConfirm={handleNext}
              onBack={() => setCurrentStep("payment")}
            />
          )}

          {currentStep === "success" && (
            <StepSuccess
              planName={plan.name}
              amount={amount}
              investmentId={investmentId}
              onViewInvestment={() =>
                navigate(
                  `/investment/investments/${investmentId}`,
                )
              }
            />
          )}
        </div>
      </main>

      <InvestmentBottomNav />
    </div>
  );
};

export default InvestFlow;