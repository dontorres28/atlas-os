"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { athletes } from "@/data/athletes";
import { cycleStatesFor, seedCycles } from "@/data/cycles";
import { useAtlas } from "@/data/store";
import { formatDateLong } from "@/lib/utils";
import { Segmented } from "@/components/ui/Segmented";

const TODAY = "2026-08-17";

type StatusFilter = "All" | "Reviewed" | "Due" | "Overdue";
const STATUS_FILTERS: StatusFilter[] = ["All", "Reviewed", "Due", "Overdue"];

export function ReviewRoom() {
  const reviews = useAtlas((s) => s.reviews);
  const activeCycle =
    seedCycles.find((c) => c.status === "Active") ?? seedCycles[0];
  const states = cycleStatesFor(activeCycle.id);
  const reviewedByAthlete = new Map(
    reviews
      .filter((r) => r.cycleId === activeCycle.id)
      .map((r) => [r.athleteId, r]),
  );
  const total = states.length;
  const reviewed = states.filter((s) => reviewedByAthlete.has(s.athleteId)).length;
  const overdue = states.filter(
    (s) => !reviewedByAthlete.has(s.athleteId) && s.reviewDueDate < TODAY,
  ).length;
  const due = total - reviewed - overdue;
  const pct = total ? reviewed / total : 0;

  const [filter, setFilter] = useState<StatusFilter>("All");

  const rows = states
    .map((s) => {
      const a = athletes.find((x) => x.id === s.athleteId)!;
      const rev = reviewedByAthlete.get(s.athleteId);
      const status: StatusFilter = rev
        ? "Reviewed"
        : s.reviewDueDate < TODAY
          ? "Overdue"
          : "Due";
      return { a, rev, status, dueDate: s.reviewDueDate };
    })
    .filter((r) => filter === "All" || r.status === filter)
    .sort((a, b) => {
      const order = { Overdue: 0, Due: 1, Reviewed: 2 } as const;
      return order[a.status] - order[b.status];
    });

  return (
    <div>
      {/* Current review hero */}
      <section className="grid grid-cols-1 gap-16 border-t border-hairline pb-16 pt-14 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
            Current review
          </div>
          <h2 className="display mt-6 text-[42px] tracking-tightest text-white md:text-[52px]">
            {activeCycle.name}
          </h2>
          <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed tracking-tightish text-bone-200">
            {activeCycle.scope}. Owned by {activeCycle.owner}.
          </p>
          <div className="mt-10 flex items-baseline gap-5">
            <span className="display text-[64px] leading-none tracking-tightest text-white">
              {reviewed}
            </span>
            <span className="text-[13px] uppercase tracking-[0.16em] text-bone-400">
              of {total} complete
            </span>
          </div>
        </div>

        <div className="md:col-span-5 md:pt-2">
          <ProgressRing pct={pct} reviewed={reviewed} total={total} />
          <dl className="mt-8 space-y-5">
            <MiniRow k="Reviewed" v={reviewed} />
            <MiniRow k="Due" v={due} />
            <MiniRow k="Overdue" v={overdue} rose={overdue > 0} />
          </dl>
        </div>
      </section>

      {/* Filters */}
      <div className="border-t border-hairline pb-2 pt-8">
        <Segmented
          value={filter}
          onChange={(v) => setFilter(v)}
          align="left"
          options={STATUS_FILTERS.map((f) => ({ value: f, label: f }))}
          ariaLabel="Filter reviews"
        />
      </div>

      {/* Athlete sequence */}
      <ol className="mt-4">
        <AnimatePresence initial={false}>
          {rows.map(({ a, rev, status, dueDate }, i) => {
            const tone =
              status === "Reviewed"
                ? "text-signal-moss"
                : status === "Overdue"
                  ? "text-signal-rose"
                  : "text-bone-400";
            return (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 12) * 0.02 }}
              >
                <Link
                  href={`/squad/${a.id}`}
                  className="group grid grid-cols-[42px_1fr_1fr_140px_120px] items-baseline gap-6 border-t border-hairline py-7 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
                >
                  <span className="text-[11px] tracking-[0.16em] text-bone-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="text-[17px] tracking-tightish text-white">
                      {a.name}
                    </div>
                    <div className="mt-1 text-[11px] tracking-tightish text-bone-500">
                      {a.positionLabel}, {a.team}
                    </div>
                  </div>
                  <div className="hidden text-[13px] leading-relaxed tracking-tightish text-bone-300 md:block">
                    {rev
                      ? rev.assessment.length > 90
                        ? rev.assessment.slice(0, 88) + "…"
                        : rev.assessment
                      : a.developmentPriority}
                  </div>
                  <div className={`text-[11px] uppercase tracking-[0.18em] ${tone}`}>
                    {status}
                  </div>
                  <div className="text-right text-[13px] tracking-tightish text-bone-400">
                    {rev ? `Reviewed ${formatDateLong(rev.date)}` : `Due ${formatDateLong(dueDate)}`}
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}

function ProgressRing({
  pct,
  reviewed,
  total,
}: {
  pct: number;
  reviewed: number;
  total: number;
}) {
  const size = 240;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * pct;
  return (
    <div className="relative mx-auto max-w-[260px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full"
        aria-label="Review progress"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="display text-[52px] leading-none tracking-tightest text-white">
          {Math.round(pct * 100)}
          <span className="text-[22px] text-bone-500">%</span>
        </div>
        <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
          {reviewed} of {total}
        </div>
      </div>
    </div>
  );
}

function MiniRow({ k, v, rose }: { k: string; v: number; rose?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[13px] tracking-tightish text-bone-300">{k}</span>
      <span
        className={`display text-[22px] tracking-tightish ${rose ? "text-signal-rose" : "text-white"}`}
      >
        {v}
      </span>
    </div>
  );
}
