"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type Screen = "dashboard" | "fields" | "diagnose" | "insights" | "market";

interface AppContextValue {
  screen: Screen;
  setScreen: (s: Screen) => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  alertsOpen: boolean;
  setAlertsOpen: (open: boolean) => void;
  voiceOpen: boolean;
  setVoiceOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const value: AppContextValue = {
    screen,
    setScreen,
    selectedFieldId,
    setSelectedFieldId,
    settingsOpen,
    setSettingsOpen,
    alertsOpen,
    setAlertsOpen,
    voiceOpen,
    setVoiceOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppContextProvider");
  return ctx;
}
