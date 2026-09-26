'use client';

import {
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  Copy,
  RefreshCw,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import InvestmentBottomNav from '@/src/components/InvestmentBottomNav';
import { useSettings } from '@/src/context/useSettings';
import { investmentApi } from '@/src/lib/api/investmentApi';
import { formatUSDT } from '@/src/lib/utils/currency';

import type {
  AccountDeposit,
  AccountDepositAddress,
  AccountDepositStatus,
  Asset,
  AssetNetwork,
  PrepareAccountDepositResponse,
} from '@/src/lib/types/investment';

const USDT_SYMBOL = 'USDT';

const TRON_NETWORK_NAMES = [
  'TRON',
  'TRC20',
  'TRON TRC20',
];

function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (
      typeof data === 'object' &&
      data !== null
    ) {
      if (
        typeof data.error === 'string' &&
        data.error.trim()
      ) {
        return data.error.trim();
      }

      if (
        typeof data.message === 'string' &&
        data.message.trim()
      ) {
        return data.message.trim();
      }
    }

    if (
      typeof error.message === 'string' &&
      error.message.trim()
    ) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function getStatusClasses(
  status: AccountDepositStatus,
): string {
  switch (status) {
    case 'CONFIRMED':
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300';

    case 'FAILED':
    case 'EXPIRED':
    case 'UNMATCHED':
      return 'border-red-400/20 bg-red-400/10 text-red-300';

    case 'VERIFYING':
      return 'border-amber-400/20 bg-amber-400/10 text-amber-300';

    case 'PENDING':
    default:
      return 'border-white/10 bg-white/[0.06] text-slate-300';
  }
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 truncate text-xs font-extrabold text-white">
        {value}
      </p>
    </div>
  );
}

