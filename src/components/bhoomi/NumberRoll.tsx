"use client";

import React, { useEffect, useRef, useState } from "react";

interface NumberRollProps {
  value: number;
  /** Number of decimal places to display */
  decimals?: number;
  /** Prefix string (e.g. "₹") */
  prefix?: string;
  /** Suffix string (e.g. "%") */
  suffix?: string;
  /** Locale for digit grouping */
  locale?: string;
  /** Duration of roll in ms */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Mechanical-counter style number roll.
 * When the value changes, each changed digit animates vertically.
 */
export function NumberRoll({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en-IN",
  duration = 320,
  className = "",
  style,
}: NumberRollProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [animateKey, setAnimateKey] = useState(0);
  const prevValueRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev === value) return;
    setDirection(value > prev ? "up" : "down");
    setAnimateKey((k) => k + 1);

    // Smooth interpolation between prev and value for the "tumbling" feel
    const start = performance.now();
    const startVal = prev;
    const delta = value - prev;
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(startVal + delta * eased);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        prevValueRef.current = value;
      }
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formatted = displayValue.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Split into individual chars; only animate the chars that changed
  const chars = formatted.split("");

  return (
    <span
      className={`inline-flex items-baseline tabular-nums ${className}`}
      style={style}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix && <span className="opacity-90">{prefix}</span>}
      <span className="inline-flex" style={{ overflow: "hidden" }}>
        {chars.map((char, i) => {
          if (/[0-9]/.test(char)) {
            return (
              <span
                key={`${i}-${animateKey}`}
                className={direction === "up" ? "digit-roll-up" : "digit-roll-down"}
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            );
          }
          // Comma/period/space — no animation
          return <span key={i}>{char}</span>;
        })}
      </span>
      {suffix && <span className="opacity-90 ml-0.5">{suffix}</span>}
    </span>
  );
}
