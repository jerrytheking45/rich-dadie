
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

import type {
  InvestmentSummary,
} from "@/src/lib/types/investment";

interface BalanceCardProps {
  summary: InvestmentSummary;
}

/* ==========================================
   CURRENCY FORMATTER
========================================== */

function formatCurrency(
  amount: number,
  currency: string,
  language: string,
): string {
  try {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
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

/* ==========================================
   MASKED VALUES
========================================== */

function getMaskedBalance(
  currency: string,
): string {
  return `${currency} •••••••`;
}

const MASKED_COUNT = "•••";

/* ==========================================
   BALANCE CARD
========================================== */

export default function BalanceCard({
  summary,
}: BalanceCardProps) {

  /*
   * All financial information is hidden
   * by default whenever the card mounts.
   */
  const [visible, setVisible] =
    useState(false);

  const { language, currency } =
    useSettings();

  const { t } = useTranslation();

  /* ========================================
     FORMATTED VALUES
  ======================================== */

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

  const activeInvestments =
    summary.activeInvestments.toLocaleString(
      language,
    );

  const maturedInvestments =
    summary.maturedInvestments.toLocaleString(
      language,
    );

  const maskedBalance =
    getMaskedBalance(currency);

  /* ========================================
     VISIBILITY CONTROL
  ======================================== */

  const toggleVisibility = () => {
    setVisible((current) => !current);
  };

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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[#050B18]/75"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#101D33]/95 via-[#0B1426]/85 to-[#160D1B]/80"
      />

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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-10 h-44 w-44 rounded-full border border-[#FF476B]/10"
      />

      {/* =====================================
          CARD CONTENT
      ====================================== */}

      <div className="relative z-10">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-2.5">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 backdrop-blur-sm">

              <WalletCards
                size={17}
                className="text-[#FF476B]"
                aria-hidden="true"
              />

            </div>

            <div className="min-w-0">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                Total portfolio
              </p>

              <p className="mt-0.5 text-[10px] text-white/30">
                Current account overview
              </p>

            </div>

          </div>

          {/* =================================
              GLOBAL VISIBILITY TOGGLE
          ================================= */}

          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={
              visible
                ? t("balance.hide_balance")
                : t("balance.show_balance")
            }
            aria-pressed={visible}
            title={
              visible
                ? "Hide all balances"
                : "Show all balances"
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#07101F]/50 text-white/60 backdrop-blur-sm transition hover:border-[#E60033]/30 hover:bg-[#E60033]/10 hover:text-[#FF476B] focus:outline-none focus:ring-2 focus:ring-[#E60033]/30"
          >

            {visible ? (
              <Eye
                size={17}
                aria-hidden="true"
              />
            ) : (
              <EyeOff
                size={17}
                aria-hidden="true"
              />
            )}

          </button>

        </div>

        {/* =====================================
            MAIN BALANCE
        ====================================== */}

        <div className="mt-4">

          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
            Active balance
          </p>

          <h2
            className="mt-1 overflow-hidden text-ellipsis text-[30px] font-black tracking-tight text-white tabular-nums sm:text-[34px]"
            aria-label={
              visible
                ? activeBalance
                : "Active balance hidden"
            }
          >

            {visible
              ? activeBalance
              : maskedBalance}

          </h2>

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

        <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-4 sm:grid-cols-4">

          {/* TOTAL INVESTED */}

          <Metric
            icon={WalletCards}
            label="Total invested"
            value={
              visible
                ? totalInvested
                : maskedBalance
            }
            hidden={!visible}
          />

          {/* EXPECTED PROFIT */}

          <Metric
            icon={TrendingUp}
            label="Expected profit"
            value={
              visible
                ? expectedProfit
                : maskedBalance
            }
            hidden={!visible}
            positive
          />

          {/* LOCKED BALANCE */}

          <Metric
            icon={LockKeyhole}
            label="Locked balance"
            value={
              visible
                ? lockedBalance
                : maskedBalance
            }
            hidden={!visible}
          />

          {/* ACTIVE INVESTMENTS */}

          <Metric
            icon={ArrowUpRight}
            label="Active investments"
            value={
              visible
                ? activeInvestments
                : MASKED_COUNT
            }
            hidden={!visible}
          />

        </div>

        {/* =====================================
            MATURED INVESTMENTS
        ====================================== */}

        <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-white/10 bg-[#07101F]/45 px-3.5 py-2.5 backdrop-blur-sm">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
              Matured investments
            </p>

            <p
              className="mt-1 text-sm font-black text-white tabular-nums"
              aria-label={
                visible
                  ? `Matured investments: ${maturedInvestments}`
                  : "Matured investments hidden"
              }
            >

              {visible
                ? maturedInvestments
                : MASKED_COUNT}

            </p>

          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E60033]/10">

            <ArrowUpRight
              size={15}
              className="text-[#FF476B]"
              aria-hidden="true"
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
  hidden?: boolean;
}

function Metric({
  icon: Icon,
  label,
  value,
  positive = false,
  hidden = false,
}: MetricProps) {

  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-[#07101F]/45 p-3 backdrop-blur-sm">

      <div className="flex items-center gap-1.5">

        <Icon
          size={13}
          className={
            positive && !hidden
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
          positive && !hidden
            ? "text-emerald-300"
            : "text-white",
        ].join(" ")}
        aria-label={
          hidden
            ? `${label} hidden`
            : `${label}: ${value}`
        }
      >
        {value}
      </p>

    </div>
  );
}
