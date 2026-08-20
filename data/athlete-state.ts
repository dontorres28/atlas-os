import { athletes } from "./athletes";
import { getPathway } from "./pathways";
import type { Athlete, PathwayReadiness } from "@/lib/types";

export type AthleteSignals = {
  performance: number;
  pathway: number;
  availability: number;
  composite: number;
};

function pathwayScore(status?: PathwayReadiness) {
  switch (status) {
    case "Ready":
      return 90;
    case "On Track":
      return 78;
    case "At Risk":
      return 52;
    case "Blocked":
      return 40;
    default:
      return 70;
  }
}

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

export function signalsFor(athlete: Athlete): AthleteSignals {
  const p = getPathway(athlete.id);

  const availability = clamp(athlete.performance.availabilityPct);
  const trendComponent = clamp(80 + athlete.performance.trendPct * 2);
  const startsRatio =
    athlete.performance.starts > 0
      ? Math.min(1, athlete.performance.minutes / (athlete.performance.starts * 90))
      : 0.9;
  const performance = clamp(trendComponent * 0.6 + startsRatio * 100 * 0.4);
  const pathway = pathwayScore(p?.status);

  const composite = Math.round(
    (performance + pathway + availability) / 3,
  );

  return {
    performance: Math.round(performance),
    pathway,
    availability: Math.round(availability),
    composite,
  };
}

export function attentionDot(athlete: Athlete): "accent" | "amber" | "rose" | null {
  const p = getPathway(athlete.id);
  if (p?.status === "Blocked") return "rose";
  if (p?.status === "At Risk") return "amber";
  if (p?.status === "Ready") return "accent";
  return null;
}

export const ATHLETE_SIGNALS: Record<string, AthleteSignals> = Object.fromEntries(
  athletes.map((a) => [a.id, signalsFor(a)]),
);
