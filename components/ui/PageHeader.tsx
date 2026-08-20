export function PageHeader({
  title,
  meta,
  actions,
}: {
  /** Kept for backwards compat; not rendered any more. */
  section?: string;
  index?: string;
  title: string;
  meta?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="atlas-enter border-b border-hairline pb-16 pt-20">
      <div className="flex items-baseline justify-between gap-6">
        <div>
          <h1 className="display text-[68px] tracking-tightest text-white md:text-[76px]">
            {title}
          </h1>
          {meta ? (
            <div className="meta mt-6 max-w-[80ch] text-[14px] leading-relaxed text-bone-300">
              {meta}
            </div>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
