"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { seedCycles, cycleStatesFor } from "@/data/cycles";
import { useAtlas } from "@/data/store";
import { formatDateLong } from "@/lib/utils";

const TODAY = "2026-08-17";

export function SeasonTimeline() {
  const cycles = [...seedCycles].sort((a, b) => a.yearOrder - b.yearOrder);
  const reviews = useAtlas((s) => s.reviews);
  const decisions = useAtlas((s) => s.decisions);

  const [activeId, setActiveId] = useState<string>(
    cycles.find((c) => c.status === "Active")?.id ?? cycles[0].id,
  );
  const active = cycles.find((c) => c.id === activeId)!;

  return (
    <div>
      {/* Horizontal timeline */}
      <div className="relative pb-24 pt-6">
        <div className="absolute left-6 right-6 top-[54px] h-px bg-hairlineStrong" />
        <ol className="relative flex items-start gap-8 overflow-x-auto pb-2">
          {cycles.map((c) => {
            const isActive = activeId === c.id;
            const isCurrent = c.status === "Active";
            return (
              <li key={c.id} className="min-w-[140px]">
                <button
                  onClick={() => setActiveId(c.id)}
                  onMouseEnter={() => setActiveId(c.id)}
                  className="group flex w-full flex-col items-start text-left"
                >
                  <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                    {c.monthLabel}
                  </div>
                  <div className="relative mt-4 flex h-[10px] w-full items-center">
                    <span
                      className={`h-[10px] w-[10px] rounded-full transition-colors duration-300 ${
                        isActive
                          ? "bg-accent"
                          : isCurrent
                            ? "bg-white"
                            : "bg-bone-600 group-hover:bg-bone-400"
                      }`}
                    />
                  </div>
                  <div
                    className={`mt-6 text-[15px] tracking-tightish transition-colors duration-300 ${
                      isActive ? "text-white" : "text-bone-300 group-hover:text-white"
                    }`}
                  >
                    {c.name}
                  </div>
                  <div className="mt-1 text-[11px] tracking-tightish text-bone-500">
                    {c.season}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Selected cycle detail */}
      <AnimatePresence mode="wait">
        <motion.section
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-hairline pt-12"
        >
          <CycleDetail cycleId={active.id} />
        </motion.section>
      </AnimatePresence>
    </div>
  );
}

function CycleDetail({ cycleId }: { cycleId: string }) {
  const cycle = seedCycles.find((c) => c.id === cycleId)!;
  const reviews = useAtlas((s) => s.reviews);
  const decisions = useAtlas((s) => s.decisions);
  const states = cycleStatesFor(cycle.id);
  const reviewedIds = new Set(
    reviews.filter((r) => r.cycleId === cycle.id).map((r) => r.athleteId),
  );
  const reviewedCount = states.filter((s) => reviewedIds.has(s.athleteId)).length;
  const overdueCount = states.filter(
    (s) => !reviewedIds.has(s.athleteId) && s.reviewDueDate < TODAY,
  ).length;
  const openDecisions = decisions.filter(
    (d) => d.cycleId === cycle.id && d.status !== "Closed" && !d.outcome,
  ).length;

  const pct = states.length ? Math.round((reviewedCount / states.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-7">
        <h2 className="display text-[40px] tracking-tightest text-white md:text-[48px]">
          {cycle.name}
        </h2>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed tracking-tightish text-bone-200">
          {cycle.scope}. Owned by {cycle.owner}.
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6">
          <Meta k="Window" v={`${formatDateLong(cycle.startDate)} to ${formatDateLong(cycle.endDate)}`} />
          <Meta k="Status" v={cycle.status} />
          <Meta
            k="Participants"
            v={cycle.participants.join(", ")}
          />
        </dl>

        <div className="mt-12">
          <Link
            href={`/cycles/${cycle.id}`}
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-accent-tint transition-colors hover:text-white"
          >
            Open cycle
            <ArrowRight
              size={12}
              strokeWidth={1.4}
              className="transition-transform duration-500 ease-atlas group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      <div className="md:col-span-5 md:pt-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
          Progress
        </div>
        <div className="mt-6 flex items-baseline gap-4">
          <span className="display text-[64px] tracking-tightest text-white">
            {reviewedCount}
          </span>
          <span className="text-[13px] tracking-tightish text-bone-400">
            of {states.length} reviewed
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-hairline">
          <div
            className="h-px bg-accent transition-all duration-500 ease-atlas"
            style={{ width: `${pct}%` }}
          />
        </div>

        <dl className="mt-12 space-y-8">
          <SideStat k="Open decisions" v={openDecisions} />
          <SideStat k="Overdue reviews" v={overdueCount} rose={overdueCount > 0} />
          <SideStat k="Objectives on record" v={cycle.objectives.length} />
        </dl>
      </div>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">{k}</dt>
      <dd className="mt-2 text-[13px] tracking-tightish text-bone-100">{v}</dd>
    </div>
  );
}

function SideStat({ k, v, rose }: { k: string; v: number; rose?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[13px] tracking-tightish text-bone-300">{k}</span>
      <span
        className={`display text-[24px] ${rose ? "text-signal-rose" : "text-white"}`}
      >
        {v}
      </span>
    </div>
  );
}
