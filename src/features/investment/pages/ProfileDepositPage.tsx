// src/features/investment/pages/ProfileDepositPage.tsx
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { demoProfile } from '../data/profile-demo';
import { formatCurrency } from '../utils/currency';
//import { useSettings } from '../context/useSettings';

const ProfileDepositPage = () => {
  const navigate = useNavigate();
  //const { currency } = useSettings();
  const [amount, setAmount] = useState(0);
  const defaultWallet = demoProfile.wallets.find(w => w.isDefault) || demoProfile.wallets[0];

  const handleDeposit = () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (!defaultWallet) {
      alert('Please add a wallet first.');
      return;
    }
    // Simulate deposit
    alert(`Deposit of ${formatCurrency(amount, 'USDT')} to ${defaultWallet.label} initiated (demo).`);
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
          <h1 className="text-[19px] font-extrabold text-slate-900">Deposit</h1>
        </header>

        <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">Add Funds</h2>
          <p className="mt-1 text-xs text-slate-500">Deposit USDT to your investment account.</p>

          <div className="mt-4">
            <label className="text-xs font-bold text-slate-700">Amount (USDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          {defaultWallet && (
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Deposit to Wallet</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{defaultWallet.label}</p>
              <p className="truncate text-xs text-slate-500">{defaultWallet.address}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleDeposit}
            disabled={!defaultWallet}
            className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
          >
            {defaultWallet ? 'Deposit Now' : 'Please add a wallet first'}
          </button>
        </section>
      </main>
    </div>
  );
};
export default ProfileDepositPage;