import { Skeleton, SkeletonRow } from "@/components/ui/Skeleton";

/**
 * Placeholder for the Squad page during store hydration.
 */
export function SquadSkeleton() {
  return (
    <div aria-busy="true">
      <div className="pb-10 pt-4">
        <Skeleton height={44} width={140} />
      </div>

      <div className="flex items-center justify-between pb-8">
        <Skeleton height={32} width={280} radius={999} />
        <Skeleton height={32} width={110} radius={999} />
      </div>

      <div className="flex flex-col gap-14">
        {["Goalkeepers", "Defenders", "Midfielders"].map((label, i) => (
          <section key={label}>
            <div className="mb-4 flex items-baseline justify-between border-b border-hairline pb-3">
              <Skeleton height={22} width={140} />
              <Skeleton height={10} width={70} />
            </div>
            <ol className="flex flex-col gap-2">
              {Array.from({ length: i === 0 ? 2 : 4 }).map((_, j) => (
                <li key={j}>
                  <SkeletonRow />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
