
// /investment/invest/StepPaymentDetails/page.tsx

"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useTranslation } from "../../../../i18n/translations";
import { useSettings } from "@/src/context/useSettings";
import { formatUSDT } from "@/src/lib/utils/currency";
import { investmentApi } from "@/src/lib/api/investmentApi";

import type {
  Deposit,
} from "@/src/lib/types/investment";

interface StepPaymentDetailsProps {
  depositAddress: string;
  amount: number;
  onSubmit: (
    txHash: string,
    proofUrl?: string,
  ) => void;
  onBack: () => void;
  submitting: boolean;
  error?: string;
  existingDeposit?: Deposit | null;
}

function formatDepositDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function getDepositStatusClass(
  status: Deposit["status"],
): string {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-400/15 bg-emerald-400/10 text-emerald-300";

    case "VERIFYING":
      return "border-sky-400/15 bg-sky-400/10 text-sky-300";

    case "FAILED":
    case "EXPIRED":
    case "UNMATCHED":
      return "border-red-400/15 bg-red-400/10 text-red-300";

    default:
      return "border-[#F7C948]/15 bg-[#F7C948]/10 text-[#F7C948]";
  }
}

export default function StepPaymentDetails({
  depositAddress,
  amount,
  onSubmit,
  onBack,
  submitting,
  error,
  existingDeposit,
}: StepPaymentDetailsProps) {
  const router = useRouter();

  const [depositHistory, setDepositHistory] =
    useState<Deposit[]>([]);

  const [historyLoading, setHistoryLoading] =
    useState(true);

  const [historyError, setHistoryError] =
    useState("");

  const { t } = useTranslation();
  const { currency } = useSettings();

  const [txHash, setTxHash] =
    useState("");

  const [proofUrl, setProofUrl] =
    useState(
      existingDeposit?.proofUrl ?? "",
    );

  const [copied, setCopied] =
    useState(false);

  const loadDepositHistory =
    useCallback(async () => {
      try {
        setHistoryLoading(true);
        setHistoryError("");

        const response =
          await investmentApi.getDeposits(
            1,
            10,
          );

        setDepositHistory(
          Array.isArray(response.deposits)
            ? response.deposits
            : [],
        );
      } catch (err) {
        console.error(
          "Failed to load deposit history:",
          err,
        );

        setHistoryError(
          "Unable to load deposit history.",
        );
      } finally {
        setHistoryLoading(false);
      }
    }, []);

  useEffect(() => {
    let cancelled = false;

    const task = queueMicrotask(() => {
      if (!cancelled) {
        void loadDepositHistory();
      }
    });

    void task;

    return () => {
      cancelled = true;
    };
  }, [loadDepositHistory]);

  const handleCopy = async () => {
    if (!depositAddress) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        depositAddress,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard API unavailable.
    }
  };

  const handleSubmit = () => {
    const trimmedTxHash =
      txHash.trim();

    if (!trimmedTxHash) {
      return;
    }

    onSubmit(
      trimmedTxHash,
      proofUrl.trim() || undefined,
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
          {t("payment.title")}
        </p>

        <h2 className="mt-1 text-xl font-black tracking-tight text-white">
          {existingDeposit
            ? "Complete your investment deposit"
            : "Complete your payment"}
        </h2>

        <p className="mt-1 text-xs leading-5 text-white/35">
          Send the exact amount and submit
          the transaction hash for verification.
        </p>
      </div>

      {existingDeposit && (
        <div className="rounded-[22px] border border-[#F7C948]/15 bg-[#F7C948]/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-[#F7C948]">
              Continue your pending investment
            </p>

            <span
              className={`rounded-full border px-2.5 py-1 text-[9px] font-black ${getDepositStatusClass(
                existingDeposit.status,
              )}`}
            >
              {existingDeposit.status}
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-white/45">
            This investment was already
            created. Complete the deposit
            below to continue it.
          </p>

          {existingDeposit.txHash && (
            <p className="mt-2 text-[10px] leading-4 text-[#F7C948]/70">
              A transaction hash was previously
              submitted. Enter the transaction
              hash for the payment you actually
              sent.
            </p>
          )}
        </div>
      )}

      {/* Send payment */}
      <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0B1426] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/8 blur-3xl"
        />

        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
            {t("payment.step_1")}
          </p>

          <div className="mt-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
            <p className="text-xs font-semibold text-white/40">
              {t("payment.amount_to_send")}
            </p>

            <p className="mt-1 text-3xl font-black tracking-tight text-emerald-300">
              {formatUSDT(
                amount,
                currency,
              )}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold text-white/70">
              {t("payment.network")}
            </p>

            <div className="mt-2 inline-flex rounded-full border border-violet-400/15 bg-violet-400/8 px-3 py-1.5">
              <span className="text-[10px] font-black text-violet-300">
                TRON (TRC-20)
              </span>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold text-white/70">
              {t("payment.deposit_address")}
            </p>

            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/8 bg-[#07101F] p-3">
              <code className="min-w-0 flex-1 break-all font-mono text-[10px] leading-5 text-white/65">
                {depositAddress || "Deposit address unavailable"}
              </code>

              <button
                type="button"
                onClick={handleCopy}
                disabled={!depositAddress}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={t(
                  "payment.copy_address",
                )}
              >
                {copied ? (
                  <CheckCircle2
                    size={16}
                    className="text-emerald-300"
                  />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {copied && (
              <p
                className="mt-2 text-[10px] font-semibold text-emerald-300"
                aria-live="polite"
              >
                Address copied.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Transaction submission */}
      <section className="rounded-3xl border border-white/8 bg-[#0B1426] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
          {t("payment.step_2")}
        </p>

        <label className="mt-4 block text-xs font-bold text-white/70">
          {t("payment.tx_hash_label")}
        </label>

        <input
          type="text"
          value={txHash}
          onChange={(event) =>
            setTxHash(event.target.value)
          }
          placeholder={t(
            "payment.tx_hash_placeholder",
          )}
          className="mt-2 w-full rounded-2xl border border-white/8 bg-[#07101F] px-4 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
        />

        <label className="mt-4 block text-xs font-bold text-white/70">
          {t("payment.proof_url_label")}{" "}
          <span className="font-medium text-white/25">
            ({t("payment.optional")})
          </span>
        </label>

        <input
          type="url"
          value={proofUrl}
          onChange={(event) =>
            setProofUrl(event.target.value)
          }
          placeholder={t(
            "payment.proof_url_placeholder",
          )}
          className="mt-2 w-full rounded-2xl border border-white/8 bg-[#07101F] px-4 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
        />
      </section>

      {error && (
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-4 text-xs leading-5 text-red-300">
          {error}
        </div>
      )}

      {/* Navigation - intentionally before deposit history */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0B1426] py-4 text-sm font-bold text-white/55 transition hover:bg-[#0D182C] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={18} />
          {t("invest.back")}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !txHash.trim() ||
            submitting
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-400 py-4 text-sm font-black text-[#03130C] shadow-[0_15px_35px_-15px_rgba(52,211,153,0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting
            ? t("payment.submitting")
            : existingDeposit
              ? "Continue deposit"
              : t("payment.submit")}

          {!submitting && (
            <ArrowRight size={18} />
          )}
        </button>
      </div>

      {/* Deposit history - intentionally last on the page */}
      <section className="rounded-3xl border border-white/8 bg-[#0B1426] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-white">
              Deposit history
            </h3>

            <p className="mt-1 text-xs text-white/30">
              View your previous investment
              deposits.
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
            <ExternalLink
              size={14}
              className="text-white/35"
            />
          </div>
        </div>

        <div className="mt-4">
          {historyLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2
                size={20}
                className="animate-spin text-emerald-300"
              />
            </div>
          ) : historyError ? (
            <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-4">
              <p className="text-xs text-red-300">
                {historyError}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadDepositHistory()
                }
                className="mt-2 text-xs font-bold text-red-300 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          ) : depositHistory.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#07101F] px-4 py-8 text-center">
              <p className="text-sm font-bold text-white/60">
                No deposits yet
              </p>

              <p className="mt-1 text-xs text-white/25">
                Your investment deposits will
                appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {depositHistory.map(
                (deposit) => (
                  <button
                    key={deposit.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/investment/profile/deposit/${deposit.id}`,
                      )
                    }
                    className="group flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-[#07101F] p-3 text-left transition hover:border-emerald-400/15 hover:bg-[#0D182C] active:scale-[0.99]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-xs font-bold text-white/75">
                          Deposit #
                          {deposit.id.slice(
                            0,
                            8,
                          )}
                        </p>

                        <span
                          className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-black ${getDepositStatusClass(
                            deposit.status,
                          )}`}
                        >
                          {deposit.status}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-xs text-white/30">
                          {formatDepositDate(
                            deposit.createdAt,
                          )}
                        </p>

                        <p className="text-sm font-black text-white">
                          {formatUSDT(
                            deposit.expectedAmount,
                            currency,
                          )}
                        </p>
                      </div>

                      {deposit.txHash && (
                        <p className="mt-1 truncate font-mono text-[9px] text-white/20">
                          {deposit.txHash}
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      size={16}
                      className="shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-emerald-300"
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

