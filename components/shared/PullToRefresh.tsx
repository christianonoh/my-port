"use client";

import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { ReactNode } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export default function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: PullToRefreshProps) {
  const { isPulling, isRefreshing, isTriggered, pullDistance, progress, containerRef } =
    usePullToRefresh({
      onRefresh,
      threshold,
      resistance,
      enabled,
    });

  const showIndicator = isPulling || isRefreshing;
  const indicatorOpacity = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={containerRef as any} className="relative">
      {/* Pull-to-refresh indicator */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200 ${
          showIndicator ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance, threshold * 1.2) : isRefreshing ? 60 : 0}px)`,
          opacity: isRefreshing ? 1 : indicatorOpacity,
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 border border-gray-200 dark:border-gray-700">
          {isRefreshing ? (
            // Spinning loader
            <svg
              className="animate-spin h-6 w-6 text-accent"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            // Pull arrow with rotation based on progress
            <svg
              className="h-6 w-6 text-accent transition-transform duration-200"
              style={{
                transform: `rotate(${isTriggered ? 180 : progress * 1.8}deg)`,
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {showIndicator && (
        <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-accent transition-all duration-200"
            style={{
              width: `${isRefreshing ? 100 : progress}%`,
              opacity: isRefreshing ? 0.5 : 1,
            }}
          />
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
