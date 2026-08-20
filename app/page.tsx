"use client";

import { Greeting } from "@/components/overview/Greeting";
import { StateLine } from "@/components/overview/StateLine";
import { SquadState } from "@/components/overview/SquadState";
import { Today } from "@/components/overview/Today";
import { SquadTrend } from "@/components/overview/SquadTrend";
import { GettingStarted } from "@/components/overview/GettingStarted";
import { useRoster } from "@/data/use-roster";
import { useOnboarding } from "@/data/onboarding";

export default function OverviewPage() {
  const roster = useRoster();
  const demoMode = useOnboarding((s) => s.demoMode);
  const empty = roster.length === 0;

  return (
    <>
      <Greeting name="Julián" />

      {empty ? (
        <GettingStarted />
      ) : (
        <>
          <StateLine />

          <section className="grid grid-cols-1 gap-x-16 gap-y-4 pt-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <SquadState />
            </div>
            <div className="md:col-span-4">
              <Today />
            </div>
          </section>

          {/* Trend view depends on time-series history — only meaningful once
              enough data has accumulated. Shown in demo mode; hidden in fresh
              mode until we ship persistence to back it. */}
          {demoMode && <SquadTrend />}
        </>
      )}
    </>
  );
}
