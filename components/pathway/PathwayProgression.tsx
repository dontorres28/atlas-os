"use client";

import Link from "next/link";
import { useMemo } from "react";
import { GitBranch, Plus } from "lucide-react";
import { useRoster } from "@/data/use-roster";
import { athletePathways, pathwayStages } from "@/data/pathways";
import { useUserStore } from "@/data/user-store";
import type { AthletePathway, PathwayReadiness } from "@/lib/types";
import { PrimaryButton } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

function teamToStageId(team: string) {
  if (team === "U19") return "u19";
  if (team === "U21") return "u21";
  if (team === "First Team" || team === "Loan") return "first-team";
  return "u17";
}

function pillClass(status: PathwayReadiness) {
  switch (status) {
    case "Ready":
      return "bg-accent text-white border border-accent";
    case "On Track":
      return "bg-white/[0.06] text-white border border-hairlineStrong";
    case "At Risk":
      return "bg-signal-amber/20 text-signal-amber border border-signal-amber/50";
    case "Blocked":
      return "bg-signal-rose/20 text-signal-rose border border-signal-rose/50";
    default:
      return "bg-white/[0.06] text-white border border-hairlineStrong";
  }
}

function statusOrder(s: PathwayReadiness) {
  switch (s) {
    case "Ready":
      return 0;
    case "On Track":
      return 1;
    case "At Risk":
      return 2;
    case "Blocked":
      return 3;
    default:
      return 4;
  }
}

export function PathwayProgression() {
  const roster = useRoster();
  const notes = useUserStore((s) => s.pathwayNotes);

  /**
   * Combined pathway list: seed-computed pathways for demo athletes,
   * synthesized entries for user-owned athletes.
   */
  const relevantPathways = useMemo<AthletePathway[]>(() => {
    return roster.map((a) => {
      const seed = athletePathways.find((p) => p.athleteId === a.id);
      if (seed) return seed;
      const note = notes[a.id];
      const currentStageId = teamToStageId(a.team);
      const idx = pathwayStages.findIndex((s) => s.id === currentStageId);
      return {
        athleteId: a.id,
        currentStageId,
        nextStageId: pathwayStages[idx + 1]?.id,
        onLoan: a.team === "Loan",
        status: note?.status ?? "On Track",
        confidence: "Medium",
        nextStepSummary: note?.nextStep ?? "Consolidate at current stage.",
        blocker: note?.blocker,
        history: [{ stageId: currentStageId, season: "2026/27", year: 2026 }],
      };
    });
  }, [roster, notes]);

  const stages = [...pathwayStages].sort((a, b) => b.order - a.order);

  if (roster.length === 0) {
    return (
      <div className="mx-auto max-w-[520px] pb-16 pt-16 text-center">
        <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center">
          <GitBranch size={22} strokeWidth={1.4} className="text-bone-500" />
        </div>
        <h2 className="display text-[32px] leading-tight tracking-tightest text-white md:text-[36px]">
          No athletes to place yet.
        </h2>
        <p className="mx-auto mt-6 max-w-[40ch] text-[14px] leading-relaxed tracking-tightish text-bone-300">
          Add some athletes and Atlas will start mapping where they sit today
          and where they&rsquo;re heading next.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Link href="/squad">
            <PrimaryButton>
              <Plus size={12} strokeWidth={1.6} />
              Add athletes
            </PrimaryButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-6 pb-8">
      {stages.map((stage) => {
        const here = relevantPathways
          .filter((p) => p.currentStageId === stage.id)
          .sort((a, b) => statusOrder(a.status) - statusOrder(b.status));

        // Hide empty stages entirely unless it's the senior team, which
        // always deserves a placeholder.
        if (here.length === 0 && !stage.isSenior) return null;

        return (
          <section key={stage.id} className="structural-surface atlas-enter p-8">
            <div className="flex items-baseline justify-between">
              <Link
                href={`/pathways/${stage.key}`}
                className={cn(
                  "display text-[32px] tracking-tightest transition-colors hover:text-accent-tint md:text-[38px]",
                  stage.isSenior ? "text-white" : "text-white/85",
                )}
              >
                {stage.label}
              </Link>
              <span className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
                {here.length} athlete{here.length === 1 ? "" : "s"}
              </span>
            </div>

            {here.length === 0 ? (
              <p className="mt-6 text-[13px] tracking-tightish text-bone-500">
                Empty for this season.
              </p>
            ) : (
              <div className="mt-6 flex flex-wrap gap-2">
                {here.map((p) => {
                  const a = roster.find((x) => x.id === p.athleteId);
                  if (!a) return null;
                  return (
                    <Link
                      key={a.id}
                      href={`/squad/${a.id}`}
                      className={cn(
                        "press-scale inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] tracking-tightish transition-colors",
                        pillClass(p.status),
                      )}
                    >
                      <span>{a.name}</span>
                      <span className="text-[11px] uppercase tracking-[0.14em] opacity-70">
                        {p.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
