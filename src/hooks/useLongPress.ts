import { useCallback, useRef } from "react";

const DEFAULT_MS = 450;
const MOVE_THRESHOLD_PX = 10;

export function useLongPress(onLongPress: () => void, ms: number = DEFAULT_MS) {
  const timerRef = useRef<number | null>(null);
  const longPressRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button != null && e.button !== 0) return;
      longPressRef.current = false;
      startPosRef.current = { x: e.clientX, y: e.clientY };
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        longPressRef.current = true;
        onLongPress();
      }, ms);
    },
    [clearTimer, ms, onLongPress]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPosRef.current || timerRef.current == null) return;
      const dx = Math.abs(e.clientX - startPosRef.current.x);
      const dy = Math.abs(e.clientY - startPosRef.current.y);
      if (dx > MOVE_THRESHOLD_PX || dy > MOVE_THRESHOLD_PX) {
        clearTimer();
      }
    },
    [clearTimer]
  );

  const onPointerEnd = useCallback(() => {
    clearTimer();
    startPosRef.current = null;
  }, [clearTimer]);

  const wasLongPress = useCallback(() => {
    const value = longPressRef.current;
    longPressRef.current = false;
    return value;
  }, []);

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerLeave: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
    wasLongPress,
  };
}
