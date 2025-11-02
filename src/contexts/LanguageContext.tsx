"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Locale, t as translate, TranslationKey, LOCALES } from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
  localeLabel: string;
  locales: typeof LOCALES;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "bhoomi.locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && ["en", "hi", "or", "te"].includes(saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(saved);
      }
    } catch {
      // ignore — default to en
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
  }, [locale]);

  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale]);

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t,
    localeLabel: LOCALES.find((l) => l.code === locale)?.label ?? "English",
    locales: LOCALES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
