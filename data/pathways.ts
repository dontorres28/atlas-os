import type {
  AthletePathway,
  PathwayConfidence,
  PathwayReadiness,
  PathwayStageDef,
} from "@/lib/types";
import { athletes } from "./athletes";

export const pathwayStages: PathwayStageDef[] = [
  { id: "u17", key: "u17", label: "U17", order: 1 },
  { id: "u19", key: "u19", label: "U19", order: 2 },
  { id: "u21", key: "u21", label: "U21 and B Team", order: 3 },
  { id: "first-team", key: "first-team", label: "First Team", order: 4, isSenior: true },
];

export function stageOf(key: string) {
  return pathwayStages.find((s) => s.id === key || s.key === key);
}

function teamToStageId(team: string) {
  if (team === "U19") return "u19";
  if (team === "U21") return "u21";
  if (team === "First Team") return "first-team";
  if (team === "Loan") return "first-team";
  return "u17";
}

function seasonToYear(season: string) {
  return parseInt(season.slice(0, 4), 10);
}

type Override = {
  status?: PathwayReadiness;
  confidence?: PathwayConfidence;
  nextStep?: string;
  blocker?: string;
  onLoan?: boolean;
  loanClub?: string;
  nextStageId?: string | null;
};

const overrides: Record<string, Override> = {
  ath_001: {
    status: "On Track",
    confidence: "High",
    nextStep: "Establish as First Team starter",
    blocker: "Squad depth at Centre Back",
    nextStageId: null,
  },
  ath_002: { status: "On Track", confidence: "High", nextStep: "Retain as First Team starter" },
  ath_003: {
    status: "On Track",
    confidence: "High",
    nextStep: "Retain as First Team starter",
    blocker: "Contract runs to 2027 and the succession candidate is not yet ready",
  },
  ath_004: { status: "On Track", confidence: "High", nextStep: "Retain as First Team starter" },
  ath_005: {
    status: "At Risk",
    confidence: "Low",
    nextStep: "Contract decision window",
    blocker: "Contract expires June 2026, and the ageing curve at DM is working against him",
  },
  ath_006: { status: "On Track", confidence: "High", nextStep: "Retain as First Team starter" },
  ath_007: { status: "On Track", confidence: "Medium", nextStep: "Retain in First Team rotation" },
  ath_008: {
    status: "Blocked",
    confidence: "Medium",
    nextStep: "Return to full training load",
    blocker: "Medium-term hamstring injury",
  },
  ath_009: {
    status: "Ready",
    confidence: "High",
    nextStep: "Confirmed as First Team creator",
    blocker: undefined,
  },
  ath_010: { status: "On Track", confidence: "High", nextStep: "Retain as First Team starter" },
  ath_011: {
    status: "At Risk",
    confidence: "Low",
    nextStep: "Contract decision window",
    blocker: "Contract expiry Jun 2026",
  },
  ath_012: {
    status: "On Track",
    confidence: "Medium",
    nextStep: "Consolidate First Team minutes",
    blocker: "Wide forward depth",
  },
  ath_013: {
    status: "Ready",
    confidence: "High",
    nextStep: "First Team integration, two sessions per week",
    blocker: "First Team CM slot occupied",
    nextStageId: "first-team",
  },
  ath_014: {
    status: "On Track",
    confidence: "High",
    nextStep: "First Team backup GK trial",
    blocker: "Elias Roth occupies senior slot",
    nextStageId: "first-team",
  },
  ath_015: {
    status: "On Track",
    confidence: "Medium",
    nextStep: "Consolidate as U21 core",
    nextStageId: "first-team",
  },
  ath_016: {
    status: "Ready",
    confidence: "High",
    nextStep: "First Team CB rotation trial",
    blocker: "First Team CB depth is thick (Meier, Ferrari, Lang)",
    nextStageId: "first-team",
  },
  ath_017: {
    status: "On Track",
    confidence: "Medium",
    nextStep: "Physical development window",
    nextStageId: "u21",
  },
  ath_018: {
    status: "On Track",
    confidence: "Medium",
    nextStep: "Extend U19 exposure",
    nextStageId: "u21",
  },
  ath_019: {
    status: "On Track",
    confidence: "Medium",
    nextStep: "U21 trial in Q4",
    nextStageId: "u21",
  },
  ath_020: {
    status: "Ready",
    confidence: "High",
    nextStep: "U21 integration",
    blocker: undefined,
    nextStageId: "u21",
  },
  ath_021: {
    status: "On Track",
    confidence: "High",
    nextStep: "U21 promotion within 6 months",
    nextStageId: "u21",
  },
  ath_022: {
    status: "On Track",
    confidence: "Medium",
    nextStep: "Return from loan Jun 2026 for reassessment",
    onLoan: true,
    loanClub: "SC Kriens",
    nextStageId: "first-team",
  },
  ath_023: {
    status: "Blocked",
    confidence: "Low",
    nextStep: "Loan role clarity required",
    blocker: "Off-position deployment at FC Vaduz",
    onLoan: true,
    loanClub: "FC Vaduz",
    nextStageId: "first-team",
  },
};

