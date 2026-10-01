

// src/app/investment/profile/withdraw/page.tsx

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";


import WithdrawalForm from "@/src/components/withdraw/WithdrawalForm";
import WithdrawalPINManager from "@/src/components/withdraw/WithdrawalPINManager";
import WithdrawalStatus from "@/src/components/withdraw/WithdrawalStatus";

import { investmentApi } from "@/src/lib/api/investmentApi";
import {
  withdrawalApi,
  type WithdrawalWalletResponse,
} from "@/src/lib/api/withdrawal";
import { ledgerApi } from "@/src/lib/api/ledger";
import { withdrawalPinApi } from "@/src/lib/api/withdrawalPin";
import { withdrawalService } from "@/src/lib/services/withdrawalService";

import type {
  Asset,
  Withdrawal,
} from "@/src/lib/types/investment";

type PINManagerMode = "set" | "change";

function isNotFoundError(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null
  ) {
    const response = (
      error as {
        response?: {
          status?: number;
        };
      }
    ).response;

    if (response?.status === 404) {
      return true;
    }
  }

  if (error instanceof Error) {
    return /\b404\b/.test(error.message);
  }

  return false;
}

function isWithdrawalFinal(status: Withdrawal["status"]): boolean {
  return [
    "COMPLETED",
    "FAILED",
    "CANCELLED",
  ].includes(status);
}

