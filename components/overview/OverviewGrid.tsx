"use client";

import Link from "next/link";
import { athletes } from "@/data/athletes";
import { useAtlas } from "@/data/store";
import { seedCycles } from "@/data/cycles";
import { daysBetween } from "@/lib/utils";

const TODAY = "2026-08-17";

export function OverviewGrid() {
  const decisions = useAtlas((s) => s.decisions);
  const reviews = useAtlas((s) => s.reviews);

  const squadCount = athletes.length;
  const firstTeamCount = athletes.filter((a) => a.team === "First Team").length;
  const pathwayCandidates = athletes.filter(
    (a) => a.pathwayStage === "Progressing" || a.pathwayStage === "Prospect",
  ).length;
  const expiringContracts = athletes.filter((a) => {
    const d = daysBetween(TODAY, a.contract.expiry);
    return d >= 0 && d <= 365;
  }).length;
  const unavailable = athletes.filter(
    (a) => a.status === "Injured" || a.status === "International Duty",
  ).length;

  const activeCycle = seedCycles.find((c) => c.status === "Active");
  const cycleReviewed = activeCycle
    ? reviews.filter((r) => r.cycleId === activeCycle.id).length
    : 0;
  const cycleTotal = activeCycle ? activeCycle.athleteIds.length : 0;
  const cycleProgress = cycleTotal ? cycleReviewed / cycleTotal : 0;

  const pending = decisions.filter(
    (d) => d.status === "Pending" || d.status === "Active",
  ).length;
  const closed = decisions.filter((d) => d.status === "Closed" || d.outcome).length;
  const overdueDecisions = decisions.filter(
    (d) => !d.outcome && d.reviewDate && d.reviewDate < TODAY,
  ).length;

  return (
    <div className="py-16">
      {/* Lead briefing */}
      <div className="atlas-enter grid grid-cols-12 gap-8 md:gap-12">
        <div className="col-span-12 md:col-span-7">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
            Briefing
          </div>
          <p className="mt-6 text-[26px] leading-snug tracking-tightish text-white md:text-[32px]">
            {activeCycle ? activeCycle.name : "No cycle active"} is running.{" "}
            <span className="text-bone-300">
              {cycleReviewed} of {cycleTotal} First Team athletes reviewed so far.
            </span>{" "}
            {pending} decisions still open.{" "}
            <span className="text-bone-300">
              {expiringContracts} contracts run into their final year.
            </span>
          </p>

          {activeCycle ? (
            <Link
              href={`/cycles/${activeCycle.id}`}
              className="mt-10 block"
              aria-label="Open the active cycle"
            >
              <div className="flex items-baseline justify-between">
                <span className="label">Cycle progress</span>
                <span className="text-[12px] text-bone-300">
                  {Math.round(cycleProgress * 100)}%
                </span>
              </div>
              <div className="mt-3 h-px w-full bg-hairline">
                <div
                  className="h-px bg-accent transition-all"
                  style={{ width: `${cycleProgress * 100}%` }}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between meta">
                <span>{activeCycle.monthLabel.charAt(0) + activeCycle.monthLabel.slice(1).toLowerCase()} {activeCycle.season}</span>
                <span>Target close 31 Aug 2026</span>
              </div>
            </Link>
          ) : null}
        </div>

        <div className="col-span-12 md:col-span-5">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
            The room, right now
          </div>
          <dl className="mt-6">
            <RoomRow k="First Team" v={firstTeamCount} />
            <RoomRow k="Academy and B Team" v={athletes.filter((a) => a.team === "U21" || a.team === "U19").length} />
            <RoomRow k="Out on loan" v={athletes.filter((a) => a.team === "Loan").length} />
            <RoomRow k="Unavailable this week" v={unavailable} />
          </dl>
        </div>
      </div>

      {/* Data band */}
      <div className="atlas-enter mt-24 grid grid-cols-12 gap-0 border-y border-hairlineStrong md:gap-0" style={{animationDelay: "0.1s"}}>
        <Column
          label="Squad"
          primary={squadCount}
          rows={[
            ["First Team", firstTeamCount],
            ["Pathway candidates", pathwayCandidates],
            ["Expiring contracts", expiringContracts],
          ]}
          href="/squad"
        />
        <Column
          label="Reviews"
          primary={cycleReviewed}
          suffix={` of ${cycleTotal}`}
          rows={[
            ["Cycle", activeCycle?.name ?? ""],
            ["Opened", "1 Jul 2026"],
            ["Target close", "31 Aug 2026"],
          ]}
          href="/cycles"
        />
        <Column
          label="Decisions"
          primary={pending}
          suffix=" open"
          rows={[
            ["Closed on record", closed],
            ["Overdue for review", overdueDecisions],
            ["Total on record", decisions.length],
          ]}
          href="/decisions"
          last
        />
      </div>
    </div>
  );
}

function RoomRow({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex items-baseline justify-between border-t border-hairline py-3 first:border-hairlineStrong">
      <dt className="text-[14px] tracking-tightish text-bone-200">{k}</dt>
      <dd className="text-[15px] text-white">{v}</dd>
    </div>
  );
}

function Column({
  label,
  primary,
  suffix,
  rows,
  href,
  last,
}: {
  label: string;
  primary: number | string;
  suffix?: string;
  rows: [string, number | string][];
  href: string;
  last?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group col-span-12 block px-0 py-10 transition-colors duration-500 ease-atlas hover:bg-white/[0.02] md:col-span-4 md:px-8 ${
        last ? "" : "md:border-r md:border-hairline"
      }`}
    >
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
        {label}
      </div>
      <div className="mt-8 flex items-baseline gap-3">
        <span className="display text-[68px] tracking-tightest text-white md:text-[76px]">
          {primary}
        </span>
        {suffix ? (
          <span className="text-[12px] uppercase tracking-[0.16em] text-bone-400">
            {suffix}
          </span>
        ) : null}
      </div>
      <dl className="mt-10">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between border-t border-hairline py-3"
          >
            <dt className="text-[13px] tracking-tightish text-bone-300">{k}</dt>
            <dd className="text-[13px] text-white">{v}</dd>
          </div>
        ))}
      </dl>
    </Link>
  );
}
