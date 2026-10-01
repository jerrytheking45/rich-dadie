
'use client';

import { useState } from 'react';
import {
  Check,
  ChevronDown,
  Loader2,
  ShieldCheck,
  UserMinus,
  UserPlus,
} from 'lucide-react';

import type {
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
} from '@/src/lib/types/support';

interface AdminSupportControlsProps {
  ticket: SupportTicket;
  updating?: boolean;
  onStatusChange: (
    status: SupportTicketStatus,
  ) => Promise<void> | void;
  onPriorityChange: (
    priority: SupportTicketPriority,
  ) => Promise<void> | void;
  onAssignmentChange: (
    assignedTo: string | null,
  ) => Promise<void> | void;
}

const STATUS_OPTIONS: SupportTicketStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_FOR_USER',
  'RESOLVED',
  'CLOSED',
];

const PRIORITY_OPTIONS: SupportTicketPriority[] = [
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
];

function formatStatus(value: string): string {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function selectClassName(): string {
  return [
    'h-10 w-full appearance-none rounded-xl border',
    'border-white/10 bg-[#07101F]',
    'px-3 pr-9 text-[13px] text-white',
    'outline-none transition',
    'focus:border-emerald-400/40',
    'focus:ring-2 focus:ring-emerald-400/10',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' ');
}

function saveButtonClassName(
  dirty: boolean,
): string {
  return [
    'inline-flex h-10 min-w-[70px] items-center justify-center gap-1.5',
    'rounded-xl px-2.5 text-xs font-semibold',
    'transition-all duration-200',
    dirty
      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-950/20 hover:from-emerald-400 hover:to-emerald-500'
      : 'bg-white/5 text-white/30',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' ');
}

export default function AdminSupportControls({
  ticket,
  updating = false,
  onStatusChange,
  onPriorityChange,
  onAssignmentChange,
}: AdminSupportControlsProps) {
  const [status, setStatus] =
    useState<SupportTicketStatus>(ticket.status);

  const [priority, setPriority] =
    useState<SupportTicketPriority>(ticket.priority);

  const [assignedTo, setAssignedTo] = useState(
    ticket.assigned_to ?? '',
  );

  const [savingStatus, setSavingStatus] =
    useState(false);

  const [savingPriority, setSavingPriority] =
    useState(false);

  const [savingAssignment, setSavingAssignment] =
    useState(false);

  const handleStatusSave = async () => {
    if (status === ticket.status) {
      return;
    }

    setSavingStatus(true);

    try {
      await onStatusChange(status);
    } finally {
      setSavingStatus(false);
    }
  };

  const handlePrioritySave = async () => {
    if (priority === ticket.priority) {
      return;
    }

    setSavingPriority(true);

    try {
      await onPriorityChange(priority);
    } finally {
      setSavingPriority(false);
    }
  };

  const handleAssignmentSave = async () => {
    const value = assignedTo.trim();

    if (value === (ticket.assigned_to ?? '')) {
      return;
    }

    if (value && !isValidUUID(value)) {
      return;
    }

    setSavingAssignment(true);

    try {
      await onAssignmentChange(value || null);
    } finally {
      setSavingAssignment(false);
    }
  };

  const handleUnassign = async () => {
    if (!ticket.assigned_to) {
      return;
    }

    setSavingAssignment(true);

    try {
      setAssignedTo('');
      await onAssignmentChange(null);
    } finally {
      setSavingAssignment(false);
    }
  };

  const statusDirty = status !== ticket.status;
  const priorityDirty = priority !== ticket.priority;

  const assignmentDirty =
    assignedTo.trim() !== (ticket.assigned_to ?? '');

  const assignmentInvalid =
    assignedTo.trim().length > 0 &&
    !isValidUUID(assignedTo.trim());

  return (
    <section className="overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#0B1426] via-[#0B1426] to-[#11102B] shadow-2xl shadow-black/10">
      <div className="border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/10 text-purple-300">
            <ShieldCheck size={19} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Ticket controls
            </h2>

            <p className="mt-1 text-xs leading-5 text-white/40">
              Manage status, priority, and staff assignment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-3">
        {/* Status */}
        <div>
          <label
            htmlFor="support-ticket-status"
            className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/35"
          >
            Status
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <select
                id="support-ticket-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as SupportTicketStatus,
                  )
                }
                disabled={
                  updating || savingStatus
                }
                className={selectClassName()}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="bg-[#0B1426] text-white"
                  >
                    {formatStatus(option)}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
              />
            </div>

            <button
              type="button"
              onClick={handleStatusSave}
              disabled={
                updating ||
                savingStatus ||
                !statusDirty
              }
              className={saveButtonClassName(
                statusDirty,
              )}
            >
              {savingStatus ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Check size={16} />
              )}

              Save
            </button>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="support-ticket-priority"
            className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/35"
          >
            Priority
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <select
                id="support-ticket-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as SupportTicketPriority,
                  )
                }
                disabled={
                  updating || savingPriority
                }
                className={selectClassName()}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="bg-[#0B1426] text-white"
                  >
                    {formatStatus(option)}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
              />
            </div>

            <button
              type="button"
              onClick={handlePrioritySave}
              disabled={
                updating ||
                savingPriority ||
                !priorityDirty
              }
              className={saveButtonClassName(
                priorityDirty,
              )}
            >
              {savingPriority ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Check size={16} />
              )}

              Save
            </button>
          </div>
        </div>

        {/* Assignment */}
        <div>
          <label
            htmlFor="support-ticket-assignee"
            className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/35"
          >
            Assigned staff
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="support-ticket-assignee"
              type="text"
              value={assignedTo}
              onChange={(event) =>
                setAssignedTo(event.target.value)
              }
              placeholder="Staff user UUID"
              disabled={
                updating || savingAssignment
              }
              aria-invalid={assignmentInvalid}
              className={[
                'min-w-0 flex-1 rounded-xl border',
                'bg-[#07101F] px-3 py-2 text-[13px]',
                'text-white outline-none transition',
                'placeholder:text-white/20',
                'disabled:cursor-not-allowed disabled:opacity-50',
                assignmentInvalid
                  ? 'border-red-400/40 focus:border-red-400/60 focus:ring-2 focus:ring-red-400/10'
                  : 'border-white/10 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10',
              ].join(' ')}
            />

            <button
              type="button"
              onClick={handleAssignmentSave}
              disabled={
                updating ||
                savingAssignment ||
                !assignmentDirty ||
                assignmentInvalid
              }
              title="Save assignment"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {savingAssignment ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <UserPlus size={16} />
              )}
            </button>

            {ticket.assigned_to && (
              <button
                type="button"
                onClick={handleUnassign}
                disabled={
                  updating || savingAssignment
                }
                title="Unassign ticket"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/45 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <UserMinus size={16} />
              </button>
            )}
          </div>

          {assignmentInvalid && (
            <p className="mt-2 text-xs text-red-300">
              Enter a valid staff user UUID.
            </p>
          )}

          {!assignmentInvalid &&
            !ticket.assigned_to && (
              <p className="mt-2 text-xs text-white/30">
                This ticket is currently unassigned.
              </p>
            )}
        </div>
      </div>
    </section>
  );
}
