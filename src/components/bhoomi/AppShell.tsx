"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useApp, Screen } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import {
  DashboardIcon, FieldIcon, DiagnoseIcon, InsightsIcon, MarketIcon,
  VoiceIcon, AlertIcon, SettingsIcon, SproutIcon
} from "./icons/icons";
import { LanguageSwitch } from "./LanguageSwitch";
import { GlobalSyncIndicator } from "./SyncStatusIndicator";
import { VoiceAssistantTrigger } from "./VoiceAssistantTrigger";
import { SettingsSheet } from "./SettingsSheet";
import { AlertsSheet } from "./AlertsSheet";
import { alerts } from "@/lib/mock-data";
import { TranslationKey } from "@/lib/i18n";

interface NavItem {
  screen: Screen;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  labelKey: TranslationKey;
}

const NAV_ITEMS: NavItem[] = [
  { screen: "dashboard", icon: DashboardIcon, labelKey: "nav.dashboard" },
  { screen: "fields", icon: FieldIcon, labelKey: "nav.fields" },
  { screen: "diagnose", icon: DiagnoseIcon, labelKey: "nav.diagnose" },
  { screen: "insights", icon: InsightsIcon, labelKey: "nav.insights" },
  { screen: "market", icon: MarketIcon, labelKey: "nav.market" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { screen, setScreen, settingsOpen, alertsOpen, voiceOpen, setSettingsOpen, setAlertsOpen, setVoiceOpen } = useApp();
  const { t } = useLanguage();
  const { vibrate } = useSettings();

  const handleNav = (s: Screen) => {
    if (s === screen) return;
    vibrate(10);
    setScreen(s);
  };

  const urgentCount = alerts.filter(a => a.severity === "high").length;

  return (
    <div className="flex min-h-dvh flex-col md:flex-row bg-background">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:w-60 lg:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 border-r border-border bg-sidebar z-30"
        aria-label="Primary navigation"
      >
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-md"
            style={{ background: "var(--crop-600)", color: "#FFFFFF" }}
            aria-hidden="true"
          >
            <SproutIcon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading-en text-lg font-bold tracking-tight leading-none text-sidebar-foreground">
              Bhoomi
            </span>
            <span className="seed-label text-sidebar-foreground/60 mt-0.5">
              {t("app.tagline")}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = screen === item.screen;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => handleNav(item.screen)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium tap-feedback",
                  "min-h-[44px] transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <Icon size={20} className={cn(active && "text-[var(--crop-600)] dark:text-[var(--crop-400)]")} />
                <span>{t(item.labelKey)}</span>
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--crop-500)" }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-3 py-4 space-y-2">
          <div className="px-3 pb-2 flex items-center justify-between">
            <GlobalSyncIndicator />
          </div>
          <button
            type="button"
            onClick={() => { vibrate(10); setVoiceOpen(true); }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium tap-feedback text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground min-h-[44px]"
          >
            <VoiceIcon size={20} />
            <span>{t("nav.voice")}</span>
          </button>
          <button
            type="button"
            onClick={() => { vibrate(10); setAlertsOpen(true); }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium tap-feedback text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground min-h-[44px] relative"
          >
            <AlertIcon size={20} />
            <span>{t("nav.alerts")}</span>
            {urgentCount > 0 && (
              <span
                className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold tabular-nums text-white"
                style={{ background: "var(--red-500)" }}
              >
                {urgentCount}
              </span>
            )}
          </button>
          <LanguageSwitch className="w-full" />
          <button
            type="button"
            onClick={() => { vibrate(10); setSettingsOpen(true); }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium tap-feedback text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground min-h-[44px]"
          >
            <SettingsIcon size={20} />
            <span>{t("nav.settings")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header
        className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-md"
            style={{ background: "var(--crop-600)", color: "#FFFFFF" }}
            aria-hidden="true"
          >
            <SproutIcon size={18} />
          </div>
          <span className="font-heading-en text-base font-bold tracking-tight">Bhoomi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GlobalSyncIndicator />
          <button
            type="button"
            onClick={() => { vibrate(10); setSettingsOpen(true); }}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-border tap-feedback"
            aria-label={t("nav.settings")}
          >
            <SettingsIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => { vibrate(10); setAlertsOpen(true); }}
            className="relative w-9 h-9 inline-flex items-center justify-center rounded-md border border-border tap-feedback"
            aria-label={t("nav.alerts")}
          >
            <AlertIcon size={18} />
            {urgentCount > 0 && (
              <span
                className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[9px] font-bold tabular-nums text-white"
                style={{ background: "var(--red-500)" }}
              >
                {urgentCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 md:ml-60 lg:ml-64 pb-24 md:pb-8 pt-4 md:pt-8 px-4 md:px-8 max-w-[1400px] w-full mx-auto">
        <div className="md:hidden flex items-center justify-end gap-2 mb-3">
          <LanguageSwitch variant="label" />
        </div>
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
        aria-label="Primary navigation"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
      >
        <div className="grid grid-cols-5 gap-1 px-1 py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = screen === item.screen;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => handleNav(item.screen)}
                aria-current={active ? "page" : undefined}
                aria-label={t(item.labelKey)}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 rounded-md tap-feedback min-h-[56px] justify-center",
                  active ? "text-[var(--crop-600)] dark:text-[var(--crop-400)]" : "text-muted-foreground"
                )}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium leading-none">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Voice FAB — mobile */}
      <VoiceAssistantTrigger />

      {/* Sheets */}
      {settingsOpen && <SettingsSheet />}
      {alertsOpen && <AlertsSheet />}
      {voiceOpen && null}
    </div>
  );
}
