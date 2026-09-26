
// src/components/TeamMemberCard.tsx

import {
  CheckCircle2,
  Clock3,
} from 'lucide-react';

import type { TeamMemberInvestment } from '@/src/lib/types/investment';
import { useTranslation } from '../i18n/translations';

interface TeamMemberCardProps {
  member: TeamMemberInvestment;
}

const TeamMemberCard = ({
  member,
}: TeamMemberCardProps) => {
  const { t } = useTranslation();

  const isActive = member.status === 'ACTIVE';

  const initial =
    member.name.trim().charAt(0).toUpperCase();

  return (
    <div
      className="
        group
        flex items-center gap-4
        rounded-[22px]
        border border-white/8
        bg-[#0B1426]
        p-4
        shadow-lg shadow-black/10
        transition duration-300
        hover:border-white/12
        hover:bg-[#0D182C]
      "
    >
      <div
        className="
          flex h-12 w-12 shrink-0
          items-center justify-center
          rounded-2xl
          border border-[#F7C948]/10
          bg-[#F7C948]/8
          text-sm font-black
          text-[#F7C948]
        "
        aria-hidden="true"
      >
        {initial || '?'}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">
          {member.name}
        </p>

        <p className="mt-1 truncate text-xs text-white/35">
          Investment participation
        </p>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {isActive ? (
            <>
              <CheckCircle2
                size={13}
                className="text-emerald-300"
                aria-hidden="true"
              />

              <span className="text-[10px] font-bold text-emerald-300">
                {t('profile.active')}
              </span>
            </>
          ) : (
            <>
              <Clock3
                size={13}
                className="text-white/25"
                aria-hidden="true"
              />

              <span className="text-[10px] font-semibold text-white/30">
                {t('team.inactive')}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;