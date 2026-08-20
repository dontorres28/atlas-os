"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAtlas } from "@/data/store";
import { athletePathways } from "@/data/pathways";
import { seedCycles, cycleStatesFor } from "@/data/cycles";
import { useRoster } from "@/data/use-roster";
import { useUserStore } from "@/data/user-store";
import { StateDot } from "@/components/ui/StateDot";

const TODAY = "2026-08-17";

type Tone = "accent" | "rose" | "amber" | "moss" | "muted";

type Item = {
  key: string;
  tone: Tone;
  title: string;
  detail: string;
  href: string;
  weight: number; // sort order — lower = more urgent
};

function useTodayItems(): Item[] {
  const decisions = useAtlas((s) => s.decisions);
  const reviews = useAtlas((s) => s.reviews);
  const roster = useRoster();
  const notes = useUserStore((s) => s.pathwayNotes);

  return useMemo(() => {
    const items: Item[] = [];
    const rosterIds = new Set(roster.map((a) => a.id));

    // 1. Overdue decision reviews (red — most urgent) — only for athletes on this roster
    for (const d of decisions) {
      if (!rosterIds.has(d.athleteId)) continue;
      if (!d.outcome && d.reviewDate && d.reviewDate < TODAY) {
        const a = roster.find((x) => x.id === d.athleteId);
        items.push({
          key: `dec-${d.id}`,
          tone: "rose",
          title: d.summary,
          detail: `Review overdue for ${a?.name ?? "athlete"}`,
          href: `/decisions/${d.id}`,
          weight: 0,
        });
      }
    }

    // 2–4. Pathway states from either seed OR user notes
    for (const a of roster) {
      const seed = athletePathways.find((p) => p.athleteId === a.id);
      const note = notes[a.id];
      const status = seed?.status ?? note?.status;
      const detailFallback = seed?.blocker ?? note?.blocker;
      const readyDetail = seed?.nextStepSummary ?? note?.nextStep;

      if (status === "Blocked") {
        items.push({
          key: `blk-${a.id}`,
          tone: "rose",
          title: a.name,
          detail: detailFallback ?? "Pathway blocked",
          href: `/squad/${a.id}`,
          weight: 1,
        });
      } else if (status === "Ready") {
        items.push({
          key: `rdy-${a.id}`,
          tone: "accent",
          title: a.name,
          detail: readyDetail ?? "Ready to move up",
          href: `/squad/${a.id}`,
          weight: 2,
        });
      } else if (status === "At Risk") {
        items.push({
          key: `atr-${a.id}`,
          tone: "amber",
          title: a.name,
          detail: detailFallback ?? "Falling behind expectation",
          href: `/squad/${a.id}`,
          weight: 3,
        });
      }
    }

    // 5. Active cycle status (informational). Only relevant when a roster exists.
    if (roster.length > 0) {
      const active = seedCycles.find((c) => c.status === "Active");
      if (active) {
        const states = cycleStatesFor(active.id).filter((s) =>
          rosterIds.has(s.athleteId),
        );
        const reviewed = new Set(
          reviews.filter((r) => r.cycleId === active.id).map((r) => r.athleteId),
        );
        const done = states.filter((s) => reviewed.has(s.athleteId)).length;
        if (states.length > 0) {
          items.push({
            key: `cyc-${active.id}`,
            tone: "muted",
            title: active.name,
            detail: `${done} of ${states.length} reviewed`,
            href: `/cycles/${active.id}`,
            weight: 4,
          });
        }
      }
    }

    return items.sort((a, b) => a.weight - b.weight).slice(0, 5);
  }, [decisions, reviews, roster]);
}

export function Today() {
  const items = useTodayItems();

  return (
    <section className="pb-16 pt-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
        Today
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-[14px] tracking-tightish text-bone-400">
          Nothing needs a decision today.
        </p>
      ) : (
        <ol className="mt-8">
          {items.map((it) => (
            <li key={it.key}>
              <Link
                href={it.href}
                className="group grid grid-cols-[16px_1fr] items-baseline gap-4 border-t border-hairline py-5 last:border-b transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <span className="mt-1">
                  <StateDot tone={it.tone} size={10} />
                </span>
                <div>
                  <div className="text-[16px] tracking-tightish text-white transition-colors group-hover:text-accent-tint">
                    {it.title}
                  </div>
                  <div className="mt-1 text-[12px] tracking-tightish text-bone-400">
                    {it.detail}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/** Exported so the state-line copy on the Overview can key off it. */
export function useAttentionCount() {
  const items = useTodayItems();
  return items.filter((i) => i.tone !== "muted").length;
}
