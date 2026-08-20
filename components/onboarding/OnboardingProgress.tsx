"use client";

import { motion } from "framer-motion";

const SEGMENT_LABELS = ["Sport", "You", "Club", "Structure", "Methodology", "Ready"];

export function OnboardingProgress({ step }: { step: number }) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-[720px] items-center gap-2 px-6 pb-3 pt-6">
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
          Atlas OS
        </span>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.22em] text-bone-400">
          {SEGMENT_LABELS[step - 1]}
        </span>
      </div>
      <div className="mx-auto flex max-w-[720px] gap-2 px-6 pb-5">
        {SEGMENT_LABELS.map((_, i) => {
          const idx = i + 1;
          const state: "done" | "current" | "upcoming" =
            idx < step ? "done" : idx === step ? "current" : "upcoming";
          const bg =
            state === "done"
              ? "var(--fg-strong)"
              : state === "current"
                ? "var(--accent)"
                : "var(--hairline-strong)";
          return (
            <motion.span
              key={i}
              className="h-[3px] flex-1 rounded-full"
              initial={false}
              animate={{ backgroundColor: bg }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </div>
    </div>
  );
}
