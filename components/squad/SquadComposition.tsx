"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { athletes as seedAthletes } from "@/data/athletes";
import { getPathway } from "@/data/pathways";
import { ATHLETE_SIGNALS, signalsFor } from "@/data/athlete-state";
import { useRoster } from "@/data/use-roster";
import { useOnboarding } from "@/data/onboarding";
import { useUserStore } from "@/data/user-store";
import { StateDot } from "@/components/ui/StateDot";
import { Segmented } from "@/components/ui/Segmented";
import { Tooltip } from "@/components/ui/Tooltip";
import { PrimaryButton, GhostButton } from "@/components/ui/Field";
import { AddAthleteModal } from "./AddAthleteModal";
import { ImportRosterModal } from "./ImportRosterModal";

type Filter = "All" | "First Team" | "U21" | "U19" | "Loan";
const FILTERS: Filter[] = ["All", "First Team", "U21", "U19", "Loan"];

const GROUPS: { key: string; label: string; positions: string[] }[] = [
  { key: "GK", label: "Goalkeepers", positions: ["GK"] },
  { key: "DEF", label: "Defenders", positions: ["CB", "RB", "LB"] },
  { key: "MID", label: "Midfielders", positions: ["DM", "CM", "AM"] },
  { key: "ATT", label: "Attackers", positions: ["RW", "LW", "CF"] },
];

function matches(f: Filter, a: (typeof seedAthletes)[number]) {
  if (f === "All") return true;
  return a.team === f;
}

export function SquadComposition() {
  const [filter, setFilter] = useState<Filter>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const roster = useRoster();
  const demoMode = useOnboarding((s) => s.demoMode);
  const setDemoMode = useOnboarding((s) => s.setDemoMode);
  const pathwayNotes = useUserStore((s) => s.pathwayNotes);

  const rows = useMemo(() => roster.filter((a) => matches(filter, a)), [roster, filter]);

  if (roster.length === 0) {
    return (
      <EmptyState
        onAdd={() => setAddOpen(true)}
        onImport={() => setImportOpen(true)}
        onLoadDemo={() => setDemoMode(true)}
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        importOpen={importOpen}
        setImportOpen={setImportOpen}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-10 pt-4">
        <Segmented
          value={filter}
          onChange={(v) => setFilter(v)}
          align="left"
          options={FILTERS.map((f) => ({ value: f, label: f }))}
          ariaLabel="Filter squad"
        />
        <div className="flex items-center gap-3">
          {!demoMode ? (
            <>
              <GhostButton onClick={() => setImportOpen(true)}>
                <Upload size={12} strokeWidth={1.6} />
                Import
              </GhostButton>
              <PrimaryButton onClick={() => setAddOpen(true)}>
                <Plus size={12} strokeWidth={1.6} />
                Add athlete
              </PrimaryButton>
            </>
          ) : null}
          <div className="text-[12px] tracking-tightish text-bone-400">
            {rows.length}
          </div>
        </div>
      </div>

      {GROUPS.map((g) => {
        const inGroup = rows.filter((a) => g.positions.includes(a.position));
        if (inGroup.length === 0) return null;
        return (
          <section key={g.key} className="atlas-enter pb-16 pt-10">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-[13px] font-medium uppercase tracking-[0.22em] text-bone-400">
                {g.label}
              </h2>
              <span className="text-[11px] tracking-tightish text-bone-500">
                {inGroup.length}
              </span>
            </div>

            <ol className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
              {inGroup.map((a) => {
                const signals = ATHLETE_SIGNALS[a.id] ?? signalsFor(a);
                const p = getPathway(a.id);
                const status = p?.status ?? pathwayNotes[a.id]?.status ?? "On Track";
                const ringTone = ringToneFor(status, signals.composite);
                const statusColor = statusColorClass(status);
                const loanClub =
                  a.team === "Loan"
                    ? p?.loanClub ??
                      a.loanStatus
                        ?.replace(/^On loan at /, "")
                        .replace(/ for .*$/, "") ??
                      ""
                    : "";
                return (
                  <li key={a.id}>
                    <Link
                      href={`/squad/${a.id}`}
                      className="group grid grid-cols-[24px_1fr_auto] items-center gap-5 py-4 transition-colors duration-300 hover:bg-white/[0.02] rounded-xl px-3 -mx-3"
                    >
                      <Tooltip
                        side="right"
                        wide
                        title={status}
                        hint={statusExplainer(status)}
                      >
                        <StateDot tone={ringTone} size={14} />
                      </Tooltip>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-3">
                          <span className="text-[17px] tracking-tightish text-white truncate">
                            {a.name}
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.14em] text-bone-500">
                            {a.position}
                          </span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-4 text-[12px] tracking-tightish text-bone-400">
                          {loanClub ? (
                            <span className="truncate">On loan at {loanClub}</span>
                          ) : (
                            <>
                              <span>{a.age} yrs</span>
                              <span>{a.team}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div
                        className={`text-right text-[11px] font-medium uppercase tracking-[0.16em] ${statusColor}`}
                      >
                        {status}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <AddAthleteModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ImportRosterModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

function EmptyState({
  onAdd,
  onImport,
  onLoadDemo,
  addOpen,
  setAddOpen,
  importOpen,
  setImportOpen,
}: {
  onAdd: () => void;
  onImport: () => void;
  onLoadDemo: () => void;
  addOpen: boolean;
  setAddOpen: (v: boolean) => void;
  importOpen: boolean;
  setImportOpen: (v: boolean) => void;
}) {
  return (
    <>
      <div className="mx-auto max-w-[520px] pb-16 pt-20 text-center">
        <div className="mx-auto mb-8 h-[10px] w-[10px] rounded-full bg-accent" />
        <h2 className="display text-[36px] leading-tight tracking-tightest text-white md:text-[44px]">
          Your squad is empty.
        </h2>
        <p className="mx-auto mt-6 max-w-[42ch] text-[15px] leading-relaxed tracking-tightish text-bone-300">
          Add your first athlete, paste your roster in, or explore Atlas with a sample squad.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton onClick={onAdd}>
            <Plus size={12} strokeWidth={1.6} />
            Add athlete
          </PrimaryButton>
          <GhostButton onClick={onImport}>
            <Upload size={12} strokeWidth={1.6} />
            Import roster
          </GhostButton>
        </div>

        <button
          onClick={onLoadDemo}
          className="mt-8 text-[11px] uppercase tracking-[0.18em] text-bone-500 transition-colors hover:text-white"
        >
          Or explore a sample squad
        </button>
      </div>

      <AddAthleteModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ImportRosterModal open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}

function statusExplainer(status?: string) {
  switch (status) {
    case "Ready":
      return "Doing so well they are ready to move up.";
    case "On Track":
      return "Everything looks good. No action needed.";
    case "At Risk":
      return "Falling behind. Keep an eye on this one.";
    case "Blocked":
      return "Something is stopping them from moving forward.";
    default:
      return "Current pathway status.";
  }
}

function ringToneFor(status: string, composite: number): "accent" | "moss" | "amber" | "rose" {
  if (status === "Ready") return "accent";
  if (status === "Blocked") return "rose";
  if (status === "At Risk") return "amber";
  if (composite >= 75) return "moss";
  if (composite >= 55) return "amber";
  return "rose";
}

function statusColorClass(status: string) {
  switch (status) {
    case "Ready":
      return "text-accent-tint";
    case "At Risk":
      return "text-signal-amber";
    case "Blocked":
      return "text-signal-rose";
    case "On Track":
    default:
      return "text-bone-400";
  }
}
