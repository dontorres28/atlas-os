"use client";

import { athletePathways, pathwayStages } from "./pathways";
import { useUserStore } from "./user-store";
import type { Athlete, AthletePathway } from "@/lib/types";

function teamToStageId(team: string) {
  if (team === "U19") return "u19";
  if (team === "U21") return "u21";
  if (team === "First Team") return "first-team";
  if (team === "Loan") return "first-team";
  return "u17";
}

function defaultNextStageId(currentStageId: string): string | undefined {
  const idx = pathwayStages.findIndex((s) => s.id === currentStageId);
  if (idx < 0) return undefined;
  return pathwayStages[idx + 1]?.id;
}

/**
 * Build a synthetic AthletePathway for a user-owned athlete based on
 * their team + any stored pathway note. Seed athletes already have
 * pre-computed pathways.
 */
function synthesise(athlete: Athlete, note?: {
  status: AthletePathway["status"];
  nextStep?: string;
  blocker?: string;
}): AthletePathway {
  const currentStageId = teamToStageId(athlete.team);
  const nextStageId = defaultNextStageId(currentStageId);
  return {
    athleteId: athlete.id,
    currentStageId,
    nextStageId,
    onLoan: athlete.team === "Loan",
    loanClub: undefined,
    status: note?.status ?? "On Track",
    confidence: "Medium",
    nextStepSummary: note?.nextStep ?? "Consolidate at current stage.",
    blocker: note?.blocker,
    history: [
      {
        stageId: currentStageId,
        season: "2026/27",
        year: 2026,
      },
    ],
  };
}

/**
 * Resolve pathway for any athlete — seed or user-owned. Runs against
 * whatever athlete state is currently loaded on the client.
 */
export function useResolvedPathway(athlete: Athlete | undefined): AthletePathway | undefined {
  const notes = useUserStore((s) => s.pathwayNotes);
  if (!athlete) return undefined;

  const seedMatch = athletePathways.find((p) => p.athleteId === athlete.id);
  if (seedMatch) return seedMatch;

  return synthesise(athlete, notes[athlete.id]);
}
