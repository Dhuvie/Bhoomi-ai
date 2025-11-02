"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Field, FieldStoryEvent } from "@/lib/mock-data";
import {
  SproutIcon, SunIcon, FieldIcon, DiagnoseIcon, ScissorsIcon, CheckIcon, CalendarIcon,
} from "./icons/icons";
import { TranslationKey } from "@/lib/i18n";

const eventConfig: Record<FieldStoryEvent["type"], { icon: React.ComponentType<{ size?: number }>; labelKey: TranslationKey; color: string }> = {
  planting: { icon: SproutIcon, labelKey: "story.planting", color: "var(--crop-500)" },
  germination: { icon: SproutIcon, labelKey: "story.germination", color: "var(--crop-400)" },
  vegetative: { icon: FieldIcon, labelKey: "story.vegetative", color: "var(--crop-600)" },
  flowering: { icon: SunIcon, labelKey: "story.flowering", color: "var(--amber-500)" },
  maturity: { icon: CheckIcon, labelKey: "story.maturity", color: "var(--crop-700)" },
  harvest: { icon: ScissorsIcon, labelKey: "story.harvest", color: "var(--soil-600)" },
  intervention: { icon: DiagnoseIcon, labelKey: "story.intervention", color: "var(--sky-500)" },
};

export function FieldStoryTimeline({ field }: { field: Field }) {
  const { locale, t } = useLanguage();
  // Hydration-safe: compute today's date client-side only
  const [todayDate, setTodayDate] = useState<string>("");
  useEffect(() => {
    setTodayDate(new Date().toISOString().slice(0, 10)); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const story = [...field.story].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Today marker
  const todayEvent: FieldStoryEvent = {
    id: "today",
    type: field.growthStage,
    date: todayDate || "2026-07-24",
    title: { en: "Today", hi: "आज", or: "ଆଜି", te: "ఈ రోజు" },
    detail: {
      en: `${field.daysSincePlanting} days since planting · ${field.growthStage} stage`,
      hi: `बुवाई से ${field.daysSincePlanting} दिन · ${field.growthStage} चरण`,
      or: `ବୁଣାଠୁ ${field.daysSincePlanting} ଦିନ · ${field.growthStage} ଅବସ୍ଥା`,
      te: `విత్తనం నుండి ${field.daysSincePlanting} రోజులు · ${field.growthStage} దశ`,
    },
  };

  return (
    <div
      className="relative overflow-x-auto no-scrollbar -mx-4 md:-mx-0"
      role="region"
      aria-label={t("fields.story")}
    >
      <div className="flex items-stretch gap-0 px-4 md:px-0 min-w-max pb-2">
        {/* Timeline line */}
        <div className="absolute top-7 left-0 right-0 h-0.5 bg-border mx-4 md:mx-0" aria-hidden="true" />

        {story.map((event, i) => {
          const cfg = eventConfig[event.type];
          const Icon = cfg.icon;
          const isLast = i === story.length - 1;
          return (
            <div key={event.id} className="relative flex flex-col items-start" style={{ width: "180px", flexShrink: 0 }}>
              {/* Node */}
              <div
                className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-2 bg-card mb-3 mt-1"
                style={{ borderColor: cfg.color, color: cfg.color }}
                aria-hidden="true"
              >
                <Icon size={22} />
              </div>
              <div className="space-y-1">
                <p className="seed-label tabular-nums" style={{ color: cfg.color }}>
                  {new Date(event.date).toLocaleDateString(locale === "en" ? "en-US" : locale, { day: "numeric", month: "short", year: "2-digit" })}
                </p>
                <p className="text-sm font-semibold leading-tight">{event.title[locale]}</p>
                <p className="text-xs text-muted-foreground leading-snug">{event.detail[locale]}</p>
              </div>
            </div>
          );
        })}

        {/* Today node */}
        <div className="relative flex flex-col items-start" style={{ width: "180px", flexShrink: 0 }}>
          <div
            className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-card mb-3 mt-1"
            style={{
              border: `2px dashed ${eventConfig[todayEvent.type].color}`,
              color: eventConfig[todayEvent.type].color,
              animation: "health-pulse 3s ease-in-out infinite",
            }}
            aria-label="Today"
          >
            <CalendarIcon size={20} />
          </div>
          <div className="space-y-1">
            <p className="seed-label tabular-nums" style={{ color: eventConfig[todayEvent.type].color }}>
              {t("story.today")}
            </p>
            <p className="text-sm font-semibold leading-tight">{todayEvent.title[locale]}</p>
            <p className="text-xs text-muted-foreground leading-snug">{todayEvent.detail[locale]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
