"use client";

import React, { useEffect, useMemo, useState } from "react";

type WeatherCondition = "clear" | "cloudy" | "overcast" | "rain" | "storm" | "fog" | "haze";

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  children: React.ReactNode;
  /** When true, render only the texture (no gradient base). Useful for headers. */
  headerOnly?: boolean;
}

/**
 * Weather-reactive ambient shell.
 * - Rain: subtle animated rain-streak texture
 * - Sun/clear: soft light-ray gradient sweep
 * - Haze: drifting amber-tinted particles
 * - Overcast/fog: muted gray veil
 *
 * Hydration-safe: all randomized textures are gated behind a `mounted` flag
 * so the server and client produce identical HTML on first paint. The texture
 * layer swaps in after hydration via useEffect.
 */
export function WeatherBackground({ condition, children, headerOnly = false }: WeatherBackgroundProps) {
  // mounted gate — prevents SSR/client mismatch from Math.random()
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const ambientGradient = useMemo(() => {
    switch (condition) {
      case "rain":
      case "storm":
        return "linear-gradient(180deg, color-mix(in srgb, var(--sky-500) 8%, var(--background)) 0%, var(--background) 30%)";
      case "overcast":
      case "fog":
        return "linear-gradient(180deg, color-mix(in srgb, var(--soil-400) 10%, var(--background)) 0%, var(--background) 35%)";
      case "haze":
      case "clear":
        return "linear-gradient(180deg, color-mix(in srgb, var(--amber-400) 8%, var(--background)) 0%, var(--background) 35%)";
      default:
        return "var(--background)";
    }
  }, [condition]);

  // Render the appropriate texture — only after mount (avoids Math.random mismatch)
  const texture = mounted ? (
    <WeatherTexture condition={condition} />
  ) : null;

  if (headerOnly) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {texture}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="relative" style={{ background: ambientGradient }}>
      <div className="absolute inset-x-0 top-0 h-48 pointer-events-none overflow-hidden" aria-hidden="true">
        {texture}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/** Inner texture renderer — separated so its hooks only run client-side after mount */
function WeatherTexture({ condition }: { condition: WeatherCondition }) {
  switch (condition) {
    case "rain":
    case "storm":
      return <RainTexture intense={condition === "storm"} />;
    case "clear":
      return <SunRaySweep />;
    case "haze":
      return <HazeDrift />;
    case "fog":
    case "overcast":
      return <OvercastVeil />;
    case "cloudy":
      return <CloudyTexture />;
    default:
      return null;
  }
}

function RainTexture({ intense }: { intense: boolean }) {
  // Generate randomized but stable-per-mount rain streaks
  const streaks = useMemo(() => {
    const count = intense ? 26 : 18;
    return Array.from({ length: count }, (_, i) => ({
      left: `${(i * 5.5 + Math.random() * 4) % 100}%`,
      delay: `${Math.random() * 1.4}s`,
      duration: `${0.7 + Math.random() * 0.4}s`,
      height: `${20 + Math.random() * 14}px`,
      opacity: 0.3 + Math.random() * 0.25,
    }));
  }, [intense]);

  return (
    <div className="absolute inset-0">
      {streaks.map((s, i) => (
        <span
          key={i}
          className="absolute top-0 w-px"
          style={{
            left: s.left,
            height: s.height,
            background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--sky-400) 70%, transparent))",
            animation: `rain-fall ${s.duration} linear ${s.delay} infinite`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

function SunRaySweep() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute -inset-x-1/2 top-0 h-48"
        style={{
          background: "linear-gradient(180deg, color-mix(in srgb, var(--amber-400) 18%, transparent), transparent 80%)",
          animation: "sun-ray-sweep 12s var(--ease-standard) infinite",
          transformOrigin: "top center",
        }}
      />
    </div>
  );
}

function HazeDrift() {
  const particles = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      top: `${10 + i * 14}%`,
      left: `${i * 18 - 10}%`,
      width: `${30 + Math.random() * 20}%`,
      delay: `${i * 0.7}s`,
    }));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.width,
            height: "30px",
            background: "radial-gradient(ellipse, color-mix(in srgb, var(--amber-400) 18%, transparent) 0%, transparent 70%)",
            animation: `haze-drift ${6 + i}s var(--ease-standard) ${p.delay} infinite`,
            filter: "blur(8px)",
          }}
        />
      ))}
    </div>
  );
}

function OvercastVeil() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, color-mix(in srgb, var(--soil-400) 14%, transparent) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function CloudyTexture() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute -inset-x-1/4 top-0 h-32"
        style={{
          background: "linear-gradient(180deg, color-mix(in srgb, var(--soil-300) 12%, transparent), transparent 80%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
