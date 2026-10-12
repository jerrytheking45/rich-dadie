
"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  ChartNoAxesCombined,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { isZeroUUID } from "@/src/lib/utils/uuid";

import LiveCryptoMarket from "@/src/components/market/LiveCryptoMarket";

import SearchModal from "@/src/components/search/SearchModal";
import InvestmentHeader from "@/src/components/InvestmentHeader";
import BalanceCard from "@/src/components/BalanceCard";
import InvestmentCard from "@/src/components/InvestmentCard";
import InvestmentPlanCard from "@/src/components/InvestmentPlanCard";
import PromotionBanner from "@/src/components/promotions/PromotionBanner";
import PromotionCarousel from "@/src/components/promotions/PromotionCarousel";
import SupportFloatingButton from "@/src/components/support/SupportFloatingButton";

import { investmentApi } from "@/src/lib/api/investmentApi";

import type {
  InvestmentPlan,
  Investment,
  InvestmentSummary,
  UserProfile,
  BalanceSummary,
} from "@/src/lib/types/investment";

/* ==========================================
   HELPERS
========================================== */

function shufflePlans(
  items: InvestmentPlan[],
): InvestmentPlan[] {
  const shuffled = [...items];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
      Math.random() * (i + 1),
    );

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

function getUniqueKey(
  id: string,
  index: number,
): string {
  return id && !isZeroUUID(id)
    ? id
    : `fallback-${index}`;
}

/* ==========================================
   HOME PAGE
========================================== */

