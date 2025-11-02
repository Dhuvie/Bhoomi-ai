"use client";

import React, { useState } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { YieldForecast } from "@/lib/mock-data";

interface YieldForecastChartProps {
  forecast: YieldForecast;
  revealed: boolean;
}

interface TooltipPayloadEntry {
  payload: {
    date: string;
    low: number;
    expected: number;
    high: number;
  };
  value: number;
  name: string;
  dataKey: string;
}

/** Custom tooltip — matches card style, grows from point */
function YieldTooltip({
  active,
  payload,
  label,
  locale,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  locale: "en" | "hi" | "or" | "te";
}) {
  const { t } = useLanguage();
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  return (
    <div
      className="tooltip-grow rounded-md border border-border bg-popover p-3 shadow-[var(--shadow-lg)]"
      style={{ minWidth: "140px" }}
    >
      <p className="seed-label text-muted-foreground mb-1.5">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{t("insights.yield.expected")}</span>
          <span className="instrument-num text-sm tabular-nums" style={{ color: "var(--crop-600)" }}>
            {data.expected} qt
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{t("insights.yield.range")}</span>
          <span className="instrument-num text-xs tabular-nums" style={{ color: "var(--soil-600)" }}>
            {data.low}–{data.high}
          </span>
        </div>
      </div>
    </div>
  );
}

export function YieldForecastChart({ forecast, revealed }: YieldForecastChartProps) {
  const { locale, t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = forecast.history.map((p) => ({
    date: new Date(p.date).toLocaleDateString(locale === "en" ? "en-US" : locale, { day: "numeric", month: "short" }),
    low: p.low,
    expected: p.expected,
    high: p.high,
  }));

  return (
    <div className="w-full h-56 md:h-64 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 4, left: -10 }}
          onMouseMove={(state: any) => {
            if (state?.activeTooltipIndex !== undefined) {
              setHoveredIdx(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {/* Soft gradient fill under the expected line, tinted with crop green, fading to transparent */}
            <linearGradient id="yield-expected-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--crop-500)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--crop-500)" stopOpacity={0.02} />
            </linearGradient>
            {/* Uncertainty band — softer, warmer */}
            <linearGradient id="yield-band-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--crop-500)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--crop-500)" stopOpacity={0.04} />
            </linearGradient>
          </defs>

          {/* Gridlines — minimal, only horizontal, very faint until hovered */}
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="color-mix(in srgb, var(--soil-300) 30%, transparent)"
            vertical={false}
            opacity={hoveredIdx !== null ? 0.8 : 0.5}
          />

          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-body)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            dy={8}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-heading-en)" }}
            tickLine={false}
            axisLine={false}
            width={36}
            domain={["dataMin - 2", "dataMax + 2"]}
          />
          <Tooltip
            content={<YieldTooltip locale={locale} />}
            cursor={{ stroke: "var(--crop-500)", strokeWidth: 1, strokeDasharray: "3 3" }}
          />

          {/* Uncertainty band — area between low and high, soft gradient */}
          <Area
            type="monotone"
            dataKey="high"
            stroke="none"
            fill="url(#yield-band-gradient)"
            isAnimationActive={revealed}
            animationDuration={700}
            animationEasing="ease-out"
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="none"
            fill="var(--card)"
            isAnimationActive={revealed}
            animationDuration={700}
            animationEasing="ease-out"
          />

          {/* Expected line — with soft gradient fill underneath */}
          <Area
            type="monotone"
            dataKey="expected"
            stroke="none"
            fill="url(#yield-expected-gradient)"
            isAnimationActive={revealed}
            animationDuration={700}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="expected"
            stroke="var(--crop-600)"
            strokeWidth={2.5}
            dot={(props: any) => {
              const { cx, cy, index } = props;
              const isHovered = index === hoveredIdx;
              const isLast = index === data.length - 1;
              return (
                <circle
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={isHovered || isLast ? 6 : 4}
                  fill="var(--crop-600)"
                  stroke="var(--card)"
                  strokeWidth={2}
                  style={{
                    transition: "r 180ms var(--ease-emphasized)",
                    filter: isHovered ? "drop-shadow(0 0 6px color-mix(in srgb, var(--crop-500) 50%, transparent))" : "none",
                  }}
                />
              );
            }}
            activeDot={false}
            isAnimationActive={revealed}
            animationDuration={700}
            animationEasing="ease-out"
          />

          {/* Low/high guides — dashed, very faint */}
          <Line
            type="monotone"
            dataKey="low"
            stroke="var(--soil-400)"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={revealed}
            animationDuration={700}
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="var(--soil-400)"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={revealed}
            animationDuration={700}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded-full" style={{ background: "var(--crop-600)" }} />
          <span className="text-muted-foreground">{t("insights.yield.expected")}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-2 rounded-sm"
            style={{
              background: "linear-gradient(180deg, color-mix(in srgb, var(--crop-500) 25%, transparent), color-mix(in srgb, var(--crop-500) 5%, transparent))",
              border: "1px solid color-mix(in srgb, var(--crop-500) 40%, transparent)",
            }}
          />
          <span className="text-muted-foreground">{t("insights.yield.range")}</span>
        </span>
      </div>
    </div>
  );
}
