
'use client';

import {
  Loader2,
  Send,
} from 'lucide-react';
import {
  FormEvent,
  useState,
} from 'react';

interface SupportMessageComposerProps {
  onSend: (message: string) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
}

export default function SupportMessageComposer({
  onSend,
  disabled = false,
  placeholder = 'Write a message...',
}: SupportMessageComposerProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canSend =
    message.trim().length > 0 &&
    !disabled &&
    !sending;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const value = message.trim();

    if (!value || disabled || sending) {
      return;
    }

    try {
      setSending(true);
      await onSend(value);
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/6 bg-[#07101F] p-3 sm:p-4"
    >
      <div className="rounded-2xl border border-white/8 bg-[#0B1426] p-1.5 shadow-lg shadow-black/10">
        <div className="flex items-end gap-2">
          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            disabled={disabled || sending}
            placeholder={
              disabled
                ? 'This ticket is closed.'
                : placeholder
            }
            rows={1}
            maxLength={10000}
            className={[
              'min-h-10 flex-1 resize-none bg-transparent',
              'px-2 py-2',
              'text-sm leading-5 text-white',
              'outline-none',
              'placeholder:text-white/20',
              'disabled:cursor-not-allowed disabled:opacity-40',
            ].join(' ')}
          />

          <button
            type="submit"
            disabled={!canSend}
            className={[
              'flex h-9 w-9 shrink-0 items-center justify-center',
              'rounded-xl',
              'transition-all',
              canSend
                ? 'bg-emerald-400 text-[#061019] shadow-lg shadow-emerald-950/20 hover:bg-emerald-300'
                : 'bg-white/6 text-white/20',
              'disabled:cursor-not-allowed',
            ].join(' ')}
            aria-label="Send message"
          >
            {sending ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Send
                size={17}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>

      <div className="mt-1.5 px-2 text-right text-[9px] font-medium text-white/20">
        {message.length}/10000
      </div>
    </form>
  );
}
