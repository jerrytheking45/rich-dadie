// src/features/investment/pages/ProfileInfoPage.tsx
// src/features/investment/pages/ProfileInfoPage.tsx
import { ArrowLeft, Camera, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { demoProfile } from '../data/profile-demo';

const ProfileInfoPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(demoProfile.name);
  const [email, setEmail] = useState(demoProfile.email);
  const [avatar, setAvatar] = useState(demoProfile.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    alert('Profile updated! (demo)');
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
          <h1 className="text-[19px] font-extrabold text-slate-900">Personal Information</h1>
        </header>

        <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="h-full w-full rounded-full object-cover border-2 border-emerald-200" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
                  <User size={40} />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-2 text-white shadow hover:bg-emerald-600"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">Click the camera to upload a profile picture</p>
          </div>

          {/* Name */}
          <div className="mt-6">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
            />
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700"
          >
            Save Changes
          </button>
        </section>
      </main>
    </div>
  );
};
export default ProfileInfoPage;