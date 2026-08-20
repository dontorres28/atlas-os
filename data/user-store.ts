"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Athlete, Position, PositionGroup, SquadStatus, SquadTeam } from "@/lib/types";

export type NewAthlete = {
  name: string;
  age: number;
  dateOfBirth: string;
  nationality: string;
  height?: number;
  preferredFoot?: Athlete["preferredFoot"];
  position: Position;
  team: SquadTeam;
  contractExpiry: string; // ISO date
  role?: string;
};

export type PathwayNote = {
  status: "Ready" | "On Track" | "At Risk" | "Blocked";
  nextStep?: string;
  blocker?: string;
};

type UserStore = {
  hydrated: boolean;
  athletes: Athlete[];
  pathwayNotes: Record<string, PathwayNote>;
  addAthlete: (input: NewAthlete) => Athlete;
  updateAthlete: (id: string, patch: Partial<NewAthlete>) => Athlete | undefined;
  removeAthlete: (id: string) => void;
  importAthletes: (list: NewAthlete[]) => Athlete[];
  setPathwayNote: (id: string, note: PathwayNote) => void;
  clearAthletes: () => void;
  markHydrated: () => void;
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

function labelOf(p: Position): string {
  return {
    GK: "Goalkeeper",
    RB: "Right Back",
    LB: "Left Back",
    CB: "Centre Back",
    DM: "Defensive Midfielder",
    CM: "Central Midfielder",
    AM: "Attacking Midfielder",
    RW: "Right Winger",
    LW: "Left Winger",
    CF: "Centre Forward",
  }[p];
}

function groupOf(p: Position): PositionGroup {
  if (p === "GK") return "Goalkeepers";
  if (["RB", "LB", "CB"].includes(p)) return "Defenders";
  if (["DM", "CM", "AM"].includes(p)) return "Midfielders";
  return "Attackers";
}

function nextCode(existing: Athlete[]) {
  const nums = existing
    .map((a) => parseInt(a.code, 10))
    .filter((n) => Number.isFinite(n));
  return String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, "0");
}

function buildAthlete(input: NewAthlete, code: string): Athlete {
  const status: SquadStatus =
    input.team === "First Team"
      ? "First Team"
      : input.team === "U21"
        ? "U21"
        : input.team === "U19"
          ? "U19"
          : "Loan";
  return {
    id: uid("uath"),
    code,
    name: input.name.trim(),
    age: input.age,
    dateOfBirth: input.dateOfBirth,
    nationality: input.nationality,
    height: input.height ?? 180,
    preferredFoot: input.preferredFoot ?? "Right",
    position: input.position,
    positionLabel: labelOf(input.position),
    positionGroup: groupOf(input.position),
    team: input.team,
    status,
    pathwayStage: input.team === "First Team" ? "Core" : "Progressing",
    contract: { expiry: input.contractExpiry },
    lastReviewDate: undefined,
    performance: {
      minutes: 0,
      starts: 0,
      availabilityPct: 100,
      trendPct: 0,
    },
    developmentPriority: "Not set",
    developmentTimeline: [],
    role: input.role ?? labelOf(input.position),
  };
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      athletes: [],
      pathwayNotes: {},

      addAthlete: (input) => {
        const code = nextCode(get().athletes);
        const rec = buildAthlete(input, code);
        set((s) => ({ athletes: [...s.athletes, rec] }));
        return rec;
      },

      updateAthlete: (id, patch) => {
        let updated: Athlete | undefined;
        set((s) => ({
          athletes: s.athletes.map((a) => {
            if (a.id !== id) return a;
            const merged: NewAthlete = {
              name: patch.name ?? a.name,
              age: patch.age ?? a.age,
              dateOfBirth: patch.dateOfBirth ?? a.dateOfBirth,
              nationality: patch.nationality ?? a.nationality,
              height: patch.height ?? a.height,
              preferredFoot: patch.preferredFoot ?? a.preferredFoot,
              position: patch.position ?? a.position,
              team: patch.team ?? a.team,
              contractExpiry: patch.contractExpiry ?? a.contract.expiry,
              role: patch.role ?? a.role,
            };
            const next: Athlete = {
              ...a,
              name: merged.name,
              age: merged.age,
              dateOfBirth: merged.dateOfBirth,
              nationality: merged.nationality,
              height: merged.height ?? a.height,
              preferredFoot: merged.preferredFoot ?? a.preferredFoot,
              position: merged.position,
              positionLabel: labelOf(merged.position),
              positionGroup: groupOf(merged.position),
              team: merged.team,
              status:
                merged.team === "First Team"
                  ? "First Team"
                  : merged.team === "U21"
                    ? "U21"
                    : merged.team === "U19"
                      ? "U19"
                      : "Loan",
              contract: { expiry: merged.contractExpiry },
              role: merged.role ?? a.role,
            };
            updated = next;
            return next;
          }),
        }));
        return updated;
      },

      removeAthlete: (id) => {
        set((s) => {
          const { [id]: _removed, ...restNotes } = s.pathwayNotes;
          return {
            athletes: s.athletes.filter((a) => a.id !== id),
            pathwayNotes: restNotes,
          };
        });
      },

      importAthletes: (list) => {
        const existing = [...get().athletes];
        const created: Athlete[] = [];
        for (const input of list) {
          const code = nextCode([...existing, ...created]);
          const rec = buildAthlete(input, code);
          created.push(rec);
        }
        set((s) => ({ athletes: [...s.athletes, ...created] }));
        return created;
      },

      setPathwayNote: (id, note) => {
        set((s) => ({ pathwayNotes: { ...s.pathwayNotes, [id]: note } }));
      },

      clearAthletes: () => set({ athletes: [], pathwayNotes: {} }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "atlas-user-v2",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ athletes: s.athletes, pathwayNotes: s.pathwayNotes }),
    },
  ),
);
