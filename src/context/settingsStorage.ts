// src/features/investment/context/settingsStorage.ts

import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
  type CurrencyCode,
  type LanguageCode,
} from "../constants/settings";

/* ============================================================================
 * Storage keys
 * ========================================================================== */

export const CURRENCY_STORAGE_KEY = "pref_currency";
export const LANGUAGE_STORAGE_KEY = "pref_language";

/* ============================================================================
 * Validation
 * ========================================================================== */

function isCurrencyCode(
  value: string | null,
): value is CurrencyCode {
  if (!value) {
    return false;
  }

  return SUPPORTED_CURRENCIES.some(
    (currency) => currency.code === value,
  );
}

function isLanguageCode(
  value: string | null,
): value is LanguageCode {
  if (!value) {
    return false;
  }

  return SUPPORTED_LANGUAGES.some(
    (language) => language.code === value,
  );
}

/* ============================================================================
 * Currency
 * ========================================================================== */

export function readStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENCY;
  }

  try {
    const stored = window.localStorage.getItem(
      CURRENCY_STORAGE_KEY,
    );

    return isCurrencyCode(stored)
      ? stored
      : DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export function saveStoredCurrency(
  currency: CurrencyCode,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      CURRENCY_STORAGE_KEY,
      currency,
    );
  } catch {
    // Ignore storage errors.
  }
}

export function clearStoredCurrency(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      CURRENCY_STORAGE_KEY,
    );
  } catch {
    // Ignore storage errors.
  }
}

/* ============================================================================
 * Language
 * ========================================================================== */

export function readStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    const stored = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    );

    return isLanguageCode(stored)
      ? stored
      : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function saveStoredLanguage(
  language: LanguageCode,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language,
    );
  } catch {
    // Ignore storage errors.
  }
}

export function clearStoredLanguage(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      LANGUAGE_STORAGE_KEY,
    );
  } catch {
    // Ignore storage errors.
  }
}