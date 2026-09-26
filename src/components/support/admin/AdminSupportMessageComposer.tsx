
'use client';

import {
  useState,
} from 'react';
import type { FormEvent } from 'react';
import {
  Loader2,
  MessageSquare,
  Send,
  Shield,
} from 'lucide-react';

interface AdminSupportMessageComposerProps {
  disabled?: boolean;
  sending?: boolean;
  onSend: (
    message: string,
    isInternal: boolean,
  ) => Promise<void> | void;
}

const MAX_MESSAGE_LENGTH = 10_000;

export default function AdminSupportMessageComposer({
  disabled = false,
  sending = false,
  onSend,
}: AdminSupportMessageComposerProps) {
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const trimmedMessage =
    message.trim();

  const remainingCharacters =
    MAX_MESSAGE_LENGTH -
    message.length;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (disabled || sending) {
      return;
    }

    if (!trimmedMessage) {
      setError('Message cannot be empty.');
      return;
    }

    if (
      message.length >
      MAX_MESSAGE_LENGTH
    ) {
      setError(
        `Message cannot exceed ${MAX_MESSAGE_LENGTH.toLocaleString()} characters.`,
      );
      return;
    }

    setError(null);

    try {
      await onSend(
        trimmedMessage,
        isInternal,
      );

      setMessage('');
    } catch {
      // Parent displays the API error.
    }
  };

  const shellTone = error
    ? 'border-red-400/30 focus-within:ring-2 focus-within:ring-red-400/10'
    : isInternal
      ? 'border-amber-400/25 focus-within:ring-2 focus-within:ring-amber-400/10'
      : 'border-white/10 focus-within:border-emerald-400/25 focus-within:ring-2 focus-within:ring-emerald-400/10';

  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#0B1426] via-[#0B1426] to-[#11102B] shadow-2xl shadow-black/10">
      <div className="border-b border-white/8 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Reply to customer
            </h2>

            <p className="mt-1 text-sm leading-5 text-white/35">
              Send a response or add a private staff note.
            </p>
          </div>

          <div
            className={[
              'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5',
              'text-[10px] font-bold uppercase tracking-widest',
              isInternal
                ? 'border-amber-400/15 bg-amber-400/10 text-amber-300'
                : 'border-emerald-400/15 bg-emerald-400/10 text-emerald-300',
            ].join(' ')}
          >
            {isInternal ? (
              <Shield size={13} />
            ) : (
              <MessageSquare size={13} />
            )}

            {isInternal
              ? 'Internal note'
              : 'Customer reply'}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6"
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setIsInternal(false)
            }
            disabled={
              disabled || sending
            }
            className={[
              'inline-flex items-center gap-2 rounded-xl px-3 py-2',
              'text-sm font-semibold transition',
              !isInternal
                ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                : 'border border-white/10 bg-white/5 text-white/45 hover:bg-white/8 hover:text-white/70',
              'disabled:cursor-not-allowed disabled:opacity-40',
            ].join(' ')}
          >
            <MessageSquare size={15} />
            Customer reply
          </button>

          <button
            type="button"
            onClick={() =>
              setIsInternal(true)
            }
            disabled={
              disabled || sending
            }
            className={[
              'inline-flex items-center gap-2 rounded-xl px-3 py-2',
              'text-sm font-semibold transition',
              isInternal
                ? 'border border-amber-400/20 bg-amber-400/10 text-amber-300'
                : 'border border-white/10 bg-white/5 text-white/45 hover:bg-white/8 hover:text-white/70',
              'disabled:cursor-not-allowed disabled:opacity-40',
            ].join(' ')}
          >
            <Shield size={15} />
            Internal note
          </button>
        </div>

        <div
          className={`overflow-hidden rounded-2xl border transition ${shellTone}`}
        >
          <textarea
            value={message}
            onChange={(event) => {
              setMessage(
                event.target.value,
              );

              if (error) {
                setError(null);
              }
            }}
            disabled={
              disabled || sending
            }
            rows={6}
            maxLength={
              MAX_MESSAGE_LENGTH
            }
            placeholder={
              isInternal
                ? 'Write a private note for other staff members...'
                : 'Write a response to the customer...'
            }
            className="block min-h-36 w-full resize-y border-0 bg-[#07101F] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <div
            className={[
              'flex flex-col gap-1 border-t px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between',
              isInternal
                ? 'border-amber-400/10 bg-amber-400/5'
                : 'border-white/8 bg-white/3',
            ].join(' ')}
          >
            <p
              className={`text-[10px] ${
                remainingCharacters < 500
                  ? 'text-amber-300'
                  : 'text-white/30'
              }`}
            >
              {message.length.toLocaleString()} /{' '}
              {MAX_MESSAGE_LENGTH.toLocaleString()}
            </p>

            <p className="text-[10px] text-white/30">
              {isInternal
                ? 'Only staff can see this note.'
                : 'Visible to the customer.'}
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-xs font-medium text-red-300">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={
              disabled ||
              sending ||
              !trimmedMessage ||
              message.length >
                MAX_MESSAGE_LENGTH
            }
            className={[
              'inline-flex items-center gap-2 rounded-xl px-5 py-2.5',
              'text-sm font-semibold text-white',
              'transition-all duration-200',
              isInternal
                ? 'bg-linear-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-950/20 hover:from-amber-400 hover:to-orange-400'
                : 'bg-linear-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-950/20 hover:from-emerald-400 hover:to-emerald-500',
              'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
            ].join(' ')}
          >
            {sending ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Sending...
              </>
            ) : (
              <>
                <Send size={17} />
                {isInternal
                  ? 'Add internal note'
                  : 'Send reply'}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}