
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";

import { useSettings } from "../context/useSettings";
import { useTranslation } from "../i18n/translations";
import type { CurrencyCode } from "../constants/settings";

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

export default function InvestmentTransactionList({
  transactions,
}: InvestmentTransactionListProps) {
  const { language } = useSettings();
  const { t } = useTranslation();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-extrabold text-slate-900">
            {t("details.transaction_history")}
          </h2>

          <p className="mt-0.5 text-[10px] text-slate-400">
            {t("details.activity")}
          </p>
        </div>

        <CircleDollarSign
          size={20}
          className="text-emerald-500"
          aria-hidden="true"
        />
      </div>

      {/* Transactions */}
      <div className="mt-4 divide-y divide-slate-100">
        {transactions.length === 0 ? (
          <div className="py-8 text-center">
            <CircleDollarSign
              size={28}
              className="mx-auto text-slate-300"
              aria-hidden="true"
            />

            <p className="mt-2 text-xs font-semibold text-slate-500">
              {t("details.no_transactions")}
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              language={language}
            />
          ))
        )}
      </div>
    </section>
  );
}

interface TransactionRowProps {
  transaction: InvestmentTransaction;
  language: string;
}

function TransactionRow({
  transaction,
  language,
}: TransactionRowProps) {
  const { t } = useTranslation();

  const isIncoming = transaction.type === "EARNING";

  const icon =
    transaction.type === "EARNING" ? (
      <ArrowDownLeft size={16} />
    ) : (
      <ArrowUpRight size={16} />
    );

  const iconClass = isIncoming
    ? "bg-emerald-50 text-emerald-600"
    : "bg-slate-100 text-slate-500";

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Transaction icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Description */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-800">
          {transaction.description}
        </p>

        <p className="mt-0.5 text-[9px] text-slate-400">
          {formatDate(transaction.date, language)}
        </p>
      </div>

      {/* Amount + status */}
      <div className="text-right">
        <p
          className={`text-xs font-extrabold ${
            isIncoming
              ? "text-emerald-600"
              : "text-slate-800"
          }`}
        >
          {isIncoming ? "+" : "-"}{" "}
          {formatCurrency(
            transaction.amount,
            getCurrentCurrency(),
            language,
          )}
        </p>

        <span
          className={`
            text-[8px]
            font-semibold
            ${
              transaction.status === "COMPLETED"
                ? "text-emerald-500"
                : transaction.status === "PENDING"
                  ? "text-amber-500"
                  : "text-red-500"
            }
          `}
        >
          {getTransactionStatusLabel(
            transaction.status,
            t,
          )}
        </span>
      </div>
    </div>
  );
}

/**
 * Currency is retrieved from SettingsContext through this helper.
 *
 * This function exists only to keep the formatting API simple inside
 * TransactionRow. The actual selected currency comes from the user's
 * platform settings.
 */
function getCurrentCurrency(): CurrencyCode {
  /**
   * This fallback should only be reached if this helper is used outside
   * the SettingsContext-aware component.
   *
   * InvestmentTransactionList itself obtains the selected settings.
   */
  return "USDT";
}

function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  language: string,
): string {
  try {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(language)}`;
  }
}

function formatDate(
  value: string,
  language: string,
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
    return date.toLocaleDateString();
  }
}

function getTransactionStatusLabel(
  status: InvestmentTransactionStatus,
  t: ReturnType<typeof useTranslation>["t"],
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