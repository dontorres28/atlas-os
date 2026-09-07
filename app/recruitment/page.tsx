import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { briefs, briefAthletes } from "@/data/recruitment";
import { Watchlist } from "@/components/recruitment/Watchlist";

export default function RecruitmentPage() {
  return (
    <>
      <ModuleHeader
        title="Recruitment"
        subtitle="Prospects the club is tracking, and the sporting needs behind them."
      />

      <div className="mx-auto flex max-w-[900px] flex-col gap-14 pb-8">
        <Watchlist />

        {briefs.map((b) => {
          const internal = briefAthletes(b);
          return (
            <section key={b.code} className="atlas-enter">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
                    Brief {b.code}
                  </div>
                  <h2 className="display mt-3 text-[26px] leading-tight tracking-tightest text-white md:text-[30px]">
                    {b.title}
                  </h2>
                </div>
                <PriorityPill priority={b.priority} />
              </div>

              <p className="mt-6 max-w-[58ch] text-[14px] leading-relaxed tracking-tightish text-bone-200">
                {b.reason}
              </p>

              <div
                className={`mt-4 text-[11px] uppercase tracking-[0.18em] ${
                  b.externalRequired ? "text-accent-tint" : "text-signal-moss"
                }`}
              >
                {b.externalRequired
                  ? "External recruitment required"
                  : "Internal candidate available"}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {b.criteria.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full border border-hairline bg-white/[0.02] px-3 py-1 text-[12px] tracking-tightish text-bone-200"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {internal.length > 0 ? (
                <div className="mt-8">
                  <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                    Internal options first
                  </div>
                  <ol className="mt-4 flex flex-col gap-2">
                    {internal.map((opt) => (
                      <li key={opt.athleteId}>
                        <Link
                          href={`/squad/${opt.athlete.id}`}
                          className="content-surface group flex items-center gap-4 px-4 py-3 md:px-5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-3">
                              <span className="truncate text-[15px] tracking-tightish text-white">
                                {opt.athlete.name}
                              </span>
                              <span className="text-[11px] uppercase tracking-[0.14em] text-bone-500">
                                {opt.source}
                              </span>
                            </div>
                            <div className="mt-1 truncate text-[12px] tracking-tightish text-bone-400">
                              {opt.note}
                            </div>
                          </div>
                          <span
                            className={`shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] ${
                              opt.fit === "High"
                                ? "text-accent-tint"
                                : opt.fit === "Medium"
                                  ? "text-bone-200"
                                  : "text-bone-500"
                            }`}
                          >
                            {opt.fit} fit
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              <div className="mt-8">
                <button className="press-scale group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-accent-tint transition-colors hover:text-white">
                  Open external search
                  <ArrowRight
                    size={12}
                    strokeWidth={1.4}
                    className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                  />
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function PriorityPill({ priority }: { priority: "High" | "Medium" | "Watching" }) {
  const tone =
    priority === "High"
      ? "bg-signal-rose/20 text-signal-rose border-signal-rose/50"
      : priority === "Medium"
        ? "bg-signal-amber/20 text-signal-amber border-signal-amber/50"
        : "bg-white/[0.06] text-bone-200 border-hairlineStrong";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${tone}`}
    >
      {priority} priority
    </span>
  );
}
