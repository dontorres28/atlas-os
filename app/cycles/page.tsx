import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { SeasonTimeline } from "@/components/cycles/SeasonTimeline";

export default function CyclesPage() {
  return (
    <>
      <ModuleHeader
        section="Cycles / 04"
        title="Sporting Year"
        subtitle="2026 / 27. The reviews that shape the season, in order."
      />
      <SeasonTimeline />
    </>
  );
}
