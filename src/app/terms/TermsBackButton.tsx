"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-white"
    >
      <ArrowLeft size={15} />
      Back
    </button>
  );
}
