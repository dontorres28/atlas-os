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
    <div className="mx-auto flex max-w-[900px] flex-col gap-6 pb-8">
      {/* Current review hero */}
      <section className="structural-surface p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
              Current review
            </div>
            <h2 className="display mt-4 text-[32px] leading-tight tracking-tightest text-white md:text-[38px]">
              {activeCycle.name}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed tracking-tightish text-bone-200">
              {activeCycle.scope}. Owned by {activeCycle.owner}.
            </p>
            <div className="mt-8 flex items-baseline gap-4">
              <span className="display text-[52px] leading-none tracking-tightest text-white">
                {reviewed}
              </span>
              <span className="text-[12px] uppercase tracking-[0.16em] text-bone-400">
                of {total} complete
              </span>
            </div>
          </div>

          <div className="md:col-span-5">
            <ProgressRing pct={pct} reviewed={reviewed} total={total} />
            <dl className="mt-6 space-y-4">
              <MiniRow k="Reviewed" v={reviewed} />
              <MiniRow k="Due" v={due} />
              <MiniRow k="Overdue" v={overdue} rose={overdue > 0} />
            </dl>
          </div>
        </div>
      </section>

      {/* Athlete sequence */}
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-3">
          <h2 className="display text-[24px] tracking-tightest text-white">
            Athletes
          </h2>
          <Segmented
            value={filter}
            onChange={(v) => setFilter(v)}
            align="right"
            options={STATUS_FILTERS.map((f) => ({ value: f, label: f }))}
            ariaLabel="Filter reviews"
          />
        </div>

        <ol className="mt-4 flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {rows.map(({ a, rev, status, dueDate }, i) => (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 12) * 0.02 }}
              >
                <Link
                  href={`/squad/${a.id}`}
                  className="content-surface group flex items-center gap-4 px-4 py-3.5 md:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="truncate text-[15px] tracking-tightish text-white">
                        {a.name}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.14em] text-bone-500">
                        {a.positionLabel}, {a.team}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-[12px] tracking-tightish text-bone-400">
                      {rev
                        ? `Reviewed ${formatDateLong(rev.date)}`
                        : `Due ${formatDateLong(dueDate)}`}
                    </div>
                  </div>
                  <ReviewStatusPill status={status} />
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </section>
    </div>
  );
}

function ReviewStatusPill({ status }: { status: StatusFilter }) {
  const tone =
    status === "Reviewed"
      ? "bg-signal-moss/20 text-signal-moss border-signal-moss/50"
      : status === "Overdue"
        ? "bg-signal-rose/20 text-signal-rose border-signal-rose/50"
        : "bg-white/[0.06] text-bone-100 border-hairlineStrong";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${tone}`}
    >
      {status}
    </span>
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
