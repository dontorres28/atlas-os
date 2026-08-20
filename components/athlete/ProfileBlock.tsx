import type { Athlete } from "@/lib/types";
import { formatDateLong, yearOf } from "@/lib/utils";
import { Section } from "../ui/Section";

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between border-t border-hairline py-4">
      <dt className="text-[13px] tracking-tightish text-bone-300">{k}</dt>
      <dd className="text-[13px] text-white">{v}</dd>
    </div>
  );
}

export function ProfileBlock({ athlete }: { athlete: Athlete }) {
  return (
    <Section title="Profile" delay={0.06}>
      <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
        <dl>
          <KV k="Nationality" v={athlete.nationality} />
          <KV k="Date of birth" v={formatDateLong(athlete.dateOfBirth)} />
          <KV k="Height" v={`${athlete.height} cm`} />
          <KV k="Preferred foot" v={athlete.preferredFoot} />
        </dl>
        <dl>
          <KV k="Current team" v={athlete.team} />
          <KV k="Squad status" v={athlete.status} />
          <KV k="Contract expiry" v={formatDateLong(athlete.contract.expiry)} />
          <KV k="Season end" v={yearOf(athlete.contract.expiry)} />
        </dl>
      </div>
    </Section>
  );
}
