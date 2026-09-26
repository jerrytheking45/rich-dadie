// src/components/support/SupportFloatingButton.tsx

'use client';

import { Headphones } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSupportUnreadCount } from '@/src/hooks/useSupportUnreadCount';

interface SupportFloatingButtonProps {
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY =
  'investment-support-floating-position';

const BUTTON_SIZE = 56;
const EDGE_GAP = 12;
const TOP_BOTTOM_GAP = 80;

function getSafePosition(
  position: Position,
): Position {
  if (typeof window === 'undefined') {
    return {
      x: 0,
      y: 0,
    };
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

function getInitialPosition(): Position {
  if (typeof window === 'undefined') {
    return {
      x: 0,
      y: 180,
    };
  }

  try {
    const saved =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (saved) {
      const parsed = JSON.parse(
        saved,
      ) as Position;

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

export default function SupportFloatingButton({
  className = '',
}: SupportFloatingButtonProps) {
  const router = useRouter();

  const [position, setPosition] =
    useState<Position>(
      getInitialPosition,
    );

  const [dragging, setDragging] =
    useState(false);

  const {
    unreadCount,
    refresh: refreshUnreadCount,
  } = useSupportUnreadCount();

  const dragStartRef =
    useRef<Position | null>(null);

  const positionStartRef =
    useRef<Position | null>(null);

  const movedRef =
    useRef(false);

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          'visible'
        ) {
          void refreshUnreadCount();
        }
      };

    const handleWindowFocus = () => {
      void refreshUnreadCount();
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    window.addEventListener(
      'focus',
      handleWindowFocus,
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );

      window.removeEventListener(
        'focus',
        handleWindowFocus,
      );
    };
  }, [refreshUnreadCount]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(position),
      );
    } catch {
      // localStorage may be unavailable.
    }
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) =>
        getSafePosition(current),
      );
    };

    window.addEventListener(
      'resize',
      handleResize,
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      );
    };
  }, []);

  const handlePointerDown =
    useCallback(
      (
        event: React.PointerEvent<HTMLButtonElement>,
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
        event: React.PointerEvent<HTMLButtonElement>,
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

        const maxY = Math.max(
          EDGE_GAP,
          window.innerHeight -
            BUTTON_SIZE -
            EDGE_GAP,
        );

        setPosition({
          x: Math.min(
            Math.max(
              nextX,
              EDGE_GAP,
            ),
            window.innerWidth -
              BUTTON_SIZE -
              EDGE_GAP,
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
        event: React.PointerEvent<HTMLButtonElement>,
      ) => {
        if (!dragging) {
          return;
        }

        setPosition((current) =>
          getSafePosition(current),
        );

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
      [dragging],
    );

  const handleClick =
    useCallback(() => {
      if (movedRef.current) {
        movedRef.current = false;
        return;
      }

      router.push(
        '/investment/support',
      );
    }, [router]);

  // Keep all existing logic above unchanged.

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
        ? `Customer support, ${unreadCount} unread messages`
        : 'Customer support'
    }
    title="Customer support"
    style={{
      left: position.x,
      top: position.y,
      touchAction: 'none',
    }}
    className={[
      'fixed z-40',
      'flex h-14 w-14 items-center justify-center',
      'rounded-full',
      'border border-emerald-300/20',
      'bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-500',
      'text-[#04110B]',
      'shadow-xl shadow-emerald-950/30',
      'select-none',
      dragging
        ? 'cursor-grabbing scale-105'
        : 'cursor-grab',
      dragging
        ? ''
        : 'transition-transform duration-200',
      'hover:scale-105',
      'active:scale-95',
      'focus:outline-none',
      'focus:ring-2 focus:ring-emerald-300/30',
      className,
    ].join(' ')}
  >
    <Headphones
      size={22}
      strokeWidth={2.3}
      aria-hidden="true"
    />

    {unreadCount > 0 && (
      <span
        className={[
          'absolute -right-1 -top-1',
          'flex min-h-5 min-w-5 items-center justify-center',
          'rounded-full border-2 border-[#07101F]',
          'bg-rose-500 px-1',
          'text-[9px] font-black leading-none text-white',
          'shadow-lg shadow-rose-950/30',
        ].join(' ')}
      >
        {unreadCount > 9
          ? '9+'
          : unreadCount}
      </span>
    )}
  </button>
);
}