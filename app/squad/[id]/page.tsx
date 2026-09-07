"use client";

import { notFound, useParams } from "next/navigation";
import { useAthlete } from "@/data/athlete-lookup";
import { useUserStore } from "@/data/user-store";
import { AthleteHeader } from "@/components/athlete/AthleteHeader";
import { AthletePersonalState } from "@/components/athlete/AthletePersonalState";
import { AthleteActions } from "@/components/athlete/AthleteActions";
import { ReviewBlock } from "@/components/athlete/ReviewBlock";
import { DecisionsBlock } from "@/components/athlete/DecisionsBlock";
import { AthleteSkeleton } from "@/components/athlete/AthleteSkeleton";

export default function AthletePage() {
  const params = useParams<{ id: string }>();
  const athlete = useAthlete(params.id);
  const userHydrated = useUserStore((s) => s.hydrated);

  // Wait for the user store to hydrate before deciding the athlete is missing.
  // Otherwise a hard reload on a user-owned athlete route flashes 404.
  if (!athlete) {
    if (!userHydrated) return <AthleteSkeleton />;
    return notFound();
  }

  return (
    <>
      <AthleteHeader athlete={athlete} />
      <AthletePersonalState athlete={athlete} />
      <ReviewBlock athlete={athlete} />
      <DecisionsBlock athlete={athlete} />
      <AthleteActions athlete={athlete} />
    </>
  );
}
