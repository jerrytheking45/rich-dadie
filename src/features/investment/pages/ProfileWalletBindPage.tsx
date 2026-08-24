// src/features/investment/pages/ProfileWalletBindPage.tsx
import { ArrowLeft, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type Network = 'ERC20' | 'BEP20' | 'TRC20' | 'SOLANA';

const ProfileWalletBindPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<Network>('ERC20');
  const [label, setLabel] = useState('');

  const handleBind = () => {
    if (!address.trim() || !label.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    alert(`Wallet bound (demo): ${label} - ${address.slice(0, 8)}...`);
    navigate('/investment/profile/payments');
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-5 sm:px-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/investment/profile/payments')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="text-[19px] font-extrabold text-slate-900">Bind Wallet</h1>
        </header>

        <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
              <Wallet size={28} />
            </div>
            <h2 className="mt-3 text-lg font-extrabold text-slate-900">Add a Crypto Wallet</h2>
            <p className="mt-1 text-sm text-slate-500">
              Connect your external wallet to enable deposits and withdrawals.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Wallet Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x... or wallet address"
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Network</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as Network)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
              >
                <option value="ERC20">ERC20 (Ethereum)</option>
                <option value="BEP20">BEP20 (BSC)</option>
                <option value="TRC20">TRC20 (Tron)</option>
                <option value="SOLANA">Solana</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., My MetaMask"
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="button"
              onClick={handleBind}
              className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700"
            >
              Bind Wallet
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
export default ProfileWalletBindPage;