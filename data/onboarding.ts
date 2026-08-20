"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SPORTS, sportById, type SportId } from "./sports";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

export type Role =
  | "Sporting Director"
  | "Head of Academy"
  | "Head of Performance"
  | "Technical Director"
  | "Club Executive"
  | "Other";

export type ClubType =
  | "Professional Club"
  | "Academy"
  | "Federation"
  | "Semi-professional Club";

export type MethodologyStyle = "Structured" | "Flexible" | "Hybrid";

export type Priority =
  | "Player Development"
  | "Squad Planning"
  | "Performance"
  | "Recruitment"
  | "Pathways"
  | "Long-term Planning";

export const ROLES: Role[] = [
  "Sporting Director",
  "Head of Academy",
  "Head of Performance",
  "Technical Director",
  "Club Executive",
  "Other",
];

export const CLUB_TYPES: ClubType[] = [
  "Professional Club",
  "Academy",
  "Federation",
  "Semi-professional Club",
];

export const METHODOLOGY_STYLES: MethodologyStyle[] = [
  "Structured",
  "Flexible",
  "Hybrid",
];

export const PRIORITIES: Priority[] = [
  "Player Development",
  "Squad Planning",
  "Performance",
  "Recruitment",
  "Pathways",
  "Long-term Planning",
];

/** Default football pathway — used when no sport is selected yet. */
export const DEFAULT_STRUCTURE = [
  "First Team",
  "U21 / B Team",
  "U19",
  "U17",
];

type OnboardingState = {
  hydrated: boolean;
  completed: boolean;
  /** True = show the demo football squad. False = user brings their own roster. */
  demoMode: boolean;
  step: Step;

  sport: SportId | "";
  user: { name: string; role: Role | "" };
  club: { name: string; type: ClubType | "" };
  structure: string[];
  methodology: {
    style: MethodologyStyle | "";
    priorities: Priority[];
  };

  setStep: (s: Step) => void;
  setSport: (s: SportId) => void;
  setUser: (u: Partial<OnboardingState["user"]>) => void;
  setClub: (c: Partial<OnboardingState["club"]>) => void;
  setStructure: (s: string[]) => void;
  setMethodology: (m: Partial<OnboardingState["methodology"]>) => void;
  togglePriority: (p: Priority) => void;

  setDemoMode: (m: boolean) => void;
  complete: () => void;
  reset: () => void;
  markHydrated: () => void;
};

const initial = {
  hydrated: false,
  completed: false,
  demoMode: true,
  step: 1 as Step,
  sport: "" as OnboardingState["sport"],
  user: { name: "", role: "" as OnboardingState["user"]["role"] },
  club: { name: "", type: "" as OnboardingState["club"]["type"] },
  structure: [...DEFAULT_STRUCTURE],
  methodology: {
    style: "" as OnboardingState["methodology"]["style"],
    priorities: [] as Priority[],
  },
};

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initial,

      setStep: (s) => set({ step: s }),
      setSport: (id) => {
        const profile = sportById(id);
        // Reset structure to the sport's default whenever the sport changes,
        // as long as the user hasn't customised it (or came from a different sport).
        const current = get().structure;
        const defaultsForCurrentSport = SPORTS.map((s) => s.defaultStages);
        const isStillDefault = defaultsForCurrentSport.some(
          (d) => d.length === current.length && d.every((x, i) => x === current[i]),
        );
        set({
          sport: id,
          structure: profile && isStillDefault ? [...profile.defaultStages] : current,
        });
      },
      setUser: (u) => set((st) => ({ user: { ...st.user, ...u } })),
      setClub: (c) => set((st) => ({ club: { ...st.club, ...c } })),
      setStructure: (structure) => set({ structure }),
      setMethodology: (m) =>
        set((st) => ({ methodology: { ...st.methodology, ...m } })),
      togglePriority: (p) =>
        set((st) => {
          const has = st.methodology.priorities.includes(p);
          if (has)
            return {
              methodology: {
                ...st.methodology,
                priorities: st.methodology.priorities.filter((x) => x !== p),
              },
            };
          if (st.methodology.priorities.length >= 3) return st;
          return {
            methodology: {
              ...st.methodology,
              priorities: [...st.methodology.priorities, p],
            },
          };
        }),

      setDemoMode: (m) => set({ demoMode: m }),
      complete: () => set({ completed: true, step: 6 }),
      reset: () => set({ ...initial, hydrated: true }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "atlas-onboarding-v2",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        completed: s.completed,
        demoMode: s.demoMode,
        step: s.step,
        sport: s.sport,
        user: s.user,
        club: s.club,
        structure: s.structure,
        methodology: s.methodology,
      }),
    },
  ),
);
