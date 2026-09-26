
// src/app/investment/profile/withdraw/[withdrawalId]/page.tsx

"use client";

import {
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import InvestmentBottomNav from "@/src/components/InvestmentBottomNav";

import type { Withdrawal } from "@/src/lib/types/investment";
import { withdrawalService } from "@/src/lib/services/withdrawalService";

import WithdrawalTransactionDetails from "@/src/components/withdraw/WithdrawalTransactionDetails";

export default function WithdrawalDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const withdrawalId =
    typeof params.withdrawalId === "string"
      ? params.withdrawalId
      : "";

  const [withdrawal, setWithdrawal] =
    useState<Withdrawal | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  /*
   * Initial withdrawal load.
   *
   * This effect only starts the asynchronous request.
   * State updates happen after the request resolves/rejects.
   */
  useEffect(() => {
    let cancelled = false;

    const loadInitialWithdrawal = async () => {
      if (!withdrawalId) {
        if (!cancelled) {
          setError("Withdrawal ID is missing.");
          setLoading(false);
        }

        return;
      }

      try {
        const result =
          await withdrawalService.getById(
            withdrawalId,
          );

        if (cancelled) {
          return;
        }

        setWithdrawal(result);
        setError("");
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load withdrawal:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load withdrawal details.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialWithdrawal();

    return () => {
      cancelled = true;
    };
  }, [withdrawalId]);

  /*
   * Reusable loader for manual retry / refresh.
   */
  const loadWithdrawal = useCallback(
    async (refresh = false) => {
      if (!withdrawalId) {
        setError("Withdrawal ID is missing.");
        setLoading(false);
        return;
      }

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const result =
          await withdrawalService.getById(
            withdrawalId,
          );

        setWithdrawal(result);
      } catch (err) {
        console.error(
          "Failed to load withdrawal:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load withdrawal details.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [withdrawalId],
  );

  if (loading) {
    return (
      <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#F7C948]" />

            <p className="text-sm text-[#B8C2CC]">
              Loading withdrawal details...
            </p>
          </div>
        </div>

        <InvestmentBottomNav />
      </main>
    );
  }

  if (error || !withdrawal) {
    return (
      <main className="min-h-screen bg-[#07182F] px-4 pb-28 pt-6 text-white">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm text-[#B8C2CC] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="font-semibold text-red-200">
              Unable to load withdrawal
            </p>

            <p className="mt-2 text-sm text-red-100/70">
              {error ||
                "The requested withdrawal could not be found."}
            </p>

            <button
              type="button"
              onClick={() => void loadWithdrawal()}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#F7C948] px-5 text-sm font-semibold text-[#07182F]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>

        <InvestmentBottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07182F] px-4 pb-28 pt-6 text-white">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1F355E] bg-[#0C2244] text-[#B8C2CC] transition hover:border-[#F7C948] hover:text-[#F7C948]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-lg font-bold text-white">
              Transaction details
            </h1>

            <p className="mt-1 truncate text-xs text-[#B8C2CC]">
              {withdrawal.id}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadWithdrawal(true)
            }
            disabled={refreshing}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1F355E] bg-[#0C2244] text-[#B8C2CC] transition hover:border-[#F7C948] hover:text-[#F7C948] disabled:opacity-50"
            aria-label="Refresh transaction"
          >
            <RefreshCw
              className={[
                "h-5 w-5",
                refreshing ? "animate-spin" : "",
              ].join(" ")}
            />
          </button>
        </div>

        <WithdrawalTransactionDetails
          withdrawal={withdrawal}
        />
      </div>

      <InvestmentBottomNav />
    </main>
  );
}

