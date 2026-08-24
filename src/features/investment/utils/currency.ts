
// src/features/investment/utils/currency.ts

import {
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from "../constants/settings";

/* ============================================================================
 * Types
 * ========================================================================== */

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  label: string;
  perUSDT: number;
}

/* ============================================================================
 * Default exchange rates
 *
 * IMPORTANT:
 * These are frontend fallback/demo rates.
 *
 * Production financial calculations should come from your backend.
 * ========================================================================== */

const DEFAULT_USDT_RATES: Partial<
  Record<CurrencyCode, number>
> = {
  USDT: 1,

  USD: 1,

  UGX: 3720,

  EUR: 0.86,
  GBP: 0.75,

  KES: 129,
  TZS: 2620,
  RWF: 1450,

  NGN: 1530,
  ZAR: 17.8,
  GHS: 11.2,
  ETB: 145,

  INR: 87,
  CNY: 7.2,
  JPY: 147,
  KRW: 1380,

  AED: 3.67,
  SAR: 3.75,
  TRY: 41,

  BRL: 5.45,
  CAD: 1.38,

  AUD: 1.52,

  CHF: 0.79,
  SGD: 1.29,
  HKD: 7.8,
};

/* ============================================================================
 * Currency
 * ========================================================================== */

export function getCurrency(
  currencyCode: CurrencyCode,
) {
  return SUPPORTED_CURRENCIES.find(
    (currency) =>
      currency.code === currencyCode,
  );
}

/* ============================================================================
 * Exchange rate
 *
 * 1 USDT = X selected currency
 * ========================================================================== */

export function getExchangeRate(
  currencyCode: CurrencyCode,
): number {
  if (currencyCode === "USDT") {
    return 1;
  }

  return (
    DEFAULT_USDT_RATES[currencyCode] ?? 1
  );
}

/* ============================================================================
 * USDT → selected currency
 * ========================================================================== */

export function convertFromUSDT(
  amountUSDT: number,
  currencyCode: CurrencyCode,
): number {
  if (!Number.isFinite(amountUSDT)) {
    return 0;
  }

  return (
    amountUSDT *
    getExchangeRate(currencyCode)
  );
}

export function getDisplayAmount(
  amountUSDT: number,
  currencyCode: CurrencyCode,
): number {
  return convertFromUSDT(
    amountUSDT,
    currencyCode,
  );
}

/* ============================================================================
 * Selected currency → USDT
 * ========================================================================== */

export function convertToUSDT(
  amount: number,
  currencyCode: CurrencyCode,
): number {
  if (!Number.isFinite(amount)) {
    return 0;
  }

  if (currencyCode === "USDT") {
    return amount;
  }

  const rate =
    getExchangeRate(currencyCode);

  if (!Number.isFinite(rate) || rate <= 0) {
    return 0;
  }

  return amount / rate;
}

export function parseToUSDT(
  amount: number,
  currencyCode: CurrencyCode,
): number {
  return convertToUSDT(
    amount,
    currencyCode,
  );
}

/* ============================================================================
 * Format canonical USDT amount
 *
 * IMPORTANT:
 *
 * amountUSDT is ALWAYS USDT.
 *
 * 268 USDT → USDT 268
 *
 * 268 USDT → UGX 996,960
 * ========================================================================== */

// src/features/investment/utils/currency.ts

export function formatUSDT(
  amountUSDT: number,
  currencyCode: CurrencyCode = "USDT",
): string {
  const displayAmount = convertFromUSDT(
    amountUSDT,
    currencyCode,
  );

  const currency = getCurrency(currencyCode);

  const symbol =
    currency?.symbol ??
    currencyCode;

  try {
    if (currencyCode === "USDT") {
      return `USDT ${new Intl.NumberFormat(
        "en-US",
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      ).format(displayAmount)}`;
    }

    return new Intl.NumberFormat(
      "en-US",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      },
    )
      .format(displayAmount)
      .replace(/^/, `${symbol} `);
  } catch {
    return `${symbol} ${displayAmount.toLocaleString()}`;
  }
}

/* ============================================================================
 * formatCurrency
 *
 * This function is retained for compatibility.
 *
 * IMPORTANT:
 *
 * `formatCurrency()` assumes amount is ALREADY in the selected currency.
 *
 * For investment balances stored in USDT use:
 *
 * formatUSDT(amountUSDT, currency)
 * ========================================================================== */

export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = "USDT",
): string {
  const currency =
    getCurrency(currencyCode);

  const symbol =
    currency?.symbol ?? currencyCode;

  try {
    if (currencyCode === "USDT") {
      return `USDT ${new Intl.NumberFormat(
        "en-US",
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      ).format(amount)}`;
    }

    return `${symbol} ${new Intl.NumberFormat(
      "en-US",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      },
    ).format(amount)}`;
  } catch {
    return `${symbol} ${amount.toLocaleString(
      "en-US",
    )}`;
  }
}

/* ============================================================================
 * Investment balance
 * ========================================================================== */

export function formatInvestmentBalance(
  amountUSDT: number,
  currencyCode: CurrencyCode,
): string {
  return formatUSDT(
    amountUSDT,
    currencyCode,
  );
}

/* ============================================================================
 * Rounding
 * ========================================================================== */

export function roundMoney(
  amount: number,
  decimals = 2,
): number {
  const multiplier =
    Math.pow(10, decimals);

  return (
    Math.round(
      (amount + Number.EPSILON) *
        multiplier,
    ) / multiplier
  );
}

/* ============================================================================
 * Rate aliases
 * ========================================================================== */

export function getRate(
  currencyCode: CurrencyCode,
): number {
  return getExchangeRate(
    currencyCode,
  );
}

export function formatExchangeRate(
  currencyCode: CurrencyCode,
): string {
  const rate =
    getExchangeRate(currencyCode);

  const currency =
    getCurrency(currencyCode);

  const symbol =
    currency?.symbol ?? currencyCode;

  if (currencyCode === "USDT") {
    return "1 USDT = 1 USDT";
  }

  return `1 USDT = ${symbol} ${new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 2,
    },
  ).format(rate)}`;
}