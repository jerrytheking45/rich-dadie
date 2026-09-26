
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

function ResetPasswordLoading() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#070b24] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-6xl overflow-hidden rounded-4xl border border-white/10 bg-white/3 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="grid min-h-175 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hidden border-r border-white/10 p-10 lg:block xl:p-14">
              <div className="h-11 w-11 animate-pulse rounded-[14px] bg-white/10" />

              <div className="mt-14 max-w-lg space-y-5">
                <div className="h-7 w-48 animate-pulse rounded-lg bg-white/8" />
                <div className="h-14 w-full animate-pulse rounded-xl bg-white/8" />
                <div className="h-14 w-4/5 animate-pulse rounded-xl bg-white/8" />
              </div>

              <div className="mt-10 space-y-3">
                <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
              </div>
            </div>

            <div className="flex items-center p-6 sm:p-10 xl:p-14">
              <div className="mx-auto w-full max-w-md animate-pulse space-y-6">
                <div className="h-4 w-32 rounded bg-white/8" />
                <div className="h-10 w-72 max-w-full rounded bg-white/8" />
                <div className="h-12 w-full rounded bg-white/8" />
                <div className="h-14 w-full rounded-2xl bg-white/8" />
                <div className="h-14 w-full rounded-2xl bg-white/8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

