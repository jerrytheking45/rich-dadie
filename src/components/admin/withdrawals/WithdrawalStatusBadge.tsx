"use client";

import {
  Ban,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RadioTower,
  RotateCcw,
  XCircle,
} from "lucide-react";

import type {
  AdminWithdrawalStatus,
} from "@/src/lib/api/admin";

interface WithdrawalStatusBadgeProps {
  status: AdminWithdrawalStatus;
}

interface StatusConfig {
  label: string;
  icon: typeof Clock3;
  className: string;
}

const statusStyles: Record<
  AdminWithdrawalStatus,
  StatusConfig
> = {
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className:
      "border-amber-400/15 bg-amber-400/10 text-amber-300",
  },

  PROCESSING: {
    label: "Processing",
    icon: LoaderCircle,
    className:
      "border-purple-400/15 bg-purple-400/10 text-purple-300",
  },

  BROADCAST: {
    label: "Broadcast",
    icon: RadioTower,
    className:
      "border-blue-400/15 bg-blue-400/10 text-blue-300",
  },

  CONFIRMING: {
    label: "Confirming",
    icon: RotateCcw,
    className:
      "border-cyan-400/15 bg-cyan-400/10 text-cyan-300",
  },

  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
  },

  FAILED: {
    label: "Failed",
    icon: XCircle,
    className:
      "border-red-400/15 bg-red-400/10 text-red-300",
  },

  CANCELLED: {
    label: "Cancelled",
    icon: Ban,
    className:
      "border-slate-400/15 bg-slate-400/10 text-slate-300",
  },
};

export default function WithdrawalStatusBadge({
  status,
}: WithdrawalStatusBadgeProps) {
  const config = statusStyles[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </span>
  );
}