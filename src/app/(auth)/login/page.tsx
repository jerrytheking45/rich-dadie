
import { Suspense } from "react";
import LoginForm from "./LoginForm";

function LoginLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#050B18] px-3 py-5 sm:px-6">

      <div className="w-full max-w-105 overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1426] p-5 shadow-2xl sm:p-7">

        <div
          role="status"
          aria-label="Loading sign-in form"
          className="animate-pulse space-y-5"
        >

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#E60033]/25" />

            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-white/10" />
              <div className="h-2 w-28 rounded bg-white/5" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-[#E60033]/20" />
            <div className="h-6 w-48 rounded-lg bg-white/10" />
            <div className="h-3 w-60 max-w-full rounded bg-white/5" />
          </div>

          {/* Form fields */}
          <div className="space-y-4">

            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-10 rounded-xl bg-white/5" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-10 rounded-xl bg-white/5" />
            </div>

            {/* Security strip */}
            <div className="h-12 rounded-xl bg-white/5" />

            {/* Login button */}
            <div className="h-11 rounded-xl bg-[#E60033]/25" />
          </div>

          {/* Footer */}
          <div className="mx-auto h-3 w-44 rounded bg-white/5" />
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}