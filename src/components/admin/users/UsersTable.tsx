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
      <div className="space-y-3 p-6">
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
      <div className="p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-slate-500">
          <UserRound className="h-5 w-5" />
        </div>

        <h3 className="mt-4 font-semibold text-white">
          No users found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-250 w-full">
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
                <td className="px-5 py-4">
                  <div className="flex min-w-55 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 font-semibold text-purple-300">
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

                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-400">
                  {item.employee_id}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
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

                <td className="whitespace-nowrap px-5 py-4">
                  <VerificationBadge
                    verified={item.verified}
                  />
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                  {new Date(
                    item.created_at,
                  ).toLocaleDateString()}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/8 hover:text-white"
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
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/5 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}

                    {isCurrentUser && (
                      <span className="px-3 py-1.5 text-xs font-medium text-slate-600">
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
      className={`px-5 py-3 ${alignmentClass} text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500`}
    >
      {children}
    </th>
  );
}