
'use client';

interface AdminStatsProps {
  userCount: number;
  depositCount: number;
  pendingDeposits: number;
  verifiedDeposits: number;
}

export default function AdminStats({
  userCount,
  depositCount,
  pendingDeposits,
  verifiedDeposits,
}: AdminStatsProps) {
  const stats = [
    {
      label: 'Total Users',
      value: userCount,
      description: 'Registered platform users',
      icon: '◉',
    },
    {
      label: 'Total Deposits',
      value: depositCount,
      description: 'All investment deposits',
      icon: '↗',
    },
    {
      label: 'Pending Deposits',
      value: pendingDeposits,
      description: 'Require administrator review',
      icon: '◷',
    },
    {
      label: 'Verified Deposits',
      value: verifiedDeposits,
      description: 'Successfully verified',
      icon: '✓',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {stat.value.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg font-semibold text-emerald-600">
              {stat.icon}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}