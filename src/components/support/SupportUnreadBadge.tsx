'use client';

interface SupportUnreadBadgeProps {
  count: number;
}

export default function SupportUnreadBadge({
  count,
}: SupportUnreadBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      aria-label={`${count} unread support messages`}
      className={[
        'absolute -right-1 -top-1 z-20',
        'flex min-h-5 min-w-5 items-center justify-center',
        'rounded-full border-2 border-[#07101F]',
        'bg-rose-500 px-1',
        'text-[9px] font-black leading-none text-white',
        'shadow-lg shadow-rose-950/30',
      ].join(' ')}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}