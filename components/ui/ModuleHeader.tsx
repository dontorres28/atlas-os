"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function ModuleHeader({
  title,
  subtitle,
  back,
  side,
}: {
  /** Kept for backwards compat; not rendered any more. */
  section?: string;
  /** Large editorial heading */
  title: string;
  /** Sub line, e.g. "First Team and Academy, 2026/27" */
  subtitle?: string;
  /** Optional back link */
  back?: { href: string; label: string };
  /** Right-side content (small right-aligned stat block) */
  side?: ReactNode;
}) {
  return (
    <header className="atlas-enter pb-14 pt-14">
      {back ? (
        <Link
          href={back.href}
          className="mb-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bone-500 transition-colors hover:text-white"
        >
          <ArrowLeft size={11} strokeWidth={1.4} />
          {back.label}
        </Link>
      ) : null}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h1 className="display text-[52px] tracking-tightest text-white md:text-[64px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 text-[14px] tracking-tightish text-bone-400">
              {subtitle}
            </p>
          ) : null}
        </div>

        {side ? <div className="md:col-span-4 md:justify-self-end">{side}</div> : null}
      </div>
    </header>
  );
}
