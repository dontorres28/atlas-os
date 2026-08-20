"use client";

import { useAttentionCount } from "./Today";

export function StateLine() {
  const count = useAttentionCount();

  let copy: string;
  if (count === 0) copy = "The team is in good shape. Nothing needs a decision today.";
  else if (count === 1) copy = "The team is in good shape. One thing needs your attention.";
  else copy = `The team is in good shape. ${count} things need your attention.`;

  return (
    <div className="border-b border-hairline pb-10 pt-2">
      <p className="max-w-[62ch] text-[17px] leading-relaxed tracking-tightish text-bone-200">
        {copy}
      </p>
    </div>
  );
}
