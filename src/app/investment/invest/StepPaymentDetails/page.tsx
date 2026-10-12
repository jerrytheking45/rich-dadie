
"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  History,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { useTranslation } from "../../../../i18n/translations";
import { useSettings } from "@/src/context/useSettings";
import { formatUSDT } from "@/src/lib/utils/currency";
import { investmentApi } from "@/src/lib/api/investmentApi";
import type { Deposit } from "@/src/lib/types/investment";

interface StepPaymentDetailsProps {
  depositAddress: string;
  amount: number;
  onSubmit: (txHash: string, proofUrl?: string) => void;
  onBack: () => void;
  submitting: boolean;
  error?: string;
  existingDeposit?: Deposit | null;
}

function formatDepositDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDepositStatusClass(status: Deposit["status"]) {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
    case "VERIFYING":
      return "border-sky-400/20 bg-sky-400/10 text-sky-300";
    case "FAILED":
    case "EXPIRED":
    case "UNMATCHED":
      return "border-[#E60033]/25 bg-[#E60033]/10 text-[#FF8BA3]";
    default:
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";
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
  const { t } = useTranslation();
  const { currency } = useSettings();

  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);

  const [depositHistory, setDepositHistory] = useState<Deposit[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyRefreshing, setHistoryRefreshing] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const historyRequestRef = useRef(0);

  useEffect(() => {
    const requestId = ++historyRequestRef.current;
    let cancelled = false;

    async function loadInitialHistory() {
      try {
        const response = await investmentApi.getDeposits(1, 10);

        if (cancelled || requestId !== historyRequestRef.current) {
          return;
        }

        setDepositHistory(
          Array.isArray(response.deposits) ? response.deposits : [],
        );
        setHistoryError("");
      } catch (err) {
        if (cancelled || requestId !== historyRequestRef.current) {
          return;
        }

        console.error("Failed to load deposit history:", err);
        setHistoryError("Unable to load deposit history.");
      } finally {
        if (!cancelled && requestId === historyRequestRef.current) {
          setHistoryLoading(false);
        }
      }
    }

    void loadInitialHistory();

    return () => {
      cancelled = true;
      historyRequestRef.current += 1;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const refreshHistory = async () => {
    if (historyRefreshing) return;

    const requestId = ++historyRequestRef.current;

    setHistoryRefreshing(true);
    setHistoryError("");

    try {
      const response = await investmentApi.getDeposits(1, 10);

      if (requestId !== historyRequestRef.current) return;

      setDepositHistory(
        Array.isArray(response.deposits) ? response.deposits : [],
      );
    } catch (err) {
      if (requestId !== historyRequestRef.current) return;

      console.error("Deposit history refresh failed:", err);
      setHistoryError("Could not refresh deposit history.");
    } finally {
      if (requestId === historyRequestRef.current) {
        setHistoryLoading(false);
        setHistoryRefreshing(false);
      }
    }
  };

  const handleCopy = async () => {
    const address = depositAddress.trim();
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);

      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Could not copy deposit address:", err);
      setCopied(false);
    }
  };

  const handleSubmit = () => {
    const normalized = txHash.trim();

    if (!normalized || submitting) return;

    onSubmit(normalized);
  };

  const canSubmit =
    !!txHash.trim() &&
    !!depositAddress.trim() &&
    !submitting;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#FF476B]">
          Step 03
        </p>
        <h2 className="mt-1 text-lg font-black sm:text-xl">
          {existingDeposit
            ? "Complete pending deposit"
            : "Complete your payment"}
        </h2>
        <p className="mt-1 text-xs leading-5 text-white/45">
          Transfer USDT using the correct network, then provide
          your transaction ID for verification.
        </p>
      </div>

      {existingDeposit && (
        <section className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-black text-amber-200">
              Existing investment deposit
            </p>
            <StatusBadge status={existingDeposit.status} />
          </div>

          <p className="mt-2 text-[11px] leading-5 text-white/55">
            This investment has already been created. You are
            continuing its existing deposit, not creating a new one.
          </p>

          {existingDeposit.txHash && (
            <p className="mt-2 break-all font-mono text-[10px] text-white/50">
              Previous TXID: {existingDeposit.txHash}
            </p>
          )}
        </section>
      )}

      <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
            <Wallet size={19} />
          </div>
          <div>
            <h3 className="text-sm font-black">
              Send your deposit
            </h3>
            <p className="text-[10px] text-white/45">
              {t("payment.step_1")}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#E60033]/20 bg-[#E60033]/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">
            {t("payment.amount_to_send")}
          </p>
          <p className="mt-2 break-all text-2xl font-black text-white sm:text-3xl">
            {formatUSDT(amount, currency)}
          </p>
          <p className="mt-1 text-[10px] text-white/45">
            Deposit asset: USDT
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-white/60">
            {t("payment.network")}
          </span>
          <span className="rounded-lg border border-[#E60033]/25 bg-[#E60033]/10 px-3 py-1.5 text-[10px] font-extrabold text-[#FF8BA3]">
            TRON · TRC20
          </span>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-bold text-white/65">
            {t("payment.deposit_address")}
          </p>

          <div className="mt-2 rounded-xl border border-white/10 bg-[#07101F] p-3">
            <code className="block break-all font-mono text-[11px] leading-6 text-white/85">
              {depositAddress || "Deposit address unavailable"}
            </code>

            <button
              type="button"
              onClick={() => void handleCopy()}
              disabled={!depositAddress.trim()}
              className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-extrabold text-white/80 transition hover:bg-white/10 disabled:opacity-40"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={15} />
                  Address copied
                </>
              ) : (
                <>
                  <Copy size={15} />
                  {t("payment.copy_address")}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
          <AlertCircle
            size={16}
            className="mt-0.5 shrink-0 text-amber-300"
          />
          <p className="text-[10px] leading-5 text-white/60">
            Send only USDT using the TRON (TRC20) network.
            Verify the destination address and amount before sending.
            Transfers made on the wrong network may be unrecoverable.
          </p>
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
            <ShieldCheck size={19} />
          </div>
          <div>
            <h3 className="text-sm font-black">
              Submit transaction ID
            </h3>
            <p className="text-[10px] text-white/45">
              {t("payment.step_2")}
            </p>
          </div>
        </div>

        <label
          htmlFor="tron-tx-hash"
          className="mt-5 block text-[11px] font-bold text-white/70"
        >
          {t("payment.tx_hash_label")}
        </label>

        <textarea
          id="tron-tx-hash"
          rows={3}
          value={txHash}
          onChange={(event) => setTxHash(event.target.value)}
          disabled={submitting}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder={t("payment.tx_hash_placeholder")}
          className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#07101F] px-3 py-3 font-mono text-[11px] leading-5 text-white outline-none placeholder:font-sans placeholder:text-white/30 focus:border-[#E60033]/60 focus:ring-2 focus:ring-[#E60033]/10 disabled:opacity-50"
        />

        <div className="mt-3 flex items-start gap-2">
          <Info
            size={14}
            className="mt-0.5 shrink-0 text-white/40"
          />
          <p className="text-[10px] leading-5 text-white/45">
            Submit the transaction ID for the payment you actually
            sent. Submission requests verification; it does not
            automatically confirm the deposit.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex gap-2 rounded-xl border border-[#E60033]/25 bg-[#E60033]/10 p-3 text-[11px] leading-5 text-[#FF9AAF]"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span className="wrap-break-words">{error}</span>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#07101F] px-3 text-xs font-bold text-white/70 transition hover:bg-white/5 disabled:opacity-40"
          >
            <ArrowLeft size={16} />
            {t("invest.back")}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-3 text-xs font-extrabold text-white transition hover:bg-[#FF174B] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t("payment.submitting")}
              </>
            ) : (
              <>
                {existingDeposit
                  ? "Continue deposit"
                  : t("payment.submit")}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History size={17} className="text-[#FF476B]" />
            <div>
              <h3 className="text-sm font-black">
                Deposit history
              </h3>
              <p className="mt-0.5 text-[10px] text-white/40">
                Latest 10 returned deposits
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refreshHistory()}
            disabled={historyRefreshing || historyLoading}
            aria-label="Refresh deposit history"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#07101F] text-white/60 disabled:opacity-40"
          >
            <RefreshCw
              size={15}
              className={historyRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              size={20}
              className="animate-spin text-[#FF476B]"
            />
          </div>
        ) : historyError ? (
          <div className="mt-4 rounded-xl border border-[#E60033]/20 bg-[#E60033]/5 p-4">
            <p className="text-[11px] text-[#FF9AAF]">
              {historyError}
            </p>
            <button
              type="button"
              onClick={() => void refreshHistory()}
              className="mt-2 text-[11px] font-bold text-white underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        ) : depositHistory.length === 0 ? (
          <div className="mt-4 rounded-xl bg-[#07101F] p-6 text-center">
            <Clock3
              size={20}
              className="mx-auto text-white/30"
            />
            <p className="mt-2 text-xs font-bold text-white/65">
              No deposits yet
            </p>
            <p className="mt-1 text-[10px] text-white/40">
              Your deposit records will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {depositHistory.map((deposit) => (
              <button
                key={deposit.id}
                type="button"
                onClick={() =>
                  router.push(
                    `/investment/profile/deposit/${encodeURIComponent(deposit.id)}`,
                  )
                }
                className="group w-full min-w-0 rounded-xl border border-white/10 bg-[#07101F] p-3 text-left transition hover:border-[#E60033]/35"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-extrabold text-white/80">
                      Deposit #{deposit.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-[10px] text-white/40">
                      {formatDepositDate(deposit.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={deposit.status} />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-white/45">
                    Expected amount
                  </span>
                  <span className="break-all text-right text-xs font-black">
                    {formatUSDT(deposit.expectedAmount, currency)}
                  </span>
                </div>

                {deposit.txHash && (
                  <p className="mt-2 truncate font-mono text-[9px] text-white/40">
                    TXID: {deposit.txHash}
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
  );
}

function StatusBadge({ status }: { status: Deposit["status"] }) {
  return (
    <span
      className={`max-w-[48%] shrink-0 wrap-break-words rounded-lg border px-2 py-1 text-[9px] font-extrabold ${getDepositStatusClass(status)}`}
    >
      {status}
    </span>
  );
}