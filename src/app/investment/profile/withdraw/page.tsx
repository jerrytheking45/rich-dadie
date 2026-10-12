
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  History,
  Loader2,
  RefreshCw,
  Wallet,
} from "lucide-react";

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
  WithdrawalStatus as WithdrawalStatusType,
} from "@/src/lib/types/investment";

type PINManagerMode = "set" | "change";

/* -------------------------------------------------------------------------- */
/* History configuration                                                      */
/* -------------------------------------------------------------------------- */

// Maximum number of recent withdrawals fetched.
const RECENT_WITHDRAWAL_LIMIT = 50;

// Number of rows visible before scrolling.
const VISIBLE_WITHDRAWAL_ROWS = 5;

// Approximate height of each withdrawal row.
const WITHDRAWAL_ROW_HEIGHT = 88;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function isNotFoundError(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
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

  return (
    error instanceof Error &&
    /\b404\b/.test(error.message)
  );
}

function isWithdrawalFinal(
  status: Withdrawal["status"],
): boolean {
  return [
    "COMPLETED",
    "FAILED",
    "CANCELLED",
  ].includes(status);
}

function getMessage(
  error: unknown,
  fallback: string,
): string {
  if (error && typeof error === "object") {
    const response = (
      error as {
        response?: {
          data?: {
            message?: unknown;
            error?: unknown;
          };
        };
      }
    ).response;

    const message =
      response?.data?.message ??
      response?.data?.error;

    if (
      typeof message === "string" &&
      message.trim()
    ) {
      return message;
    }
  }

  if (
    error instanceof Error &&
    error.message.trim()
  ) {
    return error.message;
  }

  return fallback;
}

