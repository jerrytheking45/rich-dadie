
// src/app/investment/investments/[investmentId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  CalendarDays,
  Download,
  MoreVertical,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import InvestmentProgress from '@/src/components/InvestmentProgress';
import InvestmentTransactionList, {
  type InvestmentTransaction,
  type InvestmentTransactionType,
  type InvestmentTransactionStatus,
} from '@/src/components/InvestmentTransactionList';

import { investmentApi } from '@/src/lib/api/investmentApi';
import { useSettings } from '@/src/context/useSettings';
import { formatUSDT } from '@/src/lib/utils/currency';
import type { Investment } from '@/src/lib/types/investment';

export default function InvestmentDetailsPage() {
  const router = useRouter();
  const { investmentId } =
    useParams<{ investmentId: string }>();
  const { currency } = useSettings();

  const [investment, setInvestment] =
    useState<Investment | null>(null);

  const [loading, setLoading] = useState(
    Boolean(investmentId),
  );

  const [error, setError] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const invalidInvestmentId = !investmentId;

  useEffect(() => {
    if (!investmentId) {
      return;
    }

    let cancelled = false;

    const loadInvestment = async (
      showLoading = false,
    ) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const data =
          await investmentApi.getInvestment(
            investmentId,
          );

        if (!cancelled) {
          setInvestment(data);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(
            'Failed to load investment details',
          );
        }
      } finally {
        if (!cancelled && showLoading) {
          setLoading(false);
        }
      }
    };

    void loadInvestment(true);

    const interval = setInterval(() => {
      void loadInvestment(false);
    }, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [investmentId]);

  if (invalidInvestmentId) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <ErrorState
          title="Investment not found"
          message="Invalid investment ID."
          onBack={() =>
            router.push(
              '/investment/investments',
            )
          }
        />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />

          <p className="mt-4 text-xs text-white/35">
            Loading investment...
          </p>
        </div>
      </main>
    );
  }

  if (!investment || error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <ErrorState
          title="Investment not found"
          message={
            error ||
            'The investment could not be found.'
          }
          onBack={() =>
            router.push(
              '/investment/investments',
            )
          }
        />
      </main>
    );
  }

  const handleReportIssue = () => {
    setShowMenu(false);

    router.push(
      `/investment/support/new?category=INVESTMENT&investmentId=${encodeURIComponent(
        investment.id,
      )}`,
    );
  };

  const handleContactSupport = () => {
    setShowMenu(false);
    router.push('/investment/support');
  };

  const transactions: InvestmentTransaction[] = [
    {
      id: `${investment.id}-1`,
      type: 'INVESTMENT' as InvestmentTransactionType,
      description: 'Investment created',
      amount: investment.amount,
      date: investment.createdAt,
      status:
        'COMPLETED' as InvestmentTransactionStatus,
    },

    ...(investment.status === 'ACTIVE' ||
    investment.status === 'MATURED'
      ? [
          {
            id: `${investment.id}-2`,
            type: 'EARNING' as InvestmentTransactionType,
            description: 'Projected earnings',
            amount: investment.expectedReturn,
            date:
              investment.startDate ||
              investment.createdAt,
            status: (
              investment.status === 'MATURED'
                ? 'COMPLETED'
                : 'PENDING'
            ) as InvestmentTransactionStatus,
          },
        ]
      : []),
  ];

  const isPendingDeposit =
    investment.status === 'PENDING';

  return (
    <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0 text-center">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
            Investment
          </p>

          <p className="truncate text-sm font-extrabold text-white">
            {investment.id}
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowMenu((current) => !current)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
            aria-label="More options"
            aria-expanded={showMenu}
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#101D33] py-1 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <button
                type="button"
                className="flex w-full items-center px-4 py-3 text-left text-xs font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
                onClick={handleReportIssue}
              >
                Report an issue
              </button>

              <button
                type="button"
                className="flex w-full items-center px-4 py-3 text-left text-xs font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
                onClick={handleContactSupport}
              >
                Contact support
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Investment hero */}
      <section className="mt-5 overflow-hidden rounded-[28px] border border-emerald-300/10 bg-linear-to-br from-[#123E39] via-[#0B302D] to-[#071A28] text-white shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <div className="relative p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[9px] font-bold">
                  {investment.status}
                </span>

                <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
                  {investment.planName ||
                    'Investment Plan'}
                </h1>

                <p className="mt-1 break-all text-[9px] text-white/35">
                  Investment ID: {investment.id}
                </p>
              </div>

              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/6 sm:h-24 sm:w-24">
                {investment.image ? (
                  <Image
                    src={investment.image}
                    alt={
                      investment.planName ||
                      'Investment'
                    }
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-emerald-300">
                    <TrendingUp size={28} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">
                Investment amount
              </p>

              <p className="mt-1 text-[30px] font-extrabold tracking-tight">
                {formatUSDT(
                  investment.amount,
                  currency,
                )}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="text-[9px] text-white/35">
                  Expected earnings
                </p>

                <p className="mt-1 text-sm font-bold text-emerald-300">
                  {formatUSDT(
                    investment.expectedReturn,
                    currency,
                  )}
                </p>
              </div>

              <div>
                <p className="text-[9px] text-white/35">
                  Projected value
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {formatUSDT(
                    investment.projectedValue,
                    currency,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="mt-4">
        <InvestmentProgress
          progress={investment.progress}
          durationDays={
            investment.durationDays || 0
          }
          startDate={
            investment.startDate ||
            investment.createdAt
          }
          maturityDate={
            investment.maturityDate || ''
          }
        />
      </section>

      {/* Summary */}
      <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-white">
              Investment Summary
            </h2>

            <p className="mt-0.5 text-[10px] text-white/30">
              Important details
            </p>
          </div>

          <ShieldCheck
            size={21}
            className="text-emerald-300"
          />
        </div>

        <div className="mt-4 space-y-2">
          <SummaryRow
            label="Investment amount"
            value={formatUSDT(
              investment.amount,
              currency,
            )}
          />

          <SummaryRow
            label="Duration"
            value={`${investment.durationDays || 0} days`}
          />

          <SummaryRow
            label="Expected earnings"
            value={formatUSDT(
              investment.expectedReturn,
              currency,
            )}
            positive
          />

          <SummaryRow
            label="Daily earnings"
            value={formatUSDT(
              (investment.amount *
                (investment.expectedReturnRate ||
                  0)) /
                100,
              currency,
            )}
          />

          <SummaryRow
            label="Projected value"
            value={formatUSDT(
              investment.projectedValue,
              currency,
            )}
            highlight
          />

          <SummaryRow
            label="Investment status"
            value={investment.status}
          />
        </div>
      </section>

      {/* Dates */}
      <section className="mt-4 grid grid-cols-2 gap-3">
        <DateCard
          label="Purchase date"
          date={
            investment.startDate ||
            investment.createdAt
          }
        />

        <DateCard
          label="Maturity date"
          date={
            investment.maturityDate || ''
          }
        />
      </section>

      {/* Transactions */}
      <section className="mt-4">
        <InvestmentTransactionList
          transactions={transactions}
        />
      </section>

      {/* Actions */}
      <section className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() =>
            router.push(
              '/investment/profile/statements',
            )
          }
          className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#0B1426] px-4 py-3 text-xs font-bold text-white/65 transition hover:bg-white/7 hover:text-white"
        >
          <Download size={15} />
          Statement
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/investment/investments/${encodeURIComponent(
                investment.id,
              )}/deposit`,
            )
          }
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm transition active:scale-[0.99] ${
            isPendingDeposit
              ? 'bg-amber-500 hover:bg-amber-400'
              : 'bg-emerald-500 hover:bg-emerald-400'
          }`}
        >
          <Wallet size={15} />

          {isPendingDeposit
            ? 'Complete Deposit'
            : 'Manage'}
        </button>
      </section>

      {/* Notice */}
      <section className="mt-4 rounded-[22px] border border-amber-400/10 bg-amber-400/6 p-4">
        <div className="flex gap-3">
          <CalendarDays
            size={18}
            className="mt-0.5 shrink-0 text-amber-300"
          />

          <div>
            <p className="text-xs font-bold text-amber-200">
              Investment information
            </p>

            <p className="mt-1 text-[10px] leading-5 text-amber-100/45">
              Projected values shown here are estimates
              based on the investment plan. Final amounts
              are determined according to the applicable
              investment terms.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  positive = false,
  highlight = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/4 px-3 py-3">
      <span className="text-[10px] text-white/35">
        {label}
      </span>

      <span
        className={`text-xs font-extrabold ${
          positive
            ? 'text-emerald-300'
            : highlight
              ? 'text-[#F7C948]'
              : 'text-white/80'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function DateCard({
  label,
  date,
}: {
  label: string;
  date: string;
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Not available';

  return (
    <div className="rounded-[20px] border border-white/8 bg-[#0B1426] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
        <CalendarDays size={17} />
      </div>

      <p className="mt-3 text-[9px] uppercase tracking-[0.15em] text-white/30">
        {label}
      </p>

      <p className="mt-1 text-xs font-extrabold text-white/80">
        {formattedDate}
      </p>
    </div>
  );
}

function ErrorState({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="w-full rounded-[26px] border border-white/8 bg-[#0B1426] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-2xl">
        📦
      </div>

      <h1 className="mt-4 text-lg font-extrabold text-white">
        {title}
      </h1>

      <p className="mt-1 text-xs leading-5 text-white/35">
        {message}
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-400"
      >
        Back to investments
      </button>
    </div>
  );
}