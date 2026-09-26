"use client";

import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Copy,
  Cpu,
  Gauge,
  RefreshCw,
  Wallet,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AdminDashboard from "@/src/components/admin/AdminDashboard";

import {
  adminCentralWalletApi,
  type CentralWalletStatus,
} from "@/src/lib/api/adminCentralWallet";

function formatNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

function resourcePercent(
  used: number,
  limit: number,
): number {
  if (limit <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (used / limit) * 100,
    ),
  );
}

function ResourceCard({
  title,
  icon: Icon,
  limit,
  used,
  available,
}: {
  title: string;
  icon: typeof Cpu;
  limit: number;
  used: number;
  available: number;
}) {
  const percentage =
    resourcePercent(used, limit);

  const isHighUsage =
    percentage >= 80;

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/10 text-purple-300">
            <Icon size={19} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              {title}
            </h2>

            <p className="text-xs text-slate-500">
              Resource usage
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-bold ${
            isHighUsage
              ? "text-amber-300"
              : "text-slate-400"
          }`}
        >
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/6">
        <div
          className={`h-full rounded-full transition-all ${
            isHighUsage
              ? "bg-amber-400"
              : "bg-purple-400"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] text-slate-600">
            Limit
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {formatNumber(limit)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-600">
            Used
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {formatNumber(used)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-600">
            Available
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {formatNumber(available)}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AdminCentralWalletPage() {
  const [wallet, setWallet] =
    useState<CentralWalletStatus | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const loadWallet = useCallback(
    async (
      manual = false,
    ): Promise<void> => {
      try {
        if (manual) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const result =
          await adminCentralWalletApi.getStatus();

        setWallet(result);
      } catch (err: unknown) {
        console.error(
          "Failed to load central wallet status:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load central wallet status.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    const initialLoad =
      window.setTimeout(() => {
        void loadWallet();
      }, 0);

    const interval =
      window.setInterval(() => {
        void loadWallet();
      }, 30_000);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [loadWallet]);

  const copyAddress =
    async (): Promise<void> => {
      if (!wallet?.address) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          wallet.address,
        );
      } catch (err: unknown) {
        console.error(
          "Failed to copy central wallet address:",
          err,
        );
      }
    };

  return (
    <AdminDashboard title="Central Wallet">
      <div className="min-h-screen bg-[#050B18]">
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Page heading */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  Administration
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Central Wallet
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Monitor the platform&apos;s
                TRON operating wallet and
                network resources.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadWallet(true)
              }
              disabled={
                loading || refreshing
              }
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {/* Initial loading */}
          {loading && !wallet ? (
            <>
              <section className="rounded-2xl border border-white/10 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-28 rounded bg-white/[0.07]" />

                  <div className="h-10 w-full rounded-xl bg-white/5" />
                </div>
              </section>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-36 animate-pulse rounded-2xl border border-white/5 bg-[#0B1426]"
                    />
                  ),
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-48 animate-pulse rounded-2xl border border-white/5 bg-[#0B1426]"
                    />
                  ),
                )}
              </div>
            </>
          ) : wallet ? (
            <>
              {/* Wallet identity */}
              <section className="rounded-2xl border border-white/10 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {wallet.status ===
                      "HEALTHY" ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
                          <CheckCircle2
                            size={17}
                            className="text-emerald-300"
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/10">
                          <AlertTriangle
                            size={17}
                            className="text-amber-300"
                          />
                        </div>
                      )}

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                          Wallet status
                        </p>

                        <span
                          className={`text-sm font-bold ${
                            wallet.status ===
                            "HEALTHY"
                              ? "text-emerald-300"
                              : "text-amber-300"
                          }`}
                        >
                          {wallet.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <code className="max-w-full break-all rounded-xl border border-white/8 bg-[#07111F] px-3 py-2 text-xs text-slate-400">
                        {wallet.address}
                      </code>

                      <button
                        type="button"
                        onClick={() =>
                          void copyAddress()
                        }
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
                        aria-label="Copy central wallet address"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
                    <Clock3 size={14} />

                    <span>
                      Checked{" "}
                      {new Date(
                        wallet.lastCheckedAt,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </section>

              {/* Balance cards */}
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* TRX */}
                <div className="rounded-2xl border border-white/10 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/10">
                        <Wallet
                          size={19}
                          className="text-purple-300"
                        />
                      </div>

                      <p className="text-sm font-bold text-slate-400">
                        TRX Balance
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-extrabold tracking-tight text-white">
                    {formatNumber(
                      wallet.trxBalance,
                      6,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    TRON
                  </p>
                </div>

                {/* USDT */}
                <div className="rounded-2xl border border-white/10 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10">
                      <Activity
                        size={19}
                        className="text-emerald-300"
                      />
                    </div>

                    <p className="text-sm font-bold text-slate-400">
                      USDT Balance
                    </p>
                  </div>

                  <p className="mt-5 text-3xl font-extrabold tracking-tight text-white">
                    {formatNumber(
                      wallet.usdtBalance,
                      6,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    USDT TRC-20
                  </p>
                </div>

                {/* Energy */}
                <div className="rounded-2xl border border-white/10 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/10">
                      <Gauge
                        size={19}
                        className="text-purple-300"
                      />
                    </div>

                    <p className="text-sm font-bold text-slate-400">
                      Energy
                    </p>
                  </div>

                  <p className="mt-5 text-3xl font-extrabold tracking-tight text-white">
                    {formatNumber(
                      wallet.energy
                        .available,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Available
                  </p>
                </div>

                {/* Bandwidth */}
                <div className="rounded-2xl border border-white/10 bg-[#0B1426] p-5 shadow-xl shadow-black/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/10 bg-sky-400/10">
                      <BatteryCharging
                        size={19}
                        className="text-sky-300"
                      />
                    </div>

                    <p className="text-sm font-bold text-slate-400">
                      Bandwidth
                    </p>
                  </div>

                  <p className="mt-5 text-3xl font-extrabold tracking-tight text-white">
                    {formatNumber(
                      wallet.bandwidth
                        .available,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Available
                  </p>
                </div>
              </section>

              {/* Main resources */}
              <section>
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">
                    Network Resources
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Current TRON resource
                    utilization.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <ResourceCard
                    title="Energy"
                    icon={Cpu}
                    limit={
                      wallet.energy.limit
                    }
                    used={
                      wallet.energy.used
                    }
                    available={
                      wallet.energy
                        .available
                    }
                  />

                  <ResourceCard
                    title="Bandwidth"
                    icon={Gauge}
                    limit={
                      wallet.bandwidth
                        .limit
                    }
                    used={
                      wallet.bandwidth
                        .used
                    }
                    available={
                      wallet.bandwidth
                        .available
                    }
                  />
                </div>
              </section>

              {/* Additional resources */}
              <section>
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">
                    Additional Resources
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Supporting wallet network
                    capacity.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <ResourceCard
                    title="Free Bandwidth"
                    icon={Activity}
                    limit={
                      wallet.freeBandwidth
                        .limit
                    }
                    used={
                      wallet.freeBandwidth
                        .used
                    }
                    available={
                      wallet.freeBandwidth
                        .available
                    }
                  />

                  <ResourceCard
                    title="TRON Power"
                    icon={Wallet}
                    limit={
                      wallet.tronPower
                        .limit
                    }
                    used={
                      wallet.tronPower
                        .used
                    }
                    available={
                      wallet.tronPower
                        .available
                    }
                  />
                </div>
              </section>
            </>
          ) : null}
        </div>
      </div>
    </AdminDashboard>
  );
}