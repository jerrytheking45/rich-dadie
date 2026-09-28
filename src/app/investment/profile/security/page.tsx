
// src/app/investment/profile/security/page.tsx


"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Key,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WithdrawalPINManager from "@/src/components/withdraw/WithdrawalPINManager";
import { withdrawalPinApi } from "@/src/lib/api/withdrawalPin";

type PINStatus =
  | "checking"
  | "configured"
  | "not_configured"
  | "error";



export default function SecurityPage() {
  const router = useRouter();

  const [pinStatus, setPinStatus] =
    useState<PINStatus>("checking");

  const [pinModalOpen, setPinModalOpen] =
    useState(false);

  const [pinModalMode, setPinModalMode] =
    useState<"set" | "change">("set");

  const [pinSubmitting, setPinSubmitting] =
    useState(false);

  const [pinError, setPinError] = useState("");

  const [pinStatusError, setPinStatusError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const response =
            await withdrawalPinApi.getStatus();

          if (cancelled) {
            return;
          }

          setPinStatus(
            response.configured
              ? "configured"
              : "not_configured",
          );

          setPinStatusError("");
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load wallet PIN status:",
            error,
          );

          setPinStatus("error");

          setPinStatusError(
            "Unable to check your wallet PIN status.",
          );
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  function openSetPIN() {
    setPinError("");
    setPinModalMode("set");
    setPinModalOpen(true);
  }

  function openChangePIN() {
    setPinError("");
    setPinModalMode("change");
    setPinModalOpen(true);
  }

  function closePINModal() {
    if (pinSubmitting) {
      return;
    }

    setPinModalOpen(false);
    setPinError("");
  }

  function getAPIErrorMessage(
    error: unknown,
    fallback: string,
  ): string {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const response = (
        error as {
          response?: {
            data?: {
              error?: string;
              message?: string;
            };
          };
        }
      ).response;

      const backendMessage =
        response?.data?.error ??
        response?.data?.message;

      if (backendMessage) {
        if (
          backendMessage.toLowerCase().includes(
            "wallet pin is already in use",
          )
        ) {
          return "This Wallet PIN is already in use. Please choose a different Wallet PIN.";
        }

        return backendMessage;
      }
    }

    return error instanceof Error
      ? error.message
      : fallback;
  }

  async function handleSetPIN(pin: string) {
    if (pinSubmitting) {
      return;
    }

    setPinError("");
    setPinSubmitting(true);

    try {
      await withdrawalPinApi.setPIN({
        pin,
      });

      setPinStatus("configured");
      setPinModalOpen(false);
      setPinError("");
    } catch (error) {
      console.error(
        "Failed to set Wallet PIN:",
        error,
      );

      setPinError(
        getAPIErrorMessage(
          error,
          "Unable to set your Wallet PIN.",
        ),
      );
    } finally {
      setPinSubmitting(false);
    }
  }

  async function handleChangePIN(
    currentPIN: string,
    newPIN: string,
  ) {
    if (pinSubmitting) {
      return;
    }

    setPinError("");
    setPinSubmitting(true);

    try {
      await withdrawalPinApi.changePIN({
        current_pin: currentPIN,
        new_pin: newPIN,
      });

      setPinStatus("configured");
      setPinModalOpen(false);
      setPinError("");
    } catch (error) {
      console.error(
        "Failed to change wallet PIN:",
        error,
      );

      setPinError(
        error instanceof Error
          ? error.message
          : "Unable to change your wallet PIN.",
      );
    } finally {
      setPinSubmitting(false);
    }
  }

  async function handleForgotPIN() {
    if (pinSubmitting) {
      return;
    }

    setPinError("");
    setPinSubmitting(true);

    try {
      await withdrawalPinApi.forgotPIN();
    } catch (error) {
      console.error(
        "Failed to request wallet PIN reset:",
        error,
      );

      setPinError(
        error instanceof Error
          ? error.message
          : "Unable to send the wallet PIN reset link.",
      );
    } finally {
      setPinSubmitting(false);
    }
  }


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
        <div className="mx-auto w-full max-w-2xl">
          {/* Header */}
          <header className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push("/investment/profile")
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/8 bg-[#0B1426] text-slate-300 shadow-lg shadow-black/10 transition hover:bg-white/5"
              aria-label="Back to profile"
            >
              <ArrowLeft
                size={18}
                aria-hidden="true"
              />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400/80">
                Account protection
              </p>

              <h1 className="mt-0.5 text-[20px] font-extrabold tracking-tight text-white">
                Security
              </h1>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Manage your account and wallet security.
              </p>
            </div>
          </header>

          {/* Security hero */}
          <section className="mt-5 overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] shadow-xl shadow-black/10">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck
                    size={21}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                    Security centre
                  </p>

                  <h2 className="mt-1 text-[16px] font-extrabold text-white">
                    Account Security
                  </h2>

                  <p className="mt-1.5 text-[10px] leading-5 text-slate-400">
                    Keep your account protected with strong
                    authentication and wallet security
                    controls.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Wallet PIN */}
          <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                <LockKeyhole
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
                      Your 6-digit PIN protects withdrawals
                      and other sensitive wallet operations.
                    </p>
                  </div>

                  {pinStatus === "configured" && (
                    <div className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold text-emerald-400">
                      <CheckCircle2
                        size={11}
                        aria-hidden="true"
                      />
                      Active
                    </div>
                  )}
                </div>

                {pinStatus === "checking" && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                    <RefreshCw
                      size={14}
                      className="animate-spin text-purple-300"
                      aria-hidden="true"
                    />
                    Checking PIN status...
                  </div>
                )}

                {pinStatus === "error" && (
                  <div className="mt-4 rounded-2xl border border-red-400/15 bg-red-400/5 p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={15}
                        className="mt-0.5 shrink-0 text-red-400"
                        aria-hidden="true"
                      />

                      <p className="text-[10px] leading-5 text-red-300">
                        {pinStatusError}
                      </p>
                    </div>
                  </div>
                )}

                {pinStatus === "not_configured" && (
                  <div className="mt-4">
                    <div className="mb-3 rounded-2xl border border-amber-400/15 bg-amber-400/5 p-3">
                      <p className="text-[10px] leading-5 text-amber-300">
                        You have not configured a wallet PIN
                        yet. Set one before making protected
                        wallet operations.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openSetPIN}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-[10px] font-bold text-[#03110B] transition hover:bg-emerald-400"
                    >
                      <LockKeyhole
                        size={14}
                        aria-hidden="true"
                      />
                      Set Wallet PIN
                    </button>
                  </div>
                )}

                {pinStatus === "configured" && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={openChangePIN}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-[10px] font-bold text-slate-200 transition hover:bg-white/10"
                    >
                      <Key
                        size={14}
                        aria-hidden="true"
                      />
                      Change Wallet PIN
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>


{/* Login Security */}
<section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
      <Key
        size={19}
        aria-hidden="true"
      />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
        Login security
      </p>

      <h2 className="mt-1 text-[15px] font-extrabold text-white">
        Password
      </h2>

      <p className="mt-1 text-[10px] leading-5 text-slate-400">
        Reset your account password securely using
        your registered email address.
      </p>

      <button
        type="button"
        onClick={() => router.push("/forgot-password")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-[10px] font-bold text-slate-200 transition hover:bg-white/10"
      >
        <Key
          size={14}
          aria-hidden="true"
        />
        Reset Password
      </button>
    </div>
  </div>
</section>


          {/* Security information */}
          <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-slate-500"
                aria-hidden="true"
              />

              <div>
                <p className="text-[11px] font-bold text-slate-200">
                  Security reminder
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  Never share your wallet PIN, password,
                  reset links, or verification codes with
                  anyone. REDIQ support will never ask
                  you for your PIN.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <WithdrawalPINManager
        mode={pinModalMode}
        open={pinModalOpen}
        submitting={pinSubmitting}
        error={pinError}
        onClose={closePINModal}
        onSetPIN={handleSetPIN}
        onChangePIN={handleChangePIN}
        onForgotPIN={handleForgotPIN}
      />
    </div>
  );
}


