
// src/components/TeamMemberCard.tsx


import {
  CheckCircle2,
  Clock3,
} from "lucide-react";

import type { TeamMemberInvestment } from "@/src/lib/types/investment";
import { useTranslation } from "../i18n/translations";

interface TeamMemberCardProps {
  member: TeamMemberInvestment;
}

export default function TeamMemberCard({
  member,
}: TeamMemberCardProps) {
  const { t } = useTranslation();

  const isActive = member.status === "ACTIVE";

  const displayName = member.name.trim() || "Team member";

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <article className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/8 bg-[#0B1426] p-3 transition duration-300 hover:border-[#E60033]/20 hover:bg-[#101D30] sm:p-3.5">

      {/* MEMBER AVATAR */}
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E60033]/20 bg-[#E60033]/10 text-xs font-black text-[#FF476B] sm:h-11 sm:w-11"
      >
        {initials || "?"}
      </div>

      {/* MEMBER INFORMATION */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-white sm:text-[13px]">
          {displayName}
        </p>

        <p className="mt-0.5 truncate text-[10px] leading-4 text-white/40">
          Investment participation
        </p>
      </div>

      {/* MEMBER STATUS */}
      <div
        className={[
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5",
          isActive
            ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
            : "border-white/8 bg-white/5 text-white/45",
        ].join(" ")}
      >
        {isActive ? (
          <CheckCircle2
            size={12}
            aria-hidden="true"
          />
        ) : (
          <Clock3
            size={12}
            aria-hidden="true"
          />
        )}

        <span className="text-[10px] font-bold">
          {isActive
            ? t("profile.active")
            : t("team.inactive")}
        </span>
      </div>
    </article>
  );
}