"use client";

import type { AthleteSignals } from "@/data/athlete-state";

const CENTER = 30;
const RADIUS = 24;
const START = -160;
const END = 160;
const SPAN = END - START;

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arc(cx: number, cy: number, r: number, startA: number, endA: number) {
  const s = polar(cx, cy, r, startA);
  const e = polar(cx, cy, r, endA);
  const large = endA - startA > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

type Tone = "accent" | "amber" | "rose" | "moss" | "muted";

/**
 * MiniRing — one arc, one color, filled by score. Green means healthy,
 * amber means watch, red means attention, blue means ready to move up.
 * Legible to a ten-year-old on first look.
 */
export function MiniRing({
  signals,
  size = 56,
  tone,
}: {
  signals: AthleteSignals;
  size?: number;
  /** Explicit tone override (Ready = accent, Blocked = rose, etc.) */
  tone?: Tone;
}) {
  // Colour tone is either the caller's explicit hint (pathway status) or
  // derived from the score so a "healthy squad" looks green at a glance.
  const derivedTone: Tone =
    signals.composite >= 75
      ? "moss"
      : signals.composite >= 55
        ? "amber"
        : "rose";
  const finalTone = tone ?? derivedTone;

  const color =
    finalTone === "moss"
      ? "#5F8168"
      : finalTone === "amber"
        ? "#C69148"
        : finalTone === "rose"
          ? "#B15864"
          : finalTone === "accent"
            ? "var(--accent)"
            : "var(--bone-500)";

  const value = Math.max(0, Math.min(100, signals.composite));
  const endA = START + (SPAN * value) / 100;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 60 60" className="h-full w-full">
        <path
          d={arc(CENTER, CENTER, RADIUS, START, END)}
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d={arc(CENTER, CENTER, RADIUS, START, endA)}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
