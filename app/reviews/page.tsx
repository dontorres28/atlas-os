import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { ReviewRoom } from "@/components/reviews/ReviewRoom";

export default function ReviewsPage() {
  return (
    <>
      <ModuleHeader
        title="Reviews"
        subtitle="Who has been reviewed, what changed, and what decisions came out."
      />
      <ReviewRoom />
    </>
  );
}
