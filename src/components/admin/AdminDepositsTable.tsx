
'use client';

import type { AdminDeposit } from '@/src/lib/api/admin';

interface AdminDepositsTableProps {
  deposits: AdminDeposit[];
  loading?: boolean;
  onView: (deposit: AdminDeposit) => void;
  onVerify: (deposit: AdminDeposit) => void;
  onReject: (deposit: AdminDeposit) => void;
  processingId?: string | null;
}

export default function AdminDepositsTable({
  deposits,
  loading = false,
  onView,
  onVerify,
  onReject,
  processingId,
}: AdminDepositsTableProps) {
  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />

        <p className="mt-3 text-sm text-white/40">
          Loading deposits...
        </p>
      </div>
    );
  }

  if (!deposits.length) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/8 bg-white/5">
          <span className="text-xl text-white/25">₿</span>
        </div>

        <h3 className="mt-3 text-sm font-semibold text-white/80">
          No deposits found
        </h3>

        <p className="mt-1 text-sm text-white/35">
          There are no deposits matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/6">
        <thead className="bg-white/2.5">
          <tr>
            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              User
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Amount
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Asset
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Network
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Status
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Confirmations
            </th>

            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5 bg-[#0B1426]">
          {deposits.map((deposit) => {
            const processing =
              processingId === deposit.id;

            const pending =
              deposit.status.toUpperCase() === 'PENDING';

            return (
              <tr
                key={deposit.id}
                className="group transition hover:bg-white/2.5"
              >
                {/* USER */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-sm font-semibold text-emerald-300">
                      {getInitials(deposit.user_name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/85">
                        {deposit.user_name || 'Unknown User'}
                      </p>

                      <p className="truncate text-xs text-white/35">
                        {deposit.user_email || 'No email available'}
                      </p>

                      <p className="mt-0.5 truncate font-mono text-[10px] text-white/20">
                        {deposit.user_id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* AMOUNT */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="text-sm font-semibold text-white/85">
                    {formatAmount(deposit.expected_amount)}
                  </div>

                  {deposit.received_amount !==
                    deposit.expected_amount && (
                    <div className="mt-0.5 text-xs text-white/35">
                      Received:{' '}
                      {formatAmount(
                        deposit.received_amount,
                      )}
                    </div>
                  )}
                </td>

                {/* ASSET */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="inline-flex items-center rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/60">
                    {deposit.asset_symbol}
                  </span>
                </td>

                {/* NETWORK */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="text-sm text-white/50">
                    {deposit.network_name}
                  </span>
                </td>

                {/* STATUS */}
                <td className="whitespace-nowrap px-5 py-4">
                  <StatusBadge status={deposit.status} />
                </td>

                {/* CONFIRMATIONS */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/70">
                      {deposit.confirmations}
                    </span>

                    <span className="text-xs text-white/20">
                      /
                    </span>

                    <span className="text-xs text-white/35">
                      {deposit.required_confirmations}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-500 transition-all"
                      style={{
                        width: `${getConfirmationPercentage(
                          deposit.confirmations,
                          deposit.required_confirmations,
                        )}%`,
                      }}
                    />
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(deposit)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/55 transition hover:border-white/15 hover:bg-white/8 hover:text-white"
                    >
                      View
                    </button>

                    {pending && (
                      <>
                        <button
                          type="button"
                          onClick={() => onVerify(deposit)}
                          disabled={processing}
                          className="rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {processing
                            ? 'Processing...'
                            : 'Verify'}
                        </button>

                        <button
                          type="button"
                          onClick={() => onReject(deposit)}
                          disabled={processing}
                          className="rounded-lg border border-red-400/10 bg-red-400/5 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Reject
                        </button>
                      </>
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

/* -------------------------------------------------------
 * Helpers
 * ----------------------------------------------------- */

function getInitials(name: string): string {
  if (!name) {
    return '?';
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

function formatAmount(
  amount: number,
): string {
  return new Intl.NumberFormat(
    'en-US',
    {
      maximumFractionDigits: 8,
    },
  ).format(amount);
}

function getConfirmationPercentage(
  confirmations: number,
  required: number,
): number {
  if (required <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (confirmations / required) * 100,
    ),
  );
}

/* -------------------------------------------------------
 * Status Badge
 * ----------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toUpperCase();

  const styles: Record<
    string,
    string
  > = {
    PENDING:
      'border-amber-400/15 bg-amber-400/8 text-amber-300',

    VERIFIED:
      'border-emerald-400/15 bg-emerald-400/8 text-emerald-300',

    REJECTED:
      'border-red-400/15 bg-red-400/8 text-red-300',
  };

  const dots: Record<
    string,
    string
  > = {
    PENDING: 'bg-amber-400',
    VERIFIED: 'bg-emerald-400',
    REJECTED: 'bg-red-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        styles[normalized] ??
        'border-white/8 bg-white/5 text-white/45'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dots[normalized] ??
          'bg-white/30'
        }`}
      />

      {normalized}
    </span>
  );
}