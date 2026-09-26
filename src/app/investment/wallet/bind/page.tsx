
/* src/app/investment/profile/wallet/bind/page.tsx */

/* src/app/investment/profile/wallet/bind/page.tsx */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import axios from 'axios';

import { withdrawalApi } from '@/src/lib/api/withdrawal';
import type {
  WithdrawalWalletResponse,
} from '@/src/lib/api/withdrawal';

const PIN_LENGTH = 6;

const ProfileWalletBindPage = () => {
  const router = useRouter();

  const [wallet, setWallet] =
    useState<WithdrawalWalletResponse | null>(null);

  const [address, setAddress] = useState('');
  const [pin, setPin] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getApiError = (
    err: unknown,
    fallback: string,
  ): string => {
    if (axios.isAxiosError(err)) {
      const responseError = err.response?.data?.error;

      if (
        typeof responseError === 'string' &&
        responseError.trim()
      ) {
        return responseError;
      }

      const responseMessage =
        err.response?.data?.message;

      if (
        typeof responseMessage === 'string' &&
        responseMessage.trim()
      ) {
        return responseMessage;
      }

      switch (err.response?.status) {
        case 401:
          return 'Your session has expired. Please sign in again.';

        case 400:
          return 'The wallet address or wallet PIN is invalid.';

        case 404:
          return 'Your withdrawal wallet could not be found.';

        case 409:
          return 'You already have an active withdrawal wallet. You cannot bind another wallet.';

        default:
          break;
      }
    }

    return fallback;
  };

  const isValidPin = (value: string): boolean => {
    return /^\d{6}$/.test(value);
  };

  useEffect(() => {
    let cancelled = false;

    const loadWallet = async () => {
      try {
        const currentWallet =
          await withdrawalApi.getWithdrawalWallet();

        if (cancelled) {
          return;
        }

        setWallet(currentWallet);
        setError('');
      } catch (err) {
        if (cancelled) {
          return;
        }

        if (
          axios.isAxiosError(err) &&
          err.response?.status === 404
        ) {
          setWallet(null);
          setError('');
          return;
        }

        console.error(
          'Failed to load withdrawal wallet:',
          err,
        );

        setWallet(null);
        setError(
          getApiError(
            err,
            'Failed to load your withdrawal wallet.',
          ),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadWallet();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBind = async () => {
    const trimmedAddress = address.trim();
    const trimmedPin = pin.trim();

    setError('');
    setSuccess(false);

    if (wallet) {
      setError(
        'You already have a withdrawal wallet. Unbind your current wallet before binding another one.',
      );
      return;
    }

    if (!trimmedAddress) {
      setError('Wallet address is required.');
      return;
    }

    if (!trimmedAddress.startsWith('T')) {
      setError(
        'Enter a valid TRON wallet address beginning with T.',
      );
      return;
    }

    if (!isValidPin(trimmedPin)) {
      setError(
        'Your wallet PIN must contain exactly 6 digits.',
      );
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const boundWallet =
        await withdrawalApi.bindWithdrawalWallet(
          trimmedAddress,
          trimmedPin,
        );

      setWallet(boundWallet);
      setAddress('');
      setPin('');
      setSuccess(true);
    } catch (err) {
      console.error(
        'Failed to bind withdrawal wallet:',
        err,
      );

      setError(
        getApiError(
          err,
          'Failed to bind withdrawal wallet. Please try again.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------------------
   * Existing wallet
   * ------------------------------------------------------------------------- */

  if (!loading && wallet) {
    return (
      <div className="min-h-screen bg-[#050B18] text-white">
        <main className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
          <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 top-80 h-72 w-72 rounded-full bg-violet-500/8 blur-3xl" />

          <header className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  '/investment/profile/payments',
                )
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/65 shadow-lg transition hover:border-white/15 hover:bg-[#101D33] hover:text-white"
              aria-label="Back to payment wallets"
            >
              <ArrowLeft
                size={18}
                aria-hidden="true"
              />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300/65">
                Withdrawal Security
              </p>

              <h1 className="truncate text-xl font-extrabold tracking-tight text-white">
                Wallet Already Bound
              </h1>

              <p className="text-[10px] text-white/35">
                Only one withdrawal wallet is allowed
              </p>
            </div>
          </header>

          <section className="relative mt-6 overflow-hidden rounded-[28px] border border-emerald-400/12 bg-linear-to-br from-emerald-500/10 via-[#0B1426] to-[#11102B] p-5 shadow-2xl shadow-black/20 sm:p-6">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                  <CheckCircle2
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-white">
                    You already have a withdrawal wallet
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-white/45">
                    Only one active withdrawal wallet can be
                    bound to your account at a time.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-[#07101F] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Current withdrawal address
                </p>

                <p className="mt-2 break-all font-mono text-xs text-white/80">
                  {wallet.address}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-400/10 bg-emerald-400/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    USDT
                  </span>

                  <span className="rounded-full border border-sky-400/10 bg-sky-400/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-sky-300">
                    TRON
                  </span>

                  <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/55">
                    {wallet.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    '/investment/profile/payments',
                  )
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-extrabold text-[#03100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 active:scale-[0.99]"
              >
                Manage Withdrawal Wallet
              </button>
            </div>
          </section>

          <section className="relative mt-4 rounded-2xl border border-white/8 bg-[#0B1426] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-emerald-300/70"
                aria-hidden="true"
              />

              <div>
                <p className="text-xs font-bold text-white/80">
                  Wallet security
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  You cannot bind a second withdrawal wallet.
                  Changing or removing this wallet requires
                  your 6-digit wallet PIN.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  /* ---------------------------------------------------------------------------
   * Loading
   * ------------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B18] text-white">
        <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-5 sm:px-6">
          <header className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  '/investment/profile/payments',
                )
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/65"
              aria-label="Back to payment wallets"
            >
              <ArrowLeft
                size={18}
                aria-hidden="true"
              />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300/65">
                Withdrawal Security
              </p>

              <h1 className="truncate text-xl font-extrabold text-white">
                Bind Withdrawal Wallet
              </h1>
            </div>
          </header>

          <section className="mt-6 rounded-[26px] border border-white/8 bg-[#0B1426] p-10 shadow-2xl shadow-black/15">
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/8">
                <Loader2
                  size={19}
                  className="animate-spin text-emerald-300"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-white/70">
                Checking withdrawal wallet...
              </p>

              <p className="mt-1 text-[10px] text-white/30">
                Securing your wallet settings
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  /* ---------------------------------------------------------------------------
   * Render bind form
   * ------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <main className="relative mx-auto w-full max-w-xl overflow-hidden px-4 pb-28 pt-5 sm:px-6">
        <div className="pointer-events-none absolute -right-32 top-24 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-96 h-64 w-64 rounded-full bg-emerald-500/7 blur-3xl" />

        <header className="relative flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                '/investment/profile/payments',
              )
            }
            disabled={submitting}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[#0B1426] text-white/65 shadow-lg transition hover:border-white/15 hover:bg-[#101D33] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Back to payment wallets"
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
            />
          </button>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300/65">
              Withdrawal Security
            </p>

            <h1 className="truncate text-xl font-extrabold text-white">
              Bind Withdrawal Wallet
            </h1>

            <p className="text-[10px] text-white/35">
              USDT on TRON only
            </p>
          </div>
        </header>

        {/* Security explanation */}
        <section className="relative mt-6 overflow-hidden rounded-[26px] border border-emerald-400/10 bg-linear-to-br from-emerald-400/8 via-[#0B1426] to-[#11102B] p-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/8 blur-3xl" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/12 bg-emerald-400/8 text-emerald-300">
              <ShieldCheck
                size={20}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">
                Withdrawal wallet security
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/40">
                Your withdrawal wallet is protected by your
                6-digit wallet PIN. The PIN is required
                whenever you bind, change, or unbind your
                withdrawal wallet.
              </p>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-400/15 bg-red-500/8 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                <span className="text-xs font-black">!</span>
              </div>

              <p className="pt-1 text-xs font-semibold leading-5 text-red-200">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {success && wallet && (
          <section
            role="status"
            className="mt-4 overflow-hidden rounded-[26px] border border-emerald-400/12 bg-linear-to-br from-emerald-500/10 via-[#0B1426] to-[#11102B] p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10">
                <CheckCircle2
                  size={20}
                  className="text-emerald-300"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-white">
                  Withdrawal wallet bound successfully
                </p>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  This is now your only active withdrawal
                  destination.
                </p>

                <div className="mt-4 rounded-2xl border border-white/8 bg-[#07101F] p-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300/65">
                    Withdrawal Address
                  </p>

                  <p className="mt-2 break-all font-mono text-xs text-white/80">
                    {wallet.address}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/investment/profile/payments',
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-extrabold text-[#03100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
            >
              Manage Withdrawal Wallet
            </button>
          </section>
        )}

        {/* Form */}
        {!success && (
          <section className="relative mt-5 rounded-[28px] border border-white/8 bg-[#0B1426] p-5 shadow-2xl shadow-black/15 sm:p-6">
            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-300/60">
                Wallet Setup
              </p>

              <h2 className="mt-1 text-base font-extrabold text-white">
                Connect withdrawal wallet
              </h2>

              <p className="mt-1 text-[10px] leading-4 text-white/30">
                Make sure the address belongs to a wallet you control.
              </p>
            </div>

            <div className="space-y-5">
              {/* Asset */}
              <div>
                <p className="text-xs font-bold text-white/75">
                  Asset
                </p>

                <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/7 bg-[#07101F] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/8">
                      <Wallet
                        size={17}
                        className="text-emerald-300"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-white">
                        USDT
                      </p>

                      <p className="mt-0.5 text-[11px] text-white/30">
                        Tether USD
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-400/10 bg-emerald-400/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    Supported
                  </span>
                </div>
              </div>

              {/* Network */}
              <div>
                <p className="text-xs font-bold text-white/75">
                  Network
                </p>

                <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/7 bg-[#07101F] p-4">
                  <div>
                    <p className="text-sm font-extrabold text-white">
                      TRON
                    </p>

                    <p className="mt-0.5 text-[11px] text-white/30">
                      USDT-TRC20
                    </p>
                  </div>

                  <span className="rounded-full border border-sky-400/10 bg-sky-400/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-sky-300">
                    Supported
                  </span>
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="withdrawal-address"
                  className="text-xs font-bold text-white/75"
                >
                  USDT TRON Wallet Address
                </label>

                <input
                  id="withdrawal-address"
                  type="text"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                    setError('');
                  }}
                  placeholder="Enter your TRON wallet address"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={submitting}
                  className="mt-2 w-full rounded-2xl border border-white/8 bg-[#07101F] p-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/40 focus:bg-[#091423] focus:ring-4 focus:ring-emerald-400/5 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <p className="mt-2 text-[10px] leading-4 text-white/25">
                  Only USDT-TRC20 addresses are supported.
                  TRON addresses begin with T.
                </p>
              </div>

              {/* PIN */}
              <div>
                <label
                  htmlFor="withdrawal-pin"
                  className="text-xs font-bold text-white/75"
                >
                  6-Digit Wallet PIN
                </label>

                <input
                  id="withdrawal-pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={PIN_LENGTH}
                  value={pin}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        '',
                      );

                    setPin(value);
                    setError('');
                  }}
                  placeholder="••••••"
                  autoComplete="off"
                  disabled={submitting}
                  className="mt-2 w-full rounded-2xl border border-white/8 bg-[#07101F] p-3.5 text-center text-lg font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-white/15 focus:border-emerald-400/40 focus:bg-[#091423] focus:ring-4 focus:ring-emerald-400/5 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <p className="mt-2 text-[10px] leading-4 text-white/25">
                  Your 6-digit wallet PIN protects your
                  assets and wallet.
                </p>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleBind}
                disabled={
                  submitting ||
                  !address.trim() ||
                  pin.length !== PIN_LENGTH
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-extrabold text-[#03100B] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Binding Wallet...
                  </>
                ) : (
                  <>
                    <Plus
                      size={17}
                      aria-hidden="true"
                    />
                    Bind Withdrawal Wallet
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* Safety notice */}
        <section className="relative mt-4 rounded-2xl border border-white/8 bg-[#0B1426] p-4">
          <div className="flex items-start gap-3">
            <Wallet
              size={18}
              className="mt-0.5 shrink-0 text-white/40"
              aria-hidden="true"
            />

            <div>
              <p className="text-xs font-bold text-white/75">
                Important
              </p>

              <p className="mt-1 text-[10px] leading-5 text-white/30">
                Only bind a TRON wallet that you control.
                Your withdrawal wallet is the authoritative
                destination for withdrawals. You cannot bind
                a second wallet while one is active.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfileWalletBindPage;