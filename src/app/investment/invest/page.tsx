
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";

import { investmentApi } from "@/src/lib/api/investmentApi";
import { useTranslation } from "../../../i18n/translations";

import StepAmount from "./StepAmount/page";
import StepReview, {
  type FundingSource,
} from "./StepReview/page";
import StepPaymentDetails from "./StepPaymentDetails/page";
import StepSuccess from "./StepSuccess/page";

import type {
  InvestmentPlan,
  PendingInvestmentDeposit,
} from "@/src/lib/types/investment";

type Step = "amount" | "review" | "payment" | "success";

const STEPS: { key: Step; label: string }[] = [
  { key: "amount", label: "Amount" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
  { key: "success", label: "Complete" },
];

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
      detail?: string;
    };
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;
    const data = apiError.response?.data;

    return (
      data?.error ||
      data?.message ||
      data?.detail ||
      apiError.message ||
      "An unexpected error occurred."
    );
  }

  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

function getDepositError(error: unknown): string {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes("transaction hash already used") ||
    normalized.includes("transaction hash has already been used") ||
    normalized.includes("idx_investment_deposits_network_tx_hash_unique") ||
    normalized.includes("duplicate key value")
  ) {
    return "This transaction hash has already been submitted. Each transaction ID can only be used once.";
  }

  if (
    normalized.includes("invalid transaction hash") ||
    normalized.includes("invalid tx hash") ||
    normalized.includes("invalid transaction id")
  ) {
    return "This transaction ID appears invalid. Check it and try again.";
  }

  if (
    normalized.includes("transaction not found") ||
    normalized.includes("transaction hash not found") ||
    normalized.includes("transaction was not found")
  ) {
    return "This transaction could not be found on TRON. Check the transaction ID and ensure it has been broadcast.";
  }

  if (
    normalized.includes("transaction pending") ||
    normalized.includes("not confirmed")
  ) {
    return "This transaction has not been confirmed on TRON yet. Please wait and try again.";
  }

  return message;
}

