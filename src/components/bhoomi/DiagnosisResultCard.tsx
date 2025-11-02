"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useSync } from "@/contexts/SyncContext";
import { DiagnosisResult } from "@/lib/mock-data";
import { CheckIcon, CameraIcon, AlertIcon } from "./icons/icons";
import { cn } from "@/lib/utils";
import { TranslationKey } from "@/lib/i18n";

interface DiagnosisResultCardProps {
  result: DiagnosisResult;
  onReset: () => void;
}

export function DiagnosisResultCard({ result, onReset }: DiagnosisResultCardProps) {
  const { locale, t } = useLanguage();
  const { vibrate } = useSettings();
  const [treatments, setTreatments] = useState(
    result.treatments.map((t) => ({ ...t, done: false }))
  );
  const [saved, setSaved] = useState(false);
  const syncId = `save-diag-${result.id}-${Date.now()}`;
  const { register, update } = useSync();
  const [savedSync, setSavedSync] = useState<"queued" | "syncing" | "confirmed">("queued");

  const confidenceConfig = {
    low: { label: t("diag.lowConfidence") as string, color: "var(--amber-500)", ring: 25 },
    med: { label: t("diag.medConfidence") as string, color: "var(--amber-500)", ring: 50 },
    high: { label: t("diag.highConfidence") as string, color: "var(--crop-500)", ring: 80 },
    veryHigh: { label: t("diag.veryHighConfidence") as string, color: "var(--crop-600)", ring: 95 },
  }[result.confidenceLabel];

  const severityColor = result.severity === "high" ? "var(--red-500)" : result.severity === "medium" ? "var(--amber-500)" : "var(--crop-500)";

  const handleToggleTreatment = (id: string) => {
    vibrate(8);
    setTreatments((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleSave = () => {
    vibrate(15);
    setSaved(true);
    register(syncId, "Save diagnosis");
    setSavedSync("syncing");
    update(syncId, "syncing");
    setTimeout(() => {
      update(syncId, "confirmed");
      setSavedSync("confirmed");
    }, 1200);
  };

  const completedCount = treatments.filter((t) => t.done).length;
  const confidencePct = Math.round(result.confidence * 100);

  return (
    <div className="rounded-lg border border-border bg-card p-4 md:p-5 shadow-[var(--shadow-sm)] space-y-4">
      {/* Header — disease name + AI estimate marking */}
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-md flex-shrink-0"
          style={{
            background: `color-mix(in srgb, ${severityColor} 12%, var(--card))`,
            color: severityColor,
          }}
          aria-hidden="true"
        >
          <AlertIcon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="seed-label text-muted-foreground">{t("diag.likelyCause")}</p>
          <h2 className="font-heading-en text-lg font-bold mt-0.5" style={{ fontFamily: locale === "en" ? "var(--font-heading-en)" : "var(--font-heading-in)" }}>
            {result.diseaseLocal[locale]}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ background: `color-mix(in srgb, ${severityColor} 12%, transparent)`, color: severityColor }}
            >
              {t("diag.severity")}: {t(`common.${result.severity}` as TranslationKey)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
              {t("common.estimate")}
            </span>
          </div>
        </div>
      </div>

      {/* Confidence ring + plain-language label */}
      <div className="rounded-md border border-border bg-muted/30 p-4 flex items-center gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="color-mix(in srgb, var(--soil-300) 40%, transparent)" strokeWidth="4" />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={confidenceConfig.color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - confidencePct / 100)}
              style={{
                transition: "stroke-dashoffset 700ms cubic-bezier(0.2, 0, 0, 1)",
                animation: "grow-in 700ms cubic-bezier(0.2, 0, 0, 1) both",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="instrument-num text-lg tabular-nums" style={{ color: confidenceConfig.color }}>
              {confidencePct}%
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="seed-label text-muted-foreground">{t("common.confidence")}</p>
          <p className="text-sm font-medium mt-1" style={{ color: confidenceConfig.color }}>
            {confidenceConfig.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{t("common.aiEstimate")}</p>
        </div>
      </div>

      {/* Treatment checklist */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading-en text-sm font-bold">{t("diag.treatment")}</h3>
          <span className="text-xs text-muted-foreground tabular-nums">
            {completedCount}/{treatments.length}
          </span>
        </div>
        <ul className="space-y-2" role="list">
          {treatments.map((tx) => (
            <li key={tx.id}>
              <button
                type="button"
                onClick={() => handleToggleTreatment(tx.id)}
                className={cn(
                  "w-full flex items-start gap-3 rounded-md border p-3 text-left tap-feedback min-h-[48px] transition-colors",
                  tx.done ? "border-[var(--crop-500)] bg-[color:var(--crop-50)] dark:bg-[color:var(--crop-800)]/30" : "border-border bg-background hover:bg-muted"
                )}
                aria-pressed={tx.done}
              >
                <span
                  className={cn(
                    "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5",
                    tx.done ? "bg-[var(--crop-500)] border-[var(--crop-500)] text-white" : "border-muted-foreground/40"
                  )}
                >
                  {tx.done && <CheckIcon size={12} />}
                </span>
                <span className={cn("text-sm flex-1", tx.done && "line-through text-muted-foreground")}>
                  {tx.text[locale]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Save / scan again */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium tap-feedback min-h-[44px]"
        >
          <CameraIcon size={16} />
          {t("diag.startScan")}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium tap-feedback disabled:opacity-70 min-h-[44px]"
          style={{ background: "var(--crop-500)", color: "#FFFFFF" }}
        >
          {saved ? (
            <>
              <CheckIcon size={16} />
              {savedSync === "confirmed" ? t("sync.confirmed") : t("sync.syncing")}
            </>
          ) : (
            <>
              {t("common.save")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
