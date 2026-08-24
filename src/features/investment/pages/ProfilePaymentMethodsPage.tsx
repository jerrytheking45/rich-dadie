// src/features/investment/pages/ProfilePaymentMethodsPage.tsx
import { ArrowLeft, Plus, Wallet, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { demoProfile } from '../data/profile-demo';

const ProfilePaymentMethodsPage = () => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState(demoProfile.wallets);

  const handleSetDefault = (id: string) => {
    setWallets(wallets.map(w => ({ ...w, isDefault: w.id === id })));
    alert('Default wallet updated (demo)');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this wallet?')) {
      setWallets(wallets.filter(w => w.id !== id));
      alert('Wallet deleted (demo)');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-5 sm:px-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/investment/profile')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft size={19} />
            </button>
            <h1 className="text-[19px] font-extrabold text-slate-900">Payment Methods</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/investment/profile/wallet/bind')}
            className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600"
          >
            <Plus size={16} /> Add Wallet
          </button>
        </header>

        <div className="mt-6 space-y-3">
          {wallets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <Wallet className="mx-auto text-slate-300" size={32} />
              <p className="mt-2 text-sm text-slate-500">No wallets added yet.</p>
            </div>
          ) : (
            wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-bold text-slate-900">{wallet.label}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase text-slate-400">{wallet.network}</p>
                </div>
                <div className="flex items-center gap-2">
                  {wallet.isDefault && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      Default
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSetDefault(wallet.id)}
                    className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
                    title="Set as default"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(wallet.id)}
                    className="rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                    title="Delete wallet"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
export default ProfilePaymentMethodsPage;