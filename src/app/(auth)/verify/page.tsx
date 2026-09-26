
//src/app/(auth)/verify/page.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/components/AuthProvider';

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

const CODE_LENGTH = 6;

export default function VerifyPage() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const router = useRouter();
  const { verify, resendVerification } = useAuth();

  useEffect(() => {
    const email = localStorage.getItem('registration_email');

    if (!email) {
      router.push('/login');
      return;
    }

    inputRefs.current[0]?.focus();
  }, [router]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < CODE_LENGTH) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    setError('');
    setResendMessage('');

    if (!digit) {
      setCode((previous) => {
        const next = [...previous];
        next[index] = '';
        return next;
      });
      return;
    }

    setCode((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    if (index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace') {
      if (code[index]) {
        setCode((previous) => {
          const next = [...previous];
          next[index] = '';
          return next;
        });
        return;
      }

      if (index > 0) {
        setCode((previous) => {
          const next = [...previous];
          next[index - 1] = '';
          return next;
        });

        focusInput(index - 1);
      }

      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH);

    if (!pastedValue) {
      return;
    }

    setError('');
    setResendMessage('');

    setCode((previous) => {
      const next = [...previous];

      for (let i = 0; i < pastedValue.length; i += 1) {
        const targetIndex = index + i;

        if (targetIndex < CODE_LENGTH) {
          next[targetIndex] = pastedValue[i];
        }
      }

      return next;
    });

    const nextFocusIndex = Math.min(
      index + pastedValue.length,
      CODE_LENGTH - 1,
    );

    focusInput(nextFocusIndex);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setResendMessage('');

    const verificationCode = code.join('');

    if (verificationCode.length !== CODE_LENGTH) {
      setError('Please enter the complete 6-digit verification code.');
      focusInput(verificationCode.length);
      return;
    }

    setLoading(true);

    try {
      await verify(verificationCode);

      setSuccess(true);
      localStorage.removeItem('registration_email');
    } catch (err) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          'Verification failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMessage('');

    const email = localStorage.getItem('registration_email');

    if (!email) {
      setError('Your registration session has expired. Please register again.');
      router.push('/register');
      return;
    }

    setResending(true);

    try {
      await resendVerification(email);

      setCode(Array(CODE_LENGTH).fill(''));
      setResendMessage(
        'A new verification code has been sent to your email.',
      );

      focusInput(0);
    } catch (err) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          'Failed to resend the verification code.',
      );
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050B18] px-4 py-10 text-white sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-45 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-40 right-30 h-96 w-96 rounded-full bg-[#F7C948]/8 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-[30px] border border-white/10 bg-[#0B1426]/90 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-emerald-300/20 bg-emerald-400/10">
              <CheckCircle2
                size={32}
                className="text-emerald-300"
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-6 text-2xl font-black tracking-tight sm:text-3xl">
              Email verified
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/45">
              Your email address has been successfully verified. Your account is
              now ready for you to sign in.
            </p>

            <Link
              href="/login"
              className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-[#F7C948] px-5 py-3.5 text-sm font-black text-[#050B18] shadow-lg shadow-[#F7C948]/10 transition hover:-translate-y-0.5 hover:bg-[#FFD96A]"
            >
              Continue to login
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
              <ShieldCheck size={13} className="text-emerald-300" />
              Rich-Dadie Investment
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050B18] px-4 py-8 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-55 h-120 w-120 -translate-x-1/2 rounded-full bg-emerald-400/8 blur-3xl" />
        <div className="absolute bottom-60 left-40 h-110 w-110 rounded-full bg-[#F7C948]/7 blur-3xl" />
        <div className="absolute right-40 top-1/3 h-100 w-100 rounded-full bg-purple-500/6 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-7 flex justify-center">
          <Link
            href="/"
            aria-label="Rich-Dadie home"
            className="group flex items-center gap-3"
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-[15px] bg-white/95 shadow-xl shadow-black/20">
              <Image
                src="/images/logo.png"
                alt="Rich-Dadie"
                fill
                sizes="48px"
                className="object-contain p-1.5"
                priority
              />

              <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
            </div>

            <div className="leading-tight">
              <p className="text-base font-black tracking-tight text-white">
                Rich-Dadie
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Investment
              </p>
            </div>
          </Link>
        </div>

        {/* Verification card */}
        <div className="rounded-[30px] border border-white/10 bg-[#0B1426]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-emerald-300/15 bg-emerald-400/10">
              <MailCheck
                size={27}
                className="text-emerald-300"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300/70">
              Account verification
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Verify your email
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/40">
              Enter the 6-digit verification code we sent to your email address.
            </p>
          </div>

          {error && (
            <div
              id="verification-error"
              role="alert"
              className="mt-6 rounded-2xl border border-red-400/15 bg-red-400/8 px-4 py-3"
            >
              <p className="text-xs font-medium leading-5 text-red-200">
                {error}
              </p>
            </div>
          )}

          {resendMessage && (
            <div
              role="status"
              className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/8 px-4 py-3"
            >
              <p className="text-xs font-medium leading-5 text-emerald-200">
                {resendMessage}
              </p>
            </div>
          )}

          <form className="mt-7" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2.5 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  value={digit}
                  maxLength={1}
                  aria-label={`Verification digit ${index + 1}`}
                  aria-invalid={Boolean(error)}
                  onChange={(event) =>
                    handleChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={(event) => handlePaste(index, event)}
                  disabled={loading}
                  className={[
                    'h-14 w-11 rounded-2xl border text-center text-xl font-black',
                    'outline-none transition-all duration-200',
                    'sm:h-16 sm:w-13 sm:text-2xl',
                    digit
                      ? 'border-emerald-300/40 bg-emerald-300/8 text-white shadow-lg shadow-emerald-400/5'
                      : 'border-white/10 bg-[#07101F] text-white',
                    'placeholder:text-white/10',
                    'focus:border-emerald-300/60 focus:bg-[#091426] focus:ring-4 focus:ring-emerald-300/5',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  ].join(' ')}
                />
              ))}
            </div>

            <p className="mt-3 text-center text-[10px] font-medium text-white/20">
              Enter verfication code here!
            </p>

            <button
              type="submit"
              disabled={loading || code.some((digit) => !digit)}
              className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#F7C948] px-5 text-sm font-black text-[#050B18] shadow-lg shadow-[#F7C948]/10 transition hover:-translate-y-0.5 hover:bg-[#FFD96A] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify email'
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/8 pt-6 text-center">
            <p className="text-xs text-white/30">
              Didn&apos;t receive the code?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 transition hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending && (
                <RefreshCw size={13} className="animate-spin" />
              )}

              {resending ? 'Sending code...' : 'Resend verification code'}
            </button>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/30 transition hover:text-white/70"
            >
              <ArrowLeft size={13} />
              Back to registration
            </Link>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold text-white/20">
          <ShieldCheck size={13} className="text-emerald-300/60" />
          Your verification code is private and should not be shared.
        </div>
      </div>
    </main>
  );
}