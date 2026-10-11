
// src/components/InvestmentBottomNav.tsx


// src/components/InvestmentBottomNav.tsx


"use client";

import {
  ChevronDown,
  ChevronUp,
  Gift,
  Home,
  Package,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useTranslation } from "../i18n/translations";

interface NavItem {
  translationKey:
    | "nav.home"
    | "nav.investments"
    | "nav.promotions"
    | "nav.wallet"
    | "nav.profile";
  path: string;
  icon: LucideIcon;
}

const navigation: NavItem[] = [
  {
    translationKey: "nav.home",
    path: "/investment",
    icon: Home,
  },
  {
    translationKey: "nav.investments",
    path: "/investment/investments",
    icon: Package,
  },
  {
    translationKey: "nav.promotions",
    path: "/investment/promotions",
    icon: Gift,
  },
  {
    translationKey: "nav.wallet",
    path: "/investment/wallet",
    icon: Wallet,
  },
  {
    translationKey: "nav.profile",
    path: "/investment/profile",
    icon: UserRound,
  },
];

export default function InvestmentBottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(true);

  return (
    <nav
      aria-label="Investment navigation"
      className={[
        "pointer-events-none fixed inset-x-0 bottom-0 z-50",
        "px-3 pb-[calc(env(safe-area-inset-bottom)+10px)]",
        "sm:px-5",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-150 flex-col items-center">

        {/* =====================================
            EXPAND / COLLAPSE BUTTON
        ====================================== */}

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-label={
            expanded
              ? "Collapse investment navigation"
              : "Expand investment navigation"
          }
          aria-expanded={expanded}
          aria-controls="investment-bottom-nav-menu"
          className={[
            "pointer-events-auto relative z-20",
            "flex h-7 w-12 items-center justify-center",
            "border border-white/10 bg-[#0B1426]/95",
            "text-white/50 backdrop-blur-xl",
            "shadow-[0_-6px_22px_rgba(0,0,0,0.2)]",
            "transition-all duration-300",
            "hover:border-[#E60033]/30 hover:text-[#FF476B]",
            "focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-[#E60033]/50",
            expanded
              ? "rounded-t-xl border-b-0"
              : "rounded-xl",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-5 w-7 items-center justify-center",
              "rounded-md transition-colors duration-300",
              expanded
                ? "bg-[#E60033]/10 text-[#FF476B]"
                : "bg-white/5 text-white/60",
            ].join(" ")}
          >
            {expanded ? (
              <ChevronDown
                size={15}
                strokeWidth={2.3}
                aria-hidden="true"
              />
            ) : (
              <ChevronUp
                size={15}
                strokeWidth={2.3}
                aria-hidden="true"
              />
            )}
          </span>
        </button>

        {/* =====================================
            NAVIGATION SHELL
        ====================================== */}

        <div
          id="investment-bottom-nav-menu"
          aria-hidden={!expanded}
          className={[
            "pointer-events-auto relative w-full overflow-hidden",
            "rounded-[18px] border border-white/10",
            "bg-[#0B1426]/97",
            "shadow-[0_12px_45px_rgba(0,0,0,0.48)]",
            "backdrop-blur-2xl",
            "transition-all duration-300 ease-out",
            expanded
              ? "max-h-24 translate-y-0 scale-100 opacity-100"
              : "pointer-events-none max-h-0 translate-y-2 scale-95 border-transparent opacity-0",
          ].join(" ")}
        >
          {/* Subtle top brand line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-[#E60033]/55 to-transparent"
          />

          {/* NAVIGATION ITEMS */}
          <div className="relative grid w-full grid-cols-5 gap-1 px-2 py-2 sm:gap-2 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const label = t(item.translationKey);

              const isActive =
                pathname === item.path ||
                (item.path !== "/investment" &&
                  pathname.startsWith(`${item.path}/`));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={expanded ? 0 : -1}
                  className={[
                    "group relative flex min-w-0 flex-col",
                    "items-center justify-center gap-1",
                    "rounded-xl px-1 py-1.5",
                    "transition-all duration-200",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-[#E60033]/50",
                    isActive
                      ? "bg-[#E60033]/10 text-[#FF476B]"
                      : "text-white/40 hover:bg-white/5 hover:text-white/80",
                  ].join(" ")}
                >
                  {/* Active top indicator */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-[#E60033] shadow-[0_0_12px_rgba(230,0,51,0.45)]"
                    />
                  )}

                  {/* Icon container */}
                  <span
                    className={[
                      "relative flex h-8 w-8 items-center justify-center",
                      "rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-[#E60033]/10"
                        : "bg-transparent group-hover:bg-white/5",
                    ].join(" ")}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.3 : 1.8}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:-translate-y-0.5"
                    />
                  </span>

                  {/* Translated label */}
                  <span
                    className={[
                      "relative block w-full truncate text-center",
                      "text-[9px] font-semibold leading-3",
                      "sm:text-[10px]",
                      isActive
                        ? "font-bold text-[#FF476B]"
                        : "text-inherit",
                    ].join(" ")}
                  >
                    {label}
                  </span>

                  {/* Active bottom dot */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#E60033]"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}