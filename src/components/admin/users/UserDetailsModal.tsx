'use client';

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Copy,
  Fingerprint,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import { useState } from 'react';

import type { User } from '@/src/lib/api/admin';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  onClose,
}: UserDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const initial = user.name?.trim().charAt(0).toUpperCase() || 'U';

  const copyAccountId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy account ID:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/40"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10 text-purple-300">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-300">
                User profile
              </p>

              <h2
                id="user-details-title"
                className="mt-1 text-xl font-bold text-white"
              >
                User Details
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close user details"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-400 transition hover:bg-white/8 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile hero */}
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-purple-500/10 via-white/3 to-emerald-500/5 p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 text-xl font-bold text-purple-300">
                {initial}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-white">
                  {user.name}
                </h3>

                <p className="mt-0.5 truncate text-sm text-slate-400">
                  {user.email}
                </p>

                <div className="mt-2">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />

              <h3 className="text-sm font-semibold text-white">
                Account Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail
                label="Full Name"
                value={user.name}
                icon={<UserRound className="h-3.5 w-3.5" />}
              />

              <Detail
                label="Employee ID"
                value={user.employee_id}
                icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
              />

              <Detail
                label="Email"
                value={user.email}
                icon={<Mail className="h-3.5 w-3.5" />}
              />

              <Detail
                label="Verification"
                value={user.verified ? 'Verified' : 'Unverified'}
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                valueClass={
                  user.verified
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }
              />

              <div className="sm:col-span-2">
                <div className="rounded-xl border border-white/8 bg-white/2 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-3.5 w-3.5 text-slate-500" />

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Account ID
                        </p>
                      </div>

                      <p className="mt-1 break-all font-mono text-xs text-slate-300">
                        {user.id}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={copyAccountId}
                      className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-2.5 text-[11px] font-medium text-slate-400 transition hover:bg-white/8 hover:text-white"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Detail
                label="Created"
                value={new Date(
                  user.created_at,
                ).toLocaleString()}
                icon={<CalendarDays className="h-3.5 w-3.5" />}
              />

              <Detail
                label="Last Updated"
                value={new Date(
                  user.updated_at,
                ).toLocaleString()}
                icon={<CalendarDays className="h-3.5 w-3.5" />}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/8 bg-white/2 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/4 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: User['role'] }) {
  const styles: Record<User['role'], string> = {
    employee:
      'border-slate-400/15 bg-slate-400/10 text-slate-300',
    admin:
      'border-blue-400/15 bg-blue-400/10 text-blue-300',
    superadmin:
      'border-purple-400/15 bg-purple-400/10 text-purple-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles[role]}`}
    >
      {role}
    </span>
  );
}

interface DetailProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClass?: string;
}

function Detail({
  label,
  value,
  icon,
  valueClass = 'text-slate-200',
}: DetailProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/2 p-4">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-slate-500">{icon}</span>
        )}

        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>

      <p className={`mt-1.5 break-all text-sm font-medium ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}