"use client";

import { motion } from "framer-motion";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
  count?: number;
};

const SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 40,
  mass: 0.9,
};

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  align = "center",
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegmentedOption<T>[];
  size?: "sm" | "md";
  align?: "left" | "center";
  ariaLabel?: string;
}) {
  const layoutId = "seg-" + useId();

  const paddingY = size === "sm" ? "py-1.5" : "py-2";
  const paddingX = size === "sm" ? "px-3" : "px-4";
  const textSize = size === "sm" ? "text-[12px]" : "text-[13px]";

  return (
    <div
      className={cn(
        "flex",
        align === "center" ? "justify-center" : "justify-start",
      )}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="pill-glass relative inline-flex items-center gap-1 rounded-full p-1"
      >
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "group relative select-none rounded-full",
                paddingX,
                paddingY,
                textSize,
                "tracking-tightish transition-colors duration-300 ease-atlas",
                active ? "" : "text-bone-300 hover:text-white",
              )}
              style={active ? { color: "#FEFEFE" } : undefined}
            >
              {active ? (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full"
                  transition={SPRING}
                  style={{
                    background:
                      "linear-gradient(180deg, var(--accent-soft) 0%, var(--accent) 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 0 1px rgba(255,255,255,0.10), 0 8px 20px -8px rgba(24,61,168,0.65)",
                  }}
                />
              ) : null}
              <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                {opt.label}
                {typeof opt.count === "number" ? (
                  <span
                    className={cn(
                      "text-[11px] tracking-tightish transition-colors duration-300",
                      active ? "" : "text-bone-500",
                    )}
                    style={active ? { color: "rgba(254, 254, 254, 0.72)" } : undefined}
                  >
                    {opt.count}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
