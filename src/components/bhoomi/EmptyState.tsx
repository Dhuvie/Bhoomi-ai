"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  EmptyLeafIcon, EmptyFieldIcon, EmptyChartIcon, SproutIcon, PlusIcon,
  OfflineIcon, CameraOffIcon, TimeoutIcon,
} from "./icons/icons";

type IllustrationType = "no-fields" | "no-diagnoses" | "no-data" | "no-prices" | "no-alerts";

interface EmptyStateProps {
  type: IllustrationType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const illustrationConfig: Record<IllustrationType, { color: string; bg: string; render: (color: string) => React.ReactNode }> = {
  "no-fields": {
    color: "var(--crop-500)",
    bg: "color-mix(in srgb, var(--crop-500) 8%, transparent)",
    render: (color) => (
      <svg viewBox="0 0 120 80" width="120" height="80" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        {/* Bare ground with seedling */}
        <path d="M8 64 L112 64" />
        <path d="M14 64c0-4 3-7 7-7M28 64c0-6 4-10 9-10M48 64c0-4 3-7 7-7M70 64c0-6 4-10 9-10M92 64c0-4 3-7 7-7" strokeWidth="1" opacity="0.7" />
        {/* Single seedling in center */}
        <path d="M60 64 L60 44" />
        <path d="M60 48c0-4-2-6-5-6 0 4 2 6 5 6z" fill={color} fillOpacity="0.15" />
        <path d="M60 44c0-4 2-6 5-6 0 4-2 6-5 6z" fill={color} fillOpacity="0.15" />
        {/* Sun in corner */}
        <circle cx="100" cy="16" r="6" strokeWidth="1" />
        <path d="M100 4v3M100 25v3M88 16h3M109 16h3M91 7l2 2M107 25l-2-2M91 25l2-2M107 7l-2 2" strokeWidth="0.8" />
      </svg>
    ),
  },
  "no-diagnoses": {
    color: "var(--crop-600)",
    bg: "color-mix(in srgb, var(--crop-600) 8%, transparent)",
    render: (color) => (
      <svg viewBox="0 0 120 80" width="120" height="80" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        {/* Large leaf */}
        <path d="M20 64c0-22 14-36 40-40-4 22-14 36-40 40z" fill={color} fillOpacity="0.08" />
        <path d="M28 56c8-8 18-14 28-18" strokeWidth="1" />
        {/* Magnifying glass */}
        <circle cx="80" cy="48" r="14" />
        <path d="M90 58 L100 68" strokeWidth="2" />
        <path d="M75 48h10M80 43v10" strokeWidth="1" />
      </svg>
    ),
  },
  "no-data": {
    color: "var(--soil-500)",
    bg: "color-mix(in srgb, var(--soil-500) 8%, transparent)",
    render: (color) => (
      <svg viewBox="0 0 120 80" width="120" height="80" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        {/* Empty chart with dashed line */}
        <path d="M10 70 L110 70" />
        <path d="M10 10 L10 70" strokeWidth="1" />
        <path d="M20 56 L40 50 L60 38 L80 30 L100 18" strokeDasharray="3 3" strokeWidth="1.25" />
        <circle cx="60" cy="38" r="2.5" fill={color} stroke="none" />
        <path d="M58 36 L62 40 M62 36 L58 40" strokeWidth="0.8" opacity="0.5" />
      </svg>
    ),
  },
  "no-prices": {
    color: "var(--amber-500)",
    bg: "color-mix(in srgb, var(--amber-500) 8%, transparent)",
    render: (color) => (
      <svg viewBox="0 0 120 80" width="120" height="80" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        {/* Scales empty */}
        <path d="M60 12 L60 64M50 72 L70 72M30 28 L90 28" />
        <path d="M20 28 L14 44 L26 44z" />
        <path d="M100 28 L94 44 L106 44z" />
        <circle cx="60" cy="14" r="2" fill={color} stroke="none" />
      </svg>
    ),
  },
  "no-alerts": {
    color: "var(--crop-500)",
    bg: "color-mix(in srgb, var(--crop-500) 8%, transparent)",
    render: (color) => (
      <svg viewBox="0 0 120 80" width="120" height="80" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        {/* Shield with check */}
        <path d="M60 14 L84 22 L84 44c0 14-10 22-24 28-14-6-24-14-24-28L36 22z" fill={color} fillOpacity="0.08" />
        <path d="M48 42 L56 50 L72 34" strokeWidth="2" />
      </svg>
    ),
  },
};

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const cfg = illustrationConfig[type];
  return (
    <div className={cn("rounded-lg border border-dashed border-border bg-card p-8 text-center", className)}>
      <div
        className="mx-auto flex items-center justify-center w-32 h-24 rounded-md drift"
        style={{ background: cfg.bg }}
        aria-hidden="true"
      >
        {cfg.render(cfg.color)}
      </div>
      <h3 className="font-heading-en text-base font-bold mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium tap-feedback min-h-[44px]"
          style={{ background: "var(--crop-500)", color: "#FFFFFF" }}
        >
          {type === "no-fields" && <PlusIcon size={16} />}
          {type === "no-diagnoses" && <EmptyLeafIcon size={16} />}
          {type === "no-data" && <EmptyChartIcon size={16} />}
          {type === "no-prices" && <EmptyChartIcon size={16} />}
          {type === "no-alerts" && <SproutIcon size={16} />}
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/** Specific error states — never "something went wrong" */
type ErrorType = "offline" | "camera-denied" | "ai-timeout" | "ai-error" | "generic";

interface ErrorStateProps {
  type: ErrorType;
  onRetry?: () => void;
  onAction?: () => void;
  className?: string;
}

const errorConfig: Record<ErrorType, { color: string; icon: React.ReactNode; title: string; description: string; actionLabel: string }> = {
  offline: {
    color: "var(--amber-500)",
    icon: <OfflineIcon size={24} />,
    title: "You're offline",
    description: "We saved your work and will sync when you're back. Anything you do now is queued on this device.",
    actionLabel: "Try again",
  },
  "camera-denied": {
    color: "var(--amber-500)",
    icon: <CameraOffIcon size={24} />,
    title: "Camera access blocked",
    description: "Bhoomi can't see your leaf without camera access. You can upload a photo from your gallery instead — same diagnosis, just one extra tap.",
    actionLabel: "Upload a photo",
  },
  "ai-timeout": {
    color: "var(--soil-500)",
    icon: <TimeoutIcon size={24} />,
    title: "Diagnosis is taking longer than usual",
    description: "The model is still working. Slow connections sometimes need a moment. Try once more — it usually goes through on the second attempt.",
    actionLabel: "Try again",
  },
  "ai-error": {
    color: "var(--red-500)",
    icon: <TimeoutIcon size={24} />,
    title: "Diagnosis couldn't complete",
    description: "We couldn't analyze this image. If you're on a weak signal, try moving to better coverage and retrying. Your photo is saved on this device.",
    actionLabel: "Retry",
  },
  generic: {
    color: "var(--soil-500)",
    icon: <EmptyChartIcon size={24} />,
    title: "That didn't load",
    description: "Tap retry — we'll give it another go. If it keeps happening, your connection may be unstable.",
    actionLabel: "Retry",
  },
};

export function ErrorState({ type, onRetry, onAction, className }: ErrorStateProps) {
  const cfg = errorConfig[type];
  return (
    <div
      className={cn("rounded-lg border p-5 text-center", className)}
      style={{
        borderColor: `color-mix(in srgb, ${cfg.color} 35%, var(--border))`,
        background: `linear-gradient(135deg, color-mix(in srgb, ${cfg.color} 4%, var(--card)), var(--card) 60%)`,
      }}
      role="alert"
    >
      <div
        className="mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-3"
        style={{ background: `color-mix(in srgb, ${cfg.color} 14%, transparent)`, color: cfg.color }}
        aria-hidden="true"
      >
        {cfg.icon}
      </div>
      <p className="font-semibold mb-1.5">{cfg.title}</p>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto leading-relaxed">{cfg.description}</p>
      {(onRetry || onAction) && (
        <button
          type="button"
          onClick={onAction || onRetry}
          className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium tap-feedback min-h-[44px]"
          style={{ background: cfg.color, color: "#FFFFFF" }}
        >
          {cfg.actionLabel}
        </button>
      )}
    </div>
  );
}
