
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Globe2,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserRound,
  UsersRound,
  Wallet,
  X,
  Pencil,
} from "lucide-react";

import { useAuth } from "@/src/components/AuthProvider";
import {
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
} from "@/src/constants/settings";
import { useSettings } from "@/src/context/useSettings";
import { authApi } from "@/src/lib/api/auth";
import type { UserProfile } from "@/src/lib/types/investment";

type SettingsModal = "currency" | "language" | null;

const menuItems = [
  {
    icon: UserRound,
    label: "Personal Information",
    description: "Your personal details and avatar",
    path: "/investment/profile/info",
  },
  {
    icon: UsersRound,
    label: "My Team",
    description: "Referrals and team activity",
    path: "/investment/team",
  },
  {
    icon: Wallet,
    label: "My Wallet",
    description: "Balances and financial activity",
    path: "/investment/wallet",
  },
  {
    icon: Bell,
    label: "Notifications",
    description: "Your alerts and preferences",
    path: "/investment/profile/notifications",
  },
  {
    icon: ShieldCheck,
    label: "Security",
    description: "Password, PIN and account access",
    path: "/investment/profile/security",
  },
  {
    icon: CreditCard,
    label: "Payment Methods",
    description: "Manage your withdrawal wallet",
    path: "/investment/profile/payments",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();

  const {
    currency,
    setCurrency,
    language,
    setLanguage,
  } = useSettings();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<SettingsModal>(null);

  const refreshInProgress = useRef(false);

  /*
   * Initial profile request.
   *
   * The state updates occur after the asynchronous API
   * request settles, avoiding synchronous setState calls
   * in the effect body.
   */
  useEffect(() => {
    let cancelled = false;

    const initializeProfile = async () => {
      try {
        const profile = await authApi.getMe();

        if (cancelled) return;

        setUser(profile);
        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load profile:", err);

        setError(
          "We couldn't retrieve your profile. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initializeProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshProfile = async () => {
    if (refreshInProgress.current) return;

    refreshInProgress.current = true;
    setRefreshing(true);
    setError("");

    try {
      const profile = await authApi.getMe();
      setUser(profile);
    } catch (err) {
      console.error("Failed to refresh profile:", err);

      setError(
        "Unable to refresh your profile. Please try again."
      );
    } finally {
      refreshInProgress.current = false;
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    setLoggingOut(true);
    setError("");

    try {
      await logout();
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);

      setError(
        "Unable to log out right now. Please try again."
      );

      setLoggingOut(false);
    }
  };

  const selectedCurrency = SUPPORTED_CURRENCIES.find(
    (item) => item.code === currency
  );

  const selectedLanguage = SUPPORTED_LANGUAGES.find(
    (item) => item.code === language
  );

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050B18] px-4 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1426] p-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10">
            <Loader2
              size={21}
              className="animate-spin text-[#FF476B]"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-4 text-sm font-extrabold">
            Loading your profile
          </h1>

          <p className="mt-1 text-[11px] text-white/40">
            Retrieving your account information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-white">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E60033]/8 blur-[90px]" />
        <div className="absolute -left-28 top-[48%] h-64 w-64 rounded-full bg-[#E60033]/5 blur-[90px]" />
      </div>

      <main className="relative mx-auto w-full min-w-0 max-w-2xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:max-w-5xl lg:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/investment")}
              aria-label="Back to investment home"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 transition hover:border-[#E60033]/30 hover:text-white active:scale-95"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#FF476B]">
                My Account
              </p>

              <h1 className="mt-0.5 text-xl font-black tracking-tight sm:text-2xl">
                Profile
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refreshProfile()}
            disabled={refreshing}
            aria-label="Refresh profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/60 transition hover:border-[#E60033]/30 hover:text-[#FF476B] disabled:opacity-40"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </header>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-[#E60033]/25 bg-[#E60033]/8 p-3.5"
          >
            <p className="text-[11px] font-semibold leading-5 text-[#FF8DA5]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void refreshProfile()}
              disabled={refreshing}
              className="mt-2 text-[11px] font-extrabold text-white underline decoration-[#FF476B] underline-offset-4 disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )}

        {/* PROFILE CARD */}
        <section className="relative mt-5 min-w-0 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#24101D] via-[#101827] to-[#0B1426] p-4 shadow-xl shadow-black/20 min-[375px]:p-5 sm:rounded-[26px] sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#E60033]/15 blur-[65px]"
          />

          <div className="relative flex min-w-0 items-start gap-3.5 sm:gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF476B]/25 bg-linear-to-br from-[#E60033] to-[#720B29] text-[23px] font-black shadow-lg shadow-[#E60033]/10 min-[375px]:h-16 min-[375px]:w-16 sm:h-18 sm:w-18 sm:text-[28px]">
                {initial}
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/investment/profile/info")
                }
                aria-label="Edit personal information"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-[#0B1426] bg-[#E60033] text-white transition hover:bg-[#FF174B]"
              >
                <Pencil size={11} />
              </button>
            </div>

            {/* User info */}
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF7895]">
                REDIQ Member
              </p>

              <h2 className="mt-1 truncate text-[17px] font-black leading-tight tracking-tight sm:text-xl">
                {user?.name || "Account User"}
              </h2>

              <p className="mt-1 truncate text-[10px] text-white/50 sm:text-[11px]">
                {user?.email || "Email unavailable"}
              </p>

              <div className="mt-2.5 inline-flex max-w-full items-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
                <span className="truncate text-[9px] font-bold text-white/60">
                  Member ID: {user?.employeeId || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 min-[375px]:flex-row min-[375px]:items-center min-[375px]:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white/85">
                Manage your account
              </p>

              <p className="mt-1 text-[10px] leading-4 text-white/40">
                Keep your personal information up to date.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/investment/profile/info")
              }
              className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#E60033] px-3.5 text-[10px] font-extrabold text-white transition hover:bg-[#FF174B] active:scale-[0.98]"
            >
              Edit Profile
              <ChevronRight size={13} />
            </button>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/60 to-transparent"
          />
        </section>

        {/* ACCOUNT SETTINGS */}
        <section className="mt-6">
          <div className="mb-3">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
              Your Account
            </p>

            <h2 className="mt-1 text-sm font-black sm:text-base">
              Account Settings
            </h2>

            <p className="mt-1 text-[10px] text-white/40">
              Access and manage your REDIQ account.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => router.push(item.path)}
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#0B1426] p-3 text-left transition hover:border-[#E60033]/25 hover:bg-[#101D33] active:scale-[0.99] min-[375px]:p-3.5 sm:p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/15 bg-[#E60033]/10 text-[#FF476B]">
                    <Icon size={18} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold text-white/90 sm:text-xs">
                      {item.label}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/40">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={15}
                    className="shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-[#FF476B]"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="mt-6">
          <div className="mb-3">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
              Personalization
            </p>

            <h2 className="mt-1 text-sm font-black sm:text-base">
              Preferences
            </h2>

            <p className="mt-1 text-[10px] text-white/40">
              Customize how REDIQ appears to you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {/* Currency */}
            <button
              type="button"
              onClick={() => setModal("currency")}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#0B1426] p-3.5 text-left transition hover:border-[#E60033]/25 hover:bg-[#101D33] sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                <CreditCard size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold text-white/90 sm:text-xs">
                  Currency
                </p>

                <p className="mt-1 truncate text-[10px] text-white/45">
                  {selectedCurrency?.label ?? currency}
                </p>
              </div>

              <ChevronDown
                size={16}
                className="shrink-0 text-white/35 group-hover:text-[#FF476B]"
              />
            </button>

            {/* Language */}
            <button
              type="button"
              onClick={() => setModal("language")}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#0B1426] p-3.5 text-left transition hover:border-[#E60033]/25 hover:bg-[#101D33] sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                <Globe2 size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold text-white/90 sm:text-xs">
                  Language
                </p>

                <p className="mt-1 truncate text-[10px] text-white/45">
                  {selectedLanguage?.label ?? language}
                </p>
              </div>

              <ChevronDown
                size={16}
                className="shrink-0 text-white/35 group-hover:text-[#FF476B]"
              />
            </button>
          </div>
        </section>

        {/* LOGOUT */}
        <section className="mt-6">
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={loggingOut}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E60033]/25 bg-[#E60033]/8 px-4 text-xs font-extrabold text-[#FF7895] transition hover:border-[#E60033]/40 hover:bg-[#E60033]/15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <LogOut size={17} />
            )}

            {loggingOut ? "Logging out..." : "Log Out"}
          </button>
        </section>

        {/* FOOTER */}
        <footer className="pb-2 pt-7 text-center">
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-white/25">
            REDIQ
          </p>

          <p className="mt-1 text-[9px] text-white/20">
            Your investment account
          </p>
        </footer>
      </main>

      {/* CURRENCY MODAL */}
      {modal === "currency" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="currency-modal-title"
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 px-3 py-6 backdrop-blur-sm sm:px-4"
          onClick={() => setModal(null)}
        >
          <div
            className="flex w-full max-w-md flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader
              id="currency-modal-title"
              title="Choose Currency"
              subtitle="Select your preferred display currency"
              onClose={() => setModal(null)}
            />

            <div className="max-h-[min(65vh,500px)] space-y-1.5 overflow-y-auto p-3">
              {SUPPORTED_CURRENCIES.map((item) => {
                const selected = currency === item.code;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setCurrency(item.code);
                      setModal(null);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-[#E60033]/35 bg-[#E60033]/10"
                        : "border-transparent bg-white/3 hover:bg-white/6"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
                        selected
                          ? "bg-[#E60033]/20 text-[#FF7895]"
                          : "bg-white/5 text-white/45"
                      }`}
                    >
                      {item.code.slice(0, 3).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-white/85">
                        {item.label}
                      </p>

                      {selected && (
                        <p className="mt-0.5 text-[9px] text-[#FF7895]">
                          Currently selected
                        </p>
                      )}
                    </div>

                    {selected && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E60033] text-white">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LANGUAGE MODAL */}
      {modal === "language" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="language-modal-title"
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 px-3 py-6 backdrop-blur-sm sm:px-4"
          onClick={() => setModal(null)}
        >
          <div
            className="flex w-full max-w-md flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader
              id="language-modal-title"
              title="Choose Language"
              subtitle="Select your preferred platform language"
              onClose={() => setModal(null)}
            />

            <div className="max-h-[min(65vh,500px)] space-y-1.5 overflow-y-auto p-3">
              {SUPPORTED_LANGUAGES.map((item) => {
                const selected = language === item.code;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setModal(null);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-[#E60033]/35 bg-[#E60033]/10"
                        : "border-transparent bg-white/3 hover:bg-white/6"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
                        selected
                          ? "bg-[#E60033]/20 text-[#FF7895]"
                          : "bg-white/5 text-white/45"
                      }`}
                    >
                      {item.code.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-white/85">
                        {item.label}
                      </p>

                      {selected && (
                        <p className="mt-0.5 text-[9px] text-[#FF7895]">
                          Currently selected
                        </p>
                      )}
                    </div>

                    {selected && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E60033] text-white">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalHeader({
  id,
  title,
  subtitle,
  onClose,
}: {
  id: string;
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4 sm:px-5">
      <div className="min-w-0">
        <h2
          id={id}
          className="text-sm font-black text-white"
        >
          {title}
        </h2>

        <p className="mt-1 text-[10px] text-white/40">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close selection"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:text-white"
      >
        <X size={17} />
      </button>
    </div>
  );
}