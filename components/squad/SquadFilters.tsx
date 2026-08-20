"use client";

import { PillFilter, type PillFilterOption } from "../ui/PillFilter";

export const SQUAD_FILTERS = [
  "All",
  "Goalkeepers",
  "Defenders",
  "Midfielders",
  "Attackers",
  "Academy",
  "Loan",
] as const;

export type SquadFilter = (typeof SQUAD_FILTERS)[number];

export function SquadFilters({
  value,
  onChange,
  counts,
}: {
  value: SquadFilter;
  onChange: (v: SquadFilter) => void;
  counts: Record<SquadFilter, number>;
}) {
  const options: PillFilterOption<SquadFilter>[] = SQUAD_FILTERS.map((f) => ({
    value: f,
    label: f,
    count: counts[f],
  }));
  return <PillFilter value={value} onChange={onChange} options={options} align="center" />;
}
