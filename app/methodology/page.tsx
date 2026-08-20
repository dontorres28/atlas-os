"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Segmented } from "@/components/ui/Segmented";
import { Tooltip } from "@/components/ui/Tooltip";
import { METHODOLOGY } from "@/data/methodology";

const LEVEL_LABELS = ["", "Basic", "Developing", "Competent", "First Team", "Elite"];

export default function MethodologyPage() {
  const groups = METHODOLOGY;
  const [activeKey, setActiveKey] = useState<string>(groups[0].key);
  const active = groups.find((g) => g.key === activeKey) ?? groups[0];

  return (
    <>
      <ModuleHeader title="Methodology" />

      <div className="pb-16">
        <div className="mb-12 max-w-[62ch] text-[15px] leading-relaxed tracking-tightish text-bone-300">
          How the club defines readiness. Every dimension has a definition and a
          required level. Reviews and objectives read from this framework so the
          language stays consistent across the sporting department.
        </div>

        <div className="mb-10">
          <Segmented
            value={activeKey}
            onChange={setActiveKey}
            align="left"
            options={groups.map((g) => ({ value: g.key, label: g.label }))}
            ariaLabel="Position group"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={active.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-12"
          >
            <div className="md:col-span-4">
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
                Group
              </div>
              <h2 className="display mt-4 text-[42px] tracking-tightest text-white md:text-[52px]">
                {active.label}
              </h2>
              <div className="mt-6 text-[13px] tracking-tightish text-bone-400">
                Positions covered: {active.positions.join(", ")}
              </div>
            </div>

            <div className="md:col-span-8">
              <ol>
                {active.dimensions.map((d) => (
                  <li
                    key={d.key}
                    className="grid grid-cols-[1fr_120px_140px] items-baseline gap-8 border-t border-hairline py-6 last:border-b"
                  >
                    <div>
                      <div className="text-[17px] tracking-tightish text-white">
                        {d.label}
                      </div>
                      <div className="mt-2 text-[13px] leading-relaxed text-bone-400">
                        {d.definition}
                      </div>
                    </div>

                    <Tooltip
                      side="top"
                      wide
                      title={`Required level ${d.requiredLevel}`}
                      hint={`${LEVEL_LABELS[d.requiredLevel]} standard is expected for First Team.`}
                    >
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={
                              n <= d.requiredLevel
                                ? "h-[10px] w-[10px] rounded-full bg-accent"
                                : "h-[10px] w-[10px] rounded-full bg-hairline"
                            }
                          />
                        ))}
                      </div>
                    </Tooltip>

                    <div className="text-right text-[11px] uppercase tracking-[0.18em] text-bone-400">
                      Level {d.requiredLevel}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </>
  );
}
