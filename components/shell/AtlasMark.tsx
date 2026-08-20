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
 * Full Atlas OS wordmark — the full lockup, tinted per theme.
 *
 * The supplied `.svg` asset wraps a raster PNG, so we can't recolour
 * its pixels directly. Two layers combine to get theme-aware colour
 * plus a blue icon accent in light mode:
 *   • Layer 1: the full wordmark image, silhouette-flipped via
 *     `filter` — dark ink in light mode, white in dark mode.
 *   • Layer 2: the standalone icon used as a CSS mask, painted with
 *     `background-color`, absolutely positioned over the icon region
 *     of layer 1. Atlas Blue in light mode covers the dark ink; in
 *     dark mode both layers are white so the overlay blends away.
 *
 * Wordmark viewBox is 787.5 × 182.25. The icon occupies roughly the
 * first 22% of the width — we sit the overlay flush at (0, 0) with
 * a slightly larger height to account for the icon's taller aspect.
 */
export function AtlasWordmark({ size = 20 }: { size?: number }) {
  const height = size + 14;
  const wordmarkAspect = 787.5 / 182.25; // 4.32

  const wordmarkWidth = height * wordmarkAspect;
  // Icon lives in the left ~22% of the wordmark, vertically centered.
  const iconWidth = wordmarkWidth * 0.22;

  return (
    <span
      className="atlas-wordmark relative inline-flex items-center"
      style={{ width: wordmarkWidth, height }}
    >
      <img
        className="atlas-wordmark-img"
        src="/atlas-wordmark.svg"
        alt="Atlas OS"
        style={{ width: wordmarkWidth, height, display: "block" }}
      />
      <span
        className="atlas-icon-tint absolute left-0 top-0"
        aria-hidden
        style={{ width: iconWidth, height }}
      />
    </span>
  );
}
