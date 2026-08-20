"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

function seededSeries(count: number, base: number, drift: number) {
  const points: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const target = base + drift * t;
    const noise = Math.sin(i * 0.9 + i * 0.13) * 1.4 + Math.cos(i * 1.7) * 0.9;
    points.push(Math.round((target + noise) * 10) / 10);
  }
  return points;
}

const SERIES = seededSeries(30, 79, 5);

export function SquadTrend() {
  const points = SERIES;

  const { path, area, min, max, last, deltaPct } = useMemo(() => {
    const min = Math.min(...points) - 1.5;
    const max = Math.max(...points) + 1.5;
    const w = 1000;
    const h = 220;
    const stepX = w / (points.length - 1);
    const scaleY = (v: number) => h - ((v - min) / (max - min)) * h;

    const coords = points.map((v, i) => [i * stepX, scaleY(v)]);
    const path = coords
      .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(" ");
    const area =
      `M 0 ${h} ` +
      coords.map(([x, y]) => `L ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") +
      ` L ${w} ${h} Z`;
    const first = points[0];
    const last = points[points.length - 1];
    const deltaPct = ((last - first) / first) * 100;

    return { path, area, min, max, last, deltaPct };
  }, [points]);

  const rising = deltaPct >= 0;

  return (
    <section className="border-t border-hairline py-16">
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
        Squad Trend
      </div>

      <div className="mt-8 flex items-baseline gap-6">
        <span className="display text-[64px] leading-none tracking-tightest text-white">
          {Math.round(last)}
        </span>
        <span className="text-[14px] tracking-tightish text-bone-300">
          {rising ? "Going up" : "Going down"} over the last month.
        </span>
      </div>

      <div className="mt-10">
        <svg
          viewBox="0 0 1000 240"
          preserveAspectRatio="none"
          className="h-[220px] w-full"
          aria-label="Squad state trend"
        >
          <defs>
            <linearGradient id="trendFade" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            x2="1000"
            y1="220"
            y2="220"
            stroke="var(--hairline)"
            strokeWidth="1"
          />
          <motion.path
            d={area}
            fill="url(#trendFade)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d={path}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.circle
            cx={1000}
            cy={220 - ((last - min) / (max - min)) * 220}
            r="3.5"
            fill="var(--accent)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-bone-500">
        <span>A month ago</span>
        <span>Today</span>
      </div>
    </section>
  );
}
