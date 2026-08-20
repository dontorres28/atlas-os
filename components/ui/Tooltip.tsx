"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Placement = "top" | "bottom" | "left" | "right";

/**
 * Tooltip — one consistent surface used everywhere in the app.
 *
 * Always a dark ink chip with fixed light type, regardless of theme,
 * so it reads the same in dark and light mode.
 *
 * Prefer the structured `title` / `hint` props. `content` is kept for
 * one-off cases but any theme-adaptive classes inside `content` will
 * fight the fixed tooltip palette — avoid them.
 */
export function Tooltip({
  title,
  hint,
  content,
  side = "top",
  align = "center",
  children,
  wide,
}: {
  /** Primary line, rendered in fixed white. */
  title?: string;
  /** Secondary line, rendered in fixed muted light. */
  hint?: string;
  /** Escape hatch for custom bodies. Use fixed colours only. */
  content?: ReactNode;
  side?: Placement;
  align?: "start" | "center" | "end";
  children: ReactNode;
  wide?: boolean;
}) {
  const posClass =
    side === "top"
      ? "bottom-full mb-2"
      : side === "bottom"
        ? "top-full mt-2"
        : side === "left"
          ? "right-full mr-2 top-1/2 -translate-y-1/2"
          : "left-full ml-2 top-1/2 -translate-y-1/2";

  const alignClass =
    side === "top" || side === "bottom"
      ? align === "start"
        ? "left-0"
        : align === "end"
          ? "right-0"
          : "left-1/2 -translate-x-1/2"
      : "";

  return (
    <span className="group/tt relative inline-flex outline-none" tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 rounded-lg px-3 py-2 text-[11px] leading-relaxed tracking-tightish opacity-0 shadow-[0_14px_32px_-12px_rgba(0,0,0,0.55)] transition-all duration-200 ease-atlas group-hover/tt:opacity-100 group-focus/tt:opacity-100",
          posClass,
          alignClass,
          wide ? "w-[260px]" : "whitespace-nowrap",
        )}
        style={{
          backgroundColor: "#131C29",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#FEFEFE",
        }}
      >
        {content ? (
          content
        ) : (
          <>
            {title ? (
              <span className="block" style={{ color: "#FEFEFE" }}>
                {title}
              </span>
            ) : null}
            {hint ? (
              <span
                className="mt-1 block"
                style={{ color: "rgba(254, 254, 254, 0.62)" }}
              >
                {hint}
              </span>
            ) : null}
          </>
        )}
      </span>
    </span>
  );
}
