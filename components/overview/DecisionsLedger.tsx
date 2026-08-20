"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAtlas } from "@/data/store";
import { athletes } from "@/data/athletes";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function formatDay(iso: string) {
  const d = new Date(iso);
  return { day: d.getUTCDate(), month: MONTHS[d.getUTCMonth()] };
}

export function DecisionsLedger({ limit = 5 }: { limit?: number }) {
  const decisions = useAtlas((s) => s.decisions);
  const recent = [...decisions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);

  return (
    <section className="atlas-enter" style={{ animationDelay: "0.16s" }}>
      <div className="flex items-baseline justify-between border-b border-hairline pb-5">
        <h2 className="text-[18px] tracking-tightish text-white">
          Recent decisions
        </h2>
        <Link
          href="/decisions"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-bone-400 transition-colors hover:text-white"
        >
          Open ledger
          <ArrowRight size={12} strokeWidth={1.4} />
        </Link>
      </div>

      <ol>
        {recent.map((d) => {
          const a = athletes.find((x) => x.id === d.athleteId);
          const { day, month } = formatDay(d.date);
          return (
            <li key={d.id}>
              <Link
                href={`/decisions/${d.id}`}
                className="group grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-6 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
              >
                <div className="col-span-2">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-bone-500">
                    {month}
                  </div>
                  <div className="mt-1 text-[24px] tracking-tightish text-white">
                    {day}
                  </div>
                </div>
                <div className="col-span-9">
                  <div className="text-[15px] tracking-tightish text-white">
                    {d.summary}
                  </div>
                  <div className="meta mt-1 text-bone-400">
                    {a?.team ?? ""} <span className="mx-2 text-bone-600">·</span>{" "}
                    {d.area}
                  </div>
                </div>
                <div className="col-span-1 text-right text-[10px] uppercase tracking-[0.18em] text-bone-400 transition-colors group-hover:text-accent-tint">
                  {d.status}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
