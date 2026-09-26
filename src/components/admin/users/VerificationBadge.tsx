'use client';

import {
  CheckCircle2,
  Clock3,
} from 'lucide-react';

interface VerificationBadgeProps {
  verified: boolean;
}

export default function VerificationBadge({
  verified,
}: VerificationBadgeProps) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/15 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
      <Clock3 className="h-3 w-3" />
      Unverified
    </span>
  );
}