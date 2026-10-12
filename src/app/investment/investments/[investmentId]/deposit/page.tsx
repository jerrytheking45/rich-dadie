
//src/app/investment/investments/[investmentId]/deposit/page.tsx


"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  History,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

import { investmentApi } from "@/src/lib/api/investmentApi";
import { useSettings } from "@/src/context/useSettings";
import { formatUSDT } from "@/src/lib/utils/currency";
import type { Deposit, Investment } from "@/src/lib/types/investment";

const SUBMISSION_COOLDOWN_SECONDS = 60;
const STATUS_REFRESH_INTERVAL = 5000;

function getSubmissionError(err: unknown): string {
  const responseData =
    err && typeof err === "object" && "response" in err
      ? (
          err as {
            response?: {
              data?: {
                error?: unknown;
                message?: unknown;
                detail?: unknown;
              };
            };
          }
        ).response?.data
      : undefined;

  const backendMessage =
    typeof responseData?.error === "string"
      ? responseData.error
      : typeof responseData?.message === "string"
        ? responseData.message
        : typeof responseData?.detail === "string"
          ? responseData.detail
          : "";

  const message =
    backendMessage ||
    (err instanceof Error && err.message
      ? err.message
      : "Failed to submit the transaction hash.");

  const normalized = message.toLowerCase();

  if (
    normalized.includes("idx_investment_deposits_network_tx_hash_unique") ||
    normalized.includes("duplicate key value") ||
    normalized.includes("transaction hash already used") ||
    normalized.includes("transaction hash has already been used")
  ) {
    return "This transaction hash has already been submitted. Each transaction hash can only be used once. Please verify the transaction ID.";
  }

  if (
    normalized.includes("sqlstate") ||
    normalized.includes("duplicate key") ||
    normalized.includes("update pending investment deposit:")
  ) {
    return "We could not submit this transaction. Please verify the transaction hash and try again.";
  }

  if (
    normalized.includes("invalid transaction hash") ||
    normalized.includes("invalid tx hash")
  ) {
    return "This transaction hash appears to be invalid. Please check it and try again.";
  }

  return message;
}

