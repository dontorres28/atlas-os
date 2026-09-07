import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { DecisionStream } from "@/components/decisions/DecisionStream";
import { RecordDecisionButton } from "@/components/decisions/RecordDecisionButton";

export default function DecisionsPage() {
  return (
    <>
      <ModuleHeader title="Decisions" />
      <div className="mx-auto mb-8 flex max-w-[900px] items-center justify-end">
        <RecordDecisionButton />
      </div>
      <DecisionStream />
    </>
  );
}
