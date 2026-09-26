
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

import { withdrawalApi } from "@/src/lib/api/withdrawal";
import { investmentApi } from "@/src/lib/api/investmentApi";
import { formatUSDT } from "@/src/lib/utils/currency";
import { useSettings } from "@/src/context/useSettings";
import { isZeroUUID } from "@/src/lib/utils/uuid";
import { getUniqueKey } from "@/src/lib/utils/uniqueKey";

import type {
  Investment,
  AccountDeposit,
  Withdrawal,
  AccountDepositStatus,
  WithdrawalStatus,
} from "@/src/lib/types/investment";

type TransactionItem =
  | {
      type: "investment";
      data: Investment;
    }
  | {
      type: "account-deposit";
      data: AccountDeposit;
    }
  | {
      type: "withdrawal";
      data: Withdrawal;
    };

function getTransactionDate(transaction: TransactionItem): number {
  return new Date(transaction.data.createdAt).getTime();
}

function getAccountDepositStatusClass(
  status: AccountDepositStatus,
): string {
  switch (status) {
    case "CONFIRMED":
      return "text-emerald-400";

    case "VERIFYING":
      return "text-amber-400";

    case "FAILED":
    case "EXPIRED":
    case "UNMATCHED":
      return "text-red-400";

    case "PENDING":
    default:
      return "text-white/40";
  }
}

function getInvestmentStatusClass(
  status: Investment["status"],
): string {
  switch (status) {
    case "ACTIVE":
      return "text-emerald-400";

    case "PENDING":
      return "text-amber-400";

    case "MATURED":
      return "text-blue-400";

    case "WITHDRAWN":
      return "text-purple-300";

    case "CANCELLED":
      return "text-red-400";

    default:
      return "text-white/40";
  }
}

function getAccountDepositAmount(
  deposit: AccountDeposit,
): number {
  if (
    typeof deposit.receivedAmount === "number" &&
    deposit.receivedAmount > 0
  ) {
    return deposit.receivedAmount;
  }

  return deposit.expectedAmount;
}

function getWithdrawalStatusClass(
  status: WithdrawalStatus,
): string {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-400/10 bg-emerald-400/10 text-emerald-400";

    case "BROADCAST":
    case "CONFIRMING":
      return "border-blue-400/10 bg-blue-400/10 text-blue-400";

    case "PROCESSING":
      return "border-amber-400/10 bg-amber-400/10 text-amber-400";

    case "PENDING":
      return "border-yellow-400/10 bg-yellow-400/10 text-yellow-400";

    case "FAILED":
    case "CANCELLED":
      return "border-red-400/10 bg-red-400/10 text-red-400";

    default:
      return "border-white/8 bg-white/[0.03] text-white/40";
  }
}

