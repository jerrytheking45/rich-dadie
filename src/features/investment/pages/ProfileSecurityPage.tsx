// src/features/investment/pages/ProfileSecurityPage.tsx
import { ArrowLeft, Key, Smartphone, Globe, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ProfileSecurityPage = () => {
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    alert(`Two-Factor Authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} (demo)`);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    alert('Password updated successfully (demo)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const sessions = [
    { id: 1, device: 'Chrome on Windows', location: 'Kampala, Uganda', lastActive: '2026-08-21 10:30 AM', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'Nairobi, Kenya', lastActive: '2026-08-20 08:15 PM', current: false },
  ];

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
          <h1 className="text-[19px] font-extrabold text-slate-900">Security</h1>
        </header>

        <section className="mt-6 space-y-4">
          {/* Two-Factor Authentication */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Secure your account with 2FA</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggle2FA}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Key size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Change Password</p>
                <p className="text-xs text-slate-500">Update your account password</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleChangePassword}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Active Sessions</p>
                  <p className="text-xs text-slate-500">Manage devices logged into your account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Refreshed sessions (demo)')}
                className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{session.device}</p>
                    <p className="text-xs text-slate-400">{session.location}</p>
                    <p className="text-[10px] text-slate-400">Last active: {session.lastActive}</p>
                  </div>
                  {session.current ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Current</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => alert(`Logged out ${session.device} (demo)`)}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Logout
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default ProfileSecurityPage;