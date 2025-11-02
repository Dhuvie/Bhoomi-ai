"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useFieldsStore } from "@/contexts/FieldsStoreContext";
import { useLocation } from "@/contexts/LocationContext";
import { AlertBanner } from "../AlertBanner";
import { WeatherBackground } from "../WeatherBackground";
import { NumberRoll } from "../NumberRoll";
import { EmptyState } from "../EmptyState";
import {
  alerts, priceQuotes, cropLabels, Field,
} from "@/lib/mock-data";
import {
  getWeatherIcon, DropletIcon, WindIcon, SunIcon, ChevronRightIcon, SproutIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon,
} from "../icons/icons";
import { cn } from "@/lib/utils";
import { TranslationKey } from "@/lib/i18n";

export function DashboardScreen() {
  const { locale, t } = useLanguage();
  const { setScreen, setSelectedFieldId, setAlertsOpen } = useApp();
  const { playAlertChime } = useSettings();
  const { fields } = useFieldsStore();
  const { weather, locationName, requestLocation, permissionState } = useLocation();
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const hasHigh = alerts.some((a) => a.severity === "high" && !dismissedAlertIds.has(a.id));
    if (hasHigh) {
      const id = setTimeout(() => playAlertChime(), 600);
      return () => clearTimeout(id);
    }
  }, []);

  // Greeting — hydration-safe.
  const [greeting, setGreeting] = useState<string>(t("dash.greeting.morning"));
  useEffect(() => {
    const h = new Date().getHours();
    const next = h < 12 ? t("dash.greeting.morning") : h < 17 ? t("dash.greeting.afternoon") : t("dash.greeting.evening");
    setGreeting(next); // eslint-disable-line react-hooks/set-state-in-effect
  }, [t]);

  const visibleAlerts = alerts.filter((a) => !dismissedAlertIds.has(a.id)).slice(0, 3);
  const yourCropQuotes = priceQuotes.filter((p) => fields.some((f) => f.crop === p.crop));
  const otherQuotes = priceQuotes.filter((p) => !fields.some((f) => f.crop === p.crop));
  const movers = [...yourCropQuotes, ...otherQuotes].slice(0, 4);

  const currentWeather = weather?.current;
  const forecast = weather?.forecast ?? [];
  const weatherCondition = currentWeather?.condition ?? "haze";

  return (
    <WeatherBackground condition={weatherCondition}>
      <div className="space-y-6 -mx-4 md:-mx-8 px-4 md:px-8 pt-2 pb-4 -mt-4 md:-mt-8">
        <header className="pt-4 md:pt-6">
          <p className="seed-label text-muted-foreground">{greeting}</p>
          <h1
            className="font-heading-en text-2xl md:text-3xl font-bold mt-1 tracking-tight"
            style={{ fontFamily: locale === "en" ? "var(--font-heading-en)" : "var(--font-heading-in)" }}
          >
            {locale === "en" ? "Your fields today" : locale === "hi" ? "आज आपके खेत" : locale === "or" ? "ଆଜି ଆପଣଙ୍କ କ୍ଷେତ୍ର" : "ఈ రోజు మీ పొలాలు"}
          </h1>
        </header>

        <WeatherStrip
          weather={currentWeather}
          forecast={forecast}
          locationName={locationName}
          permissionState={permissionState}
          onRequestLocation={requestLocation}
        />

        {/* Urgent alerts */}
        <section aria-labelledby="alerts-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="alerts-heading" className="font-heading-en text-base md:text-lg font-bold">
              {t("dash.urgentAlerts")}
            </h2>
            {visibleAlerts.length > 0 && (
              <button
                type="button"
                onClick={() => setAlertsOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground tap-feedback inline-flex items-center gap-1"
              >
                {t("alert.viewAll")} <ChevronRightIcon size={12} />
              </button>
            )}
          </div>

          {visibleAlerts.length === 0 ? (
            <EmptyState
              type="no-alerts"
              title={t("dash.noAlerts")}
              description={locale === "en"
                ? "We're watching your fields, weather, and pest pressure. You'll see a banner here the moment something needs your attention."
                : locale === "hi"
                ? "हम आपके खेत, मौसम और कीट दबाव पर नज़र रख रहे हैं। जैसे ही कुछ ध्यान चाहिए, यहाँ बैनर दिखेगा।"
                : locale === "or"
                ? "ଆମେ ଆପଣଙ୍କ କ୍ଷେତ୍ର, ପାଣିପାଗ ଓ ପୋକ ଉପରେ ନଜର ରଖୁଛୁ।"
                : "మేము మీ పొలాలు, వాతావరణం, పురుగులపై కనిపెట్టుకుంటున్నాము."}
            />
          ) : (
            <div className="space-y-3">
              {visibleAlerts.map((a) => {
                const field = a.fieldId ? fields.find((f) => f.id === a.fieldId) : null;
                return (
                  <AlertBanner
                    key={a.id}
                    severity={a.severity}
                    title={t(a.titleKey as TranslationKey) || a.titleFallback}
                    detail={a.detail[locale] + (field ? ` — ${field.name}` : "")}
                    onDismiss={() => setDismissedAlertIds((prev) => new Set([...prev, a.id]))}
                    actionLabel={field ? t("common.viewDetails") : undefined}
                    onAction={field ? () => { setSelectedFieldId(field.id); setScreen("fields"); } : undefined}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Field health pulses */}
        <section aria-labelledby="health-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="health-heading" className="font-heading-en text-base md:text-lg font-bold">
              {t("dash.fieldHealth")}
            </h2>
            <button
              type="button"
              onClick={() => { setSelectedFieldId(null); setScreen("fields"); }}
              className="text-xs text-muted-foreground hover:text-foreground tap-feedback inline-flex items-center gap-1"
            >
              {t("nav.fields")} <ChevronRightIcon size={12} />
            </button>
          </div>

          {fields.length === 0 ? (
            <EmptyState
              type="no-fields"
              title={locale === "en" ? "No fields yet" : locale === "hi" ? "अभी कोई खेत नहीं" : locale === "or" ? "ଏବେ କୌଣସି କ୍ଷେତ୍ର ନାହିଁ" : "ఇంకా పొలాలు లేవు"}
              description={locale === "en"
                ? "Draw your first field boundary on the map and Bhoomi starts tracking its health, moisture, and growth stage."
                : locale === "hi"
                ? "नक्शे पर अपनी पहली खेत सीमा बनाएं और भूमि उसका स्वास्थ्य, नमी और वृद्धि चरण ट्रैक करना शुरू कर देगी।"
                : locale === "or"
                ? "ନକ୍‌ସାରେ ଆପଣଙ୍କ ପ୍ରଥମ କ୍ଷେତ୍ର ସୀମା ଆଙ୍କନ୍ତୁ।"
                : "మ్యాప్‌పై మీ మొదటి పొలం సరిహద్దును గీయండి."}
              actionLabel={t("fields.addField")}
              onAction={() => setScreen("fields")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {fields.map((f) => (
                <FieldHealthTile
                  key={f.id}
                  field={f}
                  onClick={() => { setSelectedFieldId(f.id); setScreen("fields"); }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Market movers */}
        <section aria-labelledby="market-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="market-heading" className="font-heading-en text-base md:text-lg font-bold">
              {t("dash.marketMovers")}
            </h2>
            <button
              type="button"
              onClick={() => setScreen("market")}
              className="text-xs text-muted-foreground hover:text-foreground tap-feedback inline-flex items-center gap-1"
            >
              {t("nav.market")} <ChevronRightIcon size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {movers.map((q) => {
              const trendColor = q.trend === "up" ? "var(--crop-600)" : q.trend === "down" ? "var(--red-600)" : "var(--soil-500)";
              const TrendIconCmp = q.trend === "up" ? ArrowUpIcon : q.trend === "down" ? ArrowDownIcon : MinusIcon;
              return (
                <button
                  key={q.crop}
                  type="button"
                  onClick={() => setScreen("market")}
                  className="text-left rounded-lg border border-border bg-card p-3 shadow-[var(--shadow-sm)] tap-feedback card-hover-lift min-h-[112px]"
                >
                  <p className="seed-label text-muted-foreground mb-1.5">
                    {cropLabels[q.crop][locale]}
                  </p>
                  <div className="instrument-num text-xl" style={{ color: "var(--foreground)" }}>
                    <NumberRoll value={q.pricePerQt} prefix="₹" />
                  </div>
                  <p className="text-xs mt-1 tabular-nums inline-flex items-center gap-0.5" style={{ color: trendColor }}>
                    <TrendIconCmp size={12} />
                    {q.changePct > 0 ? "+" : ""}{q.changePct.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 truncate">{q.market}</p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </WeatherBackground>
  );
}

interface WeatherStripProps {
  weather?: {
    tempC: number;
    feelsLikeC: number;
    condition: "clear" | "cloudy" | "overcast" | "rain" | "storm" | "fog" | "haze";
    humidity: number;
    windKmh: number;
    windDir: string;
    uvIndex: number;
    rainfallMm: number;
  };
  forecast: Array<{
    date: string;
    highC: number;
    lowC: number;
    condition: "clear" | "cloudy" | "overcast" | "rain" | "storm" | "fog" | "haze";
    rainfallMm: number;
    windKmh: number;
  }>;
  locationName: string | null;
  permissionState: "prompt" | "granted" | "denied" | "loading";
  onRequestLocation: () => void;
}

function WeatherStrip({ weather, forecast, locationName, permissionState, onRequestLocation }: WeatherStripProps) {
  const { locale, t } = useLanguage();

  // GPS permission prompt state — show a card asking for location
  if (permissionState === "prompt" || permissionState === "denied") {
    return (
      <div
        className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-[var(--shadow-sm)]"
        role="region"
        aria-label="Weather"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-md flex-shrink-0"
            style={{ background: "color-mix(in srgb, var(--sky-500) 12%, var(--card))", color: "var(--sky-600)" }}
            aria-hidden="true"
          >
            <SunIcon size={28} />
          </div>
          <div className="flex-1">
            <p className="seed-label text-muted-foreground">{t("dash.weather.now")}</p>
            <p className="text-sm font-medium mt-0.5">
              {locale === "en"
                ? "Share your location for live weather & forecast"
                : locale === "hi"
                ? "लाइव मौसम के लिए अपनी लोकेशन शेयर करें"
                : locale === "or"
                ? "ଲାଇଭ୍ ପାଣିପାଗ ପାଇଁ ଆପଣଙ୍କ ଲୋକେସନ୍ ସେୟାର୍ କରନ୍ତୁ"
                : "లైవ్ వాతావరణం కోసం మీ లొకేషన్‌ను షేర్ చేయండి"}
            </p>
            {permissionState === "denied" && (
              <p className="text-xs text-muted-foreground mt-1">
                {locale === "en"
                  ? "Location access was blocked. Tap to try again."
                  : locale === "hi"
                  ? "लोकेशन एक्सेस ब्लॉक किया गया। फिर कोशिश करें।"
                  : locale === "or"
                  ? "ଲୋକେସନ୍ ଆକସେସ୍ ବ୍ଲକ୍ ହୋଇଛି। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।"
                  : "లొకేషన్ యాక్సెస్ బ్లాక్ చేయబడింది. మళ్లీ ప్రయత్నించండి."}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRequestLocation}
            className="rounded-md px-4 py-2.5 text-sm font-medium tap-feedback min-h-[44px] flex-shrink-0"
            style={{ background: "var(--sky-500)", color: "#FFFFFF" }}
          >
            {locale === "en" ? "Allow" : locale === "hi" ? "अनुमति दें" : locale === "or" ? "ଅନୁମତି ଦିଅନ୍ତୁ" : "అనుమతించండి"}
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (permissionState === "loading" || !weather) {
    return (
      <div
        className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-[var(--shadow-sm)]"
        role="region"
        aria-label="Weather"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-md skeleton-block" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-block h-3 w-20" />
            <div className="skeleton-block h-8 w-28" />
            <div className="skeleton-block h-3 w-24" />
          </div>
        </div>
      </div>
    );
  }

  const Icon = getWeatherIcon(weather.condition, 32);

  return (
    <div
      className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-[var(--shadow-sm)] relative overflow-hidden"
      role="region"
      aria-label="Weather"
    >
      <WeatherBackground condition={weather.condition} headerOnly>
        <div className="flex flex-wrap items-start justify-between gap-4 relative">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-md"
              style={{ background: "color-mix(in srgb, var(--sky-500) 12%, var(--card))", color: "var(--sky-600)" }}
              aria-hidden="true"
            >
              {Icon}
            </div>
            <div>
              <p className="seed-label text-muted-foreground flex items-center gap-1.5">
                {t("dash.weather.now")}
                {locationName && (
                  <span className="inline-flex items-center gap-0.5 normal-case font-normal">
                    · <MapPinIconSmall /> {locationName}
                  </span>
                )}
              </p>
              <p className="instrument-num text-3xl md:text-4xl font-medium tabular-nums">
                {Math.round(weather.tempC)}°<span className="text-base text-muted-foreground ml-1">C</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {t("dash.weather.feelsLike")} {Math.round(weather.feelsLikeC)}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            <WeatherStat icon={<DropletIcon size={16} />} value={`${weather.humidity}%`} label={locale === "en" ? "Humidity" : locale === "hi" ? "नमी" : locale === "or" ? "ଆର୍ଦ୍ରତା" : "తేమ"} color="var(--sky-600)" />
            <WeatherStat icon={<WindIcon size={16} />} value={`${Math.round(weather.windKmh)}`} label={locale === "en" ? `km/h ${weather.windDir}` : `${Math.round(weather.windKmh)} किमी/घ`} color="var(--soil-500)" />
            <WeatherStat icon={<SunIcon size={16} />} value={`${weather.uvIndex}`} label={locale === "en" ? "UV" : locale === "hi" ? "यूवी" : locale === "or" ? "ୟୁଭି" : "యూవీ"} color="var(--amber-500)" />
          </div>
        </div>
      </WeatherBackground>

      {/* 7-day forecast */}
      {forecast.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border relative">
          <p className="seed-label text-muted-foreground mb-2">{t("dash.weather.forecast7day")}</p>
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {forecast.map((day, i) => {
              const dIcon = getWeatherIcon(day.condition, 20);
              const dLabel = new Date(day.date).toLocaleDateString(locale === "en" ? "en-US" : locale, { weekday: "short" });
              const isToday = i === 0;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-md p-1.5 md:p-2 transition-colors",
                    isToday ? "bg-muted/60 ring-1 ring-[var(--crop-500)]/40" : "hover:bg-muted/40"
                  )}
                >
                  <span className={cn("text-[10px] font-medium uppercase tracking-wide", isToday ? "text-[var(--crop-600)] dark:text-[var(--crop-400)]" : "text-muted-foreground")}>{dLabel}</span>
                  <span aria-hidden="true" className={cn(day.condition === "rain" || day.condition === "storm" ? "text-[var(--sky-600)]" : day.condition === "clear" ? "text-[var(--amber-500)]" : "text-muted-foreground")}>
                    {dIcon}
                  </span>
                  <span className="instrument-num text-xs tabular-nums">{Math.round(day.highC)}°</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{Math.round(day.lowC)}°</span>
                  {day.rainfallMm > 0 && (
                    <span className="text-[9px] text-[var(--sky-600)] tabular-nums">{Math.round(day.rainfallMm)}mm</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MapPinIconSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ display: "inline", verticalAlign: "middle" }}>
      <path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function WeatherStat({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span style={{ color }} aria-hidden="true">{icon}</span>
      <span className="instrument-num text-base tabular-nums">{value}</span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );
}

function FieldHealthTile({ field, onClick }: { field: Field; onClick: () => void }) {
  const { locale, t } = useLanguage();
  const healthColor = field.healthScore >= 75 ? "var(--crop-500)" : field.healthScore >= 55 ? "var(--amber-500)" : "var(--red-500)";
  const trendArrow = field.healthTrend === "up" ? "▲" : field.healthTrend === "down" ? "▼" : "—";

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-sm)] tap-feedback card-hover-lift relative overflow-hidden"
    >
      {/* Breathing health pulse — top-right indicator */}
      <div
        className="absolute top-3 right-3 w-3 h-3 rounded-full health-pulse"
        style={{ background: healthColor, boxShadow: `0 0 0 4px color-mix(in srgb, ${healthColor} 20%, transparent)` }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0"
          style={{
            background: `color-mix(in srgb, ${healthColor} 12%, var(--card))`,
            color: healthColor,
          }}
          aria-hidden="true"
        >
          <SproutIcon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{field.name}</p>
          <p className="text-xs text-muted-foreground">
            {cropLabels[field.crop][locale]} · {field.areaAcres} {locale === "en" ? "ac" : locale === "hi" ? "एकड़" : locale === "or" ? "ଏକର" : "ఎకరా"}
          </p>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="seed-label text-muted-foreground">{t("fields.healthPulse")}</span>
        <span className="text-xs tabular-nums inline-flex items-center gap-0.5" style={{ color: healthColor }}>
          {trendArrow} {t(`market.trend.${field.healthTrend}` as Parameters<typeof t>[0])}
        </span>
      </div>

      {/* Health bar — segmented like an instrument readout */}
      <div className="flex gap-0.5 h-2 mb-3" role="meter" aria-valuenow={field.healthScore} aria-valuemin={0} aria-valuemax={100} aria-label={`${t("fields.healthPulse")}: ${field.healthScore}`}>
        {Array.from({ length: 10 }).map((_, i) => {
          const filled = i < Math.round(field.healthScore / 10);
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-colors"
              style={{
                background: filled ? healthColor : "color-mix(in srgb, var(--soil-300) 40%, transparent)",
              }}
            />
          );
        })}
      </div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="instrument-num text-lg tabular-nums" style={{ color: healthColor }}>
          {field.healthScore}
        </span>
        <span className="text-muted-foreground">
          NDVI <span className="tabular-nums">{field.ndvi.toFixed(2)}</span> · {field.moisture}%
        </span>
      </div>
    </button>
  );
}
