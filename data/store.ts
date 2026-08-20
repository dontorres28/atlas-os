"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Decision, DecisionOutcome, Review } from "@/lib/types";
import { seedReviews } from "./reviews";
import { seedDecisions } from "./decisions";

type NewReview = Omit<Review, "id">;
type NewDecision = Omit<Decision, "id" | "code" | "status" | "outcome"> & {
  status?: Decision["status"];
};

type AtlasState = {
  reviews: Review[];
  decisions: Decision[];
  addReview: (r: NewReview) => Review;
  addDecision: (d: NewDecision) => Decision;
  recordDecisionOutcome: (
    decisionId: string,
    outcome: Omit<DecisionOutcome, "recordedAt"> & { recordedAt?: string },
  ) => void;
  reviewsFor: (athleteId: string) => Review[];
  decisionsFor: (athleteId: string) => Decision[];
  decisionsInCycle: (cycleId: string) => Decision[];
  reviewsInCycle: (cycleId: string) => Review[];
  getDecision: (id: string) => Decision | undefined;
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

function nextDecisionCode(existing: Decision[]) {
  const numbers = existing
    .map((d) => parseInt(d.code, 10))
    .filter((n) => Number.isFinite(n));
  const max = numbers.length ? Math.max(...numbers) : 0;
  return String(max + 1).padStart(3, "0");
}

export const useAtlas = create<AtlasState>()(
  persist(
    (set, get) => ({
      reviews: seedReviews,
      decisions: seedDecisions,

      addReview: (r) => {
        const rec: Review = { ...r, id: uid("rev") };
        set((s) => ({ reviews: [rec, ...s.reviews] }));
        return rec;
      },

      addDecision: (d) => {
        const code = nextDecisionCode(get().decisions);
        const rec: Decision = {
          ...d,
          id: uid("dec"),
          code,
          status: d.status ?? "Active",
        };
        set((s) => ({ decisions: [rec, ...s.decisions] }));
        return rec;
      },

      recordDecisionOutcome: (decisionId, outcome) => {
        set((s) => ({
          decisions: s.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  status: "Closed",
                  outcome: {
                    actual: outcome.actual,
                    verdict: outcome.verdict,
                    recordedAt:
                      outcome.recordedAt ??
                      new Date().toISOString().slice(0, 10),
                    evidence: outcome.evidence,
                  },
                }
              : d,
          ),
        }));
      },

      reviewsFor: (athleteId) =>
        get()
          .reviews.filter((r) => r.athleteId === athleteId)
          .sort((a, b) => (a.date < b.date ? 1 : -1)),

      decisionsFor: (athleteId) =>
        get()
          .decisions.filter((d) => d.athleteId === athleteId)
          .sort((a, b) => (a.date < b.date ? 1 : -1)),

      decisionsInCycle: (cycleId) =>
        get().decisions.filter((d) => d.cycleId === cycleId),

      reviewsInCycle: (cycleId) =>
        get().reviews.filter((r) => r.cycleId === cycleId),

      getDecision: (id) => get().decisions.find((d) => d.id === id),
    }),
    {
      name: "atlas-os-v3",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ reviews: s.reviews, decisions: s.decisions }),
      skipHydration: true,
    },
  ),
);