function buildHistory(a: (typeof athletes)[number]) {
  return a.developmentTimeline.map((entry) => {
    const stageId = teamToStageId(entry.team);
    const year = seasonToYear(entry.season);
    const note = entry.team === "Loan" ? "On loan" : undefined;
    return { stageId, season: entry.season, year, note };
  });
}

function defaultNextStageId(currentStageId: string) {
  const idx = pathwayStages.findIndex((s) => s.id === currentStageId);
  if (idx < 0) return undefined;
  const next = pathwayStages[idx + 1];
  return next?.id;
}

export const athletePathways: AthletePathway[] = athletes.map((a) => {
  const currentStageId = teamToStageId(a.team);
  const o = overrides[a.id] ?? {};
  const nextStageId =
    o.nextStageId === null
      ? undefined
      : o.nextStageId ?? defaultNextStageId(currentStageId);
  const nextStepDefault =
    currentStageId === "first-team"
      ? "Consolidate First Team role"
      : `Progression toward ${stageOf(nextStageId ?? "")?.label ?? "senior football"}`;

  return {
    athleteId: a.id,
    currentStageId,
    nextStageId,
    onLoan: o.onLoan ?? a.team === "Loan",
    loanClub:
      o.loanClub ??
      (a.loanStatus
        ? a.loanStatus.replace(/^On loan at /, "").replace(/ for .*$/, "")
        : undefined),
    status: o.status ?? "On Track",
    confidence: o.confidence ?? "Medium",
    nextStepSummary: o.nextStep ?? nextStepDefault,
    blocker: o.blocker,
    history: buildHistory(a),
  };
});

export function getPathway(athleteId: string) {
  return athletePathways.find((p) => p.athleteId === athleteId);
}

export function athletesAtStage(stageId: string) {
  return athletePathways.filter((p) => p.currentStageId === stageId);
}

export function stageAthleteCount(stageId: string) {
  return athletesAtStage(stageId).length;
}

// Bottleneck detection: readiness to progress vs. available capacity at next stage.
export function pathwayBottlenecks() {
  const results: {
    fromStage: PathwayStageDef;
    toStage: PathwayStageDef;
    readyCount: number;
    receivingCapacity: number;
    note: string;
  }[] = [];

  for (const stage of pathwayStages) {
    const ready = athletesAtStage(stage.id).filter(
      (p) => p.status === "Ready" && p.nextStageId,
    );
    if (ready.length === 0) continue;

    const nextIds = new Set(ready.map((p) => p.nextStageId!));
    for (const nextId of nextIds) {
      const target = stageOf(nextId);
      if (!target) continue;
      const readyForThis = ready.filter((p) => p.nextStageId === nextId).length;
      // Toy capacity model: assume 2 progression slots per senior stage per season.
      const capacity = target.isSenior ? 2 : 4;
      if (readyForThis > capacity) {
        results.push({
          fromStage: stage,
          toStage: target,
          readyCount: readyForThis,
          receivingCapacity: capacity,
          note: `${readyForThis} players competing for ${capacity} progression places.`,
        });
      } else if (readyForThis > 0 && target.isSenior) {
        results.push({
          fromStage: stage,
          toStage: target,
          readyCount: readyForThis,
          receivingCapacity: capacity,
          note: `${readyForThis} athlete${readyForThis === 1 ? "" : "s"} ready for promotion.`,
        });
      }
    }
  }
  return results;
}
