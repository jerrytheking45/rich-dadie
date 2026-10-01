
'use client';

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { PointerEvent } from 'react';
import { Headphones } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAdminSupportUnreadCount } from '@/src/hooks/useAdminSupportUnreadCount';

interface AdminSupportFloatingButtonProps {
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY =
  'investment-admin-support-floating-position';

const BUTTON_SIZE = 56;
const EDGE_GAP = 12;
const TOP_BOTTOM_GAP = 80;

const SERVER_POSITION: Position = {
  x: EDGE_GAP,
  y: 180,
};

function getSafePosition(
  position: Position,
): Position {
  if (typeof window === 'undefined') {
    return SERVER_POSITION;
  }

  const maxX = Math.max(
    EDGE_GAP,
    window.innerWidth -
      BUTTON_SIZE -
      EDGE_GAP,
  );

  const maxY = Math.max(
    EDGE_GAP,
    window.innerHeight -
      BUTTON_SIZE -
      EDGE_GAP,
  );

  const safeY = Math.min(
    Math.max(position.y, EDGE_GAP),
    maxY,
  );

  const distanceFromLeft = position.x;

  const distanceFromRight =
    window.innerWidth -
    (position.x + BUTTON_SIZE);

  const x =
    distanceFromLeft <= distanceFromRight
      ? EDGE_GAP
      : maxX;

  return {
    x,
    y: safeY,
  };
}

function getBrowserPosition(): Position {
  if (typeof window === 'undefined') {
    return SERVER_POSITION;
  }

  try {
    const saved =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (saved) {
      const parsed =
        JSON.parse(saved) as Position;

      if (
        typeof parsed.x === 'number' &&
        typeof parsed.y === 'number'
      ) {
        return getSafePosition(parsed);
      }
    }
  } catch {
    // Ignore invalid localStorage data.
  }

  return getSafePosition({
    x:
      window.innerWidth -
      BUTTON_SIZE -
      EDGE_GAP,

    y:
      window.innerHeight -
      BUTTON_SIZE -
      TOP_BOTTOM_GAP,
  });
}

let currentPosition: Position =
  SERVER_POSITION;

let browserPositionInitialized = false;

const listeners = new Set<() => void>();

function initializeBrowserPosition(): void {
  if (
    typeof window === 'undefined' ||
    browserPositionInitialized
  ) {
    return;
  }

  currentPosition =
    getBrowserPosition();

  browserPositionInitialized = true;
}

function getPositionSnapshot(): Position {
  initializeBrowserPosition();

  return currentPosition;
}

function getServerPositionSnapshot(): Position {
  return SERVER_POSITION;
}

function subscribeToPosition(
  listener: () => void,
): () => void {
  listeners.add(listener);

  if (typeof window === 'undefined') {
    return () => {
      listeners.delete(listener);
    };
  }

  const handleResize = () => {
    currentPosition =
      getSafePosition(
        currentPosition,
      );

    listeners.forEach((callback) => {
      callback();
    });
  };

  const handleStorage = (
    event: StorageEvent,
  ) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    currentPosition =
      getBrowserPosition();

    listeners.forEach((callback) => {
      callback();
    });
  };

  window.addEventListener(
    'resize',
    handleResize,
  );

  window.addEventListener(
    'storage',
    handleStorage,
  );

  return () => {
    listeners.delete(listener);

    window.removeEventListener(
      'resize',
      handleResize,
    );

    window.removeEventListener(
      'storage',
      handleStorage,
    );
  };
}

function setExternalPosition(
  position: Position,
): void {
  currentPosition =
    getSafePosition(position);

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(currentPosition),
    );
  } catch {
    // localStorage may be unavailable.
  }

  listeners.forEach((listener) => {
    listener();
  });
}