function formatAmount(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusStyle(
  status: WithdrawalStatusType,
): string {
  switch (status) {
    case "COMPLETED":
      return (
        "border-emerald-400/20 " +
        "bg-emerald-400/10 " +
        "text-emerald-300"
      );

    case "FAILED":
    case "CANCELLED":
      return (
        "border-red-400/20 " +
        "bg-red-400/10 " +
        "text-red-300"
      );

    case "PENDING":
      return (
        "border-amber-400/20 " +
        "bg-amber-400/10 " +
        "text-amber-300"
      );

    case "PROCESSING":
    case "BROADCAST":
    case "CONFIRMING":
      return (
        "border-sky-400/20 " +
        "bg-sky-400/10 " +
        "text-sky-300"
      );

    default:
      return (
        "border-white/10 " +
        "bg-white/5 " +
        "text-white/60"
      );
  }
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function WithdrawPage() {
  const router = useRouter();

  /* ------------------------------------------------------------------------ */
  /* Request locks                                                            */
  /* ------------------------------------------------------------------------ */

  const submitLock = useRef(false);
  const pinManagerLock = useRef(false);
  const forgotPINLock = useRef(false);
  const refreshLock = useRef(false);
  const historyLock = useRef(false);

  const copiedTimeout = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  /* ------------------------------------------------------------------------ */
  /* Assets and withdrawal wallet                                             */
  /* ------------------------------------------------------------------------ */

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [
    withdrawalWallet,
    setWithdrawalWallet,
  ] = useState<WithdrawalWalletResponse | null>(
    null,
  );

  const [
    selectedAssetId,
    setSelectedAssetId,
  ] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Available balance                                                        */
  /* ------------------------------------------------------------------------ */

  const [balance, setBalance] = useState(0);

  const [
    balanceAssetId,
    setBalanceAssetId,
  ] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Withdrawal form                                                          */
  /* ------------------------------------------------------------------------ */

  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Created withdrawal                                                       */
  /* ------------------------------------------------------------------------ */

  const [success, setSuccess] =
    useState<Withdrawal | null>(null);

  const [copied, setCopied] = useState(false);

  const [
    forgotPINSuccess,
    setForgotPINSuccess,
  ] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Wallet PIN management                                                    */
  /* ------------------------------------------------------------------------ */

  const [
    pinConfigured,
    setPinConfigured,
  ] = useState(false);

  const [
    pinStatusLoading,
    setPinStatusLoading,
  ] = useState(true);

  const [
    pinManagerOpen,
    setPinManagerOpen,
  ] = useState(false);

  const [
    pinManagerMode,
    setPinManagerMode,
  ] = useState<PINManagerMode>("set");

  const [
    pinManagerSubmitting,
    setPinManagerSubmitting,
  ] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Recent withdrawals                                                       */
  /* ------------------------------------------------------------------------ */

  const [
    recentWithdrawals,
    setRecentWithdrawals,
  ] = useState<Withdrawal[]>([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  const [
    historyRefreshing,
    setHistoryRefreshing,
  ] = useState(false);

  const [
    historyError,
    setHistoryError,
  ] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Selected asset                                                           */
  /* ------------------------------------------------------------------------ */

  const selectedAsset = useMemo(
    () =>
      assets.find(
        (asset) =>
          asset.id === selectedAssetId,
      ) ?? null,
    [assets, selectedAssetId],
  );

  /*
   * Only expose the balance belonging to
   * the selected withdrawal asset.
   */
  const availableBalance =
    selectedAssetId &&
    balanceAssetId === selectedAssetId
      ? balance
      : 0;

  /*
   * Stable primitive values for status polling.
   */
  const activeWithdrawalId = success?.id;
  const activeWithdrawalStatus = success?.status;

  /* ------------------------------------------------------------------------ */
  /* Load withdrawal settings                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const [
        assetResult,
        walletResult,
        pinResult,
      ] = await Promise.allSettled([
        investmentApi.getAssets(),
        withdrawalApi.getWithdrawalWallet(),
        withdrawalPinApi.getStatus(),
      ]);

      if (!mounted) {
        return;
      }

      let nextError = "";

      /* Active assets */

      if (
        assetResult.status === "fulfilled"
      ) {
        setAssets(
          assetResult.value.filter(
            (asset) => asset.isActive,
          ),
        );
      } else {
        setAssets([]);

        nextError = getMessage(
          assetResult.reason,
          "Unable to load withdrawal assets.",
        );
      }

      /* Saved withdrawal wallet */

      if (
        walletResult.status === "fulfilled"
      ) {
        const wallet = walletResult.value;

        setWithdrawalWallet(wallet);

        setSelectedAssetId(
          wallet?.assetId ?? "",
        );
      } else {
        setWithdrawalWallet(null);
        setSelectedAssetId("");

        if (
          !isNotFoundError(
            walletResult.reason,
          ) &&
          !nextError
        ) {
          nextError = getMessage(
            walletResult.reason,
            "Unable to load your withdrawal wallet.",
          );
        }
      }

      /* Wallet PIN status */

      if (
        pinResult.status === "fulfilled"
      ) {
        setPinConfigured(
          pinResult.value.configured,
        );
      } else {
        setPinConfigured(false);

        if (!nextError) {
          nextError = getMessage(
            pinResult.reason,
            "Unable to load wallet PIN status.",
          );
        }
      }

      setError(nextError);
      setPinStatusLoading(false);
      setLoading(false);
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Load withdrawal balance                                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!selectedAssetId) {
      return;
    }

    let mounted = true;

    async function loadBalance() {
      try {
        const result =
          await ledgerApi.getBalance(
            selectedAssetId,
          );

        if (!mounted) {
          return;
        }

        setBalance(result);
        setBalanceAssetId(selectedAssetId);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setBalance(0);
        setBalanceAssetId("");

        setError(
          getMessage(
            err,
            "Unable to load your available balance.",
          ),
        );
      }
    }

    void loadBalance();

    return () => {
      mounted = false;
    };
  }, [selectedAssetId]);

  /* ------------------------------------------------------------------------ */
  /* Load recent withdrawals                                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    async function loadRecentWithdrawals() {
      try {
        const result =
          await withdrawalApi.getWithdrawals(
            1,
            RECENT_WITHDRAWAL_LIMIT,
          );

        if (!mounted) {
          return;
        }

        const latest = [...result.withdrawals]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          )
          .slice(
            0,
            RECENT_WITHDRAWAL_LIMIT,
          );

        setRecentWithdrawals(latest);
        setHistoryError("");
      } catch (err) {
        if (!mounted) {
          return;
        }

        setHistoryError(
          getMessage(
            err,
            "Unable to load recent withdrawals.",
          ),
        );
      } finally {
        if (mounted) {
          setHistoryLoading(false);
        }
      }
    }

    void loadRecentWithdrawals();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Refresh recent withdrawals                                               */
  /* ------------------------------------------------------------------------ */

  const handleRefreshHistory =
    useCallback(async () => {
      if (historyLock.current) {
        return;
      }

      historyLock.current = true;

      setHistoryRefreshing(true);
      setHistoryError("");

      try {
        const result =
          await withdrawalApi.getWithdrawals(
            1,
            RECENT_WITHDRAWAL_LIMIT,
          );

        const latest = [...result.withdrawals]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          )
          .slice(
            0,
            RECENT_WITHDRAWAL_LIMIT,
          );

        setRecentWithdrawals(latest);
      } catch (err) {
        setHistoryError(
          getMessage(
            err,
            "Unable to refresh recent withdrawals.",
          ),
        );
      } finally {
        historyLock.current = false;
        setHistoryRefreshing(false);
        setHistoryLoading(false);
      }
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Cleanup                                                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      if (copiedTimeout.current) {
        clearTimeout(
          copiedTimeout.current,
        );
      }
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* PIN manager                                                              */
  /* ------------------------------------------------------------------------ */

  const openPINManager = useCallback(
    (mode: PINManagerMode) => {
      setError("");
      setForgotPINSuccess(false);
      setPinManagerMode(mode);
      setPinManagerOpen(true);
    },
    [],
  );

  const closePINManager = useCallback(() => {
    if (pinManagerLock.current) {
      return;
    }

    setPinManagerOpen(false);
  }, []);

  /* Set wallet PIN */

  const handleSetPIN = useCallback(
    async (newPIN: string) => {
      if (pinManagerLock.current) {
        return;
      }

      pinManagerLock.current = true;

      setPinManagerSubmitting(true);
      setError("");

      try {
        await withdrawalPinApi.setPIN({
          pin: newPIN,
        });

        setPinConfigured(true);
        setPinManagerOpen(false);
        setPin("");
        setError("");
      } catch (err) {
        setError(
          getMessage(
            err,
            "Unable to set your wallet PIN.",
          ),
        );

        throw err;
      } finally {
        pinManagerLock.current = false;
        setPinManagerSubmitting(false);
      }
    },
    [],
  );

  /* Change wallet PIN */

  const handleChangePIN = useCallback(
    async (
      currentPIN: string,
      newPIN: string,
    ) => {
      if (pinManagerLock.current) {
        return;
      }

      pinManagerLock.current = true;

      setPinManagerSubmitting(true);
      setError("");

      try {
        await withdrawalPinApi.changePIN({
          current_pin: currentPIN,
          new_pin: newPIN,
        });

        setPinManagerOpen(false);
        setPin("");
        setError("");
      } catch (err) {
        setError(
          getMessage(
            err,
            "Unable to change your wallet PIN.",
          ),
        );

        throw err;
      } finally {
        pinManagerLock.current = false;
        setPinManagerSubmitting(false);
      }
    },
    [],
  );

  /* Forgot PIN */

  const handleForgotPIN =
    useCallback(async () => {
      if (forgotPINLock.current) {
        return;
      }

      forgotPINLock.current = true;

      setError("");
      setForgotPINSuccess(false);

      try {
        await withdrawalPinApi.forgotPIN();

        setForgotPINSuccess(true);
      } catch (err) {
        setForgotPINSuccess(false);

        setError(
          getMessage(
            err,
            "Unable to send the wallet PIN reset email.",
          ),
        );

        throw err;
      } finally {
        forgotPINLock.current = false;
      }
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Copy withdrawal wallet address                                           */
  /* ------------------------------------------------------------------------ */

  const handleCopyAddress =
    useCallback(async () => {
      if (!withdrawalWallet?.address) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          withdrawalWallet.address,
        );

        setCopied(true);

        if (copiedTimeout.current) {
          clearTimeout(
            copiedTimeout.current,
          );
        }

        copiedTimeout.current =
          setTimeout(() => {
            setCopied(false);
          }, 1500);
      } catch {
        setError(
          "Unable to copy the wallet address.",
        );
      }
    }, [withdrawalWallet]);

  /* ------------------------------------------------------------------------ */
  /* Submit withdrawal                                                        */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = useCallback(
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (submitLock.current) {
        return;
      }

      setError("");

      if (!pinConfigured) {
        setError(
          "Set your wallet PIN before making a withdrawal.",
        );
        return;
      }

      if (!selectedAssetId) {
        setError(
          "No withdrawal asset is available.",
        );
        return;
      }

      if (!withdrawalWallet) {
        setError(
          "No withdrawal wallet is linked to your account.",
        );
        return;
      }

      if (
        withdrawalWallet.status !== "ACTIVE"
      ) {
        setError(
          "Your withdrawal wallet is not active.",
        );
        return;
      }

      if (
        withdrawalWallet.assetId !==
        selectedAssetId
      ) {
        setError(
          "Your withdrawal wallet and asset do not match. Please refresh the page.",
        );
        return;
      }

      if (
        balanceAssetId !==
        selectedAssetId
      ) {
        setError(
          "Your available balance is still loading. Please try again.",
        );
        return;
      }

      const numericAmount = Number(amount);

      if (
        !amount.trim() ||
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
      ) {
        setError(
          "Enter a valid withdrawal amount.",
        );
        return;
      }

      if (
        numericAmount > availableBalance
      ) {
        setError(
          "Withdrawal amount exceeds your available balance.",
        );
        return;
      }

      const normalizedPIN = pin.trim();

      if (
        !/^\d{6}$/.test(normalizedPIN)
      ) {
        setError(
          "Enter your 6-digit wallet PIN.",
        );
        return;
      }

      /*
       * Prevent duplicate submissions.
       */
      submitLock.current = true;
      setSubmitting(true);

      try {
        /*
         * The saved withdrawal wallet
         * determines the destination.
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
         * Include the newly created withdrawal
         * in recent history immediately.
         */
        setRecentWithdrawals((current) => {
          const withoutDuplicate =
            current.filter(
              (item) =>
                item.id !== withdrawal.id,
            );

          return [
            withdrawal,
            ...withoutDuplicate,
          ]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(
              0,
              RECENT_WITHDRAWAL_LIMIT,
            );
        });

        /*
         * Refresh available balance.
         * Failure here must not overwrite
         * the created withdrawal.
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
          // Preserve the created withdrawal.
        }
      } catch (err) {
        setError(
          getMessage(
            err,
            "Unable to submit your withdrawal.",
          ),
        );
      } finally {
        submitLock.current = false;
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
      withdrawalWallet,
    ],
  );

  /* ------------------------------------------------------------------------ */
  /* Manually refresh created withdrawal                                      */
  /* ------------------------------------------------------------------------ */

  const handleRefreshStatus =
    useCallback(async () => {
      if (
        !success?.id ||
        refreshLock.current
      ) {
        return;
      }

      refreshLock.current = true;

      setRefreshing(true);
      setError("");

      try {
        const updated =
          await withdrawalService.getById(
            success.id,
          );

        setSuccess(updated);

        /*
         * Synchronize the recent list
         * with the refreshed status.
         */
        setRecentWithdrawals((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item,
          ),
        );
      } catch (err) {
        setError(
          getMessage(
            err,
            "Unable to refresh withdrawal status.",
          ),
        );
      } finally {
        refreshLock.current = false;
        setRefreshing(false);
      }
    }, [success]);

  /* ------------------------------------------------------------------------ */
  /* Automatic withdrawal status polling                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !activeWithdrawalId ||
      !activeWithdrawalStatus ||
      isWithdrawalFinal(
        activeWithdrawalStatus,
      )
    ) {
      return;
    }

    let mounted = true;
    let inFlight = false;

    const withdrawalId =
      activeWithdrawalId;

    async function refresh() {
      if (
        inFlight ||
        refreshLock.current
      ) {
        return;
      }

      inFlight = true;

      try {
        const updated =
          await withdrawalService.getById(
            withdrawalId,
          );

        if (!mounted) {
          return;
        }

        setSuccess(updated);

        /*
         * Keep the recent history row current.
         */
        setRecentWithdrawals((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item,
          ),
        );
      } catch {
        // Preserve the last known status.
      } finally {
        inFlight = false;
      }
    }

    /*
     * Refresh immediately,
     * then every 5 seconds.
     */
    void refresh();

    const intervalId =
      window.setInterval(() => {
        void refresh();
      }, 5000);

    return () => {
      mounted = false;

      window.clearInterval(
        intervalId,
      );
    };
  }, [
    activeWithdrawalId,
    activeWithdrawalStatus,
  ]);

  /* ------------------------------------------------------------------------ */
  /* New withdrawal                                                           */
  /* ------------------------------------------------------------------------ */

  const handleNewWithdrawal =
    useCallback(() => {
      setSuccess(null);
      setError("");
      setCopied(false);
      setAmount("");
      setPin("");
      setForgotPINSuccess(false);

      /*
       * Reload recent history when returning
       * to the withdrawal form.
       */
      void handleRefreshHistory();
    }, [handleRefreshHistory]);

  /* ------------------------------------------------------------------------ */
  /* Initial loading                                                          */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050B18] px-4 pb-28 pt-6 text-white sm:px-6">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-5 w-28 rounded-lg bg-white/10" />

          <div className="h-8 w-48 rounded-lg bg-white/10" />

          <div className="h-28 rounded-[22px] bg-[#0B1426]" />

          <div className="h-80 rounded-[22px] bg-[#0B1426]" />
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Created withdrawal status screen                                         */
  /* ------------------------------------------------------------------------ */

  if (success) {
    return (
      <main className="min-h-screen bg-[#050B18] px-3 pb-28 pt-5 text-white sm:px-6 sm:pt-8">
        <div className="mx-auto w-full max-w-2xl">
          <WithdrawalStatus
            withdrawal={success}
            onNewWithdrawal={
              handleNewWithdrawal
            }
            onBack={() =>
              router.push(
                "/investment/profile",
              )
            }
            onRefresh={
              handleRefreshStatus
            }
            refreshing={refreshing}
          />

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#E60033]/25 bg-[#E60033]/10 p-3 text-xs text-[#FF9AAD]"
            >
              {error}
            </p>
          )}
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Main withdrawal screen                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050B18] px-3 pb-28 pt-5 text-white min-[375px]:px-4 sm:px-6 sm:pt-7">

      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-[#E60033]/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-2xl">

        {/* ================================================================ */}
        {/* PAGE HEADER                                                      */}
        {/* ================================================================ */}

        <header className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/investment/profile",
              )
            }
            aria-label="Back to profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#FF476B]">
              REDIQ Wallet
            </p>

            <h1 className="mt-0.5 text-lg font-black tracking-tight sm:text-xl">
              Withdraw funds
            </h1>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
            <Wallet size={19} />
          </div>
        </header>

        {/* ================================================================ */}
        {/* WITHDRAWAL FORM                                                  */}
        {/* ================================================================ */}

        <div className="min-w-0 rounded-[22px] border border-white/10 bg-[#0B1426] p-3 shadow-xl shadow-black/10 min-[375px]:p-4 sm:rounded-[26px] sm:p-5">
          <WithdrawalForm
            asset={selectedAsset}
            withdrawalWallet={
              withdrawalWallet
            }
            amount={amount}
            pin={pin}
            balance={
              availableBalance
            }
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
            onAmountChange={
              setAmount
            }
            onPinChange={
              setPin
            }
            onSubmit={
              handleSubmit
            }
            onCopyAddress={
              handleCopyAddress
            }
          />
        </div>

        {/* ================================================================ */}
        {/* RECENT WITHDRAWALS                                               */}
        {/* ================================================================ */}

        <section className="mt-5 overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] shadow-xl shadow-black/10 sm:rounded-[26px]">

          {/* Fixed section heading */}

          <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                <History size={18} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-black tracking-tight text-white">
                  Recent withdrawals
                </h2>

                <p className="mt-0.5 text-[10px] text-white/45">
                  Your latest withdrawal activity
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void handleRefreshHistory()
              }
              disabled={
                historyLoading ||
                historyRefreshing
              }
              aria-label="Refresh recent withdrawals"
              title="Refresh recent withdrawals"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:border-[#E60033]/30 hover:text-[#FF476B] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw
                size={15}
                className={
                  historyRefreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          {/* ============================================================ */}
          {/* HISTORY CONTENT                                              */}
          {/* ============================================================ */}

          {historyLoading ? (
            <div className="space-y-3 p-4 sm:p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-3 rounded-xl border border-white/5 bg-white/3 p-3"
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-white/10" />
                    <div className="h-2.5 w-36 rounded bg-white/5" />
                  </div>

                  <div className="h-5 w-16 rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* History error */}

              {historyError && (
                <div
                  role="alert"
                  className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#E60033]/20 bg-[#E60033]/8 p-3 sm:mx-5"
                >
                  <p className="min-w-0 text-[11px] leading-5 text-[#FF9AAD]">
                    {historyError}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void handleRefreshHistory()
                    }
                    disabled={historyRefreshing}
                    className="shrink-0 text-[11px] font-extrabold text-[#FF476B] transition hover:text-white disabled:opacity-40"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty history */}

              {recentWithdrawals.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-10 text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/40">
                    {historyRefreshing ? (
                      <Loader2
                        size={21}
                        className="animate-spin"
                      />
                    ) : (
                      <Clock3 size={21} />
                    )}
                  </div>

                  <h3 className="mt-4 text-xs font-extrabold text-white">
                    No withdrawals yet
                  </h3>

                  <p className="mt-1.5 max-w-56 text-[11px] leading-5 text-white/45">
                    Your withdrawal activity will appear here
                    once you make your first request.
                  </p>
                </div>
              ) : (

                /* ======================================================== */
                /* INDEPENDENTLY SCROLLABLE WITHDRAWAL HISTORY             */
                /* ======================================================== */

                <div
                  role="region"
                  aria-label="Scrollable withdrawal history"
                  tabIndex={0}
                  className="
                    divide-y divide-white/6
                    overflow-x-hidden
                    overflow-y-auto
                    overscroll-y-contain
                    scroll-smooth
                    [scrollbar-color:#E60033_#0B1426]
                    scrollbar-thin
                    focus-visible:outline
                    focus-visible:outline-[#E60033]/50
                  "
                  style={{
                    maxHeight:
                      VISIBLE_WITHDRAWAL_ROWS *
                      WITHDRAWAL_ROW_HEIGHT,
                  }}
                >
                  {recentWithdrawals.map(
                    (withdrawal) => (
                      <button
                        key={withdrawal.id}
                        type="button"
                        onClick={() =>
                          router.push(
                            `/investment/profile/withdraw/${encodeURIComponent(
                              withdrawal.id,
                            )}`,
                          )
                        }
                        className="
                          group flex w-full items-center gap-3
                          px-4 py-3.5 text-left
                          transition-colors
                          hover:bg-white/4
                          focus-visible:bg-white/5
                          focus-visible:outline-none
                          sm:px-5 sm:py-4
                        "
                      >

                        {/* Transaction icon */}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/15 bg-[#E60033]/8 text-[#FF476B]">
                          <ArrowUpRight size={18} />
                        </div>

                        {/* Main details */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-extrabold text-white sm:text-[13px]">
                            Withdrawal
                          </p>

                          <p className="mt-1 text-[10px] text-white/45">
                            {formatDate(
                              withdrawal.createdAt,
                            )}
                          </p>

                          <p className="mt-1 truncate text-[9px] text-white/30">
                            Ref: {withdrawal.id}
                          </p>
                        </div>

                        {/* Amount and status */}

                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <p className="text-xs font-black tabular-nums text-white sm:text-sm">
                            -{formatAmount(
                              withdrawal.amount,
                            )}

                            <span className="ml-1 text-[10px] font-bold text-white/45">
                              {assets.find(
                                (asset) =>
                                  asset.id ===
                                  withdrawal.assetId,
                              )?.symbol ?? ""}
                            </span>
                          </p>

                          <span
                            className={`rounded-lg border px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide ${getStatusStyle(
                              withdrawal.status,
                            )}`}
                          >
                            {withdrawal.status.replace(
                              /_/g,
                              " ",
                            )}
                          </span>
                        </div>

                        <ChevronRight
                          size={15}
                          className="shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-[#FF476B]"
                        />
                      </button>
                    ),
                  )}
                </div>
              )}
            </>
          )}

          {/* ============================================================ */}
          {/* FIXED HISTORY FOOTER                                         */}
          {/* ============================================================ */}

          {recentWithdrawals.length > 0 && (
            <div className="flex items-center justify-between gap-3 border-t border-white/8 bg-white/2 px-4 py-3 sm:px-5">

              <p className="min-w-0 text-[10px] leading-4 text-white/40">
                {recentWithdrawals.length >
                VISIBLE_WITHDRAWAL_ROWS
                  ? `Showing ${VISIBLE_WITHDRAWAL_ROWS} at a time · Scroll for more (${recentWithdrawals.length} loaded)`
                  : `${recentWithdrawals.length} recent ${
                      recentWithdrawals.length === 1
                        ? "withdrawal"
                        : "withdrawals"
                    }`}
              </p>

              <button
                type="button"
                onClick={() =>
                  void handleRefreshHistory()
                }
                disabled={historyRefreshing}
                className="inline-flex shrink-0 items-center gap-1 text-[10px] font-extrabold text-[#FF476B] transition hover:text-white disabled:opacity-40"
              >
                {historyRefreshing
                  ? "Updating"
                  : "Refresh"}

                {historyRefreshing ? (
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <RefreshCw size={12} />
                )}
              </button>
            </div>
          )}
        </section>

        {/* ================================================================ */}
        {/* WALLET PIN MANAGER                                               */}
        {/* ================================================================ */}

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
          onClose={
            closePINManager
          }
          onSetPIN={
            handleSetPIN
          }
          onChangePIN={
            handleChangePIN
          }
          onForgotPIN={
            handleForgotPIN
          }
        />
      </div>
    </main>
  );
}