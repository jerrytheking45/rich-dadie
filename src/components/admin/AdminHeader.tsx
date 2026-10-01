
'use client';

import { useAuth } from '@/src/components/AuthProvider';
import AdminNotificationBell from '@/src/components/admin/AdminNotificationBell';

interface AdminHeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export default function AdminHeader({
  title,
  onMenuClick,
}: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/8 bg-[#07101F]/90 px-4 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-emerald-400/30 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Open navigation"
        >
          <span className="text-lg leading-none">☰</span>
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] sm:block" />

            <h1 className="truncate text-lg font-bold tracking-tight text-white md:text-xl">
              {title}
            </h1>
          </div>

          <p className="mt-0.5 hidden text-xs text-white/40 sm:block">
            Manage your investment platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AdminNotificationBell />

        <div className="hidden h-8 w-px bg-white/10 sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-white">
              {user?.name ?? 'Admin'}
            </p>

            <p className="text-xs capitalize text-white/40">
              {user?.role ?? 'admin'}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-emerald-400/15 blur-md" />

            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/20 bg-linear-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-[#03120D] shadow-[0_0_20px_rgba(52,211,153,0.15)]">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#07101F] bg-emerald-400" />
          </div>
        </div>
      </div>
    </header>
  );
}