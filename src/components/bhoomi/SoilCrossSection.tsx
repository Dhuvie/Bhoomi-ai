"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SoilReading } from "@/lib/mock-data";
import { DropletIcon } from "./icons/icons";

interface SoilCrossSectionProps {
  reading: SoilReading;
}

export function SoilCrossSection({ reading }: SoilCrossSectionProps) {
  const { locale, t } = useLanguage();

  // pH color scale — red (acidic) → green (neutral) → blue (alkaline)
  const pHColor = (pH: number) => {
    if (pH < 5.5) return "var(--red-500)";
    if (pH < 6.0) return "var(--amber-500)";
    if (pH <= 7.0) return "var(--crop-500)";
    if (pH <= 7.5) return "var(--amber-500)";
    return "var(--sky-500)";
  };

  const pHLabel = (pH: number) => {
    if (pH < 5.5) return locale === "en" ? "Acidic" : locale === "hi" ? "अम्लीय" : locale === "or" ? "ଅମ୍ଳ" : "ఆమ్ల";
    if (pH <= 7.0) return locale === "en" ? "Balanced" : locale === "hi" ? "संतुलित" : locale === "or" ? "ସନ୍ତୁଳିତ" : "సమతుల్యం";
    return locale === "en" ? "Alkaline" : locale === "hi" ? "क्षारीय" : locale === "or" ? "କ୍ଷାର" : "క్షార";
  };

  // NPK status relative to typical ranges
  const nutrientStatus = (value: number, low: number, high: number): { color: string; label: string; pct: number } => {
    const pct = Math.min((value / (high * 1.5)) * 100, 100);
    if (value < low) return { color: "var(--red-500)", label: t("common.low"), pct };
    if (value > high) return { color: "var(--amber-500)", label: t("common.high"), pct };
    return { color: "var(--crop-500)", label: t("common.medium"), pct };
  };

  const nStatus = nutrientStatus(reading.nitrogenPpm, 100, 200);
  const pStatus = nutrientStatus(reading.phosphorusPpm, 12, 25);
  const kStatus = nutrientStatus(reading.potassiumPpm, 100, 200);
  const pHph = pHColor(reading.pH);

  return (
    <div className="space-y-4">
      {/* Top-level NPK/pH/moisture instrument readouts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NutrientGauge label={t("insights.soil.nitrogen")} value={reading.nitrogenPpm} unit="ppm" status={nStatus} element="N" />
        <NutrientGauge label={t("insights.soil.phosphorus")} value={reading.phosphorusPpm} unit="ppm" status={pStatus} element="P" />
        <NutrientGauge label={t("insights.soil.potassium")} value={reading.potassiumPpm} unit="ppm" status={kStatus} element="K" />
        <div className="rounded-md border border-border bg-background p-3 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="seed-label text-muted-foreground">{t("insights.soil.ph")}</span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: `color-mix(in srgb, ${pHph} 15%, transparent)`, color: pHph }}
            >
              {pHLabel(reading.pH)}
            </span>
          </div>
          <div>
            <span className="instrument-num text-2xl tabular-nums" style={{ color: pHph }}>
              {reading.pH.toFixed(1)}
            </span>
          </div>
          {/* pH scale bar */}
          <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ background: "linear-gradient(90deg, var(--red-500), var(--crop-500) 45%, var(--sky-500))" }}>
            <div
              className="h-full w-1 bg-white border-l border-r border-black/30"
              style={{ marginLeft: `${(reading.pH / 14) * 100}%`, transform: "translateX(-50%)" }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Illustrated soil cross-section — three layers */}
      <div className="relative rounded-lg overflow-hidden border border-border" style={{ aspectRatio: "16 / 9", minHeight: "260px" }}>
        <svg viewBox="0 0 400 240" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {/* Sky strip at top */}
          <rect x="0" y="0" width="400" height="20" fill="color-mix(in srgb, var(--sky-400) 30%, var(--background))" />

          {/* Topsoil layer (0-15cm) — darkest brown with organic matter */}
          <rect x="0" y="20" width="400" height="65" fill="#5B3D1F" />
          <rect x="0" y="20" width="400" height="65" fill="url(#topsoil-pattern)" />
          {/* Subsoil layer (15-35cm) — lighter, more clay */}
          <rect x="0" y="85" width="400" height="70" fill="#8B6B3D" />
          <rect x="0" y="85" width="400" height="70" fill="url(#subsoil-pattern)" />
          {/* Regolith (35-70cm) — weathered rock */}
          <rect x="0" y="155" width="400" height="85" fill="#A68856" />
          <rect x="0" y="155" width="400" height="85" fill="url(#regolith-pattern)" />

          <defs>
            <pattern id="topsoil-pattern" patternUnits="userSpaceOnUse" width="12" height="12">
              <circle cx="3" cy="3" r="0.8" fill="#3D2811" opacity="0.6" />
              <circle cx="9" cy="8" r="0.6" fill="#3D2811" opacity="0.5" />
              <circle cx="6" cy="11" r="0.4" fill="#3D2811" opacity="0.4" />
            </pattern>
            <pattern id="subsoil-pattern" patternUnits="userSpaceOnUse" width="16" height="16">
              <path d="M0 8 L4 6 L8 9 L12 6 L16 8" stroke="#6B4A1F" strokeWidth="0.5" fill="none" opacity="0.4" />
              <path d="M0 13 L5 12 L10 14 L15 12" stroke="#6B4A1F" strokeWidth="0.4" fill="none" opacity="0.3" />
            </pattern>
            <pattern id="regolith-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="5" cy="6" r="2" fill="#7A5A2E" opacity="0.3" />
              <circle cx="14" cy="12" r="1.5" fill="#7A5A2E" opacity="0.25" />
              <circle cx="9" cy="17" r="1.2" fill="#7A5A2E" opacity="0.3" />
            </pattern>
          </defs>

          {/* Layer separators */}
          <line x1="0" y1="85" x2="400" y2="85" stroke="#3D2811" strokeWidth="0.5" opacity="0.5" strokeDasharray="2 2" />
          <line x1="0" y1="155" x2="400" y2="155" stroke="#5C3D1F" strokeWidth="0.5" opacity="0.5" strokeDasharray="2 2" />

          {/* NPK indicators per layer — small dots showing concentration */}
          {/* Topsoil: high N */}
          <g>
            <circle cx="80" cy="45" r="3" fill={nStatus.color} opacity="0.9" />
            <circle cx="120" cy="60" r="3" fill={nStatus.color} opacity="0.9" />
            <circle cx="160" cy="40" r="3" fill={nStatus.color} opacity="0.9" />
            <circle cx="220" cy="55" r="3" fill={nStatus.color} opacity="0.9" />
            <circle cx="280" cy="48" r="3" fill={nStatus.color} opacity="0.9" />
            <circle cx="330" cy="62" r="3" fill={nStatus.color} opacity="0.9" />
          </g>
          {/* Subsoil: medium */}
          <g>
            <circle cx="90" cy="110" r="2.5" fill={nStatus.color} opacity="0.6" />
            <circle cx="180" cy="125" r="2.5" fill={nStatus.color} opacity="0.6" />
            <circle cx="270" cy="115" r="2.5" fill={nStatus.color} opacity="0.6" />
            <circle cx="340" cy="130" r="2.5" fill={nStatus.color} opacity="0.6" />
          </g>
          {/* Regolith: low */}
          <g>
            <circle cx="110" cy="185" r="2" fill={nStatus.color} opacity="0.3" />
            <circle cx="230" cy="200" r="2" fill={nStatus.color} opacity="0.3" />
            <circle cx="320" cy="190" r="2" fill={nStatus.color} opacity="0.3" />
          </g>

          {/* Moisture indicators — wavy lines indicating water */}
          <path d="M30 75 Q60 70 90 75 T150 75 T210 75 T270 75 T330 75 T390 75" stroke="var(--sky-500)" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M30 140 Q60 135 90 140 T150 140 T210 140 T270 140 T330 140 T390 140" stroke="var(--sky-500)" strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M30 210 Q60 205 90 210 T150 210 T210 210 T270 210 T330 210 T390 210" stroke="var(--sky-500)" strokeWidth="0.6" fill="none" opacity="0.3" />

          {/* Root system descending through layers */}
          <g stroke="#3D2811" strokeWidth="1.2" fill="none" opacity="0.8">
            <path d="M200 22 L198 40 L202 60 L198 80 L200 100 L202 120 L198 140 L200 160" />
            <path d="M200 50 L188 65 M200 60 L215 75 M200 80 L185 92 M200 95 L215 110 M200 120 L188 135 M200 140 L215 150" strokeWidth="0.8" />
          </g>

          {/* Depth labels — left side */}
          <text x="6" y="55" fill="white" fontSize="9" fontFamily="var(--font-heading-en)" fontWeight="600">15cm</text>
          <text x="6" y="120" fill="white" fontSize="9" fontFamily="var(--font-heading-en)" fontWeight="600">35cm</text>
          <text x="6" y="200" fill="white" fontSize="9" fontFamily="var(--font-heading-en)" fontWeight="600">70cm</text>

          {/* Layer labels — right side */}
          <text x="395" y="42" fill="white" fontSize="8" fontFamily="var(--font-body)" fontWeight="500" textAnchor="end" opacity="0.9">{t("insights.soil.topsoil")}</text>
          <text x="395" y="107" fill="white" fontSize="8" fontFamily="var(--font-body)" fontWeight="500" textAnchor="end" opacity="0.9">{t("insights.soil.subsoil")}</text>
          <text x="395" y="187" fill="white" fontSize="8" fontFamily="var(--font-body)" fontWeight="500" textAnchor="end" opacity="0.9">{t("insights.soil.regolith")}</text>
        </svg>

        {/* Moisture badge overlay */}
        <div className="absolute top-2 right-2 glass-panel rounded-md px-2 py-1.5 flex items-center gap-1.5">
          <DropletIcon size={12} />
          <span className="text-xs font-medium tabular-nums text-white">{reading.moisture}%</span>
        </div>
      </div>

      {/* Layer breakdown table — instrument readout style */}
      <div className="rounded-md border border-border overflow-hidden">
        <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 seed-label text-muted-foreground">
          <span>{locale === "en" ? "Layer" : locale === "hi" ? "परत" : locale === "or" ? "ସ୍ତର" : "పొర"}</span>
          <span className="text-right">N</span>
          <span className="text-right">P</span>
          <span className="text-right">K</span>
          <span className="text-right">{locale === "en" ? "Moist" : locale === "hi" ? "नमी" : locale === "or" ? "ଆର୍ଦ୍ର" : "తేమ"}</span>
        </div>
        {([
          { key: "topsoil", label: t("insights.soil.topsoil"), depth: "0-15cm", layer: reading.layers.topsoil },
          { key: "subsoil", label: t("insights.soil.subsoil"), depth: "15-35cm", layer: reading.layers.subsoil },
          { key: "regolith", label: t("insights.soil.regolith"), depth: "35-70cm", layer: reading.layers.regolith },
        ] as const).map((row) => (
          <div key={row.key} className="grid grid-cols-5 gap-2 p-3 border-t border-border text-sm items-center">
            <div>
              <p className="font-medium">{row.label}</p>
              <p className="text-[10px] text-muted-foreground tabular-nums">{row.depth}</p>
            </div>
            <span className="text-right instrument-num tabular-nums">{row.layer.n}</span>
            <span className="text-right instrument-num tabular-nums">{row.layer.p}</span>
            <span className="text-right instrument-num tabular-nums">{row.layer.k}</span>
            <span className="text-right instrument-num tabular-nums">{row.layer.moisture}%</span>
          </div>
        ))}
      </div>

      {/* OC + CEC readouts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border bg-background p-3">
          <p className="seed-label text-muted-foreground">{locale === "en" ? "Organic Carbon" : locale === "hi" ? "जैव कार्बन" : locale === "or" ? "ଜୈବ କାର୍ବନ୍" : "సేంద్రీయ కార్బన్"}</p>
          <p className="instrument-num text-xl tabular-nums mt-1">{reading.organicCarbon}%</p>
        </div>
        <div className="rounded-md border border-border bg-background p-3">
          <p className="seed-label text-muted-foreground">{locale === "en" ? "CEC" : "CEC"}<span className="font-normal ml-1 normal-case">(cmol/kg)</span></p>
          <p className="instrument-num text-xl tabular-nums mt-1">{reading.cec}</p>
        </div>
      </div>
    </div>
  );
}

function NutrientGauge({
  label, value, unit, status, element,
}: {
  label: string;
  value: number;
  unit: string;
  status: { color: string; label: string; pct: number };
  element: "N" | "P" | "K";
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3 flex flex-col justify-between min-h-[110px]">
      <div className="flex items-center justify-between">
        <span className="seed-label text-muted-foreground">{label}</span>
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: `color-mix(in srgb, ${status.color} 15%, transparent)`, color: status.color }}
        >
          {element}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="instrument-num text-2xl tabular-nums" style={{ color: status.color }}>
          {value}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">{unit}</span>
      </div>
      {/* Gauge bar */}
      <div className="h-1.5 rounded-full overflow-hidden bg-muted mt-1">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(status.pct, 5)}%`,
            background: status.color,
            transition: "width 600ms cubic-bezier(0.2,0,0,1)",
          }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground mt-0.5">{status.label}</span>
    </div>
  );
}
