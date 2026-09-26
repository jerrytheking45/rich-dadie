
'use client';

interface PlanStatusBadgeProps {
  status: 'DRAFT' | 'PUBLISHED';
}

export default function PlanStatusBadge({
  status,
}: PlanStatusBadgeProps) {
  const isPublished = status === 'PUBLISHED';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        isPublished
          ? 'bg-green-500/10 text-green-400'
          : 'bg-yellow-500/10 text-yellow-400',
      ].join(' ')}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}