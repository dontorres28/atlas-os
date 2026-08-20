"use client";

import Link from "next/link";
import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCycle, cycleStatesFor } from "@/data/cycles";
import { athletes } from "@/data/athletes";
import { useAtlas } from "@/data/store";
import { formatDateLong } from "@/lib/utils";

const TODAY = "2026-08-17";

export default function CycleDetailPage() {
  const params = useParams<{ id: string }>();
  const cycle = getCycle(params.id);
  if (!cycle) return notFound();

  const reviews = useAtlas((s) => s.reviews);
  const decisions = useAtlas((s) => s.decisions);

  const states = useMemo(() => cycleStatesFor(cycle.id), [cycle.id]);
  const reviewedByAthlete = new Map(
    reviews.filter((r) => r.cycleId === cycle.id).map((r) => [r.athleteId, r]),
  );

  const withStatus = states.map((s) => {
    const a = athletes.find((x) => x.id === s.athleteId)!;
    const reviewed = reviewedByAthlete.get(s.athleteId);
    const status = reviewed
      ? "Reviewed"
      : s.reviewDueDate < TODAY
        ? "Overdue"
        : "Scheduled";
    return { s, a, reviewed, status };
  });

  const reviewedCount = withStatus.filter((x) => x.status === "Reviewed").length;
  const overdueCount = withStatus.filter((x) => x.status === "Overdue").length;
  const scheduledCount = withStatus.filter((x) => x.status === "Scheduled").length;
  const cycleDecisions = decisions.filter((d) => d.cycleId === cycle.id);

  return (
    <>
      <PageHeader
        section="Cycle"
        title={cycle.name}
        meta={`${cycle.type}. ${cycle.monthLabel.charAt(0) + cycle.monthLabel.slice(1).toLowerCase()} ${cycle.season}. Owned by ${cycle.owner}.`}
        actions={
          <Link
            href="/cycles"
            className="text-[11px] uppercase tracking-[0.16em] text-bone-400 hover:text-white"
          >
            All cycles
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-6 border-b border-hairline py-10 md:grid-cols-4 md:gap-8">
        <Tile label="Athletes" value={String(states.length)} />
        <Tile label="Reviewed" value={String(reviewedCount)} />
        <Tile label="Scheduled" value={String(scheduledCount)} />
        <Tile
          label="Overdue"
          value={String(overdueCount)}
          tone={overdueCount ? "warn" : "muted"}
        />
      </div>

      <section className="grid grid-cols-12 gap-8 border-b border-hairline py-16 md:gap-12">
        <div className="col-span-12 md:col-span-3">
          <h2 className="display text-[22px] tracking-tightish text-white">Cycle</h2>
        </div>
        <div className="col-span-12 md:col-span-9">
          <dl>
            <MetaRow k="Type" v={cycle.type} />
            <MetaRow k="Window" v={`${formatDateLong(cycle.startDate)} to ${formatDateLong(cycle.endDate)}`} />
            <MetaRow k="Owner" v={cycle.owner} />
            <MetaRow k="Participants" v={cycle.participants.join(", ")} />
            <MetaRow k="Scope" v={cycle.scope} />
            <MetaRow k="Status" v={cycle.status} />
          </dl>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-8 border-b border-hairline py-16 md:gap-12">
        <div className="col-span-12 md:col-span-3">
          <h2 className="display text-[22px] tracking-tightish text-white">Objectives</h2>
        </div>
        <ol className="col-span-12 md:col-span-9">
          {cycle.objectives.map((o, i) => (
            <li
              key={i}
              className="grid grid-cols-12 items-baseline gap-4 border-t border-hairlineStrong py-6 first:border-hairlineStrong last:border-b"
            >
              <span className="col-span-12 text-[16px] leading-relaxed tracking-tightish text-white">
                {o}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-12 gap-8 border-b border-hairline py-16 md:gap-12">
        <div className="col-span-12 md:col-span-3">
          <h2 className="display text-[22px] tracking-tightish text-white">
            Athletes to review
          </h2>
          <p className="meta mt-4 max-w-[28ch]">
            Each row leads straight to the athlete's review.
          </p>
        </div>
        <div className="col-span-12 md:col-span-9">
          {withStatus.length === 0 ? (
            <div className="border-t border-hairlineStrong py-10 text-[14px] tracking-tightish text-bone-400">
              No athletes scheduled into this cycle.
            </div>
          ) : (
            <ol>
              {withStatus
                .sort((a, b) => a.s.reviewDueDate.localeCompare(b.s.reviewDueDate))
                .map(({ s, a, status }) => {
                  const statusClass =
                    status === "Reviewed"
                      ? "text-signal-moss"
                      : status === "Overdue"
                        ? "text-signal-rose"
                        : "text-bone-300";
                  return (
                    <li key={a.id}>
                      <Link
                        href={`/squad/${a.id}`}
                        className="group grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-6 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
                      >
                        <span className="col-span-5 text-[16px] tracking-tightish text-white">
                          {a.name}
                        </span>
                        <span className="col-span-3 meta">
                          {a.team}, {a.positionLabel}
                        </span>
                        <span className={`col-span-2 text-[11px] uppercase tracking-[0.18em] ${statusClass}`}>
                          {status}
                        </span>
                        <span className="col-span-2 text-right text-[13px] text-bone-300">
                          Due {formatDateLong(s.reviewDueDate)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ol>
          )}
        </div>
      </section>

      <section className="grid grid-cols-12 gap-8 py-16 md:gap-12">
        <div className="col-span-12 md:col-span-3">
          <h2 className="display text-[22px] tracking-tightish text-white">
            Decisions produced
          </h2>
          <p className="meta mt-4 max-w-[28ch]">
            The decisions this cycle has generated so far.
          </p>
        </div>
        <div className="col-span-12 md:col-span-9">
          {cycleDecisions.length === 0 ? (
            <div className="border-t border-hairlineStrong py-10 text-[14px] tracking-tightish text-bone-400">
              No decisions recorded against this cycle yet.
            </div>
          ) : (
            <ol>
              {cycleDecisions.map((d) => {
                const a = athletes.find((x) => x.id === d.athleteId);
                return (
                  <li key={d.id}>
                    <Link
                      href={`/decisions/${d.id}`}
                      className="group grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-6 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
                    >
                      <span className="col-span-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent-tint">
                        Decision {d.code}
                      </span>
                      <span className="col-span-6 text-[16px] tracking-tightish text-white">
                        {d.summary}
                      </span>
                      <span className="col-span-2 meta">{a?.name ?? ""}</span>
                      <span className="col-span-2 text-right text-[11px] uppercase tracking-[0.16em] text-bone-400">
                        {d.status}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}

function Tile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warn" | "muted";
}) {
  const color =
    tone === "warn" ? "text-signal-rose" : tone === "muted" ? "text-bone-300" : "text-white";
  return (
    <div className="border-t border-hairlineStrong pt-5">
      <div className="label">{label}</div>
      <div className={`display mt-3 text-[40px] ${color}`}>{value}</div>
    </div>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-12 gap-4 border-t border-hairline py-4 first:border-hairlineStrong">
      <dt className="col-span-3 label">{k}</dt>
      <dd className="col-span-9 text-[14px] tracking-tightish text-white">{v}</dd>
    </div>
  );
}
