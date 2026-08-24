// src/features/investment/pages/ProfileNotificationsPage.tsx
import { ArrowLeft, Bell, Mail, Smartphone, Globe, CheckCircle, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { notificationPreferences, recentNotifications } from '../data/profile-demo';

const ProfileNotificationsPage = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(notificationPreferences);

  const togglePreference = (id: string) => {
    setPreferences(
      preferences.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
    alert('Notification preference updated (demo)');
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
          <h1 className="text-[19px] font-extrabold text-slate-900">Notifications</h1>
        </header>

        {/* Preferences */}
        <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">Preferences</h2>
          <p className="mt-1 text-xs text-slate-500">Choose how you want to receive notifications</p>
          <div className="mt-4 space-y-3">
            {preferences.map((pref) => {
              const Icon = pref.type === 'email' ? Mail : pref.type === 'push' ? Smartphone : Globe;
              return (
                <div key={pref.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <Icon size={17} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{pref.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePreference(pref.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      pref.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        pref.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Notifications */}
        <section className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">Recent</h2>
          <p className="mt-1 text-xs text-slate-500">Your latest notifications</p>
          <div className="mt-4 space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-center text-sm text-slate-400">No notifications</p>
            ) : (
              recentNotifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0">
                  <div className="mt-0.5">
                    {notif.read ? (
                      <CheckCircle size={16} className="text-slate-300" />
                    ) : (
                      <Bell size={16} className="text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{notif.title}</p>
                    <p className="text-xs text-slate-500">{notif.message}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {new Date(notif.date).toLocaleString()}
                    </p>
                  </div>
                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => alert(`Marked as read (demo)`)}
                      className="text-[10px] font-bold text-emerald-600 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
export default ProfileNotificationsPage;