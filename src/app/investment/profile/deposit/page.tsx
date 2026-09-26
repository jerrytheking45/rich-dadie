"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  CircleCheck,
  CircleX,
  Loader2,
  ReceiptText,
  RotateCcw,
  WalletCards,
} from "lucide-react";

import {
  usePendingInvestmentDeposits,
} from "@/src/hooks/usePendingInvestmentDeposits";

import {
  investmentApi,
} from "@/src/lib/api/investmentApi";

import type {
  Deposit,
  DepositListResponse,
} from "@/src/lib/types/investment";

const PAGE_SIZE = 50;

/* ==========================================================================
   Formatting
   ========================================================================== */

function formatAmount(amount: number): string {
  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })} USDT`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ==========================================================================
   Deposit Status
   ========================================================================== */

function getStatusLabel(status: Deposit["status"]): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";

    case "VERIFYING":
      return "Verifying";

    case "PENDING":
      return "Pending";

    case "FAILED":
      return "Failed";

    case "EXPIRED":
      return "Expired";

    case "UNMATCHED":
      return "Unmatched";

    default:
      return status;
  }
}

function StatusIcon({
  status,
}: {
  status: Deposit["status"];
}) {
  switch (status) {
    case "CONFIRMED":
      return <CircleCheck className="h-3.5 w-3.5" />;

    case "FAILED":
    case "EXPIRED":
    case "UNMATCHED":
      return <CircleX className="h-3.5 w-3.5" />;

    default:
      return <Clock3 className="h-3.5 w-3.5" />;
  }
}

function getStatusClasses(status: Deposit["status"]): string {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-400/15 bg-emerald-400/10 text-emerald-300";

    case "VERIFYING":
      return "border-blue-400/15 bg-blue-400/10 text-blue-300";

    case "PENDING":
      return "border-emerald-400/15 bg-emerald-400/10 text-emerald-300";

    case "FAILED":
    case "EXPIRED":
    case "UNMATCHED":
      return "border-red-400/15 bg-red-400/10 text-red-300";

    default:
      return "border-white/8 bg-white/4 text-white/50";
  }
}

function getStatusDotClasses(status: Deposit["status"]): string {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-400";

    case "VERIFYING":
      return "bg-blue-400";

    case "PENDING":
      return "bg-emerald-400";

    case "FAILED":
    case "EXPIRED":
    case "UNMATCHED":
      return "bg-red-400";

    default:
      return "bg-white/30";
  }
}

/**
 * Pending and verifying deposits are actionable.
 * Send the user to the investment-specific deposit page
 * so they can submit or replace the transaction hash.
 *
 * Completed/terminal deposits go to their detail page.
 */
function getDepositHref(deposit: Deposit): string {
  if (
    deposit.status === "PENDING" ||
    deposit.status === "VERIFYING"
  ) {
    return `/investment/investments/${encodeURIComponent(
      deposit.investmentId,
    )}/deposit`;
  }

  return `/investment/profile/deposit/${encodeURIComponent(
    deposit.id,
  )}`;
}

/* ==========================================================================
   Page
   ========================================================================== */

export default function InvestmentDepositHistoryPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    pendingInvestments,
    loading: pendingLoading,
    error: pendingError,
    refresh: refreshPendingInvestments,
  } = usePendingInvestmentDeposits();

  useEffect(() => {
    let cancelled = false;

    const loadAllDeposits = async () => {
      try {
        setLoading(true);
        setError(null);

        /*
         * First request tells us how many deposits exist.
         * We then fetch the complete collection in batches.
         */
        const firstResponse: DepositListResponse =
          await investmentApi.getDeposits(1, PAGE_SIZE);

        if (cancelled) {
          return;
        }

        const total = firstResponse.pagination.total;
        const firstDeposits = firstResponse.deposits;

        if (total <= PAGE_SIZE) {
          setDeposits(firstDeposits);
          return;
        }

        const totalPages = Math.ceil(total / PAGE_SIZE);

        const remainingPages = await Promise.all(
          Array.from(
            {
              length: totalPages - 1,
            },
            (_, index) =>
              investmentApi.getDeposits(
                index + 2,
                PAGE_SIZE,
              ),
          ),
        );

        if (cancelled) {
          return;
        }

        const allDeposits = [
          ...firstDeposits,
          ...remainingPages.flatMap(
            (response) => response.deposits,
          ),
        ];

        /*
         * Remove accidental duplicates by deposit ID.
         * This also protects the UI if backend data changes
         * while multiple pages are being fetched.
         */
        const uniqueDeposits = Array.from(
          new Map(
            allDeposits.map((deposit) => [
              deposit.id,
              deposit,
            ]),
          ).values(),
        );

        setDeposits(uniqueDeposits);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load investment deposits:",
          err,
        );

        setError(
          "Failed to load your investment deposits.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    queueMicrotask(() => {
      if (!cancelled) {
        void loadAllDeposits();
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* Ambient background */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        <div className="mx-auto w-full max-w-3xl pb-28 pt-4 sm:pt-8">

          {/* ==================================================================
              Header
          ================================================================== */}

          <header className="mb-7">
            <div className="flex items-center gap-3">

              <Link
                href="/investment/profile"
                aria-label="Back to investment profile"
                className="
                  inline-flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-2xl
                  border border-white/8
                  bg-[#0B1426]
                  text-white/55
                  shadow-lg shadow-black/10
                  transition
                  hover:border-emerald-400/20
                  hover:bg-emerald-400/5
                  hover:text-emerald-400
                  active:scale-95
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-400/40
                "
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  Payment activity
                </p>

                <h1 className="mt-1 text-[20px] font-black tracking-tight text-white sm:text-[23px]">
                  Investment Deposits
                </h1>

                <p className="mt-1 text-[10px] leading-5 text-white/40 sm:text-[11px]">
                  Track and manage payments made for your investments.
                </p>
              </div>

            </div>
          </header>

          {/* ==================================================================
              Pending Investments
          ================================================================== */}

          {!pendingLoading &&
            pendingInvestments.length > 0 && (
              <section className="mb-7">

                <div
                  className="
                    overflow-hidden
                    rounded-[28px]
                    border border-emerald-400/10
                    bg-linear-to-br
                    from-[#101D33]
                    via-[#0B1426]
                    to-[#11102B]
                    shadow-xl
                    shadow-black/10
                  "
                >

                  {/* Section header */}

                  <div
                    className="
                      border-b border-white/6
                      p-4
                      sm:p-5
                    "
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <div className="flex items-center gap-3">

                          <span
                            className="
                              flex h-10 w-10 shrink-0
                              items-center justify-center
                              rounded-2xl
                              border border-emerald-400/10
                              bg-emerald-400/10
                              text-emerald-400
                            "
                          >
                            <WalletCards className="h-5 w-5" />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-white">
                              Complete your investments
                            </p>

                            <p className="mt-0.5 text-[10px] leading-4 text-white/40 sm:text-[11px]">
                              Payment is still required for the investments below.
                            </p>
                          </div>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          void refreshPendingInvestments(false);
                        }}
                        disabled={pendingLoading}
                        aria-label="Refresh pending investments"
                        title="Refresh pending investments"
                        className="
                          inline-flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-xl
                          border border-white/8
                          bg-white/4
                          text-white/35
                          transition
                          hover:border-emerald-400/20
                          hover:bg-emerald-400/5
                          hover:text-emerald-400
                          disabled:pointer-events-none
                          disabled:opacity-40
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-emerald-400/40
                        "
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>

                    </div>
                  </div>

                  {/* Pending error */}

                  {pendingError && (
                    <div className="px-4 pt-4 sm:px-5">
                      <div
                        className="
                          rounded-2xl
                          border border-red-400/15
                          bg-red-400/5
                          px-3 py-2.5
                          text-[10px]
                          font-medium
                          leading-4
                          text-red-300
                        "
                      >
                        {pendingError}
                      </div>
                    </div>
                  )}

                  {/* Pending investments */}

                  <div className="space-y-3 p-4 sm:p-5">

                    {pendingInvestments.map(
                      ({
                        investment,
                        deposit,
                      }) => (
                        <Link
                          key={deposit.id}
                          href={`/investment/investments/${encodeURIComponent(
                            investment.id,
                          )}/deposit`}
                          className="
                            group block
                            rounded-[22px]
                            border border-white/6
                            bg-[#0B1426]
                            p-4
                            shadow-lg
                            shadow-black/5
                            transition-all
                            duration-200
                            hover:border-emerald-400/15
                            hover:bg-[#0D172A]
                            active:scale-[0.99]
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-emerald-400/40
                          "
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <div className="mb-2 flex items-center gap-2">

                                <span
                                  className="
                                    inline-flex items-center gap-1.5
                                    rounded-full
                                    border border-emerald-400/15
                                    bg-emerald-400/10
                                    px-2.5 py-1
                                    text-[9px]
                                    font-bold
                                    text-emerald-300
                                  "
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.55)]" />

                                  Deposit required
                                </span>

                              </div>

                              <p className="truncate text-[13px] font-bold text-white">
                                {investment.planName || "Investment"}
                              </p>

                              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                                Required deposit
                              </p>

                              <p className="mt-1 text-[19px] font-black tracking-tight text-white">
                                {formatAmount(
                                  deposit.expectedAmount,
                                )}
                              </p>

                            </div>

                            <div
                              className="
                                flex h-9 w-9 shrink-0
                                items-center justify-center
                                rounded-xl
                                border border-white/8
                                bg-white/4
                                text-white/25
                                transition
                                group-hover:border-emerald-400/15
                                group-hover:bg-emerald-400/5
                                group-hover:text-emerald-400
                              "
                            >
                              <ChevronRight className="h-4 w-4" />
                            </div>

                          </div>

                          <div
                            className="
                              mt-4 grid grid-cols-2 gap-3
                              border-t border-white/6
                              pt-3
                            "
                          >

                            <div className="min-w-0">
                              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
                                Investment
                              </p>

                              <p className="mt-1 truncate text-[10px] font-semibold text-white/60">
                                {formatAmount(investment.amount)}
                              </p>
                            </div>

                            <div className="min-w-0">
                              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
                                Status
                              </p>

                              <p className="mt-1 truncate text-[10px] font-semibold text-emerald-300">
                                {getStatusLabel(deposit.status)}
                              </p>
                            </div>

                          </div>

                          <div className="mt-4">

                            <span
                              className="
                                inline-flex items-center gap-1.5
                                rounded-xl
                                bg-emerald-500
                                px-3.5 py-2.5
                                text-[10px] font-bold
                                text-[#04110C]
                                shadow-lg
                                shadow-emerald-500/10
                                transition
                                group-hover:bg-emerald-300
                              "
                            >
                              Continue deposit

                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>

                          </div>

                        </Link>
                      ),
                    )}

                  </div>
                </div>
              </section>
            )}

          {/* ==================================================================
              Loading
          ================================================================== */}

          {loading && (
            <div
              className="
                flex min-h-80
                flex-col items-center justify-center
                rounded-[26px]
                border border-white/8
                bg-[#0B1426]
                shadow-xl
                shadow-black/10
              "
            >
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  border border-emerald-400/10
                  bg-emerald-400/5
                "
              >
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
              </div>

              <p className="mt-4 text-[11px] font-semibold text-white/65">
                Loading your deposits...
              </p>

              <p className="mt-1 text-[9px] text-white/30">
                Please wait a moment.
              </p>
            </div>
          )}

          {/* ==================================================================
              Error
          ================================================================== */}

          {!loading && error && (
            <div
              className="
                rounded-[26px]
                border border-red-400/15
                bg-[#0B1426]
                p-5
                shadow-xl
                shadow-black/10
              "
            >
              <div className="flex items-start gap-3">

                <div
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-2xl
                    bg-red-400/10
                    text-red-400
                  "
                >
                  <CircleX className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-[12px] font-bold text-white">
                    Unable to load deposits
                  </h2>

                  <p className="mt-1 text-[10px] leading-5 text-red-300/75">
                    {error}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ==================================================================
              Empty State
          ================================================================== */}

          {!loading &&
            !error &&
            deposits.length === 0 && (
              <div
                className="
                  flex min-h-80
                  flex-col items-center justify-center
                  rounded-[26px]
                  border border-dashed border-white/10
                  bg-[#0B1426]
                  px-6
                  text-center
                  shadow-xl
                  shadow-black/10
                "
              >

                <div
                  className="
                    flex h-16 w-16
                    items-center justify-center
                    rounded-2xl
                    border border-white/6
                    bg-white/4
                    text-white/25
                  "
                >
                  <ReceiptText className="h-7 w-7" />
                </div>

                <h2 className="mt-5 text-[13px] font-bold text-white">
                  No investment deposits yet
                </h2>

                <p className="mt-2 max-w-sm text-[10px] leading-5 text-white/35">
                  Your investment deposit payments will appear here once you
                  start funding an investment.
                </p>

                <Link
                  href="/investment"
                  className="
                    mt-5
                    inline-flex items-center gap-1.5
                    rounded-xl
                    bg-emerald-500
                    px-4 py-2.5
                    text-[10px] font-bold
                    text-[#04110C]
                    shadow-lg
                    shadow-emerald-500/10
                    transition
                    hover:bg-emerald-300
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-emerald-400/50
                  "
                >
                  Explore investments

                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

              </div>
            )}

          {/* ==================================================================
              Deposit History
          ================================================================== */}

          {!loading &&
            !error &&
            deposits.length > 0 && (
              <section>

                <div className="mb-4 flex items-end justify-between px-1">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-purple-300">
                      Payment records
                    </p>

                    <h2 className="mt-1 text-[15px] font-black text-white">
                      Deposit history
                    </h2>

                    <p className="mt-1 text-[10px] text-white/35">
                      All investment deposit payments
                    </p>
                  </div>

                  <span
                    className="
                      rounded-full
                      border border-white/8
                      bg-white/4
                      px-2.5 py-1
                      text-[9px]
                      font-bold
                      text-white/45
                    "
                  >
                    {deposits.length}{" "}
                    {deposits.length === 1
                      ? "deposit"
                      : "deposits"}
                  </span>

                </div>

                <div className="space-y-3">

                  {deposits.map((deposit) => (
                    <Link
                      key={deposit.id}
                      href={getDepositHref(deposit)}
                      className="
                        group block
                        rounded-[22px]
                        border border-white/6
                        bg-[#0B1426]
                        p-4
                        shadow-lg
                        shadow-black/5
                        transition-all
                        duration-200
                        hover:border-emerald-400/15
                        hover:bg-[#0D172A]
                        hover:shadow-black/10
                        active:scale-[0.995]
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-emerald-400/40
                      "
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span
                              className={`
                                inline-flex
                                items-center gap-1.5
                                rounded-full
                                border
                                px-2.5 py-1
                                text-[9px]
                                font-bold
                                ${getStatusClasses(deposit.status)}
                              `}
                            >

                              <span
                                className={`
                                  h-1.5 w-1.5
                                  rounded-full
                                  ${getStatusDotClasses(
                                    deposit.status,
                                  )}
                                `}
                              />

                              <StatusIcon
                                status={deposit.status}
                              />

                              {getStatusLabel(
                                deposit.status,
                              )}

                            </span>

                          </div>

                          <p className="mt-3 text-[21px] font-black tracking-tight text-white">
                            {formatAmount(
                              deposit.expectedAmount,
                            )}
                          </p>

                          <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-white/30">
                            <Clock3 className="h-3 w-3" />

                            <span>
                              {formatDate(
                                deposit.createdAt,
                              )}
                            </span>
                          </div>

                        </div>

                        <div
                          className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-xl
                            border border-white/8
                            bg-white/4
                            text-white/20
                            transition
                            group-hover:border-emerald-400/15
                            group-hover:bg-emerald-400/5
                            group-hover:text-emerald-400
                          "
                        >
                          <ChevronRight className="h-4 w-4" />
                        </div>

                      </div>

                      <div
                        className="
                          mt-4 grid grid-cols-2 gap-3
                          border-t border-white/6
                          pt-3
                        "
                      >

                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
                            Received
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-white/65">
                            {formatAmount(
                              deposit.receivedAmount,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
                            Confirmations
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-white/65">
                            {deposit.confirmations}

                            <span className="text-white/20">
                              {" "}
                              /{" "}
                            </span>

                            {deposit.requiredConfirmations}
                          </p>
                        </div>

                      </div>

                      {/* Verifying */}

                      {deposit.status === "VERIFYING" && (
                        <div
                          className="
                            mt-4
                            flex items-center gap-2
                            rounded-2xl
                            border border-blue-400/10
                            bg-blue-400/5
                            px-3 py-2.5
                          "
                        >
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />

                          <span className="text-[9px] font-medium leading-4 text-blue-300/75">
                            Your payment is being verified. Tap to view the
                            investment deposit.
                          </span>
                        </div>
                      )}

                      {/* Pending */}

                      {deposit.status === "PENDING" && (
                        <div
                          className="
                            mt-4
                            flex items-center gap-2
                            rounded-2xl
                            border border-emerald-400/10
                            bg-emerald-400/5
                            px-3 py-2.5
                          "
                        >
                          <Clock3 className="h-3.5 w-3.5 text-emerald-400" />

                          <span className="text-[9px] font-medium leading-4 text-emerald-300/75">
                            Payment required. Tap to complete this investment
                            deposit.
                          </span>
                        </div>
                      )}

                    </Link>
                  ))}

                </div>
              </section>
            )}

        </div>
      </div>
    </main>
  );
}