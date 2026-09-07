"use client";

import { Greeting } from "@/components/overview/Greeting";
import { StateLine } from "@/components/overview/StateLine";
import { SquadState } from "@/components/overview/SquadState";
import { Today } from "@/components/overview/Today";
import { SquadTrend } from "@/components/overview/SquadTrend";
import { GettingStarted } from "@/components/overview/GettingStarted";
import { OverviewSkeleton } from "@/components/overview/OverviewSkeleton";
import { useRoster, useRosterHydrated } from "@/data/use-roster";
import { useOnboarding } from "@/data/onboarding";

export default function OverviewPage() {
  const hydrated = useRosterHydrated();
  const roster = useRoster();
  const demoMode = useOnboarding((s) => s.demoMode);
  const empty = roster.length === 0;

  // Show a layout-matching skeleton until both stores are settled;
  // otherwise the seed briefly leaks in before the real roster loads.
  if (!hydrated) return <OverviewSkeleton />;

  return (
    <>
      <Greeting name="Julián" />

      {empty ? (
        <GettingStarted />
      ) : (
        <>
          <StateLine />

          {/* Today comes first — it's the one reason a Sporting Director
              opens Atlas today. The SquadState gauge is a vital sign that
              sits underneath, not the headline. */}
          <div className="pt-6">
            <Today />
          </div>

          <section className="pt-4">
            <SquadState />
          </section>

          {demoMode && <SquadTrend />}
        </>
      )}
    </>
  );
}
