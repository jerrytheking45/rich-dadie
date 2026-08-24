// src/features/investment/components/TeamMemberCard.tsx

import {
  CheckCircle2,
  Clock3,
} from "lucide-react";

import type { TeamMemberInvestment } from "../types/investment";
import { useSettings } from "../context/useSettings";
import { useTranslation } from "../i18n/translations";

interface TeamMemberCardProps {
  member: TeamMemberInvestment;
}

const TeamMemberCard = ({
  member,
}: TeamMemberCardProps) => {
  const { currency, language } = useSettings();
  const { t } = useTranslation();

  const isActive = member.status === "ACTIVE";

  /**
   * Format monetary values using the user's
   * selected currency and language.
   */
  const formattedAmount = new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    maximumFractionDigits: 2,
  }).format(member.investedAmount);

  /**
   * Safely create the member's initials.
   */
  const initial = member.name.trim().charAt(0).toUpperCase();

  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      {/* Avatar */}
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-emerald-100
          text-sm
          font-bold
          text-emerald-700
        "
        aria-hidden="true"
      >
        {initial || "?"}
      </div>

      {/* Member information */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900">
          {member.name}
        </p>

        <p className="truncate text-xs text-slate-500">
          {member.planName}
        </p>
      </div>

      {/* Investment + status */}
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900">
          {formattedAmount}
        </p>

        <div className="flex items-center justify-end gap-1">
          {isActive ? (
            <>
              <CheckCircle2
                size={12}
                className="text-emerald-500"
                aria-hidden="true"
              />

              <span className="text-[10px] font-medium text-emerald-600">
                {t("profile.active")}
              </span>
            </>
          ) : (
            <>
              <Clock3
                size={12}
                className="text-slate-400"
                aria-hidden="true"
              />

              <span className="text-[10px] font-medium text-slate-400">
                {t("team.inactive")}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;