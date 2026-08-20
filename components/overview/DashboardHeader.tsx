import { athletes } from "@/data/athletes";
import { getPathway } from "@/data/pathways";
import { daysBetween } from "@/lib/utils";

const TODAY = "2026-08-17";

export function DashboardHeader({
  attentionCount,
  pathwayBlockers,
  reviewsDueThisWeek,
  squadGaps,
}: {
  attentionCount: number;
  pathwayBlockers: number;
  reviewsDueThisWeek: number;
  squadGaps: number;
}) {
  return (
    <header className="atlas-enter border-b border-hairline pb-8 pt-14">
      <h1 className="text-[36px] tracking-tightish text-white md:text-[42px]">
        First Team, Season 2026–27
      </h1>
      <p className="meta mt-4 max-w-[80ch] text-[13px] text-bone-300">
        What requires a sporting decision right now.
      </p>

      <dl className="mt-12 grid grid-cols-2 md:grid-cols-4">
        <State k="Decisions require attention" v={attentionCount} tone={attentionCount ? "accent" : "muted"} />
        <State k="Pathway blockers" v={pathwayBlockers} tone={pathwayBlockers ? "accent" : "muted"} />
        <State k="Reviews due this week" v={reviewsDueThisWeek} tone={reviewsDueThisWeek ? "accent" : "muted"} />
        <State k="Projected squad gaps" v={squadGaps} tone={squadGaps ? "accent" : "muted"} last />
      </dl>
    </header>
  );
}

function State({
  k,
  v,
  tone,
  last,
}: {
  k: string;
  v: number;
  tone: "accent" | "muted";
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-between gap-6 py-5 md:py-0 md:pl-6 ${
        last ? "" : "md:border-r md:border-hairline"
      } ${last ? "md:pr-0" : "md:pr-6"}`}
    >
      <div className="flex items-baseline gap-3">
        <span className={`display text-[44px] ${tone === "accent" ? "text-white" : "text-bone-500"}`}>
          {v}
        </span>
      </div>
      <div className="text-[12px] uppercase tracking-[0.18em] text-bone-400">
        {k}
      </div>
    </div>
  );
}

export function computeDashboardMetrics(reviewsInStore: number) {
  const attention = athletes.filter((a) => a.attention).length;
  const blockers = athletes
    .map((a) => getPathway(a.id))
    .filter((p) => p && (p.status === "Blocked" || p.status === "At Risk")).length;
  const reviewsDueThisWeek = athletes.filter((a) => {
    if (!a.lastReviewDate) return false;
    const next = new Date(a.lastReviewDate);
    next.setUTCMonth(next.getUTCMonth() + 3);
    const days = daysBetween(TODAY, next.toISOString().slice(0, 10));
    return days >= 0 && days <= 7;
  }).length;
  // rough gap projection based on First Team position counts vs targets
  const targets = { GK: 2, CB: 4, FB: 4, CM: 6, FW: 5 };
  const groups = athletes
    .filter((a) => a.team === "First Team")
    .reduce<Record<string, number>>((acc, a) => {
      const g =
        a.position === "GK"
          ? "GK"
          : a.position === "CB"
            ? "CB"
            : a.position === "LB" || a.position === "RB"
              ? "FB"
              : a.position === "DM" || a.position === "CM" || a.position === "AM"
                ? "CM"
                : "FW";
      acc[g] = (acc[g] ?? 0) + 1;
      return acc;
    }, {});
  const gaps = Object.entries(targets).filter(
    ([g, need]) => (groups[g] ?? 0) < need,
  ).length;
  return { attention, blockers, reviewsDueThisWeek, gaps };
}
