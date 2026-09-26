// src/app/investment/team/Page.tsx

"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Gift,
  Loader2,
  Share2,
  Users,
  Link2,
  Wallet,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import referralApi from "@/src/lib/api/referralApi";
import type {
  ReferralCodeResponse,
  ReferralSummary,
  ReferralTeamMember,
} from "@/src/lib/types/referral";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function safeString(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string" ? value : fallback;
}

function safeUpper(value: unknown): string {
  return safeString(value).trim().toUpperCase();
}

function safeNumber(
  value: unknown,
  fallback = 0,
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function formatUSDT(value: unknown): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNumber(value));
}

function formatDate(value: unknown): string {
  const raw = safeString(value).trim();

  if (!raw) {
    return "—";
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(value: unknown): string {
  const name = safeString(value).trim();

  if (!name) {
    return "?";
  }

  const parts = name
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Referral status                                                            */
/* -------------------------------------------------------------------------- */

function getStatusLabel(
  member: ReferralTeamMember,
): string {
  const referralStatus = safeUpper(
    member.referralStatus,
  );

  switch (referralStatus) {
    case "REWARDED":
      return "Rewarded";

    case "QUALIFIED":
      return "Qualified";

    case "PENDING":
      return "Pending";

    default:
      return "Pending";
  }
}

function getStatusClass(
  status: string,
): string {
  switch (status) {
    case "Rewarded":
      return "border-emerald-400/10 bg-emerald-400/10 text-emerald-300";

    case "Qualified":
      return "border-amber-400/10 bg-amber-400/10 text-amber-300";

    default:
      return "border-white/8 bg-white/5 text-white/45";
  }
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function TeamPage() {
  const router = useRouter();

  const [referralCode, setReferralCode] =
    useState<ReferralCodeResponse | null>(null);

  const [summary, setSummary] =
    useState<ReferralSummary | null>(null);

  const [members, setMembers] =
    useState<ReferralTeamMember[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [sharing, setSharing] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Referral link                                                            */
  /* ------------------------------------------------------------------------ */

  const referralLink = useMemo(() => {
    /*
     * The backend is the source of truth.
     * If it provides a complete referral link, use it directly.
     */
    const backendLink = safeString(
      referralCode?.link,
    ).trim();

    if (backendLink) {
      return backendLink;
    }

    /*
     * Fallback:
     * Build the referral URL from NEXT_PUBLIC_APP_URL.
     *
     * No production domain is hard-coded here.
     */
    const code = safeString(
      referralCode?.code,
    ).trim();

    if (!code) {
      return "";
    }

    const configuredUrl = safeString(
      process.env.NEXT_PUBLIC_APP_URL,
    )
      .trim()
      .replace(/\/+$/, "");

    /*
     * In the browser, window.location.origin is only
     * a secondary fallback when the environment variable
     * has not been configured.
     *
     * During SSR there is no browser origin, so return
     * an empty base URL instead of inventing a domain.
     */
    const baseUrl =
      configuredUrl ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "");

    if (!baseUrl) {
      return "";
    }

    return `${baseUrl}/register?ref=${encodeURIComponent(
      code,
    )}`;
  }, [referralCode]);

  /* ------------------------------------------------------------------------ */
  /* Load referral data                                                       */
  /* ------------------------------------------------------------------------ */

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        codeResponse,
        teamResponse,
        summaryResponse,
      ] = await Promise.all([
        referralApi.getCode(),
        referralApi.getTeam(20, 0),
        referralApi.getSummary(),
      ]);

      setReferralCode(
        codeResponse ?? null,
      );

      setMembers(
        Array.isArray(teamResponse?.members)
          ? teamResponse.members
          : [],
      );

      setSummary(
        summaryResponse ?? null,
      );
    } catch (err) {
      console.error(
        "Failed to load referral information:",
        err,
      );

      setError(
        "Unable to load your team information. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  const fetchInitialTeam = async () => {
    try {
      const [codeResponse, teamResponse, summaryResponse] =
        await Promise.all([
          referralApi.getCode(),
          referralApi.getTeam(20, 0),
          referralApi.getSummary(),
        ]);

      setReferralCode(codeResponse ?? null);

      setMembers(
        Array.isArray(teamResponse?.members)
          ? teamResponse.members
          : [],
      );

      setSummary(summaryResponse ?? null);
    } catch (err) {
      console.error("Failed to load referral information:", err);

      setError(
        "Unable to load your team information. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  void fetchInitialTeam();
}, []);

  /* ------------------------------------------------------------------------ */
  /* Copy referral link                                                       */
  /* ------------------------------------------------------------------------ */

  const handleCopy = useCallback(
    async () => {
      if (!referralLink || copied) {
        return;
      }

      setError("");

      try {
        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard &&
          typeof window !== "undefined" &&
          window.isSecureContext
        ) {
          await navigator.clipboard.writeText(
            referralLink,
          );
        } else {
          const textarea =
            document.createElement(
              "textarea",
            );

          textarea.value = referralLink;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "0";

          document.body.appendChild(
            textarea,
          );

          textarea.focus();
          textarea.select();

          const successful =
            document.execCommand("copy");

          textarea.remove();

          if (!successful) {
            throw new Error(
              "Copy failed",
            );
          }
        }

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2200);
      } catch (err) {
        console.error(
          "Unable to copy referral link:",
          err,
        );

        setError(
          "Unable to copy the referral link. Please copy it manually.",
        );
      }
    },
    [copied, referralLink],
  );

  /* ------------------------------------------------------------------------ */
  /* Native sharing                                                            */
  /* ------------------------------------------------------------------------ */

  const handleShare = useCallback(
    async () => {
      if (!referralLink || sharing) {
        return;
      }

      setError("");
      setSharing(true);

      try {
        const code = safeString(
          referralCode?.code,
        ).trim();

        const shareTitle =
          "Join Rich Dadie";

        const shareText = code
          ? `Join me on Rich Dadie and start investing with my referral code ${code}.`
          : "Join me on Rich Dadie and start investing.";

        if (
          typeof navigator !== "undefined" &&
          typeof navigator.share ===
            "function"
        ) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: referralLink,
          });

          return;
        }

        await handleCopy();
      } catch (err) {
        /*
         * Closing the native share sheet is not an error.
         */
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Unable to share referral link:",
          err,
        );

        try {
          await handleCopy();
        } catch {
          setError(
            "Unable to share the referral link.",
          );
        }
      } finally {
        setSharing(false);
      }
    },
    [
      handleCopy,
      referralCode,
      referralLink,
      sharing,
    ],
  );

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B18] pb-28 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-purple-500/8 blur-[110px]" />

        <div className="absolute -right-32 top-72 h-80 w-80 rounded-full bg-emerald-500/6 blur-[120px]" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="mb-7">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="group flex min-h-10 items-center gap-2 rounded-xl border border-white/6 bg-white/3 px-3 text-sm font-medium text-white/55 transition hover:border-white/10 hover:bg-white/6 hover:text-white active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </button>

            <button
              type="button"
              onClick={() => {
                void loadTeam();
              }}
              disabled={loading}
              aria-label="Refresh team"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-[#0B1426] text-white/45 transition hover:border-white/12 hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          <div className="mt-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/12 bg-emerald-400/6 px-3 py-1.5">
              <Users className="h-3.5 w-3.5 text-emerald-300" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                Referral network
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Your Team
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/45 sm:text-[15px]">
              Invite people to Rich Dadie and
              earn referral rewards when their
              first investment becomes active.
            </p>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/15 bg-red-400/8 p-4 shadow-lg shadow-red-950/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-red-200">
                  Something went wrong
                </p>

                <p className="mt-1 text-xs leading-5 text-red-200/65">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void loadTeam();
                }}
                className="shrink-0 rounded-lg border border-red-300/10 bg-red-300/8 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-300/12"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-105 items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/6">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-300" />
              </div>

              <p className="mt-4 text-sm font-medium text-white/65">
                Loading your team...
              </p>

              <p className="mt-1 text-xs text-white/30">
                Fetching your referral activity
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Referral Hero */}
            <section className="relative overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-2xl shadow-black/20 sm:p-6">
              <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-purple-500/10 blur-[70px]" />

              <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-emerald-500/8 blur-[70px]" />

              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/10 bg-amber-400/8 shadow-lg shadow-amber-950/10">
                    <Gift className="h-5 w-5 text-amber-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                      Your referral code
                    </p>

                    <p className="mt-1.5 break-all text-2xl font-bold tracking-[0.12em] text-white sm:text-3xl">
                      {safeString(
                        referralCode?.code,
                      ) || "—"}
                    </p>
                  </div>
                </div>

                {/* Referral link */}
                <div className="mt-6 rounded-2xl border border-white/7 bg-[#07101F]/80 p-3.5 backdrop-blur-xl sm:p-4">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 shrink-0 text-purple-300" />

                    <p className="text-xs font-semibold text-white/55">
                      Your invitation link
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/6 bg-black/10 px-3 py-3">
                    <p className="break-all text-xs leading-5 text-white/65">
                      {referralLink || "—"}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        void handleCopy();
                      }}
                      disabled={
                        !referralLink ||
                        copied
                      }
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/9 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-300" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-white/65" />
                          Copy
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        void handleShare();
                      }}
                      disabled={
                        !referralLink ||
                        sharing
                      }
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-400 to-emerald-500 px-3 text-sm font-bold text-[#03120D] shadow-lg shadow-emerald-950/20 transition hover:from-emerald-300 hover:to-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {sharing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sharing
                        </>
                      ) : (
                        <>
                          <Share2 className="h-4 w-4" />
                          Share
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-center text-[10px] leading-4 text-white/25">
                    Share through WhatsApp,
                    Telegram, Messages, email and
                    other apps.
                  </p>
                </div>

                {/* Reward message */}
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-400/8 bg-emerald-400/5 px-3 py-2.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-emerald-300" />

                  <p className="text-xs leading-5 text-emerald-100/65">
                    Grow your network and earn
                    rewards from qualified referrals.
                  </p>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="group rounded-2xl border border-white/8 bg-[#0B1426] p-4 transition hover:border-white/12 hover:bg-[#0D172B]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-400/8">
                  <Users className="h-4 w-4 text-purple-300" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                  Team
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  {safeNumber(
                    summary?.totalInvited,
                  )}
                </p>

                <p className="mt-1 text-[11px] text-white/30">
                  members invited
                </p>
              </div>

              <div className="group rounded-2xl border border-white/8 bg-[#0B1426] p-4 transition hover:border-white/12 hover:bg-[#0D172B]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/8">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                  Rewarded
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  {safeNumber(
                    summary?.rewardedMembers,
                  )}
                </p>

                <p className="mt-1 text-[11px] text-white/30">
                  qualified members
                </p>
              </div>

              <div className="group rounded-2xl border border-white/8 bg-[#0B1426] p-4 transition hover:border-white/12 hover:bg-[#0D172B]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/8">
                  <Wallet className="h-4 w-4 text-sky-300" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                  Active plans
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  {safeNumber(
                    summary?.activePlans,
                  )}
                </p>

                <p className="mt-1 text-[11px] text-white/30">
                  currently active
                </p>
              </div>

              <div className="group rounded-2xl border border-white/8 bg-[#0B1426] p-4 transition hover:border-white/12 hover:bg-[#0D172B]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/8">
                  <Gift className="h-4 w-4 text-amber-300" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                  Earned
                </p>

                <p className="mt-1 truncate text-2xl font-semibold tracking-tight text-white">
                  {formatUSDT(
                    summary?.totalEarned,
                  )}
                </p>

                <p className="mt-1 text-[11px] text-white/30">
                  USDT rewards
                </p>
              </div>
            </section>

            {/* Team members */}
            <section className="mt-7">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight text-white">
                      Invited members
                    </h2>

                    <span className="rounded-full border border-white/8 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/40">
                      {members.length}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-white/35">
                    Your direct referral network
                  </p>
                </div>
              </div>

              {members.length === 0 ? (
                <div className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] px-5 py-12 text-center">
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/6 blur-[70px]" />

                  <div className="relative">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
                      <Users className="h-7 w-7 text-white/35" />
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-white">
                      No team members yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                      Share your referral link to
                      invite your first team member
                      and start building your network.
                    </p>

                    {referralLink && (
                      <button
                        type="button"
                        onClick={() => {
                          void handleShare();
                        }}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-[#03120D] shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400 active:scale-[0.98]"
                      >
                        <Share2 className="h-4 w-4" />
                        Invite someone
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map(
                    (member, index) => {
                      const status =
                        getStatusLabel(
                          member,
                        );

                      const memberName =
                        safeString(
                          member.userName,
                        ).trim() ||
                        "Team member";

                      const memberEmail =
                        safeString(
                          member.userEmail,
                        ).trim() ||
                        "No email available";

                      const rewarded =
                        safeUpper(
                          member.referralStatus,
                        ) === "REWARDED";

                      return (
                        <div
                          key={
                            safeString(
                              member.referralId,
                            ) ||
                            safeString(
                              member.userId,
                            ) ||
                            `member-${index}`
                          }
                          className="group overflow-hidden rounded-3xl border border-white/8 bg-[#0B1426] p-4 transition hover:border-white/12 hover:bg-[#0D172B] sm:p-5"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-400/10 bg-linear-to-br from-purple-400/15 to-blue-400/8 text-sm font-bold text-purple-200">
                              {getInitials(
                                memberName,
                              )}

                              {rewarded && (
                                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0B1426] bg-emerald-400">
                                  <Check className="h-2.5 w-2.5 text-[#03120D]" />
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="truncate text-sm font-semibold text-white">
                                    {memberName}
                                  </h3>

                                  <p className="mt-1 truncate text-xs text-white/35">
                                    {memberEmail}
                                  </p>
                                </div>

                                <span
                                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClass(
                                    status,
                                  )}`}
                                >
                                  {status}
                                </span>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/7 pt-4 sm:grid-cols-4">
                                <div className="min-w-0">
                                  <p className="text-[10px] font-medium uppercase tracking-wide text-white/25">
                                    Plan
                                  </p>

                                  <p className="mt-1.5 truncate text-xs font-semibold text-white/75">
                                    {member.hasActivePlan
                                      ? "Active plan"
                                      : "No active plan"}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[10px] font-medium uppercase tracking-wide text-white/25">
                                    Joined
                                  </p>

                                  <p className="mt-1.5 text-xs font-semibold text-white/75">
                                    {formatDate(
                                      member.referredAt,
                                    )}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[10px] font-medium uppercase tracking-wide text-white/25">
                                    Reward
                                  </p>

                                  <p className="mt-1.5 text-xs font-semibold text-white/75">
                                    {formatUSDT(
                                      member.rewardAmount,
                                    )}{" "}
                                    <span className="text-white/30">
                                      USDT
                                    </span>
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[10px] font-medium uppercase tracking-wide text-white/25">
                                    Status
                                  </p>

                                  <p
                                    className={`mt-1.5 text-xs font-semibold ${
                                      rewarded
                                        ? "text-emerald-300"
                                        : "text-white/65"
                                    }`}
                                  >
                                    {safeUpper(
                                      member.referralStatus,
                                    ) ||
                                      "PENDING"}
                                  </p>
                                </div>
                              </div>

                              {(member.qualifiedAt ||
                                member.rewardedAt) && (
                                <div className="mt-4 border-t border-white/7 pt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    {member.qualifiedAt && (
                                      <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wide text-white/25">
                                          Qualified
                                        </p>

                                        <p className="mt-1.5 text-xs font-semibold text-white/65">
                                          {formatDate(
                                            member.qualifiedAt,
                                          )}
                                        </p>
                                      </div>
                                    )}

                                    {member.rewardedAt && (
                                      <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wide text-white/25">
                                          Rewarded
                                        </p>

                                        <p className="mt-1.5 text-xs font-semibold text-emerald-300">
                                          {formatDate(
                                            member.rewardedAt,
                                          )}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <ChevronRight className="mt-1 hidden h-4 w-4 shrink-0 text-white/15 transition-transform group-hover:translate-x-0.5 group-hover:text-white/35 sm:block" />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </section>

            {/* Bottom information */}
            <div className="mt-7 rounded-2xl border border-white/6 bg-white/3 px-4 py-3.5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-300/70" />

                <p className="text-[11px] leading-5 text-white/30">
                  Referral rewards are applied
                  according to Rich Dadie&apos;s
                  referral program rules. Member
                  status and reward information may
                  update as referrals qualify.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}