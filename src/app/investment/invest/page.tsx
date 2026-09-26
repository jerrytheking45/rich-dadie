"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ChevronLeft,
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

type Step =
  | "amount"
  | "review"
  | "payment"
  | "success";

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null
  ) {
    const apiError =
      error as ApiError;

    return (
      apiError.response?.data?.message ||
      apiError.response?.data?.error ||
      apiError.message ||
      "An unexpected error occurred"
    );
  }

  return "An unexpected error occurred";
}

const InvestFlow = () => {
  const router = useRouter();

  const params = useParams<{
    planId?: string;
  }>();

  const searchParams =
    useSearchParams();

  const recoverDepositId =
    searchParams.get(
      "recoverDepositId",
    );

  const { t } =
    useTranslation();

  const planId =
    params?.planId;

  const [plan, setPlan] =
    useState<InvestmentPlan | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [amount, setAmount] =
    useState<number>(0);

  const [currentStep, setCurrentStep] =
    useState<Step>("amount");

  const [investmentId, setInvestmentId] =
    useState("");

  const [recoveryData, setRecoveryData] =
    useState<PendingInvestmentDeposit | null>(
      null,
    );

  const [
    recoveryLoading,
    setRecoveryLoading,
  ] = useState(false);

  const [creating, setCreating] =
    useState(false);

  const [
    depositSubmitting,
    setDepositSubmitting,
  ] = useState(false);

  const [depositError, setDepositError] =
    useState("");

  const [usdtAssetId, setUsdtAssetId] =
    useState("");

  const [tronNetworkId, setTronNetworkId] =
    useState("");

  const [fundingSource, setFundingSource] =
    useState<FundingSource>(
      "deposit",
    );

  const [depositAddress, setDepositAddress] =
    useState("");

  const [paymentToken, setPaymentToken] =
    useState("");

  /*
   * Load plan and supported USDT/TRON
   * identifiers.
   */
  useEffect(() => {
    if (!planId) {
      return;
    }

    let cancelled = false;

    const loadPlan = async () => {
      try {
        const data =
          await investmentApi.getPlan(
            planId,
          );

        if (cancelled) {
          return;
        }

        setPlan(data);

        if (!recoverDepositId) {
          setAmount(
            data.minimumAmount,
          );
        }

        setError("");
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load investment plan:",
          err,
        );

        setError(
          "Failed to load plan details",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const loadAssetAndNetwork =
      async () => {
        try {
          const assets =
            await investmentApi.getAssets();

          if (cancelled) {
            return;
          }

          const usdt =
            assets.find(
              (asset) =>
                asset.symbol
                  ?.toUpperCase() ===
                "USDT",
            );

          if (!usdt) {
            throw new Error(
              "USDT asset not found",
            );
          }

          setUsdtAssetId(
            usdt.id,
          );

          const networks =
            await investmentApi.getNetworks(
              usdt.id,
            );

          if (cancelled) {
            return;
          }

          const tron =
            networks.find(
              (network) =>
                network.network
                  ?.toUpperCase() ===
                "TRON",
            );

          if (!tron) {
            throw new Error(
              "TRON network not found",
            );
          }

          setTronNetworkId(
            tron.id,
          );
        } catch (err) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load USDT/TRON network:",
            err,
          );

          setError(
            "Failed to load USDT/TRON network",
          );
        }
      };

    void loadPlan();
    void loadAssetAndNetwork();

    return () => {
      cancelled = true;
    };
  }, [
    planId,
    recoverDepositId,
  ]);

  /*
   * Recovery flow.
   */
  useEffect(() => {
    if (
      !recoverDepositId ||
      !plan
    ) {
      return;
    }

    let cancelled = false;

    const loadRecovery =
      async () => {
        setRecoveryLoading(true);
        setError("");
        setDepositError("");

        try {
          const pending =
            await investmentApi.getPendingInvestmentDeposits();

          if (cancelled) {
            return;
          }

          const match =
            pending.find(
              (item) =>
                item.deposit?.id ===
                recoverDepositId,
            );

          if (!match) {
            throw new Error(
              "The pending investment deposit could not be found.",
            );
          }

          if (
            match.investment.planId !==
            plan.id
          ) {
            throw new Error(
              "This pending deposit does not belong to the selected investment plan.",
            );
          }

          const recoveryAmount =
            Number(
              match.deposit.expectedAmount,
            );

          if (
            !Number.isFinite(
              recoveryAmount,
            ) ||
            recoveryAmount <= 0
          ) {
            throw new Error(
              "The pending investment deposit has an invalid amount.",
            );
          }

          const prepareResult =
            await investmentApi.prepareDeposit(
              {
                plan_id:
                  match.investment
                    .planId,

                asset_id:
                  match.investment
                    .assetId,

                network_id:
                  match.investment
                    .networkId,

                amount:
                  recoveryAmount,
              },
            );

          if (cancelled) {
            return;
          }

          setRecoveryData(
            match,
          );

          setInvestmentId(
            match.investment.id,
          );

          setAmount(
            recoveryAmount,
          );

          setDepositAddress(
            prepareResult.deposit_address ||
              match.deposit
                .companyDepositAddress ||
              match.investment
                .depositAddress ||
              "",
          );

          setPaymentToken(
            prepareResult.payment_token,
          );

          setFundingSource(
            "deposit",
          );

          setCurrentStep(
            "payment",
          );
        } catch (err) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load pending investment recovery:",
            err,
          );

          setError(
            getErrorMessage(err),
          );
        } finally {
          if (!cancelled) {
            setRecoveryLoading(
              false,
            );
          }
        }
      };

    void loadRecovery();

    return () => {
      cancelled = true;
    };
  }, [
    recoverDepositId,
    plan,
  ]);

  const expectedReturn =
    useMemo(() => {
      if (!plan) {
        return 0;
      }

      return Math.round(
        amount *
          (plan.expectedReturnRate /
            100),
      );
    }, [
      amount,
      plan,
    ]);

  const totalProjected =
    useMemo(
      () =>
        amount +
        expectedReturn,
      [
        amount,
        expectedReturn,
      ],
    );

  const handleBack =
    () => {
      if (
        currentStep === "payment" &&
        recoveryData
      ) {
        router.push(
          `/investment/profile/deposit/${recoveryData.deposit.id}`,
        );

        return;
      }

      switch (
        currentStep
      ) {
        case "amount":
          router.push(
            "/investment",
          );
          break;

        case "review":
          setCurrentStep(
            "amount",
          );
          break;

        case "payment":
          setCurrentStep(
            "review",
          );
          break;

        case "success":
          router.push(
            "/investment/investments",
          );
          break;
      }
    };

  const handleAmountNext =
    () => {
      if (
        amount <
        (plan?.minimumAmount ??
          0)
      ) {
        setError(
          "Amount is below minimum.",
        );

        return;
      }

      setError("");
      setCurrentStep(
        "review",
      );
    };

  const handleReviewConfirm =
    async (
      source: FundingSource,
    ) => {
      if (!plan) {
        setError(
          "Investment plan is unavailable.",
        );

        return;
      }

      if (
        !Number.isFinite(
          amount,
        ) ||
        amount <= 0
      ) {
        setError(
          "Please enter a valid investment amount.",
        );

        return;
      }

      if (
        !usdtAssetId ||
        !tronNetworkId
      ) {
        setError(
          "USDT/TRON network not ready.",
        );

        return;
      }

      setCreating(true);
      setError("");

      try {
        const createData = {
          plan_id: plan.id,
          asset_id:
            usdtAssetId,
          network_id:
            tronNetworkId,
          amount,
        };

        if (
          source === "deposit"
        ) {
          const prepareResult =
            await investmentApi.prepareDeposit(
              createData,
            );

          setDepositAddress(
            prepareResult.deposit_address,
          );

          setPaymentToken(
            prepareResult.payment_token,
          );

          setCurrentStep(
            "payment",
          );

          return;
        }

        const result =
          await investmentApi.reinvestFromBalance(
            createData,
          );

        setInvestmentId(
          result.id,
        );

        setCurrentStep(
          "success",
        );
      } catch (err) {
        const message =
          getErrorMessage(err);

        setError(
          `Failed to create investment: ${message}`,
        );

        console.error(
          "Failed to create investment:",
          err,
        );
      } finally {
        setCreating(false);
      }
    };

  const handleDepositSubmit =
    async (
      txHash: string,
      proofUrl?: string,
    ) => {
      if (!plan) {
        setDepositError(
          "Investment plan is unavailable.",
        );

        return;
      }

      setDepositSubmitting(true);
      setDepositError("");

      try {
        /*
         * Recovery flow.
         */
        if (recoveryData) {
          const result =
            await investmentApi.submitDeposit(
              recoveryData
                .investment.id,
              txHash,
              proofUrl,
            );

          router.push(
            `/investment/profile/deposit/${result.id}`,
          );

          return;
        }

        /*
         * Normal flow.
         */
        if (!paymentToken) {
          setDepositError(
            "Payment session is unavailable.",
          );

          return;
        }

        const result =
          await investmentApi.confirmDeposit(
            {
              payment_token:
                paymentToken,

              tx_hash:
                txHash,

              plan_id:
                plan.id,

              asset_id:
                usdtAssetId,

              network_id:
                tronNetworkId,

              amount,
            },
          );

        setInvestmentId(
          result.id,
        );

        setCurrentStep(
          "success",
        );
      } catch (err) {
        const message =
          getErrorMessage(err);

        setDepositError(
          recoveryData
            ? `Deposit submission failed: ${message}`
            : `Deposit confirmation failed: ${message}`,
        );

        console.error(
          recoveryData
            ? "Deposit submission failed:"
            : "Deposit confirmation failed:",
          err,
        );
      } finally {
        setDepositSubmitting(
          false,
        );
      }
    };

  if (!planId) {
    router.replace(
      "/investment",
    );

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050B18] px-5 text-white">
        <div className="text-center">
          <Loader2
            size={24}
            className="mx-auto animate-spin text-emerald-300"
          />

          <p className="mt-4 text-sm text-white/40">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  if (
    loading ||
    recoveryLoading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050B18] px-5 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426]">
            <Loader2
              size={24}
              className="animate-spin text-emerald-300"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-white/55">
            {recoveryLoading
              ? "Loading pending investment..."
              : "Loading plan..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050B18] px-5 text-white">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/5 text-red-300">
            !
          </div>

          <h1 className="mt-5 text-lg font-black">
            Investment plan unavailable
          </h1>

          <p className="mt-2 text-xs leading-5 text-white/30">
            {error ||
              "The investment plan could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/investment",
              )
            }
            className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-[#03130C] transition hover:brightness-110"
          >
            Back to investments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <main className="relative mx-auto w-full max-w-xl px-4 pb-32 pt-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={
              creating ||
              depositSubmitting
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/8 bg-[#0B1426] text-white/60 shadow-lg transition hover:bg-[#0D182C] hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t(
              "invest.back",
            )}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">
              {t(
                "invest.invest_in",
              )}
            </p>

            <h1 className="truncate text-lg font-black tracking-tight text-white">
              {plan.name}
            </h1>
          </div>
        </header>

        {/* Progress */}
        <div className="mt-5 flex items-center gap-2">
          {(
            [
              "amount",
              "review",
              "payment",
              "success",
            ] as Step[]
          ).map(
            (step, index) => {
              const stepIndex =
                [
                  "amount",
                  "review",
                  "payment",
                  "success",
                ].indexOf(
                  currentStep,
                );

              const active =
                index <= stepIndex;

              return (
                <div
                  key={step}
                  className="flex flex-1 items-center gap-2"
                >
                  <div
                    className={[
                      "h-1.5 w-full rounded-full transition",
                      active
                        ? "bg-emerald-400"
                        : "bg-white/8",
                    ].join(" ")}
                  />

                  {index <
                    3 && (
                    <span className="hidden text-[8px] text-white/15 sm:block">
                      {index + 1}
                    </span>
                  )}
                </div>
              );
            },
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/10 bg-red-400/5 p-3 text-xs leading-5 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
          {currentStep ===
            "amount" && (
            <StepAmount
              plan={plan}
              amount={amount}
              setAmount={setAmount}
              expectedReturn={
                expectedReturn
              }
              onNext={
                handleAmountNext
              }
            />
          )}

          {currentStep ===
            "review" && (
            <StepReview
              plan={plan}
              amount={amount}
              expectedReturn={
                expectedReturn
              }
              totalProjected={
                totalProjected
              }
              fundingSource={
                fundingSource
              }
              setFundingSource={
                setFundingSource
              }
              onConfirm={
                handleReviewConfirm
              }
              onBack={() =>
                setCurrentStep(
                  "amount",
                )
              }
            />
          )}

          {currentStep ===
            "payment" && (
            <StepPaymentDetails
              depositAddress={
                depositAddress
              }
              amount={amount}
              onSubmit={
                handleDepositSubmit
              }
              onBack={
                handleBack
              }
              submitting={
                depositSubmitting
              }
              error={
                depositError
              }
              existingDeposit={
                recoveryData?.deposit ??
                null
              }
            />
          )}

          {currentStep ===
            "success" && (
            <StepSuccess
              planName={plan.name}
              amount={amount}
              investmentId={
                investmentId
              }
              onViewInvestment={() =>
                router.push(
                  `/investment/investments/${investmentId}`,
                )
              }
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default InvestFlow;