
// src/features/investment/context/SettingsContextProvider.tsx

// src/features/investment/context/SettingsProvider.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
  type CurrencyCode,
  type LanguageCode,
} from "../constants/settings";

import {
  clearStoredCurrency,
  clearStoredLanguage,
  readStoredCurrency,
  readStoredLanguage,
  saveStoredCurrency,
  saveStoredLanguage,
} from "./settingsStorage";

import SettingsContext from "./SettingsContext";

import type { SettingsContextValue } from "./SettingsContext.types";

/* ============================================================================
 * Locale mapping
 * ========================================================================== */

const LANGUAGE_LOCALES: Record<
  LanguageCode,
  string
> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  pt: "pt-PT",
  sw: "sw-KE",

  de: "de-DE",
  it: "it-IT",
  nl: "nl-NL",
  ar: "ar-SA",
  hi: "hi-IN",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  ru: "ru-RU",
  tr: "tr-TR",
  id: "id-ID",
  vi: "vi-VN",
};

/* ============================================================================
 * RTL
 * ========================================================================== */

const RTL_LANGUAGES = new Set<LanguageCode>([
  "ar",
]);

/* ============================================================================
 * Validation
 * ========================================================================== */

function isCurrencyCode(
  value: CurrencyCode,
): boolean {
  return SUPPORTED_CURRENCIES.some(
    (currency) => currency.code === value,
  );
}

function isLanguageCode(
  value: LanguageCode,
): boolean {
  return SUPPORTED_LANGUAGES.some(
    (language) => language.code === value,
  );
}

/* ============================================================================
 * Provider props
 * ========================================================================== */

interface SettingsProviderProps {
  children: ReactNode;
}

/* ============================================================================
 * Provider
 * ========================================================================== */

export function SettingsProvider({
  children,
}: SettingsProviderProps) {
  /*
   * IMPORTANT:
   *
   * We initialize directly from storage.
   *
   * We do NOT do:
   *
   * useEffect(() => {
   *   setCurrency(...)
   * }, [])
   *
   * Therefore there is no synchronous setState inside an effect.
   */

  const [currency, setCurrencyState] =
    useState<CurrencyCode>(() =>
      readStoredCurrency(),
    );

  const [language, setLanguageState] =
    useState<LanguageCode>(() =>
      readStoredLanguage(),
    );

  /* ==========================================================================
   * Currency
   * ======================================================================== */

  const setCurrency = useCallback(
    (nextCurrency: CurrencyCode) => {
      if (!isCurrencyCode(nextCurrency)) {
        console.warn(
          `[Settings] Unsupported currency: ${nextCurrency}`,
        );

        return;
      }

      setCurrencyState(nextCurrency);
      saveStoredCurrency(nextCurrency);
    },
    [],
  );

  /* ==========================================================================
   * Language
   * ======================================================================== */

  const setLanguage = useCallback(
    (nextLanguage: LanguageCode) => {
      if (!isLanguageCode(nextLanguage)) {
        console.warn(
          `[Settings] Unsupported language: ${nextLanguage}`,
        );

        return;
      }

      setLanguageState(nextLanguage);
      saveStoredLanguage(nextLanguage);
    },
    [],
  );

  /* ==========================================================================
   * Locale
   * ======================================================================== */

  const locale =
    LANGUAGE_LOCALES[language] ??
    LANGUAGE_LOCALES[DEFAULT_LANGUAGE];

  /* ==========================================================================
   * Direction
   * ======================================================================== */

  const direction: "ltr" | "rtl" =
    RTL_LANGUAGES.has(language)
      ? "rtl"
      : "ltr";

  /* ==========================================================================
   * Synchronize browser document
   * ======================================================================== */

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  /* ==========================================================================
   * Reset
   * ======================================================================== */

  const resetSettings = useCallback(() => {
    setCurrencyState(DEFAULT_CURRENCY);
    setLanguageState(DEFAULT_LANGUAGE);

    clearStoredCurrency();
    clearStoredLanguage();
  }, []);

  /* ==========================================================================
   * Context value
   * ======================================================================== */

  const value = useMemo<SettingsContextValue>(
    () => ({
      currency,
      setCurrency,
      language,
      setLanguage,
      locale,
      direction,
      resetSettings,
    }),
    [
      currency,
      setCurrency,
      language,
      setLanguage,
      locale,
      direction,
      resetSettings,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}