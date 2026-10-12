
/* src/app/investment/profile/wallet/bind/page.tsx */


"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Plus,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { withdrawalApi } from "@/src/lib/api/withdrawal";

import type {
  WithdrawalWalletResponse,
} from "@/src/lib/api/withdrawal";

const PIN_LENGTH = 6;

const PAYMENTS_PATH = "/investment/profile/payments";

/*
 * A standard TRON address:
 * - starts with T
 * - contains 34 Base58 characters
 *
 * The backend remains responsible for final address
 * validation, including any additional network checks.
 */
const TRON_ADDRESS_REGEX =
  /^T[1-9A-HJ-NP-Za-km-z]{33}$/;

function getApiError(
  err: unknown,
  fallback: string
): string {
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

    switch (err.response?.status) {
      case 401:
        return "Your session has expired. Please sign in again.";

      case 400:
        return "The wallet address or wallet PIN is invalid.";

      case 404:
        return "Your withdrawal wallet could not be found.";

      case 409:
        return "You already have an active withdrawal wallet.";

      default:
        break;
    }
  }

  return fallback;
}

export default function ProfileWalletBindPage() {
  const router = useRouter();

  const [wallet, setWallet] =
    useState<WithdrawalWalletResponse | null>(null);

  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  const [success, setSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  /* ==========================================
     CHECK EXISTING WALLET
  ========================================== */

  useEffect(() => {
    let cancelled = false;

    const loadWallet = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const currentWallet =
          await withdrawalApi.getWithdrawalWallet();

        if (cancelled) return;

        setWallet(currentWallet);
      } catch (err) {
        if (cancelled) return;

        /*
         * A 404 indicates that the user does not
         * currently have a withdrawal wallet.
         */
        if (
          axios.isAxiosError(err) &&
          err.response?.status === 404
        ) {
          setWallet(null);
          return;
        }

        console.error(
          "Failed to load withdrawal wallet:",
          err
        );

        /*
         * Do not allow a new wallet to be bound when
         * the existing-wallet check could not complete.
         */
        setLoadError(
          getApiError(
            err,
            "Unable to check your withdrawal wallet. Please try again."
          )
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadWallet();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  /* ==========================================
     FORM VALIDATION
  ========================================== */

  const trimmedAddress = address.trim();

  const isAddressValid =
    TRON_ADDRESS_REGEX.test(trimmedAddress);

  const isPinValid =
    /^\d{6}$/.test(pin);

  const canSubmit =
    !loading &&
    !loadError &&
    !wallet &&
    !submitting &&
    isAddressValid &&
    isPinValid;

  /* ==========================================
     BIND WALLET
  ========================================== */

  const handleBind = useCallback(async () => {
    if (submitting || loading || loadError) return;

    setError("");
    setSuccess(false);

    if (wallet) {
      setError(
        "You already have a withdrawal wallet. Manage your current wallet before binding another."
      );
      return;
    }

    if (!trimmedAddress) {
      setError("Please enter your withdrawal wallet address.");
      return;
    }

    if (!isAddressValid) {
      setError(
        "Enter a valid 34-character TRON wallet address beginning with T."
      );
      return;
    }

    if (!isPinValid) {
      setError(
        "Your wallet PIN must contain exactly 6 digits."
      );
      return;
    }

    setSubmitting(true);

    try {
      const boundWallet =
        await withdrawalApi.bindWithdrawalWallet(
          trimmedAddress,
          pin
        );

      setWallet(boundWallet);

      setAddress("");
      setPin("");

      setSuccess(true);
    } catch (err) {
      console.error(
        "Failed to bind withdrawal wallet:",
        err
      );

      setError(
        getApiError(
          err,
          "Failed to bind your withdrawal wallet. Please try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    submitting,
    loading,
    loadError,
    wallet,
    trimmedAddress,
    pin,
    isAddressValid,
    isPinValid,
  ]);

  /* ==========================================
     SHARED HEADER
  ========================================== */

  const pageTitle = success
    ? "Wallet Connected"
    : wallet
      ? "Withdrawal Wallet"
      : "Bind Withdrawal Wallet";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-white">

      {/* BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-24 top-20 h-64 w-64 rounded-full bg-[#E60033]/7 blur-[85px]" />

        <div className="absolute -left-24 top-[60%] h-64 w-64 rounded-full bg-[#E60033]/5 blur-[85px]" />
      </div>

      <main className="relative mx-auto w-full min-w-0 max-w-xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-6">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="flex min-w-0 items-center gap-3">

          <button
            type="button"
            onClick={() => router.push(PAYMENTS_PATH)}
            disabled={submitting}
            aria-label="Back to payment wallets"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 transition hover:border-[#E60033]/30 hover:text-white disabled:opacity-40 sm:h-10 sm:w-10"
          >
            <ArrowLeft size={17} aria-hidden="true" />
          </button>

          <div className="min-w-0">

            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#FF476B]">
              Withdrawal Security
            </p>

            <h1 className="truncate text-[18px] font-black tracking-tight text-white sm:text-[22px]">
              {pageTitle}
            </h1>

            <p className="text-[10px] text-white/45">
              USDT on TRON (TRC20)
            </p>
          </div>
        </header>

        {/* =====================================
            LOADING STATE
        ====================================== */}

        {loading && (
          <section
            role="status"
            className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1426] px-4 py-10 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
              <Loader2
                size={20}
                className="animate-spin"
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 text-sm font-bold text-white/80">
              Checking withdrawal wallet...
            </p>

            <p className="mt-1 text-[11px] text-white/40">
              Retrieving your current wallet settings
            </p>
          </section>
        )}

        {/* =====================================
            INITIAL LOAD ERROR
        ====================================== */}

        {!loading && loadError && (
          <section
            role="alert"
            className="mt-6 rounded-2xl border border-[#E60033]/25 bg-[#0B1426] p-5 text-center"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
              <AlertCircle size={20} aria-hidden="true" />
            </div>

            <h2 className="mt-3 text-sm font-black text-white">
              Unable to check your wallet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/50">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() =>
                setReloadKey((current) => current + 1)
              }
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-5 text-[11px] font-bold text-white transition hover:bg-[#FF174B]"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Try again
            </button>
          </section>
        )}

        {/* =====================================
            SUCCESS CONFIRMATION
        ====================================== */}

        {!loading && !loadError && success && wallet && (
          <section
            role="status"
            className="relative mt-6 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#29101D] via-[#0B1426] to-[#07101F] p-4 sm:p-6"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#E60033]/10 blur-[55px]"
            />

            <div className="relative">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  <CheckCircle2 size={21} aria-hidden="true" />
                </div>

                <div className="min-w-0">

                  <h2 className="text-sm font-black text-white">
                    Wallet bound successfully
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-white/55">
                    Your withdrawal wallet has been connected
                    to your REDIQ account.
                  </p>
                </div>
              </div>

              <AddressCard wallet={wallet} />

              <button
                type="button"
                onClick={() => router.push(PAYMENTS_PATH)}
                className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 text-xs font-bold text-white transition hover:bg-[#FF174B]"
              >
                Manage Withdrawal Wallet
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {/* =====================================
            EXISTING WALLET
        ====================================== */}

        {!loading && !loadError && !success && wallet && (
          <>
            <section className="relative mt-6 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#29101D] via-[#0B1426] to-[#07101F] p-4 sm:p-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                  <Wallet size={19} aria-hidden="true" />
                </div>

                <div className="min-w-0">

                  <h2 className="text-[13px] font-black text-white">
                    You already have a withdrawal wallet
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-white/50">
                    Only one withdrawal wallet can be bound
                    to your account at a time.
                  </p>
                </div>
              </div>

              <AddressCard wallet={wallet} />

              <button
                type="button"
                onClick={() => router.push(PAYMENTS_PATH)}
                className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 text-xs font-bold text-white transition hover:bg-[#FF174B]"
              >
                Manage Withdrawal Wallet
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </section>

            <SecurityNotice
              title="Wallet security"
              description="To change or remove your existing withdrawal wallet, use the wallet management section. Your 6-digit wallet PIN is required."
            />
          </>
        )}

        {/* =====================================
            NEW WALLET FORM
        ====================================== */}

        {!loading && !loadError && !wallet && !success && (
          <>

            {/* SECURITY INTRO */}
            <section className="relative mt-6 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#29101D] via-[#0B1426] to-[#07101F] p-4 sm:p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                  <ShieldCheck size={19} aria-hidden="true" />
                </div>

                <div className="min-w-0">

                  <h2 className="text-[13px] font-black text-white">
                    Connect your withdrawal wallet
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-white/55">
                    Add a USDT-TRC20 wallet address and confirm
                    the setup with your 6-digit wallet PIN.
                  </p>
                </div>
              </div>
            </section>

            {/* FORM ERROR */}
            {error && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#E60033]/25 bg-[#E60033]/8 p-3.5"
              >
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-[#FF476B]"
                  aria-hidden="true"
                />

                <p className="text-[11px] font-semibold leading-5 text-white/85">
                  {error}
                </p>
              </div>
            )}

            {/* MAIN FORM */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleBind();
              }}
              className="mt-5 min-w-0 rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-6"
            >

              <div className="mb-5">

                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FF476B]">
                  Wallet Setup
                </p>

                <h2 className="mt-1 text-base font-black text-white">
                  Withdrawal Details
                </h2>

                <p className="mt-1 text-[10px] leading-5 text-white/45">
                  Verify the network and address before
                  connecting your wallet.
                </p>
              </div>

              {/* ASSET + NETWORK */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">

                <div className="min-w-0 rounded-xl border border-white/10 bg-[#07101F] p-3">

                  <p className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                    Asset
                  </p>

                  <div className="mt-2 flex items-center gap-2">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                      <Wallet size={16} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-black text-white">
                        USDT
                      </p>

                      <p className="text-[9px] text-white/40">
                        Tether USD
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 rounded-xl border border-white/10 bg-[#07101F] p-3">

                  <p className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                    Network
                  </p>

                  <p className="mt-2 text-xs font-black text-white">
                    TRON
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#FF476B]">
                    TRC20
                  </p>
                </div>
              </div>

              {/* WALLET ADDRESS */}
              <div className="mt-5">

                <label
                  htmlFor="withdrawal-address"
                  className="text-[11px] font-bold text-white/85"
                >
                  Withdrawal Wallet Address
                </label>

                <input
                  id="withdrawal-address"
                  name="withdrawal-address"
                  type="text"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your TRON wallet address"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={submitting}
                  required
                  aria-invalid={
                    trimmedAddress.length > 0 &&
                    !isAddressValid
                  }
                  className="mt-2 h-12 w-full min-w-0 rounded-xl border border-white/10 bg-[#07101F] px-3.5 text-[12px] text-white outline-none transition placeholder:text-white/30 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:opacity-50 sm:text-[13px]"
                />

                <p className="mt-2 text-[10px] leading-5 text-white/45">
                  Enter a TRON address beginning with T.
                  Only use a wallet that you control and
                  that supports USDT on TRC20.
                </p>
              </div>

              {/* WALLET PIN */}
              <div className="mt-5">

                <label
                  htmlFor="withdrawal-pin"
                  className="flex items-center gap-2 text-[11px] font-bold text-white/85"
                >
                  <LockKeyhole
                    size={14}
                    className="text-[#FF476B]"
                    aria-hidden="true"
                  />
                  6-Digit Wallet PIN
                </label>

                <div className="relative mt-2">

                  <input
                    id="withdrawal-pin"
                    name="withdrawal-pin"
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={PIN_LENGTH}
                    value={pin}
                    onChange={(event) => {
                      const digits =
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, PIN_LENGTH);

                      setPin(digits);
                      setError("");
                    }}
                    placeholder="Enter 6-digit PIN"
                    autoComplete="off"
                    disabled={submitting}
                    required
                    aria-invalid={
                      pin.length > 0 && !isPinValid
                    }
                    className="h-12 w-full min-w-0 rounded-xl border border-white/10 bg-[#07101F] pl-3.5 pr-12 text-[16px] font-bold tracking-[0.2em] text-white outline-none transition placeholder:text-[12px] placeholder:font-normal placeholder:tracking-normal placeholder:text-white/30 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPin((current) => !current)
                    }
                    disabled={submitting}
                    aria-label={
                      showPin ? "Hide wallet PIN" : "Show wallet PIN"
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/5 hover:text-white"
                  >
                    {showPin ? (
                      <EyeOff size={16} aria-hidden="true" />
                    ) : (
                      <Eye size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-[10px] leading-5 text-white/45">
                  Enter your wallet PIN. Never share it
                  with another person.
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 text-xs font-black text-white shadow-lg shadow-[#E60033]/10 transition hover:bg-[#FF174B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Binding Wallet...
                  </>
                ) : (
                  <>
                    <Plus size={17} aria-hidden="true" />
                    Bind Withdrawal Wallet
                  </>
                )}
              </button>
            </form>

            <SecurityNotice
              title="Before you continue"
              description="Confirm that your address supports USDT-TRC20. Sending assets through an incorrect network or to an incorrect address can result in permanent loss of funds."
            />
          </>
        )}
      </main>
    </div>
  );
}

/* ==========================================
   CURRENT WALLET ADDRESS CARD
========================================== */

function AddressCard({
  wallet,
}: {
  wallet: WithdrawalWalletResponse;
}) {
  return (
    <div className="mt-5 min-w-0 rounded-xl border border-white/10 bg-[#07101F] p-3.5 sm:p-4">

      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/45">
        Current Withdrawal Address
      </p>

      <p className="mt-2 wrap-break-word font-mono text-[11px] leading-5 text-white/85 sm:text-xs">
        {wallet.address}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">

        <span className="rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold text-[#FF7895]">
          USDT
        </span>

        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold text-white/65">
          TRON · TRC20
        </span>

        <span className="max-w-full truncate rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase text-white/65">
          {wallet.status}
        </span>
      </div>
    </div>
  );
}

/* ==========================================
   SECURITY NOTICE
========================================== */

function SecurityNotice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mt-4 rounded-xl border border-white/10 bg-[#0B1426] p-4">

      <div className="flex items-start gap-3">

        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0 text-[#FF476B]"
          aria-hidden="true"
        />

        <div className="min-w-0">

          <h3 className="text-[11px] font-bold text-white/85">
            {title}
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-white/50">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}