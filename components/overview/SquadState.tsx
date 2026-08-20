"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Signal = {
  key: string;
  label: string;
  value: number;
  radius: number;
  detail: string;
  cta: string;
  href: string;
};

const SIGNALS: Signal[] = [
  {
    key: "performance",
    label: "How the team is playing",
    value: 86,
    radius: 178,
    detail: "First Team review completion at 94%.",
    cta: "See performance",
    href: "/reviews",
  },
  {
    key: "pathway",
    label: "Who's coming up",
    value: 78,
    radius: 156,
    detail: "3 athletes ready for progression, 2 pathway blockers.",
    cta: "See pathways",
    href: "/pathways",
  },
  {
    key: "squad",
    label: "Team make-up",
    value: 84,
    radius: 134,
    detail: "1 structural gap projected for 2027/28.",
    cta: "See squad",
    href: "/squad",
  },
  {
    key: "planning",
    label: "Where we're heading",
    value: 81,
    radius: 112,
    detail: "6 contracts requiring review.",
    cta: "See decisions",
    href: "/decisions",
  },
];

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
  const composite = Math.round(
    SIGNALS.reduce((s, d) => s + d.value, 0) / SIGNALS.length,
  );

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = SIGNALS.find((s) => s.key === activeKey);

  return (
    <section className="grid grid-cols-1 gap-x-16 gap-y-12 pb-16 pt-4 md:grid-cols-12 md:gap-y-0">
      {/* Gauge column */}
      <div className="md:col-span-7">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
          Squad State
        </div>

        <div className="relative mx-auto mt-6 aspect-square max-w-[440px]">
          <svg viewBox="0 0 400 400" className="h-full w-full" aria-label="Squad state">
            {/* Track arcs */}
            {SIGNALS.map((d) => (
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
            {SIGNALS.map((d) => {
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
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Signals column */}
      <div className="md:col-span-5 md:pt-10">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
          Signals
        </div>

        <ol className="mt-6">
          {SIGNALS.map((s) => {
            const isActive = activeKey === s.key;
            return (
              <li key={s.key}>
                <button
                  onMouseEnter={() => setActiveKey(s.key)}
                  onFocus={() => setActiveKey(s.key)}
                  onClick={() => setActiveKey(isActive ? null : s.key)}
                  className={`group flex w-full items-baseline justify-between border-t border-hairline py-4 text-left transition-colors duration-300 ${
                    isActive ? "text-white" : "text-bone-300 hover:text-white"
                  }`}
                >
                  <span className="text-[15px] tracking-tightish">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div
          className="mt-10 border-t border-hairlineStrong pt-6"
          onMouseLeave={() => setActiveKey(null)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active ? active.key : "default"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {active ? (
                <div>
                  <div className="text-[15px] leading-relaxed tracking-tightish text-bone-100">
                    {active.detail}
                  </div>
                  <Link
                    href={active.href}
                    className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-accent-tint transition-colors hover:text-white"
                  >
                    {active.cta}
                    <ArrowRight size={12} strokeWidth={1.4} />
                  </Link>
                </div>
              ) : (
                <div className="text-[14px] leading-relaxed tracking-tightish text-bone-300">
                  Hover a signal to see what's inside it.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
