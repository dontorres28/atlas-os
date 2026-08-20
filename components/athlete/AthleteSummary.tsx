"use client";

import Link from "next/link";
import type { Athlete } from "@/lib/types";
import { getPathway, pathwayStages, stageOf } from "@/data/pathways";
import { formatDateLong } from "@/lib/utils";

export function AthleteSummary({ athlete }: { athlete: Athlete }) {
  const p = getPathway(athlete.id);
  const stages = [...pathwayStages].sort((a, b) => a.order - b.order);
  const currentIdx = stages.findIndex((s) => s.id === p?.currentStageId);

  return (
    <section className="border-b border-hairline pb-14 pt-10">
      {/* Compact pathway chain */}
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
        Pathway
      </div>
      <div className="mt-6 flex flex-wrap items-baseline gap-4">
        {stages.map((s, i) => {
          const passed = i <= currentIdx;
          const current = i === currentIdx;
          return (
            <span key={s.id} className="flex items-baseline gap-4">
              <Link
                href={`/pathways/${s.key}`}
                className={`text-[15px] uppercase tracking-[0.18em] transition-colors ${
                  current
                    ? "text-white"
                    : passed
                      ? "text-bone-200 hover:text-white"
                      : "text-bone-500 hover:text-bone-200"
                }`}
              >
                {s.label}
              </Link>
              {i < stages.length - 1 ? (
                <span className={`text-[13px] ${passed ? "text-bone-400" : "text-bone-600"}`}>→</span>
              ) : null}
            </span>
          );
        })}
      </div>

      {/* Identity strip */}
      <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-4">
        <IdField k="Current state" v={p?.status ?? "On Track"} tone={
          p?.status === "Blocked" || p?.status === "At Risk"
            ? "warn"
            : p?.status === "Ready"
              ? "accent"
              : "neutral"
        } />
        <IdField
          k="Development objective"
          v={athlete.developmentPriority}
          multi
        />
        <IdField
          k="Latest review"
          v={athlete.lastReviewDate ? formatDateLong(athlete.lastReviewDate) : "Not scheduled"}
        />
        <IdField
          k="Blocking factor"
          v={p?.blocker ?? "None"}
          multi
        />
      </dl>
    </section>
  );
}

function IdField({
  k,
  v,
  tone,
  multi,
}: {
  k: string;
  v: string;
  tone?: "accent" | "warn" | "neutral";
  multi?: boolean;
}) {
  const color =
    tone === "accent"
      ? "text-accent-tint"
      : tone === "warn"
        ? "text-signal-rose"
        : "text-white";
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
        {k}
      </dt>
      <dd
        className={
          multi
            ? `mt-4 text-[15px] leading-relaxed tracking-tightish text-bone-200`
            : `display mt-4 text-[26px] tracking-tightish ${color}`
        }
      >
        {v}
      </dd>
    </div>
  );
}
