import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { athletes } from "@/data/athletes";
import { loanProfiles } from "@/data/loans";

export default function LoansPage() {
  const onTrack = loanProfiles.filter((l) => l.progress === "On Track").length;
  const offTrack = loanProfiles.filter((l) => l.progress === "Off Track").length;

  return (
    <>
      <ModuleHeader
        section="Loans / 08"
        title="Trajectory"
        subtitle="A player can have every minute available and still develop in the wrong direction."
        side={
          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 pt-4">
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                On track
              </dt>
              <dd className="display mt-2 text-[28px] text-white">{onTrack}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                Off track
              </dt>
              <dd className="display mt-2 text-[28px] text-signal-rose">{offTrack}</dd>
            </div>
          </dl>
        }
      />

      <div className="mt-2 border-t border-hairline">
        {loanProfiles.map((l) => {
          const a = athletes.find((x) => x.id === l.athleteId)!;
          const roleAlignmentPct =
            l.progress === "On Track" ? 88 : l.progress === "Ahead" ? 96 : 62;
          const isOff = l.progress === "Off Track";
          return (
            <section
              key={l.athleteId}
              className="atlas-enter grid grid-cols-1 gap-x-12 gap-y-10 border-b border-hairline py-16 md:grid-cols-12"
            >
              {/* Trajectory column */}
              <div className="md:col-span-5">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
                  Player
                </div>
                <Link
                  href={`/squad/${a.id}`}
                  className="mt-4 block display text-[48px] leading-none tracking-tightest text-white transition-colors hover:text-accent-tint md:text-[56px]"
                >
                  {a.name}
                </Link>
                <div className="mt-3 text-[12px] tracking-tightish text-bone-400">
                  {a.age} yrs, {a.positionLabel}
                </div>

                <ol className="mt-10 relative">
                  <TrajectoryStep label="Loan club" value={l.club} />
                  <TrajectoryStep label="Role" value={l.role} />
                  <TrajectoryStep label="Competition" value={l.competition} />
                  <TrajectoryStep
                    label="Return decision"
                    value={l.returnDecision}
                    accent
                    last
                  />
                </ol>
              </div>

              {/* Playing vs developing */}
              <div className="md:col-span-7">
                <div className="grid grid-cols-2 gap-8 border-t border-hairline pt-8">
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                      Playing
                    </div>
                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="display text-[52px] leading-none tracking-tightest text-white">
                        {l.minutes.toLocaleString()}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-bone-400">
                        minutes
                      </span>
                    </div>
                    <div className="mt-3 text-[12px] tracking-tightish text-bone-400">
                      {l.starts} starts. Reporting {l.reportingSchedule.toLowerCase()}.
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                      Developing
                    </div>
                    <div className="mt-4">
                      <div className="display text-[22px] tracking-tightish text-white">
                        {l.objective}
                      </div>
                      <div
                        className={`mt-2 text-[11px] uppercase tracking-[0.18em] ${
                          isOff ? "text-signal-rose" : "text-accent-tint"
                        }`}
                      >
                        {l.progress}
                      </div>
                      <p className="mt-4 text-[13px] leading-relaxed text-bone-300">
                        {l.progressNote}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
                      Role alignment
                    </span>
                    <span
                      className={`text-[13px] tracking-tightish ${
                        isOff ? "text-signal-rose" : "text-white"
                      }`}
                    >
                      {roleAlignmentPct}%
                    </span>
                  </div>
                  <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-hairline">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOff ? "bg-signal-rose" : "bg-accent"
                      }`}
                      style={{ width: `${roleAlignmentPct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-6">
                  <Link
                    href={`/squad/${a.id}`}
                    className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-accent-tint transition-colors hover:text-white"
                  >
                    Open athlete
                    <ArrowRight
                      size={12}
                      strokeWidth={1.4}
                      className="transition-transform duration-500 ease-atlas group-hover:translate-x-1"
                    />
                  </Link>
                  <span className="text-[11px] tracking-tightish text-bone-500">
                    Last report {l.lastReport}. Next review {l.nextReview}.
                  </span>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function TrajectoryStep({
  label,
  value,
  accent,
  last,
}: {
  label: string;
  value: string;
  accent?: boolean;
  last?: boolean;
}) {
  return (
    <li className="relative pl-8">
      {/* connector line */}
      <span
        aria-hidden
        className={`absolute left-[3px] top-2 h-full w-px ${last ? "bg-transparent" : "bg-hairlineStrong"}`}
      />
      <span
        aria-hidden
        className={`absolute left-0 top-2 h-[7px] w-[7px] rounded-full ${
          accent ? "bg-accent" : "bg-bone-500"
        }`}
      />
      <div className="pb-6">
        <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
          {label}
        </div>
        <div
          className={`mt-1 text-[16px] tracking-tightish ${accent ? "text-accent-tint" : "text-white"}`}
        >
          {value}
        </div>
      </div>
    </li>
  );
}
