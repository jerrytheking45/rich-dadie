
// src/components/BalanceCard.tsx

'use client';

import {
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  TrendingUp,
  Wallet,
  WalletCards,
} from 'lucide-react';
import { useState } from 'react';

import { useSettings } from '../context/useSettings';
import { useTranslation } from '../i18n/translations';

import type { InvestmentSummary } from '@/src/lib/types/investment';

interface BalanceCardProps {
  summary: InvestmentSummary;
}

function formatCurrency(
  amount: number,
  currency: string,
  language: string,
): string {
  try {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(
      language,
      {
        maximumFractionDigits: 2,
      },
    )}`;
  }
}

function getMaskedBalance(currency: string): string {
  return `${currency} •••••••`;
}

export default function BalanceCard({
  summary,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  const { language, currency } = useSettings();
  const { t } = useTranslation();

  const activeBalance = formatCurrency(
    summary.activeBalance,
    currency,
    language,
  );

  const totalInvested = formatCurrency(
    summary.totalInvested,
    currency,
    language,
  );

  const expectedProfit = formatCurrency(
    summary.totalExpectedProfit,
    currency,
    language,
  );

  const lockedBalance = formatCurrency(
    summary.totalLockedBalance,
    currency,
    language,
  );

  const maskedBalance =
    getMaskedBalance(currency);

  return (
    <section
      aria-label={t(
        'balance.total_portfolio',
      )}
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-br from-[#102A2A] via-[#0B3029] to-[#08231F] p-5 shadow-2xl shadow-emerald-950/30 sm:p-6"
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-[#F7C948]/6 blur-3xl"
      />

      {/* Decorative ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-10 h-44 w-44 rounded-full border border-white/5"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/8">
              <WalletCards
                size={17}
                className="text-emerald-200"
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                Total portfolio
              </p>

              <p className="mt-0.5 text-[10px] text-white/20">
                Current account overview
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setVisible((value) => !value)
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/6 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
            aria-label={
              visible
                ? t('balance.hide_balance')
                : t('balance.show_balance')
            }
            aria-pressed={visible}
          >
            {visible ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}
          </button>
        </div>

        {/* Main balance */}
        <div className="mt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
            Active balance
          </p>

          <h1 className="mt-1 overflow-hidden text-ellipsis text-[30px] font-black tracking-tight text-white tabular-nums sm:text-[34px]">
            {visible
              ? activeBalance
              : maskedBalance}
          </h1>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/10 bg-emerald-300/8 px-2.5 py-1.5">
            <Wallet
              size={12}
              className="text-emerald-200"
              aria-hidden="true"
            />

            <span className="text-[10px] font-bold text-emerald-100/80">
              Available
            </span>

            <span className="text-[9px] text-white/25">
              Withdrawable
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-white/8 pt-4 sm:grid-cols-4">
          <Metric
            icon={WalletCards}
            label="Total invested"
            value={
              visible
                ? totalInvested
                : maskedBalance
            }
          />

          <Metric
            icon={TrendingUp}
            label="Expected profit"
            value={
              visible
                ? expectedProfit
                : maskedBalance
            }
            positive
          />

          <Metric
            icon={LockKeyhole}
            label="Locked balance"
            value={
              visible
                ? lockedBalance
                : maskedBalance
            }
          />

          <Metric
            icon={ArrowUpRight}
            label="Active investments"
            value={summary.activeInvestments.toLocaleString(
              language,
            )}
          />
        </div>

        {/* Matured */}
        <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.035] px-3.5 py-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">
              Matured investments
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {summary.maturedInvestments.toLocaleString(
                language,
              )}
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
            <ArrowUpRight
              size={15}
              className="text-white/40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricProps {
  icon: typeof WalletCards;
  label: string;
  value: string;
  positive?: boolean;
}

function Metric({
  icon: Icon,
  label,
  value,
  positive = false,
}: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/[0.035] p-3">
      <div className="flex items-center gap-1.5">
        <Icon
          size={13}
          className={
            positive
              ? 'text-emerald-300'
              : 'text-white/35'
          }
          aria-hidden="true"
        />

        <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-white/30">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-xs font-black text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}