import { Skeleton, SkeletonLines } from "@/components/ui/Skeleton";

/**
 * Placeholder for the athlete profile page during hydration.
 */
export function AthleteSkeleton() {
  return (
    <div aria-busy="true">
      {/* Header */}
      <div className="pt-6">
        <Skeleton height={12} width={80} />
        <Skeleton className="mt-4" height={54} width="55%" />
        <div className="mt-4 flex items-baseline gap-6">
          <Skeleton height={12} width={80} />
          <Skeleton height={12} width={40} />
          <Skeleton height={12} width={70} />
        </div>
      </div>

      {/* Personal state block */}
      <section className="grid grid-cols-1 gap-x-16 gap-y-8 border-b border-hairline py-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="mx-auto flex aspect-square max-w-[260px] items-center justify-center">
            <Skeleton
              width="70%"
              height="70%"
              radius={999}
              style={{ opacity: 0.55 }}
            />
          </div>
        </div>
        <div className="md:col-span-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between border-t border-hairline pt-4"
              >
                <Skeleton height={12} width={120} />
                <Skeleton height={20} width={40} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two blocks */}
      {[0, 1].map((i) => (
        <section key={i} className="border-b border-hairline py-14">
          <Skeleton height={16} width={140} />
          <div className="mt-6">
            <SkeletonLines count={3} />
          </div>
        </section>
      ))}
    </div>
  );
}
