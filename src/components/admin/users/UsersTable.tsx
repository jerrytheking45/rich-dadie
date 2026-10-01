'use client';

import {
  Eye,
  Loader2,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';

import type {
  User,
  UserRole,
} from '@/src/lib/api/admin';

import VerificationBadge from './VerificationBadge';

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  loading?: boolean;
  updating?: string | null;
  isSuperAdmin?: boolean;
  onView: (user: User) => void;
  onRoleChange: (
    userId: string,
    role: UserRole,
  ) => void;
  onDelete?: (user: User) => void;
}

export default function UsersTable({
  users,
  currentUserId,
  loading = false,
  updating,
  isSuperAdmin = false,
  onView,
  onRoleChange,
  onDelete,
}: UsersTableProps) {
  if (loading) {
    return (
      <div className="space-y-2.5 p-4 sm:p-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-14 animate-pulse rounded-xl bg-white/4"
          />
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="p-8 text-center sm:p-12">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-slate-500">
          <UserRound className="h-5 w-5" />
        </div>

        <h3 className="mt-3 font-semibold text-white">
          No users found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="space-y-2.5 p-3 md:hidden sm:p-4">
        {users.map((item) => {
          const isCurrentUser =
            item.id === currentUserId;

          const initial =
            item.name?.trim().charAt(0).toUpperCase() ||
            'U';

          return (
            <div
              key={item.id}
              className="rounded-xl border border-white/8 bg-white/2 p-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 font-semibold text-purple-300">
                  {initial}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {item.email}
                      </p>
                    </div>

                    <VerificationBadge
                      verified={item.verified}
                    />
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <MobileField
                      label="Employee ID"
                      value={item.employee_id || '-'}
                    />

                    <MobileField
                      label="Created"
                      value={new Date(
                        item.created_at,
                      ).toLocaleDateString()}
                    />
                  </div>

                  <div className="mt-2">
                    <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                      Role
                    </label>

                    <div className="flex items-center gap-2">
                      <select
                        value={item.role}
                        disabled={
                          updating === item.id ||
                          isCurrentUser
                        }
                        onChange={(event) =>
                          onRoleChange(
                            item.id,
                            event.target.value as UserRole,
                          )
                        }
                        className="min-w-0 flex-1 rounded-lg border border-white/8 bg-[#070F1E] px-2.5 py-2 text-xs font-medium text-slate-200 outline-none transition focus:border-purple-400/40 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <option value="employee">
                          Employee
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                        {isSuperAdmin && (
                          <option value="superadmin">
                            Superadmin
                          </option>
                        )}
                      </select>

                      {updating === item.id && (
                        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-purple-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onView(item)}
                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/8 hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View User
                </button>

                {onDelete && !isCurrentUser ? (
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/5 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                ) : isCurrentUser ? (
                  <span className="inline-flex min-h-9 items-center justify-center rounded-lg border border-white/6 bg-white/2 px-3 py-2 text-xs font-medium text-slate-600">
                    You
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet / Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <Th>User</Th>
              <Th>Employee ID</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {users.map((item) => {
              const isCurrentUser =
                item.id === currentUserId;

              const initial =
                item.name?.trim().charAt(0).toUpperCase() ||
                'U';

              return (
                <tr
                  key={item.id}
                  className="transition hover:bg-white/2"
                >
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 font-semibold text-purple-300">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {item.name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-400">
                    {item.employee_id}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={item.role}
                        disabled={
                          updating === item.id ||
                          isCurrentUser
                        }
                        onChange={(event) =>
                          onRoleChange(
                            item.id,
                            event.target.value as UserRole,
                          )
                        }
                        className="rounded-lg border border-white/8 bg-[#070F1E] px-2.5 py-1.5 text-xs font-medium text-slate-200 outline-none transition focus:border-purple-400/40 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <option value="employee">
                          Employee
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                        {isSuperAdmin && (
                          <option value="superadmin">
                            Superadmin
                          </option>
                        )}
                      </select>

                      {updating === item.id && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-300" />
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <VerificationBadge
                      verified={item.verified}
                    />
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                    {new Date(
                      item.created_at,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/8 hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>

                      {onDelete &&
                        !isCurrentUser && (
                          <button
                            type="button"
                            onClick={() =>
                              onDelete(item)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/5 px-2.5 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        )}

                      {isCurrentUser && (
                        <span className="px-2.5 py-1.5 text-xs font-medium text-slate-600">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MobileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/6 bg-white/2 px-2.5 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[11px] font-medium text-slate-300">
        {value}
      </p>
    </div>
  );
}

function Th({
  children,
  align = 'left',
}: {
  children: ReactNode;
  align?: 'left' | 'right';
}) {
  const alignmentClass =
    align === 'right'
      ? 'text-right'
      : 'text-left';

  return (
    <th
      className={`px-4 py-3 ${alignmentClass} text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500`}
    >
      {children}
    </th>
  );
}
