"use client";

import type { Athlete } from "@/lib/types";
import { ATHLETE_SIGNALS, signalsFor } from "@/data/athlete-state";
import { getPathway, stageOf } from "@/data/pathways";
import { useUserStore } from "@/data/user-store";
import { formatDateLong } from "@/lib/utils";

const CENTER = 100;
const RADII = [92, 78, 64];
const START = -135;
const END = 135;
const SPAN = END - START;

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx: number, cy: number, r: number, startA: number, endA: number) {
  const s = polar(cx, cy, r, startA);
  const e = polar(cx, cy, r, endA);
  const large = endA - startA > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function AthletePersonalState({ athlete }: { athlete: Athlete }) {
  const s = ATHLETE_SIGNALS[athlete.id] ?? signalsFor(athlete);
  const seedPathway = getPathway(athlete.id);
  const note = useUserStore((st) => st.pathwayNotes[athlete.id]);
  const p =
    seedPathway ??
    (note
      ? {
          currentStageId:
            athlete.team === "First Team" || athlete.team === "Loan"
              ? "first-team"
              : athlete.team === "U21"
                ? "u21"
                : "u19",
          nextStageId: undefined,
          status: note.status,
        }
      : undefined);
  const signals = [
    { key: "Performance", value: s.performance },
    { key: "Pathway", value: s.pathway },
    { key: "Availability", value: s.availability },
  ];

  return (
    <section className="grid grid-cols-1 gap-x-16 gap-y-12 border-b border-hairline pb-16 pt-2 md:grid-cols-12">
      <div className="md:col-span-6">
        <div className="relative mx-auto aspect-square max-w-[260px]">
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {RADII.map((r, i) => (
              <path
                key={`t-${i}`}
                d={arcPath(CENTER, CENTER, r, START, END)}
                fill="none"
                stroke="var(--hairline-strong)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            ))}
            {RADII.map((r, i) => {
              const value = signals[i].value;
              const endA = START + (SPAN * value) / 100;
              return (
                <path
                  key={`f-${i}`}
                  d={arcPath(CENTER, CENTER, r, START, endA)}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-3">
            <div className="display text-[60px] leading-none tracking-tightest text-white">
              {s.composite}
            </div>
            <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
              State
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-6 md:pt-4">
        <ol>
          {signals.map((sig) => (
            <li
              key={sig.key}
              className="flex items-baseline justify-between border-t border-hairline py-4 first:border-t-0"
            >
              <span className="text-[14px] tracking-tightish text-bone-300">
                {sig.key}
              </span>
              <span className="display text-[22px] tracking-tightish text-white">
                {sig.value}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
          <Field
            k="Pathway"
            v={
              p
                ? `${stageOf(p.currentStageId)?.label ?? ""} → ${
                    p.nextStageId ? stageOf(p.nextStageId)?.label : "Established"
                  }`
                : ""
            }
          />
          <Field k="Status" v={p?.status ?? ""} tone={p?.status} />
          <Field k="Objective" v={athlete.developmentPriority} multi />
          <Field
            k="Last review"
            v={athlete.lastReviewDate ? formatDateLong(athlete.lastReviewDate) : "None"}
          />
        </div>
      </div>
    </section>
  );
}

function Field({
  k,
  v,
  tone,
  multi,
}: {
  k: string;
  v: string;
  tone?: string;
  multi?: boolean;
}) {
  const color =
    tone === "Ready"
      ? "text-accent-tint"
      : tone === "Blocked" || tone === "At Risk"
        ? "text-signal-rose"
        : "text-white";
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
        {k}
      </div>
      <div
        className={
          multi
            ? "mt-2 text-[13px] leading-relaxed tracking-tightish text-bone-200"
            : `mt-2 text-[16px] tracking-tightish ${color}`
        }
      >
        {v}
      </div>
    </div>
  );
}
