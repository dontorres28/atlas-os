import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { briefs, briefAthletes } from "@/data/recruitment";

export default function RecruitmentPage() {
  return (
    <>
      <ModuleHeader
        section="Recruitment / 09"
        title="Open Requirements"
        subtitle="Begin with the sporting need. Solve internally before recruiting externally."
      />

      <div>
        {briefs.map((b) => {
          const internal = briefAthletes(b);
          return (
            <section
              key={b.code}
              className="atlas-enter border-t border-hairline py-16"
            >
              {/* Brief head */}
              <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12">
                <div className="md:col-span-8">
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
                    Brief {b.code}
                  </div>
                  <h2 className="display mt-6 text-[44px] leading-none tracking-tightest text-white md:text-[56px]">
                    {b.title}
                  </h2>
                  <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed tracking-tightish text-bone-200">
                    {b.reason}
                  </p>
                </div>

                <div className="md:col-span-4 md:justify-self-end">
                  <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                    Priority
                  </div>
                  <div
                    className={`display mt-3 text-[28px] tracking-tightish ${
                      b.priority === "High"
                        ? "text-signal-rose"
                        : b.priority === "Medium"
                          ? "text-signal-amber"
                          : "text-bone-300"
                    }`}
                  >
                    {b.priority}
                  </div>
                  <div
                    className={`mt-4 text-[11px] uppercase tracking-[0.18em] ${
                      b.externalRequired ? "text-accent-tint" : "text-signal-moss"
                    }`}
                  >
                    {b.externalRequired
                      ? "External recruitment required"
                      : "Internal candidate available"}
                  </div>
                </div>
              </div>

              {/* Criteria */}
              <div className="mt-12 border-t border-hairlineStrong pt-8">
                <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                  Criteria
                </div>
                <ol className="mt-6 grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-x-16">
                  {b.criteria.map((c, i) => (
                    <li
                      key={c}
                      className="flex items-baseline gap-4 border-t border-hairline py-3 first:border-t-0 md:[&:nth-child(2)]:border-t-0"
                    >
                      <span className="text-[10px] tracking-[0.16em] text-bone-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] tracking-tightish text-bone-100">
                        {c}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Internal options */}
              <div className="mt-14">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
                  Internal options first
                </div>

                <ol className="mt-6">
                  {internal.map((opt) => (
                    <li key={opt.athleteId}>
                      <Link
                        href={`/squad/${opt.athlete.id}`}
                        className="group grid grid-cols-[110px_1fr_110px_120px] items-baseline gap-6 border-t border-hairline py-6 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
                      >
                        <span className="text-[11px] uppercase tracking-[0.18em] text-bone-400">
                          {opt.source}
                        </span>
                        <div>
                          <div className="text-[17px] tracking-tightish text-white">
                            {opt.athlete.name}
                          </div>
                          <div className="mt-1 text-[13px] tracking-tightish text-bone-400">
                            {opt.note}
                          </div>
                        </div>
                        <span
                          className={`text-[11px] uppercase tracking-[0.18em] ${
                            opt.fit === "High"
                              ? "text-accent-tint"
                              : opt.fit === "Medium"
                                ? "text-bone-300"
                                : "text-bone-500"
                          }`}
                        >
                          Fit {opt.fit}
                        </span>
                        <span className="text-right text-[13px] tracking-tightish text-bone-400">
                          {opt.athlete.age} yrs, {opt.athlete.positionLabel}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <button className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-accent-tint transition-colors hover:text-white">
                  Open external search
                  <ArrowRight
                    size={12}
                    strokeWidth={1.4}
                    className="transition-transform duration-500 ease-atlas group-hover:translate-x-1"
                  />
                </button>
                <span className="text-[11px] tracking-tightish text-bone-500">
                  Linked to Planning gap {b.code}
                </span>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