export default function Home() {
  const router = useRouter();

  const [
    balanceSummary,
    setBalanceSummary,
  ] = useState<BalanceSummary | null>(
    null,
  );

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [plans, setPlans] = useState<
    InvestmentPlan[]
  >([]);

  const [
    investments,
    setInvestments,
  ] = useState<Investment[]>([]);

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* ==========================================
     LOAD DASHBOARD INFORMATION
  ========================================== */

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const [
        plansResult,
        investmentsResult,
        profileResult,
        balanceResult,
      ] = await Promise.allSettled([
        investmentApi.getPlans(),
        investmentApi.getInvestments(
          1,
          50,
        ),
        investmentApi.getProfile(),
        investmentApi.getBalanceSummary(),
      ]);

      if (cancelled) {
        return;
      }

      if (
        plansResult.status === "fulfilled"
      ) {
        const publishedPlans =
          plansResult.value.filter(
            (plan) =>
              plan.status === "PUBLISHED",
          );

        setPlans(
          shufflePlans(publishedPlans),
        );
      } else {
        console.error(
          "Failed to load investment plans:",
          plansResult.reason,
        );

        setPlans([]);
      }

      if (
        investmentsResult.status ===
        "fulfilled"
      ) {
        const validInvestments =
          investmentsResult.value.investments.filter(
            (investment) =>
              !isZeroUUID(investment.id),
          );

        setInvestments(
          validInvestments,
        );
      } else {
        console.error(
          "Failed to load user investments:",
          investmentsResult.reason,
        );

        setInvestments([]);
      }

      if (
        profileResult.status ===
        "fulfilled"
      ) {
        setUser(profileResult.value);
      } else {
        console.error(
          "Failed to load user profile:",
          profileResult.reason,
        );

        setUser(null);
      }

      if (
        balanceResult.status ===
        "fulfilled"
      ) {
        setBalanceSummary(
          balanceResult.value,
        );
      } else {
        console.error(
          "Failed to load balance summary:",
          balanceResult.reason,
        );

        setBalanceSummary(null);
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================
     DASHBOARD DATA
  ========================================== */

  const displayedPlans =
    plans.slice(0, 4);

  const recentInvestments =
    investments.slice(0, 2);

  const summary: InvestmentSummary = {
    totalInvested:
      balanceSummary?.totalInvested ??
      0,

    totalExpectedProfit:
      balanceSummary?.totalExpectedProfit ??
      0,

    totalLockedBalance:
      balanceSummary?.totalLockedBalance ??
      0,

    activeBalance:
      balanceSummary?.activeBalance ??
      0,

    activeInvestments:
      balanceSummary?.activeInvestments ??
      0,

    maturedInvestments:
      balanceSummary?.maturedInvestments ??
      0,

    assetSymbol:
      balanceSummary?.assetSymbol ??
      "USDT",
  };

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <>
      <main
        className="
          relative mx-auto w-full
          max-w-2xl
          px-3 pb-32 pt-4
          text-white
          min-[375px]:px-4
          sm:px-6 sm:pt-6
          lg:max-w-7xl lg:px-8
        "
      >
        {/* BACKGROUND */}

        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-[#E60033]/6 blur-[100px]" />

          <div className="absolute -right-20 top-[45%] h-64 w-64 rounded-full bg-[#E60033]/5 blur-[100px]" />
        </div>

        {/* =====================================
            HEADER
        ====================================== */}

        <InvestmentHeader
          name={user?.name || ""}
          onSearch={() =>
            setSearchOpen(true)
          }
        />

        {/* =====================================
            WELCOME
        ====================================== */}

        <section className="mt-6 sm:mt-7">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#FF476B]">
            <Sparkles
              size={12}
              aria-hidden="true"
            />

            Investment dashboard
          </div>

          <h1 className="mt-3 text-[25px] font-black leading-tight tracking-tight text-white sm:text-[30px]">
            Grow your future
            <span className="text-[#FF476B]">
              .
            </span>
          </h1>

          <p className="mt-1.5 max-w-xl text-[11px] leading-5 text-white/45 sm:text-xs">
            Monitor your portfolio,
            explore available plans and
            follow your investment activity
            in one place.
          </p>
        </section>

        {/* =====================================
            PORTFOLIO BALANCE
        ====================================== */}

        <section className="mt-5">
          <BalanceCard
            summary={summary}
          />
        </section>

        {/* =====================================
            REDIQ ADVERTISEMENT BANNER
        ====================================== */}

        <section
          aria-label="REDIQ platform advertisement"
          className="mt-4 min-w-0"
        >
          <div className="group relative overflow-hidden rounded-2xl border border-[#E60033]/20 bg-[#050B18] shadow-lg shadow-black/20">
            <Image
              src="/images/futuristic.png"
              alt="REDIQ promotional artwork featuring the investment platform, portfolio dashboard and digital asset market."
              width={1200}
              height={630}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              className="block h-auto w-full object-contain"
              priority
            />

            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/70 to-transparent"
            />
          </div>

          <p className="mt-1.5 px-1 text-[9px] leading-4 text-white/35">
            Your future begins with the
            decisions you make today.
            Discover new possibilities
            with REDIQ. Explore digital
            investment opportunities,
            stay connected to global
            markets, and build your
            financial journey with
            confidence. Every great
            ambition starts with a
            single step.
          </p>
        </section>

        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <section
          aria-label="Quick actions"
          className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3"
        >
          <QuickAction
            icon={
              ChartNoAxesCombined
            }
            label="My investments"
            description="Track portfolio"
            onClick={() =>
              router.push(
                "/investment/investments",
              )
            }
          />

          <QuickAction
            icon={TrendingUp}
            label="Explore plans"
            description="View opportunities"
            onClick={() =>
              router.push(
                "/investment/plans",
              )
            }
          />
        </section>

        {/* =====================================
            RECENT INVESTMENTS
        ====================================== */}

        <section className="mt-7">
          <SectionHeader
            eyebrow="Portfolio"
            title="My investments"
            action="View all"
            onClick={() =>
              router.push(
                "/investment/investments",
              )
            }
          />

          <div className="mt-3 space-y-2.5">
            {loading ? (
              <InvestmentSkeleton />
            ) : recentInvestments.length >
              0 ? (
              recentInvestments.map(
                (
                  investment,
                  index,
                ) => (
                  <InvestmentCard
                    key={getUniqueKey(
                      investment.id,
                      index,
                    )}
                    investment={
                      investment
                    }
                    onClick={() =>
                      router.push(
                        `/investment/investments/${encodeURIComponent(
                          investment.id,
                        )}`,
                      )
                    }
                  />
                ),
              )
            ) : (
              <EmptySection
                title="No investments yet"
                description="Explore available investment plans to begin building your portfolio."
                action="Explore plans"
                onClick={() =>
                  router.push(
                    "/investment/plans",
                  )
                }
              />
            )}
          </div>
        </section>

        {/* =====================================
            INVESTMENT PLANS
        ====================================== */}

        <section className="mt-8">
          <SectionHeader
            eyebrow="Opportunities"
            title="Explore investment plans"
            action="See all"
            onClick={() =>
              router.push(
                "/investment/plans",
              )
            }
          />

          {loading ? (
            <PlansSkeleton />
          ) : displayedPlans.length >
            0 ? (
            <div
              className="
                mt-3 grid
                grid-cols-1
                items-stretch
                gap-3
                sm:gap-4
                md:grid-cols-2
                lg:grid-cols-4
              "
            >
              {displayedPlans.map(
                (plan, index) => (
                  <div
                    key={getUniqueKey(
                      plan.id,
                      index,
                    )}
                    className="min-w-0"
                  >
                    <InvestmentPlanCard
                      plan={plan}
                      onClick={() =>
                        router.push(
                          `/investment/plans/${encodeURIComponent(
                            plan.id,
                          )}`,
                        )
                      }
                    />
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="mt-3">
              <EmptySection
                title="No plans available"
                description="Check back later for new investment opportunities."
              />
            </div>
          )}
        </section>

        {/* =====================================
            FEATURED PROMOTION
        ====================================== */}

        <section className="mt-7">
          <PromotionBanner />
        </section>

        {/* =====================================
            PROMOTION CAROUSEL
        ====================================== */}

        <section className="mt-5">
          <PromotionCarousel
            title="Latest promotions"
            description="Explore current platform offers and promotions."
            limit={4}
          />
        </section>

        {/* =====================================
            LIVE CRYPTO MARKET
        ====================================== */}

        <section className="mt-7">
          <LiveCryptoMarket />
        </section>
      </main>

      {/* SEARCH MODAL */}

      <SearchModal
        open={searchOpen}
        onClose={() =>
          setSearchOpen(false)
        }
      />

      {/* SUPPORT BUTTON */}

      <SupportFloatingButton />
    </>
  );
}

/* ==========================================
   SECTION HEADER
========================================== */

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  action: string;
  onClick: () => void;
}

function SectionHeader({
  eyebrow,
  title,
  action,
  onClick,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#FF476B]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-base font-black tracking-tight text-white sm:text-lg">
          {title}
        </h2>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="group inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#FF476B] transition hover:text-[#FF7895] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50"
      >
        {action}

        <ArrowRight
          size={13}
          className="transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

/* ==========================================
   QUICK ACTION
========================================== */

interface QuickActionProps {
  icon: ComponentType<{
    size?: number;
    className?: string;
    "aria-hidden"?: boolean;
  }>;

  label: string;
  description: string;
  onClick: () => void;
}

function QuickAction({
  icon: Icon,
  label,
  description,
  onClick,
}: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-white/8 bg-[#0B1426] p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#E60033]/25 hover:bg-[#101D30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 sm:p-3.5"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
        <Icon
          size={17}
          aria-hidden={true}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-bold text-white sm:text-xs">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-white/40">
          {description}
        </p>
      </div>

      <ArrowRight
        size={13}
        aria-hidden="true"
        className="hidden shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-[#FF476B] sm:block"
      />
    </button>
  );
}

/* ==========================================
   INVESTMENT LOADING SKELETON
========================================== */

function InvestmentSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading investments"
      className="space-y-2.5"
    >
      {[1, 2].map((item) => (
        <div
          key={item}
          className="h-44 animate-pulse rounded-2xl border border-white/8 bg-[#0B1426] sm:h-48"
        />
      ))}
    </div>
  );
}

/* ==========================================
   PLANS LOADING SKELETON
========================================== */

function PlansSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading investment plans"
      className="
        mt-3 grid
        grid-cols-1
        gap-3
        sm:gap-4
        md:grid-cols-2
        lg:grid-cols-4
      "
    >
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl border border-white/8 bg-[#0B1426] sm:h-72"
          />
        ),
      )}
    </div>
  );
}

/* ==========================================
   EMPTY STATE
========================================== */

interface EmptySectionProps {
  title: string;
  description: string;
  action?: string;
  onClick?: () => void;
}

function EmptySection({
  title,
  description,
  action,
  onClick,
}: EmptySectionProps) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0B1426]/80 px-4 py-7 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
        <Sparkles
          size={18}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-3 text-xs font-bold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-5 text-white/45">
        {description}
      </p>

      {action && onClick && (
        <button
          type="button"
          onClick={onClick}
          className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#E60033] px-4 text-[11px] font-black text-white transition hover:bg-[#FF174B]"
        >
          {action}

          <ArrowRight
            size={13}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}