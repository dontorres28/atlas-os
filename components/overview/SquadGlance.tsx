"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { athletes } from "@/data/athletes";
import { athletePathways } from "@/data/pathways";
import { daysBetween } from "@/lib/utils";

const TODAY = "2026-08-17";

const GROUPS: { key: string; label: string; positions: string[] }[] = [
  { key: "GK", label: "GK", positions: ["GK"] },
  { key: "CB", label: "CB", positions: ["CB"] },
  { key: "FB", label: "FB", positions: ["RB", "LB"] },
  { key: "CM", label: "CM", positions: ["DM", "CM", "AM"] },
  { key: "FW", label: "FW", positions: ["RW", "LW", "CF"] },
];

export function SquadGlance() {
  const firstTeam = athletes.filter((a) => a.team === "First Team");
  const totalAthletes = athletes.length;
  const pathwayCandidates = athletePathways.filter(
    (p) => p.status === "Ready" || p.status === "On Track" && (p.nextStageId ?? "").length > 0,
  ).length;
  const contractDecisions = athletes.filter((a) => {
    const d = daysBetween(TODAY, a.contract.expiry);
    return d >= 0 && d <= 365;
  }).length;
  const loanReturns = athletes.filter((a) => a.team === "Loan").length;

  return (
    <section className="atlas-enter" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-baseline justify-between border-b border-hairline pb-5">
        <h2 className="text-[18px] tracking-tightish text-white">
          Shape of the First Team
        </h2>
        <Link
          href="/squad"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-bone-400 transition-colors hover:text-white"
        >
          Open squad
          <ArrowRight size={12} strokeWidth={1.4} />
        </Link>
      </div>

      <ol className="py-8">
        {GROUPS.map((g) => {
          const players = firstTeam.filter((a) => g.positions.includes(a.position));
          return (
            <li
              key={g.key}
              className="grid grid-cols-12 items-center gap-4 border-t border-hairline py-5 first:border-t-0"
            >
              <div className="col-span-1 text-[12px] uppercase tracking-[0.18em] text-bone-400">
                {g.label}
              </div>
              <div className="col-span-8 flex flex-wrap items-center gap-3">
                {players.map((a) => (
                  <PositionDot key={a.id} name={a.name} />
                ))}
                {players.length === 0 ? (
                  <span className="text-[12px] text-bone-500">No senior cover</span>
                ) : null}
              </div>
              <div className="col-span-3 text-right text-[13px] text-bone-300">
                {players.length} athlete{players.length === 1 ? "" : "s"}
              </div>
            </li>
          );
        })}
      </ol>

      <dl className="grid grid-cols-2 gap-x-8 border-t border-hairlineStrong pt-6">
        <TotalRow k="Total athletes" v={totalAthletes} />
        <TotalRow k="Pathway candidates" v={pathwayCandidates} />
        <TotalRow k="Contract decisions" v={contractDecisions} />
        <TotalRow k="Loan returns" v={loanReturns} />
      </dl>
    </section>
  );
}

function PositionDot({ name }: { name: string }) {
  return (
    <span
      title={name}
      className="relative h-2 w-2 rounded-full bg-white transition-colors duration-300 hover:bg-accent-tint"
      aria-label={name}
    />
  );
}

function TotalRow({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex items-baseline justify-between border-t border-hairline py-3 first:border-t-0">
      <dt className="text-[13px] text-bone-300">{k}</dt>
      <dd className="text-[14px] text-white">{v}</dd>
    </div>
  );
}
