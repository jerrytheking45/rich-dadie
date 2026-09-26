'use client';

import {
  BriefcaseBusiness,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import type { UserRole } from '@/src/lib/api/admin';

interface UserStatusBadgeProps {
  role: UserRole;
}

const STYLES: Record<
  UserRole,
  {
    className: string;
    icon: React.ReactNode;
  }
> = {
  employee: {
    className:
      'border-slate-400/15 bg-slate-400/10 text-slate-300',
    icon: <BriefcaseBusiness className="h-3 w-3" />,
  },

  admin: {
    className:
      'border-blue-400/15 bg-blue-400/10 text-blue-300',
    icon: <ShieldCheck className="h-3 w-3" />,
  },

  superadmin: {
    className:
      'border-purple-400/15 bg-purple-400/10 text-purple-300',
    icon: <UserRound className="h-3 w-3" />,
  },
};

export default function UserStatusBadge({
  role,
}: UserStatusBadgeProps) {
  const config = STYLES[role];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${config.className}`}
    >
      {config.icon}
      {role}
    </span>
  );
}