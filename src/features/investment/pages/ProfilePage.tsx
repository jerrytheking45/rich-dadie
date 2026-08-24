// src/features/investment/pages/ProfilePage.tsx

import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  LogOut,
  PlusCircle,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InvestmentBottomNav from "../components/InvestmentBottomNav";

import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from "../constants/settings";
import { useSettings } from "../context/useSettings";
import { demoProfile } from "../data/profile-demo";
import { formatUSDT } from "../utils/currency";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currency, setCurrency, language, setLanguage } = useSettings();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // User data from demo profile
  const user = demoProfile;

  // Calculate balance from completed transactions (deposits minus withdrawals)
  const balance = user.transactions
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => {
      if (t.type === "DEPOSIT") return sum + t.amount;
      if (t.type === "WITHDRAWAL") return sum - t.amount;
      return sum;
    }, 0);

  // Total invested (sum of all completed deposits)
  const totalInvested = user.transactions
    .filter((t) => t.type === "DEPOSIT" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);

  // Active investments count (hardcoded for demo)
  const activeInvestments = 3;

  // Menu items for account management
  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      description: "Manage your personal details and avatar",
      path: "/investment/profile/info",
    },
    {
      icon: Wallet,
      label: "Payment Methods",
      description: "Manage your crypto wallets",
      path: "/investment/profile/payments",
    },
    {
      icon: DollarSign,
      label: "Deposit",
      description: "Add funds to your investment account",
      path: "/investment/profile/deposit",
    },
    {
      icon: CreditCard,
      label: "Withdraw",
      description: "Withdraw funds to your wallet",
      path: "/investment/profile/withdraw",
    },
    {
      icon: Clock,
      label: "Transaction History",
      description: "View all your transactions",
      path: "/investment/profile/transactions",
    },
    {
      icon: FileText,
      label: "Statements",
      description: "View and download statements",
      path: "/investment/profile/statements",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage notification preferences",
      path: "/investment/profile/notifications",
    },
    {
      icon: Shield,
      label: "Security",
      description: "Password and account security",
      path: "/investment/profile/security",
    },
  ];

  const selectedCurrency = SUPPORTED_CURRENCIES.find((item) => item.code === currency);
  const selectedLanguage = SUPPORTED_LANGUAGES.find((item) => item.code === language);

  const handleCurrencyChange = (code: typeof currency) => {
    setCurrency(code);
    setShowCurrencyDropdown(false);
  };

  const handleLanguageChange = (code: typeof language) => {
    setLanguage(code);
    setShowLanguageDropdown(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/investment");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-32 pt-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/investment")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
            aria-label="Back to investment home"
          >
            <ArrowLeft size={19} />
          </button>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Account</p>
            <h1 className="text-[19px] font-extrabold tracking-tight text-slate-900">Profile</h1>
          </div>
        </header>

        {/* Profile Hero */}
        <section className="mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-700 to-emerald-500 p-5 text-white shadow-lg">
          <div className="relative">
            <div className="absolute -right-14 -top-20 h-44 w-44 rounded-full bg-white/10" />

            <div className="relative">
              <div className="flex items-center gap-4">
                {/* Avatar with upload button */}
                <div className="relative">
                  <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-white/15 text-2xl font-extrabold text-white">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/investment/profile/info")}
                    className="absolute -bottom-1 -right-1 rounded-full bg-emerald-400 p-1 text-white shadow-sm hover:bg-emerald-300"
                    aria-label="Upload avatar"
                  >
                    <PlusCircle size={14} />
                  </button>
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-white/60">Team Member</p>
                  <h2 className="mt-1 truncate text-xl font-extrabold">{user.name}</h2>
                  <p className="mt-0.5 truncate text-[10px] text-white/65">{user.email}</p>
                  <div className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-1">
                    <span className="text-[9px] font-bold text-white/80">ID: {user.employeeId}</span>
                  </div>
                </div>
              </div>

              {/* Portfolio statistics */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-4">
                <ProfileStat
                  label="Balance"
                  value={formatUSDT(balance, currency)}
                />
                <ProfileStat
                  label="Invested"
                  value={formatUSDT(totalInvested, currency)}
                  positive
                />
                <ProfileStat
                  label="Active"
                  value={String(activeInvestments)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="mt-5 overflow-visible rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="px-5 pb-2 pt-5">
            <h2 className="text-[15px] font-extrabold text-slate-900">Preferences</h2>
            <p className="mt-0.5 text-[10px] text-slate-400">Customize your investment experience.</p>
          </div>

          {/* Currency */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCurrencyDropdown((v) => !v);
                setShowLanguageDropdown(false);
              }}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Currency</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Display investment values in your preferred currency</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="max-w-[90px] truncate text-[10px] font-bold text-slate-700">
                  {selectedCurrency?.label ?? currency}
                </span>
                <ChevronRight
                  size={16}
                  className={`text-slate-300 transition-transform ${showCurrencyDropdown ? "rotate-90" : ""}`}
                />
              </div>
            </button>

            {showCurrencyDropdown && (
              <div className="absolute left-4 right-4 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-xl">
                {SUPPORTED_CURRENCIES.map((item) => {
                  const selected = currency === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleCurrencyChange(item.code)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                        selected ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {selected && <span className="font-extrabold text-emerald-600">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mx-5 border-t border-slate-100" />

          {/* Language */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLanguageDropdown((v) => !v);
                setShowCurrencyDropdown(false);
              }}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Globe size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Language</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Choose the language used throughout the platform</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="max-w-[90px] truncate text-[10px] font-bold text-slate-700">
                  {selectedLanguage?.label ?? language}
                </span>
                <ChevronRight
                  size={16}
                  className={`text-slate-300 transition-transform ${showLanguageDropdown ? "rotate-90" : ""}`}
                />
              </div>
            </button>

            {showLanguageDropdown && (
              <div className="absolute left-4 right-4 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-xl">
                {SUPPORTED_LANGUAGES.map((item) => {
                  const selected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleLanguageChange(item.code)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                        selected ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {selected && <span className="font-extrabold text-emerald-600">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Account Menu */}
        <section className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="px-5 pb-2 pt-5">
            <h2 className="text-[15px] font-extrabold text-slate-900">Account</h2>
            <p className="mt-0.5 text-[10px] text-slate-400">Manage your account and investment activity.</p>
          </div>

          <div className="mt-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition hover:bg-slate-50 active:bg-slate-100 ${
                    index !== menuItems.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800">{item.label}</p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-slate-300" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Logout */}
        <section className="mt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-3.5 text-xs font-bold text-red-600 shadow-sm transition hover:bg-red-50 active:scale-[0.99]"
          >
            <LogOut size={17} /> Log Out
          </button>
        </section>

        {/* Footer */}
        <div className="pb-2 pt-6 text-center">
          <p className="text-[9px] text-slate-300">Golden Hills Employee Investment</p>
          <p className="mt-0.5 text-[8px] text-slate-300">Secure investment management</p>
        </div>
      </main>

      <InvestmentBottomNav />
    </div>
  );
};

/* ===============================================================
   PROFILE STAT
================================================================ */
function ProfileStat({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-medium text-white/55">{label}</p>
      <p className={`mt-1 truncate text-[11px] font-extrabold ${positive ? "text-emerald-100" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

export default ProfilePage;