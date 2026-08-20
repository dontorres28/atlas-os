import type { ReactNode } from "react";

export function Section({
  title,
  children,
  aside,
  delay = 0,
}: {
  index?: string;
  title: string;
  children: ReactNode;
  aside?: ReactNode;
  delay?: number;
}) {
  return (
    <section
      style={{ animationDelay: `${delay}s` }}
      className="atlas-enter grid grid-cols-12 gap-8 border-b border-hairline py-20 md:gap-12"
    >
      <div className="col-span-12 md:col-span-3">
        <h2 className="display text-[22px] tracking-tightish text-white">
          {title}
        </h2>
        {aside ? (
          <div className="meta mt-4 max-w-[28ch] text-bone-300">{aside}</div>
        ) : null}
      </div>
      <div className="col-span-12 md:col-span-9">{children}</div>
    </section>
  );
}
