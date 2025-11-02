"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface Settings {
  theme: "light" | "dark";
  sound: boolean;
  haptics: boolean;
  dataSaver: boolean;
}

interface SettingsContextValue extends Settings {
  setTheme: (t: "light" | "dark") => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  toggleDataSaver: () => void;
  vibrate: (pattern?: number | number[]) => void;
  playAlertChime: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = "bhoomi.settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    sound: false,
    haptics: true,
    dataSaver: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings((s) => ({ ...s, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    const el = document.documentElement;
    if (settings.theme === "dark") {
      el.classList.add("dark");
    } else {
      el.classList.remove("dark");
    }
  }, [settings.theme]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const setTheme = useCallback((theme: "light" | "dark") => {
    setSettings((s) => ({ ...s, theme }));
  }, []);

  const toggleSound = useCallback(() => setSettings((s) => ({ ...s, sound: !s.sound })), []);
  const toggleHaptics = useCallback(() => setSettings((s) => ({ ...s, haptics: !s.haptics })), []);
  const toggleDataSaver = useCallback(() => setSettings((s) => ({ ...s, dataSaver: !s.dataSaver })), []);

  const vibrate = useCallback((pattern: number | number[] = 15) => {
    setSettings((current) => {
      if (current.haptics && typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(pattern);
        } catch {
          // ignore
        }
      }
      return current;
    });
  }, []);

  const playAlertChime = useCallback(() => {
    setSettings((current) => {
      if (!current.sound) return current;
      try {
        const AudioCtx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
        const ctx = new AudioCtx();
        // Soft two-tone chime — low and short
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now); // C5
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc1.connect(gain1).connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.2);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(392, now + 0.12); // G4
        gain2.gain.setValueAtTime(0, now + 0.12);
        gain2.gain.linearRampToValueAtTime(0.18, now + 0.14);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.52);

        setTimeout(() => ctx.close(), 800);
      } catch {
        // ignore
      }
      return current;
    });
  }, []);

  const value: SettingsContextValue = {
    ...settings,
    setTheme,
    toggleSound,
    toggleHaptics,
    toggleDataSaver,
    vibrate,
    playAlertChime,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
