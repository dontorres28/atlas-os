import type { Athlete, PathwayEntry, Position, PositionGroup, SquadStatus, SquadTeam, PathwayStage } from "@/lib/types";

function positionGroupOf(p: Position): PositionGroup {
  if (p === "GK") return "Goalkeepers";
  if (["RB", "LB", "CB"].includes(p)) return "Defenders";
  if (["DM", "CM", "AM"].includes(p)) return "Midfielders";
  return "Attackers";
}

function labelOf(p: Position): string {
  return {
    GK: "Goalkeeper",
    RB: "Right Back",
    LB: "Left Back",
    CB: "Centre Back",
    DM: "Defensive Midfielder",
    CM: "Central Midfielder",
    AM: "Attacking Midfielder",
    RW: "Right Winger",
    LW: "Left Winger",
    CF: "Centre Forward",
  }[p];
}

type Seed = {
  name: string;
  age: number;
  dob: string;
  nat: string;
  height: number;
  foot: "Right" | "Left" | "Both";
  position: Position;
  team: SquadTeam;
  status: SquadStatus;
  pathway: PathwayStage;
  contract: string;
  extension?: boolean;
  lastReview?: string;
  minutes: number;
  starts: number;
  availability: number;
  trend: number;
  devPriority: string;
  role: string;
  loanStatus?: string;
  attention?: Athlete["attention"];
  timeline: PathwayEntry[];
};

