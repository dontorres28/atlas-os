"use client";

import { useMemo } from "react";
import { athletes as seedAthletes } from "./athletes";
import { useUserStore } from "./user-store";
import type { Athlete } from "@/lib/types";

/**
 * Look up an athlete by id across both the seed roster and the user's
 * own roster. Returns undefined if nothing matches.
 */
export function useAthlete(id: string): Athlete | undefined {
  const userAthletes = useUserStore((s) => s.athletes);
  return useMemo(() => {
    return (
      seedAthletes.find((a) => a.id === id) ??
      userAthletes.find((a) => a.id === id)
    );
  }, [id, userAthletes]);
}
