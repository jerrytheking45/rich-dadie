
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] sm:px-5"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        {/* ---------------------------------------------------------------- */}
        {/* Toggle button                                                     */}
        {/* ---------------------------------------------------------------- */}

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-label={
            expanded
              ? "Collapse investment navigation"
              : "Expand investment navigation"
          }
          aria-expanded={expanded}
          className={[
            "pointer-events-auto relative z-20 mb-px",
            "flex h-8 w-12 items-center justify-center",
            "rounded-t-2xl border border-b-0",
            "border-white/10",
            "bg-[#171A38]/95",
            "text-white/55",
            "shadow-[0_-8px_25px_rgba(0,0,0,0.22)]",
            "backdrop-blur-xl",
            "transition-all duration-300",
            "hover:bg-[#20244A]",
            "hover:text-emerald-300",
            "focus:outline-none",
            "focus:ring-2 focus:ring-emerald-400/30",
            expanded
              ? "translate-y-0"
              : "translate-y-0 rounded-b-2xl border-b",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-5 w-7 items-center justify-center",
              "rounded-full",
              "bg-white/5",
              "transition-all duration-300",
              expanded
                ? "bg-emerald-400/10 text-emerald-300"
                : "text-white/50",
            ].join(" ")}
          >
            {expanded ? (
              <ChevronDown
                size={15}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            ) : (
              <ChevronUp
                size={15}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            )}
          </span>
        </button>

        {/* ---------------------------------------------------------------- */}
        {/* Navigation shell                                                  */}
        {/* ---------------------------------------------------------------- */}

        <div
          className={[
            "pointer-events-auto w-full",
            "overflow-hidden",
            "rounded-3xl border border-white/10",
            "bg-linear-to-b from-[#211E4A]/97 to-[#11152F]/97",
            "shadow-[0_14px_50px_rgba(0,0,0,0.42)]",
            "backdrop-blur-2xl",
            "transition-all duration-400 ease-out",
            expanded
              ? "max-h-32 translate-y-0 scale-100 opacity-100"
              : "max-h-0 translate-y-3 scale-95 border-transparent opacity-0",
          ].join(" ")}
        >
          {/* Top glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/45 to-transparent"
          />

          <div className="relative flex w-full items-stretch justify-between px-2 py-2 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const label = t(item.translationKey);

              const isActive =
                pathname === item.path ||
                (item.path !== "/investment" &&
                  pathname.startsWith(
                    `${item.path}/`,
                  ));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-label={label}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  className={[
  "group relative flex min-w-0 flex-1",
  "flex-col items-center justify-center",
  "gap-0.5 rounded-xl px-1 py-1",
  "text-[8px] font-semibold",
  "transition-all duration-300",
  "focus:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-emerald-400/40",
  isActive
    ? "text-emerald-300"
    : "text-white/35 hover:bg-white/4 hover:text-white/70",
].join(" ")}
                >
                  {/* Active glow */}
                  {isActive && (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.7)]"
                      />

                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-1 rounded-2xl bg-emerald-300/4"
                      />
                    </>
                  )}

                  {/* Icon */}
<span
  className={[
    "relative flex h-8 w-8 items-center justify-center",
    "rounded-lg",
    "transition-all duration-300",
    isActive
      ? [
          "bg-emerald-300/10",
          "shadow-[0_0_14px_rgba(110,231,183,0.08)]",
        ].join(" ")
      : "bg-transparent group-hover:bg-white/4",
  ].join(" ")}
>
  <Icon
    size={18}
    strokeWidth={isActive ? 2.3 : 1.8}
    aria-hidden="true"
    className="transition-transform duration-300 group-hover:-translate-y-0.5"
  />
</span>

                  {/* Label */}
                  <span className="relative max-w-full truncate px-1">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}