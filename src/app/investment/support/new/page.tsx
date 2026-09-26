
'use client';

import {
  ArrowLeft,
  Headphones,
  X,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import CreateSupportTicketForm from '@/src/components/support/CreateSupportTicketForm';
import type {
  SupportTicketCategory,
} from '@/src/lib/types/support';

function isSupportCategory(
  value: string | null,
): value is SupportTicketCategory {
  return (
    value === 'ACCOUNT' ||
    value === 'DEPOSIT' ||
    value === 'INVESTMENT' ||
    value === 'WITHDRAWAL' ||
    value === 'WALLET' ||
    value === 'PAYMENT' ||
    value === 'VERIFICATION' ||
    value === 'SECURITY' ||
    value === 'OTHER'
  );
}

export default function NewSupportTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam =
    searchParams.get('category');

  const investmentId =
    searchParams.get('investmentId');

  const initialCategory =
    useMemo<SupportTicketCategory>(
      () =>
        isSupportCategory(categoryParam)
          ? categoryParam
          : 'OTHER',
      [categoryParam],
    );

  const initialSubject = useMemo(() => {
    if (
      initialCategory !== 'INVESTMENT' ||
      !investmentId
    ) {
      return '';
    }

    return `Issue with investment ${investmentId.slice(
      0,
      8,
    )}`;
  }, [initialCategory, investmentId]);

  const initialMessage = useMemo(() => {
    if (
      initialCategory !== 'INVESTMENT' ||
      !investmentId
    ) {
      return '';
    }

    return `I need help with investment ${investmentId}. Please assist me with this issue.`;
  }, [initialCategory, investmentId]);

  const handleClose = () => {
    router.back();
  };

  const handleCreated = (ticketId: string) => {
    router.replace(
      `/investment/support/tickets/${encodeURIComponent(
        ticketId,
      )}`,
    );
  };

  return (
  <div
    className="fixed inset-0 z-100 flex items-end justify-center bg-[#020611]/80 p-0 backdrop-blur-md sm:items-center sm:p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="new-support-ticket-title"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    }}
  >
    <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-white/7 bg-[#07101F] shadow-2xl shadow-black/50 sm:max-h-[90vh] sm:rounded-[28px]">
      {/* Header */}
      <header className="shrink-0 border-b border-white/6 bg-[#0B1426]">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/6 bg-white/4 text-white/40 transition hover:bg-white/8 hover:text-white"
              aria-label="Close"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10">
              <Headphones
                size={19}
                className="text-emerald-300"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300">
                Rich Dadie Support
              </p>

              <h1
                id="new-support-ticket-title"
                className="truncate text-sm font-black text-white"
              >
                Contact support
              </h1>

              <p className="text-[10px] text-white/30">
                Tell us how we can help
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/6 bg-white/4 text-white/40 transition hover:bg-white/8 hover:text-white"
            aria-label="Close support ticket dialog"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <main className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300">
              New request
            </p>

            <h2 className="mt-2 text-xl font-black tracking-tight text-white">
              Create a support ticket
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-white/35 sm:text-sm">
              Provide enough information for our
              support team to understand and resolve
              your issue.
            </p>
          </div>

          {investmentId &&
            initialCategory === 'INVESTMENT' && (
              <div className="mb-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/7 px-4 py-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-300">
                  Investment issue
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-100/60">
                  This ticket is being created from
                  investment{' '}
                  <span className="font-black text-emerald-200">
                    {investmentId.slice(0, 8)}...
                  </span>
                </p>
              </div>
            )}

          <div className="rounded-3xl border border-white/7 bg-[#0B1426] p-4 shadow-xl shadow-black/10 sm:p-6">
            <CreateSupportTicketForm
              initialCategory={initialCategory}
              initialSubject={initialSubject}
              initialMessage={initialMessage}
              onCreated={handleCreated}
            />
          </div>
        </main>
      </div>
    </div>
  </div>
);
}