export default function AdminSupportFloatingButton({
  className = '',
}: AdminSupportFloatingButtonProps) {
  const router = useRouter();

  const position =
    useSyncExternalStore(
      subscribeToPosition,
      getPositionSnapshot,
      getServerPositionSnapshot,
    );

  const [dragging, setDragging] =
    useState(false);

  const { unreadCount } =
    useAdminSupportUnreadCount();

  const dragStartRef =
    useRef<Position | null>(null);

  const positionStartRef =
    useRef<Position | null>(null);

  const movedRef =
    useRef(false);

  const handlePointerDown =
    useCallback(
      (
        event: PointerEvent<HTMLButtonElement>,
      ) => {
        event.preventDefault();

        movedRef.current = false;

        dragStartRef.current = {
          x: event.clientX,
          y: event.clientY,
        };

        positionStartRef.current = {
          ...position,
        };

        setDragging(true);

        event.currentTarget.setPointerCapture(
          event.pointerId,
        );
      },
      [position],
    );

  const handlePointerMove =
    useCallback(
      (
        event: PointerEvent<HTMLButtonElement>,
      ) => {
        if (
          !dragging ||
          !dragStartRef.current ||
          !positionStartRef.current
        ) {
          return;
        }

        const deltaX =
          event.clientX -
          dragStartRef.current.x;

        const deltaY =
          event.clientY -
          dragStartRef.current.y;

        if (
          Math.abs(deltaX) > 5 ||
          Math.abs(deltaY) > 5
        ) {
          movedRef.current = true;
        }

        const nextX =
          positionStartRef.current.x +
          deltaX;

        const nextY =
          positionStartRef.current.y +
          deltaY;

        const maxX = Math.max(
          EDGE_GAP,
          window.innerWidth -
            BUTTON_SIZE -
            EDGE_GAP,
        );

        const maxY = Math.max(
          EDGE_GAP,
          window.innerHeight -
            BUTTON_SIZE -
            EDGE_GAP,
        );

        setExternalPosition({
          x: Math.min(
            Math.max(
              nextX,
              EDGE_GAP,
            ),
            maxX,
          ),

          y: Math.min(
            Math.max(
              nextY,
              EDGE_GAP,
            ),
            maxY,
          ),
        });
      },
      [dragging],
    );

  const handlePointerUp =
    useCallback(
      (
        event: PointerEvent<HTMLButtonElement>,
      ) => {
        if (!dragging) {
          return;
        }

        setExternalPosition(position);

        setDragging(false);

        dragStartRef.current = null;
        positionStartRef.current = null;

        try {
          event.currentTarget.releasePointerCapture(
            event.pointerId,
          );
        } catch {
          // Pointer capture may already be released.
        }
      },
      [dragging, position],
    );

  const handleClick = useCallback(() => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }

    router.push('/admin/support');
  }, [router]);

  const displayCount =
    unreadCount > 9
      ? '9+'
      : unreadCount;

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      aria-label={
        unreadCount > 0
          ? `Admin support, ${unreadCount} new messages`
          : 'Admin support'
      }
      title={
        unreadCount > 0
          ? `${unreadCount} new support messages`
          : 'Admin support'
      }
      style={{
        left: position.x,
        top: position.y,
        touchAction: 'none',
      }}
      className={[
        'fixed z-50',
        'flex h-14 w-14 items-center justify-center',
        'rounded-[18px]',
        'border border-white/15',
        'bg-linear-to-br from-emerald-400 via-emerald-500 to-violet-600',
        'text-white',
        'shadow-xl shadow-emerald-950/30',
        'select-none',
        dragging
          ? 'cursor-grabbing scale-105'
          : 'cursor-grab',
        dragging
          ? ''
          : 'transition-all duration-200',
        'hover:scale-105 hover:shadow-2xl hover:shadow-emerald-950/40',
        'active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-[#050B18]',
        className,
      ].join(' ')}
    >
      <Headphones
        size={23}
        strokeWidth={2.2}
        aria-hidden="true"
      />

      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          className={[
            'absolute -right-1.5 -top-1.5',
            'flex h-5 min-w-5 items-center justify-center',
            'rounded-full border-2 border-[#07101F]',
            'bg-red-500 px-1',
            'text-[9px] font-bold leading-none text-white',
            'shadow-lg shadow-red-950/30',
          ].join(' ')}
        >
          {displayCount}
        </span>
      )}
    </button>
  );
}