import { Skeleton, SkeletonRow } from "@/components/ui/Skeleton";

/**
 * Layout-matching placeholder for the Overview page. Renders while the
 * onboarding + user stores are still hydrating from localStorage, so
 * the initial paint isn't a blank canvas or a wrong roster.
 */
export function OverviewSkeleton() {
  return (
    <div aria-busy="true">
      {/* Greeting */}
      <div className="pt-4">
        <Skeleton height={54} width="52%" />
        <Skeleton className="mt-4" height={14} width="24%" />
      </div>

      {/* State line */}
      <div className="pb-10 pt-10">
        <Skeleton height={16} width="60%" />
      </div>

      {/* Today */}
      <section className="mx-auto max-w-[900px]">
        <div className="flex items-baseline justify-between border-b border-hairline pb-3">
          <Skeleton height={22} width={140} />
          <Skeleton height={10} width={90} />
        </div>
        <ol className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <SkeletonRow />
            </li>
          ))}
        </ol>
      </section>

      {/* SquadState hero */}
      <section className="structural-surface mx-auto mt-10 max-w-[900px] p-6 md:p-10">
        <div className="flex items-baseline justify-between">
          <Skeleton height={22} width={160} />
          <Skeleton height={10} width={90} />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mx-auto flex aspect-square max-w-[440px] items-center justify-center">
              <Skeleton
                width="70%"
                height="70%"
                radius={999}
                style={{ opacity: 0.6 }}
              />
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
