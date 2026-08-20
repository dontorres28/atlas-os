"use client";

import { athletes as seedAthletes } from "./athletes";
import { useOnboarding } from "./onboarding";
import { useUserStore } from "./user-store";
import type { Athlete } from "@/lib/types";

/**
 * Roster resolver.
 *
 * If demoMode is on (default before onboarding completes, or if the user
 * chose to explore with the sample squad), return the seeded football
 * roster. Otherwise return the club's own athletes from the user store.
 */
export function useRoster(): Athlete[] {
  const demoMode = useOnboarding((s) => s.demoMode);
  const onboardingHydrated = useOnboarding((s) => s.hydrated);
  const userAthletes = useUserStore((s) => s.athletes);
  const userHydrated = useUserStore((s) => s.hydrated);

  // While either store is still hydrating client-side, prefer the seed
  // so SSR and first paint stay stable.
  if (!onboardingHydrated || !userHydrated) return seedAthletes;

  return demoMode ? seedAthletes : userAthletes;
}
