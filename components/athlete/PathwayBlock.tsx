"use client";

import Link from "next/link";
import type { Athlete } from "@/lib/types";
import { getPathway, pathwayStages, stageOf } from "@/data/pathways";
import { Section } from "../ui/Section";

const readinessCopy: Record<string, string> = {
  Ready: "Progressing ahead of expectation.",
  "On Track": "Progressing as planned.",
  Blocked: "Next step unclear or unavailable.",
  "At Risk": "Falling behind expectation.",
};

export function PathwayBlock({ athlete }: { athlete: Athlete }) {
  const p = getPathway(athlete.id);
  if (!p) return null;

  const currentIdx = pathwayStages.findIndex((s) => s.id === p.currentStageId);

  return (
    <Section
      title="Pathway"
      aside={p.onLoan ? `On loan at ${p.loanClub ?? "an external club"}.` : undefined}
      delay={0.09}
    >
      <ol className="mb-10">
        {pathwayStages.map((stage, i) => {
          const passed = i <= currentIdx;
          const current = i === currentIdx;
          const entry = [...p.history].reverse().find((h) => h.stageId === stage.id);
          return (
            <li
              key={stage.id}
              className="grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-5 last:border-b"
            >
              <Link
                href={`/pathways/${stage.key}`}
                className={`col-span-7 text-[17px] tracking-tightish transition-colors ${
                  current
                    ? "text-white"
                    : passed
                      ? "text-bone-200 hover:text-white"
                      : "text-bone-500 hover:text-bone-200"
                }`}
              >
                {stage.label}
                {current ? (
                  <span className="ml-4 text-[10px] font-medium uppercase tracking-[0.2em] text-accent-tint">
                    Current
                  </span>
                ) : null}
              </Link>
              <span className="col-span-2 text-[13px] text-bone-300">
                {entry ? entry.season : ""}
              </span>
              <span className="col-span-3 text-right meta">
                {entry?.note ??
                  (current
                    ? "Current stage"
                    : passed
                      ? "Progressed"
                      : "Not yet reached")}
              </span>
            </li>
          );
        })}
      </ol>

      <dl className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
        <div className="border-t border-hairlineStrong py-6">
          <dt className="label">Next expected step</dt>
          <dd className="mt-3 text-[16px] tracking-tightish text-white">
            {p.nextStepSummary}
          </dd>
        </div>
        <div className="border-t border-hairlineStrong py-6">
          <dt className="label">Pathway status</dt>
          <dd className="mt-3 text-[16px] tracking-tightish text-white">
            {p.status}
          </dd>
          <dd className="mt-1 meta text-bone-300">
            {readinessCopy[p.status]}
          </dd>
        </div>
        <div className="border-t border-hairline py-6">
          <dt className="label">Pathway confidence</dt>
          <dd className="mt-3 text-[16px] tracking-tightish text-white">
            {p.confidence}
          </dd>
        </div>
        <div className="border-t border-hairline py-6">
          <dt className="label">Blocking factor</dt>
          <dd className="mt-3 text-[16px] tracking-tightish text-white">
            {p.blocker ?? "None right now."}
          </dd>
        </div>
      </dl>

      {p.nextStageId ? (
        <div className="mt-10 border-t border-hairline pt-5">
          <span className="label">Progression target</span>
          <span className="ml-4 text-[13px] tracking-tightish text-bone-200">
            {stageOf(p.currentStageId)?.label} to {stageOf(p.nextStageId)?.label}
          </span>
        </div>
      ) : null}
    </Section>
  );
}
