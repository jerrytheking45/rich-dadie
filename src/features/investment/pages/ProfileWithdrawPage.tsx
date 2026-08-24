// src/features/investment/pages/ProfileWithdrawPage.tsx
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { demoProfile } from '../data/profile-demo';
import { formatCurrency } from '../utils/currency';
import { useSettings } from '../context/useSettings';

const ProfileWithdrawPage = () => {
  const navigate = useNavigate();
  const { currency } = useSettings();
  const [amount, setAmount] = useState(0);
  const wallets = demoProfile.wallets;
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');

  // Calculate balance from demo transactions (same as in main profile)
  const balance = demoProfile.transactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => {
      if (t.type === 'DEPOSIT') return sum + t.amount;
      if (t.type === 'WITHDRAWAL') return sum - t.amount;
      return sum;
    }, 0);

  const handleWithdraw = () => {
    if (!amount || amount <= 0 || amount > balance) {
      alert('Invalid amount.');
      return;
    }
    if (!selectedWalletId) {
      alert('Please select a wallet.');
      return;
    }
    const wallet = wallets.find(w => w.id === selectedWalletId);
    alert(`Withdrawal of ${formatCurrency(amount, 'USDT')} to ${wallet?.label} requested (demo).`);
    navigate('/investment/profile');
  };

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
          <h1 className="text-[19px] font-extrabold text-slate-900">Withdraw</h1>
        </header>

        <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Available Balance</p>
            <p className="text-lg font-extrabold text-slate-900">{formatCurrency(balance, currency)}</p>
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold text-slate-700">Amount (USDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              max={balance}
              placeholder="0.00"
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold text-slate-700">Withdraw to Wallet</label>
            <select
              value={selectedWalletId}
              onChange={(e) => setSelectedWalletId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
            >
              {wallets.map(w => (
                <option key={w.id} value={w.id}>{w.label}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleWithdraw}
            disabled={!selectedWalletId || amount <= 0 || amount > balance}
            className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
          >
            Withdraw
          </button>
        </section>
      </main>
    </div>
  );
};
export default ProfileWithdrawPage;