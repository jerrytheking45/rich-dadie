
// src/app/investment/plans/[planId]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  TrendingUp,
  Info,
  ChevronRight,
  Clock3,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';

import { investmentApi } from '@/src/lib/api/investmentApi';
import { useSettings } from '@/src/context/useSettings';
import { formatUSDT } from '@/src/lib/utils/currency';
import type { InvestmentPlan } from '@/src/lib/types/investment';

export default function PlanDetailPage() {
  const router = useRouter();

  const params =
    useParams<{ planId?: string }>();

  const planId = params?.planId;

  const { currency } = useSettings();

  const [plan, setPlan] =
    useState<InvestmentPlan | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!planId) {
      return;
    }

    let cancelled = false;

    const loadPlan = async () => {
      try {
        setLoading(true);
        setError('');

        const data =
          await investmentApi.getPlan(planId);

        if (!cancelled) {
          setPlan(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            'Failed to load plan details',
          );
          setPlan(null);
        }

        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPlan();

    return () => {
      cancelled = true;
    };
  }, [planId]);

  if (!planId) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-2">
        <div className="w-full max-w-md rounded-[26px] border border-white/8 bg-[#0B1426] p-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-2xl">
            📦
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-white">
            Invalid plan
          </h2>

          <p className="mt-1 text-xs leading-5 text-white/35">
            No investment plan ID was provided.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-400"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />

          <p className="mt-4 text-xs text-white/35">
            Loading plan...
          </p>
        </div>
      </main>
    );
  }

  if (error || !plan) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-2">
        <div className="w-full max-w-md rounded-[26px] border border-white/8 bg-[#0B1426] p-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-2xl">
            📦
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-white">
            Plan not found
          </h2>

          <p className="mt-1 text-xs leading-5 text-white/35">
            {error ||
              'The investment plan you are looking for does not exist.'}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-400"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  const isPublished =
    plan.status === 'PUBLISHED';

  return (
    <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Investment Plan
          </p>

          <h1 className="truncate text-[19px] font-extrabold tracking-tight text-white">
            {plan.name}
          </h1>
        </div>
      </header>

      {/* Plan hero */}
      <section className="mt-5 overflow-hidden rounded-[28px] border border-emerald-300/10 bg-linear-to-br from-[#123E39] via-[#0B302D] to-[#071A28] p-5 text-white shadow-[0_25px_65px_rgba(0,0,0,0.3)]">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-300/10 blur-2xl"
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {isPublished ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                    <Sparkles size={11} />
                    Coming Soon
                  </span>
                )}

                {plan.featured && (
                  <span className="ml-2 inline-flex rounded-full bg-[#F7C948] px-2.5 py-1 text-[9px] font-bold text-[#07101F]">
                    Featured
                  </span>
                )}

                <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                  {plan.name}
                </h2>

                <p className="mt-1 break-all text-[10px] text-white/30">
                  Plan ID: {plan.id}
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/6">
                {plan.image ? (
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <TrendingUp
                    size={28}
                    className="text-emerald-300"
                  />
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="text-[9px] text-white/35">
                  Minimum Investment
                </p>

                <p className="mt-1 text-sm font-bold">
                  {formatUSDT(
                    plan.minimumAmount,
                    currency,
                  )}
                </p>
              </div>

              <div>
                <p className="text-[9px] text-white/35">
                  Investment Limit
                </p>

                <p className="mt-1 text-sm font-bold">
                  Unlimited
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming soon */}
      {!isPublished && (
        <section className="mt-5 rounded-[22px] border border-amber-400/10 bg-amber-400/6 p-4">
          <div className="flex items-start gap-3">
            <Sparkles
              size={18}
              className="mt-0.5 shrink-0 text-amber-300"
            />

            <div>
              <h3 className="text-xs font-extrabold text-amber-200">
                Coming Soon
              </h3>

              <p className="mt-1 text-xs leading-5 text-amber-100/50">
                This investment plan is being prepared
                and is not currently available for
                investment. Please check back when the
                plan is published.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Key details */}
      <section className="mt-5 grid grid-cols-2 gap-3">
        <DetailCard
          icon={<CalendarDays size={18} />}
          label="Duration"
          value={`${plan.durationDays} days`}
        />

        <DetailCard
          icon={<TrendingUp size={18} />}
          label="Expected Daily Return"
          value={`${plan.expectedReturnRate}%`}
          valueClass="text-emerald-300"
        />

        <DetailCard
          icon={<Clock3 size={18} />}
          label="Minimum Amount"
          value={formatUSDT(
            plan.minimumAmount,
            currency,
          )}
        />

        <DetailCard
          icon={<Sparkles size={18} />}
          label="Availability"
          value={
            isPublished
              ? 'Available'
              : 'Coming Soon'
          }
          valueClass={
            isPublished
              ? 'text-emerald-300'
              : 'text-amber-300'
          }
        />
      </section>

      {/* Description */}
      <section className="mt-5 rounded-3xl border border-white/8 bg-[#0B1426] p-5">
        <h3 className="text-sm font-extrabold text-white">
          About this plan
        </h3>

        <p className="mt-2 text-xs leading-5 text-white/45">
          {plan.description ||
            'No additional description is available for this investment plan.'}
        </p>
      </section>

      {/* Returns calculation */}
      <section className="mt-5 rounded-3xl border border-emerald-400/10 bg-emerald-400/6 p-5">
        <div className="flex items-start gap-3">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-emerald-300"
          />

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-200">
              How daily returns are calculated
            </h4>

            <p className="text-xs leading-5 text-emerald-100/50">
              Your investment earns a{' '}
              <strong>daily return</strong> based on the
              plan&apos;s daily rate. The return is applied
              to your invested amount every day for the
              full duration of the plan.
            </p>

            <div className="rounded-xl border border-white/7 bg-[#07101F] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Formula
              </p>

              <p className="mt-1 text-xs font-bold text-white/75">
                Daily Earnings = Investment Amount ×
                (Daily Rate ÷ 100)
              </p>

              <p className="mt-1 text-xs font-bold text-white/75">
                Total Expected Earnings = Daily
                Earnings × Duration (days)
              </p>
            </div>

            <div className="rounded-xl border border-white/7 bg-[#07101F] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Example
              </p>

              <p className="mt-1 text-xs leading-5 text-white/55">
                Invest{' '}
                <strong className="text-white/80">
                  {formatUSDT(
                    200,
                    currency,
                  )}
                </strong>{' '}
                in {plan.name} (
                {plan.expectedReturnRate}% daily) for{' '}
                {plan.durationDays} days.
              </p>

              <p className="mt-1 text-xs text-white/55">
                • Daily earnings:{' '}
                {formatUSDT(
                  200 *
                    (plan.expectedReturnRate /
                      100),
                  currency,
                )}
              </p>

              <p className="mt-1 text-xs text-white/55">
                • Total expected earnings:{' '}
                {formatUSDT(
                  200 *
                    (plan.expectedReturnRate /
                      100) *
                    plan.durationDays,
                  currency,
                )}
              </p>
            </div>

            {plan.featured && (
              <p className="text-xs text-emerald-100/45">
                This plan is currently featured by the
                investment platform.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Investment notice */}
      <section className="mt-5 rounded-[22px] border border-amber-400/10 bg-amber-400/6 p-4">
        <div className="flex items-start gap-2">
          <Info
            size={16}
            className="mt-0.5 shrink-0 text-amber-300"
          />

          <p className="text-[10px] leading-5 text-amber-100/55">
            <strong className="font-bold text-amber-200">
              Investment notice:
            </strong>{' '}
            Returns shown are projections based on the
            plan&apos;s configured daily return rate. Please
            review the plan details before investing.
          </p>
        </div>
      </section>

      {/* Invest */}
      {isPublished ? (
        <button
          type="button"
          onClick={() =>
            router.push(
              `/investment/invest/${plan.id}`,
            )
          }
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-bold text-white shadow-[0_15px_35px_rgba(16,185,129,0.18)] transition hover:bg-emerald-400 active:scale-[0.99]"
        >
          Invest Now
          <ChevronRight size={18} />
        </button>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/8 bg-white/4 py-4 text-center">
          <p className="text-sm font-bold text-white/55">
            Coming Soon
          </p>

          <p className="mt-1 text-[10px] text-white/25">
            This plan is not yet available for
            investment.
          </p>
        </div>
      )}
    </main>
  );
}

function DetailCard({
  icon,
  label,
  value,
  valueClass = 'text-white/80',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-[#0B1426] p-4">
      <div className="text-emerald-300">
        {icon}
      </div>

      <p className="mt-2 text-[10px] text-white/30">
        {label}
      </p>

      <p
        className={`mt-0.5 text-sm font-extrabold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}