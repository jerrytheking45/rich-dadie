
"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  platformSettingsApi,
} from "@/src/lib/api/platformSettings";

import type {
  CreatePlatformSettingRequest,
  PlatformSetting,
  PlatformSettingCategory,
  PlatformSettingValueType,
  UpdatePlatformSettingRequest,
} from "@/src/lib/types/platformSettings";

const categories: Array<{
  value: PlatformSettingCategory;
  label: string;
}> = [
  {
    value: "GENERAL",
    label: "General",
  },
  {
    value: "INVESTMENT",
    label: "Investment",
  },
  {
    value: "DEPOSITS",
    label: "Deposits",
  },
  {
    value: "WITHDRAWALS",
    label: "Withdrawals",
  },
  {
    value: "BONUSES",
    label: "Bonuses",
  },
  {
    value: "SECURITY",
    label: "Security",
  },
  {
    value: "NOTIFICATIONS",
    label: "Notifications",
  },
  {
    value: "BLOCKCHAIN",
    label: "Blockchain",
  },
];

const valueTypes: Array<{
  value: PlatformSettingValueType;
  label: string;
}> = [
  {
    value: "STRING",
    label: "String",
  },
  {
    value: "INTEGER",
    label: "Integer",
  },
  {
    value: "DECIMAL",
    label: "Decimal",
  },
  {
    value: "BOOLEAN",
    label: "Boolean",
  },
  {
    value: "JSON",
    label: "JSON",
  },
];

const categoryLabels = Object.fromEntries(
  categories.map((item) => [
    item.value,
    item.label,
  ]),
) as Record<PlatformSettingCategory, string>;

const valueTypeLabels = Object.fromEntries(
  valueTypes.map((item) => [
    item.value,
    item.label,
  ]),
) as Record<PlatformSettingValueType, string>;

interface FormState {
  key: string;
  value: string;
  value_type: PlatformSettingValueType;
  category: PlatformSettingCategory;
  description: string;
  is_public: boolean;
}

const emptyForm: FormState = {
  key: "",
  value: "",
  value_type: "STRING",
  category: "GENERAL",
  description: "",
  is_public: false,
};

function settingToForm(
  setting: PlatformSetting,
): FormState {
  return {
    key: setting.key,
    value: setting.value,
    value_type: setting.value_type,
    category: setting.category,
    description: setting.description,
    is_public: setting.is_public,
  };
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "â€”";
  }

  return date.toLocaleString();
}

