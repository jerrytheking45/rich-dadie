
// src/app/investment/plans/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import InvestmentPlanCard from '@/src/components/InvestmentPlanCard';
import { investmentApi } from '@/src/lib/api/investmentApi';
import type { InvestmentPlan } from '@/src/lib/types/investment';

const PlansPage = () => {
  const router = useRouter();

  const [plans, setPlans] = useState<
    InvestmentPlan[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPlans = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await investmentApi.getPlans();

        if (!cancelled) {
          setPlans(
            data.filter(
              (plan) =>
                plan.status === 'PUBLISHED',
            ),
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            'Failed to load investment plans',
          );
        }

        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPlans();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlanClick = (planId: string) => {
    router.push(
      `/investment/plans/${planId}`,
    );
  };

  return (
    <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
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
              Explore
            </p>

            <h1 className="truncate text-[19px] font-extrabold tracking-tight text-white">
              Investment Plans
            </h1>
          </div>
        </div>

        <div className="flex h-10 min-w-10 items-center justify-center rounded-full border border-emerald-400/10 bg-emerald-400/8 px-3 text-xs font-extrabold text-emerald-300">
          {plans.length}
        </div>
      </header>

      {/* Introduction */}
      <section className="mt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/8 text-amber-300">
            <Sparkles size={15} />
          </div>

          <div>
            <p className="text-xs font-bold text-white/80">
              Opportunities for your team
            </p>

            <p className="text-[10px] text-white/30">
              Choose an investment plan that suits
              your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Featured card */}
      <section className="mt-5">
        <div className="relative overflow-hidden rounded-[28px] border border-emerald-300/10 bg-linear-to-br from-[#123E39] via-[#0B302D] to-[#071A28] p-5 text-white shadow-[0_25px_65px_rgba(0,0,0,0.25)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-300/10 blur-2xl"
          />

          <div className="relative">
            <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide">
              Employee investment
            </span>

            <h2 className="mt-3 text-xl font-extrabold tracking-tight">
              Grow your future.
            </h2>

            <p className="mt-1 max-w-sm text-[10px] leading-5 text-white/45">
              Explore investment opportunities created
              specifically for company team members.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/6">
                <Sparkles size={13} />
              </div>

              <span className="text-[10px] font-semibold text-white/55">
                {loading
                  ? 'Loading...'
                  : `${plans.length} published ${
                      plans.length === 1
                        ? 'plan'
                        : 'plans'
                    } available`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans heading */}
      <section className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-white">
              Investment Plans
            </h2>

            <p className="mt-0.5 text-[10px] text-white/30">
              Select a plan to view its details.
            </p>
          </div>

          {plans.length > 0 && (
            <span className="text-[10px] font-semibold text-emerald-300">
              {plans.length}{' '}
              {plans.length === 1
                ? 'option'
                : 'options'}
            </span>
          )}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="mt-6 rounded-3xl border border-white/8 bg-[#0B1426] px-5 py-12 text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />

          <p className="mt-4 text-xs text-white/35">
            Loading plans...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-400/15 bg-red-400/8 p-4">
          <p className="text-xs text-red-200">
            {error}
          </p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {plans.length > 0 ? (
            <section className="mt-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan) => (
                  <InvestmentPlanCard
                    key={plan.id}
                    plan={plan}
                    onClick={() =>
                      handlePlanClick(plan.id)
                    }
                  />
                ))}
              </div>
            </section>
          ) : (
            <section className="mt-4">
              <div className="rounded-[26px] border border-dashed border-white/10 bg-[#0B1426] px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-2xl">
                  ✨
                </div>

                <h3 className="mt-4 text-sm font-extrabold text-white">
                  No investment plans available
                </h3>

                <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-white/30">
                  There are currently no published
                  investment plans available for team
                  members.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push('/investment')
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-400 active:scale-95"
                >
                  Back to investments
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default PlansPage;
