import type { CycleAthleteState, SportingCycle } from "@/lib/types";
import { athletes } from "./athletes";

function ids(filter: (a: (typeof athletes)[number]) => boolean) {
  return athletes.filter(filter).map((a) => a.id);
}

const firstTeamIds = ids((a) => a.team === "First Team");
const academyIds = ids((a) => a.team === "U19" || a.team === "U21");
const loanIds = ids((a) => a.team === "Loan");
const contractIds = ids((a) => {
  const y = parseInt(a.contract.expiry.slice(0, 4), 10);
  return y <= 2027;
});

export const seedCycles: SportingCycle[] = [
  {
    id: "cyc_c01",
    code: "C-01",
    name: "Preseason Squad Review",
    type: "Preseason Squad Review",
    season: "2026–27",
    monthLabel: "AUGUST",
    monthOrder: 8,
    yearOrder: 202608,
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    owner: "Technical Director",
    participants: [
      "Sporting Director",
      "Technical Director",
      "Head Coach",
      "Head of Performance",
    ],
    status: "Active",
    scope: `First Team, ${firstTeamIds.length} athletes`,
    objectives: [
      "Confirm First Team pathway status for each squad member.",
      "Identify contract, pathway and role decisions before the transfer window closes.",
      "Establish first review baseline for the season.",
    ],
    athleteIds: firstTeamIds,
  },
  {
    id: "cyc_c02",
    code: "C-02",
    name: "Academy Pathway Review",
    type: "Academy Pathway Review",
    season: "2026–27",
    monthLabel: "SEPTEMBER",
    monthOrder: 9,
    yearOrder: 202609,
    startDate: "2026-09-07",
    endDate: "2026-09-30",
    owner: "Academy Director",
    participants: [
      "Academy Director",
      "Technical Director",
      "Head of Performance",
    ],
    status: "Planned",
    scope: `U19 to B Team, ${academyIds.length} athletes`,
    objectives: [
      "Identify U19 athletes ready to train with U21 or B Team on a scheduled basis.",
      "Align on individual development objectives for the season.",
    ],
    athleteIds: academyIds,
  },
  {
    id: "cyc_c03",
    code: "C-03",
    name: "Loan Review",
    type: "Loan Review",
    season: "2026–27",
    monthLabel: "OCTOBER",
    monthOrder: 10,
    yearOrder: 202610,
    startDate: "2026-10-05",
    endDate: "2026-10-30",
    owner: "Loan Manager",
    participants: ["Loan Manager", "Technical Director", "Sporting Director"],
    status: "Planned",
    scope: `Loan players, ${loanIds.length} athletes`,
    objectives: [
      "Assess role alignment vs. individual development objective for every loan.",
      "Determine which loans continue, recall or terminate at the winter window.",
    ],
    athleteIds: loanIds,
  },
  {
    id: "cyc_c04",
    code: "C-04",
    name: "Contract Review",
    type: "Contract Review",
    season: "2026–27",
    monthLabel: "NOVEMBER",
    monthOrder: 11,
    yearOrder: 202611,
    startDate: "2026-11-02",
    endDate: "2026-11-30",
    owner: "Sporting Director",
    participants: ["Sporting Director", "Technical Director"],
    status: "Planned",
    scope: `${contractIds.length} decisions due`,
    objectives: [
      "Reach a decision on every contract expiring within 12 months.",
      "Align renewals with the 2027–28 squad plan.",
    ],
    athleteIds: contractIds,
  },
  {
    id: "cyc_c05",
    code: "C-05",
    name: "Winter Sporting Review",
    type: "Winter Sporting Review",
    season: "2026–27",
    monthLabel: "JANUARY",
    monthOrder: 1,
    yearOrder: 202701,
    startDate: "2027-01-05",
    endDate: "2027-01-31",
    owner: "Sporting Director",
    participants: [
      "Sporting Director",
      "Technical Director",
      "Head Coach",
      "Academy Director",
    ],
    status: "Planned",
    scope: "First Team and Academy together",
    objectives: [
      "Review autumn decisions and outcomes.",
      "Recalibrate individual development objectives for the second half of the season.",
    ],
    athleteIds: [...firstTeamIds, ...academyIds],
  },
  {
    id: "cyc_c06",
    code: "C-06",
    name: "Recruitment Planning",
    type: "Recruitment Planning",
    season: "2026–27",
    monthLabel: "MARCH",
    monthOrder: 3,
    yearOrder: 202703,
    startDate: "2027-03-02",
    endDate: "2027-03-31",
    owner: "Sporting Director",
    participants: [
      "Sporting Director",
      "Head of Recruitment",
      "Technical Director",
    ],
    status: "Planned",
    scope: "Structural gaps for 2027–28",
    objectives: [
      "Convert squad plan gaps into recruitment briefs.",
      "Test each brief against internal options first.",
    ],
    athleteIds: [],
  },
  {
    id: "cyc_c07",
    code: "C-07",
    name: "End of Season Review",
    type: "End of Season Review",
    season: "2027–28",
    monthLabel: "MAY",
    monthOrder: 5,
    yearOrder: 202705,
    startDate: "2027-05-03",
    endDate: "2027-05-31",
    owner: "Sporting Director",
    participants: [
      "Sporting Director",
      "Technical Director",
      "Head Coach",
      "Head of Performance",
      "Academy Director",
    ],
    status: "Planned",
    scope: "Whole squad, Academy, and every loan",
    objectives: [
      "Assess whether the season's sporting decisions produced their expected outcomes.",
      "Set the direction for the 2027–28 squad plan.",
    ],
    athleteIds: [...firstTeamIds, ...academyIds, ...loanIds],
  },
];

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Per-athlete review schedule: distribute due dates across each cycle window.
export const seedCycleStates: CycleAthleteState[] = seedCycles.flatMap((c) => {
  return c.athleteIds.map((athleteId, i) => ({
    cycleId: c.id,
    athleteId,
    reviewDueDate: addDays(c.startDate, Math.min(i * 2, 24)),
  }));
});

export function getCycle(id: string) {
  return seedCycles.find((c) => c.id === id);
}

export function cyclesForAthlete(athleteId: string) {
  return seedCycles.filter((c) => c.athleteIds.includes(athleteId));
}

export function cycleStatesFor(cycleId: string) {
  return seedCycleStates.filter((s) => s.cycleId === cycleId);
}

export function cycleStateFor(cycleId: string, athleteId: string) {
  return seedCycleStates.find(
    (s) => s.cycleId === cycleId && s.athleteId === athleteId,
  );
}
