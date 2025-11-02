"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import { useSync } from "@/contexts/SyncContext";
import { fields, yieldForecasts, cropLabels, soilReading, Crop } from "@/lib/mock-data";
import { generateYieldForecast, getSoilRecommendations, SoilRecommendation } from "@/lib/ai";
import { YieldForecastChart } from "../YieldForecastChart";
import { SoilCrossSection } from "../SoilCrossSection";
import { SyncStatusIndicator } from "../SyncStatusIndicator";
import { SproutIcon, ChevronRightIcon, HourglassIcon } from "../icons/icons";
import { cn } from "@/lib/utils";

export function InsightsScreen() {
  const { locale, t } = useLanguage();
  const { selectedFieldId, setSelectedFieldId } = useApp();
  const [activeFieldId, setActiveFieldId] = useState<string>(selectedFieldId || fields[0].id);
  const [forecast, setForecast] = useState<typeof yieldForecasts[number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<SoilRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [syncState, setSyncState] = useState<"syncing" | "confirmed">("syncing");
  const [revealed, setRevealed] = useState(false);

  // Load forecast — calls real backend with field context
  useEffect(() => {
    let cancelled = false;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    setRevealed(false);
    setSyncState("syncing");
    const field = fields.find((f) => f.id === activeFieldId);
    const base = yieldForecasts.find((f) => f.fieldId === activeFieldId);
    generateYieldForecast(activeFieldId, locale, field ? {
      crop: field.crop,
      areaAcres: field.areaAcres,
      daysSincePlanting: field.daysSincePlanting,
      growthStage: field.growthStage,
      healthScore: field.healthScore,
      ndvi: field.ndvi,
      moisture: field.moisture,
    } : undefined)
      .then((res) => {
        if (cancelled) return;
        if (base) {
          setForecast({
            ...base,
            expectedQt: res.expectedQt,
            lowQt: res.lowQt,
            highQt: res.highQt,
            confidence: res.confidence,
            factors: res.factors.map((f, i) => ({
              ...base.factors[i % base.factors.length],
              label: { en: f.label, hi: f.label, or: f.label, te: f.label },
              impact: f.impact,
              weight: f.weight,
            })),
          });
        }
        setSyncState("confirmed");
        setLoading(false);
        setTimeout(() => setRevealed(true), 100);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        setSyncState("confirmed");
      });
    return () => { cancelled = true; };
  }, [activeFieldId, locale]);

  // Load recommendations
  useEffect(() => {
    let cancelled = false;
    setRecsLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    getSoilRecommendations(
      { n: soilReading.nitrogenPpm, p: soilReading.phosphorusPpm, k: soilReading.potassiumPpm, pH: soilReading.pH, moisture: soilReading.moisture },
      locale
    ).then((recs) => {
      if (cancelled) return;
      setRecommendations(recs);
      setRecsLoading(false);
    });
    return () => { cancelled = true; };
  }, [locale]);

  const activeField = fields.find((f) => f.id === activeFieldId)!;

  return (
    <div className="space-y-6">
      <header>
        <p className="seed-label text-muted-foreground">{t("insights.yield.title")}</p>
        <h1 className="font-heading-en text-2xl md:text-3xl font-bold mt-1 tracking-tight" style={{ fontFamily: locale === "en" ? "var(--font-heading-en)" : "var(--font-heading-in)" }}>
          {locale === "en" ? "Forecast & soil" : locale === "hi" ? "पूर्वानुमान व मिट्टी" : locale === "or" ? "ପୂର୍ବାନୁମାନ ଓ ମାଟି" : "సూచన & నేల"}
        </h1>
      </header>

      {/* Field selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 md:mx-0 px-4 md:px-0 pb-1">
        {fields.map((f) => {
          const active = f.id === activeFieldId;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFieldId(f.id)}
              className={cn(
                "flex-shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium tap-feedback min-h-[40px]",
                active ? "border-[var(--crop-500)] bg-[color:var(--crop-50)] dark:bg-[color:var(--crop-800)]/40 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", active ? "bg-[var(--crop-500)]" : "bg-muted-foreground/30")} />
              {f.name}
              <span className="text-xs text-muted-foreground">· {cropLabels[f.crop][locale]}</span>
            </button>
          );
        })}
      </div>

      {/* Yield forecast section */}
      <section aria-labelledby="yield-heading">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 id="yield-heading" className="font-heading-en text-lg font-bold">{t("insights.yield.title")}</h2>
          {syncState === "confirmed" && !loading ? (
            <SyncStatusIndicator state="confirmed" label={locale === "en" ? "Forecast ready" : locale === "hi" ? "पूर्वानुमान तैयार" : locale === "or" ? "ପୂର୍ବାନୁମାନ ପ୍ରସ୍ତୁତ" : "సూచన సిద్ధం"} />
          ) : (
            <SyncStatusIndicator state="syncing" />
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-4 md:p-5 shadow-[var(--shadow-sm)]">
          <p className="text-sm text-muted-foreground mb-1">{t("insights.yield.subtitle")}</p>

          {loading ? (
            <YieldForecastSkeleton />
          ) : forecast ? (
            <>
              {/* Yield range reveal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <YieldNumber
                  label={t("insights.yield.expected")}
                  value={forecast.expectedQt}
                  color="var(--crop-600)"
                  revealed={revealed}
                  delay={0}
                />
                <YieldNumber
                  label={t("insights.yield.range")}
                  value={`${forecast.lowQt}–${forecast.highQt}`}
                  unit="qt/ac"
                  color="var(--soil-600)"
                  revealed={revealed}
                  delay={200}
                  isRange
                />
                <YieldNumber
                  label={t("common.confidence")}
                  value={Math.round(forecast.confidence * 100)}
                  unit="%"
                  color="var(--amber-500)"
                  revealed={revealed}
                  delay={400}
                />
              </div>

              {/* Uncertainty band chart */}
              <YieldForecastChart forecast={forecast} revealed={revealed} />

              {/* Factors driving the forecast */}
              <div className="mt-5 pt-4 border-t border-border">
                <h3 className="seed-label text-muted-foreground mb-3">{t("insights.yield.factors")}</h3>
                <ul className="space-y-2" role="list">
                  {forecast.factors.map((factor, i) => {
                    const impactColor = factor.impact === "positive" ? "var(--crop-500)" : factor.impact === "negative" ? "var(--red-500)" : "var(--soil-500)";
                    const impactSign = factor.impact === "positive" ? "+" : factor.impact === "negative" ? "−" : "·";
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold tabular-nums"
                          style={{ background: `color-mix(in srgb, ${impactColor} 15%, transparent)`, color: impactColor }}
                        >
                          {impactSign}
                        </span>
                        <span className="text-sm flex-1">{factor.label[locale]}</span>
                        <div className="flex-shrink-0 w-20 h-1.5 rounded-full overflow-hidden bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${factor.weight * 100}%`,
                              background: impactColor,
                              transition: `width 600ms cubic-bezier(0.2,0,0,1) ${300 + i * 80}ms`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                          {Math.round(factor.weight * 100)}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
                <HourglassIcon size={12} />
                {t("common.aiEstimate")} · bhoomi-yield-v0.3.2
              </p>
            </>
          ) : null}
        </div>
      </section>

      {/* Soil cross-section */}
      <section aria-labelledby="soil-heading">
        <h2 id="soil-heading" className="font-heading-en text-lg font-bold mb-3">{t("insights.soil.title")}</h2>
        <div className="rounded-lg border border-border bg-card p-4 md:p-5 shadow-[var(--shadow-sm)]">
          <p className="text-sm text-muted-foreground mb-1">{t("insights.soil.subtitle")}</p>
          <p className="seed-label text-muted-foreground mb-4 tabular-nums">
            {new Date(soilReading.sampledAt).toLocaleDateString(locale === "en" ? "en-US" : locale, { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <SoilCrossSection reading={soilReading} />
        </div>
      </section>

      {/* Crop recommendations */}
      <section aria-labelledby="rec-heading">
        <h2 id="rec-heading" className="font-heading-en text-lg font-bold mb-3">{t("insights.soil.recommendations")}</h2>
        {recsLoading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton-block h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {recommendations.map((r, i) => {
              const suitColor = r.suitability === "high" ? "var(--crop-500)" : r.suitability === "medium" ? "var(--amber-500)" : "var(--red-500)";
              const cropLabel = (cropLabels[r.crop as Crop] || { [locale]: r.crop })[locale];
              return (
                <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-sm)] flex items-start gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${suitColor} 12%, var(--card))`, color: suitColor }}
                    aria-hidden="true"
                  >
                    <SproutIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold">{cropLabel}</p>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: `color-mix(in srgb, ${suitColor} 12%, transparent)`, color: suitColor }}
                      >
                        {t(`common.${r.suitability}` as Parameters<typeof t>[0])}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/85 leading-relaxed">{r.reason[locale]}</p>
                    <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                      {locale === "en" ? "Expected" : locale === "hi" ? "अपेक्षित" : locale === "or" ? "ପ୍ରତ୍ୟାଶିତ" : "ఊహించిన"} ~{r.expectedYieldQt} qt/ac
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function YieldNumber({
  label, value, unit, color, revealed, delay, isRange,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  revealed: boolean;
  delay: number;
  isRange?: boolean;
}) {
  return (
    <div
      className="rounded-md border border-border bg-background p-3"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
        transition: `opacity 700ms cubic-bezier(0.2,0,0,1) ${delay}ms, transform 700ms cubic-bezier(0.2,0,0,1) ${delay}ms`,
      }}
    >
      <p className="seed-label text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className={cn("instrument-num tabular-nums", isRange ? "text-xl" : "text-3xl")}
          style={{ color, fontWeight: 500 }}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground tabular-nums">{unit}</span>}
      </div>
    </div>
  );
}

function YieldForecastSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton-block h-20 rounded-md" />
        ))}
      </div>
      <div className="skeleton-block h-48 w-full rounded-md" />
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton-block h-6 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
