// src/components/TeamSummaryCard.tsx


import {
  Briefcase,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { useSettings } from "../context/useSettings";
import { useTranslation } from "../i18n/translations";
import type { CurrencyCode } from "../constants/settings";

interface TeamSummaryCardProps {
  totalInvested: number;
  activeInvestors: number;
  totalInvestments: number;
  totalMembers: number;
}

interface TeamStat {
  key: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

function formatCurrency(
  amount: number,
  currency: CurrencyCode
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function TeamSummaryCard({
  totalInvested,
  activeInvestors,
  totalInvestments,
  totalMembers,
}: TeamSummaryCardProps) {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const formatCount = (value: number) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);

  const stats: TeamStat[] = [
    {
      key: "teamMembers",
      value: formatCount(totalMembers),
      icon: Users,
      color: "text-[#FF476B]",
      bg: "border-[#E60033]/20 bg-[#E60033]/10",
    },
    {
      key: "activeInvestors",
      value: formatCount(activeInvestors),
      icon: TrendingUp,
      color: "text-emerald-300",
      bg: "border-emerald-400/15 bg-emerald-400/10",
    },
    {
      key: "totalInvestments",
      value: formatCount(totalInvestments),
      icon: Briefcase,
      color: "text-[#FF476B]",
      bg: "border-[#E60033]/20 bg-[#E60033]/10",
    },
    {
      key: "totalInvested",
      value: formatCurrency(totalInvested, currency),
      icon: Wallet,
      color: "text-[#FF476B]",
      bg: "border-[#E60033]/20 bg-[#E60033]/10",
    },
  ];

  const labels: Record<string, string> = {
    teamMembers: t("team.members"),
    activeInvestors: t("team.active_investors"),
    totalInvestments: t("team.total_investments"),
    totalInvested: t("team.contribution"),
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.key}
            className="group min-w-0 rounded-2xl border border-white/8 bg-[#0B1426] p-3.5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#E60033]/25 hover:bg-[#101D30] sm:p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${stat.bg}`}
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  className={stat.color}
                  aria-hidden="true"
                />
              </div>

              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E60033]/50 transition group-hover:bg-[#E60033]" />
            </div>

            <p className="mt-3 text-[10px] font-semibold leading-4 text-white/45 sm:text-[11px]">
              {labels[stat.key]}
            </p>

            <p
              title={stat.value}
              className="mt-1 min-w-0 wrap-break-word text-lg font-black leading-tight tracking-tight text-white tabular-nums sm:text-xl"
            >
              {stat.value}
            </p>
          </article>
        );
      })}
    </div>
  );
}