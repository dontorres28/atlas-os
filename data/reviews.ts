import type { Review } from "@/lib/types";

export const seedReviews: Review[] = [
  {
    id: "rev_001",
    athleteId: "ath_001",
    date: "2026-08-12",
    reviewer: "Technical Director",
    cycleId: "cyc_c01",
    assessment:
      "Strong progression into senior football. Defensive positioning remains the primary development priority.",
    developmentPriority: "Progressive passing under pressure",
    nextReviewDate: "2026-11-12",
  },
  {
    id: "rev_002",
    athleteId: "ath_002",
    date: "2026-08-14",
    reviewer: "Head of Performance",
    cycleId: "cyc_c01",
    assessment:
      "Sustaining high output. Chance creation profile intact; expect a step in xA over the next window.",
    developmentPriority: "Chance creation from half-spaces",
    nextReviewDate: "2026-11-14",
  },
  {
    id: "rev_003",
    athleteId: "ath_005",
    date: "2026-08-01",
    reviewer: "Technical Director",
    cycleId: "cyc_c01",
    assessment:
      "Reduced availability and dip in build-up efficiency. Contract discussion needs to precede the winter window.",
    developmentPriority: "Recovery workload management",
    nextReviewDate: "2026-10-01",
  },
  {
    id: "rev_004",
    athleteId: "ath_013",
    date: "2026-08-08",
    reviewer: "Academy Director",
    cycleId: "cyc_c02",
    assessment:
      "Ready for exposure to First Team training sessions on a scheduled basis. Retain U21 match minutes.",
    developmentPriority: "Adaptation to senior tempo",
    nextReviewDate: "2026-11-08",
  },
  {
    id: "rev_005",
    athleteId: "ath_016",
    date: "2026-08-04",
    reviewer: "Academy Director",
    cycleId: "cyc_c02",
    assessment:
      "First-contact positioning has improved through preseason. Ready for First Team CB rotation trial when squad allows.",
    developmentPriority: "Body positioning at first contact",
    nextReviewDate: "2026-11-04",
  },
];
