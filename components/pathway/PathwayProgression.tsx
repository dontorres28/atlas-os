"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GitBranch, Plus } from "lucide-react";
import { useRoster } from "@/data/use-roster";
import { athletePathways, pathwayStages, stageOf } from "@/data/pathways";
import { useUserStore } from "@/data/user-store";
import type { AthletePathway } from "@/lib/types";
import { PrimaryButton } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

function teamToStageId(team: string) {
  if (team === "U19") return "u19";
  if (team === "U21") return "u21";
  if (team === "First Team" || team === "Loan") return "first-team";
  return "u17";
}

export function PathwayProgression() {
  const roster = useRoster();
  const notes = useUserStore((s) => s.pathwayNotes);
  const [hover, setHover] = useState<string | null>(null);

  /**
   * Combined pathway list: seed-computed pathways for demo athletes,
   * synthesized entries for user-owned athletes (using their saved
   * pathway note or a sensible default).
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
        history: [
          { stageId: currentStageId, season: "2026/27", year: 2026 },
        ],
      };
    });
  }, [roster, notes]);

  const hoveredAthlete = hover ? roster.find((a) => a.id === hover) : null;
  const hoveredPathway = hover
    ? relevantPathways.find((p) => p.athleteId === hover)
    : null;

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
          Add some athletes and Atlas will start mapping where they sit today and where they're heading next.
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
    <div className="grid grid-cols-1 gap-10 pb-8 md:grid-cols-[1fr_320px]">
      <div>
        {stages.map((stage) => {
          const here = relevantPathways
            .filter((p) => p.currentStageId === stage.id)
            .sort((a, b) => statusOrder(a.status) - statusOrder(b.status));

          return (
            <section key={stage.id} className="atlas-enter py-9">
              <div className="flex items-baseline justify-between">
                <Link
                  href={`/pathways/${stage.key}`}
                  className={cn(
                    "display text-[36px] tracking-tightest transition-colors hover:text-accent-tint md:text-[44px]",
                    stage.isSenior ? "text-white" : "text-white/85",
                  )}
                >
                  {stage.label}
                </Link>
                <span className="text-[11px] tracking-tightish text-bone-500">
                  {here.length}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {here.length === 0 ? (
                  <span className="text-[12px] text-bone-600">Empty</span>
                ) : (
                  here.map((p) => {
                    const a = roster.find((x) => x.id === p.athleteId);
                    if (!a) return null;
                    return (
                      <Tooltip
                        key={a.id}
                        side="top"
                        title={a.name}
                        hint={`${a.positionLabel}, ${p.status}`}
                      >
                        <Link
                          href={`/squad/${a.id}`}
                          onMouseEnter={() => setHover(a.id)}
                          onMouseLeave={() =>
                            setHover((cur) => (cur === a.id ? null : cur))
                          }
                          onFocus={() => setHover(a.id)}
                          aria-label={a.name}
                          className={cn(
                            "relative flex h-[14px] w-[14px] items-center justify-center rounded-full transition-transform duration-300 ease-atlas hover:scale-[1.6]",
                            dotClass(p.status),
                            hover === a.id ? "scale-[1.6]" : "",
                          )}
                        />
                      </Tooltip>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}

        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-hairline pt-6">
          <Legend tone="accent">Ready</Legend>
          <Legend tone="white">On Track</Legend>
          <Legend tone="amber">At Risk</Legend>
          <Legend tone="rose">Blocked</Legend>
        </div>
      </div>

      <aside className="sticky top-8 hidden self-start md:block">
        <div className="pill-glass rounded-2xl p-6">
          <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
            {hoveredAthlete ? "Athlete" : "Hover a dot"}
          </div>
          {hoveredAthlete && hoveredPathway ? (
            <div className="mt-4">
              <Link
                href={`/squad/${hoveredAthlete.id}`}
                className="display block text-[26px] tracking-tightest text-white transition-colors hover:text-accent-tint"
              >
                {hoveredAthlete.name}
              </Link>
              <div className="mt-3 text-[13px] tracking-tightish text-bone-300">
                {hoveredAthlete.positionLabel}, {hoveredAthlete.age} yrs
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <MetaCell k="Stage" v={stageOf(hoveredPathway.currentStageId)?.label ?? ""} />
                <MetaCell
                  k="Next"
                  v={
                    hoveredPathway.nextStageId
                      ? stageOf(hoveredPathway.nextStageId)?.label ?? "Established"
                      : "Established"
                  }
                />
                <MetaCell k="Status" v={hoveredPathway.status} tone={hoveredPathway.status} />
                <MetaCell k="Confidence" v={hoveredPathway.confidence} />
              </div>
              <p className="mt-6 text-[12px] leading-relaxed text-bone-400">
                {hoveredPathway.nextStepSummary}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-[13px] leading-relaxed text-bone-400">
              Each dot is an athlete. Colour shows their pathway status.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function statusOrder(s: string) {
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

function dotClass(status: string) {
  switch (status) {
    case "Ready":
      return "bg-accent";
    case "Blocked":
      return "bg-signal-rose";
    case "At Risk":
      return "bg-signal-amber";
    case "On Track":
    default:
      return "bg-white";
  }
}

function Legend({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "accent" | "white" | "amber" | "rose";
}) {
  const bg =
    tone === "accent"
      ? "bg-accent"
      : tone === "white"
        ? "bg-white"
        : tone === "amber"
          ? "bg-signal-amber"
          : "bg-signal-rose";
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bone-400">
      <span className={`h-[10px] w-[10px] rounded-full ${bg}`} />
      {children}
    </div>
  );
}

function MetaCell({
  k,
  v,
  tone,
}: {
  k: string;
  v: string;
  tone?: string;
}) {
  const color =
    tone === "Ready"
      ? "text-accent-tint"
      : tone === "Blocked"
        ? "text-signal-rose"
        : tone === "At Risk"
          ? "text-signal-amber"
          : "text-white";
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
        {k}
      </div>
      <div className={`mt-2 text-[14px] tracking-tightish ${color}`}>{v}</div>
    </div>
  );
}
