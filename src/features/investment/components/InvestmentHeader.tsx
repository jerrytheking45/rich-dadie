// src/features/investment/components/InvestmentHeader.tsx

import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

import { useTranslation } from "../i18n/translations";

interface InvestmentHeaderProps {
  name?: string;
  avatar?: string;
  notificationCount?: number;
}

const DEFAULT_MEMBER_NAME = "Team Member";

export default function InvestmentHeader({
  name = DEFAULT_MEMBER_NAME,
  avatar,
  notificationCount = 0,
}: InvestmentHeaderProps) {
  const { t } = useTranslation();

  const displayName = name.trim() || DEFAULT_MEMBER_NAME;

  const avatarInitial = displayName
    .trim()
    .charAt(0)
    .toUpperCase();

  const normalizedNotificationCount = Math.max(
    0,
    Math.floor(notificationCount),
  );

  return (
    <header className="flex items-center justify-between">
      {/* --------------------------------------------------------- */}
      {/* User identity                                             */}
      {/* --------------------------------------------------------- */}

      <div className="flex min-w-0 items-center gap-3">
        <div
          className="
            relative
            h-11
            w-11
            shrink-0
            overflow-hidden
            rounded-full
            border-2
            border-white
            bg-emerald-100
            shadow-sm
          "
        >
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                text-sm
                font-bold
                text-emerald-700
              "
              aria-hidden="true"
            >
              {avatarInitial}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-400">
            {t("header.welcome_back")}
          </p>

          <button
            type="button"
            className="
              flex
              max-w-[180px]
              items-center
              gap-1
              text-[15px]
              font-bold
              text-slate-900
              transition
              hover:text-emerald-600
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/30
              focus:ring-offset-2
              rounded-md
            "
            aria-label={displayName}
          >
            <span className="truncate">
              {displayName}
            </span>

            <ChevronDown
              size={14}
              className="shrink-0 text-slate-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* Header actions                                            */}
      {/* --------------------------------------------------------- */}

      <div className="flex shrink-0 items-center gap-2">
        {/* Search */}
        <button
          type="button"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white
            text-slate-500
            transition
            hover:border-emerald-200
            hover:text-emerald-600
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500/30
            focus:ring-offset-2
          "
          aria-label="Search"
        >
          <Search
            size={18}
            aria-hidden="true"
          />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white
            text-slate-500
            transition
            hover:border-emerald-200
            hover:text-emerald-600
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500/30
            focus:ring-offset-2
          "
          aria-label="Notifications"
        >
          <Bell
            size={18}
            aria-hidden="true"
          />

          {normalizedNotificationCount > 0 && (
            <span
              className="
                absolute
                right-1
                top-1
                flex
                h-4
                min-w-4
                items-center
                justify-center
                rounded-full
                bg-red-500
                px-1
                text-[8px]
                font-bold
                text-white
              "
              aria-label={`${normalizedNotificationCount} notifications`}
            >
              {normalizedNotificationCount > 9
                ? "9+"
                : normalizedNotificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}