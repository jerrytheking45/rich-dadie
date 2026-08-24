// src/features/investment/components/TeamSummaryCard.tsx

import {
  Briefcase,
  TrendingUp,
  Users,
  Wallet,
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
  value: string | number;
  icon: typeof Users;
  color: string;
  bg: string;
}

export default function TeamSummaryCard({
  totalInvested,
  activeInvestors,
  totalInvestments,
  totalMembers,
}: TeamSummaryCardProps) {
  const { currency } = useSettings();
  const { t } = useTranslation();

  const stats: TeamStat[] = [
    {
      key: "teamMembers",
      value: totalMembers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      key: "activeInvestors",
      value: activeInvestors,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      key: "totalInvestments",
      value: totalInvestments,
      icon: Briefcase,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      key: "totalInvested",
      value: formatCurrency(totalInvested, currency),
      icon: Wallet,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              transition
              duration-200
              hover:shadow-md
            "
          >
            <div className="flex items-center gap-2">
              <div
                className={`
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${stat.bg}
                `}
              >
                <Icon
                  size={16}
                  className={stat.color}
                  strokeWidth={2}
                />
              </div>

              <span className="text-[10px] font-medium text-slate-500">
                {getStatLabel(stat.key, t)}
              </span>
            </div>

            <p className="mt-2 truncate text-lg font-extrabold text-slate-900">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Maps internal statistic identifiers to the global
 * translation dictionary.
 */
function getStatLabel(
  key: string,
  t: ReturnType<typeof useTranslation>["t"],
): string {
  switch (key) {
    case "teamMembers":
      return t("team.members");

    case "activeInvestors":
      return t("team.active_investors");

    case "totalInvestments":
      return t("team.total_investments");

    case "totalInvested":
      return t("team.contribution");

    default:
      return key;
  }
}

/**
 * Format money according to the currency selected
 * by the user in SettingsContext.
 *
 * The application does not assume UGX anymore.
 */
function formatCurrency(
  amount: number,
  currency: CurrencyCode,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Safe fallback for an unsupported/malformed currency.
    return `${currency} ${amount.toLocaleString()}`;
  }
}