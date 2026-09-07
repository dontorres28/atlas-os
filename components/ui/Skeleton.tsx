import type { CSSProperties } from "react";

/**
 * Layout-matching placeholder with a subtle shimmer. Prefer this over
 * spinners: it reserves space, cues the shape of what's arriving, and
 * doesn't flash in and out. Reduced-motion collapses the shimmer.
 */
export function Skeleton({
  width,
  height,
  radius,
  className,
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`skeleton block ${className ?? ""}`}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

/** A row of skeleton lines simulating a text block. */
export function SkeletonLines({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === count - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}

/** A skeleton content-surface row matching the athlete/decision/watchlist row shape. */
export function SkeletonRow() {
  return (
    <div className="content-surface flex items-center gap-4 px-4 py-3.5 md:px-5">
      <div className="min-w-0 flex-1">
        <Skeleton height={14} width="42%" />
        <Skeleton className="mt-2" height={10} width="28%" />
      </div>
      <Skeleton height={22} width={80} radius={999} />
    </div>
  );
}
