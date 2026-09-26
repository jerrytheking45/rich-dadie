
'use client';

import { useEffect, useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import axios from 'axios';

import { adminApi, superadminApi } from '@/src/lib/api/admin';

import type {
  AdminInvestmentPlan,
  AdminPlanWithInvestors,
  CreateInvestmentPlanRequest,
  UpdateInvestmentPlanRequest,
} from '@/src/lib/types/admin';

import AdminPlansTable from './AdminPlansTable';
import PlanDetailsModal from './PlanDetailsModal';
import PlanFormModal from './PlanFormModal';
import PlanInvestorsModal from './PlanInvestorsModal';

interface PlanManagementProps {
  superAdmin?: boolean;
}

export default function PlanManagement({
  superAdmin = false,
}: PlanManagementProps) {
  const [plans, setPlans] = useState<AdminInvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [investorsLoading, setInvestorsLoading] =
    useState(false);

  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'DRAFT' | 'PUBLISHED'
  >('ALL');

  const [selectedPlan, setSelectedPlan] =
    useState<AdminInvestmentPlan | null>(null);

  const [formPlan, setFormPlan] =
    useState<AdminInvestmentPlan | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [investorData, setInvestorData] =
    useState<AdminPlanWithInvestors | null>(null);

  const [showInvestors, setShowInvestors] =
    useState(false);

  // ---------------------------------------------------------------------------
  // Initial plan loading
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const fetchPlans = async () => {
      try {
        const result = await adminApi.listPlans();

        if (cancelled) {
          return;
        }

        setPlans(result);
        setError('');
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load investment plans:',
          err,
        );

        setError(
          getErrorMessage(
            err,
            'Failed to load investment plans.',
          ),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchPlans();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Refresh plans
  // ---------------------------------------------------------------------------

  const handleRefresh = async () => {
    if (actionLoading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await adminApi.listPlans();
      setPlans(result);
    } catch (err) {
      console.error(
        'Failed to refresh investment plans:',
        err,
      );

      setError(
        getErrorMessage(
          err,
          'Failed to refresh investment plans.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // View investors
  // ---------------------------------------------------------------------------

  const handleViewInvestors = async (
    plan: AdminInvestmentPlan,
  ) => {
    setShowInvestors(true);
    setInvestorData(null);
    setInvestorsLoading(true);
    setError('');

    try {
      const result = await adminApi.getPlanInvestors(
        plan.id,
      );

      setInvestorData(result);
    } catch (err) {
      console.error(
        'Failed to load plan investors:',
        err,
      );

      setError(
        getErrorMessage(
          err,
          'Failed to load plan investors.',
        ),
      );

      setShowInvestors(false);
    } finally {
      setInvestorsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Create plan
  // ---------------------------------------------------------------------------

  const handleCreate = () => {
    if (!superAdmin) {
      return;
    }

    setFormPlan(null);
    setShowForm(true);
  };

  // ---------------------------------------------------------------------------
  // Edit plan
  // ---------------------------------------------------------------------------

  const handleEdit = (plan: AdminInvestmentPlan) => {
    if (!superAdmin) {
      return;
    }

    setFormPlan(plan);
    setShowForm(true);
  };

  // ---------------------------------------------------------------------------
  // Create / update plan
  // ---------------------------------------------------------------------------

  const handleSavePlan = async (
    data:
      | CreateInvestmentPlanRequest
      | UpdateInvestmentPlanRequest,
  ) => {
    if (!superAdmin) {
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      if (formPlan) {
        await superadminApi.updatePlan(
          formPlan.id,
          data as UpdateInvestmentPlanRequest,
        );
      } else {
        await superadminApi.createPlan(
          data as CreateInvestmentPlanRequest,
        );
      }

      setShowForm(false);
      setFormPlan(null);

      await handleRefresh();
    } catch (err) {
      console.error(
        'Failed to save investment plan:',
        err,
      );

      setError(
        getErrorMessage(
          err,
          'Failed to save investment plan.',
        ),
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Publish / unpublish plan
  // ---------------------------------------------------------------------------

  const handlePublish = async (
    plan: AdminInvestmentPlan,
  ) => {
    if (!superAdmin) {
      return;
    }

    const published = plan.status !== 'PUBLISHED';

    const action = published
      ? 'publish'
      : 'unpublish';

    const confirmed = window.confirm(
      published
        ? `Publish "${plan.name}"? Investors will be able to invest in this plan.`
        : `Unpublish "${plan.name}"? New investments will no longer be allowed.`,
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      await superadminApi.publishPlan(plan.id, {
        published,
      });

      await handleRefresh();
    } catch (err) {
      console.error(
        `Failed to ${action} investment plan:`,
        err,
      );

      setError(
        getErrorMessage(
          err,
          `Failed to ${action} investment plan.`,
        ),
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete plan
  // ---------------------------------------------------------------------------

  const handleDelete = async (
    plan: AdminInvestmentPlan,
  ) => {
    if (!superAdmin) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${plan.name}"?\n\nThis cannot be undone. Plans with investment history cannot be deleted.`,
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      await superadminApi.deletePlan(plan.id);

      await handleRefresh();
    } catch (err) {
      console.error(
        'Failed to delete investment plan:',
        err,
      );

      setError(
        getErrorMessage(
          err,
          'Failed to delete investment plan.',
        ),
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredPlans = plans.filter((plan) => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch ||
      plan.name
        .toLowerCase()
        .includes(normalizedSearch) ||
      plan.description
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesStatus =
      statusFilter === 'ALL' ||
      plan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Investment Plans
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {superAdmin
              ? 'Create, edit, publish and manage investment plans.'
              : 'View investment plans and their investors.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={loading || actionLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={[
                'h-4 w-4',
                loading ? 'animate-spin' : '',
              ].join(' ')}
            />
            Refresh
          </button>

          {superAdmin && (
            <button
              type="button"
              onClick={handleCreate}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#07182F] transition hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Create Plan
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError('')}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search plans..."
            className="w-full rounded-xl border border-white/10 bg-white/3 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | 'ALL'
                | 'DRAFT'
                | 'PUBLISHED',
            )
          }
          className="rounded-xl border border-white/10 bg-[#0C2244] px-4 py-2.5 text-sm text-white outline-none"
        >
          <option value="ALL">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">
            Published
          </option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-white/10 p-10 text-center">
          <p className="text-sm text-gray-400">
            Loading investment plans...
          </p>
        </div>
      ) : (
        <AdminPlansTable
          plans={filteredPlans}
          superAdmin={superAdmin}
          onView={setSelectedPlan}
          onViewInvestors={(plan) =>
            void handleViewInvestors(plan)
          }
          onEdit={
            superAdmin
              ? handleEdit
              : undefined
          }
          onPublish={
            superAdmin
              ? (plan) =>
                  void handlePublish(plan)
              : undefined
          }
          onDelete={
            superAdmin
              ? (plan) =>
                  void handleDelete(plan)
              : undefined
          }
        />
      )}

      {!loading && (
        <div className="text-xs text-gray-500">
          Showing {filteredPlans.length} of{' '}
          {plans.length} plans
        </div>
      )}

      <PlanDetailsModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />

      {showInvestors && (
        <PlanInvestorsModal
          data={investorData}
          loading={investorsLoading}
          onClose={() => {
            setShowInvestors(false);
            setInvestorData(null);
          }}
        />
      )}

      {showForm && superAdmin && (
        <PlanFormModal
          key={formPlan?.id ?? 'new'}
          plan={formPlan}
          saving={actionLoading}
          onClose={() => {
            if (!actionLoading) {
              setShowForm(false);
              setFormPlan(null);
            }
          }}
          onSubmit={handleSavePlan}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Error handling
// -----------------------------------------------------------------------------

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      return data.message;
    }

    if (
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof data.error === 'string'
    ) {
      return data.error;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}