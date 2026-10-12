
"use client";

import {
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Copy,
  History,
  RefreshCw,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import axios from "axios";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/src/context/useSettings";
import { investmentApi } from "@/src/lib/api/investmentApi";
import { formatUSDT } from "@/src/lib/utils/currency";

import type {
  AccountDeposit,
  AccountDepositAddress,
  AccountDepositStatus,
  Asset,
  AssetNetwork,
  PrepareAccountDepositResponse,
} from "@/src/lib/types/investment";

const TRON_NETWORK_NAMES = [
  "TRON",
  "TRC20",
  "TRON TRC20",
];

function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "object" && data !== null) {
      const response = data as {
        error?: unknown;
        message?: unknown;
      };

      if (
        typeof response.error === "string" &&
        response.error.trim()
      ) {
        return response.error.trim();
      }

      if (
        typeof response.message === "string" &&
        response.message.trim()
      ) {
        return response.message.trim();
      }
    }

    if (error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function getStatusClasses(
  status: AccountDepositStatus,
): string {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "FAILED":
    case "EXPIRED":
    case "UNMATCHED":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    case "VERIFYING":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    default:
      return "border-white/10 bg-white/5 text-slate-300";
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
    <div className="min-w-0 rounded-xl border border-white/[0.07] bg-[#07101F] p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 truncate text-xs font-extrabold text-white sm:text-sm">
        {value}
      </p>
    </div>
  );
}

