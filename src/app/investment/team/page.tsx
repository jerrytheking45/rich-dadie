// src/app/investment/team/Page.tsx



"use client";

import Image from "next/image";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Gift,
  Link2,
  Loader2,
  RefreshCw,
  Share2,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import referralApi from "@/src/lib/api/referralApi";

import type {
  ReferralCodeResponse,
  ReferralSummary,
  ReferralTeamMember,
} from "@/src/lib/types/referral";

/* ==========================================
   HELPERS
========================================== */

function safeString(
  value: unknown,
  fallback = ""
): string {
  return typeof value === "string" ? value : fallback;
}

function safeUpper(value: unknown): string {
  return safeString(value).trim().toUpperCase();
}

function safeNumber(
  value: unknown,
  fallback = 0
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
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

function formatCount(value: unknown): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(safeNumber(value));
}

function formatDate(value: unknown): string {
  const raw = safeString(value).trim();

  if (!raw) return "—";

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

  if (!name) return "?";

  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function getStatusLabel(
  member: ReferralTeamMember
): string {
  switch (safeUpper(member.referralStatus)) {
    case "REWARDED":
      return "Rewarded";

    case "QUALIFIED":
      return "Qualified";

    default:
      return "Pending";
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case "Rewarded":
      return "border-emerald-400/15 bg-emerald-400/10 text-emerald-300";

    case "Qualified":
      return "border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]";

    default:
      return "border-white/10 bg-white/5 text-white/50";
  }
}

interface TeamData {
  code: ReferralCodeResponse | null;
  members: ReferralTeamMember[];
  summary: ReferralSummary | null;
}

async function fetchTeamData(): Promise<TeamData> {
  const [
    codeResponse,
    teamResponse,
    summaryResponse,
  ] = await Promise.all([
    referralApi.getCode(),
    referralApi.getTeam(20, 0),
    referralApi.getSummary(),
  ]);

  return {
    code: codeResponse ?? null,
    members: Array.isArray(teamResponse?.members)
      ? teamResponse.members
      : [],
    summary: summaryResponse ?? null,
  };
}

/* ==========================================
   TEAM PAGE
========================================== */

export default function TeamPage() {
  const router = useRouter();

  const [referralCode, setReferralCode] =
    useState<ReferralCodeResponse | null>(null);

  const [summary, setSummary] =
    useState<ReferralSummary | null>(null);

  const [members, setMembers] =
    useState<ReferralTeamMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const copyTimerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const requestInFlight = useRef(false);

  /* ==========================================
     APPLY BACKEND DATA
  ========================================== */

  const applyTeamData = useCallback((data: TeamData) => {
    setReferralCode(data.code);
    setMembers(data.members);
    setSummary(data.summary);
  }, []);

  /* ==========================================
     INITIAL FETCH
  ========================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchInitialTeam = async () => {
      requestInFlight.current = true;

      try {
        const data = await fetchTeamData();

        if (cancelled) return;

        applyTeamData(data);
        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Failed to load referral information:",
          err
        );

        setError(
          "Unable to load your team information. Please try again."
        );
      } finally {
        if (!cancelled) {
          requestInFlight.current = false;
          setLoading(false);
        }
      }
    };

    void fetchInitialTeam();

    return () => {
      cancelled = true;
    };
  }, [applyTeamData]);

  /* ==========================================
     CLEAN UP COPY TIMER
  ========================================== */

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  /* ==========================================
     REFRESH TEAM
  ========================================== */

  const loadTeam = useCallback(async () => {
    if (requestInFlight.current) return;

    requestInFlight.current = true;

    setRefreshing(true);
    setError("");

    try {
      const data = await fetchTeamData();

      applyTeamData(data);
    } catch (err) {
      console.error(
        "Failed to refresh referral information:",
        err
      );

      setError(
        "Unable to refresh your team information. Please try again."
      );
    } finally {
      requestInFlight.current = false;
      setRefreshing(false);
      setLoading(false);
    }
  }, [applyTeamData]);

  /* ==========================================
     REFERRAL LINK
  ========================================== */

  const referralLink = useMemo(() => {
    // Always prefer the link supplied by the backend.
    const backendLink =
      safeString(referralCode?.link).trim();

    if (backendLink) return backendLink;

    const code = safeString(referralCode?.code).trim();

    if (!code) return "";

    const configuredUrl = safeString(
      process.env.NEXT_PUBLIC_APP_URL
    )
      .trim()
      .replace(/\/+$/, "");

    // Relative paths use the current application's origin
    // without introducing a hard-coded production domain.
    const baseUrl = configuredUrl;

    if (!baseUrl) {
      return `/register?ref=${encodeURIComponent(code)}`;
    }

    return `${baseUrl}/register?ref=${encodeURIComponent(
      code
    )}`;
  }, [referralCode]);

  /* ==========================================
     SHAREABLE ABSOLUTE LINK
  ========================================== */

  const getShareableLink = useCallback(() => {
    if (!referralLink) return "";

    try {
      return new URL(
        referralLink,
        window.location.origin
      ).href;
    } catch {
      return "";
    }
  }, [referralLink]);

  /* ==========================================
     COPY REFERRAL LINK
  ========================================== */

  const handleCopy = useCallback(async () => {
    if (!referralLink || copied) return;

    setError("");

    const link = getShareableLink();

    if (!link) {
      setError("The referral link is unavailable.");
      return;
    }

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(link);
      } else {
        const textarea =
          document.createElement("textarea");

        textarea.value = link;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        let successful = false;

        try {
          successful = document.execCommand("copy");
        } finally {
          textarea.remove();
        }

        if (!successful) {
          throw new Error("Copy failed");
        }
      }

      setCopied(true);

      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2200);
    } catch (err) {
      console.error(
        "Unable to copy referral link:",
        err
      );

      setError(
        "Unable to copy the referral link. Please copy it manually."
      );
    }
  }, [
    referralLink,
    copied,
    getShareableLink,
  ]);

  /* ==========================================
     SHARE REFERRAL LINK
  ========================================== */

  const handleShare = useCallback(async () => {
    if (!referralLink || sharing) return;

    setError("");
    setSharing(true);

    try {
      const link = getShareableLink();

      if (!link) {
        throw new Error("Invalid referral link");
      }

      const code =
        safeString(referralCode?.code).trim();

      const shareText = code
        ? `Join me on REDIQ using my referral code ${code}.`
        : "Join me on REDIQ.";

      if (typeof navigator.share === "function") {
        await navigator.share({
          title: "Join REDIQ",
          text: shareText,
          url: link,
        });
      } else {
        await handleCopy();
      }
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Unable to share referral link:",
        err
      );

      setError(
        "Unable to share your referral link. Please use Copy instead."
      );
    } finally {
      setSharing(false);
    }
  }, [
    referralCode,
    referralLink,
    sharing,
    handleCopy,
    getShareableLink,
  ]);

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#050B18] pb-24 text-white">

      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-48 w-48 rounded-full bg-[#E60033]/8 blur-[85px]" />
        <div className="absolute -right-24 top-60 h-48 w-48 rounded-full bg-[#E60033]/5 blur-[90px]" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <header className="mb-5">

          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/65 transition hover:border-[#E60033]/25 hover:text-white"
            >
              <ArrowLeft size={15} />
              Back
            </button>

            <button
              type="button"
              onClick={() => void loadTeam()}
              disabled={loading || refreshing}
              aria-label="Refresh team"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-white/55 transition hover:border-[#E60033]/25 hover:text-[#FF476B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  loading || refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          <div className="mt-5">

            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF476B]">
              <Users size={12} />
              Referral network
            </div>

            <h1 className="mt-2.5 text-[24px] font-black tracking-tight text-white sm:text-[28px]">
              Your Team
            </h1>

            <p className="mt-1.5 max-w-xl text-[11px] leading-5 text-white/50 sm:text-xs">
              Invite people to REDIQ, manage your referral
              network and track eligible rewards.
            </p>
          </div>
        </header>

        {/* =====================================
            NEW TEAM REFERRAL BANNER
        ====================================== */}

        <section
          aria-labelledby="team-banner-title"
          className="relative isolate mb-5 overflow-hidden rounded-2xl border border-[#E60033]/20 bg-[#101A2D] shadow-xl shadow-black/15 sm:rounded-[20px]"
        >
          {/* Banner image */}
          <Image
            src="/images/hero.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className="pointer-events-none -z-20 object-cover object-center opacity-45"
          />

          {/* Contrast overlays */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[#07101F]/55" />

          <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-[#07101F]/95 via-[#0B1426]/85 to-[#0B1426]/40" />

          {/* Decorative red glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#E60033]/15 blur-[55px]"
          />

          <div className="relative flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-6">

            {/* Banner content */}
            <div className="min-w-0 max-w-lg">

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/30 bg-[#E60033]/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF7895]">
                <Sparkles size={11} />
                REDIQ Referral Program
              </div>

              <h2
                id="team-banner-title"
                className="mt-3 text-[21px] font-black leading-[1.15] tracking-tight text-white sm:text-[25px] lg:text-[27px]"
              >
                Build your network.
                <span className="block text-[#FF476B]">
                  Grow together.
                </span>
              </h2>

              <p className="mt-2 max-w-md text-[11px] leading-[1.7] text-white/65 sm:text-xs sm:leading-5">
                Invite eligible friends to join REDIQ and track
                your referrals, qualification progress and
                eligible rewards in one place.
              </p>

              {/* Banner feature labels */}
              <div className="mt-3 flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[9px] font-semibold text-white/75">
                  <Users
                    size={11}
                    className="text-[#FF476B]"
                  />
                  Invite friends
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[9px] font-semibold text-white/75">
                  <Gift
                    size={11}
                    className="text-[#FF476B]"
                  />
                  Eligible rewards
                </span>
              </div>
            </div>

            {/* Banner CTA */}
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">

              <a
                href="#referral-link"
                className="group inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-[#E60033]/20 transition hover:-translate-y-0.5 hover:bg-[#FF174B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF476B] sm:w-auto"
              >
                <Share2 size={14} />

                Invite Friends

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <span className="text-[9px] font-medium text-white/45">
                Referral terms and eligibility apply
              </span>
            </div>
          </div>

          {/* Bottom brand accent */}
          <div className="h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/50 to-transparent" />
        </section>

        {/* =====================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-400/20 bg-red-500/10 p-3"
          >
            <div className="min-w-0">

              <p className="text-xs font-bold text-red-200">
                Something went wrong
              </p>

              <p className="mt-1 text-[11px] leading-5 text-red-200/75">
                {error}
              </p>
            </div>

            <button
              type="button"
              disabled={loading || refreshing}
              onClick={() => void loadTeam()}
              className="shrink-0 rounded-lg border border-red-300/20 px-2.5 py-1.5 text-[10px] font-bold text-red-200 transition hover:bg-red-400/10 disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================
            INITIAL LOADING
        ====================================== */}

        {loading ? (
          <div
            role="status"
            className="flex min-h-65 flex-col items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
              <Loader2
                size={21}
                className="animate-spin"
              />
            </div>

            <p className="mt-3 text-xs font-bold text-white/75">
              Loading your team...
            </p>

            <p className="mt-1 text-[10px] text-white/40">
              Fetching your referral information
            </p>
          </div>
        ) : (
          <>

            {/* =====================================
                REFERRAL HERO
            ====================================== */}

            <section
              id="referral-link"
              className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#131E32] via-[#0B1426] to-[#101625] p-4 shadow-xl shadow-black/15 sm:p-5"
            >
              {/* Ambient lighting */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#E60033]/10 blur-[65px]"
              />

              <div className="relative">

                {/* Referral code */}
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                    <Gift size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                      Your referral code
                    </p>

                    <p className="mt-1 break-all text-xl font-black tracking-[0.08em] text-white sm:text-2xl">
                      {safeString(referralCode?.code) || "—"}
                    </p>
                  </div>
                </div>

                {/* INVITATION LINK PANEL */}
                <div className="mt-4 rounded-xl border border-white/8 bg-[#07101F]/80 p-3 sm:p-3.5">

                  <div className="flex items-center gap-2">

                    <Link2
                      size={14}
                      className="text-[#FF476B]"
                    />

                    <p className="text-[11px] font-bold text-white/70">
                      Your invitation link
                    </p>
                  </div>

                  {/* Referral URL */}
                  <div className="mt-2 rounded-lg border border-white/8 bg-white/2.5 px-3 py-2.5">

                    <p className="break-all text-[11px] leading-5 text-white/60">
                      {referralLink || "No referral link available"}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-3 grid grid-cols-2 gap-2">

                    {/* COPY LINK */}
                    <button
                      type="button"
                      onClick={() => void handleCopy()}
                      disabled={!referralLink || copied}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {copied ? (
                        <>
                          <Check
                            size={14}
                            className="text-emerald-300"
                          />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy link
                        </>
                      )}
                    </button>

                    {/* SHARE LINK */}
                    <button
                      type="button"
                      onClick={() => void handleShare()}
                      disabled={!referralLink || sharing}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#E60033] px-3 text-xs font-black text-white transition hover:bg-[#FF174B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sharing ? (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Share2 size={14} />
                          Share link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* REWARD INFORMATION */}
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#E60033]/15 bg-[#E60033]/5 px-3 py-2.5">

                  <Sparkles
                    size={14}
                    className="mt-0.5 shrink-0 text-[#FF476B]"
                  />

                  <p className="text-[10px] leading-4 text-white/55">
                    Invite eligible friends and track rewards
                    according to the REDIQ referral program rules.
                  </p>
                </div>
              </div>
            </section>

            {/* =====================================
                TEAM SUMMARY
            ====================================== */}

            <section
              aria-label="Referral summary"
              className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
            >

              {/* TOTAL INVITED */}
              <article className="min-w-0 rounded-xl border border-white/8 bg-[#0B1426] p-3.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                  <Users size={15} />
                </div>

                <p className="mt-2.5 text-[10px] font-semibold text-white/45">
                  Team members
                </p>

                <p className="mt-1 text-xl font-black text-white tabular-nums">
                  {formatCount(summary?.totalInvited)}
                </p>

                <p className="mt-0.5 text-[9px] text-white/35">
                  Total invited
                </p>
              </article>

              {/* REWARDED MEMBERS */}
              <article className="min-w-0 rounded-xl border border-white/8 bg-[#0B1426] p-3.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <CheckCircle2 size={15} />
                </div>

                <p className="mt-2.5 text-[10px] font-semibold text-white/45">
                  Rewarded
                </p>

                <p className="mt-1 text-xl font-black text-white tabular-nums">
                  {formatCount(summary?.rewardedMembers)}
                </p>

                <p className="mt-0.5 text-[9px] text-white/35">
                  Rewarded members
                </p>
              </article>

              {/* ACTIVE PLANS */}
              <article className="min-w-0 rounded-xl border border-white/8 bg-[#0B1426] p-3.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E60033]/10 text-[#FF476B]">
                  <Wallet size={15} />
                </div>

                <p className="mt-2.5 text-[10px] font-semibold text-white/45">
                  Active plans
                </p>

                <p className="mt-1 text-xl font-black text-white tabular-nums">
                  {formatCount(summary?.activePlans)}
                </p>

                <p className="mt-0.5 text-[9px] text-white/35">
                  Currently active
                </p>
              </article>

              {/* TOTAL REWARDS */}
              <article className="min-w-0 rounded-xl border border-white/8 bg-[#0B1426] p-3.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <Gift size={15} />
                </div>

                <p className="mt-2.5 text-[10px] font-semibold text-white/45">
                  Total earned
                </p>

                <p
                  title={`${formatUSDT(summary?.totalEarned)} USDT`}
                  className="mt-1 wrap-break-words text-lg font-black tracking-tight text-white tabular-nums sm:text-xl"
                >
                  {formatUSDT(summary?.totalEarned)}
                </p>

                <p className="mt-0.5 text-[9px] text-white/35">
                  USDT rewards
                </p>
              </article>
            </section>

            {/* =====================================
                TEAM MEMBERS
            ====================================== */}

            <section className="mt-6">

              <div className="mb-3 flex items-center gap-2">

                <h2 className="text-base font-black text-white">
                  Invited members
                </h2>

                <span className="rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2 py-0.5 text-[10px] font-bold text-[#FF476B]">
                  {members.length}
                </span>
              </div>

              <p className="mb-3 text-[11px] text-white/40">
                Your direct referral network
              </p>

              {members.length === 0 ? (

                /* EMPTY STATE */
                <div className="rounded-2xl border border-white/8 bg-[#0B1426] px-4 py-8 text-center">

                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                    <Users size={21} />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-white">
                    No team members yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-white/45">
                    Share your referral link to invite your
                    first member and build your network.
                  </p>

                  {referralLink && (
                    <button
                      type="button"
                      disabled={sharing}
                      onClick={() => void handleShare()}
                      className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#E60033] px-4 text-xs font-black text-white transition hover:bg-[#FF174B] disabled:opacity-50"
                    >
                      <Share2 size={14} />
                      Invite someone
                    </button>
                  )}
                </div>

              ) : (

                /* MEMBER LIST */
                <div className="space-y-2.5">

                  {members.map((member, index) => {
                    const status = getStatusLabel(member);

                    const memberName =
                      safeString(member.userName).trim() ||
                      "Team member";

                    const memberEmail =
                      safeString(member.userEmail).trim() ||
                      "No email available";

                    const rewarded =
                      safeUpper(member.referralStatus) ===
                      "REWARDED";

                    return (
                      <article
                        key={
                          safeString(member.referralId) ||
                          safeString(member.userId) ||
                          `member-${index}`
                        }
                        className="group min-w-0 rounded-2xl border border-white/8 bg-[#0B1426] p-3.5 transition hover:border-[#E60033]/20 hover:bg-[#101D30] sm:p-4"
                      >

                        {/* MEMBER HEADER */}
                        <div className="flex min-w-0 items-start gap-3">

                          {/* Avatar */}
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-xs font-black text-[#FF476B]">

                            {getInitials(memberName)}

                            {rewarded && (
                              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0B1426] bg-emerald-400">
                                <Check
                                  size={9}
                                  className="text-[#06150D]"
                                />
                              </span>
                            )}
                          </div>

                          {/* Name and email */}
                          <div className="min-w-0 flex-1">

                            <h3 className="truncate text-xs font-bold text-white sm:text-[13px]">
                              {memberName}
                            </h3>

                            <p className="mt-1 truncate text-[10px] text-white/40">
                              {memberEmail}
                            </p>
                          </div>

                          {/* Referral status */}
                          <span
                            className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* MEMBER DETAILS */}
                        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-white/8 pt-3 sm:grid-cols-4">

                          {/* Plan */}
                          <div className="min-w-0">

                            <p className="text-[9px] uppercase tracking-wide text-white/35">
                              Plan
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-white/75">
                              {member.hasActivePlan
                                ? "Active plan"
                                : "No active plan"}
                            </p>
                          </div>

                          {/* Joined */}
                          <div className="min-w-0">

                            <p className="text-[9px] uppercase tracking-wide text-white/35">
                              Joined
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-white/75">
                              {formatDate(member.referredAt)}
                            </p>
                          </div>

                          {/* Reward */}
                          <div className="min-w-0">

                            <p className="text-[9px] uppercase tracking-wide text-white/35">
                              Reward
                            </p>

                            <p className="mt-1 wrap-break-words text-[11px] font-bold text-white/80 tabular-nums">
                              {formatUSDT(member.rewardAmount)}

                              <span className="ml-1 font-medium text-white/35">
                                USDT
                              </span>
                            </p>
                          </div>

                          {/* Status */}
                          <div className="min-w-0">

                            <p className="text-[9px] uppercase tracking-wide text-white/35">
                              Status
                            </p>

                            <p
                              className={`mt-1 text-[11px] font-bold ${
                                rewarded
                                  ? "text-emerald-300"
                                  : status === "Qualified"
                                    ? "text-[#FF476B]"
                                    : "text-white/60"
                              }`}
                            >
                              {status}
                            </p>
                          </div>
                        </div>

                        {/* OPTIONAL MILESTONE DATES */}
                        {(member.qualifiedAt ||
                          member.rewardedAt) && (
                          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/8 pt-3">

                            {member.qualifiedAt && (
                              <div>

                                <p className="text-[9px] uppercase tracking-wide text-white/35">
                                  Qualified
                                </p>

                                <p className="mt-1 text-[11px] font-semibold text-white/70">
                                  {formatDate(member.qualifiedAt)}
                                </p>
                              </div>
                            )}

                            {member.rewardedAt && (
                              <div>

                                <p className="text-[9px] uppercase tracking-wide text-white/35">
                                  Rewarded
                                </p>

                                <p className="mt-1 text-[11px] font-semibold text-emerald-300">
                                  {formatDate(member.rewardedAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* =====================================
                FOOTER NOTICE
            ====================================== */}

            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/2.5 px-3 py-3">

              <Sparkles
                size={14}
                className="mt-0.5 shrink-0 text-[#FF476B]"
              />

              <p className="text-[10px] leading-4 text-white/40">
                Referral rewards are subject to REDIQ&apos;s
                program rules. Member statuses and reward
                information may change as referrals qualify.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}