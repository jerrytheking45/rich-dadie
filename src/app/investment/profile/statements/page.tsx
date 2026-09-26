
"use client";

import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ledgerApi } from "@/src/lib/api/ledger";
import type { LedgerEntry } from "@/src/lib/types/investment";
import { formatCurrency } from "@/src/lib/utils/currency";
import { useSettings } from "@/src/context/useSettings";

const ProfileStatementsPage = () => {
  const router = useRouter();
  const { currency } = useSettings();

  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ledgerApi.getEntries(1, 100);

      setEntries(response.entries);
    } catch (err) {
      console.error("Failed to load ledger entries:", err);
      setError("Unable to load your transaction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialEntries = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ledgerApi.getEntries(1, 100);

        if (cancelled) return;

        setEntries(response.entries);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load ledger entries:", err);
        setError("Unable to load your transaction history.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialEntries();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const createdAt = new Date(entry.createdAt);

      if (Number.isNaN(createdAt.getTime())) {
        return false;
      }

      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);

        if (createdAt < start) {
          return false;
        }
      }

      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999`);

        if (createdAt > end) {
          return false;
        }
      }

      return true;
    });
  }, [entries, startDate, endDate]);

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const getEntryIcon = (type: LedgerEntry["transactionType"]) => {
    if (
      type === "DEPOSIT" ||
      type === "EARNING" ||
      type === "BONUS" ||
      type === "BONUS_UNLOCKED"
    ) {
      return <ArrowDownLeft size={17} aria-hidden="true" />;
    }

    return <ArrowUpRight size={17} aria-hidden="true" />;
  };

  const isCredit = (type: LedgerEntry["transactionType"]) => {
    return (
      type === "DEPOSIT" ||
      type === "EARNING" ||
      type === "BONUS" ||
      type === "BONUS_UNLOCKED"
    );
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute -left-32 top-[42%] h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <main className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        <header className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/investment/profile")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/70 shadow-lg shadow-black/10 transition hover:bg-[#101D33] hover:text-white active:scale-95"
              aria-label="Back to profile"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                Account
              </p>

              <h1 className="mt-0.5 truncate text-[19px] font-extrabold tracking-tight text-white">
                Statements
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadEntries()}
            disabled={loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/60 shadow-lg shadow-black/10 transition hover:bg-[#101D33] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh transactions"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </header>

        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-br from-[#101D33] via-[#0B1426] to-[#11102B] p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/10 text-emerald-400">
              <FileText size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400/70">
                Financial activity
              </p>

              <h2 className="mt-1 text-[17px] font-extrabold text-white">
                Transaction History
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-white/45">
                Review your investment account ledger activity and filter
                transactions by date.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="statement-start-date"
                className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45"
              >
                From
              </label>

              <input
                id="statement-start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/8 bg-[#07101F] px-3 py-3 text-xs font-medium text-white outline-none transition scheme-dark placeholder:text-white/25 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>

            <div>
              <label
                htmlFor="statement-end-date"
                className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45"
              >
                To
              </label>

              <input
                id="statement-end-date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/8 bg-[#07101F] px-3 py-3 text-xs font-medium text-white outline-none transition scheme-dark placeholder:text-white/25 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>
          </div>

          {(startDate || endDate) && (
            <button
              type="button"
              onClick={clearDates}
              className="mt-4 text-[10px] font-bold text-emerald-400 transition hover:text-emerald-300"
            >
              Clear date filter
            </button>
          )}
        </section>

        <section className="mt-5 rounded-[28px] border border-white/8 bg-[#0B1426] p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                Ledger
              </p>

              <h2 className="mt-1 text-[15px] font-extrabold text-white">
                Ledger Entries
              </h2>

              <p className="mt-1 text-[10px] text-white/35">
                {filteredEntries.length} transaction
                {filteredEntries.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#07101F] px-3 py-2">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                Showing
              </p>
              <p className="mt-0.5 text-xs font-bold text-white/75">
                {filteredEntries.length}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-19 animate-pulse rounded-2xl border border-white/5 bg-[#07101F]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-5 rounded-2xl border border-red-400/15 bg-red-400/5 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-red-400/10 text-red-400">
                <RefreshCw size={17} />
              </div>

              <p className="mt-3 text-xs font-semibold text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadEntries()}
                className="mt-4 rounded-xl bg-red-500 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-red-400"
              >
                Try again
              </button>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[#07101F]/60 px-5 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-white/25">
                <FileText size={23} />
              </div>

              <p className="mt-4 text-sm font-bold text-white/70">
                No transactions found
              </p>

              <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-white/35">
                Your real ledger activity will appear here once transactions
                are recorded.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-2.5">
              {filteredEntries.map((entry) => {
                const credit = isCredit(entry.transactionType);

                return (
                  <div
                    key={entry.id}
                    className="group flex items-center gap-3 rounded-2xl border border-white/6 bg-[#07101F]/70 p-3.5 transition hover:border-white/10 hover:bg-[#0D192C]"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        credit
                          ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-400"
                          : "border-purple-400/10 bg-purple-400/10 text-purple-300"
                      }`}
                    >
                      {getEntryIcon(entry.transactionType)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-white/85">
                        {entry.description || entry.transactionType}
                      </p>

                      <p className="mt-1 text-[10px] text-white/35">
                        {new Date(entry.createdAt).toLocaleString("en-UG")}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-xs font-extrabold ${
                          credit ? "text-emerald-400" : "text-white/75"
                        }`}
                      >
                        {credit ? "+" : "-"}
                        {formatCurrency(
                          Math.abs(entry.amount),
                          currency,
                        )}
                      </p>

                      <p className="mt-1 text-[9px] text-white/30">
                        Balance{" "}
                        {formatCurrency(entry.balanceAfter, currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfileStatementsPage;

