export type MemoryEvent = {
  id: string;
  year: number;
  date: string;
  kind: "Decision" | "Review" | "Methodology" | "Pathway" | "Season";
  title: string;
  detail: string;
  href?: string;
};

export const memoryEvents: MemoryEvent[] = [
  {
    id: "m_2026_09",
    year: 2026,
    date: "12 Aug 2026",
    kind: "Decision",
    title: "Promote Luca Meier to First Team",
    detail:
      "Player reached the required defensive threshold. Exposed to senior minutes ahead of a full B Team season.",
    href: "/decisions/dec_001",
  },
  {
    id: "m_2026_08",
    year: 2026,
    date: "08 Aug 2026",
    kind: "Decision",
    title: "Integrate Daniel Costa into First Team training",
    detail: "Two sessions per week while retaining U21 rhythm.",
    href: "/decisions/dec_005",
  },
  {
    id: "m_2026_07",
    year: 2026,
    date: "01 Aug 2026",
    kind: "Decision",
    title: "Open Andreas Vogt contract window",
    detail:
      "Availability trended below 90% for the second season. Renewal position needed before November cycle.",
    href: "/decisions/dec_004",
  },
  {
    id: "m_2025_09",
    year: 2025,
    date: "20 May 2025",
    kind: "Decision",
    title: "Promote Luca Meier from U21 to B Team",
    detail:
      "End of season review flagged readiness for competitive senior minutes. Outcome: Achieved (17 appearances).",
    href: "/decisions/dec_006",
  },
  {
    id: "m_2025_08",
    year: 2025,
    date: "10 Feb 2025",
    kind: "Methodology",
    title: "First Team readiness framework updated",
    detail:
      "New position-specific dimensions rolled out for defenders and midfielders.",
  },
  {
    id: "m_2024_09",
    year: 2024,
    date: "12 Jun 2024",
    kind: "Decision",
    title: "Extend Luca Meier's individual development plan",
    detail:
      "Physical readiness not yet at First Team threshold. Outcome: Achieved (Level 4 reached March 2025).",
    href: "/decisions/dec_007",
  },
  {
    id: "m_2024_08",
    year: 2024,
    date: "01 May 2024",
    kind: "Pathway",
    title: "Academy pathway expanded",
    detail:
      "Added a U17 to U19 transition programme. Two additional structured evaluation windows per season.",
  },
  {
    id: "m_2024_07",
    year: 2024,
    date: "20 Apr 2024",
    kind: "Season",
    title: "2023 / 24 season review closed",
    detail:
      "12 sporting decisions recorded across the season. 9 met expected outcome by end of window.",
  },
];
