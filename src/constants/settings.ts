// src/features/investment/constants/settings.ts

// -----------------------------------------------------------------------------
// Currency
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// USDT is the platform's default accounting currency.
//
// Investment amounts, balances, earnings and portfolio values should be stored
// internally as USDT.
//
// The user's selected currency is only used for display/conversion.
//
// Example:
//
//   Stored balance: 268 USDT
//   Preferred currency: UGX
//   Display: UGX 1,000,000
//
// The underlying balance is still 268 USDT.
// -----------------------------------------------------------------------------

export const DEFAULT_CURRENCY = "USDT" as const;

export type CurrencyCode =
  | "USDT"
  | "UGX"
  | "USD"
  | "EUR"
  | "GBP"
  | "KES"
  | "TZS"
  | "NGN"
  | "ZAR"
  | "GHS"
  | "RWF"
  | "ETB"
  | "INR"
  | "CNY"
  | "JPY"
  | "KRW"
  | "AED"
  | "SAR"
  | "TRY"
  | "BRL"
  | "CAD"
  | "AUD"
  | "CHF"
  | "SGD"
  | "HKD";

export interface SupportedCurrency {
  code: CurrencyCode;
  label: string;
  symbol: string;
  decimals: number;
}

/**
 * Currency metadata used throughout the investment platform.
 */
export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  {
    code: "USDT",
    label: "USDT — Tether",
    symbol: "USDT",
    decimals: 2,
  },
  {
    code: "UGX",
    label: "UGX — Ugandan Shilling",
    symbol: "UGX",
    decimals: 0,
  },
  {
    code: "USD",
    label: "USD — US Dollar",
    symbol: "$",
    decimals: 2,
  },
  {
    code: "EUR",
    label: "EUR — Euro",
    symbol: "€",
    decimals: 2,
  },
  {
    code: "GBP",
    label: "GBP — British Pound",
    symbol: "£",
    decimals: 2,
  },
  {
    code: "KES",
    label: "KES — Kenyan Shilling",
    symbol: "KES",
    decimals: 0,
  },
  {
    code: "TZS",
    label: "TZS — Tanzanian Shilling",
    symbol: "TZS",
    decimals: 0,
  },
  {
    code: "NGN",
    label: "NGN — Nigerian Naira",
    symbol: "₦",
    decimals: 0,
  },
  {
    code: "ZAR",
    label: "ZAR — South African Rand",
    symbol: "R",
    decimals: 2,
  },
  {
    code: "GHS",
    label: "GHS — Ghanaian Cedi",
    symbol: "GH₵",
    decimals: 2,
  },
  {
    code: "RWF",
    label: "RWF — Rwandan Franc",
    symbol: "RWF",
    decimals: 0,
  },
  {
    code: "ETB",
    label: "ETB — Ethiopian Birr",
    symbol: "ETB",
    decimals: 2,
  },
  {
    code: "INR",
    label: "INR — Indian Rupee",
    symbol: "₹",
    decimals: 2,
  },
  {
    code: "CNY",
    label: "CNY — Chinese Yuan",
    symbol: "¥",
    decimals: 2,
  },
  {
    code: "JPY",
    label: "JPY — Japanese Yen",
    symbol: "¥",
    decimals: 0,
  },
  {
    code: "KRW",
    label: "KRW — South Korean Won",
    symbol: "₩",
    decimals: 0,
  },
  {
    code: "AED",
    label: "AED — UAE Dirham",
    symbol: "AED",
    decimals: 2,
  },
  {
    code: "SAR",
    label: "SAR — Saudi Riyal",
    symbol: "SAR",
    decimals: 2,
  },
  {
    code: "TRY",
    label: "TRY — Turkish Lira",
    symbol: "₺",
    decimals: 2,
  },
  {
    code: "BRL",
    label: "BRL — Brazilian Real",
    symbol: "R$",
    decimals: 2,
  },
  {
    code: "CAD",
    label: "CAD — Canadian Dollar",
    symbol: "CA$",
    decimals: 2,
  },
  {
    code: "AUD",
    label: "AUD — Australian Dollar",
    symbol: "A$",
    decimals: 2,
  },
  {
    code: "CHF",
    label: "CHF — Swiss Franc",
    symbol: "CHF",
    decimals: 2,
  },
  {
    code: "SGD",
    label: "SGD — Singapore Dollar",
    symbol: "S$",
    decimals: 2,
  },
  {
    code: "HKD",
    label: "HKD — Hong Kong Dollar",
    symbol: "HK$",
    decimals: 2,
  },
];

// -----------------------------------------------------------------------------
// Language
// -----------------------------------------------------------------------------

export const DEFAULT_LANGUAGE = "en" as const;

export type LanguageCode =
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "sw"
  | "de"
  | "it"
  | "nl"
  | "ar"
  | "hi"
  | "zh"
  | "ja"
  | "ko"
  | "ru"
  | "tr"
  | "id"
  | "vi";

export interface SupportedLanguage {
  code: LanguageCode;
  label: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: "en",
    label: "English",
  },
  {
    code: "es",
    label: "Español",
  },
  {
    code: "fr",
    label: "Français",
  },
  {
    code: "pt",
    label: "Português",
  },
  {
    code: "sw",
    label: "Kiswahili",
  },
  {
    code: "de",
    label: "Deutsch",
  },
  {
    code: "it",
    label: "Italiano",
  },
  {
    code: "nl",
    label: "Nederlands",
  },
  {
    code: "ar",
    label: "العربية",
  },
  {
    code: "hi",
    label: "हिन्दी",
  },
  {
    code: "zh",
    label: "中文",
  },
  {
    code: "ja",
    label: "日本語",
  },
  {
    code: "ko",
    label: "한국어",
  },
  {
    code: "ru",
    label: "Русский",
  },
  {
    code: "tr",
    label: "Türkçe",
  },
  {
    code: "id",
    label: "Bahasa Indonesia",
  },
  {
    code: "vi",
    label: "Tiếng Việt",
  },
];