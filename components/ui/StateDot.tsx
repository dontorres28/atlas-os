"use client";

type Tone = "accent" | "amber" | "rose" | "moss" | "muted";

const COLORS: Record<Tone, string> = {
  accent: "var(--accent)",
  amber: "#C69148",
  rose: "#B15864",
  moss: "#5F8168",
  muted: "var(--bone-500)",
};

/**
 * StateDot — one solid colored dot. Meaning is carried entirely by colour.
 *
 * Green (moss) = healthy, Blue (accent) = ready to move up,
 * Amber = watch this one, Rose = blocked.
 */
export function StateDot({
  tone,
  size = 14,
}: {
  tone: Tone;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: COLORS[tone],
        boxShadow:
          tone === "accent"
            ? "0 0 0 4px rgba(24, 61, 168, 0.10)"
            : tone === "rose"
              ? "0 0 0 4px rgba(177, 88, 100, 0.10)"
              : undefined,
      }}
    />
  );
}
