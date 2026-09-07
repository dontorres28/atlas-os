import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SeasonTimeline } from "@/components/cycles/SeasonTimeline";

export default function CyclesPage() {
  return (
    <>
      <ModuleHeader
        title="Cycles"
        subtitle="The reviews that shape the 2026/27 season, in order."
      />
      <SeasonTimeline />
    </>
  );
}
