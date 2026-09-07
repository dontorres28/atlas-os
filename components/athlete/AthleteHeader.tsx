import type { Athlete } from "@/lib/types";
import { BackLink } from "@/components/ui/BackLink";

export function AthleteHeader({ athlete }: { athlete: Athlete }) {
  return (
    <div className="atlas-enter border-b border-hairline pb-16 pt-14">
      <BackLink href="/squad" label="Squad" />

      <div className="mt-10 text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
        Athlete
      </div>

      <h1 className="display mt-6 text-[76px] text-white md:text-[92px]">
        {athlete.name}
      </h1>

      <div className="mt-10 flex flex-wrap items-baseline gap-x-12 gap-y-3">
        <span className="text-[16px] tracking-tightish text-white">
          {athlete.positionLabel}
        </span>
        <span className="text-[16px] tracking-tightish text-white">
          {athlete.age}
        </span>
        <span className="text-[16px] tracking-tightish text-white">
          {athlete.team}
        </span>
        <span className="meta text-bone-300">{athlete.role}</span>
      </div>

      {athlete.attention ? (
        <div className="mt-10 inline-flex items-center gap-4 rounded-full border border-accent/40 bg-accent-wash px-5 py-2.5">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent-tint">
            Attention
          </span>
          <span className="text-[13px] tracking-tightish text-white">
            {athlete.attention.kind}
          </span>
          <span className="meta text-bone-300">{athlete.attention.note}</span>
        </div>
      ) : null}
    </div>
  );
}