export default function InvestFlow() {
  const router = useRouter();
  const params = useParams<{ planId?: string }>();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const planId = params?.planId;
  const recoverDepositId = searchParams.get("recoverDepositId");

  const [plan, setPlan] = useState<InvestmentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [amount, setAmount] = useState(0);
  const [currentStep, setCurrentStep] = useState<Step>("amount");
  const [investmentId, setInvestmentId] = useState("");

  const [recoveryData, setRecoveryData] =
    useState<PendingInvestmentDeposit | null>(null);

  const [recoveryResolved, setRecoveryResolved] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");

  const [creating, setCreating] = useState(false);
  const [depositSubmitting, setDepositSubmitting] = useState(false);
  const [depositError, setDepositError] = useState("");

  const [usdtAssetId, setUsdtAssetId] = useState("");
  const [tronNetworkId, setTronNetworkId] = useState("");
  const [networkError, setNetworkError] = useState("");

  const [fundingSource, setFundingSource] =
    useState<FundingSource>("deposit");

  const [depositAddress, setDepositAddress] = useState("");
  const [paymentToken, setPaymentToken] = useState("");

  const createLockRef = useRef(false);
  const submitLockRef = useRef(false);

  // Redirect outside render.
  useEffect(() => {
    if (!planId) {
      router.replace("/investment");
    }
  }, [planId, router]);

  // Load plan.
  useEffect(() => {
    if (!planId) return;

    let cancelled = false;

    async function loadPlan() {
      try {
        const data = await investmentApi.getPlan(planId!);

        if (cancelled) return;

        setPlan(data);

        if (!recoverDepositId) {
          setAmount(data.minimumAmount);
        }

        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load investment plan:", err);
        setError("Failed to load investment plan details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPlan();

    return () => {
      cancelled = true;
    };
  }, [planId, recoverDepositId]);

  // Load supported payment identifiers.
  useEffect(() => {
    if (!planId) return;

    let cancelled = false;

    async function loadNetwork() {
      try {
        const assets = await investmentApi.getAssets();
        if (cancelled) return;

        const usdt = assets.find(
          (asset) => asset.symbol?.toUpperCase() === "USDT",
        );

        if (!usdt) throw new Error("USDT asset not found.");

        const networks = await investmentApi.getNetworks(usdt.id);
        if (cancelled) return;

        const tron = networks.find(
          (network) => network.network?.toUpperCase() === "TRON",
        );

        if (!tron) throw new Error("TRON network not found.");

        setUsdtAssetId(usdt.id);
        setTronNetworkId(tron.id);
        setNetworkError("");
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load USDT/TRON network:", err);
        setNetworkError("USDT/TRON network is currently unavailable.");
      }
    }

    void loadNetwork();

    return () => {
      cancelled = true;
    };
  }, [planId]);

  // Recovery: first state updates happen after the awaited request.
  useEffect(() => {
    if (!recoverDepositId || !plan) return;

    let cancelled = false;

    async function loadRecovery() {
      try {
        const pending =
          await investmentApi.getPendingInvestmentDeposits();

        if (cancelled) return;

        const match = pending.find(
          (item) => item.deposit?.id === recoverDepositId,
        );

        if (!match) {
          throw new Error(
            "The pending investment deposit could not be found.",
          );
        }

        if (match.investment.planId !== plan!.id) {
          throw new Error(
            "This deposit does not belong to the selected plan.",
          );
        }

        const recoveryAmount = Number(
          match.deposit.expectedAmount,
        );

        if (
          !Number.isFinite(recoveryAmount) ||
          recoveryAmount <= 0
        ) {
          throw new Error("The pending deposit has an invalid amount.");
        }

        const prepared = await investmentApi.prepareDeposit({
          plan_id: match.investment.planId,
          asset_id: match.investment.assetId,
          network_id: match.investment.networkId,
          amount: recoveryAmount,
        });

        if (cancelled) return;

        setRecoveryData(match);
        setInvestmentId(match.investment.id);
        setAmount(recoveryAmount);

        setDepositAddress(
          prepared.deposit_address ||
            match.deposit.companyDepositAddress ||
            match.investment.depositAddress ||
            "",
        );

        setPaymentToken(prepared.payment_token);
        setFundingSource("deposit");
        setCurrentStep("payment");
        setRecoveryError("");
      } catch (err) {
        if (cancelled) return;

        console.error("Investment recovery failed:", err);
        setRecoveryError(getErrorMessage(err));
      } finally {
        if (!cancelled) setRecoveryResolved(true);
      }
    }

    void loadRecovery();

    return () => {
      cancelled = true;
    };
  }, [recoverDepositId, plan]);

  // Keep this aligned with the rate used in Review and Investment Details.
  const expectedReturn = useMemo(() => {
    if (!plan || !Number.isFinite(amount)) return 0;

    return Math.round(
      amount * (plan.expectedReturnRate / 100),
    );
  }, [amount, plan]);

  const totalProjected = amount + expectedReturn;

  const handleBack = () => {
    if (creating || depositSubmitting) return;

    if (currentStep === "payment" && recoveryData) {
      router.push(
        `/investment/profile/deposit/${recoveryData.deposit.id}`,
      );
      return;
    }

    switch (currentStep) {
      case "amount":
        router.push("/investment");
        break;
      case "review":
        setCurrentStep("amount");
        break;
      case "payment":
        setCurrentStep("review");
        break;
      case "success":
        router.push("/investment/investments");
        break;
    }
  };

  const handleAmountNext = () => {
    if (
      !plan ||
      !Number.isFinite(amount) ||
      amount < plan.minimumAmount
    ) {
      setError("Enter a valid amount that meets the plan minimum.");
      return;
    }

    setError("");
    setCurrentStep("review");
  };

  const handleReviewConfirm = async (source: FundingSource) => {
    if (createLockRef.current) return;

    if (!plan) {
      setError("Investment plan is unavailable.");
      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount < plan.minimumAmount
    ) {
      setError("Enter a valid investment amount.");
      return;
    }

    if (!usdtAssetId || !tronNetworkId) {
      setError(networkError || "USDT/TRON network is not ready.");
      return;
    }

    createLockRef.current = true;
    setCreating(true);
    setError("");

    const createData = {
      plan_id: plan.id,
      asset_id: usdtAssetId,
      network_id: tronNetworkId,
      amount,
    };

    try {
      if (source === "deposit") {
        const prepared =
          await investmentApi.prepareDeposit(createData);

        if (!prepared.payment_token || !prepared.deposit_address) {
          throw new Error("Payment instructions are incomplete.");
        }

        setDepositAddress(prepared.deposit_address);
        setPaymentToken(prepared.payment_token);
        setDepositError("");
        setCurrentStep("payment");
        return;
      }

      const result =
        await investmentApi.reinvestFromBalance(createData);

      setInvestmentId(result.id);
      setCurrentStep("success");
    } catch (err) {
      console.error("Failed to create investment:", err);
      setError(`Unable to proceed: ${getErrorMessage(err)}`);
    } finally {
      createLockRef.current = false;
      setCreating(false);
    }
  };

  const handleDepositSubmit = async (
    txHash: string,
    proofUrl?: string,
  ) => {
    if (submitLockRef.current) return;

    if (!plan) {
      setDepositError("Investment plan is unavailable.");
      return;
    }

    const normalizedHash = txHash.trim();

    if (!normalizedHash) {
      setDepositError("Enter your transaction hash.");
      return;
    }

    if (!recoveryData && !paymentToken) {
      setDepositError("Payment session is unavailable.");
      return;
    }

    submitLockRef.current = true;
    setDepositSubmitting(true);
    setDepositError("");

    try {
      if (recoveryData) {
        const result = await investmentApi.submitDeposit(
          recoveryData.investment.id,
          normalizedHash,
          proofUrl,
        );

        router.push(`/investment/profile/deposit/${result.id}`);
        return;
      }

      const result = await investmentApi.confirmDeposit({
        payment_token: paymentToken,
        tx_hash: normalizedHash,
        plan_id: plan.id,
        asset_id: usdtAssetId,
        network_id: tronNetworkId,
        amount,
      });

      setInvestmentId(result.id);
      setCurrentStep("success");
    } catch (err) {
      console.error("Deposit submission failed:", err);

      setDepositError(
        `Deposit submission failed: ${getDepositError(err)}`,
      );
    } finally {
      submitLockRef.current = false;
      setDepositSubmitting(false);
    }
  };

  if (!planId) {
    return <LoadingScreen label="Redirecting..." />;
  }

  if (loading) {
    return <LoadingScreen label="Loading investment plan..." />;
  }

  if (error && !plan) {
    return (
      <UnavailableScreen
        message={error}
        onBack={() => router.push("/investment")}
      />
    );
  }

  if (!plan) {
    return (
      <UnavailableScreen
        message="The investment plan could not be found."
        onBack={() => router.push("/investment")}
      />
    );
  }

  if (recoverDepositId && !recoveryResolved) {
    return <LoadingScreen label="Loading pending investment..." />;
  }

  if (recoveryError) {
    return (
      <UnavailableScreen
        message={recoveryError}
        onBack={() => router.push("/investment/investments")}
      />
    );
  }

  const activeIndex = STEPS.findIndex(
    (step) => step.key === currentStep,
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-[#E60033]/10 to-transparent"
      />

      <main className="relative mx-auto w-full max-w-3xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-8">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={creating || depositSubmitting}
            aria-label={t("invest.back")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/70 transition hover:text-white disabled:opacity-40"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
              {t("invest.invest_in")}
            </p>
            <h1 className="mt-0.5 truncate text-lg font-black sm:text-xl">
              {plan.name}
            </h1>
          </div>

          <span className="shrink-0 rounded-lg border border-white/10 bg-[#0B1426] px-2.5 py-2 text-[10px] font-bold text-white/60">
            {activeIndex + 1} / {STEPS.length}
          </span>
        </header>

        <nav aria-label="Investment progress" className="mt-6">
          <div className="grid grid-cols-4 gap-2">
            {STEPS.map((step, index) => {
              const completed = index < activeIndex;
              const active = index === activeIndex;

              return (
                <div key={step.key} className="min-w-0">
                  <div
                    className={`flex h-1.5 rounded-full ${
                      index <= activeIndex
                        ? "bg-[#E60033]"
                        : "bg-white/10"
                    }`}
                  />

                  <div className="mt-2 flex items-center gap-1">
                    {completed && (
                      <Check
                        size={11}
                        className="shrink-0 text-[#FF476B]"
                      />
                    )}
                    <span
                      aria-current={active ? "step" : undefined}
                      className={`truncate text-[9px] font-bold sm:text-[11px] ${
                        active
                          ? "text-white"
                          : completed
                            ? "text-[#FF8BA3]"
                            : "text-white/35"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {error && (
          <div
            role="alert"
            className="mt-5 flex gap-2.5 rounded-xl border border-[#E60033]/25 bg-[#E60033]/10 p-3 text-xs leading-5 text-[#FF9AAF]"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {networkError && !error && currentStep === "review" && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200"
          >
            {networkError}
          </div>
        )}

        <div className="mt-6">
          {currentStep === "amount" && (
            <StepAmount
              plan={plan}
              amount={amount}
              setAmount={setAmount}
              expectedReturn={expectedReturn}
              onNext={handleAmountNext}
            />
          )}

          {currentStep === "review" && (
            <StepReview
              plan={plan}
              amount={amount}
              expectedReturn={expectedReturn}
              totalProjected={totalProjected}
              fundingSource={fundingSource}
              setFundingSource={setFundingSource}
              onConfirm={handleReviewConfirm}
              onBack={() => setCurrentStep("amount")}
              creating={creating}
              paymentReady={!!usdtAssetId && !!tronNetworkId}
            />
          )}

          {currentStep === "payment" && (
            <StepPaymentDetails
              depositAddress={depositAddress}
              amount={amount}
              onSubmit={handleDepositSubmit}
              onBack={handleBack}
              submitting={depositSubmitting}
              error={depositError}
              existingDeposit={recoveryData?.deposit ?? null}
            />
          )}

          {currentStep === "success" && (
            <StepSuccess
              planName={plan.name}
              amount={amount}
              investmentId={investmentId}
              fundingSource={fundingSource}
              onViewInvestment={() =>
                router.push(
                  `/investment/investments/${encodeURIComponent(investmentId)}`,
                )
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050B18] px-4 text-white">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1426]">
          <Loader2
            size={24}
            className="animate-spin text-[#FF476B]"
          />
        </div>
        <p className="mt-4 text-xs font-semibold text-white/55">
          {label}
        </p>
      </div>
    </div>
  );
}

function UnavailableScreen({
  message,
  onBack,
}: {
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050B18] px-4 text-white">
      <div className="w-full max-w-sm rounded-[22px] border border-white/10 bg-[#0B1426] p-6 text-center">
        <AlertCircle
          size={28}
          className="mx-auto text-[#FF476B]"
        />
        <h1 className="mt-4 text-lg font-black">
          Investment unavailable
        </h1>
        <p className="mt-2 text-xs leading-5 text-white/50">
          {message}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 min-h-11 rounded-xl bg-[#E60033] px-5 text-xs font-extrabold text-white hover:bg-[#FF174B]"
        >
          Back to investments
        </button>
      </div>
    </div>
  );
}