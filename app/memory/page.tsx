import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { memoryEvents } from "@/data/memory";

export default function MemoryPage() {
  const byYear = new Map<number, typeof memoryEvents>();
  for (const ev of memoryEvents) {
    if (!byYear.has(ev.year)) byYear.set(ev.year, []);
    byYear.get(ev.year)!.push(ev);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <>
      <ModuleHeader
        section="Memory / 10"
        title="Club Sporting History"
        subtitle="The long thread. Every decision, why it was made, and what actually happened."
      />

      <div className="mx-auto mt-2 max-w-[900px]">
        {years.map((year) => {
          const events = byYear.get(year)!;
          return (
            <section key={year} className="border-t border-hairline py-16">
              <div className="grid grid-cols-1 gap-x-16 md:grid-cols-[140px_1fr]">
                <div className="atlas-enter">
                  <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                    Season
                  </div>
                  <div className="display mt-4 text-[64px] leading-none tracking-tightest text-white">
                    {year}
                  </div>
                  <div className="mt-3 text-[11px] tracking-tightish text-bone-500">
                    {events.length} entr{events.length === 1 ? "y" : "ies"}
                  </div>
                </div>

                <ol className="relative">
                  {events.map((ev, i) => {
                    const inner = (
                      <div className="grid grid-cols-[100px_1fr] items-baseline gap-8 py-6 pl-8">
                        <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                          {ev.kind}
                        </div>
                        <div>
                          <div className="text-[19px] leading-tight tracking-tightish text-white transition-colors group-hover:text-accent-tint">
                            {ev.title}
                          </div>
                          <div className="mt-2 text-[13px] leading-relaxed text-bone-300">
                            {ev.detail}
                          </div>
                          <div className="mt-4 flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-bone-500">
                            <span>{ev.date}</span>
                            {ev.href ? (
                              <span className="inline-flex items-center gap-1 text-accent-tint transition-transform duration-500 ease-atlas group-hover:translate-x-1">
                                Open
                                <ArrowRight size={11} strokeWidth={1.4} />
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );

                    return (
                      <li key={ev.id} className="relative">
                        {/* Spine */}
                        <span
                          aria-hidden
                          className={`absolute left-[3px] top-0 h-full w-px bg-hairlineStrong ${
                            i === events.length - 1 ? "bottom-1/2 h-1/2" : ""
                          }`}
                        />
                        <span
                          aria-hidden
                          className="absolute left-0 top-9 h-[7px] w-[7px] rounded-full bg-bone-500"
                        />
                        {ev.href ? (
                          <Link
                            href={ev.href}
                            className="group block border-b border-hairline transition-colors duration-500 ease-atlas hover:bg-white/[0.02]"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <div className="group block border-b border-hairline">
                            {inner}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
