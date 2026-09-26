
'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

        {/* Filters */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0B1426] p-4 shadow-xl shadow-black/10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

            {/* Search */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                ⌕
              </span>

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search user, ID or TX hash..."
                className="w-full rounded-xl border border-white/8 bg-[#07101F] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value,
                );
                setPage(1);
              }}
              className="rounded-xl border border-white/8 bg-[#07101F] px-3 py-2.5 text-sm text-slate-300 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            >
              <option value="ALL">
                All statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="VERIFYING">
                Verifying
              </option>

              <option value="PROCESSING">
                Processing
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="VERIFIED">
                Verified
              </option>

              <option value="REJECTED">
                Rejected
              </option>

              <option value="FAILED">
                Failed
              </option>

              <option value="EXPIRED">
                Expired
              </option>

              <option value="UNMATCHED">
                Unmatched
              </option>
            </select>

            {/* Asset */}
            <select
              value={assetFilter}
              onChange={(event) => {
                setAssetFilter(
                  event.target.value,
                );
                setPage(1);
              }}
              className="rounded-xl border border-white/8 bg-[#07101F] px-3 py-2.5 text-sm text-slate-300 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            >
              <option value="ALL">
                All assets
              </option>

              {assets.map((asset) => (
                <option
                  key={`asset-${asset}`}
                  value={asset}
                >
                  {asset}
                </option>
              ))}
            </select>

            {/* Network */}
            <select
              value={networkFilter}
              onChange={(event) => {
                setNetworkFilter(
                  event.target.value,
                );
                setPage(1);
              }}
              className="rounded-xl border border-white/8 bg-[#07101F] px-3 py-2.5 text-sm text-slate-300 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            >
              <option value="ALL">
                All networks
              </option>

              {networks.map((network) => (
                <option
                  key={`network-${network}`}
                  value={network}
                >
                  {network}
                </option>
              ))}
            </select>
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