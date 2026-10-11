
import { Suspense } from "react";
import Image from "next/image";

import RegisterForm from "./RegisterForm";

function RegisterLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#050B18] px-3 py-5 text-white sm:px-6">

      <div className="w-full max-w-105 overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1426] p-5 shadow-2xl sm:p-7">

        <div
          role="status"
          aria-label="Loading registration form"
          className="animate-pulse space-y-4"
        >

          {/* BRAND */}
          <div className="flex items-center gap-2.5">

            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#E60033]">
              <Image
                src="/images/logo.png"
                alt="REDIQ"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>

            <div className="space-y-1.5">
              <div className="h-4 w-20 rounded bg-white/10" />
              <div className="h-2 w-28 rounded bg-white/5" />
            </div>
          </div>

          {/* HEADING */}
          <div className="space-y-2">

            <div className="h-3 w-28 rounded bg-[#E60033]/20" />

            <div className="h-7 w-36 rounded-lg bg-white/10" />

            <div className="h-3 w-60 max-w-full rounded bg-white/5" />
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-3">

            {[
              "name",
              "email",
              "password",
              "confirm-password",
            ].map((field) => (
              <div key={field} className="space-y-1.5">

                <div className="h-3 w-24 rounded bg-white/10" />

                <div className="h-10 rounded-xl border border-white/5 bg-white/5" />
              </div>
            ))}

            {/* Requirements */}
            <div className="h-14 rounded-xl bg-white/5" />

            {/* Submit */}
            <div className="h-11 rounded-xl bg-[#E60033]/25" />
          </div>

          {/* FOOTER */}
          <div className="mx-auto h-3 w-44 rounded bg-white/5" />

          <div className="border-t border-white/8 pt-3">
            <div className="mx-auto h-3 w-56 max-w-full rounded bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}