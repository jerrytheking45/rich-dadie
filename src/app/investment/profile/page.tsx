"use client";

import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  DollarSign,
  Globe,
  Loader2,
  LogOut,
  PlusCircle,
  RefreshCw,
  Shield,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useAuth } from "@/src/components/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
} from "@/src/constants/settings";
import { useSettings } from "@/src/context/useSettings";
import { authApi } from "@/src/lib/api/auth";
import type { UserProfile } from "@/src/lib/types/investment";

const ProfilePage = () => {
  const router = useRouter();

  const { logout } = useAuth();
const [loggingOut, setLoggingOut] = useState(false);

  const {
    currency,
    setCurrency,
    language,
    setLanguage,
  } = useSettings();

  const [showCurrencyDropdown, setShowCurrencyDropdown] =
    useState(false);

  const [showLanguageDropdown, setShowLanguageDropdown] =
    useState(false);

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const userData = await authApi.getMe();

        if (cancelled) {
          return;
        }

        setUser(userData);
        setLoading(false);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load profile data:",
          err,
        );

        setError(
          "Failed to load your profile information.",
        );

        setLoading(false);
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshProfile = async () => {
    setRefreshing(true);
    setError("");

    try {
      const userData = await authApi.getMe();

      setUser(userData);
    } catch (err) {
      console.error(
        "Failed to refresh profile data:",
        err,
      );

      setError(
        "Failed to refresh your profile information.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      description:
        "Manage your personal details and avatar",
      path: "/investment/profile/info",
    },
    {
      icon: Users,
      label: "My Team",
      description:
        "Manage referrals, invited members and team earnings",
      path: "/investment/team",
    },
    {
      icon: Wallet,
      label: "Wallet",
      description:
        "Manage funds, wallets and financial activity",
      path: "/investment/wallet",
    },
    {
      icon: Bell,
      label: "Notifications",
      description:
        "Manage notification preferences",
      path: "/investment/profile/notifications",
    },
    {
      icon: Shield,
      label: "Security",
      description:
        "Password, PIN and account security",
      path: "/investment/profile/security",
    },
  ];

  const selectedCurrency =
    SUPPORTED_CURRENCIES.find(
      (item) => item.code === currency,
    );

  const selectedLanguage =
    SUPPORTED_LANGUAGES.find(
      (item) => item.code === language,
    );

  const handleCurrencyChange = (
    code: typeof currency,
  ) => {
    setCurrency(code);
    setShowCurrencyDropdown(false);
  };

  const handleLanguageChange = (
    code: typeof language,
  ) => {
    setLanguage(code);
    setShowLanguageDropdown(false);
  };

  const handleLogout = async () => {
  if (loggingOut) {
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to log out?",
  );

  if (!confirmed) {
    return;
  }

  setLoggingOut(true);
  setError("");

  try {
    await logout();
  } catch (err) {
    console.error("Logout failed:", err);

    setError(
      "Unable to log out right now. Please try again.",
    );
    setLoggingOut(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B18] text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="absolute -left-32 top-[42%] h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
        </div>

        <main className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-5 sm:px-6 lg:max-w-5xl">
          <div className="w-full max-w-md">
            <div className="rounded-[28px] border border-white/8 bg-[#0B1426] p-6 shadow-xl shadow-black/10">
              <div className="flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-[#07101F]">
                  <RefreshCw
                    size={19}
                    className="animate-spin text-emerald-400"
                  />
                </div>
              </div>

              <p className="mt-4 text-center text-sm font-bold text-white/75">
                Loading profile...
              </p>

              <p className="mt-1 text-center text-[10px] text-white/30">
                Preparing your account information
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute -left-32 top-[42%] h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <main className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push("/investment")
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/60 shadow-lg shadow-black/10 transition hover:bg-[#101D33] hover:text-white active:scale-95"
              aria-label="Back to investment home"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                Account
              </p>

              <h1 className="mt-0.5 truncate text-[19px] font-extrabold tracking-tight text-white">
                Profile
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              void refreshProfile()
            }
            disabled={refreshing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/60 shadow-lg shadow-black/10 transition hover:bg-[#101D33] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh profile"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
          </button>
        </header>

        {/* ERROR */}
        {error && (
          <section
            role="alert"
            className="mt-4 rounded-2xl border border-red-400/15 bg-red-400/5 p-4"
          >
            <p className="text-xs font-semibold text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void refreshProfile()
              }
              className="mt-3 rounded-xl bg-red-500 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-red-400"
            >
              Try Again
            </button>
          </section>
        )}

        {/* PROFILE HERO */}
        <section className="mt-5 overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="relative">
            <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-purple-500/10 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-emerald-500/5 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-17 w-17 shrink-0 items-center justify-center rounded-[22px] border border-white/10 bg-linear-to-br from-emerald-400/20 via-purple-400/10 to-blue-400/10 text-2xl font-extrabold text-white shadow-lg shadow-black/20">
                    {user?.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/investment/profile/info",
                      )
                    }
                    className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-xl border border-[#0B1426] bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95"
                    aria-label="Edit profile"
                  >
                    <PlusCircle size={14} />
                  </button>
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400/70">
                    User Profile
                  </p>

                  <h2 className="mt-1 truncate text-xl font-extrabold tracking-tight text-white">
                    {user?.name || "User"}
                  </h2>

                  <p className="mt-0.5 truncate text-[10px] text-white/40">
                    {user?.email}
                  </p>

                  <div className="mt-2 inline-flex rounded-full border border-white/8 bg-white/4 px-2.5 py-1">
                    <span className="text-[9px] font-bold text-white/50">
                      ID:{" "}
                      {user?.employeeId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* PROFILE DESCRIPTION */}
              <div className="mt-6 border-t border-white/8 pt-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/10 text-purple-300">
                    <User size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Account Profile
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white/75">
                      Manage your Rich Dadie account
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-white/35">
                      Update your personal information,
                      manage your wallet and team, configure
                      preferences, and keep your account secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACCOUNT MENU */}
        <section className="mt-5 overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
          <div className="px-5 pb-3 pt-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
              Account
            </p>

            <h2 className="mt-1 text-[15px] font-extrabold text-white">
              Account Settings
            </h2>

            <p className="mt-0.5 text-[10px] text-white/35">
              Manage your profile, wallet and security.
            </p>
          </div>

          <div>
            {menuItems.map(
              (item, index) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      router.push(item.path)
                    }
                    className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition hover:bg-white/3 active:bg-white/5 ${
                      index !==
                      menuItems.length - 1
                        ? "border-b border-white/6"
                        : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/7 bg-[#07101F] text-white/45">
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white/80">
                          {item.label}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-white/30">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className="shrink-0 text-white/20"
                    />
                  </button>
                );
              },
            )}
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="relative z-20 mt-5 overflow-visible rounded-[26px] border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
          <div className="px-5 pb-3 pt-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
              Personalization
            </p>

            <h2 className="mt-1 text-[15px] font-extrabold text-white">
              Preferences
            </h2>

            <p className="mt-0.5 text-[10px] text-white/30">
              Customize your investment experience.
            </p>
          </div>

          {/* CURRENCY */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCurrencyDropdown(true);
                setShowLanguageDropdown(false);
              }}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-emerald-400">
                  <DollarSign size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-white/80">
                    Currency
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/30">
                    Display values in your preferred currency
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span className="max-w-22.5 truncate text-[10px] font-bold text-white/60">
                  {selectedCurrency?.label ??
                    currency}
                </span>

                <ChevronRight
                  size={16}
                  className="text-white/20"
                />
              </div>
            </button>
          </div>

          <div className="mx-5 border-t border-white/6" />

          {/* LANGUAGE */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLanguageDropdown(true);
                setShowCurrencyDropdown(false);
              }}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/10 text-blue-400">
                  <Globe size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-white/80">
                    Language
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/30">
                    Choose the language used throughout the
                    platform
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span className="max-w-22.5 truncate text-[10px] font-bold text-white/60">
                  {selectedLanguage?.label ??
                    language}
                </span>

                <ChevronRight
                  size={16}
                  className="text-white/20"
                />
              </div>
            </button>
          </div>
        </section>

        {/* CURRENCY MODAL */}
        {showCurrencyDropdown && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="currency-modal-title"
            onClick={() =>
              setShowCurrencyDropdown(false)
            }
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/50"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-emerald-400">
                    <DollarSign size={18} />
                  </div>

                  <div>
                    <p
                      id="currency-modal-title"
                      className="text-sm font-extrabold text-white"
                    >
                      Choose Currency
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/35">
                      Select the currency used throughout
                      Rich Dadie
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrencyDropdown(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white/45 transition hover:bg-white/8 hover:text-white active:scale-95"
                  aria-label="Close currency selector"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-3">
                <div className="space-y-1.5">
                  {SUPPORTED_CURRENCIES.map(
                    (item) => {
                      const selected =
                        currency === item.code;

                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() =>
                            handleCurrencyChange(
                              item.code,
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.99] ${
                            selected
                              ? "border-emerald-400/20 bg-emerald-400/10"
                              : "border-transparent bg-white/3 hover:border-white/8 hover:bg-white/6"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                                selected
                                  ? "bg-emerald-400/15 text-emerald-400"
                                  : "bg-white/5 text-white/40"
                              }`}
                            >
                              {item.code
                                .slice(0, 3)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`truncate text-xs font-bold ${
                                  selected
                                    ? "text-white"
                                    : "text-white/70"
                                }`}
                              >
                                {item.label}
                              </p>

                              {selected && (
                                <p className="mt-0.5 text-[9px] font-semibold text-emerald-400/70">
                                  Currently selected
                                </p>
                              )}
                            </div>
                          </div>

                          {selected && (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#050B18]">
                              <Check
                                size={15}
                                strokeWidth={3}
                              />
                            </div>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="border-t border-white/8 px-5 py-3.5">
                <p className="text-center text-[9px] text-white/25">
                  Rich Dadie currency preferences
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LANGUAGE MODAL */}
        {showLanguageDropdown && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-modal-title"
            onClick={() =>
              setShowLanguageDropdown(false)
            }
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/50"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/10 text-blue-400">
                    <Globe size={18} />
                  </div>

                  <div>
                    <p
                      id="language-modal-title"
                      className="text-sm font-extrabold text-white"
                    >
                      Choose Language
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/35">
                      Select your preferred platform language
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowLanguageDropdown(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white/45 transition hover:bg-white/8 hover:text-white active:scale-95"
                  aria-label="Close language selector"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-3">
                <div className="space-y-1.5">
                  {SUPPORTED_LANGUAGES.map(
                    (item) => {
                      const selected =
                        language === item.code;

                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() =>
                            handleLanguageChange(
                              item.code,
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.99] ${
                            selected
                              ? "border-blue-400/20 bg-blue-400/10"
                              : "border-transparent bg-white/3 hover:border-white/8 hover:bg-white/6"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                                selected
                                  ? "bg-blue-400/15 text-blue-400"
                                  : "bg-white/5 text-white/40"
                              }`}
                            >
                              {item.code
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`truncate text-xs font-bold ${
                                  selected
                                    ? "text-white"
                                    : "text-white/70"
                                }`}
                              >
                                {item.label}
                              </p>

                              {selected && (
                                <p className="mt-0.5 text-[9px] font-semibold text-blue-400/70">
                                  Currently selected
                                </p>
                              )}
                            </div>
                          </div>

                          {selected && (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-400 text-[#050B18]">
                              <Check
                                size={15}
                                strokeWidth={3}
                              />
                            </div>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="border-t border-white/8 px-5 py-3.5">
                <p className="text-center text-[9px] text-white/25">
                  Rich Dadie language preferences
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LOGOUT */}
<section className="mt-5">
  <button
    type="button"
    onClick={() => void handleLogout()}
    disabled={loggingOut}
    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/10 bg-red-400/5 py-3.5 text-xs font-bold text-red-400 shadow-lg shadow-black/10 transition hover:bg-red-400/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loggingOut ? (
      <Loader2
        size={17}
        className="animate-spin"
      />
    ) : (
      <LogOut size={17} />
    )}

    {loggingOut ? "Logging out..." : "Log Out"}
  </button>
</section>

        <div className="pb-2 pt-6 text-center">
          <p className="text-[9px] text-white/20">
            Rich Dadie Employee Investment
          </p>

          <p className="mt-0.5 text-[8px] text-white/15">
            Secure investment management
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;