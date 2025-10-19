"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // Distance in pixels to trigger refresh
  resistance?: number; // Resistance factor (higher = harder to pull)
  enabled?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: UsePullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
  });

  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      // Only enable pull-to-refresh if we're at the top of the page
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop === 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || state.isRefreshing) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const touchY = e.touches[0].clientY;
      const touchDiff = touchY - touchStartY.current;

      // Only allow pull down when at top of page
      if (scrollTop === 0 && touchDiff > 0) {
        // Prevent default scroll behavior
        e.preventDefault();

        const pullDistance = Math.min(touchDiff / resistance, threshold * 1.5);

        setState({
          isPulling: true,
          isRefreshing: false,
          pullDistance,
        });
      }
    },
    [enabled, resistance, threshold, state.isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || state.isRefreshing) return;

    if (state.pullDistance >= threshold) {
      setState({
        isPulling: false,
        isRefreshing: true,
        pullDistance: 0,
      });

      try {
        await onRefresh();
      } catch (error) {
        console.error("Pull-to-refresh error:", error);
      } finally {
        setState({
          isPulling: false,
          isRefreshing: false,
          pullDistance: 0,
        });
      }
    } else {
      setState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
      });
    }
  }, [enabled, onRefresh, state.pullDistance, state.isRefreshing, threshold]);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current || document.body;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...state,
    containerRef,
    isTriggered: state.pullDistance >= threshold,
    progress: Math.min((state.pullDistance / threshold) * 100, 100),
  };
}
