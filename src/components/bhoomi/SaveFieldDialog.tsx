"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useSync } from "@/contexts/SyncContext";
import { Crop, cropLabels } from "@/lib/mock-data";
import { FieldBoundary } from "@/lib/mock-data";
import { calculateAreaAcres, calculateCentroid, useFieldsStore } from "@/contexts/FieldsStoreContext";
import { XIcon, CheckIcon, MapPinIcon } from "./icons/icons";

interface SaveFieldDialogProps {
  boundary: FieldBoundary[];
  onSave: () => void;
  onCancel: () => void;
}

export function SaveFieldDialog({ boundary, onSave, onCancel }: SaveFieldDialogProps) {
  const { locale, t } = useLanguage();
  const { vibrate } = useSettings();
  const { addField } = useFieldsStore();
  const { register, update } = useSync();
  const [name, setName] = useState("");
  const [crop, setCrop] = useState<Crop>("rice");
  const [saving, setSaving] = useState(false);
  const [syncId] = useState(() => `field-save-${Date.now()}`);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const areaAcres = calculateAreaAcres(boundary);
  const center = calculateCentroid(boundary);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Handle Escape
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onCancel();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [saving, onCancel]);

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    vibrate([10, 30, 10]);
    setSaving(true);
    register(syncId, locale === "en" ? "Saving field" : locale === "hi" ? "खेत सहेजा" : locale === "or" ? "କ୍ଷେତ୍ର ସାଇତିଲା" : "పొలం సేవ్");
    update(syncId, "syncing");

    // Simulate a brief network round-trip for the sync indicator
    await new Promise((r) => setTimeout(r, 600));

    addField({
      name: name.trim(),
      crop,
      boundary,
      center,
      areaAcres,
    });

    update(syncId, "confirmed");
    vibrate([15, 40, 15]);
    setTimeout(() => onSave(), 300);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("fields.saveBoundary")}
    >
      <div className="absolute inset-0 bg-black/50" onClick={() => !saving && onCancel()} aria-hidden="true" />
      <div className="relative w-full md:max-w-md rounded-t-2xl md:rounded-2xl bg-card border border-border shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto morph-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-md"
              style={{ background: "var(--crop-500)", color: "#FFFFFF" }}
              aria-hidden="true"
            >
              <MapPinIcon size={16} />
            </div>
            <h2 className="font-heading-en text-base font-bold">{t("fields.saveBoundary")}</h2>
          </div>
          <button
            type="button"
            onClick={() => !saving && onCancel()}
            disabled={saving}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-muted tap-feedback disabled:opacity-50"
            aria-label={t("common.close")}
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Area + location summary */}
          <div className="rounded-md border border-border bg-muted/40 p-3 flex items-center justify-between">
            <div>
              <p className="seed-label text-muted-foreground">{t("fields.area")}</p>
              <p className="instrument-num text-xl tabular-nums" style={{ color: "var(--crop-600)" }}>
                {areaAcres} <span className="text-sm text-muted-foreground">{locale === "en" ? "acres" : locale === "hi" ? "एकड़" : locale === "or" ? "ଏକର" : "ఎకరాలు"}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="seed-label text-muted-foreground">{locale === "en" ? "Points" : locale === "hi" ? "बिंदु" : locale === "or" ? "ବିନ୍ଦୁ" : "బిందువులు"}</p>
              <p className="instrument-num text-xl tabular-nums">{boundary.length}</p>
            </div>
          </div>

          {/* Field name */}
          <div>
            <label htmlFor="field-name" className="seed-label text-muted-foreground block mb-1.5">
              {locale === "en" ? "Field name" : locale === "hi" ? "खेत का नाम" : locale === "or" ? "କ୍ଷେତ୍ର ନାମ" : "పొలం పేరు"}
            </label>
            <input
              ref={nameInputRef}
              id="field-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={locale === "en" ? "e.g. Pedda Chetla" : locale === "hi" ? "जैसे पेड्डा चेतला" : locale === "or" ? "ଯେମାନ ପେଦ୍ଦା ଚେତ୍ଲା" : "ఉదాహరణ పెద్ద చెట్ల"}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) handleSave();
              }}
              disabled={saving}
            />
          </div>

          {/* Crop selection */}
          <div>
            <label className="seed-label text-muted-foreground block mb-1.5">
              {t("fields.crop")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(cropLabels) as Crop[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { vibrate(8); setCrop(c); }}
                  disabled={saving}
                  className={
                    "rounded-md border p-2 text-xs font-medium tap-feedback min-h-[44px] transition-colors " +
                    (crop === c
                      ? "border-[var(--crop-500)] bg-[color:var(--crop-50)] dark:bg-[color:var(--crop-800)]/40 text-foreground"
                      : "border-border bg-background hover:bg-muted text-muted-foreground")
                  }
                  aria-pressed={crop === c}
                >
                  {cropLabels[c][locale]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-border sticky bottom-0 bg-card">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium tap-feedback disabled:opacity-50 min-h-[44px]"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium tap-feedback disabled:opacity-50 min-h-[44px]"
            style={{ background: "var(--crop-500)", color: "#FFFFFF" }}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                {t("sync.syncing")}…
              </>
            ) : (
              <>
                <CheckIcon size={16} />
                {t("common.save")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
