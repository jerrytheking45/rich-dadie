'use client';

import { useState } from 'react';
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserPlus,
  UserRound,
  X,
} from 'lucide-react';

import type { UserRole } from '@/src/lib/api/admin';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    email: string;
    password: string;
    name: string;
    employee_id: string;
    role: UserRole;
  }) => Promise<void>;
  creating?: boolean;
}

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  employee_id: string;
  role: UserRole;
}

const INITIAL_FORM: CreateUserForm = {
  name: '',
  email: '',
  password: '',
  employee_id: '',
  role: 'employee',
};

export default function CreateUserModal({
  open,
  onClose,
  onCreate,
  creating = false,
}: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserForm>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const update = <K extends keyof CreateUserForm>(
    field: K,
    value: CreateUserForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onCreate(form);

    setForm(INITIAL_FORM);
    setShowPassword(false);
  };

  const handleClose = () => {
    if (creating) return;

    setForm(INITIAL_FORM);
    setShowPassword(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-4 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-user-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/40"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Administration
              </p>

              <h2
                id="create-user-title"
                className="mt-1 text-xl font-bold text-white"
              >
                Create User
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Add a new platform administrator or employee.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={creating}
            aria-label="Close create user modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-400 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="space-y-4 p-6">
            <Field
              label="Full name"
              icon={<UserRound className="h-4 w-4" />}
              value={form.name}
              onChange={(value) => update('name', value)}
              placeholder="John Doe"
              required
              autoComplete="name"
            />

            <Field
              label="Email address"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              value={form.email}
              onChange={(value) => update('email', value)}
              placeholder="john@example.com"
              required
              autoComplete="email"
            />

            <Field
              label="Employee ID"
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              value={form.employee_id}
              onChange={(value) =>
                update('employee_id', value.toUpperCase())
              }
              placeholder="GHS-001"
              required
              autoComplete="off"
            />

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Temporary password
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  placeholder="Create a temporary password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  onChange={(event) =>
                    update('password', event.target.value)
                  }
                  className="w-full rounded-xl border border-white/8 bg-[#070F1E] py-2.5 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/6 hover:text-slate-200"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-[11px] text-slate-500">
                Use at least 8 characters. The user can change it later.
              </p>
            </div>

            <div>
              <label
                htmlFor="create-user-role"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
              >
                Role
              </label>

              <div className="relative">
                <Check className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />

                <select
                  id="create-user-role"
                  value={form.role}
                  onChange={(event) =>
                    update(
                      'role',
                      event.target.value as UserRole,
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-white/8 bg-[#070F1E] py-2.5 pl-10 pr-10 text-sm font-medium text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Administrator</option>
                  <option value="superadmin">
                    Super Administrator
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/8 bg-white/2 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={creating}
              className="rounded-xl border border-white/10 bg-white/4 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  autoComplete?: string;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  icon,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-white/8 bg-[#070F1E] py-2.5 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10 ${
            icon ? 'pl-10' : 'pl-3'
          }`}
        />
      </div>
    </div>
  );
}