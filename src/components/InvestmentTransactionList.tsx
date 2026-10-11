
"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import { useSettings } from "../context/useSettings";
import { useTranslation } from "../i18n/translations";

import type { CurrencyCode } from "../constants/settings";

/* ==========================================
   TYPES
========================================== */

export type InvestmentTransactionType =
  | "INVESTMENT"
  | "EARNING"
  | "FEE"
  | "WITHDRAWAL";

export type InvestmentTransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "FAILED";

export interface InvestmentTransaction {
  id: string;
  type: InvestmentTransactionType;
  description: string;
  amount: number;
  date: string;
  status: InvestmentTransactionStatus;
}

interface InvestmentTransactionListProps {
  transactions: InvestmentTransaction[];
}

/* ==========================================
   FORMATTERS
========================================== */

function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  language: string
): string {
  const safeAmount = Number.isFinite(amount)
    ? Math.abs(amount)
    : 0;

  try {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${currency} ${safeAmount.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  }
}

function formatDate(
  value: string,
  language: string
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }
}

/* ==========================================
   TRANSACTION LIST
========================================== */

export default function InvestmentTransactionList({
  transactions,
}: InvestmentTransactionListProps) {
  const { language, currency } = useSettings();
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="investment-transactions-title"
      className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] shadow-lg shadow-black/10"
    >
      {/* REDIQ HEADER ACCENT */}
      <div
        aria-hidden="true"
        className="h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/50 to-transparent"
      />

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h2
            id="investment-transactions-title"
            className="text-sm font-black tracking-tight text-white sm:text-[15px]"
          >
            {t("details.transaction_history")}
          </h2>

          <p className="mt-1 text-[10px] text-white/40">
            {t("details.activity")}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
          <CircleDollarSign
            size={18}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* TRANSACTION CONTENT */}
      <div className="px-3 sm:px-4">
        {transactions.length === 0 ? (
          <div className="flex min-h-37.5 flex-col items-center justify-center px-3 py-7 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.035]">
              <CircleDollarSign
                size={22}
                className="text-white/30"
                aria-hidden="true"
              />
            </div>

            <p className="mt-3 text-xs font-semibold text-white/55">
              {t("details.no_transactions")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/8">
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                language={language}
                currency={currency}
              />
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      {transactions.length > 0 && (
        <div className="border-t border-white/8 bg-[#07101F]/40 px-4 py-2.5 sm:px-5">
          <p className="text-center text-[9px] text-white/35">
            {transactions.length.toLocaleString(language)}{" "}
            {transactions.length === 1
              ? "transaction"
              : "transactions"}
          </p>
        </div>
      )}
    </section>
  );
}

/* ==========================================
   TRANSACTION ROW
========================================== */

interface TransactionRowProps {
  transaction: InvestmentTransaction;
  language: string;
  currency: CurrencyCode;
}

function TransactionRow({
  transaction,
  language,
  currency,
}: TransactionRowProps) {
  const { t } = useTranslation();

  const isIncoming = transaction.type === "EARNING";

  const statusLabel = getTransactionStatusLabel(
    transaction.status,
    t
  );

  const statusClass = getStatusClass(transaction.status);

  return (
    <div className="group flex min-w-0 items-center gap-2.5 py-3 transition-colors duration-200 hover:bg-white/1.5 sm:gap-3 sm:py-3.5">

      {/* TRANSACTION ICON */}
      <div
        aria-hidden="true"
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center",
          "rounded-xl border transition-colors",
          isIncoming
            ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
            : "border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]",
        ].join(" ")}
      >
        {isIncoming ? (
          <ArrowDownLeft
            size={16}
            strokeWidth={2.2}
          />
        ) : (
          <ArrowUpRight
            size={16}
            strokeWidth={2.2}
          />
        )}
      </div>

      {/* TRANSACTION INFORMATION */}
      <div className="min-w-0 flex-1">
        <p
          title={transaction.description}
          className="truncate text-[11px] font-bold text-white/90 sm:text-xs"
        >
          {transaction.description}
        </p>

        <p className="mt-1 text-[9px] text-white/40 sm:text-[10px]">
          {formatDate(transaction.date, language)}
        </p>
      </div>

      {/* AMOUNT AND STATUS */}
      <div className="min-w-0 max-w-[46%] shrink-0 text-right sm:max-w-[50%]">

        <p
          title={`${
            isIncoming ? "+" : "-"
          } ${formatCurrency(
            transaction.amount,
            currency,
            language
          )}`}
          className={[
            "min-w-0 wrap-break-words text-[11px] font-black leading-4 tabular-nums sm:text-xs",
            isIncoming
              ? "text-emerald-300"
              : "text-white/90",
          ].join(" ")}
        >
          {isIncoming ? "+" : "−"}{" "}
          {formatCurrency(
            transaction.amount,
            currency,
            language
          )}
        </p>

        {/* STATUS */}
        <div className="mt-1 flex justify-end">
          <span
            className={[
              "inline-flex items-center gap-1 rounded-full border",
              "px-1.5 py-0.5 text-[8px] font-bold sm:px-2 sm:text-[9px]",
              statusClass,
            ].join(" ")}
          >
            {transaction.status === "COMPLETED" ? (
              <CheckCircle2
                size={10}
                aria-hidden="true"
              />
            ) : transaction.status === "PENDING" ? (
              <Clock3
                size={10}
                aria-hidden="true"
              />
            ) : (
              <XCircle
                size={10}
                aria-hidden="true"
              />
            )}

            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   STATUS HELPERS
========================================== */

function getStatusClass(
  status: InvestmentTransactionStatus
): string {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-400/15 bg-emerald-400/10 text-emerald-300";

    case "PENDING":
      return "border-white/10 bg-white/5 text-white/55";

    case "FAILED":
      return "border-red-400/20 bg-red-500/10 text-red-300";

    default:
      return "border-white/10 bg-white/5 text-white/50";
  }
}

function getTransactionStatusLabel(
  status: InvestmentTransactionStatus,
  t: ReturnType<typeof useTranslation>["t"]
): string {
  switch (status) {
    case "COMPLETED":
      return t("transaction.completed");

    case "PENDING":
      return t("transaction.pending");

    case "FAILED":
      return t("transaction.failed");

    default:
      return status;
  }
}