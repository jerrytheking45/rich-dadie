
// src/features/admin/components/DashboardOverview.tsx

// src/features/admin/components/DashboardOverview.tsx

'use client';

import { RefreshCw } from 'lucide-react';

import UserStatsCard from './adminStats/UserStatsCard';
import InvestmentStatsCard from './adminStats/InvestmentStatsCard';
import DepositStatsCard from './adminStats/DepositStatsCard';
import WithdrawalStatsCard from './adminStats/WithdrawalStatsCard';
import SupportStatsCard from './adminStats/SupportStatsCard';
import LedgerStatsCard from './adminStats/LedgerStatsCard';
import CentralWalletCard from './adminStats/CentralWalletCard';

import { useAdminDashboard } from '../../hooks/useAdminDashboard';

export default function DashboardOverview() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useAdminDashboard();

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:p-6">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-emerald-400/5 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Overview
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Platform Dashboard
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
              Monitor users, investments, deposits, withdrawals,
              support, ledger activity, and the central wallet.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 shadow-lg transition hover:border-emerald-400/20 hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />

            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/15 bg-red-500/8 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UserStatsCard
          stats={
            data?.users ?? {
              total: 0,
              verified: 0,
            }
          }
          loading={loading}
        />

        <InvestmentStatsCard
          stats={
            data?.investments ?? {
              total: 0,
              pending: 0,
              active: 0,
              matured: 0,
              withdrawn: 0,
              cancelled: 0,
              total_invested: 0,
              projected_value: 0,
            }
          }
          loading={loading}
        />

        <DepositStatsCard
          title="Investment Deposits"
          stats={
            data?.investment_deposits ?? {
              total: 0,
              pending: 0,
              verifying: 0,
              confirmed: 0,
              failed: 0,
              expired: 0,
              unmatched: 0,
            }
          }
          loading={loading}
        />

        <DepositStatsCard
          title="Account Deposits"
          stats={
            data?.account_deposits ?? {
              total: 0,
              pending: 0,
              verifying: 0,
              confirmed: 0,
              failed: 0,
              expired: 0,
              unmatched: 0,
            }
          }
          loading={loading}
        />

        <WithdrawalStatsCard
          stats={
            data?.withdrawals ?? {
              total: 0,
              pending: 0,
              processing: 0,
              broadcast: 0,
              confirming: 0,
              completed: 0,
              failed: 0,
              cancelled: 0,
              total_amount: 0,
              net_amount: 0,
            }
          }
          loading={loading}
        />

        <SupportStatsCard
          stats={
            data?.support ?? {
              total: 0,
              open: 0,
              in_progress: 0,
              waiting_for_user: 0,
              resolved: 0,
              closed: 0,
              urgent: 0,
            }
          }
          loading={loading}
        />

        <LedgerStatsCard
          stats={
            data?.ledger ?? {
              balance: 0,
              entries: 0,
            }
          }
          loading={loading}
        />
      </div>

      <CentralWalletCard
        stats={
          data?.central_wallet ?? {
            address: '',
            network: 'TRON',
            usdt_balance: 0,
            trx_balance: 0,
            status: 'WARNING',
            energy: {
              limit: 0,
              used: 0,
              available: 0,
            },
            bandwidth: {
              limit: 0,
              used: 0,
              available: 0,
            },
            free_bandwidth: {
              limit: 0,
              used: 0,
              available: 0,
            },
            tron_power: {
              limit: 0,
              used: 0,
              available: 0,
            },
            last_checked_at: '',
          }
        }
        loading={loading}
      />
    </div>
  );
}