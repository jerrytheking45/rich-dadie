// src/features/investment/context/SettingsContext.types.ts

import type {
  CurrencyCode,
  LanguageCode,
} from "../constants/settings";

export interface SettingsContextValue {
  /**
   * User's preferred display currency.
   *
   * Investment balances themselves remain stored
   * internally as USDT.
   */
  currency: CurrencyCode;

  /**
   * Change preferred display currency.
   */
  setCurrency: (currency: CurrencyCode) => void;

  /**
   * User's preferred language.
   */
  language: LanguageCode;

  /**
   * Change preferred language.
   */
  setLanguage: (language: LanguageCode) => void;

  /**
   * Intl locale associated with the language.
   */
  locale: string;

  /**
   * Text direction.
   */
  direction: "ltr" | "rtl";

  /**
   * Reset language and currency preferences.
   */
  resetSettings: () => void;
}