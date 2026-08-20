import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { athletes } from "@/data/athletes";
import { athletePathways } from "@/data/pathways";
import { daysBetween } from "@/lib/utils";

const TODAY = "2026-08-17";

type PositionKey = "GK" | "CB" | "FB" | "CM" | "LW" | "ST";

const POSITION_TARGETS: { key: PositionKey; label: string; target: number; positions: string[] }[] = [
  { key: "GK", label: "GK", target: 2, positions: ["GK"] },
  { key: "CB", label: "CB", target: 4, positions: ["CB"] },
  { key: "FB", label: "FB", target: 4, positions: ["RB", "LB"] },
  { key: "CM", label: "CM", target: 6, positions: ["DM", "CM", "AM"] },
  { key: "LW", label: "LW / RW", target: 3, positions: ["LW", "RW"] },
  { key: "ST", label: "ST", target: 2, positions: ["CF"] },
];

function projectedCount(positions: string[]) {
  // Athletes remaining after this season based on contract expiry.
  return athletes.filter(
    (a) =>
      positions.includes(a.position) &&
      a.team !== "U19" &&
      new Date(a.contract.expiry).getUTCFullYear() >= 2027,
  ).length;
}

export function Outlook() {
  const rows = POSITION_TARGETS.map((p) => {
    const proj = projectedCount(p.positions);
    const delta = proj - p.target;
    const state =
      delta === 0 ? "Balanced" : delta > 0 ? "Surplus" : "Gap";
    return { ...p, projected: proj, delta, state };
  });

  const averageAge =
    Math.round(
      (athletes
        .filter((a) => a.team !== "Loan")
        .reduce((sum, a) => sum + a.age, 0) /
        athletes.filter((a) => a.team !== "Loan").length) * 10,
    ) / 10;
  const projectedAge = Math.round((averageAge + 0.6) * 10) / 10;
  const expiring12 = athletes.filter((a) => {
    const d = daysBetween(TODAY, a.contract.expiry);
    return d >= 0 && d <= 365;
  }).length;
  const candidates = athletePathways.filter(
    (p) => p.status === "Ready" && (p.currentStageId === "u19" || p.currentStageId === "u21"),
  ).length;

  return (
    <section className="atlas-enter border-t border-hairline py-20" style={{ animationDelay: "0.22s" }}>
      <div className="mb-12 flex items-baseline justify-between">
        <h2 className="text-[26px] tracking-tightish text-white">
          2027–28 squad direction
        </h2>
        <Link
          href="/pathways"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-bone-400 transition-colors hover:text-white"
        >
          Open pathway
          <ArrowRight size={12} strokeWidth={1.4} />
        </Link>
      </div>

      <ol className="grid grid-cols-2 gap-x-8 md:grid-cols-3 lg:grid-cols-6">
        {rows.map((r) => {
          const tone =
            r.state === "Gap"
              ? "text-signal-rose"
              : r.state === "Surplus"
                ? "text-signal-amber"
                : "text-bone-300";
          return (
            <li key={r.key} className="border-t border-hairlineStrong pt-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
                {r.label}
              </div>
              <div className={`display mt-4 text-[36px] ${r.state === "Gap" ? "text-white" : "text-white"}`}>
                {r.state.toUpperCase()}
              </div>
              <div className={`mt-2 text-[11px] uppercase tracking-[0.14em] ${tone}`}>
                {r.projected} projected, target {r.target}
              </div>
            </li>
          );
        })}
      </ol>

      <dl className="mt-16 grid grid-cols-1 gap-x-12 border-t border-hairline pt-8 md:grid-cols-3">
        <ProjRow k="Projected squad age" now={averageAge.toString()} next={projectedAge.toString()} note="2026 → 2028" />
        <ProjRow k="Contract exposure" now={String(expiring12)} next="within 12 months" note="Decisions due" />
        <ProjRow k="Pathway candidates" now={String(candidates)} next="ready to move up" note="Academy and B Team" />
      </dl>
    </section>
  );
}

function ProjRow({
  k,
  now,
  next,
  note,
}: {
  k: string;
  now: string;
  next: string;
  note: string;
}) {
  return (
    <div className="border-t border-hairline py-6 first:border-t-0 md:border-t-0 md:py-0">
      <div className="label">{k}</div>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="display text-[36px] text-white">{now}</span>
        <span className="text-[12px] uppercase tracking-[0.14em] text-bone-400">
          {next}
        </span>
      </div>
      <div className="meta mt-2 text-bone-500">{note}</div>
    </div>
  );
}
