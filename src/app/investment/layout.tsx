// src/app/investment/layout.tsx
import ProtectedRoute from '@/src/components/ProtectedRoute';
import InvestmentBottomNav from '@/src/features/investment/components/InvestmentBottomNav';

export default function InvestmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f6f8f6]">
        <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-5 sm:px-6">
          {children}
        </main>
        <InvestmentBottomNav />
      </div>
    </ProtectedRoute>
  );
}