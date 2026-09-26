
//src/app/investment/investments/[investmentId]/deposit/page.tsx

'use client';

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  History,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react';

import { investmentApi } from '@/src/lib/api/investmentApi';
import { useSettings } from '@/src/context/useSettings';
import { formatUSDT } from '@/src/lib/utils/currency';

import type {
  Deposit,
  Investment,
} from '@/src/lib/types/investment';

const SUBMISSION_COOLDOWN_SECONDS = 60;

export default function InvestmentDepositPage() {
  const router = useRouter();

  const { investmentId } =
    useParams<{ investmentId: string }>();

  const { currency } = useSettings();

  const [investment, setInvestment] =
    useState<Investment | null>(null);

  const [deposit, setDeposit] =
    useState<Deposit | null>(null);

  const [history, setHistory] =
    useState<Deposit[]>([]);

  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);
  const [cooldownSeconds, setCooldownSeconds] =
    useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addressCopied, setAddressCopied] =
    useState(false);

  const copyResetTimerRef =
    useRef<number | null>(null);

  const cooldownTimerRef =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(
          copyResetTimerRef.current,
        );
      }

      if (cooldownTimerRef.current !== null) {
        window.clearInterval(
          cooldownTimerRef.current,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!investmentId) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const [
          investmentData,
          depositData,
          depositsData,
        ] = await Promise.all([
          investmentApi.getInvestment(investmentId),
          investmentApi.getDeposit(investmentId),
          investmentApi.getDeposits(1, 50),
        ]);

        if (cancelled) {
          return;
        }

        setInvestment(investmentData);
        setDeposit(depositData);

        setHistory(
          depositsData.deposits.filter(
            (item) =>
              item.investmentId ===
              investmentId,
          ),
        );

        setTxHash((current) =>
          current || depositData.txHash || '',
        );
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load investment deposit:',
          err,
        );

        setError(
          err instanceof Error && err.message
            ? err.message
            : 'Failed to load investment deposit.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    queueMicrotask(() => {
      if (!cancelled) {
        void load();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [investmentId]);

  useEffect(() => {
    if (!investmentId) {
      return;
    }

    let cancelled = false;

    const refreshInvestmentStatus =
      async () => {
        try {
          const [
            investmentData,
            depositData,
          ] = await Promise.all([
            investmentApi.getInvestment(
              investmentId,
            ),
            investmentApi.getDeposit(
              investmentId,
            ),
          ]);

          if (cancelled) {
            return;
          }

          setInvestment(investmentData);
          setDeposit(depositData);

          setTxHash((current) =>
            current || depositData.txHash || '',
          );
        } catch (err: unknown) {
          console.error(
            'Silent investment status refresh failed:',
            err,
          );
        }
      };

    const intervalId = window.setInterval(
      () => {
        void refreshInvestmentStatus();
      },
      5000,
    );

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [investmentId]);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      if (cooldownTimerRef.current !== null) {
        window.clearInterval(
          cooldownTimerRef.current,
        );

        cooldownTimerRef.current = null;
      }

      return;
    }

    if (cooldownTimerRef.current !== null) {
      window.clearInterval(
        cooldownTimerRef.current,
      );
    }

    cooldownTimerRef.current =
      window.setInterval(() => {
        setCooldownSeconds((current) => {
          if (current <= 1) {
            if (
              cooldownTimerRef.current !== null
            ) {
              window.clearInterval(
                cooldownTimerRef.current,
              );

              cooldownTimerRef.current = null;
            }

            return 0;
          }

          return current - 1;
        });
      }, 1000);

    return () => {
      if (cooldownTimerRef.current !== null) {
        window.clearInterval(
          cooldownTimerRef.current,
        );

        cooldownTimerRef.current = null;
      }
    };
  }, [cooldownSeconds]);

  const handleCopyDepositAddress =
    async () => {
      const address =
        deposit?.companyDepositAddress?.trim();

      if (!address) {
        setError(
          'The deposit address is unavailable.',
        );
        return;
      }

      try {
        await navigator.clipboard.writeText(
          address,
        );

        setAddressCopied(true);
        setSuccess('Address copied.');
        setError('');

        if (
          copyResetTimerRef.current !== null
        ) {
          window.clearTimeout(
            copyResetTimerRef.current,
          );
        }

        copyResetTimerRef.current =
          window.setTimeout(() => {
            setAddressCopied(false);
          }, 2000);
      } catch (err: unknown) {
        console.error(
          'Failed to copy deposit address:',
          err,
        );

        setAddressCopied(false);
        setError(
          'Unable to copy the deposit address.',
        );
        setSuccess('');
      }
    };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      submitting ||
      cooldownSeconds > 0
    ) {
      return;
    }

    const normalizedTxHash = txHash.trim();

    if (!normalizedTxHash) {
      setError('Enter the transaction hash.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const updatedDeposit =
        await investmentApi.submitDeposit(
          investmentId,
          normalizedTxHash,
        );

      setDeposit(updatedDeposit);

      setSuccess(
        'Your transaction has been submitted for verification. Please wait while the transaction is verified.',
      );

      /*
       * Start the one-minute submission cooldown
       * only after the API accepts the submission.
       */
      setCooldownSeconds(
        SUBMISSION_COOLDOWN_SECONDS,
      );

      const updatedInvestment =
        await investmentApi.getInvestment(
          investmentId,
        );

      setInvestment(updatedInvestment);

      const deposits =
        await investmentApi.getDeposits(
          1,
          50,
        );

      setHistory(
        deposits.deposits.filter(
          (item) =>
            item.investmentId ===
            investmentId,
        ),
      );
    } catch (err: unknown) {
      console.error(
        'Investment deposit submission failed:',
        err,
      );

      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to submit the transaction hash.';

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!investmentId) {
    return (
      <PageShell>
        <ErrorState
          message="Invalid investment ID."
          onBack={() =>
            router.push(
              '/investment/investments',
            )
          }
        />
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={25}
              className="mx-auto animate-spin text-emerald-300"
            />

            <p className="mt-3 text-sm text-white/35">
              Loading deposit...
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!investment || !deposit) {
    return (
      <PageShell>
        <ErrorState
          message={
            error ||
            'Investment deposit could not be found.'
          }
          onBack={() =>
            router.push(
              `/investment/investments/${investmentId}`,
            )
          }
        />
      </PageShell>
    );
  }

  const isCompleted =
    deposit.status === 'CONFIRMED' ||
    investment.status === 'ACTIVE' ||
    investment.status === 'MATURED';

  const canSubmit =
    !isCompleted &&
    deposit.status !== 'CONFIRMED';

  const submissionLocked =
    submitting || cooldownSeconds > 0;

  return (
    <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/investment/investments/${investmentId}`,
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
            aria-label="Back to investment"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
              Investment deposit
            </p>

            <h1 className="truncate text-[18px] font-extrabold text-white">
              Complete Deposit
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(
              '/investment/investments',
            )
          }
          className="shrink-0 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-[10px] font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          My Investments
        </button>
      </header>

      {/* Investment summary */}
      <section className="mt-5 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
              Investment
            </p>

            <h2 className="mt-1 truncate text-lg font-extrabold text-white">
              {investment.planName ||
                'Investment Plan'}
            </h2>

            <p className="mt-1 break-all text-[9px] text-white/25">
              {investment.id}
            </p>
          </div>

          <StatusBadge
            status={deposit.status}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/6 bg-white/4 p-3">
            <p className="text-[9px] text-white/30">
              Investment amount
            </p>

            <p className="mt-1 text-sm font-extrabold text-white">
              {formatUSDT(
                investment.amount,
                currency,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/6 bg-white/4 p-3">
            <p className="text-[9px] text-white/30">
              Expected deposit
            </p>

            <p className="mt-1 text-sm font-extrabold text-white">
              {formatUSDT(
                deposit.expectedAmount,
                currency,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Success */}
      {success && (
        <section className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/8 p-4">
          <div className="flex gap-3">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-300"
            />

            <p className="text-xs leading-5 text-emerald-200">
              {success}
            </p>
          </div>
        </section>
      )}

      {/* Error */}
      {error && (
        <section className="mt-4 rounded-2xl border border-red-400/15 bg-red-400/8 p-4">
          <div className="flex gap-3">
            <XCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-300"
            />

            <p className="text-xs leading-5 text-red-200">
              {error}
            </p>
          </div>
        </section>
      )}

      {/* Completed */}
      {isCompleted ? (
        <section className="mt-4 rounded-[26px] border border-emerald-400/15 bg-emerald-400/7 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-emerald-200">
                Deposit completed
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-emerald-100/50">
                This investment deposit has been
                confirmed. No further transaction
                submission is required.
              </p>
            </div>
          </div>

          {deposit.txHash && (
            <div className="mt-4 rounded-xl border border-white/7 bg-[#07101F] p-3">
              <p className="text-[9px] text-white/30">
                Transaction hash
              </p>

              <p className="mt-1 break-all font-mono text-[10px] text-white/65">
                {deposit.txHash}
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Submission */}
          <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8 text-emerald-300">
                <Wallet size={19} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-white">
                  Submit your transaction
                </h2>

                <p className="text-[10px] text-white/30">
                  Enter the TRON transaction hash
                  for your investment deposit.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-purple-400/10 bg-purple-400/6 p-3">
              <p className="text-[10px] font-bold text-purple-200">
                Need to retry?
              </p>

              <p className="mt-1 text-[10px] leading-5 text-purple-100/45">
                You can submit the original transaction
                hash again if it was entered incorrectly,
                or replace it with the correct transaction
                hash.
              </p>
            </div>

            {/* Deposit address */}
            <section className="mt-4 rounded-[22px] border border-purple-400/15 bg-purple-400/6 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/10 bg-white/5 text-purple-300">
                  <Wallet size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-white">
                    Send USDT to this address
                  </h2>

                  <p className="text-[10px] text-white/35">
                    Send exactly the required amount on
                    the TRON network.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/8 bg-[#07101F] p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
                  TRON deposit address
                </p>

                <p className="mt-2 break-all font-mono text-[11px] font-bold text-white/80">
                  {deposit.companyDepositAddress}
                </p>

                <button
                  type="button"
                  onClick={
                    handleCopyDepositAddress
                  }
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition ${
                    addressCopied
                      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15'
                      : 'border-white/8 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-live="polite"
                >
                  {addressCopied ? (
                    <>
                      <CheckCircle2
                        size={15}
                        className="text-emerald-300"
                      />
                      <span>Address copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>
                        Copy deposit address
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-3 text-[9px] leading-4 text-purple-100/55">
                Only send TRC20 USDT on the TRON network
                to this address. Sending another token or
                using another network may cause the deposit
                to fail verification.
              </p>
            </section>

            <form
              onSubmit={handleSubmit}
              className="mt-4"
            >
              <label
                htmlFor="tx-hash"
                className="text-[10px] font-bold text-white/65"
              >
                TRON transaction hash
              </label>

              <textarea
                id="tx-hash"
                value={txHash}
                onChange={(event) =>
                  setTxHash(event.target.value)
                }
                placeholder="Paste your TRON transaction hash"
                rows={4}
                disabled={submissionLocked}
                className="mt-2 w-full resize-none rounded-xl border border-white/8 bg-[#07101F] px-3 py-3 font-mono text-[11px] text-white outline-none transition placeholder:font-sans placeholder:text-white/20 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-[9px] leading-4 text-white/25">
                Make sure this transaction was sent on
                the TRON network and matches the required
                deposit amount.
              </p>

              <button
                type="submit"
                disabled={
                  submissionLocked ||
                  !txHash.trim() ||
                  !canSubmit
                }
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white transition ${
                  submissionLocked
                    ? 'cursor-not-allowed border border-white/8 bg-white/10 text-white/40'
                    : 'bg-emerald-500 hover:bg-emerald-400'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Submitting...
                  </>
                ) : cooldownSeconds > 0 ? (
                  <>
                    <Clock3 size={15} />
                    Submitted — wait{' '}
                    {cooldownSeconds}s
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} />
                    Submit Transaction
                  </>
                )}
              </button>

              {cooldownSeconds > 0 && (
                <div className="mt-3 rounded-xl border border-purple-400/10 bg-purple-400/5 px-3 py-2.5 text-center">
                  <p className="text-[9px] leading-4 text-purple-200/70">
                    Your transaction is being checked.
                    Please wait{' '}
                    <span className="font-bold text-purple-200">
                      {cooldownSeconds} seconds
                    </span>{' '}
                    before submitting again.
                  </p>
                </div>
              )}
            </form>
          </section>

          {/* Current deposit */}
          <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-white">
                  Current Deposit
                </h2>

                <p className="mt-0.5 text-[9px] text-white/25">
                  Deposit record attached to this
                  investment
                </p>
              </div>

              <ShieldCheck
                size={19}
                className="text-emerald-300"
              />
            </div>

            <div className="mt-4 space-y-2">
              <DetailRow
                label="Deposit ID"
                value={deposit.id}
                mono
              />

              <DetailRow
                label="Status"
                value={deposit.status}
              />

              <DetailRow
                label="Expected amount"
                value={formatUSDT(
                  deposit.expectedAmount,
                  currency,
                )}
              />

              {deposit.txHash && (
                <DetailRow
                  label="Transaction"
                  value={deposit.txHash}
                  mono
                />
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/investment/profile/deposit/${deposit.id}`,
                )
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-xs font-bold text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              View deposit details
              <ExternalLink size={14} />
            </button>
          </section>
        </>
      )}

      {/* Deposit history */}
      <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0B1426] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/55">
            <History size={18} />
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-white">
              Deposit History
            </h2>

            <p className="text-[9px] text-white/25">
              Previous deposit attempts for this
              investment
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="mt-4 rounded-xl border border-white/6 bg-white/4 p-4 text-center">
            <p className="text-[10px] text-white/30">
              No previous deposit records found.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  router.push(
                    `/investment/profile/deposit/${item.id}`,
                  )
                }
                className="w-full rounded-xl border border-white/6 bg-white/4 p-3 text-left transition hover:border-white/10 hover:bg-white/7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-white/30">
                      Deposit
                    </p>

                    <p className="mt-1 truncate font-mono text-[10px] text-white/60">
                      {item.id}
                    </p>
                  </div>

                  <StatusBadge
                    status={item.status}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] text-white/25">
                    Amount
                  </span>

                  <span className="text-xs font-extrabold text-white/80">
                    {formatUSDT(
                      item.expectedAmount,
                      currency,
                    )}
                  </span>
                </div>

                {item.txHash && (
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="shrink-0 text-[9px] text-white/25">
                      TXID
                    </span>

                    <span className="truncate font-mono text-[9px] text-white/35">
                      {item.txHash}
                    </span>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-end gap-1 text-[9px] font-bold text-emerald-300">
                  View deposit
                  <ExternalLink size={11} />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Verification */}
      <section className="mt-4 rounded-[22px] border border-white/8 bg-[#0B1426] p-4">
        <div className="flex gap-3">
          <Clock3
            size={18}
            className="mt-0.5 shrink-0 text-white/40"
          />

          <div>
            <p className="text-xs font-bold text-white/75">
              Verification
            </p>

            <p className="mt-1 text-[10px] leading-5 text-white/30">
              After submission, the transaction is
              checked on the blockchain. Keep the
              transaction hash available until
              verification is complete.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function PageShell({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="relative">{children}</div>;
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toUpperCase();

  const isSuccess =
    normalized === 'CONFIRMED' ||
    normalized === 'COMPLETED';

  const isFailed =
    normalized === 'FAILED' ||
    normalized === 'CANCELLED';

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold ${
        isSuccess
          ? 'border-emerald-400/15 bg-emerald-400/8 text-emerald-300'
          : isFailed
            ? 'border-red-400/15 bg-red-400/8 text-red-300'
            : 'border-purple-400/15 bg-purple-400/8 text-purple-300'
      }`}
    >
      {status}
    </span>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/4 px-3 py-3">
      <div className="flex items-start justify-between gap-4">
        <span className="shrink-0 text-[9px] text-white/25">
          {label}
        </span>

        <span
          className={`break-all text-right text-[10px] font-bold text-white/60 ${
            mono ? 'font-mono' : ''
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onBack,
}: {
  message: string;
  onBack: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
      <div className="w-full rounded-[26px] border border-white/8 bg-[#0B1426] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-2xl">
          📦
        </div>

        <h1 className="mt-4 text-lg font-extrabold text-white">
          Deposit unavailable
        </h1>

        <p className="mt-1 text-xs leading-5 text-white/35">
          {message}
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-400"
        >
          Back to investment
        </button>
      </div>
    </main>
  );
}