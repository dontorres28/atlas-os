"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Item = {
  key: string;
  title: string;
  detail: string;
  href: string;
};

const ITEMS: Item[] = [
  {
    key: "cb-succession",
    title: "Centre-back succession",
    detail: "Projected 2027/28 gap.",
    href: "/pathways/first-team",
  },
  {
    key: "matteo-rossi",
    title: "Mattia Rossi",
    detail: "Development objective unchanged for 187 days.",
    href: "/squad/ath_016",
  },
];

export function RequiresAttention() {
  return (
    <section className="border-t border-hairline py-16">
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
        Requires Attention
      </div>

      {ITEMS.length === 0 ? (
        <p className="mt-8 text-[15px] leading-relaxed tracking-tightish text-bone-300">
          No immediate sporting decisions.
        </p>
      ) : (
        <ol className="mt-8">
          {ITEMS.map((it) => (
            <li key={it.key}>
              <Link
                href={it.href}
                className="group flex items-baseline justify-between gap-8 border-t border-hairlineStrong py-8 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <div className="text-[20px] tracking-tightish text-white">
                    {it.title}
                  </div>
                  <div className="mt-2 text-[13px] leading-relaxed text-bone-300">
                    {it.detail}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-accent-tint transition-colors group-hover:text-white">
                  View
                  <ArrowRight
                    size={12}
                    strokeWidth={1.4}
                    className="transition-transform duration-500 ease-atlas group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
