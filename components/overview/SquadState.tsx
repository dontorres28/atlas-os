"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSquadSignals } from "@/data/squad-signals";

const CENTER = 200;
const START_ANGLE = -135;
const END_ANGLE = 135;
const SPAN = END_ANGLE - START_ANGLE;

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startA: number, endA: number) {
  const s = polar(cx, cy, r, startA);
  const e = polar(cx, cy, r, endA);
  const large = endA - startA > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function verdictWord(n: number) {
  if (n >= 80) return "Doing well";
  if (n >= 65) return "Fair";
  return "Needs attention";
}

export function SquadState() {
  const signals = useSquadSignals();
  const composite = Math.round(
    signals.reduce((s, d) => s + d.value, 0) / signals.length,
  );

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = signals.find((s) => s.key === activeKey);

  return (
    <section className="structural-surface mx-auto max-w-[900px] p-6 md:p-10">
      <div className="flex items-baseline justify-between">
        <h2 className="display text-[24px] tracking-tightest text-white">
          Squad state
        </h2>
        <span className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
          {verdictWord(composite)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12 md:gap-y-0">
        <div className="md:col-span-7">
          <div className="relative mx-auto aspect-square max-w-[440px]">
          <svg viewBox="0 0 400 400" className="h-full w-full" aria-label="Squad state">
            {/* Track arcs */}
            {signals.map((d) => (
              <path
                key={`track-${d.key}`}
                d={arcPath(CENTER, CENTER, d.radius, START_ANGLE, END_ANGLE)}
                fill="none"
                stroke="var(--hairline-strong)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            {/* Filled arcs */}
            {signals.map((d) => {
              const endA = START_ANGLE + (SPAN * d.value) / 100;
              const isActive = activeKey === d.key;
              const isDimmed = activeKey !== null && !isActive;
              return (
                <motion.path
                  key={`fill-${d.key}`}
                  d={arcPath(CENTER, CENTER, d.radius, START_ANGLE, endA)}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={isActive ? 5 : 3.5}
                  strokeLinecap="round"
                  initial={false}
                  animate={{
                    opacity: isDimmed ? 0.22 : 1,
                    strokeWidth: isActive ? 5 : 3.5,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}
          </svg>

          {/* Center readout */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-2">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active ? active.key : "composite"}
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="display text-[100px] leading-none tracking-tightest text-white md:text-[124px]">
                  {active ? active.value : composite}
                </div>
                <div className="display mt-5 text-[16px] tracking-tightish text-bone-300">
                  {active ? active.label : verdictWord(composite)}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

        <div className="md:col-span-5">
          <ol className="flex flex-col gap-2">
            {signals.map((s) => {
              const isActive = activeKey === s.key;
              return (
                <li key={s.key}>
                  <Link
                    href={s.href}
                    onMouseEnter={() => setActiveKey(s.key)}
                    onMouseLeave={() =>
                      setActiveKey((cur) => (cur === s.key ? null : cur))
                    }
                    onFocus={() => setActiveKey(s.key)}
                    className="content-surface group flex items-center gap-4 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] tracking-tightish text-white">
                        {s.label}
                      </div>
                      <div className="mt-1 truncate text-[11px] tracking-tightish text-bone-400">
                        {s.detail}
                      </div>
                    </div>
                    <span
                      className={`display shrink-0 text-[22px] tracking-tightish ${
                        isActive ? "text-accent-tint" : "text-white"
                      }`}
                    >
                      {s.value}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
