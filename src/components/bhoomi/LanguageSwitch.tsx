"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageIcon, CheckIcon } from "./icons/icons";
import { Locale } from "@/lib/i18n";

interface LanguageSwitchProps {
  className?: string;
  variant?: "icon" | "label";
}

export function LanguageSwitch({ className, variant = "label" }: LanguageSwitchProps) {
  const { locale, setLocale, locales, localeLabel } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm tap-feedback",
          "hover:bg-muted transition-colors",
          "min-h-[40px] font-medium"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
      >
        {variant === "icon" ? <LanguageIcon size={16} /> : null}
        <span className="text-foreground">{localeLabel}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-popover p-1 shadow-[var(--shadow-lg)] z-50"
        >
          {locales.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === locale}
              onClick={() => {
                setLocale(l.code as Locale);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm tap-feedback",
                "hover:bg-muted min-h-[40px]",
                l.code === locale && "bg-accent text-accent-foreground"
              )}
            >
              <span className="flex flex-col items-start">
                <span className="font-medium">{l.label}</span>
                <span className="text-xs text-muted-foreground">{l.englishName}</span>
              </span>
              {l.code === locale && <CheckIcon size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
