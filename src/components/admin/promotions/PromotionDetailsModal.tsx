
// src/components/admin/promotions/PromotionDetailsModal.tsx

"use client";

import {
  CalendarDays,
  ExternalLink,
  Gift,
  ImageIcon,
  Link2,
  Megaphone,
  X,
} from "lucide-react";
import Image from "next/image";

import type { Promotion } from "@/src/lib/types/promotion";

interface PromotionDetailsModalProps {
  promotion: Promotion | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(value?: string) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}

const typeLabels: Record<string, string> = {
  PLAN_LAUNCH: "Plan Launch",
  OFFER: "Offer",
  BONUS: "Bonus Campaign",
  ANNOUNCEMENT: "Announcement",
  GENERAL: "General",
};

function typeClasses(type: string) {
  switch (type) {
    case "PLAN_LAUNCH":
      return "border-purple-400/15 bg-purple-400/10 text-purple-300";

    case "OFFER":
      return "border-emerald-400/15 bg-emerald-400/10 text-emerald-300";

    case "BONUS":
      return "border-amber-400/15 bg-amber-400/10 text-amber-300";

    case "ANNOUNCEMENT":
      return "border-blue-400/15 bg-blue-400/10 text-blue-300";

    default:
      return "border-white/10 bg-white/[0.04] text-slate-400";
  }
}

function statusClasses(status: Promotion["status"]) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-400/15 bg-emerald-400/10 text-emerald-300";

    case "INACTIVE":
      return "border-slate-400/10 bg-slate-400/10 text-slate-400";

    default:
      return "border-amber-400/15 bg-amber-400/10 text-amber-300";
  }
}

export default function PromotionDetailsModal({
  promotion,
  open,
  onClose,
}: PromotionDetailsModalProps) {
  if (!open || !promotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promotion-details-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#07111F] shadow-2xl shadow-black/40"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#07111F]/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10">
                <Megaphone className="h-5 w-5 text-purple-300" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-300">
                  Promotion Details
                </p>

                <h2
                  id="promotion-details-title"
                  className="mt-1 text-lg font-bold text-white"
                >
                  Review promotion configuration
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close promotion details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Image */}
          {promotion.image && (
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#050B18]">
              <Image
                src={promotion.image}
                alt={promotion.title}
                width={1200}
                height={500}
                className="max-h-72 w-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${typeClasses(
                  promotion.type,
                )}`}
              >
                {typeLabels[promotion.type] ||
                  promotion.type}
              </span>

              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${statusClasses(
                  promotion.status,
                )}`}
              >
                {promotion.status}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              {promotion.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {promotion.description}
            </p>
          </div>

          {/* Basic information */}
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              label="Investment plan"
              value={
                promotion.plan_id ||
                "Standalone promotion"
              }
              mono={Boolean(promotion.plan_id)}
            />

            <InfoCard
              label="Display order"
              value={String(promotion.display_order)}
            />
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-purple-300" />

              <p className="text-sm font-semibold text-white">
                Schedule
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ScheduleItem
                label="Starts"
                value={formatDate(promotion.starts_at)}
              />

              <ScheduleItem
                label="Ends"
                value={formatDate(promotion.ends_at)}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              label="CTA text"
              value={promotion.cta_text || "No CTA"}
              icon={Gift}
            />

            <InfoCard
              label="CTA URL"
              value={promotion.cta_url || "Not set"}
              icon={Link2}
              mono={Boolean(promotion.cta_url)}
            />
          </div>

          {/* Open CTA */}
          {promotion.cta_url && (
            <a
              href={promotion.cta_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-purple-400/15 bg-purple-400/6 px-4 py-3 text-xs font-bold text-purple-200 transition hover:bg-purple-400/10"
            >
              Open CTA
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {/* Promotion ID */}
          <div className="rounded-2xl border border-white/8 bg-[#050B18] p-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5 text-slate-600" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Promotion ID
              </p>
            </div>

            <p className="mt-2 break-all font-mono text-xs text-slate-500">
              {promotion.id}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-white/8 bg-white/1.5 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/4 px-5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
  mono = false,
}: {
  label: string;
  value: string;
  icon?: typeof Gift;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/2 p-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="h-3.5 w-3.5 text-slate-600" />
        )}

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 break-all text-sm font-semibold text-slate-300 ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ScheduleItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        {label}
      </p>

      <p className="mt-1.5 text-xs font-semibold text-slate-300">
        {value}
      </p>
    </div>
  );
}