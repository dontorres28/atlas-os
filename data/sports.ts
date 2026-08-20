export type SportId = "football" | "ice-hockey" | "basketball" | "rugby";

export type SportProfile = {
  id: SportId;
  label: string;
  hint: string;
  defaultStages: string[];
  positionGroups: string[];
  integrations: string[];
  rosterTarget: number;
  /** Word used for temporary player movement */
  movementTerm: "loan" | "assignment" | "two-way";
};

export const SPORTS: SportProfile[] = [
  {
    id: "football",
    label: "Football",
    hint: "Association football / soccer",
    defaultStages: ["First Team", "U21 / B Team", "U19", "U17"],
    positionGroups: ["Goalkeepers", "Defenders", "Midfielders", "Attackers"],
    integrations: ["Transfermarkt", "WyScout", "InStat", "Comet"],
    rosterTarget: 25,
    movementTerm: "loan",
  },
  {
    id: "ice-hockey",
    label: "Ice hockey",
    hint: "Junior, professional, national",
    defaultStages: ["First Team", "Farm Team", "U20", "U18", "U16"],
    positionGroups: ["Goaltenders", "Defencemen", "Forwards"],
    integrations: ["Elite Prospects", "InStat Hockey", "HockeyDB"],
    rosterTarget: 23,
    movementTerm: "assignment",
  },
  {
    id: "basketball",
    label: "Basketball",
    hint: "Club, national team, academy",
    defaultStages: ["First Team", "Development Squad", "U18", "U16"],
    positionGroups: ["Guards", "Wings", "Bigs"],
    integrations: ["Synergy", "RealGM", "FIBA LiveStats"],
    rosterTarget: 15,
    movementTerm: "two-way",
  },
  {
    id: "rugby",
    label: "Rugby",
    hint: "Union / league",
    defaultStages: ["First XV", "Academy", "U20", "U18"],
    positionGroups: ["Forwards", "Backs"],
    integrations: ["Opta Rugby", "World Rugby DB"],
    rosterTarget: 40,
    movementTerm: "loan",
  },
];

export function sportById(id: SportId | "" | null | undefined) {
  if (!id) return undefined;
  return SPORTS.find((s) => s.id === id);
}