export default function WithdrawPage() {
  const router = useRouter();

  const [assets, setAssets] = useState<Asset[]>(
    [],
  );

  const [
    withdrawalWallet,
    setWithdrawalWallet,
  ] =
    useState<WithdrawalWalletResponse | null>(
      null,
    );

  const [selectedAssetId, setSelectedAssetId] =
    useState("");

  const [balance, setBalance] = useState(0);

  const [balanceAssetId, setBalanceAssetId] =
    useState("");

  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState<Withdrawal | null>(null);

  const [copied, setCopied] = useState(false);

  /*
   * Shared Forgot PIN success state.
   *
   * This is intentionally owned by the page so
   * both the withdrawal form and PIN manager can
   * show the same successful reset confirmation.
   */
  const [forgotPINSuccess, setForgotPINSuccess] =
    useState(false);

  /*
   * Wallet PIN state.
   */
  const [pinConfigured, setPinConfigured] =
    useState(false);

  const [pinStatusLoading, setPinStatusLoading] =
    useState(true);

  const [pinManagerOpen, setPinManagerOpen] =
    useState(false);

  const [pinManagerMode, setPinManagerMode] =
    useState<PINManagerMode>("set");

  const [
    pinManagerSubmitting,
    setPinManagerSubmitting,
  ] = useState(false);

  /*
   * The withdrawal asset is determined by the
   * authoritative backend withdrawal wallet.
   */
  const selectedAsset = useMemo(
    () =>
      assets.find(
        (asset) =>
          asset.id === selectedAssetId,
      ) ?? null,
    [assets, selectedAssetId],
  );

  /*
   * Only expose a balance when it belongs to the
   * currently selected withdrawal asset.
   */
  const availableBalance =
    balanceAssetId === selectedAssetId
      ? balance
      : 0;

  /*
   * Load:
   *
   * - active investment assets
   * - authenticated user's withdrawal wallet
   * - wallet PIN status
   */
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setPinStatusLoading(true);
      setError("");

      const [
        assetResult,
        withdrawalWalletResult,
        pinStatusResult,
      ] = await Promise.allSettled([
        investmentApi.getAssets(),
        withdrawalApi.getWithdrawalWallet(),
        withdrawalPinApi.getStatus(),
      ]);

      if (!mounted) {
        return;
      }

      let nextError = "";

      /*
       * Assets.
       */
      if (assetResult.status === "fulfilled") {
        const activeAssets =
          assetResult.value.filter(
            (asset) => asset.isActive,
          );

        setAssets(activeAssets);

        /*
         * The withdrawal wallet is authoritative
         * for the withdrawal asset.
         */
        if (
          withdrawalWalletResult.status ===
          "fulfilled"
        ) {
          const wallet =
            withdrawalWalletResult.value;

          setWithdrawalWallet(wallet);

          if (wallet) {
            const walletAsset =
              activeAssets.find(
                (asset) =>
                  asset.id === wallet.assetId,
              );

            setSelectedAssetId(
              walletAsset?.id ??
                wallet.assetId,
            );
          } else {
            setSelectedAssetId("");
          }
        } else {
          setWithdrawalWallet(null);
          setSelectedAssetId("");
        }
      } else {
        setAssets([]);
        setSelectedAssetId("");

        nextError =
          assetResult.reason instanceof Error
            ? assetResult.reason.message
            : "Unable to load withdrawal assets.";
      }

      /*
       * Withdrawal wallet.
       *
       * A 404 means there is no currently bound
       * wallet. This page does not bind wallets;
       * the wallet must be configured through
       * the Payments wallet flow.
       */
      if (
        withdrawalWalletResult.status ===
        "rejected"
      ) {
        setWithdrawalWallet(null);
        setSelectedAssetId("");

        if (
          !isNotFoundError(
            withdrawalWalletResult.reason,
          ) &&
          !nextError
        ) {
          const reason =
            withdrawalWalletResult.reason;

          nextError =
            reason instanceof Error
              ? reason.message
              : "Unable to load your withdrawal wallet.";
        }
      }

      /*
       * Wallet PIN.
       */
      if (
        pinStatusResult.status ===
        "fulfilled"
      ) {
        setPinConfigured(
          pinStatusResult.value.configured,
        );
      } else {
        setPinConfigured(false);

        if (
          assetResult.status ===
            "fulfilled" &&
          withdrawalWalletResult.status ===
            "fulfilled" &&
          !nextError
        ) {
          const reason =
            pinStatusResult.reason;

          nextError =
            reason instanceof Error
              ? reason.message
              : "Unable to load wallet PIN status.";
        }
      }

      setError(nextError);
      setLoading(false);
      setPinStatusLoading(false);
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Load the available ledger balance for the
   * asset attached to the withdrawal wallet.
   */
  useEffect(() => {
    if (!selectedAssetId) {
      return;
    }

    let mounted = true;

    async function loadBalance() {
      try {
        const currentBalance =
          await ledgerApi.getBalance(
            selectedAssetId,
          );

        if (mounted) {
          setBalance(currentBalance);
          setBalanceAssetId(selectedAssetId);
        }
      } catch (err) {
        if (mounted) {
          setBalance(0);
          setBalanceAssetId("");

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your available balance.",
          );
        }
      }
    }

    void loadBalance();

    return () => {
      mounted = false;
    };
  }, [selectedAssetId]);

  /*
   * Open PIN manager.
   *
   * Clear any previous Forgot PIN success state
   * whenever the manager is opened.
   */
  const openPINManager = useCallback(
    (mode: PINManagerMode) => {
      setError("");
      setForgotPINSuccess(false);
      setPinManagerMode(mode);
      setPinManagerOpen(true);
    },
    [],
  );

  /*
   * Close PIN manager.
   */
  const closePINManager = useCallback(() => {
    if (pinManagerSubmitting) {
      return;
    }

    setPinManagerOpen(false);
  }, [pinManagerSubmitting]);

  /*
   * Set wallet PIN.
   */
  const handleSetPIN = useCallback(
    async (newPIN: string) => {
      try {
        setPinManagerSubmitting(true);
        setError("");

        await withdrawalPinApi.setPIN({
          pin: newPIN,
        });

        setPinConfigured(true);
        setPinManagerOpen(false);
        setPin("");

        setError("");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to set your wallet PIN.";

        setError(message);

        throw err;
      } finally {
        setPinManagerSubmitting(false);
      }
    },
    [],
  );

  /*
   * Change wallet PIN.
   */
  const handleChangePIN = useCallback(
    async (
      currentPIN: string,
      newPIN: string,
    ) => {
      try {
        setPinManagerSubmitting(true);
        setError("");

        await withdrawalPinApi.changePIN({
          current_pin: currentPIN,
          new_pin: newPIN,
        });

        setPinManagerOpen(false);
        setPin("");

        setError("");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to change your wallet PIN.";

        setError(message);

        throw err;
      } finally {
        setPinManagerSubmitting(false);
      }
    },
    [],
  );

  /*
   * Request a forgotten PIN reset email.
   *
   * The page owns the success state so both
   * Forgot PIN entry points show the same
   * confirmation after a successful request.
   */
  const handleForgotPIN = useCallback(
    async () => {
      try {
        setError("");
        setForgotPINSuccess(false);

        await withdrawalPinApi.forgotPIN();

        /*
         * Only show success after the API call
         * resolves successfully.
         */
        setForgotPINSuccess(true);
      } catch (err) {
        setForgotPINSuccess(false);

        const message =
          err instanceof Error
            ? err.message
            : "Unable to send the wallet PIN reset email.";

        setError(message);

        throw err;
      }
    },
    [],
  );

  /*
   * Copy the authoritative withdrawal wallet address.
   */
  const handleCopyAddress = useCallback(
    async () => {
      if (!withdrawalWallet?.address) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          withdrawalWallet.address,
        );

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 1500);
      } catch {
        setError(
          "Unable to copy the wallet address.",
        );
      }
    },
    [withdrawalWallet],
  );

  /*
   * Submit withdrawal.
   *
   * No destination address is accepted from the
   * withdrawal form.
   *
   * No wallet ID is supplied by the frontend.
   *
   * The backend resolves the authenticated user's
   * active Payments-bound withdrawal wallet.
   */
  const handleSubmit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (submitting) {
        return;
      }

      setError("");

      if (!pinConfigured) {
        setError(
          "Set your wallet PIN before making a withdrawal.",
        );
        return;
      }

      const numericAmount = Number(amount);

      if (!selectedAssetId) {
        setError(
          "No withdrawal asset is available.",
        );
        return;
      }

      if (!withdrawalWallet) {
        setError(
          "No withdrawal wallet is bound to your account.",
        );
        return;
      }

      if (
        withdrawalWallet.status !==
        "ACTIVE"
      ) {
        setError(
          "Your withdrawal wallet is not active.",
        );
        return;
      }

      /*
       * Protect against an unexpected mismatch
       * between the wallet returned by the backend
       * and the asset currently loaded in the page.
       */
      if (
        withdrawalWallet.assetId !==
        selectedAssetId
      ) {
        setError(
          "The withdrawal wallet and asset do not match. Please refresh the page.",
        );
        return;
      }

      /*
       * Do not allow a balance from another asset
       * to authorize the withdrawal.
       */
      if (
        balanceAssetId !==
        selectedAssetId
      ) {
        setError(
          "Your available balance is still loading. Please try again.",
        );
        return;
      }

      if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
      ) {
        setError(
          "Enter a valid withdrawal amount.",
        );
        return;
      }

      if (
        numericAmount >
        availableBalance
      ) {
        setError(
          "Withdrawal amount exceeds your available balance.",
        );
        return;
      }

      const normalizedPIN = pin.trim();

      if (!normalizedPIN) {
        setError(
          "Enter your wallet PIN.",
        );
        return;
      }

      if (!/^\d{6}$/.test(normalizedPIN)) {
        setError(
          "Wallet PIN must be 6 digits.",
        );
        return;
      }

      try {
        setSubmitting(true);

        /*
         * Only amount and PIN are submitted.
         *
         * The backend remains authoritative for
         * the withdrawal destination.
         */
        const withdrawal =
          await withdrawalService.create({
            amount: numericAmount,
            pin: normalizedPIN,
          });

        setSuccess(withdrawal);

        setAmount("");
        setPin("");

        /*
         * Refresh the ledger balance after a
         * successful withdrawal.
         *
         * Failure here must never replace the
         * successful withdrawal state.
         */
        try {
          const updatedBalance =
            await ledgerApi.getBalance(
              selectedAssetId,
            );

          setBalance(updatedBalance);
          setBalanceAssetId(
            selectedAssetId,
          );
        } catch {
          /*
           * Withdrawal succeeded; ignore secondary
           * balance refresh failure.
           */
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to create the withdrawal.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      amount,
      availableBalance,
      balanceAssetId,
      pin,
      pinConfigured,
      selectedAssetId,
      submitting,
      withdrawalWallet,
    ],
  );

  /*
   * Refresh withdrawal status.
   */
  const handleRefreshStatus =
    useCallback(async () => {
      if (!success) {
        return;
      }

      try {
        setRefreshing(true);
        setError("");

        const updated =
          await withdrawalService.getById(
            success.id,
          );

        setSuccess(updated);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to refresh withdrawal status.",
        );
      } finally {
        setRefreshing(false);
      }
    }, [success]);

      /*
   * Automatically refresh withdrawal status while
   * the withdrawal is still being processed.
   *
   * Polls every 5 seconds and stops automatically
   * once the withdrawal reaches a final state.
   */
  useEffect(() => {
    const withdrawalId = success?.id;
    const withdrawalStatus = success?.status;

    if (!withdrawalId || !withdrawalStatus) {
      return;
    }

    if (isWithdrawalFinal(withdrawalStatus)) {
      return;
    }

    let mounted = true;

    const refresh = async () => {
      try {
        const updated =
          await withdrawalService.getById(
            withdrawalId,
          );

        if (mounted) {
          setSuccess(updated);
        }
      } catch {
        /*
         * Keep the current status visible if a
         * background refresh temporarily fails.
         *
         * The user can still use the manual
         * refresh button.
         */
      }
    };

    /*
     * Refresh immediately when polling starts,
     * then continue every 5 seconds.
     */
    void refresh();

    const intervalId = window.setInterval(
      () => {
        void refresh();
      },
      5000,
    );

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, [success?.id, success?.status]);

  /*
   * Start another withdrawal.
   */
  const handleNewWithdrawal =
    useCallback(() => {
      setSuccess(null);
      setError("");
      setCopied(false);
      setAmount("");
      setPin("");
      setForgotPINSuccess(false);
    }, []);

  /*
   * Initial loading state.
   */
  if (loading) {
    return (
      <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        <div className="mx-auto max-w-2xl px-5 py-8">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-32 rounded-xl bg-[#0C2244]" />

            <div className="h-4 w-72 rounded bg-[#0C2244]" />

            <div className="h-32 rounded-3xl bg-[#0C2244]" />

            <div className="h-14 rounded-2xl bg-[#0C2244]" />

            <div className="h-14 rounded-2xl bg-[#0C2244]" />

            <div className="h-14 rounded-2xl bg-[#0C2244]" />
          </div>
        </div>
      </main>
    );
  }

  /*
   * Successful withdrawal/status state.
   */
  if (success) {
    return (
      <main className="min-h-screen bg-[#07182F] px-4 pb-28 pt-6 text-white">
        <WithdrawalStatus
          withdrawal={success}
          onNewWithdrawal={
            handleNewWithdrawal
          }
          onBack={() => {
            router.push(
              "/investment/profile",
            );
          }}
          onRefresh={
            handleRefreshStatus
          }
          refreshing={refreshing}
        />
      </main>
    );
  }

  /*
   * Main withdrawal page.
   */
  return (
    <main className="min-h-screen bg-[#07182F] pb-28 text-white">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <WithdrawalForm
          asset={selectedAsset}
          withdrawalWallet={
            withdrawalWallet
          }
          amount={amount}
          pin={pin}
          balance={availableBalance}
          submitting={
            submitting ||
            pinStatusLoading
          }
          error={error}
          copied={copied}
          pinConfigured={
            pinConfigured
          }
          forgotPINSuccess={
            forgotPINSuccess
          }
          onSetPIN={() =>
            openPINManager("set")
          }
          onChangePIN={() =>
            openPINManager("change")
          }
          onForgotPIN={
            handleForgotPIN
          }
          onAmountChange={setAmount}
          onPinChange={setPin}
          onSubmit={handleSubmit}
          onCopyAddress={
            handleCopyAddress
          }
        />

        <WithdrawalPINManager
          mode={pinManagerMode}
          open={pinManagerOpen}
          submitting={
            pinManagerSubmitting
          }
          error={error}
          forgotSuccess={
            forgotPINSuccess
          }
          onClose={closePINManager}
          onSetPIN={handleSetPIN}
          onChangePIN={handleChangePIN}
          onForgotPIN={
            handleForgotPIN
          }
        />
      </div>
    </main>
  );
}