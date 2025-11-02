"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

/**
 * First-load seed-planting ritual.
 *
 * On the very first app open, a brief (skippable, <3s) sequence plays:
 * 1. A seed drops from above into the soil
 * 2. A sprout emerges and grows upward
  * 3. The ritual fades and the app is revealed
 *
 * Never shows again after first launch (localStorage flag).
 * Respects prefers-reduced-motion — skips instantly.
 * Tap-to-skip always available.
 */
const STORAGE_KEY = "bhoomi.ritual.seen";

export function SeedRitual({ children }: { children: React.ReactNode }) {
  const [showRitual, setShowRitual] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();
  const { vibrate } = useSettings();

  // Check localStorage only on client (hydration-safe)
  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
          localStorage.setItem(STORAGE_KEY, "1");
          setShowRitual(false);
          return;
        }
        setShowRitual(true);
      }
    } catch {
      // localStorage unavailable — skip ritual
    }
  }, []);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setShowRitual(false);
  }, []);

  // Auto-finish after the full sequence (~2.8s)
  useEffect(() => {
    if (!showRitual) return;
    const id = setTimeout(() => {
      vibrate([10, 30, 20]);
      finish();
    }, 2800);
    return () => clearTimeout(id);
  }, [showRitual, finish, vibrate]);

  // Don't render anything until mounted (hydration safety)
  if (!mounted) {
    return <>{children}</>;
  }

  if (!showRitual) {
    return <>{children}</>;
  }

  return (
    <>
      <RitualOverlay onSkip={finish} locale={locale} />
      {/* Children stay mounted underneath so the reveal feels like the app "growing into view" */}
      <div
        style={{
          opacity: 0,
          pointerEvents: "none",
          filter: "blur(8px)",
          transition: "opacity 600ms ease-out, filter 600ms ease-out",
        }}
        aria-hidden="true"
      >
        {children}
      </div>
    </>
  );
}

