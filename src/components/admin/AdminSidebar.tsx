'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Home,
  ArrowDownLeft,
  SquareArrowRightEnter,
  LogOut,
  MessageCircle,
  Settings,
  TrendingUp,
  Users,
  Wallet,
  Ad,
  Kanban,
} from 'lucide-react';

import { useAuth } from '@/src/components/AuthProvider';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isSuperAdmin = user?.role === 'superadmin';

  const basePath = isSuperAdmin ? '/superadmin' : '/admin';

  const navigation = [
    {
      label: 'Dashboard',
      href: basePath,
      icon: BarChart3,
    },
    {
      label: 'Users',
      href: `${basePath}/users`,
      icon: Users,
    },
    {
      label: 'Account Deposits',
      href: `${basePath}/account-deposits`,
      icon: SquareArrowRightEnter,
    },
    {
      label: 'Investments Deposits',
      href: `${basePath}/deposits`,
      icon: TrendingUp,
    },
    {
      label: 'Withdrawals',
      href: `${basePath}/withdrawals`,
      icon: ArrowDownLeft,
    },
    {
      label: 'Support',
      href: `${basePath}/support`,
      icon: MessageCircle,
    },
    {
      label: 'Investments',
      href: `${basePath}/investments`,
      icon: TrendingUp,
    },
    {
      label: 'Home',
      href: '/investment',
      icon: Home,
    },
    {
      label: 'Wallet',
      href: `${basePath}/central-wallet`,
      icon: Wallet,
    },
    {
      label: 'Plans',
      href: `${basePath}/plans`,
      icon: Kanban,
    },
    {
      label: 'Promotion',
      href: `${basePath}/promotions`,
      icon: Ad,
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col',
          'border-r border-white/8 bg-[#060C18]',
          'shadow-[20px_0_60px_rgba(0,0,0,0.25)]',
          'transition-transform duration-200',
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="relative flex h-20 items-center border-b border-white/8 px-5">
          <div className="absolute left-6 top-0 h-px w-24 bg-linear-to-r from-emerald-400/70 to-transparent" />

          <Link
            href={basePath}
            className="group flex items-center gap-3"
            onClick={onClose}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-emerald-400/15 blur-md transition group-hover:bg-emerald-400/25" />

              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-linear-to-br from-emerald-400 to-emerald-600 text-sm font-black text-[#03120D] shadow-[0_0_22px_rgba(52,211,153,0.15)]">
                RD
              </div>
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-white">
                REDIQ
              </p>

              <p className="mt-0.5 text-[11px] text-white/35">
                Investment Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
            Management
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={[
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5',
                    'text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-emerald-400/10 text-emerald-300 shadow-[inset_0_0_25px_rgba(52,211,153,0.035)]'
                      : 'text-white/45 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  )}

                  <span
                    className={[
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition',
                      active
                        ? 'border border-emerald-400/15 bg-emerald-400/10 text-emerald-300'
                        : 'border border-white/6 bg-white/[0.035] text-white/35 group-hover:bg-white/8 group-hover:text-white/70',
                    ].join(' ')}
                  >
                    <Icon size={16} strokeWidth={2} />
                  </span>

                  <span className="truncate">{item.label}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
            System
          </p>

          <nav className="space-y-1">
            <Link
              href={
                isSuperAdmin
                  ? '/superadmin/platform-settings'
                  : '#'
              }
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/45 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/6 bg-white/[0.035] text-white/35 transition group-hover:bg-white/8 group-hover:text-white/70">
                <Settings size={16} />
              </span>

              Settings
            </Link>
          </nav>
        </div>

        {/* User */}
        <div className="border-t border-white/8 p-1">
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.035] p-1">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/10 font-semibold text-emerald-300">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              </div>

              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#060C18] bg-emerald-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white/85">
                {user?.name ?? 'Administrator'}
              </p>

              <p className="truncate text-xs capitalize text-white/35">
                {user?.role ?? 'admin'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/80 transition hover:bg-red-500/8 hover:text-red-300"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
