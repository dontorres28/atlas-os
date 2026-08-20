import { athletes } from "./athletes";
import { athletePathways } from "./pathways";

type PositionRow = {
  key: string;
  label: string;
  positions: string[];
  required: number;
};

export const POSITION_PLAN: PositionRow[] = [
  { key: "GK", label: "Goalkeepers", positions: ["GK"], required: 2 },
  { key: "CB", label: "Centre Backs", positions: ["CB"], required: 4 },
  { key: "FB", label: "Full Backs", positions: ["RB", "LB"], required: 4 },
  { key: "CM", label: "Midfielders", positions: ["DM", "CM", "AM"], required: 6 },
  { key: "WING", label: "Wingers", positions: ["LW", "RW"], required: 3 },
  { key: "ST", label: "Forwards", positions: ["CF"], required: 2 },
];

export type Gap =
  | { key: string; label: string; required: number; projected: number; pathway: number; gap: number; state: "GAP" | "BALANCED" | "SURPLUS" };

export function projectedRoster(): Gap[] {
  return POSITION_PLAN.map((p) => {
    // Players still under contract into 2027–28
    const projected = athletes.filter(
      (a) =>
        p.positions.includes(a.position) &&
        a.team !== "U19" &&
        new Date(a.contract.expiry).getUTCFullYear() >= 2027,
    ).length;

    // Ready academy candidates who could step up
    const pathway = athletePathways.filter((ap) => {
      const a = athletes.find((x) => x.id === ap.athleteId);
      if (!a) return false;
      return (
        p.positions.includes(a.position) &&
        ap.status === "Ready" &&
        ap.nextStageId === "first-team"
      );
    }).length;

    const totalAvailable = projected + pathway;
    const gap = p.required - totalAvailable;
    const state: Gap["state"] =
      gap > 0 ? "GAP" : gap < 0 ? "SURPLUS" : "BALANCED";

    return {
      key: p.key,
      label: p.label,
      required: p.required,
      projected,
      pathway,
      gap,
      state,
    };
  });
}
