
// src/features/investment/components/BalanceCard.tsx

import {
  ArrowUpRight,
  Eye,
  EyeOff,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

import { useSettings } from "../context/useSettings";
import { useTranslation } from "../i18n/translations";

import type { InvestmentSummary } from "../types/investment";

interface BalanceCardProps {
  summary: InvestmentSummary;
}

/**
 * Format a monetary amount according to the user's
 * selected currency and locale.
 *
 * The currency comes from SettingsContext while the
 * locale is supplied by the selected language.
 */
function formatCurrency(
  amount: number,
  currency: string,
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
    // Safe fallback in case an unsupported locale/currency
    // combination is ever supplied.
    return `${currency} ${amount.toLocaleString(language)}`;
  }
}

/**
 * Returns a masked representation using the user's
 * selected currency instead of hard-coding UGX.
 */
function getMaskedBalance(currency: string): string {
  return `${currency} •••••••`;
}

function getMaskedEarnings(currency: string): string {
  return `${currency} •••••`;
}

export default function BalanceCard({
  summary,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  const { language, currency } = useSettings();

  const { t } = useTranslation();

  /**
   * Format all monetary values using:
   *
   * - selected application language
   * - selected application currency
   *
   * Example:
   *
   * English + USD → $1,250.00
   * English + UGX → UGX 1,250
   * French + EUR  → 1 250,00 €
   * Spanish + EUR → 1.250,00 €
   */
  const currentValue = formatCurrency(
    summary.currentValue,
    currency,
    language,
  );

  const projectedEarnings = formatCurrency(
    summary.projectedEarnings,
    currency,
    language,
  );

  const totalInvested = formatCurrency(
    summary.totalInvested,
    currency,
    language,
  );

  const maskedBalance = getMaskedBalance(currency);
  const maskedEarnings = getMaskedEarnings(currency);

  return (
    <section
      aria-label={t("balance.total_portfolio")}
      className="
        relative
        overflow-hidden
        rounded-[28px]
        bg-gradient-to-br
        from-emerald-700
        via-emerald-600
        to-emerald-500
        p-5
        text-white
        shadow-xl
        shadow-emerald-900/10
      "
    >
      {/* -----------------------------------------------------------
          Decorative background elements
      ------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-white/10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-12
          h-36
          w-36
          rounded-full
          bg-white/5
        "
      />

      <div className="relative">
        {/* ---------------------------------------------------------
            Header
        ---------------------------------------------------------- */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-white/15
                backdrop-blur-sm
              "
            >
              <WalletCards size={18} />
            </div>

            <span className="text-sm font-medium text-white/80">
              {t("balance.total_portfolio")}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-white/10
              transition
              hover:bg-white/20
              focus:outline-none
              focus:ring-2
              focus:ring-white/50
              focus:ring-offset-2
              focus:ring-offset-emerald-600
            "
            aria-label={
              visible
                ? t("balance.hide_balance")
                : t("balance.show_balance")
            }
            aria-pressed={visible}
          >
            {visible ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}
          </button>
        </div>

        {/* ---------------------------------------------------------
            Current value
        ---------------------------------------------------------- */}

        <div className="mt-6">
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-wider
              text-white/60
            "
          >
            {t("balance.current_value")}
          </p>

          <h1
            className="
              mt-1
              text-[30px]
              font-extrabold
              tracking-tight
              tabular-nums
            "
          >
            {visible ? currentValue : maskedBalance}
          </h1>
        </div>

        {/* ---------------------------------------------------------
            Projected earnings
        ---------------------------------------------------------- */}

        <div className="mt-5 flex items-center gap-2">
          <div
            className="
              flex
              items-center
              gap-1
              rounded-full
              bg-white/15
              px-2.5
              py-1
              text-xs
              font-semibold
              backdrop-blur-sm
            "
          >
            <ArrowUpRight
              size={13}
              aria-hidden="true"
            />

            <span className="tabular-nums">
              {visible
                ? projectedEarnings
                : maskedEarnings}
            </span>
          </div>

          <span className="text-xs text-white/65">
            {t("balance.projected_earnings")}
          </span>
        </div>

        {/* ---------------------------------------------------------
            Portfolio statistics
        ---------------------------------------------------------- */}

        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
            border-t
            border-white/15
            pt-4
          "
        >
          {/* Total invested */}

          <div>
            <p className="text-[11px] text-white/55">
              {t("balance.total_invested")}
            </p>

            <p
              className="
                mt-1
                text-sm
                font-bold
                tabular-nums
              "
            >
              {visible
                ? totalInvested
                : maskedEarnings}
            </p>
          </div>

          {/* Active investments */}

          <div>
            <p className="text-[11px] text-white/55">
              {t("balance.active_investments")}
            </p>

            <p
              className="
                mt-1
                text-sm
                font-bold
                tabular-nums
              "
            >
              {summary.activeInvestments.toLocaleString(
                language,
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}