const ProfileTransactionsPage = () => {
  const router = useRouter();
  const { currency } = useSettings();

  const [transactions, setTransactions] =
    useState<TransactionItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          investmentResponse,
          accountDepositResponse,
          withdrawalResponse,
        ] = await Promise.all([
          investmentApi.getInvestments(1, 50),
          investmentApi.getAccountDeposits(1, 50),
          withdrawalApi.getWithdrawals(1, 50),
        ]);

        if (cancelled) {
          return;
        }

        const investmentTransactions: TransactionItem[] =
          investmentResponse.investments
            .filter(
              (investment) =>
                !isZeroUUID(investment.id),
            )
            .map((investment) => ({
              type: "investment" as const,
              data: investment,
            }));

        const accountDepositTransactions: TransactionItem[] =
          accountDepositResponse.deposits.map(
            (deposit) => ({
              type: "account-deposit" as const,
              data: deposit,
            }),
          );

        const withdrawalTransactions: TransactionItem[] =
          withdrawalResponse.withdrawals.map(
            (withdrawal) => ({
              type: "withdrawal" as const,
              data: withdrawal,
            }),
          );

        const combined: TransactionItem[] = [
          ...investmentTransactions,
          ...accountDepositTransactions,
          ...withdrawalTransactions,
        ];

        combined.sort(
          (a, b) =>
            getTransactionDate(b) -
            getTransactionDate(a),
        );

        setTransactions(combined);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load transactions:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load transaction history.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B18] text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute -left-32 top-[42%] h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <main className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-5">
          <div className="w-full">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-2xl bg-[#0B1426]" />

              <div>
                <div className="h-3 w-24 animate-pulse rounded bg-[#0B1426]" />
                <div className="mt-2 h-2.5 w-40 animate-pulse rounded bg-[#0B1426]" />
              </div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-3xl border border-white/5 bg-[#0B1426]"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute -left-32 top-[42%] h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <main className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push("/investment/profile")
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/65 shadow-lg shadow-black/10 transition hover:bg-[#101D33] hover:text-white active:scale-95"
            aria-label="Back to profile"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
              Account activity
            </p>

            <h1 className="mt-0.5 text-[19px] font-extrabold tracking-tight text-white">
              Transactions
            </h1>

            <p className="mt-0.5 text-[10px] text-white/35">
              Investments, deposits and withdrawals
            </p>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-400/15 bg-red-400/5 p-4"
          >
            <p className="text-xs font-semibold text-red-300">
              {error}
            </p>
          </div>
        )}

        <section className="mt-6 rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-400/10 bg-purple-400/10 text-purple-300">
                <Wallet size={19} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-purple-300/65">
                  Financial activity
                </p>

                <h2 className="mt-1 text-[16px] font-extrabold text-white">
                  Activity Overview
                </h2>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#07101F] px-3 py-2 text-right">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                Total
              </p>

              <p className="mt-0.5 text-xs font-bold text-white/75">
                {transactions.length}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-white/40">
            Your latest investments, account deposits and withdrawals are
            shown below in chronological order.
          </p>
        </section>

        <div className="mt-5 space-y-3">
          {transactions.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-white/10 bg-[#0B1426] p-10 text-center shadow-xl shadow-black/10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-white/30">
                <Wallet size={20} />
              </div>

              <p className="mt-4 text-sm font-bold text-white/70">
                No transactions yet
              </p>

              <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-white/35">
                Your investments, account deposits and withdrawals will
                appear here.
              </p>
            </div>
          ) : (
            transactions.map((transaction, index) => {
              const key = getUniqueKey(
                transaction.data.id,
                index,
              );

              if (
                transaction.type ===
                "account-deposit"
              ) {
                const deposit = transaction.data;

                const amount =
                  getAccountDepositAmount(
                    deposit,
                  );

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/investment/profile/account-deposit/${deposit.id}`,
                      )
                    }
                    className="block w-full rounded-3xl border border-white/7 bg-[#0B1426] p-4 text-left shadow-lg shadow-black/10 transition hover:border-white/12 hover:bg-[#101D33] active:scale-[0.995]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/10 text-blue-400">
                          <ArrowDownLeft size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-extrabold text-white/90">
                            Account Deposit
                          </p>

                          <p className="mt-1 text-[10px] font-medium text-white/40">
                            USDT · TRON TRC20
                          </p>

                          <p className="mt-1 text-[10px] text-white/30">
                            {new Date(
                              deposit.createdAt,
                            ).toLocaleString()}
                          </p>

                          {deposit.txHash && (
                            <p className="mt-1 truncate font-mono text-[9px] text-white/25">
                              {deposit.txHash}
                            </p>
                          )}

                          <p className="mt-1.5 text-[9px] font-semibold text-blue-400/60">
                            Tap to view deposit
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-extrabold text-emerald-400">
                          +
                          {formatUSDT(
                            amount,
                            currency,
                          )}
                        </p>

                        <span
                          className={`mt-1 block text-[9px] font-bold ${getAccountDepositStatusClass(
                            deposit.status,
                          )}`}
                        >
                          {deposit.status}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              }

              if (
                transaction.type ===
                "withdrawal"
              ) {
                const withdrawal =
                  transaction.data;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/investment/profile/withdraw/${withdrawal.id}`,
                      )
                    }
                    className="block w-full rounded-3xl border border-white/7 bg-[#0B1426] p-4 text-left shadow-lg shadow-black/10 transition hover:border-white/12 hover:bg-[#101D33] active:scale-[0.995]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/10 text-red-400">
                          <ArrowUpRight size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-white/90">
                            Withdrawal
                          </p>

                          <p className="mt-1 text-[10px] font-medium text-white/40">
                            USDT · TRON TRC20
                          </p>

                          <p className="mt-1 text-[10px] text-white/30">
                            {new Date(
                              withdrawal.createdAt,
                            ).toLocaleString()}
                          </p>

                          {withdrawal.txHash && (
                            <p className="mt-1 truncate font-mono text-[9px] text-white/25">
                              TX: {withdrawal.txHash}
                            </p>
                          )}

                          <p className="mt-1.5 text-[9px] font-semibold text-red-400/60">
                            Tap to view withdrawal
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-extrabold text-red-400">
                          -
                          {formatUSDT(
                            withdrawal.amount,
                            currency,
                          )}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full border px-2 py-1 text-[9px] font-bold ${getWithdrawalStatusClass(
                            withdrawal.status,
                          )}`}
                        >
                          {withdrawal.status}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              }

              const investment =
                transaction.data;

              const status =
                investment.status;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/investment/investments/${investment.id}`,
                    )
                  }
                  className="block w-full rounded-3xl border border-white/7 bg-[#0B1426] p-4 text-left shadow-lg shadow-black/10 transition hover:border-white/12 hover:bg-[#101D33] active:scale-[0.995]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                          status === "MATURED"
                            ? "border-blue-400/10 bg-blue-400/10 text-blue-400"
                            : "border-emerald-400/10 bg-emerald-400/10 text-emerald-400"
                        }`}
                      >
                        <ArrowDownLeft size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-white/90">
                          {investment.planName ||
                            "Investment"}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-white/40">
                          Investment
                        </p>

                        <p className="mt-1 text-[10px] text-white/30">
                          {new Date(
                            investment.createdAt,
                          ).toLocaleString()}
                        </p>

                        <p className="mt-1.5 text-[9px] font-semibold text-emerald-400/60">
                          Tap to view investment
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-xs font-extrabold ${getInvestmentStatusClass(
                          status,
                        )}`}
                      >
                        {formatUSDT(
                          investment.amount,
                          currency,
                        )}
                      </p>

                      <span
                        className={`mt-1 block text-[9px] font-bold ${getInvestmentStatusClass(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfileTransactionsPage;


