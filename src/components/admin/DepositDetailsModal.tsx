
'use client';

import type { AdminDeposit } from '@/src/lib/api/admin';

interface DepositDetailsModalProps {
  deposit: AdminDeposit | null;
  onClose: () => void;
  onVerify: (deposit: AdminDeposit) => void;
  onReject: (deposit: AdminDeposit) => void;
  processing?: boolean;
}

export default function DepositDetailsModal({
  deposit,
  onClose,
  onVerify,
  onReject,
  processing = false,
}: DepositDetailsModalProps) {
  if (!deposit) return null;

  const pending = deposit.status === 'PENDING';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">
              Deposit Details
            </h2>
            <p className="text-sm text-gray-500">
              {deposit.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <Detail label="User" value={deposit.user_name} />
          <Detail label="Email" value={deposit.user_email} />

          <Detail label="Amount" value={String(deposit.expected_amount)} />
          <Detail label="Received" value={String(deposit.received_amount)} />

          <Detail label="Asset" value={deposit.asset_symbol} />
          <Detail label="Network" value={deposit.network_name} />

          <Detail label="Status" value={deposit.status} />

          <Detail
            label="Confirmations"
            value={`${deposit.confirmations} / ${deposit.required_confirmations}`}
          />

          <div className="md:col-span-2">
            <Detail
              label="Transaction Hash"
              value={deposit.tx_hash || 'Not submitted'}
              mono
            />
          </div>

          <div className="md:col-span-2">
            <Detail
              label="Company Deposit Address"
              value={deposit.company_deposit_address}
              mono
            />
          </div>

          <Detail
            label="Created"
            value={new Date(deposit.created_at).toLocaleString()}
          />

          <Detail
            label="Updated"
            value={new Date(deposit.updated_at).toLocaleString()}
          />
        </div>

        {pending && (
          <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
            <button
              onClick={() => onReject(deposit)}
              disabled={processing}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>

            <button
              onClick={() => onVerify(deposit)}
              disabled={processing}
              className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {processing ? 'Verifying...' : 'Verify Deposit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-gray-500">
        {label}
      </dt>

      <dd
        className={`mt-1 break-all text-sm text-gray-900 ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  );
}