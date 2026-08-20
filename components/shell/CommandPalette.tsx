"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { athletes } from "@/data/athletes";
import { useAtlas } from "@/data/store";
import { seedCycles } from "@/data/cycles";
import { formatDateShort } from "@/lib/utils";

type Result =
  | { kind: "athlete"; id: string; label: string; sub: string; href: string }
  | { kind: "decision"; id: string; label: string; sub: string; href: string }
  | { kind: "review"; id: string; label: string; sub: string; href: string }
  | { kind: "cycle"; id: string; label: string; sub: string; href: string }
  | { kind: "nav"; id: string; label: string; sub: string; href: string };

const NAV_ITEMS: Result[] = [
  { kind: "nav", id: "n1", label: "Overview", sub: "Sporting Director home", href: "/" },
  { kind: "nav", id: "n2", label: "Squad", sub: "First Team and Academy", href: "/squad" },
  { kind: "nav", id: "n3", label: "Pathways", sub: "Progression map", href: "/pathways" },
  { kind: "nav", id: "n4", label: "Cycles", sub: "Sporting calendar", href: "/cycles" },
  { kind: "nav", id: "n5", label: "Reviews", sub: "What the club currently thinks", href: "/reviews" },
  { kind: "nav", id: "n6", label: "Decisions", sub: "Decision ledger", href: "/decisions" },
  { kind: "nav", id: "n7", label: "Planning", sub: "Squad 2027 / 28", href: "/planning" },
  { kind: "nav", id: "n8", label: "Loans", sub: "Trajectory tracking", href: "/loans" },
  { kind: "nav", id: "n9", label: "Recruitment", sub: "Open sporting briefs", href: "/recruitment" },
  { kind: "nav", id: "n10", label: "Memory", sub: "Club sporting history", href: "/memory" },
  { kind: "nav", id: "n11", label: "Methodology", sub: "How the club defines readiness", href: "/methodology" },
];

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const reviews = useAtlas((s) => s.reviews);
  const decisions = useAtlas((s) => s.decisions);

  useEffect(() => {
    if (!open) {
      setQ("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const query = q.trim().toLowerCase();
    const athleteResults: Result[] = athletes
      .filter(
        (a) =>
          !query ||
          a.name.toLowerCase().includes(query) ||
          a.positionLabel.toLowerCase().includes(query) ||
          a.team.toLowerCase().includes(query) ||
          a.pathwayStage.toLowerCase().includes(query),
      )
      .slice(0, 8)
      .map((a) => ({
        kind: "athlete",
        id: a.id,
        label: a.name,
        sub: `${a.positionLabel}, ${a.team}`,
        href: `/squad/${a.id}`,
      }));

    const decisionResults: Result[] = decisions
      .filter((d) => !query || d.summary.toLowerCase().includes(query) || d.area.toLowerCase().includes(query))
      .slice(0, 4)
      .map((d) => {
        const a = athletes.find((x) => x.id === d.athleteId);
        return {
          kind: "decision",
          id: d.id,
          label: `Decision ${d.code}, ${d.summary}`,
          sub: `${d.area}, ${a?.name ?? ""}, ${formatDateShort(d.date)}`,
          href: `/decisions/${d.id}`,
        };
      });

    const cycleResults: Result[] = seedCycles
      .filter(
        (c) =>
          !query ||
          c.name.toLowerCase().includes(query) ||
          c.type.toLowerCase().includes(query) ||
          c.monthLabel.toLowerCase().includes(query),
      )
      .slice(0, 4)
      .map((c) => ({
        kind: "cycle",
        id: c.id,
        label: c.name,
        sub: `${c.monthLabel} ${c.season}. ${c.scope}.`,
        href: `/cycles/${c.id}`,
      }));

    const reviewResults: Result[] = reviews
      .filter((r) => !query || r.assessment.toLowerCase().includes(query) || r.reviewer.toLowerCase().includes(query))
      .slice(0, 4)
      .map((r) => {
        const a = athletes.find((x) => x.id === r.athleteId);
        return {
          kind: "review",
          id: r.id,
          label: `Review of ${a?.name ?? ""}`,
          sub: `${r.reviewer}, ${formatDateShort(r.date)}`,
          href: `/squad/${r.athleteId}`,
        };
      });

    const navResults = query
      ? NAV_ITEMS.filter((n) => n.label.toLowerCase().includes(query))
      : NAV_ITEMS;

    return [
      ...athleteResults,
      ...cycleResults,
      ...decisionResults,
      ...reviewResults,
      ...navResults,
    ];
  }, [q, reviews, decisions]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        const r = results[active];
        if (r) {
          onClose();
          router.push(r.href);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose, router]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-canvas/70 px-6 pt-[14vh] backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass w-full max-w-2xl rounded-2xl"
          >
            <div className="flex items-center gap-4 border-b border-hairline px-6 py-4">
              <span className="label text-accent-tint">Search Atlas</span>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search athletes, decisions, reviews…"
                className="flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-bone-500"
              />
              <span className="mono text-[10px] text-bone-500">ESC</span>
            </div>
            <div className="max-h-[52vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-6 py-12 text-center meta">No results</div>
              ) : (
                results.map((r, i) => (
                  <Link
                    key={`${r.kind}_${r.id}`}
                    href={r.href}
                    onClick={onClose}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-baseline justify-between border-b border-hairline px-6 py-4 transition-colors duration-300 ${
                      i === active ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="mono w-16 text-[10px] uppercase tracking-[0.16em] text-accent-tint">
                        {r.kind}
                      </span>
                      <span className="text-[14px] text-white">{r.label}</span>
                    </div>
                    <span className="meta">{r.sub}</span>
                  </Link>
                ))
              )}
            </div>
            <div className="flex items-center justify-between border-t border-hairline px-6 py-3 meta">
              <span>↑ ↓ to navigate, ↵ to open</span>
              <span>{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
