'use client';

import {
  FormEvent,
  useState,
} from 'react';

import { X } from 'lucide-react';

import type { AdminInvestmentPlan } from '@/src/lib/types/admin';

import type {
  CreateInvestmentPlanRequest,
  UpdateInvestmentPlanRequest,
} from '@/src/lib/types/admin';

interface PlanFormModalProps {
  plan: AdminInvestmentPlan | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    data:
      | CreateInvestmentPlanRequest
      | UpdateInvestmentPlanRequest,
  ) => Promise<void>;
}

export default function PlanFormModal({
  plan,
  saving,
  onClose,
  onSubmit,
}: PlanFormModalProps) {
  const editing = plan !== null;

  const [name, setName] = useState(plan?.name ?? '');
  const [description, setDescription] = useState(
    plan?.description ?? '',
  );
  const [image, setImage] = useState(plan?.image ?? '');
  const [minimumAmount, setMinimumAmount] = useState(
    plan ? String(plan.minimumAmount) : '',
  );
  const [durationDays, setDurationDays] = useState(
    plan ? String(plan.durationDays) : '',
  );
  const [expectedReturnRate, setExpectedReturnRate] =
    useState(plan ? String(plan.expectedReturnRate) : '');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(
    plan?.status ?? 'DRAFT',
  );
  const [featured, setFeatured] = useState(
    plan?.featured ?? false,
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();

    const minimum = Number(minimumAmount);
    const duration = Number(durationDays);
    const returnRate = Number(expectedReturnRate);

    if (!trimmedName || !trimmedDescription) {
      return;
    }

    if (!Number.isFinite(minimum) || minimum <= 0) {
      return;
    }

    if (!Number.isFinite(duration) || duration < 0) {
      return;
    }

    if (!Number.isFinite(returnRate) || returnRate < 0) {
      return;
    }

    const payload = {
      name: trimmedName,
      description: trimmedDescription,
      image: trimmedImage,
      minimum_amount: minimum,
      duration_days: duration,
      expected_return_rate: returnRate,
      status,
      featured,
    };

    if (editing) {
      await onSubmit(
        payload as UpdateInvestmentPlanRequest,
      );
    } else {
      await onSubmit(
        payload as CreateInvestmentPlanRequest,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
      <div className="flex max-h-[96vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#07182F] shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white sm:text-lg">
              {editing
                ? 'Edit Investment Plan'
                : 'Create Investment Plan'}
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
              {editing
                ? 'Update the investment plan configuration.'
                : 'New plans start as drafts unless published.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 sm:h-9 sm:w-9"
            aria-label="Close plan form"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
        >
          <div className="space-y-4 sm:space-y-5">
            <Field label="Name">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={255}
                required
                className={inputClass}
                placeholder="e.g. Genesis Spark"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
                required
                className={`${inputClass} resize-none`}
                placeholder="Describe the investment plan..."
              />
            </Field>

            <Field label="Image URL">
              <input
                value={image}
                onChange={(event) => setImage(event.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <Field label="Minimum USDT">
                <input
                  type="number"
                  min="0.000001"
                  step="any"
                  value={minimumAmount}
                  onChange={(event) =>
                    setMinimumAmount(event.target.value)
                  }
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Duration Days">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={durationDays}
                  onChange={(event) =>
                    setDurationDays(event.target.value)
                  }
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Return Rate %">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={expectedReturnRate}
                  onChange={(event) =>
                    setExpectedReturnRate(event.target.value)
                  }
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Field label="Status">
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as
                        | 'DRAFT'
                        | 'PUBLISHED',
                    )
                  }
                  className={selectClass}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </Field>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-3 py-3 sm:px-4">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(event.target.checked)
                  }
                  className="h-4 w-4 shrink-0"
                />

                <span className="min-w-0">
                  <span className="block text-xs font-medium text-white sm:text-sm">
                    Featured plan
                  </span>

                  <span className="block text-[10px] leading-4 text-gray-500 sm:text-xs">
                    Highlight this plan in the investor UI.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="min-h-10 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50 sm:min-h-11"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="min-h-10 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#07182F] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-11"
            >
              {saving
                ? 'Saving...'
                : editing
                  ? 'Save Changes'
                  : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/20 sm:px-4 sm:py-3';

const selectClass =
  'w-full rounded-xl border border-white/10 bg-[#0C2244] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20 sm:px-4 sm:py-3';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
        {label}
      </label>
      {children}
    </div>
  );
}
