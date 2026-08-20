"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { seedCycles, cycleStatesFor } from "@/data/cycles";
import { useAtlas } from "@/data/store";

const TODAY = "2026-08-17";
const SHOW = ["cyc_c01", "cyc_c03"] as const;

export function CyclesGlance() {
  const reviews = useAtlas((s) => s.reviews);
  const decisions = useAtlas((s) => s.decisions);

  const cycles = SHOW.map((id) => seedCycles.find((c) => c.id === id)).filter(
    (c): c is (typeof seedCycles)[number] => Boolean(c),
  );

  return (
    <section className="atlas-enter" style={{ animationDelay: "0.19s" }}>
      <div className="flex items-baseline justify-between border-b border-hairline pb-5">
        <h2 className="text-[18px] tracking-tightish text-white">
          In progress
        </h2>
        <Link
          href="/cycles"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-bone-400 transition-colors hover:text-white"
        >
          Open calendar
          <ArrowRight size={12} strokeWidth={1.4} />
        </Link>
      </div>

      <ol>
        {cycles.map((c) => {
          const states = cycleStatesFor(c.id);
          const reviewedIds = new Set(
            reviews.filter((r) => r.cycleId === c.id).map((r) => r.athleteId),
          );
          const reviewedCount = states.filter((s) => reviewedIds.has(s.athleteId)).length;
          const total = states.length;
          const pct = total ? Math.round((reviewedCount / total) * 100) : 0;
          const pending = decisions.filter(
            (d) => d.cycleId === c.id && d.status !== "Closed" && !d.outcome,
          ).length;
          const overdue = states.filter(
            (s) => !reviewedIds.has(s.athleteId) && s.reviewDueDate < TODAY,
          ).length;

          return (
            <li key={c.id}>
              <Link
                href={`/cycles/${c.id}`}
                className="group block border-t border-hairline py-7 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="text-[16px] tracking-tightish text-white">
                      {c.name}
                    </div>
                    <div className="meta mt-1 text-bone-400">
                      {c.monthLabel} {c.season}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] tracking-tightish text-white">
                      {reviewedCount} <span className="text-bone-500">of</span> {total}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-bone-400">
                      reviewed
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-px w-full bg-hairline">
                  <div
                    className="h-px bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between meta">
                  <span>{pending} decision{pending === 1 ? "" : "s"} pending</span>
                  <span className={overdue ? "text-signal-rose" : "text-bone-400"}>
                    {overdue} overdue
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