export default function AccountDepositPage() {
  const router = useRouter();
  const { currency } = useSettings();

  // ---------------------------------------------------------------------------
  // Asset / network
  // ---------------------------------------------------------------------------

  const [selectedAsset, setSelectedAsset] =
    useState<Asset | null>(null);

  const [selectedNetwork, setSelectedNetwork] =
    useState<AssetNetwork | null>(null);

  // ---------------------------------------------------------------------------
  // Deposit address
  // ---------------------------------------------------------------------------

  const [address, setAddress] =
    useState<AccountDepositAddress | null>(null);

  // ---------------------------------------------------------------------------
  // Deposit amount
  // ---------------------------------------------------------------------------

  const [amount, setAmount] = useState('');

  // ---------------------------------------------------------------------------
  // Deposit state
  // ---------------------------------------------------------------------------

  const [preparedDeposit, setPreparedDeposit] =
    useState<PrepareAccountDepositResponse | null>(null);

  const [deposit, setDeposit] =
    useState<AccountDeposit | null>(null);

  // ---------------------------------------------------------------------------
  // Transaction hash
  // ---------------------------------------------------------------------------

  const [txHash, setTxHash] = useState('');

  // ---------------------------------------------------------------------------
  // History
  // ---------------------------------------------------------------------------

  const [history, setHistory] =
    useState<AccountDeposit[]>([]);

  // ---------------------------------------------------------------------------
  // Loading states
  // ---------------------------------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [loadingAddress, setLoadingAddress] =
    useState(false);

  const [preparing, setPreparing] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  // ---------------------------------------------------------------------------
  // UI state
  // ---------------------------------------------------------------------------

  const [copied, setCopied] = useState(false);

  const [error, setError] = useState('');

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Load assets
        const assetResponse =
          await investmentApi.getAssets();

        if (cancelled) {
          return;
        }

        const usdt = assetResponse.find(
          (asset) =>
            asset.symbol?.trim().toUpperCase() ===
            USDT_SYMBOL,
        );

        if (!usdt) {
          throw new Error(
            'USDT is currently unavailable.',
          );
        }

        // 2. Load USDT networks
        const networkResponse =
          await investmentApi.getNetworks(usdt.id);

        if (cancelled) {
          return;
        }

        const tron = networkResponse.find(
          (network) =>
            TRON_NETWORK_NAMES.includes(
              network.network
                ?.trim()
                .toUpperCase(),
            ),
        );

        if (!tron) {
          throw new Error(
            'TRON network is currently unavailable for USDT.',
          );
        }

        // 3. Load address + history in parallel
        const [
          addressResponse,
          historyResponse,
        ] = await Promise.all([
          investmentApi.getAccountDepositAddress(
            usdt.id,
            tron.id,
          ),
          investmentApi.getAccountDeposits(
            1,
            20,
          ),
        ]);

        if (cancelled) {
          return;
        }

        // 4. Update state
        setSelectedAsset(usdt);
        setSelectedNetwork(tron);
        setAddress(addressResponse);
        setHistory(historyResponse.deposits);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to initialize account deposit:',
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load deposit information.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===========================================================================
  // LOAD HISTORY
  // ===========================================================================

  const loadHistory = async () => {
    try {
      const response =
        await investmentApi.getAccountDeposits(
          1,
          20,
        );

      setHistory(response.deposits);
    } catch (err) {
      console.error(
        'Failed to load account deposit history:',
        err,
      );
    }
  };

  // ===========================================================================
  // LOAD ADDRESS
  // ===========================================================================

  const loadAddress = async () => {
    if (
      !selectedAsset ||
      !selectedNetwork
    ) {
      return;
    }

    setLoadingAddress(true);

    try {
      const result =
        await investmentApi.getAccountDepositAddress(
          selectedAsset.id,
          selectedNetwork.id,
        );

      setAddress(result);
    } catch (err) {
      console.error(
        'Failed to load account deposit address:',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load your deposit address.',
      );
    } finally {
      setLoadingAddress(false);
    }
  };

  // ===========================================================================
  // NUMERIC AMOUNT
  // ===========================================================================

  const numericAmount = useMemo(() => {
    const value = Number(amount);

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return 0;
    }

    return value;
  }, [amount]);

  // ===========================================================================
  // COPY ADDRESS
  // ===========================================================================

  const copyAddress = async () => {
    if (!address?.depositAddress) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        address.depositAddress,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error(
        'Failed to copy address:',
        err,
      );
    }
  };

  // ===========================================================================
  // PREPARE DEPOSIT
  // ===========================================================================

  const prepareDeposit = async () => {
    if (
      !selectedAsset ||
      !selectedNetwork
    ) {
      setError(
        'USDT on TRON is not available.',
      );
      return;
    }

    if (numericAmount <= 0) {
      setError(
        'Enter a valid deposit amount.',
      );
      return;
    }

    setPreparing(true);
    setError('');

    try {
      const result =
        await investmentApi.prepareAccountDeposit({
          assetId: selectedAsset.id,
          networkId: selectedNetwork.id,
          amount: numericAmount,
        });

      setPreparedDeposit(result);
      setDeposit(null);
      setTxHash('');
    } catch (err) {
      console.error(
        'Failed to prepare account deposit:',
        err,
      );

      setError(
        getApiErrorMessage(
          err,
          'Failed to prepare account deposit.',
        ),
      );
    } finally {
      setPreparing(false);
    }
  };

  // ===========================================================================
  // SUBMIT TRANSACTION HASH
  // ===========================================================================

  const submitTransaction = async () => {
    const cleanTxHash = txHash.trim();

    if (!preparedDeposit?.id) {
      setError(
        'No prepared deposit was found. Please prepare the deposit first.',
      );
      return;
    }

    if (!cleanTxHash) {
      setError(
        'Please enter the transaction hash.',
      );
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const updatedDeposit =
        await investmentApi.submitAccountDeposit(
          preparedDeposit.id,
          cleanTxHash,
        );

      setPreparedDeposit(null);
      setDeposit(updatedDeposit);

      setTxHash(
        updatedDeposit.txHash ||
          cleanTxHash,
      );

      await loadHistory();
    } catch (err) {
      console.error(
        'Failed to submit account deposit:',
        err,
      );

      setError(
        getApiErrorMessage(
          err,
          'Failed to submit transaction.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ===========================================================================
  // VERIFY DEPOSIT
  // ===========================================================================

  const verifyDeposit = async () => {
    if (!deposit?.id) {
      setError(
        'This account deposit could not be found.',
      );
      return;
    }

    if (!deposit.txHash) {
      setError(
        'Please submit the transaction hash before verification.',
      );
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const result =
        await investmentApi.verifyAccountDeposit(
          deposit.id,
        );

      setDeposit(result);

      await loadHistory();
    } catch (err) {
      console.error(
        'Failed to verify account deposit:',
        err,
      );

      setError(
        getApiErrorMessage(
          err,
          'Failed to verify the deposit.',
        ),
      );
    } finally {
      setVerifying(false);
    }
  };

  // ===========================================================================
  // REFRESH
  // ===========================================================================

  const refresh = async () => {
    setRefreshing(true);
    setError('');

    try {
      const requests: Promise<void>[] = [
        loadHistory(),
      ];

      if (
        selectedAsset &&
        selectedNetwork
      ) {
        requests.push(loadAddress());
      }

      if (deposit?.id) {
        requests.push(
          investmentApi
            .getAccountDeposit(
              deposit.id,
            )
            .then((latest) => {
              setDeposit(latest);
            }),
        );
      }

      await Promise.all(requests);
    } catch (err) {
      console.error(
        'Failed to refresh account deposit:',
        err,
      );

      setError(
        getApiErrorMessage(
          err,
          'Failed to refresh deposit information.',
        ),
      );
    } finally {
      setRefreshing(false);
    }
  };

  // ===========================================================================
  // LOADING
  // ===========================================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050B18] px-6">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <Wallet
              size={22}
              className="text-emerald-400"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
            <RefreshCw
              size={14}
              className="animate-spin"
            />
            Loading deposit...
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // UI
  // ===========================================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050B18] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute -left-40 top-[35%] h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <main className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}

        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  '/investment/profile/wallet',
                )
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 shadow-lg shadow-black/10 transition hover:bg-white/8 hover:text-white active:scale-95"
              aria-label="Back to wallet"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                Account Wallet
              </p>

              <h1 className="mt-0.5 truncate text-[20px] font-extrabold tracking-tight text-white">
                Deposit
              </h1>

              <p className="text-[10px] text-slate-500">
                Fund your available balance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Refresh deposit"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />
          </button>
        </header>

        {/* ================================================================= */}
        {/* HERO */}
        {/* ================================================================= */}

        <section className="relative mt-5 overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-2xl shadow-black/20">
          <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <ArrowDownToLine
                  size={19}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  Secure Funding
                </p>

                <h2 className="mt-1 text-base font-extrabold text-white">
                  Add USDT to your account
                </h2>
              </div>
            </div>

            <p className="mt-4 max-w-lg text-xs leading-5 text-slate-400">
              Send USDT through the supported TRON/TRC20
              network and submit the blockchain transaction
              hash for verification.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/4 p-3.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Asset
                </p>

                <p className="mt-1.5 text-sm font-extrabold text-white">
                  {selectedAsset?.symbol ?? 'USDT'}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  {selectedAsset?.name ?? 'Tether USD'}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-400/10 bg-purple-400/5 p-3.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Network
                </p>

                <p className="mt-1.5 text-sm font-extrabold text-white">
                  TRON
                </p>

                <p className="mt-0.5 text-[10px] text-purple-300">
                  TRC20
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* ERROR */}
        {/* ================================================================= */}

        {error && (
          <section
            role="alert"
            className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4"
          >
            <div className="flex items-start gap-3">
              <XCircle
                size={17}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <p className="text-xs font-bold text-red-300">
                  Deposit request needs attention
                </p>

                <p className="mt-1 text-[10px] leading-4 text-red-300/80">
                  {error}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* DEPOSIT ADDRESS */}
        {/* ================================================================= */}

        <section className="mt-4 overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/10">
                  <ShieldCheck
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <h2 className="text-[15px] font-extrabold text-white">
                    Your deposit address
                  </h2>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Send USDT only through TRON/TRC20.
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-300">
                Active
              </span>
            </div>

            {loadingAddress ? (
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/6 bg-white/[0.035] p-4 text-xs text-slate-400">
                <RefreshCw
                  size={14}
                  className="animate-spin"
                />

                Loading address...
              </div>
            ) : address ? (
              <>
                <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-[#07101F] p-4">
                  <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    TRON wallet address
                  </p>

                  <p className="break-all font-mono text-[11px] font-bold leading-5 text-slate-200">
                    {address.depositAddress}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void copyAddress()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-xs font-extrabold text-[#04100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 active:scale-[0.99]"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={15} />
                      Address copied
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Copy deposit address
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-400/10 bg-amber-400/6 p-3.5">
                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-amber-400"
                  />

                  <p className="text-[10px] leading-4 text-amber-200/80">
                    Only send USDT over the TRON/TRC20
                    network to this address. Sending another
                    asset or using another network may result
                    in permanent loss of funds.
                  </p>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-2xl border border-white/6 bg-white/[0.035] p-4 text-xs text-slate-500">
                Deposit address is currently unavailable.
              </div>
            )}
          </div>
        </section>

        {/* ================================================================= */}
        {/* PREPARE NEW DEPOSIT */}
        {/* ================================================================= */}

        {!preparedDeposit && !deposit && (
          <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
                <Wallet
                  size={18}
                  className="text-purple-300"
                />
              </div>

              <div>
                <h2 className="text-[15px] font-extrabold text-white">
                  Deposit amount
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Enter the amount you intend to send
                </p>
              </div>
            </div>

            <div className="relative mt-5">
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value,
                  )
                }
                placeholder="0.00"
                className="h-16 w-full rounded-2xl border border-white/8 bg-[#07101F] px-4 pr-20 text-xl font-extrabold text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-400/40 focus:bg-[#091525]"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-white/[0.07] bg-white/4 px-2.5 py-1.5 text-[9px] font-extrabold tracking-wider text-emerald-300">
                USDT
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                void prepareDeposit()
              }
              disabled={
                preparing ||
                numericAmount <= 0
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-xs font-extrabold text-[#04100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {preparing ? (
                <>
                  <RefreshCw
                    size={15}
                    className="animate-spin"
                  />

                  Preparing deposit...
                </>
              ) : (
                <>
                  <Wallet size={15} />

                  Prepare deposit
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[9px] leading-4 text-slate-600">
              You will receive a deposit instruction before
              submitting your transaction hash.
            </p>
          </section>
        )}

        {/* ================================================================= */}
        {/* PREPARED DEPOSIT */}
        {/* ================================================================= */}

        {preparedDeposit && !deposit && (
          <section className="mt-4 rounded-[26px] border border-purple-400/10 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-400/10">
                    <CheckCircle2
                      size={15}
                      className="text-purple-300"
                    />
                  </div>

                  <h2 className="text-[15px] font-extrabold text-white">
                    Deposit prepared
                  </h2>
                </div>

                <p className="mt-2 break-all font-mono text-[9px] text-slate-600">
                  ID: {preparedDeposit.id}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[8px] font-bold ${getStatusClasses(
                  preparedDeposit.status,
                )}`}
              >
                {preparedDeposit.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <InfoBox
                label="Expected"
                value={formatUSDT(
                  preparedDeposit.expectedAmount,
                  currency,
                )}
              />

              <InfoBox
                label="Network"
                value="TRON / TRC20"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-blue-400/10 bg-blue-400/6 p-4">
              <div className="flex items-start gap-3">
                <ArrowDownToLine
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                  <p className="text-xs font-extrabold text-blue-200">
                    Send your USDT
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-blue-200/70">
                    Send exactly{' '}
                    <strong className="text-blue-100">
                      {formatUSDT(
                        preparedDeposit.expectedAmount,
                        currency,
                      )}
                    </strong>{' '}
                    to your TRON deposit address above.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="transaction-hash"
                className="text-xs font-bold text-white"
              >
                Transaction hash
              </label>

              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                After sending USDT from Binance or another
                wallet, paste the TRON transaction hash here.
              </p>

              <input
                id="transaction-hash"
                type="text"
                value={txHash}
                onChange={(event) =>
                  setTxHash(
                    event.target.value,
                  )
                }
                placeholder="Paste your TRON transaction hash"
                className="mt-3 h-13 w-full rounded-2xl border border-white/8 bg-[#07101F] px-4 font-mono text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-400/40"
              />

              <button
                type="button"
                onClick={() =>
                  void submitTransaction()
                }
                disabled={
                  submitting ||
                  !txHash.trim()
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-xs font-extrabold text-[#04100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />

                    Submitting transaction...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />

                    Submit transaction
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* FULL ACCOUNT DEPOSIT */}
        {/* ================================================================= */}

        {deposit && (
          <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[15px] font-extrabold text-white">
                  Deposit details
                </h2>

                <p className="mt-1 break-all font-mono text-[9px] text-slate-600">
                  ID: {deposit.id}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[8px] font-bold ${getStatusClasses(
                  deposit.status,
                )}`}
              >
                {deposit.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <InfoBox
                label="Expected"
                value={formatUSDT(
                  deposit.expectedAmount,
                  currency,
                )}
              />

              <InfoBox
                label="Received"
                value={formatUSDT(
                  deposit.receivedAmount,
                  currency,
                )}
              />

              <InfoBox
                label="Confirmations"
                value={`${deposit.confirmations}/${deposit.requiredConfirmations}`}
              />

              <InfoBox
                label="Network"
                value="TRON / TRC20"
              />
            </div>

            {deposit.txHash && (
              <div className="mt-4 rounded-2xl border border-white/6 bg-[#07101F] p-4">
                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Transaction hash
                </p>

                <p className="mt-2 break-all font-mono text-[10px] font-bold leading-5 text-slate-300">
                  {deposit.txHash}
                </p>
              </div>
            )}

            {deposit.senderAddress && (
              <div className="mt-3 rounded-2xl border border-white/6 bg-[#07101F] p-4">
                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Sender address
                </p>

                <p className="mt-2 break-all font-mono text-[10px] font-bold leading-5 text-slate-300">
                  {deposit.senderAddress}
                </p>
              </div>
            )}

            {/* VERIFYING */}

            {deposit.status === 'VERIFYING' && (
              <>
                <div className="mt-4 rounded-2xl border border-amber-400/10 bg-amber-400/6 p-4">
                  <div className="flex items-start gap-3">
                    <RefreshCw
                      size={19}
                      className="mt-0.5 shrink-0 text-amber-400"
                    />

                    <div>
                      <p className="text-xs font-extrabold text-amber-200">
                        Transaction is being verified
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-amber-200/70">
                        We are checking the TRON blockchain
                        for your transaction and waiting for
                        the required confirmations.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void verifyDeposit()
                  }
                  disabled={verifying}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3.5 text-xs font-extrabold text-[#160E00] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {verifying ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />

                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={15} />

                      Check deposit status
                    </>
                  )}
                </button>
              </>
            )}

            {/* PENDING */}

            {deposit.status === 'PENDING' && (
              <>
                <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                  <div className="flex items-start gap-3">
                    <RefreshCw
                      size={19}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <div>
                      <p className="text-xs font-extrabold text-white">
                        Waiting for transaction
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-slate-500">
                        The transaction has not yet been
                        confirmed by the verification service.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void verifyDeposit()
                  }
                  disabled={verifying}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/8 px-4 py-3.5 text-xs font-extrabold text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {verifying ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />

                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={15} />

                      Check deposit status
                    </>
                  )}
                </button>
              </>
            )}

            {/* CONFIRMED */}

            {deposit.status === 'CONFIRMED' && (
              <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <div>
                    <p className="text-xs font-extrabold text-emerald-200">
                      Deposit confirmed
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-emerald-200/70">
                      {formatUSDT(
                        deposit.receivedAmount,
                        currency,
                      )}{' '}
                      has been credited to your available
                      account balance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FAILED / EXPIRED / UNMATCHED */}

            {(deposit.status === 'FAILED' ||
              deposit.status === 'EXPIRED' ||
              deposit.status === 'UNMATCHED') && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/6 p-4">
                <XCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <div>
                  <p className="text-xs font-extrabold text-red-200">
                    Deposit{' '}
                    {deposit.status.toLowerCase()}
                  </p>

                  {deposit.failureReason && (
                    <p className="mt-1 text-[10px] leading-4 text-red-200/70">
                      {deposit.failureReason}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================= */}
        {/* HISTORY */}
        {/* ================================================================= */}

        <section className="mt-4 overflow-hidden rounded-[26px] border border-white/8 bg-[#0B1426] shadow-xl shadow-black/10">
          <div className="px-5 pb-4 pt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-extrabold text-white">
                  Deposit history
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  Your account balance deposits
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10">
                <ArrowDownToLine
                  size={16}
                  className="text-blue-400"
                />
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="border-t border-white/6 px-5 pb-7 pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/6 bg-white/[0.035] text-slate-600">
                <ArrowDownToLine size={18} />
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-300">
                No deposits yet
              </p>

              <p className="mx-auto mt-1 max-w-xs text-[10px] leading-4 text-slate-600">
                Your completed and pending deposits will
                appear here.
              </p>
            </div>
          ) : (
            <div className="border-t border-white/6">
              {history.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/investment/profile/account-deposit/${item.id}`,
                    )
                  }
                  className={`block w-full px-5 py-4 text-left transition hover:bg-white/2.5 active:bg-white/5 ${
                    index !== history.length - 1
                      ? 'border-b border-white/6'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.07] text-blue-400">
                        <ArrowDownToLine size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white">
                          USDT Deposit
                        </p>

                        <p className="mt-1 text-[9px] text-slate-600">
                          {new Date(
                            item.createdAt,
                          ).toLocaleString()}
                        </p>

                        {item.txHash && (
                          <p className="mt-1.5 truncate font-mono text-[9px] text-slate-600">
                            {item.txHash}
                          </p>
                        )}

                        <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-wider text-slate-700">
                          Tap to view deposit
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-xs font-extrabold text-white">
                        {formatUSDT(
                          item.receivedAmount ||
                            item.expectedAmount,
                          currency,
                        )}
                      </p>

                      <span
                        className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[8px] font-bold ${getStatusClasses(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* INFORMATION */}
        {/* ================================================================= */}

        <section className="mt-4 rounded-2xl border border-white/[0.07] bg-white/2.5 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <div>
              <p className="text-xs font-bold text-slate-200">
                Account balance deposit
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-600">
                Confirmed deposits are credited directly to
                your available ledger balance. They do not
                create an investment automatically.
              </p>
            </div>
          </div>
        </section>
      </main>

      <InvestmentBottomNav />
    </div>
  );
}