export default function InvestmentDepositPage() {
  const router = useRouter();
  const { investmentId } = useParams<{ investmentId: string }>();
  const { currency } = useSettings();

  const [investment, setInvestment] = useState<Investment | null>(null);
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [history, setHistory] = useState<Deposit[]>([]);

  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addressCopied, setAddressCopied] = useState(false);

  const copyTimerRef = useRef<number | null>(null);
  const cooldownUntilRef = useRef<number>(0);
  const submissionLockRef = useRef(false);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
  if (cooldownSeconds <= 0) {
    return;
  }

  const timer = window.setInterval(() => {
    const remaining = Math.max(
      0,
      Math.ceil(
        (cooldownUntilRef.current - Date.now()) / 1000,
      ),
    );

    setCooldownSeconds(remaining);
  }, 1000);

  return () => {
    window.clearInterval(timer);
  };
}, [cooldownSeconds]);

  useEffect(() => {
  if (!investmentId) {
    return;
  }

  let cancelled = false;

  async function load() {
    try {
      const [
        investmentData,
        depositData,
        depositsData,
      ] = await Promise.all([
        investmentApi.getInvestment(investmentId),
        investmentApi.getDeposit(investmentId),
        investmentApi.getDeposits(1, 50),
      ]);

      if (cancelled) {
        return;
      }

      setInvestment(investmentData);
      setDeposit(depositData);

      setHistory(
        depositsData.deposits.filter(
          (item) => item.investmentId === investmentId,
        ),
      );

      setTxHash(
        (current) =>
          current || depositData.txHash || "",
      );

      setError("");
    } catch (err) {
      if (cancelled) {
        return;
      }

      console.error(
        "Failed to load investment deposit:",
        err,
      );

      setInvestment(null);
      setDeposit(null);

      setError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to load investment deposit.",
      );
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  void load();

  return () => {
    cancelled = true;
  };
}, [investmentId]);

  useEffect(() => {
    if (!investmentId) return;

    let cancelled = false;
    let inFlight = false;

    async function refreshStatus() {
      if (inFlight) return;
      inFlight = true;

      try {
        const [investmentData, depositData] = await Promise.all([
          investmentApi.getInvestment(investmentId),
          investmentApi.getDeposit(investmentId),
        ]);

        if (cancelled) return;

        setInvestment(investmentData);
        setDeposit(depositData);
        setTxHash((current) => current || depositData.txHash || "");
      } catch (err) {
        console.error("Silent deposit status refresh failed:", err);
      } finally {
        inFlight = false;
      }
    }

    const timer = window.setInterval(() => {
      void refreshStatus();
    }, STATUS_REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [investmentId]);

  const refreshAll = useCallback(async () => {
    if (!investmentId || refreshing) return;

    setRefreshing(true);

    try {
      const [investmentData, depositData, depositsData] =
        await Promise.all([
          investmentApi.getInvestment(investmentId),
          investmentApi.getDeposit(investmentId),
          investmentApi.getDeposits(1, 50),
        ]);

      setInvestment(investmentData);
      setDeposit(depositData);
      setHistory(
        depositsData.deposits.filter(
          (item) => item.investmentId === investmentId,
        ),
      );
      setError("");
    } catch (err) {
      console.error("Deposit refresh failed:", err);
      setError("Could not refresh deposit information. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, [investmentId, refreshing]);

  const copyAddress = async () => {
    const address = deposit?.companyDepositAddress?.trim();

    if (!address) {
      setError("The deposit address is unavailable.");
      return;
    }

    try {
      await navigator.clipboard.writeText(address);

      setAddressCopied(true);
      setError("");

      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = window.setTimeout(() => {
        setAddressCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Address copy failed:", err);
      setAddressCopied(false);
      setError("Unable to copy the deposit address.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !investmentId ||
      submissionLockRef.current ||
      cooldownUntilRef.current > Date.now()
    ) {
      return;
    }

    const normalizedTxHash = txHash.trim();

    if (!normalizedTxHash) {
      setError("Enter the transaction hash.");
      return;
    }

    submissionLockRef.current = true;
    setSubmitting(true);
    setError("");
    setSuccess("");

    let accepted = false;

    try {
      const updatedDeposit = await investmentApi.submitDeposit(
        investmentId,
        normalizedTxHash,
      );

      accepted = true;
      setDeposit(updatedDeposit);
      setTxHash(normalizedTxHash);

      cooldownUntilRef.current =
        Date.now() + SUBMISSION_COOLDOWN_SECONDS * 1000;
      setCooldownSeconds(SUBMISSION_COOLDOWN_SECONDS);

      setSuccess(
        "Your transaction hash was accepted for verification. This does not mean the deposit has been confirmed yet.",
      );
    } catch (err) {
      console.error("Deposit submission failed:", err);
      setError(getSubmissionError(err));
    } finally {
      submissionLockRef.current = false;
      setSubmitting(false);
    }

    if (!accepted) return;

    // These refreshes must not reverse a successful submission.
    try {
      const updatedInvestment = await investmentApi.getInvestment(
        investmentId,
      );
      setInvestment(updatedInvestment);
    } catch (err) {
      console.error("Post-submission investment refresh failed:", err);
    }

    try {
      const depositsData = await investmentApi.getDeposits(1, 50);

      setHistory(
        depositsData.deposits.filter(
          (item) => item.investmentId === investmentId,
        ),
      );
    } catch (err) {
      console.error("Post-submission history refresh failed:", err);
    }
  };

  if (!investmentId) {
    return (
      <PageShell>
        <ErrorState
          message="Invalid investment ID."
          onBack={() => router.push("/investment/investments")}
        />
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[65vh] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={27}
              className="mx-auto animate-spin text-[#FF476B]"
            />
            <p className="mt-3 text-xs text-white/45">
              Loading investment deposit...
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!investment || !deposit) {
    return (
      <PageShell>
        <ErrorState
          message={error || "Investment deposit could not be found."}
          onBack={() =>
            router.push(`/investment/investments/${investmentId}`)
          }
        />
      </PageShell>
    );
  }

  const isCompleted =
    deposit.status === "CONFIRMED" ||
    investment.status === "ACTIVE" ||
    investment.status === "MATURED";

  const submissionLocked = submitting || cooldownSeconds > 0;
  const canSubmit = !isCompleted && !submissionLocked;

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-5xl">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(`/investment/investments/${investmentId}`)
              }
              aria-label="Back to investment"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/70"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
                Investment Deposit
              </p>
              <h1 className="truncate text-lg font-black sm:text-xl">
                Complete Deposit
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refreshAll()}
            disabled={refreshing}
            aria-label="Refresh deposit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 disabled:opacity-40"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </header>

        {/* INVESTMENT SUMMARY */}
        <section className="relative mt-5 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#25101E] via-[#101827] to-[#0B1426] p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#FF476B]">
                Investment
              </p>
              <h2 className="mt-1 wrap-break-words text-lg font-black">
                {investment.planName || "Investment Plan"}
              </h2>
              <p className="mt-1 break-all text-[9px] text-white/40">
                {investment.id}
              </p>
            </div>

            <StatusBadge status={deposit.status} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Metric
              label="Investment amount"
              value={formatUSDT(investment.amount, currency)}
            />
            <Metric
              label="Expected deposit"
              value={formatUSDT(deposit.expectedAmount, currency)}
            />
          </div>
        </section>

        {/* MESSAGES */}
        {success && (
          <div
            role="status"
            className="mt-4 flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4"
          >
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
            <p className="text-[11px] leading-5 text-emerald-200">
              {success}
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 flex gap-3 rounded-xl border border-[#E60033]/25 bg-[#E60033]/10 p-4"
          >
            <XCircle
              size={18}
              className="mt-0.5 shrink-0 text-[#FF476B]"
            />
            <p className="wrap-break-words text-[11px] leading-5 text-[#FF9AAF]">
              {error}
            </p>
          </div>
        )}

        {isCompleted ? (
          <section className="mt-4 rounded-[22px] border border-emerald-400/20 bg-[#0B1426] p-5">
            <div className="flex gap-3">
              <CheckCircle2
                size={23}
                className="shrink-0 text-emerald-300"
              />
              <div>
                <h2 className="text-sm font-black text-emerald-200">
                  Investment deposit completed
                </h2>
                <p className="mt-1 text-[11px] leading-5 text-white/50">
                  This investment is recorded as active, matured, or
                  its deposit is confirmed. No further transaction
                  submission is required here.
                </p>
              </div>
            </div>

            {deposit.txHash && (
              <div className="mt-4 rounded-xl bg-[#07101F] p-3">
                <p className="text-[9px] text-white/40">
                  Recorded transaction hash
                </p>
                <p className="mt-1 break-all font-mono text-[10px] text-white/75">
                  {deposit.txHash}
                </p>
              </div>
            )}
          </section>
        ) : (
          <div className="mt-4 grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2">
            {/* DEPOSIT INSTRUCTIONS */}
            <section className="min-w-0 rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                  <Wallet size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-black">
                    Deposit Instructions
                  </h2>
                  <p className="text-[10px] text-white/45">
                    USDT on the TRON network (TRC20)
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-[#07101F] p-3">
                <p className="text-[9px] font-extrabold uppercase tracking-wide text-white/45">
                  Expected deposit amount
                </p>
                <p className="mt-1 wrap-break-words text-xl font-black">
                  {formatUSDT(deposit.expectedAmount, currency)}
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-[#07101F] p-3">
                <p className="text-[9px] font-extrabold uppercase tracking-wide text-white/45">
                  Company TRON deposit address
                </p>

                <p className="mt-2 break-all font-mono text-[11px] font-bold leading-5 text-white/85">
                  {deposit.companyDepositAddress || "Unavailable"}
                </p>

                <button
                  type="button"
                  onClick={() => void copyAddress()}
                  disabled={!deposit.companyDepositAddress?.trim()}
                  className={`mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-3 text-xs font-extrabold transition disabled:opacity-40 ${
                    addressCopied
                      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {addressCopied ? (
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
              </div>

              <div className="mt-3 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-300"
                />
                <p className="text-[10px] leading-5 text-white/60">
                  Send only TRC20 USDT to the displayed address.
                  Confirm the network, destination, and required
                  amount before sending. Transfers on the wrong
                  network may be unrecoverable.
                </p>
              </div>
            </section>

            {/* SUBMISSION */}
            <section className="min-w-0 rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-black">
                    Submit Transaction Hash
                  </h2>
                  <p className="text-[10px] text-white/45">
                    Provide your TRON transaction ID for verification.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-5">
                <label
                  htmlFor="tx-hash"
                  className="text-[11px] font-bold text-white/75"
                >
                  TRON transaction hash
                </label>

                <textarea
                  id="tx-hash"
                  rows={3}
                  value={txHash}
                  onChange={(event) => setTxHash(event.target.value)}
                  placeholder="Paste your transaction hash here"
                  disabled={submissionLocked}
                  spellCheck={false}
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#07101F] px-3 py-3 font-mono text-[11px] text-white outline-none placeholder:font-sans placeholder:text-white/30 focus:border-[#E60033]/50 focus:ring-2 focus:ring-[#E60033]/10 disabled:opacity-50"
                />

                <p className="mt-2 text-[10px] leading-5 text-white/45">
                  Submitting a hash requests verification; it does not
                  automatically confirm the deposit.
                </p>

                <button
                  type="submit"
                  disabled={!canSubmit || !txHash.trim()}
                  className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 text-xs font-extrabold text-white transition hover:bg-[#FF174B] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : cooldownSeconds > 0 ? (
                    <>
                      <Clock3 size={16} />
                      Please wait {cooldownSeconds}s
                    </>
                  ) : (
                    <>
                      Submit Transaction
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {cooldownSeconds > 0 && (
                <p className="mt-3 rounded-xl border border-white/10 bg-[#07101F] p-3 text-center text-[10px] leading-5 text-white/55">
                  Your submission was accepted. You may submit again
                  after {cooldownSeconds} seconds if further correction
                  is needed and the backend permits it.
                </p>
              )}

              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-[10px] leading-5 text-white/45">
                  If the original hash was incorrect, verify the correct
                  transaction ID before attempting another submission.
                  A hash already used for another deposit cannot be reused.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* RECORDS */}
        <div className="mt-4 grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2">
          <section className="min-w-0 rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-black">Current Deposit</h2>
              <StatusBadge status={deposit.status} />
            </div>

            <div className="mt-4 space-y-2">
              <DetailRow label="Deposit ID" value={deposit.id} mono />
              <DetailRow label="Status" value={deposit.status} />
              <DetailRow
                label="Expected amount"
                value={formatUSDT(deposit.expectedAmount, currency)}
              />
              {deposit.txHash && (
                <DetailRow
                  label="Transaction hash"
                  value={deposit.txHash}
                  mono
                />
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(`/investment/profile/deposit/${deposit.id}`)
              }
              className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-bold text-white/75 hover:bg-white/10"
            >
              View deposit details
              <ExternalLink size={14} />
            </button>
          </section>

          <section className="min-w-0 rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <History size={17} className="text-[#FF476B]" />
              <h2 className="text-sm font-black">Deposit History</h2>
            </div>

            <p className="mt-1 text-[10px] text-white/40">
              Records found in the first 50 returned deposits.
            </p>

            {history.length === 0 ? (
              <p className="mt-4 rounded-xl bg-[#07101F] p-4 text-center text-[11px] text-white/45">
                No deposit records found in the loaded history.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      router.push(`/investment/profile/deposit/${item.id}`)
                    }
                    className="w-full min-w-0 rounded-xl border border-white/10 bg-[#07101F] p-3 text-left transition hover:border-[#E60033]/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 break-all font-mono text-[10px] text-white/65">
                        {item.id}
                      </p>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-white/45">
                        Expected amount
                      </span>
                      <span className="text-right text-xs font-black">
                        {formatUSDT(item.expectedAmount, currency)}
                      </span>
                    </div>

                    {item.txHash && (
                      <p className="mt-2 truncate font-mono text-[9px] text-white/40">
                        TXID: {item.txHash}
                      </p>
                    )}

                    <p className="mt-3 flex items-center justify-end gap-1 text-[10px] font-bold text-[#FF476B]">
                      View deposit
                      <ExternalLink size={12} />
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-4 flex gap-3 rounded-xl border border-white/10 bg-[#0B1426] p-4">
          <Clock3 size={17} className="mt-0.5 shrink-0 text-white/50" />
          <div>
            <h3 className="text-xs font-black">Transaction Verification</h3>
            <p className="mt-1 text-[10px] leading-5 text-white/45">
              Your deposit status refreshes automatically. Keep your
              transaction hash until the deposit has been verified
              and its final status is reflected in your account.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050B18] px-3 pb-32 pt-4 text-white min-[375px]:px-4 sm:px-6 sm:pt-6 lg:px-8">
      {children}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-[#07101F]/60 p-3">
      <p className="text-[9px] text-white/45">{label}</p>
      <p className="mt-1 wrap-break-words text-xs font-black sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const confirmed =
    normalized === "CONFIRMED" || normalized === "COMPLETED";

  const failed =
    normalized === "FAILED" ||
    normalized === "CANCELLED" ||
    normalized === "REJECTED";

  return (
    <span
      className={`max-w-[45%] shrink-0 wrap-break-words rounded-lg border px-2.5 py-1 text-[9px] font-extrabold ${
        confirmed
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : failed
            ? "border-[#E60033]/30 bg-[#E60033]/10 text-[#FF8BA3]"
            : "border-amber-400/20 bg-amber-400/10 text-amber-200"
      }`}
    >
      {status}
    </span>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-white/5 bg-[#07101F] p-3">
      <span className="shrink-0 text-[10px] text-white/45">{label}</span>
      <span
        className={`min-w-0 break-all text-right text-[10px] font-bold text-white/75 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ErrorState({
  message,
  onBack,
}: {
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center">
      <div className="w-full rounded-[22px] border border-white/10 bg-[#0B1426] p-7 text-center">
        <AlertCircle size={26} className="mx-auto text-[#FF476B]" />
        <h1 className="mt-4 text-base font-black">
          Deposit unavailable
        </h1>
        <p className="mt-2 wrap-break-words text-xs leading-5 text-white/50">
          {message}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 rounded-xl bg-[#E60033] px-5 py-3 text-xs font-extrabold text-white hover:bg-[#FF174B]"
        >
          Back to investment
        </button>
      </div>
    </div>
  );
}