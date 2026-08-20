"use client";

import Link from "next/link";
import type { Athlete } from "@/lib/types";
import { cyclesForAthlete, cycleStateFor } from "@/data/cycles";
import { useAtlas } from "@/data/store";
import { formatDateLong } from "@/lib/utils";
import { Section } from "../ui/Section";

const TODAY = "2026-08-17";

export function CyclesBlock({ athlete }: { athlete: Athlete }) {
  const list = cyclesForAthlete(athlete.id);
  const reviews = useAtlas((s) => s.reviews);

  return (
    <Section
      title="Cycles"
      aside={
        list.length
          ? list.length === 1
            ? "One sporting cycle includes this athlete."
            : `${list.length} sporting cycles include this athlete.`
          : "Not scheduled into any current cycle."
      }
      delay={0.24}
    >
      {list.length === 0 ? (
        <div className="border-t border-hairlineStrong py-10 text-[14px] tracking-tightish text-bone-400">
          This athlete is not scheduled into any current sporting cycle.
        </div>
      ) : (
        <ol>
          {list.map((c) => {
            const state = cycleStateFor(c.id, athlete.id);
            const reviewedInCycle = reviews.find(
              (r) => r.cycleId === c.id && r.athleteId === athlete.id,
            );
            const status = reviewedInCycle
              ? "Reviewed"
              : state && state.reviewDueDate < TODAY
                ? "Overdue"
                : "Scheduled";
            const statusClass =
              status === "Reviewed"
                ? "text-signal-moss"
                : status === "Overdue"
                  ? "text-signal-rose"
                  : "text-bone-300";
            return (
              <li key={c.id}>
                <Link
                  href={`/cycles/${c.id}`}
                  className="group grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-6 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
                >
                  <span className="col-span-5 text-[16px] tracking-tightish text-white">
                    {c.name}
                  </span>
                  <span className="col-span-3 meta">
                    {c.monthLabel} {c.season}
                  </span>
                  <span className={`col-span-2 text-[11px] uppercase tracking-[0.18em] ${statusClass}`}>
                    {status}
                  </span>
                  <span className="col-span-2 text-right text-[12px] text-bone-300">
                    {state ? `Due ${formatDateLong(state.reviewDueDate)}` : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}