export default function AccountDepositPage() {
  const router = useRouter();
  const { currency } = useSettings();

  const prepareLock = useRef(false);
  const submitLock = useRef(false);
  const verifyLock = useRef(false);
  const refreshLock = useRef(false);

  const [selectedAsset, setSelectedAsset] =
    useState<Asset | null>(null);

  const [selectedNetwork, setSelectedNetwork] =
    useState<AssetNetwork | null>(null);

  const [address, setAddress] =
    useState<AccountDepositAddress | null>(null);

  const [amount, setAmount] = useState("");

  const [preparedDeposit, setPreparedDeposit] =
    useState<PrepareAccountDepositResponse | null>(null);

  const [deposit, setDeposit] =
    useState<AccountDeposit | null>(null);

  const [txHash, setTxHash] = useState("");

  const [history, setHistory] =
    useState<AccountDeposit[]>([]);

  const [historyExpanded, setHistoryExpanded] =
    useState(false);

  const [historyError, setHistoryError] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const assetResponse =
          await investmentApi.getAssets();

        if (cancelled) return;

        const usdt = assetResponse.find(
          (asset) =>
            asset.isActive &&
            asset.symbol?.trim().toUpperCase() === "USDT",
        );

        if (!usdt) {
          throw new Error("USDT is currently unavailable.");
        }

        const networkResponse =
          await investmentApi.getNetworks(usdt.id);

        if (cancelled) return;

        const tron = networkResponse.find(
          (network) =>
            network.isActive &&
            TRON_NETWORK_NAMES.includes(
              network.network?.trim().toUpperCase(),
            ),
        );

        if (!tron) {
          throw new Error(
            "TRON network is currently unavailable for USDT.",
          );
        }

        const [addressResult, historyResult] =
          await Promise.allSettled([
            investmentApi.getAccountDepositAddress(
              usdt.id,
              tron.id,
            ),
            investmentApi.getAccountDeposits(1, 20),
          ]);

        if (cancelled) return;

        setSelectedAsset(usdt);
        setSelectedNetwork(tron);

        if (addressResult.status === "fulfilled") {
          setAddress(addressResult.value);
        } else {
          setError(
            getApiErrorMessage(
              addressResult.reason,
              "Unable to load your deposit address.",
            ),
          );
        }

        if (historyResult.status === "fulfilled") {
          setHistory(historyResult.value.deposits);
          setHistoryError("");
        } else {
          setHistoryError(
            "Unable to load deposit history.",
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(
              err,
              "Unable to load deposit information.",
            ),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadHistory = async () => {
    try {
      const result =
        await investmentApi.getAccountDeposits(1, 20);

      setHistory(result.deposits);
      setHistoryError("");
    } catch (err) {
      setHistoryError(
        getApiErrorMessage(
          err,
          "Unable to refresh deposit history.",
        ),
      );
    }
  };

  const loadAddress = async () => {
    if (!selectedAsset || !selectedNetwork) return;

    setLoadingAddress(true);

    try {
      const result =
        await investmentApi.getAccountDepositAddress(
          selectedAsset.id,
          selectedNetwork.id,
        );

      setAddress(result);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to load your deposit address.",
        ),
      );
    } finally {
      setLoadingAddress(false);
    }
  };

  const numericAmount = useMemo(() => {
    const value = Number(amount);

    return Number.isFinite(value) && value > 0
      ? value
      : 0;
  }, [amount]);

  const copyAddress = async () => {
    if (!address?.depositAddress) return;

    try {
      await navigator.clipboard.writeText(
        address.depositAddress,
      );

      setCopied(true);

      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy the deposit address.");
    }
  };

  const prepareDeposit = async () => {
    if (prepareLock.current) return;

    if (!selectedAsset || !selectedNetwork) {
      setError("USDT on TRON is not available.");
      return;
    }

    if (numericAmount <= 0) {
      setError("Enter a valid deposit amount.");
      return;
    }

    prepareLock.current = true;
    setPreparing(true);
    setError("");

    try {
      const result =
        await investmentApi.prepareAccountDeposit({
          assetId: selectedAsset.id,
          networkId: selectedNetwork.id,
          amount: numericAmount,
        });

      setPreparedDeposit(result);
      setDeposit(null);
      setTxHash("");
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to prepare your deposit.",
        ),
      );
    } finally {
      prepareLock.current = false;
      setPreparing(false);
    }
  };

  const submitTransaction = async () => {
    if (submitLock.current) return;

    const cleanTxHash = txHash.trim();

    if (!preparedDeposit?.id) {
      setError("Prepare your deposit first.");
      return;
    }

    if (!cleanTxHash) {
      setError("Enter the transaction hash.");
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    setError("");

    try {
      const result =
        await investmentApi.submitAccountDeposit(
          preparedDeposit.id,
          cleanTxHash,
        );

      setPreparedDeposit(null);
      setDeposit(result);
      setTxHash(result.txHash || cleanTxHash);

      await loadHistory();
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to submit your transaction.",
        ),
      );
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  };

  const verifyDeposit = async () => {
    if (verifyLock.current) return;

    if (!deposit?.id || !deposit.txHash) {
      setError(
        "Submit your transaction hash before verification.",
      );
      return;
    }

    verifyLock.current = true;
    setVerifying(true);
    setError("");

    try {
      const result =
        await investmentApi.verifyAccountDeposit(
          deposit.id,
        );

      setDeposit(result);
      await loadHistory();
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to check deposit status.",
        ),
      );
    } finally {
      verifyLock.current = false;
      setVerifying(false);
    }
  };

  const refresh = async () => {
    if (refreshLock.current) return;

    refreshLock.current = true;
    setRefreshing(true);
    setError("");

    try {
      const requests: Promise<unknown>[] = [
        loadHistory(),
      ];

      if (selectedAsset && selectedNetwork) {
        requests.push(loadAddress());
      }

      if (deposit?.id) {
        requests.push(
          investmentApi
            .getAccountDeposit(deposit.id)
            .then(setDeposit),
        );
      }

      await Promise.all(requests);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to refresh deposit information.",
        ),
      );
    } finally {
      refreshLock.current = false;
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050B18] px-4 py-7 text-white">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-12 w-44 rounded-xl bg-white/10" />
          <div className="h-36 rounded-[22px] bg-[#0B1426]" />
          <div className="h-64 rounded-[22px] bg-[#0B1426]" />
          <div className="h-72 rounded-[22px] bg-[#0B1426]" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        {/* HEADER */}
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push("/investment/profile/wallet")
            }
            aria-label="Back to wallet"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-slate-300"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#FF476B]">
              REDIQ Wallet
            </p>

            <h1 className="mt-0.5 text-lg font-black tracking-tight sm:text-xl">
              Deposit funds
            </h1>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing}
            aria-label="Refresh deposit information"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0B1426] text-slate-300 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </header>

        {/* INTRO */}
        <section className="relative overflow-hidden rounded-[22px] border border-[#E60033]/15 bg-linear-to-br from-[#142039] via-[#0B1426] to-[#10101F] p-4 sm:p-5">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#E60033]/15 blur-3xl" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E60033]/12 text-[#FF476B]">
              <ArrowDownToLine size={19} />
            </div>

            <div>
              <h2 className="text-sm font-extrabold">
                Add USDT to your balance
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                Send USDT through TRON/TRC20, then submit
                your transaction hash for verification.
              </p>
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-2.5">
            <InfoBox
              label="Asset"
              value={selectedAsset?.symbol ?? "USDT"}
            />
            <InfoBox
              label="Network"
              value="TRON / TRC20"
            />
          </div>
        </section>

        {/* ADDRESS */}
        <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck
              size={18}
              className="text-[#FF476B]"
            />

            <div className="flex-1">
              <h2 className="text-sm font-extrabold">
                Deposit address
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Your assigned TRON wallet
              </p>
            </div>

            {address?.isActive && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-bold text-slate-300">
                Active
              </span>
            )}
          </div>

          {loadingAddress ? (
            <p className="mt-4 text-xs text-slate-400">
              Loading address...
            </p>
          ) : address ? (
            <>
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#07101F] p-3.5">
                <p className="break-all font-mono text-[11px] leading-5 text-slate-200">
                  {address.depositAddress}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void copyAddress()}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-3 text-xs font-extrabold text-white transition hover:bg-[#FF174D]"
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

              <p className="mt-3 text-[10px] leading-4 text-amber-200/75">
                Send only USDT through TRON/TRC20 to this
                address. Other assets or networks may
                result in permanent loss of funds.
              </p>
            </>
          ) : (
            <p className="mt-4 text-xs text-slate-500">
              Deposit address is currently unavailable.
            </p>
          )}
        </section>

        {/* PREPARE */}
        {!preparedDeposit && !deposit && (
          <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <Wallet
                size={18}
                className="text-[#FF476B]"
              />

              <div>
                <h2 className="text-sm font-extrabold">
                  Deposit amount
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  How much USDT will you send?
                </p>
              </div>
            </div>

            <div className="relative mt-4">
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="0.00"
                className="h-14 w-full rounded-xl border border-white/10 bg-[#07101F] px-4 pr-20 text-xl font-black outline-none placeholder:text-slate-700 focus:border-[#FF476B]/50"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#FF476B]">
                USDT
              </span>
            </div>

            <button
              type="button"
              onClick={() => void prepareDeposit()}
              disabled={preparing || numericAmount <= 0}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-3.5 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {preparing && (
                <RefreshCw
                  size={15}
                  className="animate-spin"
                />
              )}
              {preparing
                ? "Preparing deposit..."
                : "Prepare deposit"}
            </button>
          </section>
        )}

        {/* PREPARED */}
        {preparedDeposit && !deposit && (
          <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-extrabold">
                Deposit prepared
              </h2>

              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${getStatusClasses(preparedDeposit.status)}`}
              >
                {preparedDeposit.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <InfoBox
                label="Expected amount"
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

            <p className="mt-4 text-[11px] leading-5 text-slate-400">
              Send{" "}
              <strong className="text-white">
                {formatUSDT(
                  preparedDeposit.expectedAmount,
                  currency,
                )}
              </strong>{" "}
              to the deposit address above. After sending,
              paste your transaction hash below.
            </p>

            <label
              htmlFor="deposit-tx-hash"
              className="mt-4 block text-xs font-bold"
            >
              Transaction hash
            </label>

            <input
              id="deposit-tx-hash"
              type="text"
              value={txHash}
              onChange={(event) =>
                setTxHash(event.target.value)
              }
              placeholder="Paste your TRON transaction hash"
              autoComplete="off"
              spellCheck={false}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#07101F] px-3 font-mono text-[11px] outline-none placeholder:text-slate-600 focus:border-[#FF476B]/50"
            />

            <button
              type="button"
              onClick={() => void submitTransaction()}
              disabled={submitting || !txHash.trim()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60033] px-4 py-3.5 text-xs font-extrabold disabled:opacity-40"
            >
              {submitting && (
                <RefreshCw
                  size={15}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Submitting transaction..."
                : "Submit transaction"}
            </button>
          </section>
        )}

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3.5 text-xs leading-5 text-red-300"
          >
            <XCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* CURRENT DEPOSIT */}
        {deposit && (
          <section className="rounded-[22px] border border-white/10 bg-[#0B1426] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-extrabold">
                  Deposit details
                </h2>

                <p className="mt-1 break-all font-mono text-[9px] text-slate-500">
                  {deposit.id}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold ${getStatusClasses(deposit.status)}`}
              >
                {deposit.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
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
              <div className="mt-3 rounded-xl border border-white/[0.07] bg-[#07101F] p-3">
                <p className="text-[9px] uppercase tracking-wider text-slate-500">
                  Transaction hash
                </p>

                <p className="mt-2 break-all font-mono text-[10px] leading-5 text-slate-300">
                  {deposit.txHash}
                </p>
              </div>
            )}

            {deposit.status === "CONFIRMED" && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] p-3.5 text-xs leading-5 text-emerald-200">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0"
                />
                Deposit confirmed and credited to your
                available balance.
              </div>
            )}

            {(deposit.status === "PENDING" ||
              deposit.status === "VERIFYING") && (
              <button
                type="button"
                onClick={() => void verifyDeposit()}
                disabled={verifying}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E60033]/30 bg-[#E60033]/10 px-4 py-3 text-xs font-extrabold text-[#FF8199] disabled:opacity-40"
              >
                <RefreshCw
                  size={15}
                  className={verifying ? "animate-spin" : ""}
                />

                {verifying
                  ? "Checking..."
                  : "Check deposit status"}
              </button>
            )}

            {["FAILED", "EXPIRED", "UNMATCHED"].includes(
              deposit.status,
            ) && (
              <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/5 p-3.5 text-xs text-red-300">
                Deposit {deposit.status.toLowerCase()}.
                {deposit.failureReason && (
                  <p className="mt-1 text-[11px]">
                    {deposit.failureReason}
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/investment/profile/account-deposit/${deposit.id}`,
                )
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-slate-200"
            >
              View full details
              <ChevronRight size={15} />
            </button>

            <button
              type="button"
              onClick={() => {
                setDeposit(null);
                setPreparedDeposit(null);
                setAmount("");
                setTxHash("");
                setError("");
              }}
              className="mt-2 w-full py-2 text-xs font-bold text-[#FF476B]"
            >
              Prepare another deposit
            </button>
          </section>
        )}

        {/* SCROLLABLE HISTORY */}
        <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0B1426]">
          <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                <History size={17} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold">
                  Deposit history
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  {history.length} recent transaction
                  {history.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {history.length > 10 && (
              <button
                type="button"
                onClick={() =>
                  setHistoryExpanded((previous) => !previous)
                }
                className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold text-[#FF8199]"
              >
                {historyExpanded ? "Show 10" : "Show all"}
              </button>
            )}
          </div>

          {historyError && (
            <p
              role="alert"
              className="border-t border-white/5.5 px-4 py-3 text-[11px] text-red-300"
            >
              {historyError}
            </p>
          )}

          {history.length === 0 ? (
            <div className="border-t border-white/5.5 px-4 py-9 text-center">
              <ArrowDownToLine
                size={22}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-xs font-bold text-slate-300">
                No deposits yet
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Your deposit transactions will appear here.
              </p>
            </div>
          ) : (
            <>
              <div
                tabIndex={0}
                aria-label="Scrollable deposit history"
                className={`overscroll-contain overflow-y-auto border-t border-white/5.5 [scrollbar-color:#374151_transparent] scrollbar-thin ${
                  historyExpanded
                    ? "max-h-180"
                    : "max-h-170"
                }`}
              >
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/investment/profile/account-deposit/${item.id}`,
                      )
                    }
                    className="flex w-full items-center gap-3 border-b border-white/5.5 px-4 py-3.5 text-left transition last:border-b-0 hover:bg-white/[0.035] sm:px-5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E60033]/10 text-[#FF476B]">
                      <ArrowDownToLine size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold text-white">
                        USDT Deposit
                      </p>

                      <p className="mt-1 text-[9px] text-slate-500">
                        {new Date(
                          item.createdAt,
                        ).toLocaleString()}
                      </p>

                      <p className="mt-1 truncate font-mono text-[9px] text-slate-600">
                        {item.txHash || item.id}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[11px] font-extrabold text-white">
                        {formatUSDT(
                          item.receivedAmount ||
                            item.expectedAmount,
                          currency,
                        )}
                      </p>

                      <span
                        className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[8px] font-bold ${getStatusClasses(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <ChevronRight
                      size={13}
                      className="shrink-0 text-slate-600"
                    />
                  </button>
                ))}
              </div>

              {history.length > 10 && (
                <div className="border-t border-white/6 px-4 py-2.5 text-center text-[10px] text-slate-500">
                  Scroll inside this section to see more
                  transactions
                </div>
              )}
            </>
          )}
        </section>

        <p className="px-1 text-center text-[10px] leading-4 text-slate-500">
          Confirmed deposits are credited to your available
          account balance. Depositing does not automatically
          create an investment.
        </p>
      </div>
    </main>
  );
}