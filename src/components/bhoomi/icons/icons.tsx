"use client";

import React from "react";

/**
 * Custom agricultural SVG icons — drawn in the field-instrument visual language.
 * Stroke-based, 1.5-2px weight, square caps. No glossy fills.
 * All icons inherit currentColor.
 */

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const base = (size: number = 20): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  "aria-hidden": true,
  focusable: false,
});

export function DashboardIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Topographic contour — concentric organic shape */}
      <path d="M3 12c2-4 5-6 9-6s7 2 9 6c-2 4-5 6-9 6s-7-2-9-6z" />
      <path d="M6 12c1.5-2.5 3.5-4 6-4s4.5 1.5 6 4c-1.5 2.5-3.5 4-6 4s-4.5-1.5-6-4z" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FieldIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Field plot with rows */}
      <path d="M3 18l4-12h10l4 12z" />
      <path d="M7 6l-1 4h12l-1-4M5.5 12h13M3 18h18" />
    </svg>
  );
}

export function DiagnoseIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Leaf with magnifier */}
      <path d="M4 20c0-8 4-12 12-14-2 8-6 12-14 14z" />
      <path d="M9 15c2-2 4-3 6-4" />
      <circle cx="16.5" cy="9.5" r="2.5" />
      <path d="M18.5 11.5l2 2" />
    </svg>
  );
}

export function InsightsIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Cross-section — soil layers with measurement tick */}
      <path d="M3 7h18M3 12h18M3 17h18" />
      <path d="M5 7v10M9 7v10M13 7v10M17 7v10M21 7v10" strokeWidth={1} />
      <path d="M3 4v16" strokeWidth={1.5} />
      <path d="M1 6h2M1 11h2M1 16h2" strokeWidth={1} />
    </svg>
  );
}

export function MarketIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Scales — weighing */}
      <path d="M12 3v18M5 21h14M4 8h16" />
      <path d="M4 8l-2 5h4z M20 8l-2 5h4z" />
      <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VoiceIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Soundwave inside circle */}
      <circle cx="12" cy="12" r="9" />
      <path d="M7 10v4M10 8v8M13 6v12M16 9v6" />
    </svg>
  );
}

export function LanguageIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Globe with meridians */}
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18" />
    </svg>
  );
}

export function SettingsIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Sliders — instrument panel style */}
      <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="13" cy="18" r="2" />
    </svg>
  );
}

export function AlertIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Triangle with exclamation — survey marker */}
      <path d="M12 3L2 20h20L12 3z" />
      <path d="M12 9v6M12 17.5v0.5" />
    </svg>
  );
}

export function SproutIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      {/* Seedling */}
      <path d="M12 21v-8" />
      <path d="M12 13c0-3-2-5-5-5 0 3 2 5 5 5z" />
      <path d="M12 11c0-3 2-5 5-5 0 3-2 5-5 5z" />
      <path d="M7 21h10" />
    </svg>
  );
}

export function DropletIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 3c-3 5-6 8-6 12a6 6 0 0012 0c0-4-3-7-6-12z" />
    </svg>
  );
}

export function SunIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
    </svg>
  );
}

function CloudIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 17h11a4 4 0 000-8 5 5 0 00-9.5-1.5A4 4 0 006 17z" />
    </svg>
  );
}

function RainIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 13h11a4 4 0 000-8 5 5 0 00-9.5-1.5A4 4 0 006 13z" />
      <path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" />
    </svg>
  );
}

function StormIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 13h11a4 4 0 000-8 5 5 0 00-9.5-1.5A4 4 0 006 13z" />
      <path d="M11 15l-3 4h3l-1 3 3-4h-3l1-3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FogIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 9h14M5 13h16M3 17h12M7 21h14" />
    </svg>
  );
}

function HazeIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="10" r="3" />
      <path d="M3 16h18M5 20h14" />
    </svg>
  );
}

export function WindIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 8h11a3 3 0 100-6M3 12h15a3 3 0 110 6M3 16h8a2 2 0 110 4" />
    </svg>
  );
}

export function CheckIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 12l5 5 11-11" />
    </svg>
  );
}

export function XIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function ArrowDownIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

export function MinusIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function CameraIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 8h4l2-3h6l2 3h4v11H3V8z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function UploadIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
      <path d="M12 3v12M7 8l5-5 5 5" />
    </svg>
  );
}

export function SyncIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 12a9 9 0 019-9 9 9 0 017 3.5L21 9M21 12a9 9 0 01-9 9 9 9 0 01-7-3.5L3 15" />
      <path d="M21 4v5h-5M3 20v-5h5" />
    </svg>
  );
}

export function PlusIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    </svg>
  );
}

export function MapPinIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function CalendarIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function HourglassIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 3h12M6 21h12M6 3c0 5 6 7 6 9s-6 4-6 9M18 3c0 5-6 7-6 9s6 4 6 9" />
    </svg>
  );
}

export function ScissorsIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8.5 7.5L20 18M8.5 16.5L20 6" />
    </svg>
  );
}

/** Custom: Lock-on reticle — for diagnosis scan confidence threshold moment */
export function ReticleIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <path d="M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5" strokeWidth={1} />
    </svg>
  );
}

/** Custom: Empty leaf — for diagnosis empty state */
export function EmptyLeafIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 18c0-8 5-13 14-15-1 8-5 13-14 15z" />
      <path d="M9 13c2-2 4-3 6-4" strokeWidth={1} />
      <path d="M4 18c0-2 1-4 3-5" strokeWidth={1} />
    </svg>
  );
}

/** Custom: Empty field — bare ground line for fields empty state */
export function EmptyFieldIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 18h18" />
      <path d="M5 18c0-3 2-5 5-5M11 18c0-4 3-7 7-7" strokeWidth={1.25} />
      <path d="M14 7l3-3M17 7l3-3" strokeWidth={1} />
    </svg>
  );
}

/** Custom: Empty chart — for insights/market empty states */
export function EmptyChartIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 20h18" />
      <path d="M7 20v-6M12 20v-10M17 20v-4" strokeWidth={1.5} />
      <path d="M5 8l5-4 4 3 5-5" strokeWidth={1} strokeDasharray="2 2" />
    </svg>
  );
}

/** Custom: Wifi-off — for offline error state */
export function OfflineIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 8c5-4 13-4 18 0M6 12c3-2.5 9-2.5 12 0M9 15c1.5-1 4.5-1 6 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      <path d="M3 3l18 18" strokeWidth={1.5} />
    </svg>
  );
}

/** Custom: Camera-off — for camera permission denied */
export function CameraOffIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 8h4l2-3h6l2 3h4v11H3V8z" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M3 3l18 18" strokeWidth={1.5} />
    </svg>
  );
}

/** Custom: Hourglass timeout — for AI timeout error */
export function TimeoutIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 3h12M6 21h12M6 3c0 5 6 7 6 9s-6 4-6 9M18 3c0 5-6 7-6 9s6 4 6 9" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}



export function getWeatherIcon(condition: string, size: number = 24) {
  switch (condition) {
    case "clear": return <SunIcon size={size} />;
    case "cloudy": return <CloudIcon size={size} />;
    case "overcast": return <CloudIcon size={size} />;
    case "rain": return <RainIcon size={size} />;
    case "storm": return <StormIcon size={size} />;
    case "fog": return <FogIcon size={size} />;
    case "haze": return <HazeIcon size={size} />;
    default: return <SunIcon size={size} />;
  }
}
