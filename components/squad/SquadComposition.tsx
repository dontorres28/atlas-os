"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { athletes as seedAthletes } from "@/data/athletes";
import { getPathway } from "@/data/pathways";
import { useRoster, useRosterHydrated } from "@/data/use-roster";
import { useOnboarding } from "@/data/onboarding";
import { useUserStore } from "@/data/user-store";
import { Segmented } from "@/components/ui/Segmented";
import { PrimaryButton, GhostButton } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import { AddAthleteModal } from "./AddAthleteModal";
import { ImportRosterModal } from "./ImportRosterModal";
import { SquadSkeleton } from "./SquadSkeleton";

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

  const hydrated = useRosterHydrated();
  const roster = useRoster();
  const demoMode = useOnboarding((s) => s.demoMode);
  const setDemoMode = useOnboarding((s) => s.setDemoMode);
  const pathwayNotes = useUserStore((s) => s.pathwayNotes);

  const rows = useMemo(() => roster.filter((a) => matches(filter, a)), [roster, filter]);

  if (!hydrated) return <SquadSkeleton />;

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

      <div className="flex flex-col gap-14">
        {GROUPS.map((g) => {
          const inGroup = rows.filter((a) => g.positions.includes(a.position));
          if (inGroup.length === 0) return null;
          return (
            <section key={g.key} className="atlas-enter">
              <div className="mb-4 flex items-baseline justify-between border-b border-hairline pb-3">
                <h2 className="display text-[22px] tracking-tightest text-white">
                  {g.label}
                </h2>
                <span className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
                  {inGroup.length} player{inGroup.length === 1 ? "" : "s"}
                </span>
              </div>

              <ol className="flex flex-col gap-2">
                {inGroup.map((a) => {
                  const p = getPathway(a.id);
                  const status = (p?.status ??
                    pathwayNotes[a.id]?.status ??
                    "On Track") as
                    | "Ready"
                    | "On Track"
                    | "At Risk"
                    | "Blocked";
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
                        className="content-surface group flex items-center gap-4 px-4 py-3.5 md:px-5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-3">
                            <span className="truncate text-[16px] tracking-tightish text-white">
                              {a.name}
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.14em] text-bone-500">
                              {a.positionLabel}
                            </span>
                          </div>
                          <div className="mt-1 text-[12px] tracking-tightish text-bone-400">
                            {loanClub
                              ? `On loan at ${loanClub}`
                              : `${a.age} years, ${a.team}`}
                          </div>
                        </div>
                        <StatusPill status={status} />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

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

function StatusPill({
  status,
}: {
  status: "Ready" | "On Track" | "At Risk" | "Blocked";
}) {
  const tone =
    status === "Ready"
      ? "bg-accent text-white border-accent"
      : status === "At Risk"
        ? "bg-signal-amber/20 text-signal-amber border-signal-amber/50"
        : status === "Blocked"
          ? "bg-signal-rose/20 text-signal-rose border-signal-rose/50"
          : "bg-white/[0.06] text-bone-100 border-hairlineStrong";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em]",
        tone,
      )}
    >
      {status}
    </span>
  );
}
