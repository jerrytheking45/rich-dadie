
import { Suspense } from "react";
import LoginForm from "./LoginForm";

function LoginLoading() {
  return (
    <main className="min-h-dvh bg-[#070b24] px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
          <div className="animate-pulse space-y-7">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-white/10" />

            <div className="space-y-3 text-center">
              <div className="mx-auto h-8 w-44 rounded-xl bg-white/10" />
              <div className="mx-auto h-4 w-64 max-w-full rounded-lg bg-white/6" />
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-white/10" />
                <div className="h-14 rounded-2xl bg-white/6" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-white/10" />
                <div className="h-14 rounded-2xl bg-white/6" />
              </div>

              <div className="h-14 rounded-2xl bg-emerald-400/20" />
            </div>

            <div className="mx-auto h-4 w-52 rounded bg-white/6" />
          </div>
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

