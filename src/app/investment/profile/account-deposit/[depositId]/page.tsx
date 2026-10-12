
"use client";

import {
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Copy,
  RefreshCw,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { useSettings } from "@/src/context/useSettings";
import { investmentApi } from "@/src/lib/api/investmentApi";
import { formatUSDT } from "@/src/lib/utils/currency";

import type {
  AccountDeposit,
} from "@/src/lib/types/investment";

function StatusBadge({
  status,
}: {
  status: AccountDeposit["status"];
}) {
  const styles: Record<
    AccountDeposit["status"],
    string
  > = {
    CONFIRMED:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    FAILED:
      "border-red-400/20 bg-red-400/10 text-red-300",
    EXPIRED:
      "border-red-400/20 bg-red-400/10 text-red-300",
    UNMATCHED:
      "border-red-400/20 bg-red-400/10 text-red-300",
    VERIFYING:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
    PENDING:
      "border-white/10 bg-white/5 text-slate-300",
  };

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-extrabold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.07] bg-[#07101F] p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 truncate text-xs font-extrabold text-white sm:text-sm">
        {value}
      </p>
    </div>
  );
}

export default function AccountDepositDetailPage() {
  const router = useRouter();
  const { currency } = useSettings();

  const params = useParams<{
    depositId?: string | string[];
  }>();

  const depositId =
    typeof params.depositId === "string"
      ? params.depositId.trim()
      : Array.isArray(params.depositId)
        ? params.depositId[0]?.trim() ?? ""
        : "";

  const submitLock = useRef(false);
  const verifyLock = useRef(false);
  const refreshLock = useRef(false);

  const [deposit, setDeposit] =
    useState<AccountDeposit | null>(null);

  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const loadDeposit = useCallback(
    async (showLoading = false) => {
      if (!depositId) {
        setError("Invalid deposit ID.");
        setLoading(false);
        return;
      }

      if (showLoading) setLoading(true);

      try {
        const result =
          await investmentApi.getAccountDeposit(depositId);

        setDeposit(result);

        if (result.txHash) {
          setTxHash(result.txHash);
        }

        setError("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load deposit details.",
        );
      } finally {
        setLoading(false);
      }
    },
    [depositId],
  );

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (!depositId) {
        setError("Invalid deposit ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setDeposit(null);

      try {
        const result =
          await investmentApi.getAccountDeposit(depositId);

        if (cancelled) return;

        setDeposit(result);
        setTxHash(result.txHash || "");
        setError("");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load deposit details.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [depositId]);

  const refreshDeposit = async () => {
    if (refreshLock.current || !depositId) return;

    refreshLock.current = true;
    setRefreshing(true);
    setError("");

    try {
      const result =
        await investmentApi.getAccountDeposit(depositId);

      setDeposit(result);

      if (result.txHash) {
        setTxHash(result.txHash);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh deposit.",
      );
    } finally {
      refreshLock.current = false;
      setRefreshing(false);
    }
  };

  const submitTransaction = async () => {
    if (submitLock.current || !deposit?.id) return;

    const cleanTxHash = txHash.trim();

    if (!cleanTxHash) {
      setError("Enter the transaction hash.");
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    setError("");

    try {
      const result =
        await investmentApi.submitAccountDeposit(
          deposit.id,
          cleanTxHash,
        );

      setDeposit(result);
      setTxHash(result.txHash || cleanTxHash);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit transaction.",
      );
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  };

  const verifyDeposit = async () => {
    if (verifyLock.current || !deposit?.id) return;

    verifyLock.current = true;
    setVerifying(true);
    setError("");

    try {
      const result =
        await investmentApi.verifyAccountDeposit(
          deposit.id,
        );

      setDeposit(result);

      if (result.txHash) {
        setTxHash(result.txHash);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to check deposit status.",
      );
    } finally {
      verifyLock.current = false;
      setVerifying(false);
    }
  };

  const copyAddress = async () => {
    if (!deposit?.companyDepositAddress) return;

    try {
      await navigator.clipboard.writeText(
        deposit.companyDepositAddress,
      );

      setCopied(true);

      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy the deposit address.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050B18] px-4 py-7 text-white">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-12 w-44 rounded-xl bg-white/10" />
          <div className="h-44 rounded-[22px] bg-[#0B1426]" />
          <div className="h-36 rounded-[22px] bg-[#0B1426]" />
        </div>
      </main>
    );
  }

  if (!deposit) {
    return (
      <main className="min-h-screen bg-[#050B18] px-4 py-6 text-white">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/investment/profile/account-deposit",
              )
            }
            className="flex items-center gap-2 text-xs text-slate-300"
          >
            <ArrowLeft size={16} />
            Back to deposits
          </button>

          <section className="mt-6 rounded-[22px] border border-red-400/20 bg-[#0B1426] p-5">
            <XCircle
              size={25}
              className="text-red-400"
            />

            <h1 className="mt-3 text-base font-extrabold">
              Deposit unavailable
            </h1>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              {error || "This deposit could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() => void loadDeposit(true)}
              disabled={!depositId}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-3 text-xs font-bold disabled:opacity-40"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </section>
        </div>
      </main>
    );
  }

  const isTerminal = [
    "CONFIRMED",
    "FAILED",
    "EXPIRED",
    "UNMATCHED",
  ].includes(deposit.status);

  const canSubmit =
    deposit.status === "PENDING" &&
    !deposit.txHash;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B18] px-3 pb-28 pt-5 text-white min-[375px]:px-4 sm:px-6 sm:pt-7">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        {/* HEADER */}
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/investment/profile/account-deposit",
              )
            }
            aria-label="Back to deposits"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-slate-300"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#FF476B]">
              REDIQ Wallet
            </p>

            <h1 className="mt-0.5 truncate text-lg font-black sm:text-xl">
              Deposit details
            </h1>
          </div>

          <button
            type="button"
            onClick={() => void refreshDeposit()}
            disabled={refreshing}
            aria-label="Refresh deposit"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-slate-300 disabled:opacity-40"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3.5 text-xs leading-5 text-red-300"
          >
            <CircleAlert
              size={16}
              className="mt-0.5 shrink-0"
            />
            {error}
          </div>
        )}

        {/* AMOUNT HERO */}
        <section className="relative overflow-hidden rounded-[22px] border border-[#E60033]/15 bg-linear-to-br from-[#142039] via-[#0B1426] to-[#10101F] p-4 sm:p-5">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#E60033]/12 blur-3xl" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[#FF476B]">
                <ArrowDownToLine size={16} />
                <span className="text-[9px] font-extrabold uppercase tracking-wider">
                  Account deposit
                </span>
              </div>

              <p className="mt-5 text-[10px] text-slate-400">
                Expected amount
              </p>

              <h2 className="mt-1 wrap-break-words text-2xl font-black tracking-tight sm:text-3xl">
                {formatUSDT(
                  deposit.expectedAmount,
                  currency,
                )}
              </h2>
            </div>

            <StatusBadge status={deposit.status} />
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-2.5">
            <DetailStat
              label="Received"
              value={formatUSDT(
                deposit.receivedAmount,
                currency,
              )}
            />

            <DetailStat
              label="Confirmations"
              value={`${deposit.confirmations}/${deposit.requiredConfirmations}`}
            />
          </div>

          <div className="relative mt-4 flex justify-between border-t border-white/10 pt-3 text-[10px]">
            <span className="text-slate-500">
              Network
            </span>

            <span className="font-extrabold text-slate-200">
              TRON / TRC20
            </span>
          </div>
        </section>

        {/* STATUS */}
        <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                deposit.status === "CONFIRMED"
                  ? "bg-emerald-400/10 text-emerald-300"
                  : ["FAILED", "EXPIRED", "UNMATCHED"].includes(
                        deposit.status,
                      )
                    ? "bg-red-400/10 text-red-300"
                    : "bg-[#E60033]/10 text-[#FF476B]"
              }`}
            >
              {deposit.status === "CONFIRMED" ? (
                <CheckCircle2 size={20} />
              ) : ["FAILED", "EXPIRED", "UNMATCHED"].includes(
                  deposit.status,
                ) ? (
                <XCircle size={20} />
              ) : (
                <RefreshCw size={19} />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Current status
              </p>

              <h2 className="mt-1 text-sm font-extrabold">
                {deposit.status === "CONFIRMED"
                  ? "Deposit successful"
                  : deposit.status === "VERIFYING"
                    ? "Verification in progress"
                    : deposit.status === "PENDING"
                      ? "Deposit pending"
                      : `Deposit ${deposit.status.toLowerCase()}`}
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                {deposit.status === "CONFIRMED"
                  ? "Your deposit has been confirmed and credited to your available balance."
                  : deposit.status === "VERIFYING"
                    ? "Your transaction is being checked on the TRON network."
                    : deposit.status === "PENDING"
                      ? "Send the requested USDT and submit your transaction hash."
                      : deposit.failureReason ||
                        "Review the transaction information below."}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-[#07101F] p-3">
            <p className="text-[9px] text-slate-500">
              Deposit ID
            </p>

            <p className="mt-1 break-all font-mono text-[10px] text-slate-300">
              {deposit.id}
            </p>
          </div>
        </section>

        {/* DESTINATION */}
        {!isTerminal && (
          <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <Wallet
                size={18}
                className="text-[#FF476B]"
              />

              <h2 className="text-sm font-extrabold">
                Deposit destination
              </h2>
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#07101F] p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                TRON wallet address
              </p>

              <p className="mt-2 break-all font-mono text-[11px] leading-5 text-slate-200">
                {deposit.companyDepositAddress}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void copyAddress()}
              disabled={!deposit.companyDepositAddress}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E60033]/25 bg-[#E60033]/10 px-4 py-3 text-xs font-extrabold text-[#FF8199] disabled:opacity-40"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={15} />
                  Address copied
                </>
              ) : (
                <>
                  <Copy size={15} />
                  Copy deposit address
                </>
              )}
            </button>

            <p className="mt-3 text-[10px] leading-4 text-amber-200/75">
              Send only USDT using TRON/TRC20.
            </p>
          </section>
        )}

        {/* HASH SUBMISSION */}
        {canSubmit && (
          <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <ShieldCheck
                size={18}
                className="text-[#FF476B]"
              />

              <h2 className="text-sm font-extrabold">
                Submit transaction
              </h2>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              After sending USDT, paste your TRON transaction
              hash below.
            </p>

            <label
              htmlFor="detail-tx-hash"
              className="mt-4 block text-xs font-bold"
            >
              Transaction hash
            </label>

            <input
              id="detail-tx-hash"
              type="text"
              value={txHash}
              onChange={(event) =>
                setTxHash(event.target.value)
              }
              placeholder="Paste transaction hash"
              autoComplete="off"
              spellCheck={false}
              disabled={submitting}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#07101F] px-3 font-mono text-[11px] outline-none placeholder:text-slate-600 focus:border-[#FF476B]/50"
            />

            <button
              type="button"
              onClick={() => void submitTransaction()}
              disabled={submitting || !txHash.trim()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-3.5 text-xs font-extrabold disabled:opacity-40"
            >
              {submitting && (
                <RefreshCw
                  size={15}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Submitting..."
                : "Submit transaction"}
            </button>
          </section>
        )}

        {/* VERIFICATION */}
        {deposit.status === "VERIFYING" && (
          <section className="rounded-[22px] border border-amber-400/15 bg-amber-400/5 p-4 sm:p-5">
            <h2 className="text-sm font-extrabold text-amber-200">
              Verification in progress
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-amber-200/70">
              Your transaction is being checked for the
              required confirmations.
            </p>

            <button
              type="button"
              onClick={() => void verifyDeposit()}
              disabled={verifying}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs font-extrabold text-amber-200 disabled:opacity-40"
            >
              <RefreshCw
                size={15}
                className={verifying ? "animate-spin" : ""}
              />

              {verifying
                ? "Checking..."
                : "Check deposit status"}
            </button>
          </section>
        )}

        {/* CONFIRMED */}
        {deposit.status === "CONFIRMED" && (
          <section className="flex items-start gap-3 rounded-[22px] border border-emerald-400/15 bg-emerald-400/5 p-4 sm:p-5">
            <CheckCircle2
              size={21}
              className="shrink-0 text-emerald-300"
            />

            <div>
              <h2 className="text-sm font-extrabold text-emerald-200">
                Deposit confirmed
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-emerald-200/75">
                {formatUSDT(
                  deposit.receivedAmount,
                  currency,
                )}{" "}
                has been credited to your available balance.
              </p>
            </div>
          </section>
        )}

        {/* TRANSACTION REFERENCE */}
        {deposit.txHash && (
          <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <ShieldCheck
                size={18}
                className="text-[#FF476B]"
              />

              <h2 className="text-sm font-extrabold">
                Transaction reference
              </h2>
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#07101F] p-3.5">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                Transaction hash
              </p>

              <p className="mt-2 break-all font-mono text-[10px] leading-5 text-slate-300">
                {deposit.txHash}
              </p>
            </div>

            {deposit.senderAddress && (
              <div className="mt-3 rounded-xl border border-white/[0.07] bg-[#07101F] p-3.5">
                <p className="text-[9px] uppercase tracking-wider text-slate-500">
                  Sender address
                </p>

                <p className="mt-2 break-all font-mono text-[10px] leading-5 text-slate-300">
                  {deposit.senderAddress}
                </p>
              </div>
            )}
          </section>
        )}

        <p className="px-1 text-center text-[10px] leading-4 text-slate-500">
          Confirmed deposits are credited to your available
          balance. They do not automatically create an
          investment.
        </p>
      </div>
    </main>
  );
}