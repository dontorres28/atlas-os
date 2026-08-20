"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * NavArrow — the single "Open X" affordance used across every module.
 * Uppercase small caps + arrow that translates on hover.
 */
export function NavArrow({
  href,
  children,
  className,
  tone = "accent",
  onClick,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  tone?: "accent" | "muted";
  onClick?: () => void;
}) {
  const color =
    tone === "muted"
      ? "text-bone-400 hover:text-white"
      : "text-accent-tint hover:text-white";

  const inner = (
    <span
      className={cn(
        "group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ease-atlas",
        color,
        className,
      )}
    >
      {children}
      <ArrowRight
        size={12}
        strokeWidth={1.4}
        className="transition-transform duration-500 ease-atlas group-hover:translate-x-1"
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex">
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className="inline-flex">
      {inner}
    </button>
  );
}
