
// src/app/admin/promotions/page.tsx

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Megaphone,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import AdminPromotionsTable from "@/src/components/admin/promotions/AdminPromotionsTable";
import PromotionDetailsModal from "@/src/components/admin/promotions/PromotionDetailsModal";
import PromotionFormModal from "@/src/components/admin/promotions/PromotionFormModal";
import AdminDashboard from '@/src/components/admin/AdminDashboard';

import { adminApi } from "@/src/lib/api/admin";
import promotionsApi from "@/src/lib/api/promotionsApi";

import type { AdminInvestmentPlan } from "@/src/lib/types/admin";
import type {
  CreatePromotionPayload,
  Promotion,
} from "@/src/lib/types/promotion";

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: unknown;
            error?: unknown;
          };
        };
      }
    ).response;

    const message =
      response?.data?.message ??
      response?.data?.error;

    if (
      typeof message === "string" &&
      message.trim()
    ) {
      return message;
    }
  }

  return fallback;
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] =
    useState<Promotion[]>([]);

  const [plans, setPlans] =
    useState<AdminInvestmentPlan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingPromotion, setEditingPromotion] =
    useState<Promotion | null>(null);

  const [detailsPromotion, setDetailsPromotion] =
    useState<Promotion | null>(null);

  const loadData = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");
        setSuccessMessage("");

        const [
          promotionsData,
          plansData,
        ] = await Promise.all([
          promotionsApi.list(),
          adminApi.listPlans(),
        ]);

        setPromotions(promotionsData);
        setPlans(plansData);
      } catch (loadError: unknown) {
        console.error(
          "Failed to load admin promotion data:",
          loadError,
        );

        setError(
          getErrorMessage(
            loadError,
            "Failed to load promotions. Please refresh and try again.",
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          promotionsData,
          plansData,
        ] = await Promise.all([
          promotionsApi.list(),
          adminApi.listPlans(),
        ]);

        if (cancelled) return;

        setPromotions(promotionsData);
        setPlans(plansData);
      } catch (loadError: unknown) {
        if (cancelled) return;

        console.error(
          "Failed to load admin promotion data:",
          loadError,
        );

        setError(
          getErrorMessage(
            loadError,
            "Failed to load promotions. Please refresh and try again.",
          ),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = () => {
    setEditingPromotion(null);
    setFormOpen(true);
  };

  const handleEdit = (
    promotion: Promotion,
  ) => {
    setEditingPromotion(promotion);
    setFormOpen(true);
  };

  const handleSubmit = async (
    payload: CreatePromotionPayload,
  ) => {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingPromotion) {
        await promotionsApi.update(
          editingPromotion.id,
          payload,
        );

        setSuccessMessage(
          "Promotion updated successfully.",
        );
      } else {
        await promotionsApi.create(payload);

        setSuccessMessage(
          "Promotion created successfully.",
        );
      }

      setFormOpen(false);
      setEditingPromotion(null);

      await loadData();
    } catch (submitError: unknown) {
      console.error(
        "Failed to save promotion:",
        submitError,
      );

      throw submitError;
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    promotion: Promotion,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const action =
      status === "ACTIVE"
        ? "activate"
        : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${promotion.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await promotionsApi.updateStatus(
        promotion.id,
        { status },
      );

      setSuccessMessage(
        status === "ACTIVE"
          ? "Promotion activated successfully."
          : "Promotion deactivated successfully.",
      );

      await loadData();
    } catch (statusError: unknown) {
      console.error(
        "Failed to update promotion status:",
        statusError,
      );

      setError(
        getErrorMessage(
          statusError,
          "Failed to update promotion status.",
        ),
      );
    }
  };

  const handleDelete = async (
    promotion: Promotion,
  ) => {
    const confirmed = window.confirm(
      `Delete "${promotion.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await promotionsApi.remove(
        promotion.id,
      );

      setSuccessMessage(
        "Promotion deleted successfully.",
      );

      await loadData();
    } catch (deleteError: unknown) {
      console.error(
        "Failed to delete promotion:",
        deleteError,
      );

      setError(
        getErrorMessage(
          deleteError,
          "Failed to delete promotion.",
        ),
      );
    }
  };

  const activeCount = promotions.filter(
    (promotion) =>
      promotion.status === "ACTIVE",
  ).length;

  const draftCount = promotions.filter(
    (promotion) =>
      promotion.status === "DRAFT",
  ).length;

  const inactiveCount = promotions.filter(
    (promotion) =>
      promotion.status === "INACTIVE",
  ).length;

  return (
    <AdminDashboard title="Promotions">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-6">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10">
                <Megaphone className="h-4 w-4 text-purple-300" />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-300">
                Marketing
              </p>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
              Promotions
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
              Create and manage platform promotions,
              investment opportunities, offers, and
              marketing campaigns.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                void loadData(true)
              }
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
            >
              <Plus className="h-4 w-4" />
              Create promotion
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Megaphone}
            label="Total promotions"
            value={promotions.length.toLocaleString()}
            description="Loaded promotions"
            tone="purple"
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Active"
            value={activeCount.toLocaleString()}
            description="Currently active"
            tone="emerald"
          />

          <SummaryCard
            icon={AlertCircle}
            label="Draft"
            value={draftCount.toLocaleString()}
            description="Not yet published"
            tone="amber"
          />

          <SummaryCard
            icon={XCircle}
            label="Inactive"
            value={inactiveCount.toLocaleString()}
            description="Currently disabled"
            tone="slate"
          />
        </div>

        {/* Feedback */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/15 bg-red-500/6 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <XCircle className="h-4 w-4 text-red-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-300">
                Something went wrong
              </p>

              <p className="mt-1 text-xs leading-5 text-red-400/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {successMessage && !error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/6 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Success
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-400/80">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="mt-6">
          <AdminPromotionsTable
            promotions={promotions}
            loading={loading}
            onView={(promotion) =>
              setDetailsPromotion(promotion)
            }
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Create / Edit */}
      <PromotionFormModal
        key={
          editingPromotion?.id ??
          (formOpen ? "create" : "closed")
        }
        open={formOpen}
        promotion={editingPromotion}
        plans={plans}
        loading={saving}
        onClose={() => {
          if (!saving) {
            setFormOpen(false);
            setEditingPromotion(null);
          }
        }}
        onSubmit={handleSubmit}
      />

      {/* Details */}
      <PromotionDetailsModal
        open={Boolean(detailsPromotion)}
        promotion={detailsPromotion}
        onClose={() =>
          setDetailsPromotion(null)
        }
      />
    </AdminDashboard>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: typeof Megaphone;
  label: string;
  value: string;
  description: string;
  tone: "purple" | "emerald" | "amber" | "slate";
}) {
  const toneStyles = {
    purple: {
      icon: "bg-purple-400/10 text-purple-300",
      border: "border-purple-400/10",
    },
    emerald: {
      icon: "bg-emerald-400/10 text-emerald-300",
      border: "border-emerald-400/10",
    },
    amber: {
      icon: "bg-amber-400/10 text-amber-300",
      border: "border-amber-400/10",
    },
    slate: {
      icon: "bg-slate-400/10 text-slate-400",
      border: "border-slate-400/10",
    },
  }[tone];

  return (
    <div
      className={`rounded-2xl border bg-[#07111F] p-4 shadow-xl shadow-black/5 ${toneStyles.border}`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneStyles.icon}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Promotions
        </span>
      </div>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        {description}
      </p>
    </div>
  );
}