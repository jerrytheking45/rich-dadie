// src/features/investment/utils/investmentMoney.ts

import type { CurrencyCode } from "../../constants/settings";

import {
  formatUSDT,
  getDisplayAmount,
  parseToUSDT,
} from "./currency";

/* ============================================================================
 * Canonical Investment Money
 * ========================================================================== */

export interface InvestmentMoney {
  /**
   * The platform's canonical investment amount.
   *
   * ALWAYS stored as USDT.
   */
  amountUSDT: number;
}

/* ============================================================================
 * Display
 * ========================================================================== */

export function displayInvestmentMoney(
  amountUSDT: number,
  currency: CurrencyCode,
): string {
  return formatUSDT(
    amountUSDT,
    currency,
  );
}

/* ============================================================================
 * Numeric display
 * ========================================================================== */

export function displayInvestmentAmount(
  amountUSDT: number,
  currency: CurrencyCode,
): number {
  return getDisplayAmount(
    amountUSDT,
    currency,
  );
}

/* ============================================================================
 * User input → USDT
 * ========================================================================== */

export function investmentInputToUSDT(
  amount: number,
  currency: CurrencyCode,
): number {
  return parseToUSDT(
    amount,
    currency,
  );
}