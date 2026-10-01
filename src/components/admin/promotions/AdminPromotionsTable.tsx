"use client";

import {
  Eye,
  ExternalLink,
  Loader2,
  Megaphone,
  Pencil,
  Power,
  Trash2,
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
      <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/8 bg-[#07111F] p-8 sm:min-h-52">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10">
          <Loader2 className="h-4.5 w-4.5 animate-spin text-purple-300" />
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Loading promotions...
        </p>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#07111F] p-8 text-center sm:min-h-52">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/3">
          <Megaphone className="h-5 w-5 text-slate-500" />
        </div>

        <h3 className="mt-3 text-sm font-bold text-slate-200">
          No promotions yet
        </h3>

        <p className="mt-1 max-w-md text-[11px] leading-5 text-slate-500">
          Create a promotion to advertise an offer,
          investment opportunity, announcement, or campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#07111F] shadow-xl shadow-black/5">
      {/* Mobile cards */}
      <div className="divide-y divide-white/6 md:hidden">
        {promotions.map((promotion) => (
          <article
            key={promotion.id}
            className="p-3.5 transition-colors active:bg-white/2"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/6">
                <Megaphone className="h-4 w-4 text-purple-300" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="min-w-0 flex-1 truncate text-sm font-bold text-slate-200">
                    {promotion.title}
                  </h3>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${statusClasses(
                      promotion.status,
                    )}`}
                  >
                    {promotion.status}
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                  {promotion.description}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <MobileField
                label="Type"
                value={
                  typeLabels[promotion.type] ||
                  promotion.type
                }
              />

              <MobileField
                label="Order"
                value={String(promotion.display_order)}
              />

              <MobileField
                label="Starts"
                value={formatDate(promotion.starts_at)}
              />

              <MobileField
                label="Ends"
                value={formatDate(promotion.ends_at)}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onView(promotion)}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[10px] font-semibold text-slate-300 transition hover:bg-white/6 hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>

              <button
                type="button"
                onClick={() => onEdit(promotion)}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[10px] font-semibold text-slate-300 transition hover:bg-white/6 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    promotion,
                    promotion.status === "ACTIVE"
                      ? "INACTIVE"
                      : "ACTIVE",
                  )
                }
                className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-semibold transition ${
                  promotion.status === "ACTIVE"
                    ? "border-emerald-400/15 bg-emerald-400/5 text-emerald-300 hover:bg-emerald-400/10"
                    : "border-amber-400/15 bg-amber-400/5 text-amber-300 hover:bg-amber-400/10"
                }`}
              >
                <Power className="h-3.5 w-3.5" />
                {promotion.status === "ACTIVE"
                  ? "Deactivate"
                  : "Activate"}
              </button>

              <button
                type="button"
                onClick={() => onDelete(promotion)}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-red-400/15 bg-red-400/5 px-3 py-2 text-[10px] font-semibold text-red-300 transition hover:bg-red-400/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>

              <a
                href={`/investment/promotions/${promotion.id}`}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/2 px-3 py-2 text-[10px] font-semibold text-slate-400 transition hover:bg-white/6 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open public promotion
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Tablet / desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead className="border-b border-white/8 bg-white/2">
            <tr>
              <Th>Promotion</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Schedule</Th>
              <Th>Order</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {promotions.map((promotion) => (
              <tr
                key={promotion.id}
                className="transition-colors hover:bg-white/2.5"
              >
                <td className="px-4 py-3">
                  <div className="flex min-w-0 max-w-80 items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-400/10 bg-purple-400/6">
                      <Megaphone className="h-3.5 w-3.5 text-purple-300" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-200">
                        {promotion.title}
                      </p>

                      <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
                        {promotion.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${typeClasses(
                      promotion.type,
                    )}`}
                  >
                    {typeLabels[promotion.type] ||
                      promotion.type}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${statusClasses(
                      promotion.status,
                    )}`}
                  >
                    {promotion.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="space-y-0.5 text-[10px] text-slate-500">
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

                <td className="px-4 py-3">
                  <span className="inline-flex min-w-7 items-center justify-center rounded-md border border-white/8 bg-white/3 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                    {promotion.display_order}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-0.5">
                    <ActionButton
                      title="View promotion"
                      onClick={() => onView(promotion)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </ActionButton>

                    <ActionButton
                      title="Edit promotion"
                      onClick={() => onEdit(promotion)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </ActionButton>

                    <ActionButton
                      title={
                        promotion.status === "ACTIVE"
                          ? "Deactivate promotion"
                          : "Activate promotion"
                      }
                      onClick={() =>
                        onStatusChange(
                          promotion,
                          promotion.status === "ACTIVE"
                            ? "INACTIVE"
                            : "ACTIVE",
                        )
                      }
                      className={
                        promotion.status === "ACTIVE"
                          ? "text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300"
                          : "text-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
                      }
                    >
                      <Power className="h-3.5 w-3.5" />
                    </ActionButton>

                    <ActionButton
                      title="Delete promotion"
                      onClick={() => onDelete(promotion)}
                      className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </ActionButton>

                    <a
                      href={`/investment/promotions/${promotion.id}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open public promotion"
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/6 hover:text-white"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
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

function MobileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/6 bg-white/2 px-2.5 py-2">
      <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[10px] font-medium text-slate-300">
        {value}
      </p>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
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
      className={`rounded-lg p-1.5 text-slate-500 transition hover:bg-white/6 hover:text-white ${className}`}
    >
      {children}
    </button>
  );
}
