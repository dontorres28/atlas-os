import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { athletesAtStage, pathwayStages, stageOf } from "@/data/pathways";
import { athletes } from "@/data/athletes";

export function generateStaticParams() {
  return pathwayStages.map((s) => ({ key: s.key }));
}

const READINESS = ["Ready", "On Track", "Blocked", "At Risk"] as const;

export default function StagePage({ params }: { params: { key: string } }) {
  const stage = stageOf(params.key);
  if (!stage) return notFound();

  const rows = athletesAtStage(stage.id).map((p) => {
    const athlete = athletes.find((a) => a.id === p.athleteId)!;
    return { p, athlete };
  });

  const counts = READINESS.reduce(
    (acc, r) => {
      acc[r] = rows.filter((x) => x.p.status === r).length;
      return acc;
    },
    {} as Record<(typeof READINESS)[number], number>,
  );

  return (
    <>
      <PageHeader
        section="Pathway"
        title={stage.label}
        meta={`${rows.length} athletes currently at this stage. ${stage.isSenior ? "Senior football." : "Development football."}`}
        actions={
          <Link
            href="/pathways"
            className="text-[11px] uppercase tracking-[0.16em] text-bone-400 hover:text-white"
          >
            All pathways
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-6 border-b border-hairline py-10 md:grid-cols-4">
        {READINESS.map((r) => (
          <div key={r} className="border-t border-hairlineStrong pt-5">
            <div className="label">{r}</div>
            <div className="mt-3 text-[28px] text-white">
              {counts[r]}
            </div>
          </div>
        ))}
      </div>

      <div className="py-12">
        <div className="grid grid-cols-12 gap-4 border-b border-hairline py-4">
          <div className="col-span-4 label">Athlete</div>
          <div className="col-span-2 label">Position</div>
          <div className="col-span-2 label">Readiness</div>
          <div className="col-span-2 label">Confidence</div>
          <div className="col-span-2 label text-right">Next step</div>
        </div>
        <ol>
          {rows.map(({ p, athlete: a }) => (
            <li key={a.id}>
              <Link
                href={`/squad/${a.id}`}
                className="group grid grid-cols-12 items-baseline gap-4 border-b border-hairline py-6 transition-colors duration-500 ease-atlas hover:bg-white/[0.02]"
              >
                <div className="col-span-4 text-[16px] tracking-tightish text-white">
                  {a.name}
                </div>
                <div className="col-span-2 text-[13px] tracking-tightish text-bone-200">
                  {a.positionLabel}
                </div>
                <div className="col-span-2 text-[11px] uppercase tracking-[0.18em] text-accent-tint">
                  {p.status}
                </div>
                <div className="col-span-2 text-[13px] tracking-tightish text-bone-200">
                  {p.confidence}
                </div>
                <div className="col-span-2 text-right meta text-bone-300">
                  {p.nextStepSummary}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
