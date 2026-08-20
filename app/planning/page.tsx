import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { athletes } from "@/data/athletes";
import { athletePathways } from "@/data/pathways";
import { projectedRoster } from "@/data/planning";
import { daysBetween } from "@/lib/utils";

const TODAY = "2026-08-17";

export default function PlanningPage() {
  const rows = projectedRoster();

  const activeSquad = athletes.filter((a) => a.team !== "Loan");
  const avgAge =
    Math.round(
      (activeSquad.reduce((s, a) => s + a.age, 0) / activeSquad.length) * 10,
    ) / 10;
  const projectedAge = Math.round((avgAge + 0.6) * 10) / 10;
  const expiring = athletes.filter((a) => {
    const d = daysBetween(TODAY, a.contract.expiry);
    return d >= 0 && d <= 365;
  }).length;
  const pathwaySupply = athletePathways.filter(
    (p) =>
      p.status === "Ready" &&
      (p.currentStageId === "u19" || p.currentStageId === "u21"),
  ).length;
  const recruitmentNeeds = rows.filter((r) => r.state === "GAP").length;

  return (
    <>
      <ModuleHeader
        section="Planning / 07"
        title="Squad 2027 / 28"
        subtitle="What this squad needs to look like a year from now."
      />

      {/* Position needs */}
      <section className="border-t border-hairline py-12">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
          Position needs
        </div>

        <ol className="mt-10">
          {rows.map((r) => {
            const availabilityPct = Math.min(
              1,
              (r.projected + r.pathway) / r.required,
            );
            const projPct = Math.min(1, r.projected / r.required);
            return (
              <li
                key={r.key}
                className="atlas-enter grid grid-cols-[100px_1fr_130px_130px_130px_130px] items-baseline gap-6 border-t border-hairline py-8 first:border-hairlineStrong last:border-b"
              >
                <div className="display text-[36px] leading-none tracking-tightest text-white">
                  {r.key}
                </div>

                <div>
                  <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-hairline">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-white/70"
                      style={{ width: `${projPct * 100}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all"
                      style={{ width: `${availabilityPct * 100}%` }}
                    />
                  </div>
                  <div className="mt-3 text-[13px] tracking-tightish text-bone-300">
                    {r.label}
                  </div>
                </div>

                <NumberCell label="Required" value={r.required} />
                <NumberCell label="Projected" value={r.projected} />
                <NumberCell label="Pathway" value={r.pathway} accent />
                <div className="text-right">
                  <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                    State
                  </div>
                  <div
                    className={`display mt-2 text-[22px] tracking-tightish ${
                      r.state === "GAP"
                        ? "text-signal-rose"
                        : r.state === "SURPLUS"
                          ? "text-signal-amber"
                          : "text-white"
                    }`}
                  >
                    {r.state}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Summaries */}
      <section className="grid grid-cols-1 gap-10 border-t border-hairline py-16 md:grid-cols-4">
        <Summary
          k="Age curve"
          now={avgAge.toString()}
          projected={projectedAge.toString()}
          note="Average today → 2028"
        />
        <Summary
          k="Contract exposure"
          now={expiring.toString()}
          projected="within 12 months"
          note="Decisions due"
        />
        <Summary
          k="Pathway supply"
          now={pathwaySupply.toString()}
          projected="ready to step up"
          note="Academy and B Team"
        />
        <Summary
          k="Recruitment needs"
          now={recruitmentNeeds.toString()}
          projected="open gaps"
          note="Structural, not opportunistic"
        />
      </section>

      <div className="border-t border-hairline py-10">
        <Link
          href="/recruitment"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-accent-tint transition-colors hover:text-white"
        >
          Open recruitment briefs
          <ArrowRight
            size={12}
            strokeWidth={1.4}
            className="transition-transform duration-500 ease-atlas group-hover:translate-x-1"
          />
        </Link>
      </div>
    </>
  );
}

function NumberCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="text-right">
      <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
        {label}
      </div>
      <div
        className={`display mt-2 text-[22px] tracking-tightish ${accent ? "text-accent-tint" : "text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}

function Summary({
  k,
  now,
  projected,
  note,
}: {
  k: string;
  now: string;
  projected: string;
  note: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
        {k}
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="display text-[36px] tracking-tightest text-white">
          {now}
        </span>
        <span className="text-[12px] uppercase tracking-[0.16em] text-bone-400">
          {projected}
        </span>
      </div>
      <div className="mt-2 text-[12px] tracking-tightish text-bone-500">
        {note}
      </div>
    </div>
  );
}
