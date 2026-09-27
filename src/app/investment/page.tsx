'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChartNoAxesCombined,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { isZeroUUID } from '@/src/lib/utils/uuid';

//import InvestmentBottomNav from '@/src/components/InvestmentBottomNav';
import InvestmentHeader from '@/src/components/InvestmentHeader';
import BalanceCard from '@/src/components/BalanceCard';
import InvestmentCard from '@/src/components/InvestmentCard';
import InvestmentPlanCard from '@/src/components/InvestmentPlanCard';
import PromotionBanner from '@/src/components/promotions/PromotionBanner';
import PromotionCarousel from '@/src/components/promotions/PromotionCarousel';
import SupportFloatingButton from '@/src/components/support/SupportFloatingButton';

import { investmentApi } from '@/src/lib/api/investmentApi';

import type {
  InvestmentPlan,
  Investment,
  InvestmentSummary,
  UserProfile,
  BalanceSummary,
} from '@/src/lib/types/investment';

export default function Home() {
  const router = useRouter();

  const [balanceSummary, setBalanceSummary] =
    useState<BalanceSummary | null>(null);

  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const plansPromise = investmentApi.getPlans();
        const investmentsPromise =
          investmentApi.getInvestments(1, 50);
        const profilePromise = investmentApi.getProfile();
        const balancePromise =
          investmentApi.getBalanceSummary();

        const [
          plansResult,
          investmentsResult,
          profileResult,
          balanceResult,
        ] = await Promise.allSettled([
          plansPromise,
          investmentsPromise,
          profilePromise,
          balancePromise,
        ]);

        if (plansResult.status === 'fulfilled') {
          const plansData = plansResult.value;
          const shuffledPlans = [...plansData];

          for (
            let i = shuffledPlans.length - 1;
            i > 0;
            i -= 1
          ) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffledPlans[i], shuffledPlans[j]] = [
              shuffledPlans[j],
              shuffledPlans[i],
            ];
          }

          setPlans(shuffledPlans);
        } else {
          console.error(
            'Failed to load investment plans:',
            plansResult.reason,
          );
        }

        if (investmentsResult.status === 'fulfilled') {
          const investmentsData =
            investmentsResult.value;

          const validInvestments =
            investmentsData.investments.filter(
              (investment) =>
                !isZeroUUID(investment.id),
            );

          setInvestments(validInvestments);
        } else {
          console.error(
            'Failed to load user investments:',
            investmentsResult.reason,
          );

          setInvestments([]);
        }

        if (profileResult.status === 'fulfilled') {
          setUser(profileResult.value);
        } else {
          console.error(
            'Failed to load user profile:',
            profileResult.reason,
          );

          setUser(null);
        }

        if (balanceResult.status === 'fulfilled') {
          setBalanceSummary(balanceResult.value);
        } else {
          console.error(
            'Failed to load balance summary:',
            balanceResult.reason,
          );

          setBalanceSummary(null);
        }
      } catch (err) {
        console.error(
          'Failed to load dashboard data:',
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const displayedPlans = plans.slice(0, 4);
  const recentInvestments = investments.slice(0, 2);

  const summary: InvestmentSummary = {
    totalInvested:
      balanceSummary?.totalInvested ?? 0,

    totalExpectedProfit:
      balanceSummary?.totalExpectedProfit ?? 0,

    totalLockedBalance:
      balanceSummary?.totalLockedBalance ?? 0,

    activeBalance:
      balanceSummary?.activeBalance ?? 0,

    activeInvestments:
      balanceSummary?.activeInvestments ?? 0,

    maturedInvestments:
      balanceSummary?.maturedInvestments ?? 0,

    assetSymbol:
      balanceSummary?.assetSymbol ?? 'USDT',
  };

  const getUniqueKey = (
    id: string,
    index: number,
  ): string =>
    id &&
    id !== '00000000-0000-0000-0000-000000000000'
      ? id
      : `fallback-${index}`;

  const displayName = user?.name || '';

  return (
    <>
      <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-1/2 top-62.5 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-400/6 blur-3xl" />

          <div className="absolute bottom-62.5 right-37.5 h-125 w-125 rounded-full bg-purple-500/5 blur-3xl" />

          <div className="absolute left-45 top-[35%] h-100 w-100 rounded-full bg-[#F7C948]/4 blur-3xl" />
        </div>

        {/* Header */}
        <InvestmentHeader
          name={displayName}
          onSearch={() =>
            router.push('/investment/search')
          }
        />

        {/* Welcome */}
        <section className="mt-7">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#F7C948]/15 bg-[#F7C948]/8">
              <Sparkles
                size={14}
                className="text-[#F7C948]"
                aria-hidden="true"
              />
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F7C948]/70">
              Investment dashboard
            </span>
          </div>

          <h1 className="mt-3 text-[28px] font-black tracking-tight text-white sm:text-3xl">
            Grow your future.
          </h1>

          <p className="mt-2 max-w-lg text-xs leading-6 text-white/35 sm:text-sm">
            Monitor your portfolio, explore investment
            opportunities and keep track of your growth
            from one place.
          </p>
        </section>

        {/* Portfolio */}
        <section className="mt-6">
          <BalanceCard summary={summary} />
        </section>

        {/* Quick actions */}
        <section className="mt-4 grid grid-cols-2 gap-3">
          <QuickAction
            icon={ChartNoAxesCombined}
            label="My investments"
            description="Track portfolio"
            onClick={() =>
              router.push('/investment/investments')
            }
          />

          <QuickAction
            icon={TrendingUp}
            label="Explore plans"
            description="Find opportunities"
            onClick={() =>
              router.push('/investment/plans')
            }
          />
        </section>

        {/* Investments */}
        <section className="mt-9">
          <SectionHeader
            eyebrow="Portfolio"
            title="My investments"
            action="View all"
            onClick={() =>
              router.push('/investment/investments')
            }
          />

          <div className="mt-4 space-y-3">
            {loading ? (
              <InvestmentSkeleton />
            ) : recentInvestments.length > 0 ? (
              recentInvestments.map(
                (investment, index) => (
                  <InvestmentCard
                    key={getUniqueKey(
                      investment.id,
                      index,
                    )}
                    investment={investment}
                    onClick={() =>
                      router.push(
                        `/investment/investments/${investment.id}`,
                      )
                    }
                  />
                ),
              )
            ) : (
              <EmptySection
                title="No investments yet"
                description="Start building your portfolio by exploring the available investment plans."
                action="Explore plans"
                onClick={() =>
                  router.push('/investment/plans')
                }
              />
            )}
          </div>
        </section>

        {/* Plans */}
        <section className="mt-10">
          <SectionHeader
            eyebrow="Opportunities"
            title="Explore investment plans"
            action="See all"
            onClick={() =>
              router.push('/investment/plans')
            }
          />

          {loading ? (
            <PlansSkeleton />
          ) : displayedPlans.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {displayedPlans.map(
                (plan, index) => (
                  <InvestmentPlanCard
                    key={getUniqueKey(
                      plan.id,
                      index,
                    )}
                    plan={plan}
                    onClick={() =>
                      router.push(
                        `/investment/plans/${plan.id}`,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <EmptySection
              title="No investment plans available"
              description="Check back later for new investment opportunities."
            />
          )}
        </section>

        {/* Promotion */}
        <section className="mt-8">
          <PromotionBanner />
        </section>

        {/* Promotions */}
        <section className="mt-5">
          <PromotionCarousel
            title="Latest promotions"
            description="Discover current opportunities and platform offers."
            limit={4}
          />
        </section>
      </main>

      <SupportFloatingButton />
    </>
  );
}

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
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300/50">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-lg font-black tracking-tight text-white">
          {title}
        </h2>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-emerald-300 transition hover:text-emerald-200"
      >
        {action}
        <ArrowRight size={13} />
      </button>
    </div>
  );
}

interface QuickActionProps {
  icon: typeof ChartNoAxesCombined;
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
      className="group flex items-center gap-3 rounded-[20px] border border-white/8 bg-[#0B1426]/80 p-3.5 text-left backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-[#101D33]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/10 bg-emerald-400/8">
        <Icon
          size={17}
          className="text-emerald-300"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-white">
          {label}
        </p>

        <p className="mt-0.5 text-[10px] text-white/30">
          {description}
        </p>
      </div>
    </button>
  );
}

function InvestmentSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="h-48 animate-pulse rounded-3xl border border-white/7 bg-[#0B1426]"
        />
      ))}
    </div>
  );
}

function PlansSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-80 animate-pulse rounded-[22px] border border-white/7 bg-[#0B1426]"
        />
      ))}
    </div>
  );
}

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
    <div className="rounded-3xl border border-dashed border-white/10 bg-[#0B1426]/70 px-5 py-9 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/2.5">
        <Sparkles
          size={18}
          className="text-white/25"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-4 text-sm font-bold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-white/30">
        {description}
      </p>

      {action && onClick && (
        <button
          type="button"
          onClick={onClick}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#F7C948] px-4 py-2.5 text-xs font-black text-[#050B18] transition hover:bg-[#FFD96A]"
        >
          {action}
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}
