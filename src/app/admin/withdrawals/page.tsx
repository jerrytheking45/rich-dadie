"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import AdminDashboard from "@/src/components/admin/AdminDashboard";
import AdminWithdrawalDetail from "@/src/components/admin/withdrawals/AdminWithdrawalDetail";
import AdminWithdrawalTable from "@/src/components/admin/withdrawals/AdminWithdrawalTable";
import RejectWithdrawalDialog from "@/src/components/admin/withdrawals/RejectWithdrawalDialog";

import {
  adminApi,
  type AdminWithdrawal,
  type AdminWithdrawalStatus,
} from "@/src/lib/api/admin";

const WITHDRAWAL_STATUSES: Array<
  AdminWithdrawalStatus | "ALL"
> = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "BROADCAST",
  "CONFIRMING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
];

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    typeof error === "object" &&
    error !== null
  ) {
    const axiosError = error as {
      response?: {
        data?: {
          error?: unknown;
          message?: unknown;
        };
      };
      message?: unknown;
    };

    const apiError =
      axiosError.response?.data?.error;

    if (
      typeof apiError === "string" &&
      apiError.trim()
    ) {
      return apiError.trim();
    }

    const apiMessage =
      axiosError.response?.data?.message;

    if (
      typeof apiMessage === "string" &&
      apiMessage.trim()
    ) {
      return apiMessage.trim();
    }

    if (
      typeof axiosError.message === "string" &&
      axiosError.message.trim()
    ) {
      return axiosError.message.trim();
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] =
    useState<AdminWithdrawal[]>([]);

  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<AdminWithdrawal | null>(null);

  const [rejectingWithdrawal, setRejectingWithdrawal] =
    useState<AdminWithdrawal | null>(null);

  const [status, setStatus] = useState<
    AdminWithdrawalStatus | "ALL"
  >("ALL");

  const [userId, setUserId] = useState("");

  const [page, setPage] = useState(1);

  const pageSize = 20;

  const [total, setTotal] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const loadWithdrawals = useCallback(
    async (
      showRefreshing = false,
    ): Promise<void> => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await adminApi.listWithdrawals({
            page,
            page_size: pageSize,
            ...(status !== "ALL"
              ? { status }
              : {}),
            ...(userId.trim()
              ? {
                  user_id: userId.trim(),
                }
              : {}),
          });

        setWithdrawals(
          response.data.withdrawals ?? [],
        );

        setTotal(
          response.data.pagination?.total ?? 0,
        );

        const returnedPage =
          response.data.pagination?.page ??
          page;

        if (
          returnedPage !== page &&
          response.data.pagination
        ) {
          setPage(returnedPage);
        }
      } catch (requestError: unknown) {
        setError(
          getErrorMessage(
            requestError,
            "Unable to load withdrawals.",
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, status, userId],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadWithdrawals();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadWithdrawals]);

  const handleStatusChange = (
    nextStatus:
      | AdminWithdrawalStatus
      | "ALL",
  ): void => {
    setStatus(nextStatus);
    setPage(1);
    setSelectedWithdrawal(null);
  };

  const handleSearch = (): void => {
    setPage(1);
    setSelectedWithdrawal(null);

    if (page === 1) {
      void loadWithdrawals();
    }
  };

  const handleClearUserFilter = (): void => {
    setUserId("");
    setPage(1);
    setSelectedWithdrawal(null);

    if (page === 1 && !userId) {
      void loadWithdrawals();
    }
  };

  const handleSelectWithdrawal = async (
    withdrawal: AdminWithdrawal,
  ): Promise<void> => {
    try {
      setError("");

      const response =
        await adminApi.getWithdrawal(
          withdrawal.id,
        );

      setSelectedWithdrawal(response.data);
    } catch (requestError: unknown) {
      setError(
        getErrorMessage(
          requestError,
          "Unable to load withdrawal details.",
        ),
      );
    }
  };

  const handleRejectConfirm = async (
    reason: string,
  ): Promise<void> => {
    if (!rejectingWithdrawal) {
      return;
    }

    const withdrawalId =
      rejectingWithdrawal.id;

    try {
      setError("");

      const response =
        await adminApi.rejectWithdrawal(
          withdrawalId,
          reason,
        );

      setSelectedWithdrawal(response.data);

      setRejectingWithdrawal(null);

      await loadWithdrawals(true);
    } catch (requestError: unknown) {
      throw new Error(
        getErrorMessage(
          requestError,
          "Unable to reject withdrawal.",
        ),
      );
    }
  };

  const pendingCount = withdrawals.filter(
    (withdrawal) =>
      withdrawal.status === "PENDING",
  ).length;

  const completedCount = withdrawals.filter(
    (withdrawal) =>
      withdrawal.status === "COMPLETED",
  ).length;

  const failedCount = withdrawals.filter(
    (withdrawal) =>
      withdrawal.status === "FAILED",
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize),
  );

  return (
    <AdminDashboard title="Withdrawals">
      <div className="min-h-screen bg-[#050B18]">
        <main className="mx-auto w-full max-w-375 px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10">
                  <WalletCards className="h-5 w-5 text-purple-300" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-300">
                  Financial operations
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Withdrawals
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor withdrawal requests, inspect
                transaction processing, and manage
                pending withdrawal operations.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadWithdrawals(true)
              }
              disabled={
                refreshing || loading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </header>

          {/* Summary cards */}
          <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Total results"
              value={total.toLocaleString()}
              icon={WalletCards}
              tone="purple"
            />

            <SummaryCard
              label="Pending"
              value={pendingCount.toLocaleString()}
              icon={Clock3}
              tone="amber"
              description="On current page"
            />

            <SummaryCard
              label="Completed"
              value={completedCount.toLocaleString()}
              icon={CheckCircle2}
              tone="emerald"
              description="On current page"
            />

            <SummaryCard
              label="Failed"
              value={failedCount.toLocaleString()}
              icon={XCircle}
              tone="red"
              description="On current page"
            />
          </section>

          {/* Filters */}
          <section className="mt-6 rounded-2xl border border-white/8 bg-[#0B1426] p-4 shadow-xl shadow-black/10 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Withdrawal filters
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Filter requests by status or user.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
              {/* Status */}
              <div className="w-full xl:max-w-xs">
                <label
                  htmlFor="withdrawal-status"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  Status
                </label>

                <select
                  id="withdrawal-status"
                  value={status}
                  onChange={(event) =>
                    handleStatusChange(
                      event.target
                        .value as
                        | AdminWithdrawalStatus
                        | "ALL",
                    )
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#07101F] px-3 text-sm font-medium text-slate-300 outline-none transition focus:border-purple-400/30 focus:ring-2 focus:ring-purple-400/10"
                >
                  {WITHDRAWAL_STATUSES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-[#0B1426] text-white"
                      >
                        {item === "ALL"
                          ? "All statuses"
                          : item}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* User search */}
              <div className="w-full xl:max-w-xl">
                <label
                  htmlFor="withdrawal-user-id"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  User ID
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                    <input
                      id="withdrawal-user-id"
                      type="text"
                      value={userId}
                      onChange={(event) =>
                        setUserId(
                          event.target.value,
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          handleSearch();
                        }
                      }}
                      placeholder="Filter by user UUID..."
                      className="h-11 w-full rounded-xl border border-white/10 bg-[#07101F] pl-10 pr-10 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/30 focus:ring-2 focus:ring-purple-400/10"
                    />

                    {userId && (
                      <button
                        type="button"
                        onClick={
                          handleClearUserFilter
                        }
                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-600 transition hover:text-white"
                        aria-label="Clear user ID"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="h-11 shrink-0 rounded-xl bg-purple-500 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-500/10 transition hover:bg-purple-400"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <section className="mt-5 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/5 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-300">
                  Unable to complete request
                </p>

                <p className="mt-1 text-xs leading-5 text-red-300/70">
                  {error}
                </p>
              </div>
            </section>
          )}

          {/* Table heading */}
          <section className="mt-6">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Withdrawal requests
                </h2>

                <p className="mt-0.5 text-xs text-slate-600">
                  {total.toLocaleString()} total
                  requests
                </p>
              </div>

              {refreshing && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Updating data...
                </div>
              )}
            </div>

            <AdminWithdrawalTable
              withdrawals={withdrawals}
              page={page}
              pageSize={pageSize}
              total={total}
              loading={loading}
              onPageChange={(nextPage) => {
                if (
                  nextPage < 1 ||
                  nextPage > totalPages
                ) {
                  return;
                }

                setPage(nextPage);
                setSelectedWithdrawal(null);
              }}
              onSelect={(withdrawal) => {
                void handleSelectWithdrawal(
                  withdrawal,
                );
              }}
            />
          </section>

          {/* Details modal */}
          {selectedWithdrawal && (
            <AdminWithdrawalDetail
              withdrawal={selectedWithdrawal}
              onClose={() =>
                setSelectedWithdrawal(null)
              }
              onReject={() => {
                if (
                  selectedWithdrawal.status ===
                  "PENDING"
                ) {
                  setRejectingWithdrawal(
                    selectedWithdrawal,
                  );
                }
              }}
            />
          )}

          {/* Reject modal */}
          {rejectingWithdrawal && (
            <RejectWithdrawalDialog
              open
              withdrawalId={
                rejectingWithdrawal.id
              }
              amount={
                rejectingWithdrawal.amount
              }
              onClose={() =>
                setRejectingWithdrawal(null)
              }
              onConfirm={
                handleRejectConfirm
              }
            />
          )}
        </main>
      </div>
    </AdminDashboard>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  description?: string;
  icon: typeof WalletCards;
  tone:
    | "purple"
    | "amber"
    | "emerald"
    | "red";
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}: SummaryCardProps) {
  const toneClasses = {
    purple: {
      icon: "bg-purple-400/10 text-purple-300",
      value: "text-white",
      border: "border-white/8",
    },
    amber: {
      icon: "bg-amber-400/10 text-amber-300",
      value: "text-white",
      border: "border-white/8",
    },
    emerald: {
      icon: "bg-emerald-400/10 text-emerald-300",
      value: "text-white",
      border: "border-white/8",
    },
    red: {
      icon: "bg-red-400/10 text-red-300",
      value: "text-white",
      border: "border-white/8",
    },
  };

  const classes = toneClasses[tone];

  return (
    <div
      className={`rounded-2xl border bg-[#0B1426] p-5 shadow-xl shadow-black/10 ${classes.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            {label}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${classes.value}`}
          >
            {value}
          </p>

          {description && (
            <p className="mt-1 text-[10px] text-slate-600">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${classes.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}