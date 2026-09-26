// src/components/admin/promotions/AdminPromotionsTable.tsx

"use client";

import {
  Eye,
  ExternalLink,
  Loader2,
  Pencil,
  Power,
  Trash2,
  Megaphone,
} from "lucide-react";

import type { Promotion } from "@/src/lib/types/promotion";

interface AdminPromotionsTableProps {
  promotions: Promotion[];
  loading?: boolean;
  onView: (promotion: Promotion) => void;
  onEdit: (promotion: Promotion) => void;
  onStatusChange: (
    promotion: Promotion,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onDelete: (promotion: Promotion) => void;
}

const typeLabels: Record<string, string> = {
  PLAN_LAUNCH: "Plan Launch",
  OFFER: "Offer",
  BONUS: "Bonus",
  ANNOUNCEMENT: "Announcement",
  GENERAL: "General",
};

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString();
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

export default function AdminPromotionsTable({
  promotions,
  loading = false,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: AdminPromotionsTableProps) {
  if (loading) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-white/8 bg-[#07111F] p-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10">
          <Loader2 className="h-5 w-5 animate-spin text-purple-300" />
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Loading promotions...
        </p>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#07111F] p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/3">
          <Megaphone className="h-5 w-5 text-slate-500" />
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-200">
          No promotions yet
        </h3>

        <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
          Create a promotion to advertise an offer, investment
          opportunity, announcement, or campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#07111F] shadow-xl shadow-black/5">
      <div className="overflow-x-auto">
        <table className="min-w-262.5 w-full text-left">
          <thead className="border-b border-white/8 bg-white/2">
            <tr>
              <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Promotion
              </th>

              <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Type
              </th>

              <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Status
              </th>

              <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Schedule
              </th>

              <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Order
              </th>

              <th className="px-5 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {promotions.map((promotion) => (
              <tr
                key={promotion.id}
                className="transition-colors hover:bg-white/2.5"
              >
                <td className="px-5 py-4">
                  <div className="max-w-85">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/6">
                        <Megaphone className="h-4 w-4 text-purple-300" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-200">
                          {promotion.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {promotion.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${typeClasses(
                      promotion.type,
                    )}`}
                  >
                    {typeLabels[promotion.type] ||
                      promotion.type}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${statusClasses(
                      promotion.status,
                    )}`}
                  >
                    {promotion.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-1 text-xs text-slate-500">
                    <p>
                      Start:{" "}
                      <span className="font-semibold text-slate-300">
                        {formatDate(promotion.starts_at)}
                      </span>
                    </p>

                    <p>
                      End:{" "}
                      <span className="font-semibold text-slate-300">
                        {formatDate(promotion.ends_at)}
                      </span>
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex min-w-8 items-center justify-center rounded-lg border border-white/8 bg-white/3 px-2 py-1 text-xs font-bold text-slate-300">
                    {promotion.display_order}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <ActionButton
                      title="View promotion"
                      onClick={() => onView(promotion)}
                    >
                      <Eye className="h-4 w-4" />
                    </ActionButton>

                    <ActionButton
                      title="Edit promotion"
                      onClick={() => onEdit(promotion)}
                    >
                      <Pencil className="h-4 w-4" />
                    </ActionButton>

                    {promotion.status === "ACTIVE" ? (
                      <ActionButton
                        title="Deactivate promotion"
                        onClick={() =>
                          onStatusChange(
                            promotion,
                            "INACTIVE",
                          )
                        }
                        className="text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300"
                      >
                        <Power className="h-4 w-4" />
                      </ActionButton>
                    ) : (
                      <ActionButton
                        title="Activate promotion"
                        onClick={() =>
                          onStatusChange(
                            promotion,
                            "ACTIVE",
                          )
                        }
                        className="text-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
                      >
                        <Power className="h-4 w-4" />
                      </ActionButton>
                    )}

                    <ActionButton
                      title="Delete promotion"
                      onClick={() => onDelete(promotion)}
                      className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </ActionButton>

                    <a
                      href={`/investment/promotions/${promotion.id}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open public promotion"
                      className="rounded-xl p-2 text-slate-500 transition hover:bg-white/6 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({
  title,
  onClick,
  children,
  className = "",
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`rounded-xl p-2 text-slate-500 transition hover:bg-white/6 hover:text-white ${className}`}
    >
      {children}
    </button>
  );
}