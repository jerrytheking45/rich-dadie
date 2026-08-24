// src/features/investment/pages/ProfileTransactionsPage.tsx
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { demoProfile } from '../data/profile-demo';
import { formatCurrency } from '../utils/currency';
import { useSettings } from '../context/useSettings';

const ProfileTransactionsPage = () => {
  const navigate = useNavigate();
  const { currency } = useSettings();
  const transactions = demoProfile.transactions;

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-5 sm:px-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/investment/profile')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="text-[19px] font-extrabold text-slate-900">Transactions</h1>
        </header>

        <div className="mt-6 space-y-3">
          {transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-500">No transactions yet.</p>
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {tx.type === 'DEPOSIT' ? (
                      <ArrowDownLeft size={16} className="text-emerald-500" />
                    ) : tx.type === 'WITHDRAWAL' ? (
                      <ArrowUpRight size={16} className="text-red-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-slate-300" />
                    )}
                    <div>
                      <p className="font-bold text-slate-900">{tx.description}</p>
                      <p className="text-xs text-slate-400">{new Date(tx.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-emerald-600' : tx.type === 'WITHDRAWAL' ? 'text-red-500' : 'text-slate-700'}`}>
                      {tx.type === 'DEPOSIT' ? '+' : tx.type === 'WITHDRAWAL' ? '-' : ''}
                      {formatCurrency(tx.amount, currency)}
                    </p>
                    <span className={`text-xs ${tx.status === 'COMPLETED' ? 'text-emerald-500' : tx.status === 'PENDING' ? 'text-amber-500' : 'text-red-500'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
export default ProfileTransactionsPage;