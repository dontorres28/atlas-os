export type Dimension = {
  key: string;
  label: string;
  definition: string;
  /** Threshold level required for First Team readiness (1–5). */
  requiredLevel: number;
};

export type PositionMethodology = {
  key: string;
  label: string;
  positions: string[];
  dimensions: Dimension[];
};

export const METHODOLOGY: PositionMethodology[] = [
  {
    key: "gk",
    label: "Goalkeepers",
    positions: ["GK"],
    dimensions: [
      {
        key: "distribution",
        label: "Distribution under pressure",
        definition:
          "The keeper's ability to keep possession under high press and initiate build-up cleanly.",
        requiredLevel: 4,
      },
      {
        key: "command",
        label: "Command of the box",
        definition:
          "Presence on crosses and set pieces. Clear communication with the back line.",
        requiredLevel: 4,
      },
      {
        key: "shot-stopping",
        label: "Shot stopping",
        definition:
          "Save percentage adjusted for chance quality. Reflexes and positioning.",
        requiredLevel: 4,
      },
      {
        key: "sweeper",
        label: "Sweeper actions",
        definition:
          "Willingness and quality of proactive defensive actions outside the six-yard box.",
        requiredLevel: 3,
      },
    ],
  },
  {
    key: "cb",
    label: "Centre Backs",
    positions: ["CB"],
    dimensions: [
      {
        key: "defensive-positioning",
        label: "Defensive positioning",
        definition:
          "Reading of the game without the ball. Body shape at first contact.",
        requiredLevel: 4,
      },
      {
        key: "progressive-passing",
        label: "Progressive passing",
        definition:
          "Ability to break lines with pass selection under pressure.",
        requiredLevel: 4,
      },
      {
        key: "1v1",
        label: "1v1 defending",
        definition:
          "Duels won in isolated defensive situations. Timing of the challenge.",
        requiredLevel: 4,
      },
      {
        key: "aerial",
        label: "Aerial defending",
        definition:
          "Wins in the air on defensive set pieces and open play.",
        requiredLevel: 4,
      },
      {
        key: "line-management",
        label: "Line management",
        definition:
          "Holding the back line and controlling the offside trap.",
        requiredLevel: 3,
      },
    ],
  },
  {
    key: "fb",
    label: "Full Backs",
    positions: ["RB", "LB"],
    dimensions: [
      {
        key: "1v1-defend",
        label: "1v1 defending",
        definition: "Isolated duels against wide forwards.",
        requiredLevel: 4,
      },
      {
        key: "underlap",
        label: "Underlap timing",
        definition:
          "Reading when to arrive in central pockets to support attack.",
        requiredLevel: 3,
      },
      {
        key: "cross-quality",
        label: "Cross quality",
        definition: "Deliveries into the box and set-piece service.",
        requiredLevel: 3,
      },
      {
        key: "recovery",
        label: "Recovery running",
        definition:
          "Tracking back into position after joining the attack.",
        requiredLevel: 4,
      },
    ],
  },
  {
    key: "cm",
    label: "Midfielders",
    positions: ["DM", "CM", "AM"],
    dimensions: [
      {
        key: "tempo",
        label: "Tempo control",
        definition:
          "Setting the pace of possession. When to accelerate, when to hold.",
        requiredLevel: 4,
      },
      {
        key: "decision-making",
        label: "Decision making",
        definition:
          "Choice of pass under time and space pressure.",
        requiredLevel: 4,
      },
      {
        key: "press-resistance",
        label: "Press resistance",
        definition:
          "Retaining the ball when pressed from multiple angles.",
        requiredLevel: 4,
      },
      {
        key: "workload",
        label: "Repeat workload",
        definition:
          "Physical output sustained across 90 minutes and match congestion.",
        requiredLevel: 4,
      },
    ],
  },
  {
    key: "fw",
    label: "Attackers",
    positions: ["RW", "LW", "CF"],
    dimensions: [
      {
        key: "1v1-attack",
        label: "1v1 attacking",
        definition:
          "Beating defenders in isolated wide or central situations.",
        requiredLevel: 4,
      },
      {
        key: "chance-creation",
        label: "Chance creation",
        definition:
          "Producing high-quality opportunities from the final third.",
        requiredLevel: 4,
      },
      {
        key: "movement",
        label: "Off-ball movement",
        definition:
          "Runs that disrupt defensive lines and create separation.",
        requiredLevel: 4,
      },
      {
        key: "final-third",
        label: "Final-third decision making",
        definition:
          "Shoot / pass / hold under pressure inside the final third.",
        requiredLevel: 4,
      },
      {
        key: "counterpress",
        label: "Counter-pressing",
        definition:
          "Immediate reaction after loss of possession in the attacking third.",
        requiredLevel: 3,
      },
    ],
  },
];
