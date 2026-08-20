"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAtlas } from "@/data/store";
import { athletes } from "@/data/athletes";
import { formatDateShort } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

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

function dotClass(v: Verdict) {
  switch (v) {
    case "achieved":
      return "bg-signal-moss";
    case "missed":
      return "bg-signal-rose";
    case "partial":
      return "bg-signal-amber";
    case "overdue":
      return "bg-signal-rose";
    case "open":
    default:
      return "bg-accent";
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
    <ol className="mx-auto max-w-[900px] pb-8">
      {stream.map((d) => {
        const a = athletes.find((x) => x.id === d.athleteId);
        const v = verdictOf(d);
        return (
          <li key={d.id}>
            <Link
              href={`/decisions/${d.id}`}
              className="group grid grid-cols-[16px_1fr_120px_90px] items-baseline gap-6 py-5 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <Tooltip
                side="right"
                wide
                title={verdictLabel(v)}
                hint={verdictExplainer(v)}
              >
                <span
                  aria-label={verdictLabel(v)}
                  className={`mt-2 h-[10px] w-[10px] rounded-full ${dotClass(v)}`}
                />
              </Tooltip>
              <div className="min-w-0">
                <div className="text-[17px] tracking-tightish text-white transition-colors group-hover:text-accent-tint">
                  {d.summary}
                </div>
                <div className="mt-1 text-[12px] tracking-tightish text-bone-500 truncate">
                  {a?.name ?? ""}
                </div>
              </div>
              <div className="text-right text-[11px] uppercase tracking-[0.18em] text-bone-400">
                {verdictLabel(v)}
              </div>
              <div className="text-right text-[12px] tracking-tightish text-bone-500">
                {formatDateShort(d.date)}
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
