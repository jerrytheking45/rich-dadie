
/* src/app/investment/profile/payments/page.tsx */

"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Wallet as WalletIcon,
} from "lucide-react";
import axios from "axios";

import WithdrawalPINManager from "@/src/components/withdraw/WithdrawalPINManager";
import { withdrawalPinApi } from "@/src/lib/api/withdrawalPin";
import { withdrawalApi } from "@/src/lib/api/withdrawal";
import type { WithdrawalWalletResponse } from "@/src/lib/api/withdrawal";

const ProfilePaymentWalletPage = () => {
  const router = useRouter();

  const [wallet, setWallet] =
    useState<WithdrawalWalletResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [pinConfigured, setPinConfigured] =
    useState(false);

  const [bindWalletMessage, setBindWalletMessage] =
  useState("");  

  const [pinStatusLoading, setPinStatusLoading] =
    useState(true);

  const [pinManagerOpen, setPinManagerOpen] =
    useState(false);

  const [pinManagerSubmitting, setPinManagerSubmitting] =
    useState(false);

  const [pin, setPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);

  const [pinAction, setPinAction] = useState<
    "unbind" | null
  >(null);

  const [showChangeModal, setShowChangeModal] =
    useState(false);

  const [newAddress, setNewAddress] = useState("");

  const getApiError = (
    err: unknown,
    fallback: string,
  ): string => {
    if (axios.isAxiosError(err)) {
      const responseError = err.response?.data?.error;

      if (
        typeof responseError === "string" &&
        responseError.trim()
      ) {
        return responseError;
      }

      const responseMessage =
        err.response?.data?.message;

      if (
        typeof responseMessage === "string" &&
        responseMessage.trim()
      ) {
        return responseMessage;
      }

      if (err.response?.status === 401) {
        return "Your session has expired. Please sign in again.";
      }

      if (err.response?.status === 400) {
        return "The wallet information is invalid.";
      }

      if (err.response?.status === 409) {
        return "A withdrawal wallet is already bound.";
      }
    }

    return fallback;
  };

  useEffect(() => {
    let cancelled = false;

    async function loadSecurityAndWallet() {
      setLoading(true);
      setPinStatusLoading(true);
      setError("");

      const [
        walletResult,
        pinResult,
      ] = await Promise.allSettled([
        withdrawalApi.getWithdrawalWallet(),
        withdrawalPinApi.getStatus(),
      ]);

      if (cancelled) {
        return;
      }

      let nextError = "";

      if (walletResult.status === "fulfilled") {
        setWallet(walletResult.value);
      } else {
        const err = walletResult.reason;

        if (
          axios.isAxiosError(err) &&
          err.response?.status === 404
        ) {
          setWallet(null);
        } else {
          console.error(
            "Failed to load withdrawal wallet:",
            err,
          );

          setWallet(null);

          nextError = getApiError(
            err,
            "Failed to load your withdrawal wallet.",
          );
        }
      }

      if (pinResult.status === "fulfilled") {
        setPinConfigured(
          pinResult.value.configured,
        );
      } else {
        console.error(
          "Failed to load wallet PIN status:",
          pinResult.reason,
        );

        setPinConfigured(false);

        if (!nextError) {
          nextError = getApiError(
            pinResult.reason,
            "Unable to load your wallet PIN status.",
          );
        }
      }

      setError(nextError);
      setLoading(false);
      setPinStatusLoading(false);
    }

    void loadSecurityAndWallet();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatAddress = (address: string): string => {
    if (address.length <= 18) {
      return address;
    }

    return `${address.slice(0, 9)}...${address.slice(-7)}`;
  };

  const isValidPin = (value: string): boolean => {
    return /^\d{6}$/.test(value);
  };

  const handleOpenSetPIN = useCallback(() => {
    if (
      actionLoading ||
      pinStatusLoading ||
      pinConfigured
    ) {
      return;
    }

    setError("");
    setPinManagerOpen(true);
  }, [
    actionLoading,
    pinStatusLoading,
    pinConfigured,
  ]);

  const handleBindWallet = useCallback(() => {
  if (actionLoading || pinStatusLoading) {
    return;
  }

  if (!pinConfigured) {
    setBindWalletMessage(
      "Please set your secure wallet PIN first.",
    );
    return;
  }

  setBindWalletMessage("");
  router.push("/investment/wallet/bind");
}, [
  actionLoading,
  pinStatusLoading,
  pinConfigured,
  router,
]);

  const handleClosePINManager = useCallback(() => {
    if (pinManagerSubmitting) {
      return;
    }

    setPinManagerOpen(false);
  }, [pinManagerSubmitting]);

  const handleSetPIN = useCallback(
    async (newPIN: string) => {
      if (pinManagerSubmitting) {
        return;
      }

      try {
        setPinManagerSubmitting(true);
        setError("");

        await withdrawalPinApi.setPIN({
          pin: newPIN,
        });

        const status =
          await withdrawalPinApi.getStatus();

        setPinConfigured(status.configured);

        setPinManagerOpen(false);
        setError("");
      } catch (err) {
        console.error(
          "Failed to set wallet PIN:",
          err,
        );

        setError(
          getApiError(
            err,
            "Unable to set your wallet PIN.",
          ),
        );

        throw err;
      } finally {
        setPinManagerSubmitting(false);
      }
    },
    [pinManagerSubmitting],
  );

  const handleOpenUnbind = () => {
    if (!wallet || actionLoading) {
      return;
    }

    setError("");
    setPin("");
    setPinAction("unbind");
    setShowPinModal(true);
  };

  const handleOpenChange = () => {
    if (!wallet || actionLoading) {
      return;
    }

    setError("");
    setNewAddress("");
    setPin("");
    setPinAction(null);
    setShowChangeModal(true);
  };

  const handleChangeWallet = async () => {
    const trimmedAddress = newAddress.trim();

    setError("");

    if (!wallet) {
      setError("No withdrawal wallet is currently bound.");
      return;
    }

    if (!trimmedAddress) {
      setError("New wallet address is required.");
      return;
    }

    if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(trimmedAddress)) {
      setError(
        "Enter a valid TRON wallet address beginning with T.",
      );
      return;
    }

    if (!isValidPin(pin)) {
      setError("Enter your 6-digit wallet PIN.");
      return;
    }

    if (actionLoading) {
      return;
    }

    setActionLoading(true);

    try {
      const updated =
        await withdrawalApi.changeWithdrawalWallet(
          trimmedAddress,
          pin,
        );

      setWallet(updated);
      setShowChangeModal(false);
      setNewAddress("");
      setPin("");
      setError("");
    } catch (err) {
      console.error(
        "Failed to change withdrawal wallet:",
        err,
      );

      setError(
        getApiError(
          err,
          "Failed to change your withdrawal wallet.",
        ),
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbindWallet = async () => {
    if (!wallet) {
      return;
    }

    setError("");

    if (!isValidPin(pin)) {
      setError("Enter your 6-digit wallet PIN.");
      return;
    }

    if (actionLoading) {
      return;
    }

    setActionLoading(true);

    try {
      await withdrawalApi.unbindWithdrawalWallet(
        wallet.id,
        pin,
      );

      setWallet(null);
      setShowPinModal(false);
      setPin("");
      setPinAction(null);
      setError("");
    } catch (err) {
      console.error(
        "Failed to unbind withdrawal wallet:",
        err,
      );

      setError(
        getApiError(
          err,
          "Failed to unbind your withdrawal wallet.",
        ),
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -left-32 top-1/2 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -bottom-32 right-1/4 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl"
        aria-hidden="true"
      />

      <main className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push("/investment/profile")
              }
              disabled={actionLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/8 bg-[#0B1426] text-slate-300 shadow-lg shadow-black/10 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Back to profile"
            >
              <ArrowLeft
                size={18}
                aria-hidden="true"
              />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400/80">
                Wallet Security
              </p>

              <h1 className="mt-0.5 truncate text-[19px] font-extrabold tracking-tight text-white">
                Withdrawal Wallet
              </h1>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Manage your USDT TRON withdrawal destination
              </p>
            </div>
          </div>

{!wallet && !loading && (
  <div className="flex shrink-0 flex-col items-end">
    <button
      type="button"
      onClick={handleBindWallet}
      aria-disabled={
        actionLoading ||
        pinStatusLoading ||
        !pinConfigured
      }
      className={`mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-bold shadow-lg transition ${
        pinConfigured
          ? "bg-emerald-500 text-[#03110B] shadow-emerald-500/10 hover:bg-emerald-400"
          : "cursor-not-allowed border border-white/8 bg-white/5 text-slate-500 shadow-none"
      }`}
    >
      <Plus
        size={14}
        aria-hidden="true"
      />
      Bind Wallet
    </button>

    {bindWalletMessage && (
      <p className="mt-2 max-w-45 text-right text-[9px] leading-4 text-amber-300">
        {bindWalletMessage}
      </p>
    )}
  </div>
)}
        </header>

        {/* Hero */}
        <section className="mt-5 overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] shadow-xl shadow-black/10">
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  Protected destination
                </p>

                <h2 className="mt-1 text-[16px] font-extrabold text-white">
                  Secure your withdrawal wallet
                </h2>

                <p className="mt-1.5 max-w-xl text-[11px] leading-5 text-slate-400">
                  Only one active withdrawal wallet can be
                  connected. Your 6-digit wallet PIN protects
                  wallet binding, changes, unbinding, and
                  withdrawals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Wallet PIN */}
        <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
              <ShieldCheck
                size={19}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Wallet protection
                  </p>

                  <h2 className="mt-1 text-[15px] font-extrabold text-white">
                    Wallet PIN
                  </h2>

                  <p className="mt-1 text-[10px] leading-5 text-slate-400">
                    Your 6-digit PIN protects sensitive wallet
                    operations.
                  </p>
                </div>

                {pinConfigured && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold text-emerald-400">
                    <CheckCircle2
                      size={11}
                      aria-hidden="true"
                    />
                    Configured
                  </span>
                )}
              </div>

              {!pinConfigured && (
                <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/5 p-3.5">
                  <p className="text-[10px] leading-5 text-amber-300">
                    Set your wallet PIN before binding a
                    withdrawal wallet.
                  </p>

                  <button
                    type="button"
                    onClick={handleOpenSetPIN}
                    disabled={
                      actionLoading ||
                      pinStatusLoading ||
                      pinManagerSubmitting
                    }
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-[10px] font-bold text-[#03110B] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShieldCheck
                      size={14}
                      aria-hidden="true"
                    />
                    Set Wallet PIN
                  </button>
                </div>
              )}

              {pinConfigured && (
                <p className="mt-3 text-[10px] text-emerald-400">
                  Your wallet PIN is configured and ready to
                  protect your wallet.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-400/15 bg-red-400/5 p-3 text-[10px] leading-5 text-red-300"
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-12 shadow-xl shadow-black/10">
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Loader2
                size={17}
                className="animate-spin text-emerald-400"
                aria-hidden="true"
              />
              Loading withdrawal wallet...
            </div>
          </section>
        ) : wallet ? (
          <>
            {/* Current wallet */}
            <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <WalletIcon
                      size={21}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-extrabold text-white">
                        USDT Wallet
                      </h2>

                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                        <CheckCircle2
                          size={10}
                          aria-hidden="true"
                        />
                        Active
                      </span>
                    </div>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      USDT · TRON · TRC20
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-5 rounded-2xl border border-white/6 bg-[#07101F] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Withdrawal destination
                </p>

                <p
                  className="mt-2 break-all font-mono text-[11px] font-semibold leading-5 text-slate-200"
                  title={wallet.address}
                >
                  {wallet.address}
                </p>

                <p className="mt-2 text-[9px] text-slate-500">
                  {formatAddress(wallet.address)}
                </p>
              </div>

              {/* Metadata */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/6 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase text-slate-400">
                  USDT
                </span>

                <span className="rounded-full border border-white/6 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase text-slate-400">
                  TRON
                </span>

                <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 text-[9px] font-bold uppercase text-emerald-400">
                  Authoritative destination
                </span>
              </div>

              {/* Actions */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleOpenChange}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-[10px] font-bold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Pencil
                    size={14}
                    aria-hidden="true"
                  />
                  Change Wallet
                </button>

                <button
                  type="button"
                  onClick={handleOpenUnbind}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-[10px] font-bold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2
                    size={14}
                    aria-hidden="true"
                  />
                  Unbind
                </button>
              </div>
            </section>

            {/* Important notice */}
            <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-4 shadow-xl shadow-black/10">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-400"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-[11px] font-bold text-slate-200">
                    Wallet security
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500">
                    Your withdrawal wallet is the destination
                    used by the withdrawal service. Changing
                    or removing it requires your 6-digit wallet
                    PIN.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* No wallet */
          <section className="mt-4 rounded-[26px] border border-dashed border-white/10 bg-[#0B1426] p-9 text-center shadow-xl shadow-black/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/10 bg-emerald-400/5 text-emerald-400">
              <WalletIcon
                size={27}
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Wallet destination
            </p>

            <h2 className="mt-1 text-[15px] font-extrabold text-white">
              No withdrawal wallet
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-[10px] leading-5 text-slate-500">
              You currently have no active withdrawal wallet.
              Bind one USDT wallet on TRON to receive
              withdrawals.
            </p>

<div className="flex flex-col items-center">
  <button
    type="button"
    onClick={handleBindWallet}
    aria-disabled={
      actionLoading ||
      pinStatusLoading ||
      !pinConfigured
    }
    className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-bold shadow-lg transition ${
      pinConfigured
        ? "bg-emerald-500 text-[#03110B] shadow-emerald-500/10 hover:bg-emerald-400"
        : "cursor-not-allowed border border-white/8 bg-white/5 text-slate-500 shadow-none"
    }`}
  >
    <Plus
      size={14}
      aria-hidden="true"
    />
    Bind Withdrawal Wallet
  </button>

  {bindWalletMessage && (
    <p
      role="status"
      className="mt-2 text-center text-[9px] leading-4 text-amber-300"
    >
      {bindWalletMessage}
    </p>
  )}
</div>
          </section>
        )}
      </main>

      {/* CHANGE WALLET MODAL */}
      {showChangeModal && wallet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-[28px] border border-white/8 bg-[#0B1426] p-5 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  Wallet security
                </p>

                <h2 className="mt-1 text-[16px] font-extrabold text-white">
                  Change withdrawal wallet
                </h2>

                <p className="mt-1 text-[10px] leading-5 text-slate-400">
                  Your 6-digit wallet PIN is required to
                  change the withdrawal destination.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!actionLoading) {
                    setShowChangeModal(false);
                    setPin("");
                    setNewAddress("");
                  }
                }}
                disabled={actionLoading}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-5">
              <label
                htmlFor="new-withdrawal-address"
                className="text-[10px] font-bold text-slate-300"
              >
                New USDT TRON address
              </label>

              <input
                id="new-withdrawal-address"
                type="text"
                value={newAddress}
                onChange={(event) => {
                  setNewAddress(event.target.value);
                  setError("");
                }}
                placeholder="Enter TRON address beginning with T"
                autoComplete="off"
                spellCheck={false}
                disabled={actionLoading}
                className="mt-1.5 w-full rounded-xl border border-white/8 bg-[#07101F] p-3 text-[11px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10 disabled:opacity-50"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="change-wallet-pin"
                className="text-[10px] font-bold text-slate-300"
              >
                Wallet PIN
              </label>

              <input
                id="change-wallet-pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(event) => {
                  const value =
                    event.target.value.replace(/\D/g, "");

                  setPin(value);
                  setError("");
                }}
                placeholder="••••"
                autoComplete="off"
                disabled={actionLoading}
                className="mt-1.5 w-full rounded-xl border border-white/8 bg-[#07101F] p-3 text-center text-lg font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10 disabled:opacity-50"
              />

              <p className="mt-1.5 text-[9px] text-slate-500">
                Enter exactly 6 digits.
              </p>
            </div>

            <button
              type="button"
              onClick={handleChangeWallet}
              disabled={
                actionLoading ||
                !newAddress.trim() ||
                pin.length !== 6
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-[11px] font-bold text-[#03110B] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {actionLoading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Changing Wallet...
                </>
              ) : (
                <>
                  <Pencil
                    size={15}
                    aria-hidden="true"
                  />
                  Confirm Wallet Change
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* UNBIND PIN MODAL */}
      {showPinModal &&
        pinAction === "unbind" &&
        wallet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
            <div className="w-full max-w-md rounded-[28px] border border-white/8 bg-[#0B1426] p-5 shadow-2xl shadow-black/40">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                  <ShieldCheck
                    size={21}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-400">
                    Destructive action
                  </p>

                  <h2 className="mt-1 text-[16px] font-extrabold text-white">
                    Unbind withdrawal wallet
                  </h2>

                  <p className="mt-1 text-[10px] leading-5 text-slate-400">
                    Enter your wallet PIN to remove the
                    currently bound wallet.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/6 bg-[#07101F] p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Wallet being removed
                </p>

                <p className="mt-1 break-all font-mono text-[10px] leading-5 text-slate-300">
                  {wallet.address}
                </p>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="unbind-wallet-pin"
                  className="text-[10px] font-bold text-slate-300"
                >
                  Wallet PIN
                </label>

                <input
                  id="unbind-wallet-pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(/\D/g, "");

                    setPin(value);
                    setError("");
                  }}
                  placeholder="••••••"
                  autoComplete="off"
                  disabled={actionLoading}
                  className="mt-1.5 w-full rounded-xl border border-white/8 bg-[#07101F] p-3 text-center text-lg font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-slate-700 focus:border-red-400/40 focus:ring-2 focus:ring-red-400/10 disabled:opacity-50"
                />

                <p className="mt-1.5 text-[9px] text-slate-500">
                  Enter exactly 6 digits.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!actionLoading) {
                      setShowPinModal(false);
                      setPin("");
                      setPinAction(null);
                    }
                  }}
                  disabled={actionLoading}
                  className="rounded-xl border border-white/8 bg-white/5 py-3 text-[10px] font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUnbindWallet}
                  disabled={
                    actionLoading ||
                    pin.length !== 4
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-[10px] font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {actionLoading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Trash2
                      size={15}
                      aria-hidden="true"
                    />
                  )}

                  {actionLoading
                    ? "Removing..."
                    : "Unbind Wallet"}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Wallet PIN SETUP MODAL */}
      <WithdrawalPINManager
        mode="set"
        open={pinManagerOpen}
        submitting={pinManagerSubmitting}
        error={error}
        onClose={handleClosePINManager}
        onSetPIN={handleSetPIN}
        onChangePIN={async () => {}}
        onForgotPIN={async () => {}}
      />
    </div>
  );
};

export default ProfilePaymentWalletPage;

