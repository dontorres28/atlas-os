import { athletes } from "./athletes";
import { getPathway } from "./pathways";

export type LoanProfile = {
  athleteId: string;
  club: string;
  competition: string;
  role: string;
  minutes: number;
  starts: number;
  objective: string;
  progress: "On Track" | "Off Track" | "Ahead";
  progressNote: string;
  returnDecision: "Review Jan 2027" | "Extend" | "Recall" | "Return summer 2027";
  reportingSchedule: string;
  lastReport: string;
  nextReview: string;
};

export const loanProfiles: LoanProfile[] = athletes
  .filter((a) => a.team === "Loan")
  .map((a) => {
    const p = getPathway(a.id);
    const club = p?.loanClub ?? "External club";
    return {
      athleteId: a.id,
      club,
      competition: club.includes("Kriens") ? "Challenge League" : "Challenge League",
      role: a.positionLabel,
      minutes: a.performance.minutes,
      starts: a.performance.starts,
      objective:
        a.id === "ath_022"
          ? "Consistent minutes as a central midfielder."
          : "Play consistently as a wide forward.",
      progress: a.id === "ath_023" ? "Off Track" : "On Track",
      progressNote:
        a.id === "ath_023"
          ? "Deployed off-position for 34% of minutes. Role alignment weak."
          : "Role alignment strong. Playing under senior tempo.",
      returnDecision: "Review Jan 2027",
      reportingSchedule: "Fortnightly",
      lastReport: "5 Aug 2026",
      nextReview: "20 Aug 2026",
    };
  });
