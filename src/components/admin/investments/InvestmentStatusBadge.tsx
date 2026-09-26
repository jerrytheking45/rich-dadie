import {
  Ban,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import type { AdminInvestment } from '@/src/lib/api/admin';

const statusConfig: Record<
  AdminInvestment['status'],
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  PENDING: {
    label: 'Pending',
    className:
      'border-amber-400/15 bg-amber-400/10 text-amber-300',
    icon: Clock3,
  },

  ACTIVE: {
    label: 'Active',
    className:
      'border-emerald-400/15 bg-emerald-400/10 text-emerald-300',
    icon: TrendingUp,
  },

  MATURED: {
    label: 'Matured',
    className:
      'border-blue-400/15 bg-blue-400/10 text-blue-300',
    icon: CheckCircle2,
  },

  WITHDRAWN: {
    label: 'Withdrawn',
    className:
      'border-slate-400/10 bg-slate-400/10 text-slate-400',
    icon: CircleDollarSign,
  },

  CANCELLED: {
    label: 'Cancelled',
    className:
      'border-red-400/15 bg-red-400/10 text-red-300',
    icon: XCircle,
  },
};

export default function InvestmentStatusBadge({
  status,
}: {
  status: AdminInvestment['status'];
}) {
  const config = statusConfig[status];
  const Icon = config?.icon ?? Ban;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
        config?.className ??
        'border-slate-400/10 bg-slate-400/10 text-slate-400'
      }`}
    >
      <Icon className="h-3 w-3" />
      {config?.label ?? status}
    </span>
  );
}