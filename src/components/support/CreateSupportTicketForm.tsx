
'use client';

import {
  Loader2,
  Send,
} from 'lucide-react';
import {
  FormEvent,
  useMemo,
  useState,
} from 'react';

import {
  supportService,
} from '@/src/lib/services/supportService';

import type {
  SupportTicketCategory,
} from '@/src/lib/types/support';

interface CreateSupportTicketFormProps {
  initialCategory?: SupportTicketCategory;
  initialSubject?: string;
  initialMessage?: string;
  onCreated?: (ticketId: string) => void;
}

export default function CreateSupportTicketForm({
  initialCategory = 'OTHER',
  initialSubject = '',
  initialMessage = '',
  onCreated,
}: CreateSupportTicketFormProps) {
  const [subject, setSubject] =
    useState(initialSubject);

  const [category, setCategory] =
    useState<SupportTicketCategory>(
      initialCategory,
    );

  const [message, setMessage] =
    useState(initialMessage);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const categories = useMemo(
    () => supportService.getCategories(),
    [],
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError('');

    try {
      setSubmitting(true);

      const response =
        await supportService.createTicket({
          subject,
          category,
          message,
        });

      onCreated?.(response.ticket.id);
    } catch (err) {
      const fallback =
        'Unable to create your support ticket. Please try again.';

      if (
        err instanceof Error &&
        err.message
      ) {
        setError(err.message);
      } else {
        setError(fallback);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-2xl border border-rose-400/15 bg-rose-400/8 px-4 py-3">
          <p className="text-xs font-medium leading-5 text-rose-300">
            {error}
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="support-category"
          className="mb-2 block text-[10px] font-black uppercase tracking-widest text-white/35"
        >
          Category
        </label>

        <select
          id="support-category"
          value={category}
          onChange={(event) =>
            setCategory(
              event.target
                .value as SupportTicketCategory,
            )
          }
          disabled={submitting}
          className={[
            'w-full appearance-none rounded-xl',
            'border border-white/8',
            'bg-[#07101F]',
            'px-4 py-3',
            'text-sm text-white',
            'outline-none transition',
            'focus:border-emerald-300/30',
            'focus:ring-4 focus:ring-emerald-300/8',
            'disabled:cursor-not-allowed disabled:opacity-40',
          ].join(' ')}
        >
          {categories.map((item) => (
            <option
              key={item.value}
              value={item.value}
              className="bg-[#0B1426] text-white"
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="support-subject"
          className="mb-2 block text-[10px] font-black uppercase tracking-widest text-white/35"
        >
          Subject
        </label>

        <input
          id="support-subject"
          type="text"
          value={subject}
          onChange={(event) =>
            setSubject(event.target.value)
          }
          disabled={submitting}
          maxLength={255}
          placeholder="What do you need help with?"
          className={[
            'w-full rounded-xl',
            'border border-white/8',
            'bg-[#07101F]',
            'px-4 py-3',
            'text-sm text-white',
            'outline-none transition',
            'placeholder:text-white/20',
            'focus:border-emerald-300/30',
            'focus:ring-4 focus:ring-emerald-300/8',
            'disabled:cursor-not-allowed disabled:opacity-40',
          ].join(' ')}
        />

        <div className="mt-1.5 text-right text-[9px] font-medium text-white/20">
          {subject.length}/255
        </div>
      </div>

      <div>
        <label
          htmlFor="support-message"
          className="mb-2 block text-[10px] font-black uppercase tracking-widest text-white/35"
        >
          Message
        </label>

        <textarea
          id="support-message"
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          disabled={submitting}
          maxLength={10000}
          rows={7}
          placeholder="Describe your issue in as much detail as possible."
          className={[
            'w-full resize-none rounded-xl',
            'border border-white/8',
            'bg-[#07101F]',
            'px-4 py-3',
            'text-sm leading-6 text-white',
            'outline-none transition',
            'placeholder:text-white/20',
            'focus:border-emerald-300/30',
            'focus:ring-4 focus:ring-emerald-300/8',
            'disabled:cursor-not-allowed disabled:opacity-40',
          ].join(' ')}
        />

        <div className="mt-1.5 text-right text-[9px] font-medium text-white/20">
          {message.length}/10000
        </div>
      </div>

      <button
        type="submit"
        disabled={
          submitting ||
          !subject.trim() ||
          !message.trim()
        }
        className={[
          'flex w-full items-center justify-center gap-2',
          'rounded-xl px-5 py-3.5',
          'text-xs font-black',
          'transition-all',
          submitting ||
          !subject.trim() ||
          !message.trim()
            ? 'cursor-not-allowed bg-white/6 text-white/20'
            : 'bg-emerald-400 text-[#04110B] shadow-lg shadow-emerald-950/20 hover:bg-emerald-300 active:scale-[0.99]',
        ].join(' ')}
      >
        {submitting ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />
            Creating ticket...
          </>
        ) : (
          <>
            <Send size={17} />
            Submit support ticket
          </>
        )}
      </button>
    </form>
  );
}