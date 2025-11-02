"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useSync, SyncState } from "@/contexts/SyncContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SyncIcon, CheckIcon, HourglassIcon } from "./icons/icons";

interface SyncStatusIndicatorProps {
  state: SyncState;
  label?: string;
  className?: string;
  compact?: boolean;
}

export function SyncStatusIndicator({
  state,
  label,
  className,
  compact = false,
}: SyncStatusIndicatorProps) {
  const { t } = useLanguage();

  const config: Record<SyncState, { color: string; bg: string; icon: React.ReactNode; text: string }> = {
    queued: {
      color: "var(--soil-600)",
      bg: "rgba(110,93,74,0.10)",
      icon: <HourglassIcon size={12} />,
      text: t("sync.queued"),
    },
    syncing: {
      color: "var(--sky-600)",
      bg: "rgba(63,127,191,0.10)",
      icon: <SyncIcon size={12} className="animate-spin" />,
      text: t("sync.syncing"),
    },
    confirmed: {
      color: "var(--crop-600)",
      bg: "rgba(70,140,64,0.10)",
      icon: <CheckIcon size={12} />,
      text: t("sync.confirmed"),
    },
    offline: {
      color: "var(--red-600)",
      bg: "rgba(163,47,31,0.10)",
      icon: <HourglassIcon size={12} />,
      text: t("sync.offline"),
    },
  };

  const c = config[state];
  const text = label ?? c.text;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        compact ? "text-[10px]" : "text-xs",
        className
      )}
      style={{ backgroundColor: c.bg, color: c.color }}
      role="status"
      aria-label={`Sync state: ${text}`}
    >
      {c.icon}
      <span className="tabular-nums">{text}</span>
    </span>
  );
}

/** Top-bar global sync indicator showing pending count. */
export function GlobalSyncIndicator() {
  const { items, pendingCount, lastConfirmed } = useSync();
  const { t } = useLanguage();

  if (pendingCount === 0 && items.length === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
        title={lastConfirmed ? `Last sync: ${new Date(lastConfirmed).toLocaleTimeString()}` : undefined}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--crop-500)]" />
        <span className="tabular-nums">{t("sync.confirmed")}</span>
      </span>
    );
  }

  if (pendingCount > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--sky-600)" }}>
        <SyncIcon size={12} className="animate-spin" />
        <span className="tabular-nums">{pendingCount} {t("sync.syncing")}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--crop-600)" }}>
      <CheckIcon size={12} />
      <span className="tabular-nums">{t("sync.confirmed")}</span>
    </span>
  );
}