function valuePreview(
  setting: PlatformSetting,
): string {
  if (setting.value_type === "BOOLEAN") {
    return setting.value === "true"
      ? "Enabled"
      : "Disabled";
  }

  if (setting.value_type === "JSON") {
    return setting.value.length > 100
      ? `${setting.value.slice(0, 100)}â€¦`
      : setting.value;
  }

  return setting.value;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    error &&
    typeof error === "object"
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

    if (
      typeof response?.data?.message ===
      "string"
    ) {
      return response.data.message;
    }

    if (
      typeof response?.data?.error ===
      "string"
    ) {
      return response.data.error;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function PlatformSettingsManagement() {
  const [settings, setSettings] = useState<
    PlatformSetting[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingKey, setDeletingKey] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState<
      PlatformSettingCategory | "ALL"
    >("ALL");

  const [openCategories, setOpenCategories] =
    useState<Record<string, boolean>>({});

  const [editingKey, setEditingKey] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const loadSettings = useCallback(
    async (): Promise<void> => {
      setLoading(true);
      setError("");

      try {
        const result =
          await platformSettingsApi.list();

        setSettings(result);

        setOpenCategories((current) => {
          const next = { ...current };

          for (const category of categories) {
            if (
              !(category.value in next)
            ) {
              next[category.value] = true;
            }
          }

          return next;
        });
      } catch (loadError: unknown) {
        console.error(
          "Failed to load platform settings:",
          loadError,
        );

        setError(
          getErrorMessage(
            loadError,
            "Failed to load platform settings.",
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const load = async () => {
      await loadSettings();
    };

    void load();
  }, [loadSettings]);

  const filteredSettings = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return settings.filter((setting) => {
      if (
        activeCategory !== "ALL" &&
        setting.category !== activeCategory
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        setting.key
          .toLowerCase()
          .includes(query) ||
        setting.description
          .toLowerCase()
          .includes(query) ||
        setting.value
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    settings,
    search,
    activeCategory,
  ]);

  const groupedSettings = useMemo(() => {
    const groups = new Map<
      PlatformSettingCategory,
      PlatformSetting[]
    >();

    for (const category of categories) {
      groups.set(category.value, []);
    }

    for (const setting of filteredSettings) {
      groups
        .get(setting.category)
        ?.push(setting);
    }

    return groups;
  }, [filteredSettings]);

  const publicCount = useMemo(
    () =>
      settings.filter(
        (setting) => setting.is_public,
      ).length,
    [settings],
  );

  const beginCreate = (): void => {
    setEditingKey("__create__");
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  const beginEdit = (
    setting: PlatformSetting,
  ): void => {
    setEditingKey(setting.key);
    setForm(settingToForm(setting));
    setError("");
    setSuccess("");
  };

  const closeForm = (): void => {
    if (saving) {
      return;
    }

    setEditingKey(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const key = form.key
      .trim()
      .toLowerCase();

    const value = form.value.trim();
    const description =
      form.description.trim();

    if (!key) {
      setError("Setting key is required.");
      return;
    }

    if (!value) {
      setError("Setting value is required.");
      return;
    }

    if (!description) {
      setError(
        "Description is required.",
      );
      return;
    }

    if (
      form.value_type === "INTEGER" &&
      !/^-?\d+$/.test(value)
    ) {
      setError(
        "Integer settings must contain a whole number.",
      );
      return;
    }

    if (
      form.value_type === "DECIMAL" &&
      !Number.isFinite(Number(value))
    ) {
      setError(
        "Decimal settings must contain a valid number.",
      );
      return;
    }

    if (
      form.value_type === "BOOLEAN" &&
      value !== "true" &&
      value !== "false"
    ) {
      setError(
        "Boolean settings must be true or false.",
      );
      return;
    }

    if (form.value_type === "JSON") {
      try {
        JSON.parse(value);
      } catch {
        setError(
          "JSON settings must contain valid JSON.",
        );
        return;
      }
    }

    setSaving(true);

    try {
      if (editingKey === "__create__") {
        const payload: CreatePlatformSettingRequest =
          {
            key,
            value,
            value_type:
              form.value_type,
            category: form.category,
            description,
            is_public: form.is_public,
          };

        const created =
          await platformSettingsApi.create(
            payload,
          );

        setSettings((current) =>
          [...current, created].sort(
            (a, b) =>
              a.key.localeCompare(b.key),
          ),
        );

        setSuccess(
          "Platform setting created successfully.",
        );
      } else if (editingKey) {
        const payload: UpdatePlatformSettingRequest =
          {
            value,
            value_type:
              form.value_type,
            category: form.category,
            description,
            is_public: form.is_public,
          };

        const updated =
          await platformSettingsApi.update(
            editingKey,
            payload,
          );

        setSettings((current) =>
          current
            .map((setting) =>
              setting.key === editingKey
                ? updated
                : setting,
            )
            .sort((a, b) =>
              a.key.localeCompare(b.key),
            ),
        );

        setSuccess(
          "Platform setting updated successfully.",
        );
      }

      setEditingKey(null);
      setForm(emptyForm);
    } catch (submitError: unknown) {
      console.error(
        "Failed to save platform setting:",
        submitError,
      );

      setError(
        getErrorMessage(
          submitError,
          "Failed to save platform setting. Please check the value and try again.",
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    setting: PlatformSetting,
  ): Promise<void> => {
    const confirmed = window.confirm(
      `Delete platform setting "${setting.key}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingKey(setting.key);
    setError("");
    setSuccess("");

    try {
      await platformSettingsApi.delete(
        setting.key,
      );

      setSettings((current) =>
        current.filter(
          (item) =>
            item.key !== setting.key,
        ),
      );

      setSuccess(
        "Platform setting deleted successfully.",
      );
    } catch (deleteError: unknown) {
      console.error(
        "Failed to delete platform setting:",
        deleteError,
      );

      setError(
        getErrorMessage(
          deleteError,
          "Failed to delete platform setting. It may be protected or already removed.",
        ),
      );
    } finally {
      setDeletingKey(null);
    }
  };

  const toggleCategory = (
    category: PlatformSettingCategory,
  ): void => {
    setOpenCategories((current) => ({
      ...current,
      [category]:
        !current[category],
    }));
  };

  const updateForm = <
    K extends keyof FormState,
  >(
    key: K,
    value: FormState[K],
  ): void => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100">
      <div className="mx-auto max-w-7xl space-y-4 p-3 sm:space-y-5 sm:p-5 lg:space-y-6 lg:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                System
              </p>
            </div>

            <h1 className="mt-2 text-xl font-extrabold tracking-tight sm:text-3xl text-white ">
              Platform Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage runtime configuration used
              across the REDIQ investment
              platform.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                void loadSettings()
              }
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={beginCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
            >
              <Plus className="h-4 w-4" />

              Add Setting
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3 text-sm font-medium text-red-300">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 rounded-lg p-1 text-red-400 transition hover:bg-red-500/10 hover:text-red-200"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.07] px-4 py-3 text-sm font-medium text-emerald-300">
            <Check className="h-4 w-4" />

            {success}
          </div>
        )}

        {/* Filters */}
        <section className="rounded-2xl border border-white/10 bg-[#0B1426] p-3.5 shadow-xl shadow-black/10 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search by key, description, or value..."
                className="w-full rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm sm:px-4 sm:py-2.5 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-purple-400/40 focus:bg-white/4 focus:ring-4 focus:ring-purple-400/5"
              />
            </div>

            <select
              value={activeCategory}
              onChange={(event) =>
                setActiveCategory(
                  event.target.value as
                    | PlatformSettingCategory
                    | "ALL",
                )
              }
              className="w-full rounded-xl border border-white/10 bg-[#0B1426] px-3 py-2 text-sm sm:w-auto sm:px-4 sm:py-2.5 font-medium text-slate-300 outline-none transition focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/5"
            >
              <option
                value="ALL"
                className="bg-[#0B1426]"
              >
                All categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.value}
                    value={category.value}
                    className="bg-[#0B1426]"
                  >
                    {category.label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs text-slate-500">
            <span>
              {filteredSettings.length} of{" "}
              {settings.length} settings
            </span>

            <span>
              {publicCount} public
            </span>
          </div>
        </section>

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0B1426] p-10 text-center shadow-xl shadow-black/10">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-purple-300" />

            <p className="mt-3 text-sm font-medium text-slate-400">
              Loading platform settings...
            </p>
          </div>
        ) : filteredSettings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#0B1426] p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/3">
              <RefreshCw className="h-5 w-5 text-slate-600" />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-200">
              No settings found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing the search or
              category filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(
              (category) => {
                const categorySettings =
                  groupedSettings.get(
                    category.value,
                  ) ?? [];

                if (
                  categorySettings.length ===
                  0
                ) {
                  return null;
                }

                const open =
                  openCategories[
                    category.value
                  ] ?? true;

                return (
                  <section
                    key={category.value}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] shadow-xl shadow-black/10"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleCategory(
                          category.value,
                        )
                      }
                      className="flex w-full items-center justify-between border-b border-white/5 px-3.5 py-3 text-left transition sm:px-5 sm:py-4 hover:bg-white/2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/10">
                          <span className="h-2 w-2 rounded-full bg-purple-300" />
                        </div>

                        <div>
                          <h2 className="text-sm font-extrabold text-white">
                            {category.label}
                          </h2>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {
                              categorySettings.length
                            }{" "}
                            {categorySettings.length ===
                            1
                              ? "setting"
                              : "settings"}
                          </p>
                        </div>
                      </div>

                      {open ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </button>

                    {open && (
                      <div className="divide-y divide-white/5">
                        {categorySettings.map(
                          (setting) => (
                            <div
                              key={
                                setting.id
                              }
                              className="px-3.5 py-3.5 transition hover:bg-white/1.5 sm:px-5 sm:py-4"
                            >
                              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <code className="rounded-lg border border-white/8 bg-white/[0.035] px-2 py-1.5 text-xs font-semibold text-purple-200">
                                      {
                                        setting.key
                                      }
                                    </code>

                                    <span className="rounded-full border border-white/8 bg-white/[0.035] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                      {
                                        valueTypeLabels[
                                          setting
                                            .value_type
                                        ]
                                      }
                                    </span>

                                    <span
                                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                        setting.is_public
                                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                          : "border-white/8 bg-white/[0.035] text-slate-500"
                                      }`}
                                    >
                                      {setting.is_public
                                        ? "Public"
                                        : "Private"}
                                    </span>
                                  </div>

                                  <p className="mt-3 text-sm font-semibold text-slate-200">
                                    {
                                      setting.description
                                    }
                                  </p>

                                  <div className="mt-2.5 rounded-xl border border-white/6 bg-[#07111F] px-3 py-2.5 sm:mt-3 sm:px-3.5 sm:py-3">
                                    <span className="break-all font-mono text-xs leading-5 text-slate-400">
                                      {valuePreview(
                                        setting,
                                      )}
                                    </span>
                                  </div>

                                  <p className="mt-2 text-[11px] text-slate-600">
                                    Updated{" "}
                                    {formatDate(
                                      setting.updated_at,
                                    )}
                                    {" Â· "}
                                    {
                                      categoryLabels[
                                        setting
                                          .category
                                      ]
                                    }
                                  </p>
                                </div>

                                <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      beginEdit(
                                        setting,
                                      )
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-2.5 py-1.5 text-xs sm:rounded-xl sm:px-3.5 sm:py-2 font-bold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />

                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleDelete(
                                        setting,
                                      )
                                    }
                                    disabled={
                                      deletingKey ===
                                      setting.key
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-400/15 bg-red-500/4 px-2.5 py-1.5 text-xs sm:rounded-xl sm:px-3.5 sm:py-2 font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />

                                    {deletingKey ===
                                    setting.key
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </section>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Form modal */}
      {editingKey !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-2 sm:p-4 backdrop-blur-md"
          onClick={() => {
            if (!saving) {
              closeForm();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="platform-setting-modal-title"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="max-h-[96vh] w-full max-w-2xl overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[#07111F] shadow-2xl shadow-black/50"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#07111F]/95 px-4 py-3.5 sm:px-6 sm:py-5 backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-300">
                    Configuration
                  </p>
                </div>

                <h2
                  id="platform-setting-modal-title"
                  className="mt-1 text-lg font-extrabold text-white"
                >
                  {editingKey ===
                  "__create__"
                    ? "Add Platform Setting"
                    : "Edit Platform Setting"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingKey ===
                  "__create__"
                    ? "Create a configurable platform setting."
                    : "Update the current platform configuration."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close setting form"
                className="rounded-xl border border-white/8 bg-white/3 p-2 text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-4 sm:space-y-5 sm:p-6"
            >
              {editingKey ===
                "__create__" && (
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Key
                  </label>

                  <input
                    value={form.key}
                    onChange={(event) =>
                      updateForm(
                        "key",
                        event.target.value,
                      )
                    }
                    maxLength={150}
                    required
                    disabled={saving}
                    placeholder="e.g. investment.minimum_amount"
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 font-mono text-sm text-slate-100 outline-none placeholder:font-sans placeholder:text-slate-600 focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/5"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-600">
                    Lowercase letters, numbers,
                    dots, underscores, and
                    hyphens are supported.
                  </p>
                </div>
              )}

              {editingKey !==
                "__create__" && (
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Key
                  </label>

                  <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 font-mono text-sm text-slate-500">
                    {form.key}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-300">
                  Value
                </label>

                {form.value_type ===
                "BOOLEAN" ? (
                  <select
                    value={form.value}
                    onChange={(event) =>
                      updateForm(
                        "value",
                        event.target.value,
                      )
                    }
                    disabled={saving}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1426] px-4 py-3 text-sm text-slate-100 outline-none focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/5"
                  >
                    <option
                      value="true"
                      className="bg-[#0B1426]"
                    >
                      Enabled (true)
                    </option>

                    <option
                      value="false"
                      className="bg-[#0B1426]"
                    >
                      Disabled (false)
                    </option>
                  </select>
                ) : form.value_type ===
                  "JSON" ? (
                  <textarea
                    value={form.value}
                    onChange={(event) =>
                      updateForm(
                        "value",
                        event.target.value,
                      )
                    }
                    rows={7}
                    required
                    disabled={saving}
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/3 px-4 py-3 font-mono text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/5"
                    placeholder='{"key":"value"}'
                  />
                ) : (
                  <input
                    type={
                      form.value_type ===
                        "INTEGER" ||
                      form.value_type ===
                        "DECIMAL"
                        ? "number"
                        : "text"
                    }
                    step={
                      form.value_type ===
                      "DECIMAL"
                        ? "any"
                        : form.value_type ===
                            "INTEGER"
                          ? "1"
                          : undefined
                    }
                    value={form.value}
                    onChange={(event) =>
                      updateForm(
                        "value",
                        event.target.value,
                      )
                    }
                    required
                    disabled={saving}
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/5"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Value Type
                  </label>

                  <select
                    value={form.value_type}
                    onChange={(event) =>
                      updateForm(
                        "value_type",
                        event.target.value as PlatformSettingValueType,
                      )
                    }
                    disabled={saving}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1426] px-4 py-3 text-sm text-slate-100 outline-none focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/5"
                  >
                    {valueTypes.map(
                      (type) => (
                        <option
                          key={type.value}
                          value={
                            type.value
                          }
                          className="bg-[#0B1426]"
                        >
                          {type.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateForm(
                        "category",
                        event.target.value as PlatformSettingCategory,
                      )
                    }
                    disabled={saving}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1426] px-4 py-3 text-sm text-slate-100 outline-none focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/5"
                  >
                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category.value
                          }
                          value={
                            category.value
                          }
                          className="bg-[#0B1426]"
                        >
                          {category.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-300">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={3}
                  required
                  disabled={saving}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/5"
                  placeholder="Explain what this setting controls..."
                />
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/8 bg-white/2.5 px-4 py-4">
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Public setting
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Public settings can be
                    returned by the public
                    settings endpoint.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.is_public}
                  onChange={(event) =>
                    updateForm(
                      "is_public",
                      event.target.checked,
                    )
                  }
                  disabled={saving}
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-400/20"
                />
              </label>

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3 text-sm font-medium text-red-300">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-white/8 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-white/10 bg-white/3 px-5 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />

                      {editingKey ===
                      "__create__"
                        ? "Create Setting"
                        : "Save Changes"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
