"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Gift,
  ImageIcon,
  Info,
  Link2,
  Megaphone,
  Save,
  Sparkles,
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
    const trimmedDescription =
      description.trim();
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
        setError(
          "Please provide a valid start date.",
        );
        return;
      }

      startsAtIso = startDate.toISOString();
    }

    if (endsAt) {
      const endDate = new Date(endsAt);

      if (Number.isNaN(endDate.getTime())) {
        setError(
          "Please provide a valid end date.",
        );
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
        setError(
          "Please provide a valid CTA URL.",
        );
        return;
      }
    }

    if (trimmedImage) {
      try {
        new URL(trimmedImage);
      } catch {
        setError(
          "Please provide a valid image URL.",
        );
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#020617]/80 p-0 backdrop-blur-md sm:items-center sm:p-4"
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
        className="flex max-h-[96vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[26px] border border-white/10 bg-[#07111F] shadow-2xl shadow-black/50 sm:rounded-[26px]"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-white/8 bg-[#07111F] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10">
                {editing ? (
                  <Megaphone className="h-5 w-5 text-purple-300" />
                ) : (
                  <Sparkles className="h-5 w-5 text-purple-300" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="promotion-form-title"
                    className="truncate text-lg font-bold tracking-tight text-white sm:text-xl"
                  >
                    {editing
                      ? "Edit promotion"
                      : "Create promotion"}
                  </h2>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      editing
                        ? "bg-blue-400/10 text-blue-300"
                        : "bg-emerald-400/10 text-emerald-300"
                    }`}
                  >
                    {editing ? "Editing" : "New"}
                  </span>
                </div>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                  {editing
                    ? "Update the promotion content, targeting, schedule, and visibility."
                    : "Create a polished marketing promotion for the REDIQ platform."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close promotion form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-4 p-3.5 sm:space-y-5 sm:p-5">
            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-500/15 bg-red-500/6 p-3.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                  <Info className="h-4 w-4 text-red-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-red-300">
                    Please check the form
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-red-400/80">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Basic information */}
            <FormSection
              icon={Megaphone}
              title="Basic information"
              description="Define how this promotion appears to users."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Promotion title"
                  required
                  className="sm:col-span-2"
                >
                  <input
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                    maxLength={200}
                    placeholder="e.g. Eagle Boost Investment Opportunity"
                    className="input w-full"
                    disabled={loading}
                  />

                  <div className="mt-1 flex justify-end">
                    <span className="text-[10px] text-slate-600">
                      {title.length}/200
                    </span>
                  </div>
                </Field>

                <Field
                  label="Description"
                  required
                  className="sm:col-span-2"
                >
                  <textarea
                    value={description}
                    onChange={(event) => {
                      setDescription(
                        event.target.value,
                      );
                    }}
                    rows={4}
                    placeholder="Describe the promotion, opportunity, offer, or announcement..."
                    className="input min-h-44 w-full resize-y"
                    disabled={loading}
                  />
                </Field>

                <Field label="Promotion type">
                  <select
                    value={type}
                    onChange={(event) => {
                      setType(
                        event.target
                          .value as PromotionType,
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

                <Field label="Visibility status">
                  <select
                    value={status}
                    onChange={(event) => {
                      setStatus(
                        event.target
                          .value as PromotionStatus,
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
              </div>
            </FormSection>

            {/* Plan targeting */}
            <FormSection
              icon={Gift}
              title="Promotion targeting"
              description="Optionally connect this promotion to an investment plan."
            >
              <div className="rounded-2xl border border-purple-400/10 bg-purple-400/[0.035] p-3.5 sm:p-4">
                <Field
                  label="Investment plan"
                  hint={
                    type === "PLAN_LAUNCH"
                      ? "Required for Plan Launch promotions."
                      : "Optional. Standalone promotions do not need a linked plan."
                  }
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
                      No linked plan — standalone promotion
                    </option>

                    {plans.map((plan) => (
                      <option
                        key={plan.id}
                        value={plan.id}
                        className="bg-[#07111F]"
                      >
                        {plan.name} — {plan.status}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/6 bg-white/2.5 px-3 py-2.5">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />

                  <p className="text-[11px] leading-5 text-slate-500">
                    Draft plans can also be promoted
                    before publication.
                  </p>
                </div>
              </div>
            </FormSection>

            {/* Creative */}
            <FormSection
              icon={ImageIcon}
              title="Creative & call to action"
              description="Add imagery and guide users toward the intended destination."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Image URL"
                  className="sm:col-span-2"
                  hint="Optional. Use a publicly accessible image URL."
                >
                  <div className="relative">
                    <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                    <input
                      value={image}
                      onChange={(event) => {
                        setImage(event.target.value);
                      }}
                      type="url"
                      placeholder="https://example.com/promotion.jpg"
                      className="input pl-10 w-full"
                      disabled={loading}
                    />
                  </div>
                </Field>

                <Field
                  label="CTA text"
                  icon={Gift}
                  hint="Example: Explore now"
                >
                  <input
                    value={ctaText}
                    onChange={(event) => {
                      setCtaText(event.target.value);
                    }}
                    placeholder="Explore now"
                    maxLength={100}
                    className="input w-full"
                    disabled={loading}
                  />
                </Field>

                <Field
                  label="CTA URL"
                  icon={Link2}
                  hint="Example: /investment"
                >
                  <input
                    value={ctaUrl}
                    onChange={(event) => {
                      setCtaUrl(event.target.value);
                    }}
                    placeholder="/investment"
                    className="input w-full"
                    disabled={loading}
                  />
                </Field>
              </div>
            </FormSection>

            {/* Schedule */}
            <FormSection
              icon={CalendarDays}
              title="Schedule & ordering"
              description="Control when the promotion runs and where it appears."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Starts at">
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(event) => {
                      setStartsAt(
                        event.target.value,
                      );
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
                      setEndsAt(
                        event.target.value,
                      );
                    }}
                    className="input"
                    disabled={loading}
                  />
                </Field>

                <Field
                  label="Display order"
                  hint="Lower numbers appear first."
                >
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
            </FormSection>

            {/* Footer spacer */}
            <div className="h-1" />
          </div>

          {/* Sticky footer */}
          <div className="sticky bottom-0 z-20 border-t border-white/8 bg-[#07111F]/95 px-3.5 py-3 backdrop-blur-xl sm:px-5">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden items-center gap-2 text-[11px] text-slate-600 sm:flex">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/70" />
                <span>
                  Changes are saved when you submit.
                </span>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="min-h-10 rounded-xl border border-white/10 bg-white/3 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Gift;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/7 bg-white/[0.018]">
      <div className="border-b border-white/6 px-3.5 py-3 sm:px-4">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/4.5">
            <Icon className="h-4 w-4 text-purple-300" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">
              {title}
            </h3>

            <p className="mt-0.5 text-[11px] leading-5 text-slate-600">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-3.5 sm:p-4">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required = false,
  className = "",
  icon: Icon,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  icon?: typeof Gift;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2">
        <label className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-slate-300">
          {Icon && (
            <Icon className="h-3.5 w-3.5 shrink-0 text-slate-600" />
          )}

          <span>{label}</span>

          {required && (
            <span className="text-red-400">*</span>
          )}
        </label>
      </div>

      <div className="mt-1.5">
        {children}
      </div>

      {hint && (
        <p className="mt-1.5 text-[10px] leading-4 text-slate-600">
          {hint}
        </p>
      )}
    </div>
  );
}