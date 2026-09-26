
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  XCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface DepositStatusBadgeProps {
  status: string;
}

interface StatusConfig {
  className: string;
  icon: ReactNode;
}

const STATUS_CONFIG: Record<
  string,
  StatusConfig
> = {
  PENDING: {
    className:
      'border-amber-400/15 bg-amber-400/10 text-amber-300',
    icon: (
      <Clock3 className="h-3 w-3" />
    ),
  },

  VERIFYING: {
    className:
      'border-blue-400/15 bg-blue-400/10 text-blue-300',
    icon: (
      <Loader2 className="h-3 w-3 animate-spin" />
    ),
  },

  PROCESSING: {
    className:
      'border-blue-400/15 bg-blue-400/10 text-blue-300',
    icon: (
      <Loader2 className="h-3 w-3 animate-spin" />
    ),
  },

  CONFIRMED: {
    className:
      'border-emerald-400/15 bg-emerald-400/10 text-emerald-300',
    icon: (
      <CheckCircle2 className="h-3 w-3" />
    ),
  },

  VERIFIED: {
    className:
      'border-emerald-400/15 bg-emerald-400/10 text-emerald-300',
    icon: (
      <CheckCircle2 className="h-3 w-3" />
    ),
  },

  FAILED: {
    className:
      'border-red-400/15 bg-red-400/10 text-red-300',
    icon: (
      <XCircle className="h-3 w-3" />
    ),
  },

  REJECTED: {
    className:
      'border-red-400/15 bg-red-400/10 text-red-300',
    icon: (
      <XCircle className="h-3 w-3" />
    ),
  },

  EXPIRED: {
    className:
      'border-slate-400/15 bg-slate-400/10 text-slate-400',
    icon: (
      <AlertCircle className="h-3 w-3" />
    ),
  },

  UNMATCHED: {
    className:
      'border-orange-400/15 bg-orange-400/10 text-orange-300',
    icon: (
      <AlertCircle className="h-3 w-3" />
    ),
  },
};

export default function DepositStatusBadge({
  status,
}: DepositStatusBadgeProps) {
  const normalized = status
    .trim()
    .toUpperCase();

  const config =
    STATUS_CONFIG[normalized] ?? {
      className:
        'border-slate-400/15 bg-slate-400/10 text-slate-400',
      icon: (
        <AlertCircle className="h-3 w-3" />
      ),
    };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${config.className}`}
    >
      {config.icon}
      {normalized || 'UNKNOWN'}
    </span>
  );
}