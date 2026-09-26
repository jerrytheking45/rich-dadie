
// src/app/investment/profile/info/page.tsx


"use client";

import { ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { investmentApi } from "@/src/lib/api/investmentApi";
import type { UserProfile } from "@/src/lib/types/investment";

const ProfileInfoPage = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const data = await investmentApi.getProfile();

        if (cancelled) {
          return;
        }

        setProfile(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Unable to load your profile.";

        setError(message);
        setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#050B18] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute -left-40 top-[38%] h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-4 pb-32 pt-5 sm:px-6 lg:max-w-5xl lg:px-8">
        <div className="mx-auto w-full max-w-3xl pb-24 pt-2">

          {/* Header */}
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push("/investment/profile")
                }
                className="
                  inline-flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  border border-white/8
                  bg-[#0B1426]
                  text-slate-300
                  shadow-lg shadow-black/10
                  transition
                  hover:border-emerald-400/20
                  hover:bg-emerald-500/10
                  hover:text-emerald-400
                  active:scale-95
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-500/60
                "
                aria-label="Back to profile"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  Account
                </p>

                <h1 className="mt-1 text-[20px] font-black tracking-tight text-white">
                  Personal Information
                </h1>

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  View the information associated with your account.
                </p>
              </div>
            </div>
          </header>

          {/* Loading */}
          {loading && (
            <section
              className="
                rounded-[28px]
                border border-white/8
                bg-[#0B1426]
                p-5
                shadow-xl shadow-black/10
              "
            >
              <div className="animate-pulse">
                <div className="mx-auto h-24 w-24 rounded-full border border-white/6 bg-white/5" />

                <div className="mx-auto mt-5 h-3 w-24 rounded-full bg-white/8" />
                <div className="mt-2 h-11 w-full rounded-2xl bg-white/4" />

                <div className="mt-5 h-3 w-28 rounded-full bg-white/8" />
                <div className="mt-2 h-11 w-full rounded-2xl bg-white/4" />

                <div className="mt-5 h-3 w-20 rounded-full bg-white/8" />
                <div className="mt-2 h-11 w-full rounded-2xl bg-white/4" />
              </div>
            </section>
          )}

          {/* Error */}
          {!loading && error && (
            <section
              className="
                rounded-[28px]
                border border-red-400/15
                bg-[#0B1426]
                p-6
                text-center
                shadow-xl shadow-black/10
              "
            >
              <div
                className="
                  mx-auto flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  border border-red-400/15
                  bg-red-500/10
                  text-red-400
                "
              >
                <User size={20} />
              </div>

              <p className="mt-4 text-sm font-bold text-white">
                Unable to load profile
              </p>

              <p className="mt-2 text-xs leading-5 text-red-300/80">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  mt-5
                  rounded-xl
                  border border-emerald-400/15
                  bg-emerald-500
                  px-5 py-2.5
                  text-xs font-bold
                  text-[#03100B]
                  shadow-lg shadow-emerald-500/10
                  transition
                  hover:bg-emerald-400
                  active:scale-[0.98]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-400
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#050B18]
                "
              >
                Try Again
              </button>
            </section>
          )}

          {/* Profile */}
          {!loading && !error && profile && (
            <section
              className="
                overflow-hidden
                rounded-[28px]
                border border-white/8
                bg-linear-to-br
                from-[#101D33]
                via-[#0B1426]
                to-[#11102B]
                p-5
                shadow-xl shadow-black/10
                sm:p-6
              "
            >
              {/* Profile identity */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="
                    relative flex h-24 w-24
                    items-center justify-center
                    rounded-full
                    border border-emerald-400/20
                    bg-emerald-500/10
                    text-emerald-400
                    shadow-lg shadow-emerald-500/5
                  "
                >
                  <div
                    className="
                      absolute inset-1
                      rounded-full
                      border border-white/5
                    "
                  />

                  <User size={38} />
                </div>

                <p className="mt-4 text-base font-black tracking-tight text-white">
                  {profile.name || "User"}
                </p>

                <p className="mt-1.5 text-[10px] leading-5 text-white/35">
                  Profile information from your account
                </p>
              </div>

              {/* Information */}
              <div className="mt-7 overflow-hidden rounded-2xl border border-white/6 bg-[#07101F]/60 px-4">
                <ProfileField
                  label="Full Name"
                  value={profile.name}
                />

                <ProfileField
                  label="Email Address"
                  value={profile.email}
                />

                <ProfileField
                  label="Employee ID"
                  value={profile.employeeId}
                />

                <ProfileField
                  label="Account Role"
                  value={formatRole(profile.role)}
                />

                <ProfileField
                  label="Account Created"
                  value={formatDate(profile.createdAt)}
                  last
                />
              </div>

              {/* Account status */}
              <div
                className="
                  mt-4 flex items-center gap-3
                  rounded-2xl
                  border border-emerald-400/10
                  bg-emerald-500/5
                  px-4 py-3
                "
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-400/80">
                    Account information
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/35">
                    Your profile details are linked to your account.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

function ProfileField({
  label,
  value,
  last = false,
}: {
  label: string;
  value?: string | null;
  last?: boolean;
}) {
  return (
    <div
      className={`
        py-4
        ${last ? "" : "border-b border-white/6"}
      `}
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 wrap-break-word text-xs font-semibold leading-5 text-slate-200">
        {value || "—"}
      </p>
    </div>
  );
}

function formatRole(role: UserProfile["role"]) {
  switch (role) {
    case "superadmin":
      return "Super Admin";

    case "admin":
      return "Administrator";

    case "employee":
      return "Employee";

    default:
      return role;
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default ProfileInfoPage;

