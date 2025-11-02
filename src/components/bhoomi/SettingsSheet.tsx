"use client";

import React from "react";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { XIcon } from "./icons/icons";
import { LOCALES, Locale } from "@/lib/i18n";

export function SettingsSheet() {
  const { setSettingsOpen } = useApp();
  const { locale, setLocale, t } = useLanguage();
  const { theme, setTheme, sound, toggleSound, haptics, toggleHaptics, dataSaver, toggleDataSaver } = useSettings();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("settings.title")}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setSettingsOpen(false)}
        aria-hidden="true"
      />
      <div className="relative w-full md:max-w-lg rounded-t-2xl md:rounded-2xl bg-card border border-border shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-heading-en text-lg font-bold">{t("settings.title")}</h2>
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-muted tap-feedback"
            aria-label={t("common.close")}
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Language */}
          <section>
            <h3 className="seed-label text-muted-foreground mb-3">{t("settings.language")}</h3>
            <div className="grid grid-cols-2 gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLocale(l.code as Locale)}
                  className={
                    "flex flex-col items-start gap-0.5 rounded-md border p-3 text-left tap-feedback min-h-[60px] " +
                    (locale === l.code
                      ? "border-[var(--crop-500)] bg-[color:var(--crop-50)] dark:bg-[color:var(--crop-800)]/40"
                      : "border-border bg-background hover:bg-muted")
                  }
                  aria-pressed={locale === l.code}
                >
                  <span className="font-semibold text-base" style={{ fontFamily: "var(--font-heading-in)" }}>
                    {l.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{l.englishName}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Appearance */}
          <section>
            <h3 className="seed-label text-muted-foreground mb-3">{t("settings.theme")}</h3>
            <div className="grid grid-cols-2 gap-2">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                  className={
                    "flex items-center gap-3 rounded-md border p-3 tap-feedback min-h-[56px] " +
                    (theme === mode
                      ? "border-[var(--crop-500)] bg-[color:var(--crop-50)] dark:bg-[color:var(--crop-800)]/40"
                      : "border-border bg-background hover:bg-muted")
                  }
                  aria-pressed={theme === mode}
                >
                  <span
                    className="w-8 h-8 rounded-full border border-border"
                    style={{
                      background: mode === "light" ? "var(--soil-50)" : "var(--soil-900)",
                      borderColor: mode === "light" ? "var(--soil-300)" : "var(--soil-700)",
                    }}
                  />
                  <span className="text-sm font-medium">
                    {mode === "light" ? t("settings.theme.light") : t("settings.theme.dark")}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Toggles */}
          <section className="space-y-3">
            <ToggleRow
              label={t("settings.sound")}
              desc={t("settings.soundDesc")}
              checked={sound}
              onToggle={toggleSound}
            />
            <ToggleRow
              label={t("settings.haptics")}
              desc={t("settings.hapticsDesc")}
              checked={haptics}
              onToggle={toggleHaptics}
            />
            <ToggleRow
              label={t("settings.dataSaver")}
              desc={t("settings.dataSaverDesc")}
              checked={dataSaver}
              onToggle={toggleDataSaver}
            />
          </section>

          <div className="pt-2 text-center">
            <p className="text-xs text-muted-foreground">
              Bhoomi · v0.1.0 · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label, desc, checked, onToggle,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-background p-3">
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors tap-feedback"
        style={{ background: checked ? "var(--crop-500)" : "var(--soil-300)" }}
      >
        <span
          className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(22px)" : "translateX(2px)", marginTop: "2px" }}
        />
      </button>
    </div>
  );
}
