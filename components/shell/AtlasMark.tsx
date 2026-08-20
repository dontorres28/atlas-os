/* eslint-disable @next/next/no-img-element */

type Variant = "blue" | "onDark" | "mono" | "white";

const BLUE = "#183DA8";
const INK = "#141E2B";
const WHITE = "#FEFEFE";

/**
 * Atlas mountain mark — the compact icon-only lockup.
 *
 * Prefers the brand asset (`/atlas-icon.svg`) when `useAsset` is true.
 * Otherwise renders the hand-drawn vector version, which is theme-aware.
 */
export function AtlasMark({
  size = 32,
  variant = "onDark",
  useAsset = false,
}: {
  size?: number;
  variant?: Variant;
  /** Use the raster-in-SVG brand file. Not theme-adaptive. */
  useAsset?: boolean;
}) {
  if (useAsset) {
    return (
      <img
        src="/atlas-icon.svg"
        alt=""
        aria-hidden
        width={size}
        height={Math.round((size * 130) / 160)}
        style={{ display: "block" }}
      />
    );
  }

  const height = Math.round((size * 130) / 160);

  const fg =
    variant === "white"
      ? WHITE
      : variant === "mono"
        ? "currentColor"
        : BLUE;

  const bg =
    variant === "blue"
      ? "var(--canvas)"
      : variant === "white"
        ? INK
        : variant === "mono"
          ? "transparent"
          : INK;

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 160 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M80 6 L154 122 L104 122 L80 82 L56 122 L6 122 Z" fill={fg} />
      <path d="M80 40 L130 118 L106 118 L80 76 L54 118 L30 118 Z" fill={bg} />
      <rect x="74" y="60" width="12" height="12" fill={fg} />
      <path d="M80 82 L104 122 L56 122 Z" fill={fg} />
    </svg>
  );
}

/**
 * Full Atlas OS wordmark — the brand asset rendered as-is in light
 * mode (Atlas Blue icon + Deep Ink typeface baked in), silhouette-
 * flipped to white via CSS filter in dark mode.
 */
export function AtlasWordmark({ size = 20 }: { size?: number }) {
  const height = size + 14;
  return (
    <span
      className="atlas-wordmark inline-flex items-center"
      style={{ height }}
    >
      <img
        src="/atlas-wordmark.svg"
        alt="Atlas OS"
        style={{ height, width: "auto", display: "block" }}
      />
    </span>
  );
}
