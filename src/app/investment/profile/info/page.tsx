
// src/app/investment/profile/info/page.tsx



"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Fingerprint,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { investmentApi } from "@/src/lib/api/investmentApi";
import type { UserProfile } from "@/src/lib/types/investment";

export default function ProfileInfoPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Initial profile request.
   * State updates happen after the asynchronous API call.
   */
  useEffect(() => {
    let cancelled = false;

    const initializeProfile = async () => {
      try {
        const data = await investmentApi.getProfile();

        if (cancelled) return;

        setProfile(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load personal information:", err);

        setError(
          "Unable to retrieve your personal information. Please try again."
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

  /*
   * Manual refresh / retry.
   */
  const refreshProfile = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    setError(null);

    try {
      const data = await investmentApi.getProfile();

      setProfile(data);
    } catch (err) {
      console.error("Failed to refresh personal information:", err);

      setError(
        "Unable to refresh your personal information. Please try again."
      );
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  const initial =
    profile?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050B18] text-white">
      {/* AMBIENT BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-[#E60033]/8 blur-[85px]" />

        <div className="absolute -left-28 top-[52%] h-64 w-64 rounded-full bg-[#E60033]/5 blur-[85px]" />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-2xl px-3 pb-32 pt-4 min-[375px]:px-4 sm:px-6 sm:pt-6 lg:max-w-5xl lg:px-8">
        {/* HEADER */}
        <header className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => router.push("/investment/profile")}
              aria-label="Back to profile"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/65 transition hover:border-[#E60033]/30 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 sm:h-10 sm:w-10"
            >
              <ArrowLeft size={17} aria-hidden="true" />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#FF476B]">
                My Account
              </p>

              <h1 className="mt-0.5 text-[18px] font-black tracking-tight text-white min-[375px]:text-[20px] sm:text-[23px]">
                Personal Information
              </h1>

              <p className="mt-0.5 text-[10px] leading-4 text-white/40">
                Your registered account details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refreshProfile()}
            disabled={loading || refreshing}
            aria-label="Refresh personal information"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/60 transition hover:border-[#E60033]/30 hover:text-[#FF476B] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 sm:h-10 sm:w-10"
          >
            <RefreshCw
              size={16}
              className={loading || refreshing ? "animate-spin" : ""}
              aria-hidden="true"
            />
          </button>
        </header>

        {/* LOADING */}
        {loading && (
          <section
            aria-label="Loading personal information"
            aria-busy="true"
            className="mt-5 overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426] p-4 min-[375px]:p-5 sm:rounded-[26px] sm:p-6"
          >
            <div className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/8 sm:h-16 sm:w-16" />

                <div className="min-w-0 flex-1">
                  <div className="h-3 w-24 rounded-full bg-white/10" />

                  <div className="mt-3 h-4 w-40 max-w-full rounded-full bg-white/8" />

                  <div className="mt-2 h-3 w-28 rounded-full bg-white/5" />
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/5 bg-[#07101F] p-3.5"
                  >
                    <div className="h-2.5 w-20 rounded-full bg-white/10" />

                    <div className="mt-3 h-3.5 w-40 max-w-full rounded-full bg-white/5" />
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] text-white/40">
              Loading your personal information...
            </p>
          </section>
        )}

        {/* ERROR */}
        {!loading && error && (
          <section
            role="alert"
            className="mt-5 rounded-2xl border border-[#E60033]/25 bg-[#0B1426] p-5 text-center sm:p-6"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
              <AlertCircle size={21} aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-sm font-black text-white">
              Personal information unavailable
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-white/50">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void refreshProfile()}
              disabled={refreshing}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#E60033] px-5 text-[11px] font-extrabold text-white transition hover:bg-[#FF174B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
                aria-hidden="true"
              />

              {refreshing ? "Trying again..." : "Try Again"}
            </button>
          </section>
        )}

        {/* PROFILE */}
        {!loading && !error && profile && (
          <>
            {/* IDENTITY CARD */}
            <section className="relative mt-5 min-w-0 overflow-hidden rounded-[22px] border border-[#E60033]/20 bg-linear-to-br from-[#24101D] via-[#101827] to-[#0B1426] p-4 shadow-xl shadow-black/20 min-[375px]:p-5 sm:rounded-[26px] sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#E60033]/15 blur-[65px]"
              />

              <div className="relative flex min-w-0 items-center gap-3.5 sm:gap-4">
                {/* AVATAR */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#FF476B]/25 bg-linear-to-br from-[#E60033] to-[#720B29] text-[23px] font-black text-white shadow-lg shadow-[#E60033]/10 min-[375px]:h-16 min-[375px]:w-16 sm:h-[72px] sm:w-[72px] sm:text-[28px]">
                  {initial}
                </div>

                {/* IDENTITY */}
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF7895]">
                    REDIQ Member
                  </p>

                  <h2 className="mt-1 truncate text-[17px] font-black leading-tight tracking-tight text-white sm:text-xl">
                    {profile.name || "Account User"}
                  </h2>

                  <p className="mt-1 break-all text-[10px] leading-4 text-white/50 sm:text-[11px]">
                    {profile.email || "Email unavailable"}
                  </p>

                  <span className="mt-2 inline-flex max-w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[9px] font-bold text-white/60">
                    <span className="truncate">
                      ID: {profile.employeeId || "N/A"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="relative mt-5 border-t border-white/10 pt-4">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                    <ShieldCheck size={16} aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white/85">
                      Registered account information
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/40">
                      These details are retrieved from your REDIQ account.
                    </p>
                  </div>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[2px] bg-linear-to-r from-[#E60033] via-[#FF476B]/60 to-transparent"
              />
            </section>

            {/* DETAILS */}
            <section className="mt-6">
              <div className="mb-3">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#FF476B]">
                  Account Details
                </p>

                <h2 className="mt-1 text-sm font-black text-white sm:text-base">
                  Personal Information
                </h2>

                <p className="mt-1 text-[10px] text-white/40">
                  Information associated with your account.
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                <ProfileField
                  icon={UserRound}
                  label="Full Name"
                  value={profile.name}
                />

                <ProfileField
                  icon={Mail}
                  label="Email Address"
                  value={profile.email}
                />

                <ProfileField
                  icon={Fingerprint}
                  label="Employee ID"
                  value={profile.employeeId}
                />

                <ProfileField
                  icon={ShieldCheck}
                  label="Account Role"
                  value={formatRole(profile.role)}
                />

                <div className="sm:col-span-2">
                  <ProfileField
                    icon={CalendarDays}
                    label="Account Created"
                    value={formatDate(profile.createdAt)}
                  />
                </div>
              </div>
            </section>

            {/* INFORMATION NOTE */}
            <section className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-[#0B1426] p-3.5 sm:p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                <ShieldCheck size={16} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h3 className="text-[11px] font-bold text-white/85">
                  About your account details
                </h3>

                <p className="mt-1 text-[10px] leading-5 text-white/45">
                  This page displays the personal information currently
                  associated with your REDIQ account. Your account role
                  and registration date are shown for reference.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

/* ==========================================
   PROFILE DETAIL CARD
========================================== */

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/10 bg-[#0B1426] p-3.5 sm:p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E60033]/15 bg-[#E60033]/10 text-[#FF476B]">
        <Icon size={17} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/40">
          {label}
        </p>

        <p className="mt-1.5 wrap-break-words text-[11px] font-bold leading-5 text-white/85 sm:text-xs">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

/* ==========================================
   ROLE FORMATTER
========================================== */

function formatRole(role: UserProfile["role"]): string {
  switch (role) {
    case "superadmin":
      return "Super Admin";

    case "admin":
      return "Administrator";

    case "employee":
      return "Employee";

    default:
      return role || "—";
  }
}

/* ==========================================
   DATE FORMATTER
========================================== */

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}