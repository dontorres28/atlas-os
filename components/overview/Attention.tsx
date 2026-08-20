"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { athletes } from "@/data/athletes";
import { athletePathways, getPathway } from "@/data/pathways";
import { daysBetween } from "@/lib/utils";

const TODAY = "2026-08-17";

type Item = {
  key: string;
  issue: string;
  explanation: string;
  why: string;
  actionLabel: string;
  href: string;
};

function structuralIssues(): Item[] {
  const items: Item[] = [];

  // Centre-back succession
  const cbSenior = athletes.filter(
    (a) => a.team === "First Team" && a.position === "CB",
  );
  const cbReadyBelow = athletePathways.filter((p) => {
    const a = athletes.find((x) => x.id === p.athleteId);
    return a && a.position === "CB" && a.team !== "First Team" && p.status === "Ready";
  });
  if (cbSenior.length && cbReadyBelow.length <= 1) {
    const oldestAge = Math.max(...cbSenior.map((a) => a.age));
    items.push({
      key: "cb-succession",
      issue: "Centre-back succession",
      explanation:
        cbReadyBelow.length === 0
          ? "No academy centre-back currently meets First Team readiness."
          : `Only ${cbReadyBelow[0]?.athleteId ? athletes.find((a) => a.id === cbReadyBelow[0].athleteId)?.name : "one academy player"} is ready to step up.`,
      why: `Squad ages: ${cbSenior
        .map((a) => a.age)
        .sort((a, b) => a - b)
        .join(", ")}. Oldest ${oldestAge}. Projected 2027–28 gap.`,
      actionLabel: "View pathway",
      href: "/pathways/first-team",
    });
  }

  return items;
}

function athleteAttentionItems(): Item[] {
  const items: Item[] = [];

  for (const a of athletes) {
    const p = getPathway(a.id);

    // Development objective unchanged for X days
    if (a.lastReviewDate) {
      const days = daysBetween(a.lastReviewDate, TODAY);
      if (days >= 60 && (p?.status === "On Track" || p?.status === "Blocked")) {
        // pick a couple of noteworthy ones only
        if (a.id === "ath_016" || a.id === "ath_023") {
          items.push({
            key: `obj-${a.id}`,
            issue: a.name,
            explanation: `Development objective unchanged for ${days} days.`,
            why: `${p?.currentStageId === "u21" ? "U21" : "U19"} to First Team pathway. ${a.developmentPriority}.`,
            actionLabel: "Open review",
            href: `/squad/${a.id}`,
          });
        }
      }
    }

    // Contract window closing
    if (a.attention?.kind === "Contract") {
      items.push({
        key: `contract-${a.id}`,
        issue: `${a.name}, contract`,
        explanation: a.attention.note,
        why: `Contract expires ${formatShort(a.contract.expiry)}. Decision needed before winter window.`,
        actionLabel: "Open athlete",
        href: `/squad/${a.id}`,
      });
    }

    // Availability
    if (a.attention?.kind === "Availability") {
      items.push({
        key: `avail-${a.id}`,
        issue: `${a.name}, availability`,
        explanation: a.attention.note,
        why: `Return-to-play plan due. Depth exposed while out.`,
        actionLabel: "Open athlete",
        href: `/squad/${a.id}`,
      });
    }

    // Loan misalignment
    if (a.attention?.kind === "Performance" && a.team === "Loan") {
      items.push({
        key: `loan-${a.id}`,
        issue: `${a.name}, loan role`,
        explanation: a.attention.note,
        why: p?.blocker ?? "Playing time strong, role alignment weak.",
        actionLabel: "Open loan",
        href: `/squad/${a.id}`,
      });
    }
  }

  return items;
}

function formatShort(iso: string) {
  const d = new Date(iso);
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  return `${m} ${d.getFullYear()}`;
}

export function attentionItems(): Item[] {
  const list = [...structuralIssues(), ...athleteAttentionItems()];
  return list.slice(0, 5);
}

export function Attention() {
  const items = attentionItems();

  return (
    <section className="atlas-enter border-b border-hairline py-20" style={{ animationDelay: "0.05s" }}>
      <div className="mb-12 flex items-baseline justify-between">
        <h2 className="text-[26px] tracking-tightish text-white">
          What Atlas thinks you should look at
        </h2>
        <div className="meta text-bone-400">
          {items.length} open item{items.length === 1 ? "" : "s"}
        </div>
      </div>

      <ol>
        {items.map((it, i) => (
          <li key={it.key}>
            <Link
              href={it.href}
              className="group grid grid-cols-12 items-baseline gap-6 border-t border-hairline py-10 transition-colors duration-500 ease-atlas last:border-b hover:bg-white/[0.02]"
            >
              <div className="col-span-1 text-[11px] tracking-[0.18em] text-bone-500">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-5">
                <div className="text-[22px] tracking-tightish text-white">
                  {it.issue}
                </div>
                <div className="mt-3 text-[15px] leading-relaxed text-bone-200">
                  {it.explanation}
                </div>
              </div>
              <div className="col-span-4 border-l border-hairline pl-6">
                <div className="label">Why it matters</div>
                <div className="mt-2 text-[13px] leading-relaxed text-bone-300">
                  {it.why}
                </div>
              </div>
              <div className="col-span-2 flex items-baseline justify-end">
                <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-accent-tint transition-colors group-hover:text-white">
                  {it.actionLabel}
                  <ArrowRight
                    size={12}
                    strokeWidth={1.4}
                    className="transition-transform duration-500 ease-atlas group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