const SEED: Seed[] = [
  // FIRST TEAM
  {
    name: "Luca Meier", age: 22, dob: "2003-11-14", nat: "Switzerland", height: 187, foot: "Right",
    position: "CB", team: "First Team", status: "First Team", pathway: "Core",
    contract: "2028-06-30", lastReview: "2026-08-12",
    minutes: 1842, starts: 21, availability: 94, trend: 8,
    devPriority: "Progressive passing under pressure",
    role: "Ball-playing centre back",
    attention: { kind: "Pathway", note: "U21 → First Team confirmation" },
    timeline: [
      { season: "2023/24", team: "U19" },
      { season: "2024/25", team: "U21" },
      { season: "2025/26", team: "First Team" },
      { season: "2026/27", team: "First Team" },
    ],
  },
  {
    name: "Noah Keller", age: 24, dob: "2001-07-09", nat: "Switzerland", height: 179, foot: "Right",
    position: "LW", team: "First Team", status: "First Team", pathway: "Established",
    contract: "2029-06-30", lastReview: "2026-08-14",
    minutes: 2104, starts: 24, availability: 96, trend: 4,
    devPriority: "Chance creation from half-spaces",
    role: "Inverted winger",
    timeline: [
      { season: "2022/23", team: "U21" },
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Elias Roth", age: 29, dob: "1996-02-22", nat: "Switzerland", height: 191, foot: "Right",
    position: "GK", team: "First Team", status: "First Team", pathway: "Established",
    contract: "2027-06-30", lastReview: "2026-07-30",
    minutes: 2610, starts: 29, availability: 100, trend: 2,
    devPriority: "Distribution range under press",
    role: "Sweeper keeper",
    timeline: [
      { season: "2022/23", team: "First Team" },
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Matteo Ferrari", age: 27, dob: "1998-05-01", nat: "Italy", height: 184, foot: "Right",
    position: "CB", team: "First Team", status: "First Team", pathway: "Established",
    contract: "2027-06-30", lastReview: "2026-08-04",
    minutes: 2380, starts: 27, availability: 97, trend: 1,
    devPriority: "Aerial recovery in transition",
    role: "Defensive leader",
    timeline: [
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Andreas Vogt", age: 31, dob: "1994-09-18", nat: "Germany", height: 182, foot: "Right",
    position: "DM", team: "First Team", status: "First Team", pathway: "Transition",
    contract: "2026-06-30", lastReview: "2026-08-01",
    minutes: 1520, starts: 17, availability: 88, trend: -6,
    devPriority: "Recovery workload management",
    role: "Deep-lying playmaker",
    attention: { kind: "Contract", note: "Decision window: 42 days" },
    timeline: [
      { season: "2022/23", team: "First Team" },
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Rafael Marques", age: 26, dob: "1999-03-11", nat: "Portugal", height: 178, foot: "Left",
    position: "LB", team: "First Team", status: "International Duty", pathway: "Established",
    contract: "2028-06-30", lastReview: "2026-07-22",
    minutes: 2210, starts: 25, availability: 92, trend: 3,
    devPriority: "Underlapping timing",
    role: "Progressive full back",
    timeline: [
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Jonas Bergstrom", age: 25, dob: "2000-12-04", nat: "Sweden", height: 181, foot: "Right",
    position: "RB", team: "First Team", status: "First Team", pathway: "Established",
    contract: "2027-06-30", lastReview: "2026-08-07",
    minutes: 2000, starts: 23, availability: 91, trend: 0,
    devPriority: "Defensive one-v-one composure",
    role: "Attacking full back",
    timeline: [
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Kai Hoffmann", age: 28, dob: "1997-01-27", nat: "Germany", height: 183, foot: "Right",
    position: "CM", team: "First Team", status: "Injured", pathway: "Established",
    contract: "2027-06-30", lastReview: "2026-07-01",
    minutes: 1200, starts: 13, availability: 62, trend: -12,
    devPriority: "Return to full training load",
    role: "Box-to-box midfielder",
    attention: { kind: "Availability", note: "Medium-term injury (hamstring)" },
    timeline: [
      { season: "2022/23", team: "First Team" },
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Sami Aden", age: 23, dob: "2002-06-16", nat: "Denmark", height: 174, foot: "Right",
    position: "AM", team: "First Team", status: "First Team", pathway: "Core",
    contract: "2028-06-30", lastReview: "2026-08-11",
    minutes: 1980, starts: 22, availability: 95, trend: 11,
    devPriority: "Turn-and-drive in the final third",
    role: "Between-the-lines creator",
    timeline: [
      { season: "2023/24", team: "U21" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Owen Blake", age: 26, dob: "1999-10-08", nat: "England", height: 189, foot: "Right",
    position: "CF", team: "First Team", status: "First Team", pathway: "Established",
    contract: "2027-06-30", lastReview: "2026-08-05",
    minutes: 2300, starts: 26, availability: 93, trend: 6,
    devPriority: "Link play efficiency",
    role: "Target centre forward",
    timeline: [
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Tobias Lang", age: 30, dob: "1995-04-29", nat: "Austria", height: 186, foot: "Right",
    position: "CB", team: "First Team", status: "First Team", pathway: "Transition",
    contract: "2026-06-30", lastReview: "2026-07-18",
    minutes: 1600, starts: 18, availability: 84, trend: -3,
    devPriority: "Positional discipline in a back four",
    role: "Experienced centre back",
    attention: { kind: "Contract", note: "Expires end of season" },
    timeline: [
      { season: "2022/23", team: "First Team" },
      { season: "2023/24", team: "First Team" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "First Team" },
    ],
  },
  {
    name: "Ilias Karim", age: 21, dob: "2004-08-19", nat: "Morocco", height: 176, foot: "Left",
    position: "RW", team: "First Team", status: "First Team", pathway: "Progressing",
    contract: "2027-06-30", lastReview: "2026-08-09",
    minutes: 1120, starts: 10, availability: 90, trend: 14,
    devPriority: "Consistency across a full match",
    role: "Dribble-carrier",
    timeline: [
      { season: "2023/24", team: "U19" },
      { season: "2024/25", team: "U21" },
      { season: "2025/26", team: "First Team" },
    ],
  },

  // U21
  {
    name: "Daniel Costa", age: 19, dob: "2006-05-02", nat: "Portugal", height: 180, foot: "Right",
    position: "CM", team: "U21", status: "U21", pathway: "Progressing",
    contract: "2027-06-30", lastReview: "2026-08-08",
    minutes: 1580, starts: 19, availability: 96, trend: 9,
    devPriority: "Adaptation to senior tempo",
    role: "Ball-carrying eight",
    attention: { kind: "Pathway", note: "First Team training integration" },
    timeline: [
      { season: "2023/24", team: "U19" },
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U21" },
    ],
  },
  {
    name: "Finn Andersen", age: 20, dob: "2005-02-14", nat: "Norway", height: 190, foot: "Right",
    position: "GK", team: "U21", status: "U21", pathway: "Progressing",
    contract: "2027-06-30", lastReview: "2026-07-25",
    minutes: 1710, starts: 19, availability: 97, trend: 5,
    devPriority: "Command of penalty area",
    role: "Modern goalkeeper",
    timeline: [
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U21" },
    ],
  },
  {
    name: "Emre Yildiz", age: 18, dob: "2007-01-06", nat: "Türkiye", height: 177, foot: "Left",
    position: "LW", team: "U21", status: "U21", pathway: "Prospect",
    contract: "2028-06-30", lastReview: "2026-08-02",
    minutes: 1240, starts: 14, availability: 93, trend: 7,
    devPriority: "Decision making in final third",
    role: "One-v-one wide forward",
    timeline: [
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U21" },
    ],
  },
  {
    name: "Mattia Rossi", age: 20, dob: "2005-09-27", nat: "Italy", height: 185, foot: "Right",
    position: "CB", team: "U21", status: "U21", pathway: "Progressing",
    contract: "2027-06-30", lastReview: "2026-07-28",
    minutes: 1500, starts: 18, availability: 100, trend: 6,
    devPriority: "Body positioning at first contact",
    role: "Front-foot defender",
    timeline: [
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U21" },
    ],
  },

  // U19
  {
    name: "Leo Fischer", age: 17, dob: "2008-03-30", nat: "Switzerland", height: 172, foot: "Right",
    position: "AM", team: "U19", status: "U19", pathway: "Prospect",
    contract: "2027-06-30", lastReview: "2026-07-19",
    minutes: 1100, starts: 13, availability: 100, trend: 12,
    devPriority: "Physical development",
    role: "Playmaking ten",
    timeline: [
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U19" },
    ],
  },
  {
    name: "Alessio Bianchi", age: 17, dob: "2008-06-11", nat: "Italy", height: 175, foot: "Right",
    position: "CM", team: "U19", status: "U19", pathway: "Prospect",
    contract: "2027-06-30", lastReview: "2026-07-14",
    minutes: 990, starts: 12, availability: 98, trend: 4,
    devPriority: "Defensive reading",
    role: "Deep midfielder",
    timeline: [
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U19" },
    ],
  },
  {
    name: "Julien Moreau", age: 18, dob: "2007-11-01", nat: "France", height: 168, foot: "Left",
    position: "RB", team: "U19", status: "U19", pathway: "Prospect",
    contract: "2027-06-30", lastReview: "2026-07-10",
    minutes: 1020, starts: 12, availability: 95, trend: 3,
    devPriority: "Defensive positioning without ball",
    role: "Overlapping full back",
    timeline: [
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U19" },
    ],
  },
  {
    name: "Hugo Novak", age: 17, dob: "2008-08-08", nat: "Czechia", height: 188, foot: "Right",
    position: "CF", team: "U19", status: "U19", pathway: "Prospect",
    contract: "2028-06-30", lastReview: "2026-07-05",
    minutes: 940, starts: 11, availability: 100, trend: 10,
    devPriority: "Movement in the box",
    role: "Poacher",
    attention: { kind: "Pathway", note: "U21 trial window opening" },
    timeline: [
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U19" },
    ],
  },
  {
    name: "Diego Alonso", age: 18, dob: "2007-04-21", nat: "Spain", height: 173, foot: "Right",
    position: "DM", team: "U19", status: "U19", pathway: "Progressing",
    contract: "2027-06-30", lastReview: "2026-07-03",
    minutes: 1180, starts: 14, availability: 94, trend: 5,
    devPriority: "Tempo control",
    role: "Rondo six",
    timeline: [
      { season: "2023/24", team: "U19" },
      { season: "2024/25", team: "U19" },
      { season: "2025/26", team: "U19" },
    ],
  },

  // LOAN
  {
    name: "Marco Weber", age: 22, dob: "2003-01-24", nat: "Switzerland", height: 182, foot: "Right",
    position: "CM", team: "Loan", status: "Loan", pathway: "Progressing",
    contract: "2027-06-30", lastReview: "2026-06-28",
    minutes: 1750, starts: 20, availability: 96, trend: 7,
    devPriority: "Senior league minutes",
    role: "Box-to-box loanee",
    loanStatus: "On loan at SC Kriens for 2025–26",
    timeline: [
      { season: "2023/24", team: "U21" },
      { season: "2024/25", team: "First Team" },
      { season: "2025/26", team: "Loan" },
    ],
  },
  {
    name: "Ryan O'Connell", age: 21, dob: "2004-10-05", nat: "Ireland", height: 176, foot: "Left",
    position: "LW", team: "Loan", status: "Loan", pathway: "Progressing",
    contract: "2027-06-30", lastReview: "2026-06-15",
    minutes: 1400, starts: 16, availability: 91, trend: 2,
    devPriority: "End product",
    role: "Wide forward",
    loanStatus: "On loan at FC Vaduz for 2025–26",
    attention: { kind: "Performance", note: "Loan review overdue" },
    timeline: [
      { season: "2023/24", team: "U19" },
      { season: "2024/25", team: "U21" },
      { season: "2025/26", team: "Loan" },
    ],
  },
];

export const athletes: Athlete[] = SEED.map((s, i) => ({
  id: `ath_${String(i + 1).padStart(3, "0")}`,
  code: String(i + 1).padStart(3, "0"),
  name: s.name,
  age: s.age,
  dateOfBirth: s.dob,
  nationality: s.nat,
  height: s.height,
  preferredFoot: s.foot,
  position: s.position,
  positionLabel: labelOf(s.position),
  positionGroup: positionGroupOf(s.position),
  team: s.team,
  status: s.status,
  pathwayStage: s.pathway,
  contract: { expiry: s.contract, extensionOption: s.extension },
  lastReviewDate: s.lastReview,
  performance: {
    minutes: s.minutes,
    starts: s.starts,
    availabilityPct: s.availability,
    trendPct: s.trend,
  },
  developmentPriority: s.devPriority,
  developmentTimeline: s.timeline,
  role: s.role,
  loanStatus: s.loanStatus,
  attention: s.attention,
}));

export function getAthlete(id: string) {
  return athletes.find((a) => a.id === id);
}
