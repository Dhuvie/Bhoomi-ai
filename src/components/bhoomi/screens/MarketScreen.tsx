"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSync } from "@/contexts/SyncContext";
import { priceQuotes, fields, cropLabels, PriceQuote, Crop } from "@/lib/mock-data";
import { PriceTicker } from "../PriceTicker";
import { SyncStatusIndicator } from "../SyncStatusIndicator";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "../icons/icons";
import { cn } from "@/lib/utils";

export function MarketScreen() {
  const { locale, t } = useLanguage();
  const [tickers, setTickers] = useState<PriceQuote[]>(priceQuotes);
  // Hydration-safe: start null, set real time after mount
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdate(new Date()); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Simulate live price updates every 8s
  useEffect(() => {
    const id = setInterval(() => {
      setTickers((prev) =>
        prev.map((q) => {
          const drift = (Math.random() - 0.5) * 0.004; // ±0.2% drift
          const newPrice = Math.max(1, q.pricePerQt * (1 + drift));
          const changePct = ((newPrice - q.sparkline[q.sparkline.length - 2]) / q.sparkline[q.sparkline.length - 2]) * 100;
          const trend = Math.abs(changePct) < 0.05 ? "flat" : changePct > 0 ? "up" : "down";
          return {
            ...q,
            pricePerQt: Math.round(newPrice),
            changePct: Number((changePct).toFixed(2)),
            trend: trend as "up" | "down" | "flat",
            sparkline: [...q.sparkline.slice(-9), Math.round(newPrice)],
            updatedAt: new Date().toISOString(),
          };
        })
      );
      setLastUpdate(new Date());
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const userCrops = fields.map((f) => f.crop);
  const yourQuotes = tickers.filter((q) => userCrops.includes(q.crop));
  const otherQuotes = tickers.filter((q) => !userCrops.includes(q.crop));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="seed-label text-muted-foreground">{t("market.title")}</p>
          <h1 className="font-heading-en text-2xl md:text-3xl font-bold mt-1 tracking-tight" style={{ fontFamily: locale === "en" ? "var(--font-heading-en)" : "var(--font-heading-in)" }}>
            {locale === "en" ? "Mandi rates" : locale === "hi" ? "मंडी भाव" : locale === "or" ? "ମଣ୍ଡି ଦର" : "మండి ధరలు"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("market.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground tabular-nums">
            {t("market.lastUpdate")}: {lastUpdate ? lastUpdate.toLocaleTimeString(locale === "en" ? "en-US" : locale, { hour: "2-digit", minute: "2-digit" }) : "—"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--crop-600)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--crop-500)] animate-pulse" />
            <span>Live</span>
          </span>
        </div>
      </header>

      {/* Your crops — highlighted */}
      <section aria-labelledby="your-crops-heading">
        <h2 id="your-crops-heading" className="font-heading-en text-base md:text-lg font-bold mb-3">{t("market.yourCrops")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {yourQuotes.map((q) => (
            <PriceTicker key={q.crop} quote={q} highlighted />
          ))}
        </div>
      </section>

      {/* All crops */}
      <section aria-labelledby="all-crops-heading">
        <h2 id="all-crops-heading" className="font-heading-en text-base md:text-lg font-bold mb-3">
          {locale === "en" ? "All crops" : locale === "hi" ? "सभी फसलें" : locale === "or" ? "ସମସ୍ତ ଫସଲ" : "అన్ని పంటలు"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {otherQuotes.map((q) => (
            <PriceTicker key={q.crop} quote={q} />
          ))}
        </div>
      </section>

      {/* Trend legend */}
      <section className="rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
        <p className="seed-label text-muted-foreground mb-2">
          {locale === "en" ? "Direction key" : locale === "hi" ? "दिशा कुंजी" : locale === "or" ? "ଦିଗ କି" : "దిశ కీ"}
        </p>
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <span className="flex items-center gap-1.5">
            <ArrowUpIcon size={14} className="text-[var(--crop-600)]" />
            <span className="text-[var(--crop-600)] font-medium">{t("market.trend.up")}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ArrowDownIcon size={14} className="text-[var(--red-600)]" />
            <span className="text-[var(--red-600)] font-medium">{t("market.trend.down")}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MinusIcon size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground font-medium">{t("market.trend.flat")}</span>
          </span>
        </div>
      </section>
    </div>
  );
}
