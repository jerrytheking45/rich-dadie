'use client';

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Loader2,
  RefreshCw,
  Search,
  WalletCards,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  adminApi,
  type AdminInvestment,
} from '@/src/lib/api/admin';

import AdminInvestmentsTable from './AdminInvestmentsTable';
import InvestmentDetailsModal from './InvestmentDetailsModal';

interface InvestmentManagementProps {
  superAdmin?: boolean;
}

const PAGE_SIZE = 20;

type InvestmentStatus =
  | 'ALL'
  | 'ACTIVE'
  | 'MATURED'
  | 'PENDING'
  | 'WITHDRAWN'
  | 'CANCELLED';

const STATUS_OPTIONS: Array<{
  value: InvestmentStatus;
  label: string;
}> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'MATURED', label: 'Matured' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as {
      response?: {
        data?: {
          message?: unknown;
          error?: unknown;
        };
      };
    }).response;

    const message =
      response?.data?.message ?? response?.data?.error;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return 'Failed to load investments. Please try again.';
}

export default function InvestmentManagement({
  superAdmin = false,
}: InvestmentManagementProps) {
  const [investments, setInvestments] = useState<AdminInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<InvestmentStatus>('ALL');
  const [selectedInvestment, setSelectedInvestment] =
    useState<AdminInvestment | null>(null);

  const loadInvestments = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError('');

        const response = await adminApi.listInvestments(
          page,
          PAGE_SIZE,
        );

        setInvestments(response.data.investments ?? []);
        setTotal(response.data.pagination?.total ?? 0);
      } catch (err: unknown) {
        console.error('Failed to load investments:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await adminApi.listInvestments(
          page,
          PAGE_SIZE,
        );

        if (cancelled) return;

        setInvestments(response.data.investments ?? []);
        setTotal(response.data.pagination?.total ?? 0);
      } catch (err: unknown) {
        if (cancelled) return;

        console.error('Failed to load investments:', err);
        setError(getErrorMessage(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const filteredInvestments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return investments.filter((investment) => {
      const matchesSearch =
        !query ||
        investment.user_name.toLowerCase().includes(query) ||
        investment.user_email.toLowerCase().includes(query) ||
        investment.id.toLowerCase().includes(query) ||
        investment.plan_name.toLowerCase().includes(query) ||
        investment.asset_symbol.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        investment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [investments, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE),
  );

  const pagePendingCount = useMemo(
    () =>
      investments.filter(
        (investment) => investment.status === 'PENDING',
      ).length,
    [investments],
  );

  const pageActiveCount = useMemo(
    () =>
      investments.filter(
        (investment) => investment.status === 'ACTIVE',
      ).length,
    [investments],
  );

  const pageMaturedCount = useMemo(
    () =>
      investments.filter(
        (investment) => investment.status === 'MATURED',
      ).length,
    [investments],
  );

  const handleStatusChange = (value: InvestmentStatus) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-300">
              Finance
            </p>

            {superAdmin && (
              <span className="rounded-full border border-purple-400/15 bg-purple-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-purple-300">
                Super Admin
              </span>
            )}
          </div>

          <h1 className="mt-1.5 text-xl font-bold tracking-tight text-white sm:mt-2 sm:text-2xl">
            Investment Management
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:mt-1.5 sm:text-sm">
            Monitor and manage user investments across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadInvestments(true)}
          disabled={loading || refreshing}
          className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit sm:rounded-xl sm:px-4 sm:py-2.5"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />

          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        <SummaryCard
          icon={WalletCards}
          label="Total Investments"
          value={total.toLocaleString()}
          description="Across all pages"
          tone="purple"
        />

        <SummaryCard
          icon={Loader2}
          label="Pending"
          value={pagePendingCount.toLocaleString()}
          description="On current page"
          tone="amber"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Active"
          value={pageActiveCount.toLocaleString()}
          description="On current page"
          tone="emerald"
        />

        <SummaryCard
          icon={CircleDollarSign}
          label="Matured"
          value={pageMaturedCount.toLocaleString()}
          description="On current page"
          tone="blue"
        />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/8 bg-[#07111F] p-3 shadow-xl shadow-black/5 sm:rounded-2xl sm:p-4">
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search user, email, plan, asset, or ID..."
              className="w-full rounded-lg border border-white/8 bg-[#050B18] py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-purple-400/30 focus:bg-[#07111F] focus:ring-2 focus:ring-purple-400/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              handleStatusChange(
                event.target.value as InvestmentStatus,
              )
            }
            className="rounded-lg border border-white/8 bg-[#050B18] px-3 py-2.5 text-sm text-slate-300 outline-none transition focus:border-purple-400/30 focus:ring-2 focus:ring-purple-400/10"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#07111F] text-slate-200"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/15 bg-red-500/6 p-3 sm:gap-3 sm:rounded-2xl sm:p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            <XCircle className="h-4 w-4 text-red-400" />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-300">
              Unable to load investments
            </p>

            <p className="mt-1 text-xs leading-5 text-red-400/80">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-white/8 bg-[#07111F] shadow-xl shadow-black/5 sm:rounded-2xl">
        <div className="flex flex-col gap-2.5 border-b border-white/8 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-4">
          <div>
            <h2 className="font-semibold text-white">
              Investments
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {total.toLocaleString()} total investments
            </p>
          </div>

          {(search.trim() || statusFilter !== 'ALL') && (
            <div className="rounded-full border border-purple-400/10 bg-purple-400/6 px-3 py-1.5 text-[10px] font-semibold text-purple-300">
              {filteredInvestments.length.toLocaleString()} on this page
            </div>
          )}
        </div>

        {error ? (
          <div className="flex min-h-60 items-center justify-center p-8 text-center">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Something went wrong
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Try refreshing the investment list.
              </p>
            </div>
          </div>
        ) : (
          <AdminInvestmentsTable
            investments={filteredInvestments}
            loading={loading}
            onView={setSelectedInvestment}
          />
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="flex flex-col gap-2.5 border-t border-white/8 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-4">
            <p className="text-xs text-slate-500">
              Page{' '}
              <span className="font-semibold text-slate-300">
                {page}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-300">
                {totalPages}
              </span>
            </p>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1),
                  )
                }
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/2.5 px-2.5 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:rounded-xl sm:px-3"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1),
                  )
                }
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/2.5 px-2.5 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:rounded-xl sm:px-3"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details modal */}
      <InvestmentDetailsModal
        investment={selectedInvestment}
        onClose={() => setSelectedInvestment(null)}
      />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: typeof WalletCards;
  label: string;
  value: string;
  description: string;
  tone: 'purple' | 'amber' | 'emerald' | 'blue';
}) {
  const toneStyles = {
    purple: {
      icon: 'bg-purple-400/10 text-purple-300',
      border: 'border-purple-400/10',
    },
    amber: {
      icon: 'bg-amber-400/10 text-amber-300',
      border: 'border-amber-400/10',
    },
    emerald: {
      icon: 'bg-emerald-400/10 text-emerald-300',
      border: 'border-emerald-400/10',
    },
    blue: {
      icon: 'bg-blue-400/10 text-blue-300',
      border: 'border-blue-400/10',
    },
  }[tone];

  return (
    <div
      className={`rounded-xl border bg-[#07111F] p-3 shadow-xl shadow-black/5 sm:rounded-2xl sm:p-4 ${toneStyles.border}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneStyles.icon} sm:h-9 sm:w-9 sm:rounded-xl`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Finance
        </span>
      </div>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:mt-4 sm:text-[10px]">
        {label}
      </p>

      <p className="mt-0.5 text-lg font-bold text-white sm:mt-1 sm:text-xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        {description}
      </p>
    </div>
  );
}
