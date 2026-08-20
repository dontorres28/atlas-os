"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { athletes } from "@/data/athletes";
import { formatDateShort, yearOf } from "@/lib/utils";
import { getPathway } from "@/data/pathways";
import { SQUAD_FILTERS, SquadFilter, SquadFilters } from "./SquadFilters";

function match(filter: SquadFilter, a: (typeof athletes)[number]) {
  if (filter === "All") return true;
  if (filter === "Academy") return a.team === "U21" || a.team === "U19";
  if (filter === "Loan") return a.team === "Loan";
  return a.positionGroup === filter;
}

export function SquadTable() {
  const [filter, setFilter] = useState<SquadFilter>("All");

  const counts = useMemo(() => {
    const out = {} as Record<SquadFilter, number>;
    for (const f of SQUAD_FILTERS) out[f] = athletes.filter((a) => match(f, a)).length;
    return out;
  }, []);

  const rows = useMemo(() => athletes.filter((a) => match(filter, a)), [filter]);

  return (
    <div>
      <SquadFilters value={filter} onChange={setFilter} counts={counts} />

      <div className="mt-4 grid grid-cols-12 gap-4 py-3">
        <div className="col-span-5 label">Athlete</div>
        <div className="col-span-1 label text-right">Age</div>
        <div className="col-span-1 label">Pos</div>
        <div className="col-span-2 label">Pathway</div>
        <div className="col-span-1 label text-right">Contract</div>
        <div className="col-span-2 label text-right">Last review</div>
      </div>

      <ol>
        {rows.map((a, i) => {
          const p = getPathway(a.id);
          const isLoan = a.team === "Loan";
          const loanClub = p?.loanClub ?? "";
          const isUnavailable = a.status === "Injured";
          const isIntl = a.status === "International Duty";
          return (
            <li
              key={a.id}
              className="atlas-row"
              style={{ animationDelay: `${Math.min(i, 16) * 0.03}s` }}
            >
              <Link
                href={`/squad/${a.id}`}
                className="group grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-6 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.025]"
              >
                <div className="col-span-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[17px] tracking-tightish text-white">
                      {a.name}
                    </span>
                    <span className="text-[12px] text-bone-500">{a.nationality}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="text-[12px] tracking-tightish text-bone-300">
                      {a.role}
                    </span>
                    {isLoan && loanClub ? (
                      <span className="text-[12px] text-accent-tint">
                        On loan at {loanClub}
                      </span>
                    ) : null}
                    {isUnavailable ? (
                      <span className="text-[12px] text-signal-rose">
                        Injured
                      </span>
                    ) : null}
                    {isIntl ? (
                      <span className="text-[12px] text-signal-amber">
                        International duty
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-1 text-right text-[15px] text-white">
                  {a.age}
                </div>

                <div className="col-span-1 text-[13px] uppercase tracking-[0.14em] text-bone-200">
                  {a.position}
                </div>

                <div className="col-span-2">
                  <div className="text-[14px] tracking-tightish text-bone-200">
                    {isLoan ? "Loan" : a.team}
                  </div>
                  <div className="mt-1 text-[11px] tracking-tightish text-bone-500">
                    {a.pathwayStage}
                  </div>
                </div>

                <div className="col-span-1 text-right text-[15px] text-white">
                  {yearOf(a.contract.expiry)}
                </div>

                <div className="col-span-2 text-right text-[13px] text-bone-300">
                  {formatDateShort(a.lastReviewDate)}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex items-center justify-between meta">
        <span>{rows.length} athletes</span>
        <span className="text-accent-tint">{filter}</span>
      </div>
    </div>
  );
}
