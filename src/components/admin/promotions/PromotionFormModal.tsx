"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  CalendarDays,
  Gift,
  ImageIcon,
  Link2,
  Megaphone,
  Save,
  X,
} from "lucide-react";

import type {
  CreatePromotionPayload,
  Promotion,
  PromotionStatus,
  PromotionType,
} from "@/src/lib/types/promotion";

import type { AdminInvestmentPlan } from "@/src/lib/types/admin";

interface PromotionFormModalProps {
  open: boolean;
  promotion?: Promotion | null;
  plans: AdminInvestmentPlan[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    payload: CreatePromotionPayload,
  ) => Promise<void>;
}

const promotionTypes: Array<{
  value: PromotionType;
  label: string;
}> = [
  {
    value: "PLAN_LAUNCH",
    label: "Plan Launch",
  },
  {
    value: "OFFER",
    label: "Offer",
  },
  {
    value: "BONUS",
    label: "Bonus Campaign",
  },
  {
    value: "ANNOUNCEMENT",
    label: "Announcement",
  },
  {
    value: "GENERAL",
    label: "General",
  },
];

const promotionStatuses: Array<{
  value: PromotionStatus;
  label: string;
}> = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
];

function toDatetimeLocal(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}

export default function PromotionFormModal({
  open,
  promotion,
  plans,
  loading = false,
  onClose,
  onSubmit,
}: PromotionFormModalProps) {
  const editing = Boolean(promotion);

  /*
   * The parent should provide a `key` based on the promotion ID
   * when switching between create/edit modes.
   *
   * This allows the form to initialize directly from the promotion
   * without using an effect that synchronously calls setState().
   */
  const [title, setTitle] = useState(
    promotion?.title ?? "",
  );

  const [description, setDescription] = useState(
    promotion?.description ?? "",
  );

  const [type, setType] = useState<PromotionType>(
    promotion?.type ?? "GENERAL",
  );

  const [planId, setPlanId] = useState(
    promotion?.plan_id ?? "",
  );

  const [image, setImage] = useState(
    promotion?.image ?? "",
  );

  const [ctaText, setCtaText] = useState(
    promotion?.cta_text ?? "",
  );

  const [ctaUrl, setCtaUrl] = useState(
    promotion?.cta_url ?? "",
  );

  const [status, setStatus] =
    useState<PromotionStatus>(
      promotion?.status ?? "DRAFT",
    );

  const [startsAt, setStartsAt] = useState(
    toDatetimeLocal(promotion?.starts_at),
  );

  const [endsAt, setEndsAt] = useState(
    toDatetimeLocal(promotion?.ends_at),
  );

  const [displayOrder, setDisplayOrder] = useState(
    String(promotion?.display_order ?? 0),
  );

  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();
    const trimmedCtaText = ctaText.trim();
    const trimmedCtaUrl = ctaUrl.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!trimmedDescription) {
      setError("Description is required.");
      return;
    }

    if (type === "PLAN_LAUNCH" && !planId) {
      setError(
        "A plan is required for a Plan Launch promotion.",
      );
      return;
    }

    const order = Number(displayOrder);

    if (!Number.isInteger(order) || order < 0) {
      setError(
        "Display order must be a non-negative integer.",
      );
      return;
    }

    let startsAtIso: string | undefined;
    let endsAtIso: string | undefined;

    if (startsAt) {
      const startDate = new Date(startsAt);

      if (Number.isNaN(startDate.getTime())) {
        setError("Please provide a valid start date.");
        return;
      }

      startsAtIso = startDate.toISOString();
    }

    if (endsAt) {
      const endDate = new Date(endsAt);

      if (Number.isNaN(endDate.getTime())) {
        setError("Please provide a valid end date.");
        return;
      }

      endsAtIso = endDate.toISOString();
    }

    if (startsAtIso && endsAtIso) {
      const startDate = new Date(startsAtIso);
      const endDate = new Date(endsAtIso);

      if (endDate <= startDate) {
        setError(
          "End date must be after start date.",
        );
        return;
      }
    }

    if (trimmedCtaUrl) {
      try {
        new URL(
          trimmedCtaUrl,
          window.location.origin,
        );
      } catch {
        setError("Please provide a valid CTA URL.");
        return;
      }
    }

    if (trimmedImage) {
      try {
        new URL(trimmedImage);
      } catch {
        setError("Please provide a valid image URL.");
        return;
      }
    }

    const payload: CreatePromotionPayload = {
      title: trimmedTitle,
      description: trimmedDescription,
      type,

      ...(planId
        ? {
            plan_id: planId,
          }
        : {}),

      ...(trimmedImage
        ? {
            image: trimmedImage,
          }
        : {}),

      ...(trimmedCtaText
        ? {
            cta_text: trimmedCtaText,
          }
        : {}),

      ...(trimmedCtaUrl
        ? {
            cta_url: trimmedCtaUrl,
          }
        : {}),

      status,

      ...(startsAtIso
        ? {
            starts_at: startsAtIso,
          }
        : {}),

      ...(endsAtIso
        ? {
            ends_at: endsAtIso,
          }
        : {}),

      display_order: order,
    };

    try {
      await onSubmit(payload);
    } catch (submitError: unknown) {
      console.error(
        "Failed to save promotion:",
        submitError,
      );

      setError(
        "Failed to save promotion. Please try again.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-4 backdrop-blur-md"
      onClick={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promotion-form-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#07111F] shadow-2xl shadow-black/40"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#07111F]/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10">
              <Megaphone className="h-5 w-5 text-purple-300" />
            </div>

            <div>
              <h2
                id="promotion-form-title"
                className="text-lg font-bold text-white"
              >
                {editing
                  ? "Edit promotion"
                  : "Create promotion"}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Create marketing content for REDIQ.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close promotion form"
            className="rounded-xl border border-white/8 bg-white/3 p-2 text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-500/15 bg-red-500/6 px-4 py-3 text-xs font-medium leading-5 text-red-300"
            >
              {error}
            </div>
          )}

          {/* Main content */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Title"
              required
              className="sm:col-span-2"
              icon={Megaphone}
            >
              <input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                maxLength={200}
                placeholder="e.g. Eagle Boost Investment Opportunity"
                className="input"
                disabled={loading}
              />
            </Field>

            <Field
              label="Description"
              required
              className="sm:col-span-2"
            >
              <textarea
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                rows={4}
                placeholder="Describe the promotion..."
                className="input resize-none"
                disabled={loading}
              />
            </Field>

            <Field label="Promotion type">
              <select
                value={type}
                onChange={(event) => {
                  setType(
                    event.target.value as PromotionType,
                  );
                }}
                className="input"
                disabled={loading}
              >
                {promotionTypes.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                    className="bg-[#07111F]"
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select
                value={status}
                onChange={(event) => {
                  setStatus(
                    event.target.value as PromotionStatus,
                  );
                }}
                className="input"
                disabled={loading}
              >
                {promotionStatuses.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                    className="bg-[#07111F]"
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Investment plan"
              className="sm:col-span-2"
              icon={Gift}
            >
              <select
                value={planId}
                onChange={(event) => {
                  setPlanId(event.target.value);
                }}
                className="input"
                disabled={loading}
              >
                <option
                  value=""
                  className="bg-[#07111F]"
                >
                  No linked plan â€” standalone promotion
                </option>

                {plans.map((plan) => (
                  <option
                    key={plan.id}
                    value={plan.id}
                    className="bg-[#07111F]"
                  >
                    {plan.name} â€” {plan.status}
                  </option>
                ))}
              </select>

              <p className="mt-1.5 text-[11px] text-slate-600">
                Draft plans can also be promoted before
                publication.
              </p>
            </Field>

            <Field
              label="Image URL"
              className="sm:col-span-2"
              icon={ImageIcon}
            >
              <input
                value={image}
                onChange={(event) => {
                  setImage(event.target.value);
                }}
                type="url"
                placeholder="https://..."
                className="input"
                disabled={loading}
              />
            </Field>

            <Field label="CTA text" icon={Gift}>
              <input
                value={ctaText}
                onChange={(event) => {
                  setCtaText(event.target.value);
                }}
                placeholder="Explore now"
                maxLength={100}
                className="input"
                disabled={loading}
              />
            </Field>

            <Field label="CTA URL" icon={Link2}>
              <input
                value={ctaUrl}
                onChange={(event) => {
                  setCtaUrl(event.target.value);
                }}
                placeholder="/investment"
                className="input"
                disabled={loading}
              />
            </Field>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-purple-300" />

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Promotion schedule
                </h3>

                <p className="mt-0.5 text-[11px] text-slate-600">
                  Optional dates control when the promotion
                  runs.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Starts at">
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(event) => {
                    setStartsAt(event.target.value);
                  }}
                  className="input"
                  disabled={loading}
                />
              </Field>

              <Field label="Ends at">
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(event) => {
                    setEndsAt(event.target.value);
                  }}
                  className="input"
                  disabled={loading}
                />
              </Field>

              <Field label="Display order">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={displayOrder}
                  onChange={(event) => {
                    setDisplayOrder(
                      event.target.value,
                    );
                  }}
                  className="input"
                  disabled={loading}
                />
              </Field>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/8 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/3 px-5 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />

                  {editing
                    ? "Save changes"
                    : "Create promotion"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  className = "",
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  icon?: typeof Gift;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        {Icon && (
          <Icon className="h-3.5 w-3.5 text-slate-600" />
        )}

        <span>{label}</span>

        {required && (
          <span className="text-red-400">*</span>
        )}
      </label>

      <div className="mt-1.5">{children}</div>
    </div>
  );
}
