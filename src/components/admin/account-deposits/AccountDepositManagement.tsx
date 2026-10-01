
'use client';

import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import {
  adminApi,
  type AdminAccountDeposit,
} from '@/src/lib/api/admin';

import AdminAccountDepositsTable from './AdminAccountDepositsTable';
import AccountDepositDetailsModal from './AccountDepositDetailsModal';

interface AccountDepositManagementProps {
  superAdmin?: boolean;
}

const PAGE_SIZE = 20;

export default function AccountDepositManagement({
  superAdmin = false,
}: AccountDepositManagementProps) {
  const [deposits, setDeposits] = useState<
    AdminAccountDeposit[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('ALL');
  const [assetFilter, setAssetFilter] =
    useState('ALL');
  const [networkFilter, setNetworkFilter] =
    useState('ALL');

  const [selectedDeposit, setSelectedDeposit] =
    useState<AdminAccountDeposit | null>(null);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  /*
   * Load account deposits whenever the page changes.
   *
   * There is intentionally only ONE effect for this.
   */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const response =
          await adminApi.listAccountDeposits(
            page,
            PAGE_SIZE,
          );

        if (cancelled) {
          return;
        }

        setDeposits(
          response.data.deposits,
        );

        setTotal(
          response.data.pagination.total,
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load account deposits:',
          err,
        );

        setError(
          'Failed to load account deposits. Please try again.',
        );
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

  /*
   * Manual refresh.
   */
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response =
        await adminApi.listAccountDeposits(
          page,
          PAGE_SIZE,
        );

      setDeposits(
        response.data.deposits,
      );

      setTotal(
        response.data.pagination.total,
      );
    } catch (err) {
      console.error(
        'Failed to refresh account deposits:',
        err,
      );

      setError(
        'Failed to load account deposits. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  const assets = useMemo(
    () =>
      Array.from(
        new Set(
          deposits
            .map(
              (deposit) =>
                deposit.asset_symbol,
            )
            .filter(Boolean),
        ),
      ),
    [deposits],
  );

  const networks = useMemo(
    () =>
      Array.from(
        new Set(
          deposits
            .map(
              (deposit) =>
                deposit.network_name,
            )
            .filter(Boolean),
        ),
      ),
    [deposits],
  );

  const filteredDeposits = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return deposits.filter((deposit) => {
      const userName =
        deposit.user_name?.toLowerCase() ?? '';

      const userEmail =
        deposit.user_email?.toLowerCase() ?? '';

      const depositId =
        deposit.id?.toLowerCase() ?? '';

      const transactionHash =
        deposit.tx_hash?.toLowerCase() ?? '';

      const normalizedStatus =
        deposit.status.trim().toUpperCase();

      const matchesSearch =
        !query ||
        userName.includes(query) ||
        userEmail.includes(query) ||
        depositId.includes(query) ||
        transactionHash.includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        normalizedStatus === statusFilter;

      const matchesAsset =
        assetFilter === 'ALL' ||
        deposit.asset_symbol === assetFilter;

      const matchesNetwork =
        networkFilter === 'ALL' ||
        deposit.network_name ===
          networkFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAsset &&
        matchesNetwork
      );
    });
  }, [
    deposits,
    search,
    statusFilter,
    assetFilter,
    networkFilter,
  ]);

  const handleReject = async (
    deposit: AdminAccountDeposit,
  ) => {
    const reason = window.prompt(
      'Enter the reason for rejecting this account deposit:',
    );

    if (reason === null) {
      return;
    }

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      window.alert(
        'A rejection reason is required.',
      );
      return;
    }

    setProcessingId(deposit.id);

    try {
      const response =
        await adminApi.rejectAccountDeposit(
          deposit.id,
          trimmedReason,
        );

      /*
       * Keep the rejected deposit open so the admin
       * can immediately see the updated status.
       */
      setSelectedDeposit(
        response.data,
      );

      await handleRefresh();
    } catch (err) {
      console.error(
        'Failed to reject account deposit:',
        err,
      );

      window.alert(
        'Failed to reject account deposit.',
      );
    } finally {
      setProcessingId(null);
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

        {/* Heading */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Finance
            </p>

            {superAdmin && (
              <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-purple-300">
                Super Admin
              </span>
            )}
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Account Deposit Management
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Review and manage deposits made
            directly to user account balances.
          </p>
        </div>
        {/* Search & filters */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0B1426] p-3 shadow-xl shadow-black/10 sm:rounded-2xl sm:p-4">
          <div className="flex flex-col gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search user, email, deposit ID or TX hash..."
                aria-label="Search account deposits"
                className="h-10 w-full rounded-lg border border-white/8 bg-[#07101F] pl-9 pr-9 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 sm:h-11 sm:text-sm"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <option value="ALL">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFYING">Verifying</option>
                <option value="PROCESSING">Processing</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
                <option value="FAILED">Failed</option>
                <option value="EXPIRED">Expired</option>
                <option value="UNMATCHED">Unmatched</option>
              </FilterSelect>

              <FilterSelect
                label="Asset"
                value={assetFilter}
                onChange={(value) => {
                  setAssetFilter(value);
                  setPage(1);
                }}
              >
                <option value="ALL">All assets</option>

                {assets.map((asset) => (
                  <option key={`asset-${asset}`} value={asset}>
                    {asset}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Network"
                value={networkFilter}
                onChange={(value) => {
                  setNetworkFilter(value);
                  setPage(1);
                }}
              >
                <option value="ALL">All networks</option>

                {networks.map((network) => (
                  <option key={`network-${network}`} value={network}>
                    {network}
                  </option>
                ))}
              </FilterSelect>

              {/* Filter summary */}
              <div className="flex min-h-10 items-center justify-between rounded-lg border border-white/6 bg-white/[0.02] px-2.5 sm:min-h-11 sm:px-3">
                <div className="flex min-w-0 items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-emerald-400/70" />

                  <span className="truncate text-[10px] font-medium text-slate-400 sm:text-xs">
                    {[
                      search.trim() ? 1 : 0,
                      statusFilter !== 'ALL' ? 1 : 0,
                      assetFilter !== 'ALL' ? 1 : 0,
                      networkFilter !== 'ALL' ? 1 : 0,
                    ].reduce((sum, value) => sum + value, 0)}{' '}
                    active
                  </span>
                </div>

                {(search ||
                  statusFilter !== 'ALL' ||
                  assetFilter !== 'ALL' ||
                  networkFilter !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('ALL');
                      setAssetFilter('ALL');
                      setNetworkFilter('ALL');
                      setPage(1);
                    }}
                    className="ml-2 shrink-0 text-[10px] font-semibold text-emerald-400 transition hover:text-emerald-300 sm:text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B1426] shadow-xl shadow-black/10">

          <div className="flex flex-col gap-3 border-b border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Account Deposits
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {total.toLocaleString()} total
                account deposits
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void handleRefresh();
              }}
              disabled={loading}
              className="rounded-lg border border-white/8 bg-white/2 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Loading...'
                : 'Refresh'}
            </button>
          </div>

          {error ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-red-400">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  void handleRefresh();
                }}
                className="mt-3 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <AdminAccountDepositsTable
              deposits={filteredDeposits}
              loading={loading}
              processingId={processingId}
              onView={setSelectedDeposit}
              onReject={handleReject}
            />
          )}

          {/* Pagination */}
          {!loading && !error && (
            <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-slate-500">
                Showing{' '}
                <strong className="text-slate-300">
                  {startItem}
                </strong>{' '}
                to{' '}
                <strong className="text-slate-300">
                  {endItem}
                </strong>{' '}
                of{' '}
                <strong className="text-slate-300">
                  {total}
                </strong>
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
                  className="rounded-lg border border-white/8 bg-white/2 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="px-2 text-xs text-slate-500">
                  Page {page} of {totalPages}
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
                  className="rounded-lg border border-white/8 bg-white/2 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AccountDepositDetailsModal
        deposit={selectedDeposit}
        onClose={() =>
          setSelectedDeposit(null)
        }
        onReject={handleReject}
        processing={
          selectedDeposit
            ? processingId ===
              selectedDeposit.id
            : false
        }
      />
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-10 w-full appearance-none rounded-lg border border-white/8 bg-[#07101F] px-2.5 pr-7 text-[10px] text-slate-300 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 sm:h-11 sm:px-3 sm:pr-8 sm:text-xs"
      >
        {children}
      </select>

      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
        ?
      </span>
    </label>
  );
}
