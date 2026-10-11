
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  TrendingUp,
  X,
} from "lucide-react";

interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  last_updated: string | null;
}

interface MarketResponse {
  coins: MarketCoin[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  fetchedAt: string;
  source: string;
  currency: string;
}

const REFRESH_INTERVAL = 60_000;

function formatPrice(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  const decimals =
    value >= 1 ? 2 :
    value >= 0.01 ? 4 :
    value >= 0.0001 ? 6 : 8;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatCompact(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatChange(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return `${Math.abs(value).toFixed(2)}%`;
}

export default function LiveCryptoMarket() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [market, setMarket] =
    useState<MarketResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState("");

  const fetchMarket = useCallback(
    async (signal?: AbortSignal) => {
      const response = await fetch(
        `/api/crypto/market?page=${page}`,
        {
          signal,
          cache: "no-store",
        }
      );

      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Unable to load market prices.";

        throw new Error(message);
      }

      return payload as MarketResponse;
    },
    [page]
  );

  /* ==========================================
     INITIAL LOAD + PAGE CHANGES
  ========================================== */

  useEffect(() => {
    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      const load = async () => {
        setLoading(true);
        setError("");

        try {
          const data = await fetchMarket(controller.signal);

          if (controller.signal.aborted) return;

          setMarket(data);
          setLastRefresh(new Date().toISOString());
        } catch (err) {
          if (controller.signal.aborted) return;

          setMarket(null);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load market prices."
          );
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      };

      void load();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [fetchMarket]);

  /* ==========================================
     PERIODIC REFRESH
  ========================================== */

  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false;

    const refresh = async () => {
      if (
        document.visibilityState === "hidden" ||
        inFlight
      ) {
        return;
      }

      inFlight = true;

      try {
        const data = await fetchMarket(controller.signal);

        if (controller.signal.aborted) return;

        setMarket(data);
        setLastRefresh(new Date().toISOString());
        setError("");
      } catch (err) {
        if (controller.signal.aborted) return;

        // Keep existing data visible but mark it as stale.
        setError(
          err instanceof Error
            ? err.message
            : "Unable to refresh market prices."
        );
      } finally {
        inFlight = false;
      }
    };

    const interval = window.setInterval(() => {
      void refresh();
    }, REFRESH_INTERVAL);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [fetchMarket]);

  /* ==========================================
     MANUAL REFRESH
  ========================================== */

  const handleRefresh = async () => {
    if (refreshing || loading) return;

    setRefreshing(true);

    try {
      const data = await fetchMarket();

      setMarket(data);
      setLastRefresh(new Date().toISOString());
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh market prices."
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* ==========================================
     SEARCH CURRENT PAGE
  ========================================== */

  const query = search.trim().toLowerCase();

  const filteredCoins =
    market?.coins.filter((coin) => {
      if (!query) return true;

      return (
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
      );
    }) ?? [];

  const updatedTime = lastRefresh
    ? new Date(lastRefresh).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "";

  return (
    <section
      aria-labelledby="live-crypto-market-title"
      className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] shadow-lg shadow-black/10"
    >
      {/* REDIQ TOP ACCENT */}
      <div
        aria-hidden="true"
        className="h-0.5 bg-linear-to-r from-[#E60033] via-[#FF476B]/50 to-transparent"
      />

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-wrap items-start justify-between gap-3 px-3.5 pt-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
              <TrendingUp size={16} aria-hidden="true" />
            </div>

            <div>
              <h2
                id="live-crypto-market-title"
                className="text-sm font-black text-white sm:text-base"
              >
                Live Crypto Market
              </h2>

              <p className="mt-0.5 text-[10px] text-white/40">
                Cryptocurrency prices and market trends
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1.5 text-[9px] font-bold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Market data
          </span>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={loading || refreshing}
            aria-label="Refresh crypto prices"
            title="Refresh market"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition hover:border-[#E60033]/30 hover:text-[#FF476B] disabled:opacity-40"
          >
            <RefreshCw
              size={14}
              className={
                loading || refreshing ? "animate-spin" : ""
              }
            />
          </button>
        </div>
      </div>

      {/* =====================================
          SEARCH + UPDATE INFORMATION
      ====================================== */}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-5">
        <div className="relative w-full sm:max-w-67.5">
          <Search
            size={14}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search this page..."
            aria-label="Search cryptocurrency on current page"
            className="h-9 w-full rounded-lg border border-white/10 bg-[#07101F] py-2 pl-9 pr-8 text-[11px] text-white outline-none placeholder:text-white/30 focus:border-[#E60033]/50"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-white/45 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <p className="text-[9px] text-white/35">
          {updatedTime
            ? `Checked at ${updatedTime}`
            : "Prices in USD"}
        </p>
      </div>

      {/* =====================================
          ERROR STATE
      ====================================== */}

      {error && (
        <div
          role="alert"
          className="mx-3.5 mt-3 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-[10px] leading-4 text-red-200 sm:mx-5"
        >
          {error}
          {market && (
            <span className="block pt-1 text-red-200/70">
              Previously loaded prices are shown below and
              may be outdated.
            </span>
          )}
        </div>
      )}

      {/* =====================================
          MARKET TABLE
      ====================================== */}

      <div className="mt-3 w-full overflow-x-auto">
        <table className="w-full min-w-170 border-collapse text-left">
          <thead>
            <tr className="border-y border-white/8 bg-[#07101F]/55 text-[9px] font-semibold text-white/40">
              <th className="w-10 px-3 py-3 font-semibold sm:px-5">
                #
              </th>

              <th className="px-2 py-3 font-semibold">
                Cryptocurrency
              </th>

              <th className="px-2 py-3 text-right font-semibold">
                Price
              </th>

              <th className="px-2 py-3 text-right font-semibold">
                24h %
              </th>

              <th className="px-2 py-3 text-right font-semibold">
                Market cap
              </th>

              <th className="px-3 py-3 text-right font-semibold sm:px-5">
                Volume (24h)
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5.5">
            {loading ? (
              Array.from({ length: 6 }, (_, index) => (
                <tr key={index}>
                  <td colSpan={6} className="px-3 py-2.5">
                    <div className="h-9 animate-pulse rounded-lg bg-white/5" />
                  </td>
                </tr>
              ))
            ) : filteredCoins.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[11px] text-white/45"
                >
                  {query
                    ? "No matching coins on this page. Try another page."
                    : error
                    ? "Market data is currently unavailable."
                    : "No cryptocurrencies available on this page."}
                </td>
              </tr>
            ) : (
              filteredCoins.map((coin) => {
                const change =
                  coin.price_change_percentage_24h;

                const positive =
                  change !== null && change >= 0;

                const negative =
                  change !== null && change < 0;

                return (
                  <tr
                    key={coin.id}
                    className="transition-colors hover:bg-white/2.5"
                  >
                    {/* Rank */}
                    <td className="px-3 py-3 text-[10px] text-white/35 sm:px-5">
                      {coin.market_cap_rank ?? "—"}
                    </td>

                    {/* Coin */}
                    <td className="px-2 py-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        {coin.image ? (
                          <Image
                            src={coin.image}
                            alt=""
                            width={27}
                            height={27}
                            unoptimized
                            className="h-6.75 w-6.75 shrink-0 rounded-full object-contain"
                          />
                        ) : (
                          <div className="flex h-6.75 w-6.75 shrink-0 items-center justify-center rounded-full bg-[#E60033]/10 text-[10px] font-black text-[#FF476B]">
                            {coin.symbol.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="max-w-37.5 truncate text-[11px] font-bold text-white">
                            {coin.name}
                          </p>

                          <p className="mt-0.5 text-[9px] font-semibold uppercase text-white/35">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* USD Price */}
                    <td className="whitespace-nowrap px-2 py-3 text-right text-[11px] font-bold text-white tabular-nums">
                      {formatPrice(coin.current_price)}
                    </td>

                    {/* 24-hour change */}
                    <td className="whitespace-nowrap px-2 py-3 text-right">
                      <span
                        className={[
                          "inline-flex items-center justify-end gap-0.5 text-[10px] font-bold tabular-nums",
                          positive
                            ? "text-emerald-300"
                            : negative
                            ? "text-red-400"
                            : "text-white/40",
                        ].join(" ")}
                      >
                        {change !== null &&
                          (positive ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          ))}

                        {formatChange(change)}
                      </span>
                    </td>

                    {/* Market cap */}
                    <td className="whitespace-nowrap px-2 py-3 text-right text-[10px] font-medium text-white/65 tabular-nums">
                      {coin.market_cap === null
                        ? "—"
                        : `$${formatCompact(coin.market_cap)}`}
                    </td>

                    {/* Trading volume */}
                    <td className="whitespace-nowrap px-3 py-3 text-right text-[10px] font-medium text-white/65 tabular-nums sm:px-5">
                      {coin.total_volume === null
                        ? "—"
                        : `$${formatCompact(coin.total_volume)}`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================
          PAGINATION
      ====================================== */}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/8 px-3.5 py-3 sm:px-5">
        <div>
          <p className="text-[10px] font-semibold text-white/60">
            Market cap rankings
          </p>

          <p className="mt-0.5 text-[9px] text-white/35">
            Page {page} • Up to 20 coins per page
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPage((current) => Math.max(1, current - 1));
            }}
            disabled={page === 1 || loading}
            aria-label="Previous market page"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/65 transition hover:border-[#E60033]/25 hover:text-[#FF476B] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          <span className="min-w-8 text-center text-[11px] font-black text-white tabular-nums">
            {page}
          </span>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPage((current) => current + 1);
            }}
            disabled={
              loading ||
              !market?.hasMore ||
              page >= 100
            }
            aria-label="Next market page"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/65 transition hover:border-[#E60033]/25 hover:text-[#FF476B] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* PROVIDER CREDIT */}
      <div className="border-t border-white/8 bg-[#07101F]/40 px-3.5 py-2.5 text-center sm:px-5">
        <p className="text-[9px] leading-4 text-white/35">
          Market information provided by{" "}
          <a
            href="https://www.coingecko.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#FF476B] hover:underline"
          >
            CoinGecko
          </a>
          . Prices are indicative and may be delayed.
        </p>
      </div>
    </section>
  );
}