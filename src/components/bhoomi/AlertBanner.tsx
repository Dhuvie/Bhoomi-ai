"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertIcon, XIcon } from "./icons/icons";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface AlertBannerProps {
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  playChime?: boolean;
}

export function AlertBanner({
  severity,
  title,
  detail,
  onDismiss,
  actionLabel,
  onAction,
  playChime = false,
}: AlertBannerProps) {
  const { playAlertChime } = useSettings();
  const { t } = useLanguage();

  useEffect(() => {
    if (playChime && severity === "high") {
      playAlertChime();
    }
  }, [playChime, severity, playAlertChime]);

  const isHigh = severity === "high";
  const accent = isHigh ? "var(--red-500)" : "var(--amber-500)";
  const accentDark = isHigh ? "var(--red-600)" : "var(--amber-600)";
  const bgTint = isHigh ? "rgba(199,64,45,0.06)" : "rgba(224,152,42,0.06)";

  return (
    <div
      role="alert"
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card p-3 pr-3 shadow-[var(--shadow-sm)]",
        "flex items-start gap-3"
      )}
      style={{
        borderColor: `color-mix(in srgb, ${accent} 40%, var(--border))`,
        background: `linear-gradient(135deg, ${bgTint}, var(--card) 60%)`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: `linear-gradient(180deg, ${accent}, ${accentDark})` }}
      />

      <div
        className="flex-shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          backgroundColor: `color-mix(in srgb, ${accent} 15%, transparent)`,
          color: accent,
        }}
      >
        <AlertIcon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="seed-label font-semibold" style={{ color: accentDark }}>
          {title}
        </p>
        <p className="text-sm mt-1 text-foreground/85 leading-relaxed">{detail}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md tap-feedback"
            style={{
              backgroundColor: accent,
              color: "#FFFFFF",
              minHeight: "36px",
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground tap-feedback"
          aria-label={t("alert.dismiss")}
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
}
