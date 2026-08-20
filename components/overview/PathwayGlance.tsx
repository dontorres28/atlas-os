"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { athletes } from "@/data/athletes";
import { athletePathways, pathwayStages, stageOf } from "@/data/pathways";

const STAGE_KEYS = ["u19", "u21", "first-team"] as const;

export function PathwayGlance() {
  return (
    <section className="atlas-enter" style={{ animationDelay: "0.13s" }}>
      <div className="flex items-baseline justify-between border-b border-hairline pb-5">
        <h2 className="text-[18px] tracking-tightish text-white">
          Movement between stages
        </h2>
        <Link
          href="/pathways"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-bone-400 transition-colors hover:text-white"
        >
          Open pathways
          <ArrowRight size={12} strokeWidth={1.4} />
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-4">
        {STAGE_KEYS.map((key, i) => {
          const s = stageOf(key)!;
          return (
            <div key={key} className="flex items-center gap-4">
              <Link
                href={`/pathways/${key}`}
                className="text-[14px] uppercase tracking-[0.16em] text-white transition-colors hover:text-accent-tint"
              >
                {s.label}
              </Link>
              {i < STAGE_KEYS.length - 1 ? (
                <ArrowRight size={14} strokeWidth={1.2} className="text-bone-500" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-3 gap-8">
        {STAGE_KEYS.map((key) => {
          const stage = stageOf(key)!;
          const here = athletePathways.filter((p) => p.currentStageId === stage.id);
          const highlight = here
            .filter((p) => p.status === "Ready" || p.status === "Blocked")
            .slice(0, 3);
          return (
            <div key={key} className="border-t border-hairline pt-4">
              <div className="mb-4 flex items-baseline justify-between">
                <div className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
                  Highlighted
                </div>
                <div className="text-[11px] tracking-[0.02em] text-bone-400">
                  {here.length} total
                </div>
              </div>
              {highlight.length === 0 ? (
                <div className="text-[13px] text-bone-500">Everyone on track.</div>
              ) : (
                <ol>
                  {highlight.map((p) => {
                    const a = athletes.find((x) => x.id === p.athleteId)!;
                    const toneClass =
                      p.status === "Ready"
                        ? "text-accent-tint"
                        : p.status === "Blocked"
                          ? "text-signal-rose"
                          : "text-bone-300";
                    return (
                      <li key={p.athleteId}>
                        <Link
                          href={`/squad/${a.id}`}
                          className="grid grid-cols-6 items-baseline gap-2 border-t border-hairline py-2.5 first:border-t-0 transition-colors hover:bg-white/[0.02]"
                        >
                          <span className="col-span-4 text-[14px] tracking-tightish text-white">
                            {a.name}
                          </span>
                          <span className={`col-span-2 text-right text-[10px] uppercase tracking-[0.18em] ${toneClass}`}>
                            {p.status}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
