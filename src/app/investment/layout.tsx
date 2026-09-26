
// src/app/investment/layout.tsx
import type { ReactNode } from 'react';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import InvestmentBottomNav from '@/src/components/InvestmentBottomNav';

interface InvestmentLayoutProps {
  children: ReactNode;
}

export default function InvestmentLayout({
  children,
}: InvestmentLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050B18] text-white">
        {children}

        <InvestmentBottomNav />
      </div>
    </ProtectedRoute>
  );
}