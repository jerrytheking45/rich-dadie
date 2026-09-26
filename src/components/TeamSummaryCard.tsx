// src/components/TeamSummaryCard.tsx

import {
  Briefcase,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

import { useSettings } from '../context/useSettings';
import { useTranslation } from '../i18n/translations';
import type { CurrencyCode } from '../constants/settings';

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
      key: 'teamMembers',
      value: totalMembers,
      icon: Users,
      color: 'text-sky-300',
      bg: 'bg-sky-300/10',
    },
    {
      key: 'activeInvestors',
      value: activeInvestors,
      icon: TrendingUp,
      color: 'text-emerald-300',
      bg: 'bg-emerald-300/10',
    },
    {
      key: 'totalInvestments',
      value: totalInvestments,
      icon: Briefcase,
      color: 'text-[#F7C948]',
      bg: 'bg-[#F7C948]/10',
    },
    {
      key: 'totalInvested',
      value: formatCurrency(totalInvested, currency),
      icon: Wallet,
      color: 'text-violet-300',
      bg: 'bg-violet-300/10',
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
              rounded-[22px]
              border border-white/8
              bg-[#0B1426]
              p-4
              shadow-lg shadow-black/10
              transition
              duration-300
              hover:-translate-y-0.5
              hover:border-white/12
            "
          >
            <div className="flex items-center gap-2.5">
              <div
                className={[
                  'flex h-9 w-9 shrink-0 items-center justify-center',
                  'rounded-xl',
                  stat.bg,
                ].join(' ')}
              >
                <Icon
                  size={16}
                  className={stat.color}
                  strokeWidth={2}
                />
              </div>

              <span className="truncate text-[10px] font-semibold text-white/40">
                {getStatLabel(stat.key, t)}
              </span>
            </div>

            <p className="mt-3 truncate text-xl font-black tracking-tight text-white">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function getStatLabel(
  key: string,
  t: ReturnType<typeof useTranslation>['t'],
): string {
  switch (key) {
    case 'teamMembers':
      return t('team.members');

    case 'activeInvestors':
      return t('team.active_investors');

    case 'totalInvestments':
      return t('team.total_investments');

    case 'totalInvested':
      return t('team.contribution');

    default:
      return key;
  }
}

function formatCurrency(
  amount: number,
  currency: CurrencyCode,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}