function RitualOverlay({ onSkip, locale }: { onSkip: () => void; locale: string }) {
  const [phase, setPhase] = useState<"seed" | "sprout" | "grow" | "fade">("seed");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("sprout"), 700);
    const t2 = setTimeout(() => setPhase("grow"), 1400);
    const t3 = setTimeout(() => setPhase("fade"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const skipLabel = locale === "hi" ? "छोड़ें" : locale === "or" ? "ଛାଡ଼ନ୍ତୁ" : locale === "te" ? "దాటవేయి" : "Skip";

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: "var(--soil-50)",
        transition: "opacity 600ms ease-out",
        opacity: phase === "fade" ? 0 : 1,
        pointerEvents: phase === "fade" ? "none" : "auto",
      }}
      role="dialog"
      aria-label="Welcome to Bhoomi"
    >
      {/* Topo background — subtle contour lines */}
      <div className="absolute inset-0 topo-bg opacity-30" aria-hidden="true" />

      {/* Skip button — always reachable, top-right */}
      <button
        type="button"
        onClick={onSkip}
        className="absolute top-4 right-4 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1.5 text-xs font-medium tap-feedback min-h-[36px] z-10"
        aria-label={skipLabel}
      >
        {skipLabel}
      </button>

      {/* The ritual animation — seed → sprout → grow */}
      <div className="relative flex flex-col items-center" aria-hidden="true">
        <svg
          width="200"
          height="240"
          viewBox="0 0 200 240"
          fill="none"
          style={{
            transition: "transform 600ms cubic-bezier(0.2, 0, 0, 1)",
            transform: phase === "grow" || phase === "fade" ? "scale(1.05)" : "scale(1)",
          }}
        >
          <defs>
            <linearGradient id="ritual-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="color-mix(in srgb, var(--amber-400) 15%, var(--soil-50))" />
              <stop offset="100%" stopColor="var(--soil-50)" />
            </linearGradient>
            <linearGradient id="ritual-soil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--soil-300)" />
              <stop offset="100%" stopColor="var(--soil-500)" />
            </linearGradient>
          </defs>

          {/* Sky band */}
          <rect x="0" y="0" width="200" height="160" fill="url(#ritual-sky)" />

          {/* Sun — appears during grow phase */}
          <circle
            cx="160"
            cy="40"
            r="14"
            fill="var(--amber-400)"
            opacity={phase === "grow" || phase === "fade" ? 0.9 : 0}
            style={{ transition: "opacity 600ms ease-out" }}
          />
          {(phase === "grow" || phase === "fade") && (
            <>
              <line x1="160" y1="20" x2="160" y2="14" stroke="var(--amber-400)" strokeWidth="1.5" strokeLinecap="square" />
              <line x1="160" y1="60" x2="160" y2="66" stroke="var(--amber-400)" strokeWidth="1.5" strokeLinecap="square" />
              <line x1="140" y1="40" x2="134" y2="40" stroke="var(--amber-400)" strokeWidth="1.5" strokeLinecap="square" />
              <line x1="180" y1="40" x2="186" y2="40" stroke="var(--amber-400)" strokeWidth="1.5" strokeLinecap="square" />
            </>
          )}

          {/* Soil mound */}
          <path
            d="M0 160 Q40 150 100 158 Q160 150 200 160 L200 240 L0 240 Z"
            fill="url(#ritual-soil)"
          />
          {/* Soil texture dots */}
          <circle cx="30" cy="180" r="1.5" fill="var(--soil-700)" opacity="0.5" />
          <circle cx="60" cy="195" r="1.2" fill="var(--soil-700)" opacity="0.4" />
          <circle cx="120" cy="185" r="1.5" fill="var(--soil-700)" opacity="0.5" />
          <circle cx="150" cy="200" r="1.2" fill="var(--soil-700)" opacity="0.4" />
          <circle cx="180" cy="190" r="1.5" fill="var(--soil-700)" opacity="0.5" />
          <circle cx="90" cy="210" r="1" fill="var(--soil-700)" opacity="0.4" />

          {/* Seed — drops in phase "seed" */}
          <ellipse
            cx="100"
            cy={phase === "seed" ? 145 : 160}
            rx="6"
            ry="8"
            fill="var(--soil-800)"
            style={{
              transition: "cy 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: phase === "seed" || phase === "sprout" ? 1 : 0,
            }}
          />

          {/* Sprout stem — emerges in phase "sprout", grows in "grow" */}
          <path
            d="M100 160 L100 {stemTop}"
            stroke="var(--crop-600)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              transition: "all 700ms cubic-bezier(0.2, 0, 0, 1)",
            }}
            // We can't use a variable in the path "d" directly, so we render conditionally
          />
          {/* Render stem with dynamic height via a line element instead */}
          <line
            x1="100"
            y1="160"
            x2="100"
            y2={phase === "seed" ? 160 : phase === "sprout" ? 130 : 80}
            stroke="var(--crop-600)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transition: "y2 700ms cubic-bezier(0.2, 0, 0, 1)" }}
          />

          {/* First leaf pair — appears in sprout phase */}
          <path
            d="M100 {leaf1Y} Q85 {leaf1Y - 5} 78 {leaf1Y + 8} Q90 {leaf1Y + 6} 100 {leaf1Y + 4}"
            fill="var(--crop-500)"
            opacity={phase === "seed" ? 0 : 1}
            style={{ transition: "opacity 400ms ease-out 300ms" }}
          />
          {/* We'll render leaves with absolute transforms instead for cleaner animation */}

          {/* Leaf 1 (left) */}
          <g
            opacity={phase === "seed" ? 0 : 1}
            style={{
              transition: "opacity 400ms ease-out 300ms, transform 600ms cubic-bezier(0.2, 0, 0, 1) 300ms",
              transform: phase === "grow" || phase === "fade" ? "scale(1)" : "scale(0.3)",
              transformOrigin: "100px 130px",
            }}
          >
            <path
              d="M100 130 Q80 124 72 138 Q86 134 100 134"
              fill="var(--crop-500)"
            />
          </g>
          {/* Leaf 2 (right) */}
          <g
            opacity={phase === "seed" ? 0 : 1}
            style={{
              transition: "opacity 400ms ease-out 400ms, transform 600ms cubic-bezier(0.2, 0, 0, 1) 400ms",
              transform: phase === "grow" || phase === "fade" ? "scale(1)" : "scale(0.3)",
              transformOrigin: "100px 110px",
            }}
          >
            <path
              d="M100 110 Q120 104 128 118 Q114 114 100 114"
              fill="var(--crop-400)"
            />
          </g>
          {/* Leaf 3 (top, small) — appears in grow phase */}
          <g
            opacity={phase === "grow" || phase === "fade" ? 1 : 0}
            style={{
              transition: "opacity 400ms ease-out",
              transform: phase === "fade" ? "scale(1.1)" : "scale(1)",
              transformOrigin: "100px 85px",
            }}
          >
            <path
              d="M100 85 Q108 80 112 90 Q104 88 100 90"
              fill="var(--crop-500)"
            />
          </g>

          {/* Ground impact ripple — when seed lands */}
          {phase === "seed" && (
            <ellipse
              cx="100"
              cy="160"
              rx="14"
              ry="3"
              fill="none"
              stroke="var(--soil-600)"
              strokeWidth="1.5"
              opacity="0.6"
              style={{
                animation: "ripple-expand 700ms ease-out",
              }}
            />
          )}
        </svg>

        {/* Wordmark — fades in during grow phase */}
        <div
          className="mt-4 text-center"
          style={{
            opacity: phase === "grow" || phase === "fade" ? 1 : 0,
            transform: phase === "grow" || phase === "fade" ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 500ms ease-out, transform 500ms cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          <h1
            className="font-heading-en text-3xl font-bold tracking-tight"
            style={{ color: "var(--soil-900)" }}
          >
            Bhoomi
          </h1>
          <p className="seed-label text-[var(--soil-600)] mt-1">
            {locale === "hi" ? "खेत की समझदारी, आपकी भाषा में"
              : locale === "or" ? "କ୍ଷେତ୍ର ବୁଦ୍ଧି, ଆପଣଙ୍କ ଭାଷାରେ"
              : locale === "te" ? "పొలం తెలివి, మీ భాషలో"
              : "Field intelligence, in your language"}
          </p>
        </div>
      </div>

      {/* Progress bar at bottom — shows the ritual is brief */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-[var(--soil-200)]" aria-hidden="true">
        <div
          className="h-full"
          style={{
            background: "linear-gradient(90deg, var(--crop-500), var(--crop-400))",
            width: phase === "fade" ? "100%" : phase === "grow" ? "80%" : phase === "sprout" ? "45%" : "15%",
            transition: "width 600ms linear",
          }}
        />
      </div>

      <style>{`
        @keyframes ripple-expand {
          from { transform: scale(0.3); opacity: 0.8; }
          to { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
