import { athletes } from "./athletes";

export type RecruitmentBrief = {
  code: string;
  title: string;
  need: string;
  criteria: string[];
  reason: string;
  priority: "High" | "Medium" | "Watching";
  internal: {
    athleteId: string;
    source: "First Team" | "Loan" | "Academy";
    fit: "High" | "Medium" | "Low";
    note: string;
  }[];
  externalRequired: boolean;
};

export const briefs: RecruitmentBrief[] = [
  {
    code: "CB-27",
    title: "Left-footed centre back",
    need: "Left-footed centre back",
    criteria: [
      "Age 20 to 24",
      "Comfortable defending a high line",
      "1,500+ senior minutes across the last 12 months",
      "First Team ready inside 6 months",
    ],
    reason:
      "Projected 2027 / 28 gap. Two senior centre backs into contract years; only Mattia Rossi meets First Team readiness inside the academy.",
    priority: "High",
    internal: [
      {
        athleteId: "ath_016",
        source: "Academy",
        fit: "High",
        note: "Ready U21. First-contact positioning strong, needs a First Team CB rotation trial.",
      },
      {
        athleteId: "ath_022",
        source: "Loan",
        fit: "Medium",
        note: "Central midfielder profile, not a natural fit for the CB brief.",
      },
    ],
    externalRequired: true,
  },
  {
    code: "GK-27",
    title: "Backup goalkeeper",
    need: "Backup goalkeeper, senior ready",
    criteria: [
      "Age 22 to 27",
      "Command of penalty area",
      "Comfortable with build-up under pressure",
      "Willing to accept a second-choice role for 2027 / 28",
    ],
    reason:
      "Elias Roth into the final year. Finn Andersen still 12 months from senior debut based on the pathway.",
    priority: "Medium",
    internal: [
      {
        athleteId: "ath_014",
        source: "Academy",
        fit: "Medium",
        note: "Progressing well but not yet a senior backup.",
      },
    ],
    externalRequired: true,
  },
];

export function briefAthletes(brief: RecruitmentBrief) {
  return brief.internal
    .map((i) => ({
      ...i,
      athlete: athletes.find((a) => a.id === i.athleteId),
    }))
    .filter(
      (x): x is typeof x & { athlete: NonNullable<typeof x.athlete> } => Boolean(x.athlete),
    );
}
