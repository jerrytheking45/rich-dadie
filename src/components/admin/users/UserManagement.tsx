'use client';

import {
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { useAuth } from '@/src/components/AuthProvider';

import {
  adminApi,
  superadminApi,
  type User,
  type UserRole,
} from '@/src/lib/api/admin';

import UsersTable from './UsersTable';
import UserDetailsModal from './UserDetailsModal';
import CreateUserModal from './CreateUserModal';

interface UserManagementProps {
  superAdmin?: boolean;
}

const PAGE_SIZE = 20;

export default function UserManagement({
  superAdmin = false,
}: UserManagementProps) {
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] =
    useState<'all' | UserRole>('all');

  const [verificationFilter, setVerificationFilter] =
    useState<'all' | 'verified' | 'unverified'>('all');

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [updating, setUpdating] =
    useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  /*
   * API request only.
   *
   * This function does not update React state.
   * That makes it safe to call from effects.
   */
  const fetchUsers = useCallback(async () => {
    return adminApi.listUsers(
      page,
      PAGE_SIZE,
    );
  }, [page]);

  /*
   * Initial/page-change loading.
   *
   * The async work happens in a microtask instead of
   * synchronously calling a state-changing function from
   * the effect body.
   */
  useEffect(() => {
    let cancelled = false;

    const request = Promise.resolve().then(
      () => fetchUsers(),
    );

    void request
      .then((response) => {
        if (cancelled) {
          return;
        }

        setUsers(response.data.users);
        setTotal(response.data.pagination.total);
        setError('');
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }

        console.error(err);
        setError('Failed to load users.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchUsers]);

  /*
   * Manual refresh.
   *
   * Used after role changes, deletion, creation,
   * and the Refresh button.
   */
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchUsers();

      setUsers(response.data.users);
      setTotal(response.data.pagination.total);
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return users.filter((item) => {
      const name =
        item.name?.toLowerCase() ?? '';

      const email =
        item.email?.toLowerCase() ?? '';

      const employeeId =
        item.employee_id?.toLowerCase() ?? '';

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        employeeId.includes(normalizedSearch);

      const matchesRole =
        roleFilter === 'all' ||
        item.role === roleFilter;

      const matchesVerification =
        verificationFilter === 'all' ||
        (verificationFilter === 'verified' &&
          item.verified) ||
        (verificationFilter === 'unverified' &&
          !item.verified);

      return (
        matchesSearch &&
        matchesRole &&
        matchesVerification
      );
    });
  }, [
    users,
    search,
    roleFilter,
    verificationFilter,
  ]);

  const handleRoleChange = async (
    userId: string,
    role: UserRole,
  ) => {
    if (
      role === 'superadmin' &&
      user?.role !== 'superadmin'
    ) {
      window.alert(
        'Only superadmins can assign the superadmin role.',
      );
      return;
    }

    setUpdating(userId);

    try {
      await adminApi.updateUserRole(
        userId,
        role,
      );

      await loadUsers();
    } catch (err) {
      console.error(err);

      window.alert(
        'Failed to update user role.',
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (
    target: User,
  ) => {
    if (target.id === user?.id) {
      window.alert(
        'You cannot delete your own account.',
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete ${target.name}? Users with financial or other dependent records cannot be permanently deleted.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await superadminApi.deleteUser(
          target.id,
        );

      if (
        response.status === 409 &&
        response.data.code ===
          'USER_HAS_RECORDS'
      ) {
        window.alert(
          response.data.error ??
            'This user cannot be deleted because financial or other records exist.',
        );

        return;
      }

      if (
        users.length === 1 &&
        page > 1
      ) {
        setPage((current) =>
          Math.max(1, current - 1),
        );
      } else {
        await loadUsers();
      }
    } catch (err) {
      console.error(
        'Unexpected failure deleting user:',
        err,
      );

      window.alert(
        'Failed to delete user. Please try again.',
      );
    }
  };

  const handleCreate = async (data: {
    email: string;
    password: string;
    name: string;
    employee_id: string;
    role: UserRole;
  }) => {
    setCreating(true);

    try {
      await superadminApi.createUser(data);

      setCreateOpen(false);

      await loadUsers();
    } catch (err) {
      console.error(err);

      window.alert(
        'Failed to create user.',
      );
    } finally {
      setCreating(false);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE),
  );

  const startItem =
    total === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    page * PAGE_SIZE,
    total,
  );

  return (
    <>
      <div className="space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 text-purple-300">
                <Users className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-300">
                  Management
                </p>

                <h1 className="mt-0.5 text-2xl font-bold text-white">
                  User Management
                </h1>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Manage platform users, roles, verification,
              and account access.
            </p>
          </div>

          {superAdmin && (
            <button
              type="button"
              onClick={() =>
                setCreateOpen(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
            >
              <Plus className="h-4 w-4" />
              Create User
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Total Users"
            value={total.toLocaleString()}
            icon={
              <Users className="h-4 w-4" />
            }
          />

          <StatCard
            label="Verified"
            value={users
              .filter(
                (item) => item.verified,
              )
              .length.toLocaleString()}
            icon={
              <ShieldCheck className="h-4 w-4" />
            }
          />

          <StatCard
            label="Current Page"
            value={filteredUsers.length.toLocaleString()}
            icon={
              <Users className="h-4 w-4" />
            }
          />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-4 shadow-xl shadow-black/10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value,
                  );
                  setPage(1);
                }}
                placeholder="Search name, email or employee ID..."
                className="w-full rounded-xl border border-white/8 bg-[#070F1E] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/10"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(
                  event.target.value as
                    | 'all'
                    | UserRole,
                );
                setPage(1);
              }}
              className="rounded-xl border border-white/8 bg-[#070F1E] px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-purple-400/40"
            >
              <option value="all">
                All roles
              </option>

              <option value="employee">
                Employees
              </option>

              <option value="admin">
                Administrators
              </option>

              {superAdmin && (
                <option value="superadmin">
                  Superadmins
                </option>
              )}
            </select>

            <select
              value={verificationFilter}
              onChange={(event) => {
                setVerificationFilter(
                  event.target.value as
                    | 'all'
                    | 'verified'
                    | 'unverified',
                );
                setPage(1);
              }}
              className="rounded-xl border border-white/8 bg-[#070F1E] px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-purple-400/40"
            >
              <option value="all">
                All account statuses
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="unverified">
                Unverified
              </option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
          <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Platform Users
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {total.toLocaleString()} total users
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadUsers()
              }
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/7 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loading
                    ? 'animate-spin'
                    : ''
                }`}
              />

              {loading
                ? 'Refreshing...'
                : 'Refresh'}
            </button>
          </div>

          {error ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-red-400/15 bg-red-400/10 text-red-300">
                !
              </div>

              <p className="mt-4 text-sm font-medium text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadUsers()
                }
                disabled={loading}
                className="mt-3 text-sm font-medium text-purple-300 transition hover:text-purple-200 hover:underline disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          ) : (
            <UsersTable
              users={filteredUsers}
              currentUserId={user?.id}
              loading={loading}
              updating={updating}
              isSuperAdmin={superAdmin}
              onView={setSelectedUser}
              onRoleChange={
                handleRoleChange
              }
              onDelete={
                superAdmin
                  ? handleDelete
                  : undefined
              }
            />
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-3 border-t border-white/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-300">
                  {startItem}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-300">
                  {endItem}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-300">
                  {total}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(
                        1,
                        current - 1,
                      ),
                    )
                  }
                  className="rounded-lg border border-white/8 bg-white/3 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="px-2 text-xs text-slate-500">
                  Page {page} of{' '}
                  {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1,
                      ),
                    )
                  }
                  className="rounded-lg border border-white/8 bg-white/3 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserDetailsModal
        user={selectedUser}
        onClose={() =>
          setSelectedUser(null)
        }
      />

      {superAdmin && (
        <CreateUserModal
          open={createOpen}
          onClose={() =>
            setCreateOpen(false)
          }
          onCreate={handleCreate}
          creating={creating}
        />
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 text-purple-300">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}