'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import {
  ArrowRight,
  Users,
  WalletCards,
} from 'lucide-react';

import {
  adminApi,
  type AdminDeposit,
  type User,
} from '@/src/lib/api/admin';

import AdminSupportFloatingButton from '@/src/components/support/admin/AdminSupportFloatingButton';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardOverview from '@/src/components/admin/DashboardOverview';

import AdminDepositsTable from './AdminDepositsTable';
import DepositDetailsModal from './DepositDetailsModal';

interface AdminDashboardProps {
  title?: string;
  children?: ReactNode;
}

export default function AdminDashboard({
  title = 'Dashboard',
  children,
}: AdminDashboardProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<AdminDeposit[]>([]);

  const [usersLoading, setUsersLoading] = useState(true);
  const [depositsLoading, setDepositsLoading] = useState(true);

  const [usersError, setUsersError] = useState('');
  const [depositsError, setDepositsError] = useState('');

  const [selectedDeposit, setSelectedDeposit] =
    useState<AdminDeposit | null>(null);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      setUsersLoading(true);
      setDepositsLoading(true);

      const [usersResult, depositsResult] =
        await Promise.allSettled([
          adminApi.listUsers(),
          adminApi.listDeposits(),
        ]);

      if (cancelled) {
        return;
      }

      if (usersResult.status === 'fulfilled') {
        setUsers(usersResult.value.data.users);
        setUsersError('');
      } else {
        console.error(usersResult.reason);
        setUsersError('Failed to load users');
      }

      setUsersLoading(false);

      if (depositsResult.status === 'fulfilled') {
        setDeposits(depositsResult.value.data.deposits);
        setDepositsError('');
      } else {
        console.error(depositsResult.reason);
        setDepositsError('Failed to load deposits');
      }

      setDepositsLoading(false);
    };

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadDeposits = async () => {
    try {
      setDepositsLoading(true);

      const response = await adminApi.listDeposits();

      setDeposits(response.data.deposits);
      setDepositsError('');
    } catch (error) {
      console.error(error);
      setDepositsError('Failed to load deposits');
    } finally {
      setDepositsLoading(false);
    }
  };

  const handleVerify = async (deposit: AdminDeposit) => {
    if (!window.confirm(`Verify deposit ${deposit.id}?`)) {
      return;
    }

    setProcessingId(deposit.id);

    try {
      await adminApi.verifyDeposit(deposit.id);

      setSelectedDeposit(null);

      await loadDeposits();
    } catch (error) {
      console.error(error);
      window.alert('Failed to verify deposit');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (deposit: AdminDeposit) => {
    if (
      !window.confirm(
        `Reject deposit ${deposit.id}?`,
      )
    ) {
      return;
    }

    const reasonInput = window.prompt(
      `Enter the reason for rejecting deposit ${deposit.id}:`,
    );

    // User cancelled the prompt.
    if (reasonInput === null) {
      return;
    }

    const reason = reasonInput.trim();

    if (!reason) {
      window.alert(
        'A rejection reason is required.',
      );
      return;
    }

    setProcessingId(deposit.id);

    try {
      await adminApi.rejectDeposit(
        deposit.id,
        reason,
      );

      setSelectedDeposit(null);

      await loadDeposits();
    } catch (error) {
      console.error(error);
      window.alert('Failed to reject deposit');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminHeader
          title={title}
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="relative min-h-[calc(100vh-64px)] overflow-hidden p-4 md:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-purple-600/6 blur-3xl" />

            <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
          </div>

          <div className="relative">
            {children ?? (
              <>
                <DashboardOverview />

                <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-3">
                  <section className="overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-[0_20px_60px_rgba(0,0,0,0.2)] xl:col-span-2">
                    <div className="border-b border-white/7 bg-linear-to-r from-white/2.5 to-transparent px-5 py-5 md:px-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
                            <WalletCards className="h-4.5 w-4.5" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-white">
                              Recent Deposits
                            </h3>

                            <p className="mt-1 text-xs text-white/35">
                              Review recent investment deposits.
                            </p>
                          </div>
                        </div>

                        <a
                          href="/admin/deposits"
                          className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs font-semibold text-white/55 transition hover:border-emerald-400/15 hover:bg-emerald-400/6 hover:text-emerald-300"
                        >
                          View all
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>

                    {depositsError ? (
                      <div className="m-5 rounded-2xl border border-red-400/10 bg-red-400/6 p-6 text-center text-sm text-red-300">
                        {depositsError}
                      </div>
                    ) : (
                      <AdminDepositsTable
                        deposits={deposits.slice(0, 8)}
                        loading={depositsLoading}
                        processingId={processingId}
                        onView={setSelectedDeposit}
                        onVerify={handleVerify}
                        onReject={handleReject}
                      />
                    )}
                  </section>

                  <section className="overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                    <div className="border-b border-white/7 bg-linear-to-r from-white/2.5 to-transparent px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/8 text-purple-300">
                          <Users className="h-4.5 w-4.5" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-white">
                            User Management
                          </h3>

                          <p className="mt-1 text-xs text-white/35">
                            Recently registered platform users.
                          </p>
                        </div>
                      </div>
                    </div>

                    {usersError ? (
                      <div className="m-5 rounded-2xl border border-red-400/10 bg-red-400/6 p-6 text-center text-sm text-red-300">
                        {usersError}
                      </div>
                    ) : usersLoading ? (
                      <div className="space-y-3 p-5">
                        {Array.from({
                          length: 5,
                        }).map((_, index) => (
                          <div
                            key={index}
                            className="flex animate-pulse items-center gap-3 rounded-2xl border border-white/5 bg-white/2.5 p-3"
                          >
                            <div className="h-9 w-9 rounded-full bg-white/6" />

                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-28 rounded bg-white/6" />
                              <div className="h-2.5 w-40 rounded bg-white/4" />
                            </div>

                            <div className="h-5 w-14 rounded-full bg-white/5" />
                          </div>
                        ))}
                      </div>
                    ) : users.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-white/25">
                          <Users className="h-5 w-5" />
                        </div>

                        <p className="mt-3 text-sm font-medium text-white/60">
                          No users found
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          Newly registered users will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {users.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/2.5"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-sm font-semibold text-emerald-300">
                              {item.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-white/80">
                                {item.name}
                              </p>

                              <p className="truncate text-xs text-white/30">
                                {item.email}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full border border-white/8 bg-white/[0.035] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white/40">
                              {item.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-white/7 p-4">
                      <a
                        href="/admin/users"
                        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:border-emerald-400/15 hover:bg-emerald-400/6 hover:text-emerald-300"
                      >
                        Manage users

                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </section>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <DepositDetailsModal
        deposit={selectedDeposit}
        onClose={() =>
          setSelectedDeposit(null)
        }
        onVerify={handleVerify}
        onReject={handleReject}
        processing={
          selectedDeposit
            ? processingId === selectedDeposit.id
            : false
        }
      />

      <AdminSupportFloatingButton />
    </div>
  );
}