"use client";

import { motion } from "framer-motion";

type Attribute = {
  label: string;
  value: number;
};

const ATTRIBUTES: Attribute[] = [
  { label: "Squad balance", value: 82 },
  { label: "Pathway health", value: 78 },
  { label: "Depth", value: 84 },
  { label: "Contract position", value: 81 },
  { label: "Planning readiness", value: 83 },
];

export function SquadProfile() {
  return (
    <section className="border-t border-hairline py-16">
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
        Squad Profile
      </div>

      <ol className="mt-10">
        {ATTRIBUTES.map((a, i) => (
          <li
            key={a.label}
            className="grid grid-cols-[220px_1fr_60px] items-center gap-8 border-t border-hairline py-6 first:border-t-hairlineStrong"
          >
            <div className="text-[15px] tracking-tightish text-white">
              {a.label}
            </div>

            <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-hairline">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${a.value}%` }}
                transition={{
                  duration: 0.9,
                  delay: 0.1 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>

            <div className="display text-right text-[22px] tracking-tightish text-white">
              {a.value}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
