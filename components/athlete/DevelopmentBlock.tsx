"use client";

import type { Athlete } from "@/lib/types";
import { Section } from "../ui/Section";

export function DevelopmentBlock({ athlete }: { athlete: Athlete }) {
  return (
    <Section index="04" title="Development" delay={0.15}>
      <ol className="relative">
        {athlete.developmentTimeline.map((entry, i) => {
          const isLast = i === athlete.developmentTimeline.length - 1;
          return (
            <li
              key={entry.season}
              className="grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-5 last:border-b"
            >
              <span className="mono col-span-1 text-[11px] tracking-[0.16em] text-bone-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mono col-span-3 text-[13px] text-bone-200">
                {entry.season}
              </span>
              <span
                className={`col-span-5 text-[15px] tracking-tightish ${
                  isLast ? "text-accent-tint" : "text-white"
                }`}
              >
                {entry.team}
              </span>
              <span className="col-span-3 text-right meta">
                {isLast ? "Current" : entry.note ?? ""}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid grid-cols-12 gap-4 border-t border-hairlineStrong py-8">
        <div className="col-span-4 label">Current development objective</div>
        <div className="col-span-8 text-[16px] leading-relaxed tracking-tightish text-white">
          {athlete.developmentPriority}
        </div>
      </div>
    </Section>
  );
}
