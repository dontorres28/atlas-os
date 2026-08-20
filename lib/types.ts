export type Position =
  | "GK"
  | "RB"
  | "LB"
  | "CB"
  | "DM"
  | "CM"
  | "AM"
  | "RW"
  | "LW"
  | "CF";

export type PositionGroup = "Goalkeepers" | "Defenders" | "Midfielders" | "Attackers";

export type SquadTeam = "First Team" | "U21" | "U19" | "Loan";

export type PathwayStage =
  | "Prospect"
  | "Progressing"
  | "Core"
  | "Established"
  | "Transition";

export type SquadStatus =
  | "First Team"
  | "U21"
  | "U19"
  | "Loan"
  | "Injured"
  | "International Duty";

export type DecisionArea = "Contract" | "Pathway" | "Development" | "Role" | "Loan";

export type DecisionStatus =
  | "Pending"
  | "Active"
  | "Confirmed"
  | "Deferred"
  | "Rejected"
  | "Closed";

export interface PerformanceMetrics {
  minutes: number;
  starts: number;
  availabilityPct: number;
  trendPct: number;
}

export interface Contract {
  expiry: string;
  extensionOption?: boolean;
}

export interface Review {
  id: string;
  athleteId: string;
  date: string;
  reviewer: string;
  assessment: string;
  developmentPriority: string;
  nextReviewDate?: string;
  cycleId?: string;
}

export interface DecisionOutcome {
  actual: string;
  verdict: "Achieved" | "Partially Achieved" | "Not Achieved";
  recordedAt: string;
  evidence?: string;
}

export interface Decision {
  id: string;
  code: string; // "028"
  athleteId: string;
  area: DecisionArea;
  summary: string;
  rationale?: string;
  owner: string;
  date: string;
  expectedOutcome?: string;
  reviewDate?: string;
  cycleId?: string;
  outcome?: DecisionOutcome;
  status: DecisionStatus;
}

export interface DevelopmentObjective {
  id: string;
  athleteId: string;
  objective: string;
  why?: string;
  target?: string;
  setDate: string;
  reviewDate?: string;
}

export interface PathwayTimelineEntry {
  season: string;
  team: SquadTeam | "U19" | "U21";
  note?: string;
}

// New pathway model

export interface PathwayStageDef {
  id: string;
  key: string;
  label: string;
  order: number;
  isSenior?: boolean;
}

export type PathwayReadiness = "Ready" | "On Track" | "Blocked" | "At Risk";
export type PathwayConfidence = "High" | "Medium" | "Low";

export interface AthletePathway {
  athleteId: string;
  currentStageId: string;
  nextStageId?: string;
  onLoan?: boolean;
  loanClub?: string;
  status: PathwayReadiness;
  confidence: PathwayConfidence;
  nextStepSummary: string;
  blocker?: string;
  history: { stageId: string; season: string; year: number; note?: string }[];
}

// Sporting cycle model

export type CycleType =
  | "Preseason Squad Review"
  | "Winter Sporting Review"
  | "End of Season Review"
  | "Loan Review"
  | "Academy Pathway Review"
  | "Contract Review"
  | "Recruitment Planning"
  | "Individual Development Review";

export type CycleStatus = "Planned" | "Active" | "Overdue" | "Closed";

export interface SportingCycle {
  id: string;
  code: string; // "C-04"
  name: string;
  type: CycleType;
  season: string; // "2026 / 27"
  monthLabel: string; // "AUGUST"
  monthOrder: number; // 8..
  yearOrder: number; // sortable YYYYMM
  startDate: string;
  endDate: string;
  owner: string;
  participants: string[];
  status: CycleStatus;
  scope: string;
  objectives: string[];
  athleteIds: string[];
}

export interface CycleAthleteState {
  cycleId: string;
  athleteId: string;
  reviewDueDate: string;
}

// Athlete

export interface Athlete {
  id: string;
  code: string;
  name: string;
  age: number;
  dateOfBirth: string;
  nationality: string;
  height: number;
  preferredFoot: "Right" | "Left" | "Both";
  position: Position;
  positionLabel: string;
  positionGroup: PositionGroup;
  team: SquadTeam;
  status: SquadStatus;
  pathwayStage: PathwayStage;
  contract: Contract;
  lastReviewDate?: string;
  performance: PerformanceMetrics;
  developmentPriority: string;
  developmentTimeline: PathwayTimelineEntry[];
  role: string;
  loanStatus?: string;
  attention?: {
    kind: "Contract" | "Pathway" | "Performance" | "Availability";
    note: string;
  };
}
