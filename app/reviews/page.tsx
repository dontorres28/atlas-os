import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { ReviewRoom } from "@/components/reviews/ReviewRoom";

export default function ReviewsPage() {
  return (
    <>
      <ModuleHeader
        section="Reviews / 05"
        title="Evaluation"
        subtitle="Who has been reviewed. What changed. What decisions came out."
      />
      <ReviewRoom />
    </>
  );
}
