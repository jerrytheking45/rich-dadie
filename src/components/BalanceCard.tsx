
"use client";

import Image from "next/image";
import { useState } from "react";

import {
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  TrendingUp,
  Wallet,
  WalletCards,
} from "lucide-react";

import { useSettings } from "../context/useSettings";
import { useTranslation } from "../i18n/translations";

import type { InvestmentSummary } from "@/src/lib/types/investment";

interface BalanceCardProps {
  summary: InvestmentSummary;
}

/* ==========================================
   CURRENCY FORMATTER
========================================== */

function formatCurrency(
  amount: number,
  currency: string,
  language: string
): string {
  try {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(language, {
      maximumFractionDigits: 2,
    })}`;
  }
}

function getMaskedBalance(currency: string): string {
  return `${currency} •••••••`;
}

/* ==========================================
   BALANCE CARD
========================================== */

export default function BalanceCard({
  summary,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  const { language, currency } = useSettings();
  const { t } = useTranslation();

  const activeBalance = formatCurrency(
    summary.activeBalance,
    currency,
    language
  );

  const totalInvested = formatCurrency(
    summary.totalInvested,
    currency,
    language
  );

  const expectedProfit = formatCurrency(
    summary.totalExpectedProfit,
    currency,
    language
  );

  const lockedBalance = formatCurrency(
    summary.totalLockedBalance,
    currency,
    language
  );

  const maskedBalance = getMaskedBalance(currency);

  return (
    <section
      aria-label={t("balance.total_portfolio")}
      className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1426] p-5 shadow-2xl shadow-black/30 sm:p-6"
    >

      {/* =====================================
          BACKGROUND IMAGE
      ====================================== */}

      <Image
        src="/images/hero.png"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 900px"
        className="pointer-events-none -z-30 object-cover object-center opacity-90"
        aria-hidden="true"
      />

      {/* =====================================
          DARK IMAGE OVERLAYS
      ====================================== */}

      {/* Main navy overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[#050B18]/75"
      />

      {/* Directional gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#101D33]/95 via-[#0B1426]/85 to-[#160D1B]/80"
      />

      {/* Subtle red brand tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-tr from-[#E60033]/10 via-transparent to-[#E60033]/5"
      />

      {/* =====================================
          AMBIENT LIGHTING
      ====================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#E60033]/12 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-[#FF476B]/8 blur-3xl"
      />

      {/* Decorative ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-10 h-44 w-44 rounded-full border border-[#FF476B]/10"
      />

      {/* =====================================
          CARD CONTENT
      ====================================== */}

      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 backdrop-blur-sm">
              <WalletCards
                size={17}
                className="text-[#FF476B]"
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                Total portfolio
              </p>

              <p className="mt-0.5 text-[10px] text-white/30">
                Current account overview
              </p>
            </div>
          </div>

          {/* VISIBILITY TOGGLE */}
          <button
            type="button"
            onClick={() =>
              setVisible((value) => !value)
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#07101F]/50 text-white/60 backdrop-blur-sm transition hover:border-[#E60033]/30 hover:bg-[#E60033]/10 hover:text-[#FF476B] focus:outline-none focus:ring-2 focus:ring-[#E60033]/30"
            aria-label={
              visible
                ? t("balance.hide_balance")
                : t("balance.show_balance")
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

        {/* =====================================
            MAIN BALANCE
        ====================================== */}

        <div className="mt-1 ">

          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
            Active balance
          </p>

          <h1 className="mt-1 overflow-hidden text-ellipsis text-[30px] font-black tracking-tight text-white tabular-nums sm:text-[34px]">
            {visible
              ? activeBalance
              : maskedBalance}
          </h1>

          {/* AVAILABLE BADGE */}
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#E60033]/20 bg-[#E60033]/10 px-2.5 py-1.5 backdrop-blur-sm">

            <Wallet
              size={12}
              className="text-[#FF476B]"
              aria-hidden="true"
            />

            <span className="text-[10px] font-bold text-[#FF7895]">
              Available
            </span>

            <span className="text-[9px] text-white/35">
              Withdrawable
            </span>
          </div>
        </div>

        {/* =====================================
            FINANCIAL METRICS
        ====================================== */}

        <div className="mt-1 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-4 sm:grid-cols-4">

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
              language
            )}
          />
        </div>

        {/* =====================================
            MATURED INVESTMENTS
        ====================================== */}

        <div className="mt-1.5 flex items-center justify-between rounded-2xl border border-white/10 bg-[#07101F]/45 px-3.5 py-1.5 backdrop-blur-sm">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
              Matured investments
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {summary.maturedInvestments.toLocaleString(
                language
              )}
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E60033]/10">
            <ArrowUpRight
              size={15}
              className="text-[#FF476B]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   METRIC COMPONENT
========================================== */

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
    <div className="rounded-2xl border border-white/10 bg-[#07101F]/45 p-3 backdrop-blur-sm">

      <div className="flex items-center gap-1.5">

        <Icon
          size={13}
          className={
            positive
              ? "text-emerald-300"
              : "text-[#FF476B]/75"
          }
          aria-hidden="true"
        />

        <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-white/40">
          {label}
        </p>
      </div>

      <p
        className={[
          "mt-2 truncate text-xs font-black tabular-nums",
          positive
            ? "text-emerald-300"
            : "text-white",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}