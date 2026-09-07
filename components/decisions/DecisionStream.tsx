"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAtlas } from "@/data/store";
import { athletes } from "@/data/athletes";
import { formatDateShort } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { RecordDecisionButton } from "./RecordDecisionButton";

const TODAY = "2026-08-17";

type Verdict = "open" | "overdue" | "achieved" | "missed" | "partial";

function verdictOf(d: ReturnType<typeof useAtlas.getState>["decisions"][number]): Verdict {
  if (d.outcome) {
    if (d.outcome.verdict === "Achieved") return "achieved";
    if (d.outcome.verdict === "Partially Achieved") return "partial";
    return "missed";
  }
  if (d.reviewDate && d.reviewDate < TODAY) return "overdue";
  return "open";
}

function pillClass(v: Verdict) {
  switch (v) {
    case "achieved":
      return "bg-signal-moss/20 text-signal-moss border-signal-moss/50";
    case "missed":
      return "bg-signal-rose/20 text-signal-rose border-signal-rose/50";
    case "partial":
      return "bg-signal-amber/20 text-signal-amber border-signal-amber/50";
    case "overdue":
      return "bg-signal-rose/20 text-signal-rose border-signal-rose/50";
    case "open":
    default:
      return "bg-accent text-white border-accent";
  }
}

function verdictExplainer(v: Verdict) {
  switch (v) {
    case "achieved":
      return "Reviewed. The expected outcome was met.";
    case "missed":
      return "Reviewed. The expected outcome was not met.";
    case "partial":
      return "Reviewed. The outcome was partially met.";
    case "overdue":
      return "Review date has passed and no outcome is recorded yet.";
    case "open":
    default:
      return "Active decision. Awaiting the review date.";
  }
}

function verdictLabel(v: Verdict) {
  switch (v) {
    case "achieved":
      return "Achieved";
    case "missed":
      return "Missed";
    case "partial":
      return "Partial";
    case "overdue":
      return "Overdue";
    case "open":
    default:
      return "Open";
  }
}

export function DecisionStream() {
  const decisions = useAtlas((s) => s.decisions);

  const stream = useMemo(
    () => [...decisions].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [decisions],
  );

  return (
    <section className="mx-auto max-w-[900px] pb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-3">
        <div className="flex items-baseline gap-4">
          <h2 className="display text-[24px] tracking-tightest text-white">
            Ledger
          </h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
            {stream.length} decision{stream.length === 1 ? "" : "s"}
          </span>
        </div>
        <RecordDecisionButton />
      </div>

      <ol className="mt-4 flex flex-col gap-2">
        {stream.map((d) => {
          const a = athletes.find((x) => x.id === d.athleteId);
          const v = verdictOf(d);
          return (
            <li key={d.id}>
              <Link
                href={`/decisions/${d.id}`}
                className="content-surface group flex items-center gap-4 px-4 py-3.5 md:px-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] tracking-tightish text-white transition-colors group-hover:text-accent-tint">
                    {d.summary}
                  </div>
                  <div className="mt-1 truncate text-[12px] tracking-tightish text-bone-400">
                    {a?.name ?? ""}, {formatDateShort(d.date)}
                  </div>
                </div>
                <Tooltip
                  side="left"
                  wide
                  title={verdictLabel(v)}
                  hint={verdictExplainer(v)}
                >
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${pillClass(v)}`}
                  >
                    {verdictLabel(v)}
                  </span>
                </Tooltip>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
