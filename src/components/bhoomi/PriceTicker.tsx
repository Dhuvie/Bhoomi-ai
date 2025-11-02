"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PriceQuote, cropLabels } from "@/lib/mock-data";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "./icons/icons";
import { NumberRoll } from "./NumberRoll";
import { cn } from "@/lib/utils";

interface PriceTickerProps {
  quote: PriceQuote;
  highlighted?: boolean;
}

export function PriceTicker({ quote, highlighted = false }: PriceTickerProps) {
  const { locale, t } = useLanguage();

  const trendColor = quote.trend === "up" ? "var(--crop-600)" : quote.trend === "down" ? "var(--red-600)" : "var(--soil-500)";
  const TrendIcon = quote.trend === "up" ? ArrowUpIcon : quote.trend === "down" ? ArrowDownIcon : MinusIcon;
  const cropLabel = cropLabels[quote.crop as keyof typeof cropLabels]?.[locale] ?? quote.crop;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-[var(--shadow-sm)] tap-feedback card-hover-lift transition-all",
        highlighted ? "border-[color:var(--crop-500)]/40" : "border-border"
      )}
      role="article"
      aria-label={`${cropLabel} price: ${quote.pricePerQt} rupees per quintal, ${quote.changePct > 0 ? "up" : quote.changePct < 0 ? "down" : "no change"} ${Math.abs(quote.changePct).toFixed(1)} percent`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{cropLabel}</p>
          <p className="text-xs text-muted-foreground">
            {quote.market} · <span className="tabular-nums">{quote.unit}</span>
          </p>
        </div>
        {highlighted && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium flex-shrink-0"
            style={{ background: "color-mix(in srgb, var(--crop-500) 12%, transparent)", color: "var(--crop-600)" }}
          >
            {t("market.yourCrops")}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs text-muted-foreground">₹</span>
            <NumberRoll
              value={quote.pricePerQt}
              className="instrument-num text-2xl"
              style={{ color: "var(--foreground)" }}
            />
          </div>
          <span
            className="inline-flex items-center gap-0.5 text-xs font-medium tabular-nums mt-0.5"
            style={{ color: trendColor }}
          >
            <TrendIcon size={12} />
            {quote.changePct > 0 ? "+" : ""}{quote.changePct.toFixed(2)}%
            <span className="text-muted-foreground ml-1 normal-case font-normal">
              {t(`market.trend.${quote.trend}` as Parameters<typeof t>[0])}
            </span>
          </span>
        </div>

        {/* Sparkline with pulsing last point */}
        <Sparkline data={quote.sparkline} color={trendColor} />
      </div>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 72;
  const h = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Last point coords
  const last = data[data.length - 1];
  const lastX = w;
  const lastY = h - ((last - min) / range) * (h - 4) - 2;

  // Area path under the line — soft gradient fill
  const areaPath = `M ${data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" L ")} L ${w} ${h} L 0 ${h} Z`;

  const gradId = React.useId();

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {/* Soft area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
      {/* Pulsing last-point marker */}
      <circle
        cx={lastX}
        cy={lastY}
        r={2.5}
        fill={color}
        className="last-point-pulse"
      />
    </svg>
  );
}
