
// src/app/investment/profile/withdraw/[withdrawalId]/page.tsx


"use client";

import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  RefreshCw,
  ReceiptText,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import type { Withdrawal } from "@/src/lib/types/investment";
import { withdrawalService } from "@/src/lib/services/withdrawalService";
import WithdrawalTransactionDetails from "@/src/components/withdraw/WithdrawalTransactionDetails";

function isFinal(status: Withdrawal["status"]) {
  return ["COMPLETED", "FAILED", "CANCELLED"].includes(
    status,
  );
}

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "FAILED":
    case "CANCELLED":
      return "border-red-400/20 bg-red-400/10 text-red-300";
    case "PENDING":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    default:
      return "border-sky-400/20 bg-sky-400/10 text-sky-300";
  }
}

function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050B18] px-3 pb-28 pt-5 text-white min-[375px]:px-4 sm:px-6 sm:pt-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-[#E60033]/8 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-2xl">
        {children}
      </div>
    </main>
  );
}

export default function WithdrawalDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const withdrawalId =
    typeof params.withdrawalId === "string"
      ? params.withdrawalId
      : "";

  const requestLock = useRef(false);

  const [withdrawal, setWithdrawal] =
    useState<Withdrawal | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      if (!withdrawalId) {
        setError("Withdrawal reference is missing.");
        setLoading(false);
        return;
      }

      try {
        const result =
          await withdrawalService.getById(
            withdrawalId,
          );

        if (cancelled) return;

        setWithdrawal(result);
        setError("");
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load withdrawal details. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitial();

    return () => {
      cancelled = true;
    };
  }, [withdrawalId]);

  const loadWithdrawal = useCallback(async () => {
    if (!withdrawalId || requestLock.current) return;

    requestLock.current = true;
    setRefreshing(true);
    setError("");

    try {
      const result =
        await withdrawalService.getById(
          withdrawalId,
        );

      setWithdrawal(result);
    } catch {
      setError(
        "Unable to refresh withdrawal details. Please try again.",
      );
    } finally {
      requestLock.current = false;
      setRefreshing(false);
    }
  }, [withdrawalId]);

  // Refresh automatically while the request is being processed.
  useEffect(() => {
    if (
      !withdrawalId ||
      !withdrawal ||
      withdrawal.id !== withdrawalId ||
      isFinal(withdrawal.status)
    ) {
      return;
    }

    let mounted = true;
    let inFlight = false;

    const interval = window.setInterval(async () => {
      if (inFlight || requestLock.current) return;

      inFlight = true;

      try {
        const updated =
          await withdrawalService.getById(
            withdrawalId,
          );

        if (mounted) {
          setWithdrawal(updated);
        }
      } catch {
        // Retain the last known status.
      } finally {
        inFlight = false;
      }
    }, 5000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
    }, [withdrawalId, withdrawal]);

  const backButton = (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/70 transition hover:border-white/20 hover:text-white"
    >
      <ArrowLeft size={17} />
    </button>
  );

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4">
          <Loader2
            size={29}
            className="animate-spin text-[#FF476B]"
          />
          <p className="text-xs text-white/50">
            Loading withdrawal details...
          </p>
        </div>
      </PageShell>
    );
  }

  if (!withdrawal) {
    return (
      <PageShell>
        <div className="mb-5">{backButton}</div>

        <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
            <AlertCircle size={23} />
          </div>

          <h1 className="mt-4 text-lg font-black">
            Withdrawal unavailable
          </h1>

          <p className="mt-2 text-xs leading-5 text-white/50">
            {error ||
              "The requested withdrawal could not be found."}
          </p>

          <button
            type="button"
            onClick={() => void loadWithdrawal()}
            disabled={refreshing || !withdrawalId}
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-5 text-xs font-extrabold text-white transition hover:bg-[#FF174B] disabled:opacity-40"
          >
            <RefreshCw
              size={15}
              className={
                refreshing ? "animate-spin" : ""
              }
            />
            Try again
          </button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <header className="mb-5 flex items-center justify-between gap-3">
        {backButton}

        <div className="min-w-0 flex-1 text-center">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#FF476B]">
            REDIQ Wallet
          </p>
          <h1 className="mt-0.5 text-sm font-black sm:text-lg">
            Withdrawal details
          </h1>
        </div>

        <button
          type="button"
          onClick={() => void loadWithdrawal()}
          disabled={refreshing}
          aria-label="Refresh withdrawal"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/70 transition hover:text-white disabled:opacity-40"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />
        </button>
      </header>

      <section className="mb-4 rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#25101E] via-[#101827] to-[#0B1426] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
              <ReceiptText size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black">
                Withdrawal request
              </p>
              <p className="mt-1 break-all text-[10px] text-white/45">
                {withdrawal.id}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide ${getStatusStyle(
              withdrawal.status,
            )}`}
          >
            {withdrawal.status.replace(/_/g, " ")}
          </span>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-[#E60033]/25 bg-[#E60033]/10 p-3 text-xs text-[#FF9AAD]"
        >
          {error}
        </p>
      )}

      <div className="min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] p-3 min-[375px]:p-4 sm:p-5">
        <WithdrawalTransactionDetails
          withdrawal={withdrawal}
        />
      </div>
    </PageShell>
  );
}