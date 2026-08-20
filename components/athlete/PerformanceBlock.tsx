"use client";

import type { Athlete } from "@/lib/types";
import { Section } from "../ui/Section";

function Metric({
  label,
  value,
  unit,
  hint,
  emphasis,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="border-t border-hairline py-8">
      <div className="label">{label}</div>
      <div className="mt-6 flex items-baseline gap-2">
        <span
          className={`display text-[52px] ${emphasis ? "text-accent-tint" : "text-white"}`}
        >
          {value}
        </span>
        {unit ? (
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-bone-400">
            {unit}
          </span>
        ) : null}
      </div>
      {hint ? <div className="meta mt-4">{hint}</div> : null}
    </div>
  );
}

export function PerformanceBlock({ athlete }: { athlete: Athlete }) {
  const p = athlete.performance;
  const trend = `${p.trendPct > 0 ? "+" : ""}${p.trendPct}%`;
  return (
    <Section
      title="Performance"
      aside="Rolling window over the last 90 days."
      delay={0.12}
    >
      <div className="grid grid-cols-2 gap-x-10 md:grid-cols-4">
        <Metric label="Minutes" value={p.minutes.toLocaleString()} />
        <Metric label="Starts" value={String(p.starts)} />
        <Metric label="Availability" value={`${p.availabilityPct}`} unit="%" />
        <Metric
          label="Performance trend"
          value={trend}
          emphasis={p.trendPct > 0}
          hint={
            p.trendPct >= 0
              ? "Ahead of the prior window."
              : "Below the prior window. Worth checking the load."
          }
        />
      </div>
    </Section>
  );
}
