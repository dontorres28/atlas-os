import Link from "next/link";
import { athletes } from "@/data/athletes";
import { daysBetween } from "@/lib/utils";

export function AttentionList() {
  const today = "2026-08-17";
  const items = athletes
    .map((a) => {
      if (a.attention)
        return { athlete: a, headline: a.attention.kind, sub: a.attention.note };
      const daysToExpiry = daysBetween(today, a.contract.expiry);
      if (daysToExpiry >= 0 && daysToExpiry <= 90) {
        return {
          athlete: a,
          headline: "Contract",
          sub: `Decision window closes in ${daysToExpiry} days`,
        };
      }
      return null;
    })
    .filter((v): v is { athlete: (typeof athletes)[number]; headline: string; sub: string } => !!v)
    .slice(0, 5);

  return (
    <section
      className="atlas-enter grid grid-cols-12 gap-8 border-t border-hairline py-20 md:gap-12"
      style={{ animationDelay: "0.22s" }}
    >
      <div className="col-span-12 md:col-span-3">
        <h2 className="display text-[22px] tracking-tightish text-white">
          Attention
        </h2>
        <p className="meta mt-4 max-w-[28ch]">
          Athletes with an open decision or a deadline coming up soon.
        </p>
      </div>
      <div className="col-span-12 md:col-span-9">
        <ol>
          {items.map((it) => (
            <li key={it.athlete.id}>
              <Link
                href={`/squad/${it.athlete.id}`}
                className="group grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-6 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
              >
                <span className="col-span-5 text-[17px] tracking-tightish text-white">
                  {it.athlete.name}
                </span>
                <span className="col-span-3 meta">
                  {it.athlete.team}, {it.athlete.positionLabel}
                </span>
                <span className="col-span-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent-tint">
                  {it.headline}
                </span>
                <span className="col-span-2 text-right meta text-bone-200">
                  {it.sub}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
