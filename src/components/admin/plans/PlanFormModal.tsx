
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

  const [name, setName] = useState(
    plan?.name ?? '',
  );

  const [description, setDescription] = useState(
    plan?.description ?? '',
  );

  const [image, setImage] = useState(
    plan?.image ?? '',
  );

  const [minimumAmount, setMinimumAmount] =
    useState(
      plan
        ? String(plan.minimumAmount)
        : '',
    );

  const [durationDays, setDurationDays] =
    useState(
      plan
        ? String(plan.durationDays)
        : '',
    );

  const [expectedReturnRate, setExpectedReturnRate] =
    useState(
      plan
        ? String(plan.expectedReturnRate)
        : '',
    );

  const [status, setStatus] = useState<
    'DRAFT' | 'PUBLISHED'
  >(
    plan?.status ?? 'DRAFT',
  );

  const [featured, setFeatured] =
    useState(
      plan?.featured ?? false,
    );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();
    const trimmedImage = image.trim();

    const minimum = Number(
      minimumAmount,
    );

    const duration = Number(
      durationDays,
    );

    const returnRate = Number(
      expectedReturnRate,
    );

    if (!trimmedName) {
      return;
    }

    if (!trimmedDescription) {
      return;
    }

    if (
      !Number.isFinite(minimum) ||
      minimum <= 0
    ) {
      return;
    }

    if (
      !Number.isFinite(duration) ||
      duration < 0
    ) {
      return;
    }

    if (
      !Number.isFinite(returnRate) ||
      returnRate < 0
    ) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#07182F] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {editing
                ? 'Edit Investment Plan'
                : 'Create Investment Plan'}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {editing
                ? 'Update the investment plan configuration.'
                : 'New plans start as drafts unless published.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={255}
              required
              className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/20"
              placeholder="e.g. Genesis Spark"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={4}
              required
              className="w-full resize-none rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/20"
              placeholder="Describe the investment plan..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Image URL
            </label>

            <input
              value={image}
              onChange={(event) =>
                setImage(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/20"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Minimum USDT
              </label>

              <input
                type="number"
                min="0.000001"
                step="any"
                value={minimumAmount}
                onChange={(event) =>
                  setMinimumAmount(
                    event.target.value,
                  )
                }
                required
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Duration Days
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={durationDays}
                onChange={(event) =>
                  setDurationDays(
                    event.target.value,
                  )
                }
                required
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Return Rate %
              </label>

              <input
                type="number"
                min="0"
                step="any"
                value={expectedReturnRate}
                onChange={(event) =>
                  setExpectedReturnRate(
                    event.target.value,
                  )
                }
                required
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | 'DRAFT'
                      | 'PUBLISHED',
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#0C2244] px-4 py-3 text-sm text-white outline-none focus:border-white/20"
              >
                <option value="DRAFT">
                  Draft
                </option>

                <option value="PUBLISHED">
                  Published
                </option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-4 py-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(
                    event.target.checked,
                  )
                }
                className="h-4 w-4"
              />

              <span>
                <span className="block text-sm font-medium text-white">
                  Featured plan
                </span>

                <span className="block text-xs text-gray-500">
                  Highlight this plan in the investor UI.
                </span>
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#07182F] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
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