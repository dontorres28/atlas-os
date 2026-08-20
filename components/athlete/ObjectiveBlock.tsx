"use client";

import type { Athlete } from "@/lib/types";
import { getPathway } from "@/data/pathways";
import { formatDateLong } from "@/lib/utils";
import { Section } from "../ui/Section";

export function ObjectiveBlock({ athlete }: { athlete: Athlete }) {
  const pathway = getPathway(athlete.id);
  const why = pathway?.blocker
    ? `Currently blocked by ${pathway.blocker.toLowerCase()}.`
    : `Below the club threshold for ${athlete.positionLabel.toLowerCase()}s in the ${athlete.team}.`;
  const target =
    pathway?.status === "Ready"
      ? "Hold the Level 4 evaluation standard across an eight-week window."
      : "Reach the Level 3 evaluation standard by the next review.";
  const review = athlete.lastReviewDate
    ? formatDateLong(nextReviewDate(athlete.lastReviewDate))
    : "Not scheduled.";

  return (
    <Section title="Objective" delay={0.15}>
      <dl>
        <Row k="Current priority" v={athlete.developmentPriority} strong />
        <Row k="Why" v={why} />
        <Row k="Target" v={target} />
        <Row k="Review" v={review} />
      </dl>
    </Section>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-12 gap-4 border-t border-hairline py-5 first:border-hairlineStrong">
      <dt className="col-span-3 label">{k}</dt>
      <dd
        className={
          strong
            ? "col-span-9 text-[17px] leading-relaxed tracking-tightish text-white"
            : "col-span-9 text-[14px] leading-relaxed tracking-tightish text-bone-200"
        }
      >
        {v}
      </dd>
    </div>
  );
}

function nextReviewDate(iso: string) {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + 4);
  return d.toISOString().slice(0, 10);
}
