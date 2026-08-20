import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { DecisionStream } from "@/components/decisions/DecisionStream";

export default function DecisionsPage() {
  return (
    <>
      <ModuleHeader title="Decisions" />
      <DecisionStream />
    </>
  );
}
