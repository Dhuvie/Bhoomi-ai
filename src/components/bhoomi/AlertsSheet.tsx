"use client";

import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { alerts as allAlerts, Alert } from "@/lib/mock-data";
import { XIcon } from "./icons/icons";
import { AlertBanner } from "./AlertBanner";
import { fields } from "@/lib/mock-data";

export function AlertsSheet() {
  const { setAlertsOpen } = useApp();
  const { locale, t } = useLanguage();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = allAlerts.filter((a) => !dismissed.has(a.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.alerts")}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setAlertsOpen(false)}
        aria-hidden="true"
      />
      <div className="relative w-full md:max-w-lg rounded-t-2xl md:rounded-2xl bg-card border border-border shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="font-heading-en text-lg font-bold">{t("nav.alerts")}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {visible.length === 0 ? t("dash.noAlerts") : `${visible.length} active`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAlertsOpen(false)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-muted tap-feedback"
            aria-label={t("common.close")}
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {visible.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-[color:var(--crop-100)] dark:bg-[color:var(--crop-800)]/40 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--crop-600)" strokeWidth="2">
                  <path d="M5 12l5 5 9-11" strokeLinecap="square" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">{t("dash.noAlerts")}</p>
            </div>
          ) : (
            visible.map((a: Alert) => {
              const field = a.fieldId ? fields.find((f) => f.id === a.fieldId) : null;
              return (
                <AlertBanner
                  key={a.id}
                  severity={a.severity}
                  title={t(a.titleKey as Parameters<typeof t>[0]) || a.titleFallback}
                  detail={a.detail[locale] + (field ? ` — ${field.name}` : "")}
                  onDismiss={() => {
                    setDismissed((prev) => new Set([...prev, a.id]));
                  }}
                  actionLabel={t("common.viewDetails")}
                  onAction={() => setAlertsOpen(false)}
                  playChime={false}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
