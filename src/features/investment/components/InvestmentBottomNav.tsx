
//src/features/investment/components/InvestmentBottomNav.tsx

import {
  Gift,
  Home,
  Package,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useTranslation } from "../i18n/translations";

interface NavItem {
  translationKey:
    | "nav.home"
    | "nav.investments"
    | "nav.promotions"
    | "nav.team"
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
    translationKey: "nav.team",
    path: "/investment/team",
    icon: UsersRound,
  },
  {
    translationKey: "nav.profile",
    path: "/investment/profile",
    icon: UserRound,
  },
];

const InvestmentBottomNav = () => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label="Investment navigation"
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-slate-200
        bg-white/95
        px-2
        pb-[env(safe-area-inset-bottom)]
        pt-2
        backdrop-blur-xl
      "
    >
      <div className="mx-auto flex w-full max-w-xl items-center justify-between">
        {navigation.map((item) => {
          const Icon = item.icon;
          const label = t(item.translationKey);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/investment"}
              aria-label={label}
              className={({ isActive }) =>
                `
                flex
                min-w-[64px]
                flex-col
                items-center
                gap-1
                rounded-2xl
                px-2
                py-2
                text-[10px]
                font-medium
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    aria-hidden="true"
                  />

                  <span>{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default InvestmentBottomNav;