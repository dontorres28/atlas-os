"use client";

import { useMemo } from "react";
import { useRoster } from "./use-roster";
import { useUserStore } from "./user-store";
import { athletePathways } from "./pathways";
import { signalsFor } from "./athlete-state";
import type { PathwayReadiness } from "@/lib/types";

const TODAY = new Date("2026-08-20");

export type SquadSignalKey = "performance" | "pathway" | "squad" | "planning";

export type SquadSignal = {
  key: SquadSignalKey;
  label: string;
  value: number;
  detail: string;
  cta: string;
  href: string;
  radius: number;
};

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function pathwayStatusOf(
  athleteId: string,
  note: { status: PathwayReadiness } | undefined,
): PathwayReadiness | undefined {
  return athletePathways.find((p) => p.athleteId === athleteId)?.status ?? note?.status;
}

function monthsUntil(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return Infinity;
  return (d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
}

export function useSquadSignals(): SquadSignal[] {
  const roster = useRoster();
  const notes = useUserStore((s) => s.pathwayNotes);

  return useMemo(() => {
    const n = roster.length;

    /* -------------- Performance ------------- */
    // Mean of per-athlete performance signal. If the roster hasn't logged any
    // minutes yet the underlying `signalsFor` still returns something usable
    // (heavily leaning on availability), so this is safe on day one.
    const perfMean =
      n === 0
        ? 0
        : roster.reduce((sum, a) => sum + signalsFor(a).performance, 0) / n;
    const perfValue = Math.round(perfMean);

    const firstTeam = roster.filter((a) => a.team === "First Team").length;
    const perfDetail =
      n === 0
        ? "No athletes on the roster yet."
        : firstTeam === 0
          ? `${n} athlete${n === 1 ? "" : "s"} tracked, no First Team minutes yet.`
          : `First Team form averaging ${perfValue} across ${firstTeam} player${firstTeam === 1 ? "" : "s"}.`;

    /* --------------- Pathway --------------- */
    let ready = 0;
    let onTrack = 0;
    let atRisk = 0;
    let blocked = 0;
    for (const a of roster) {
      const status = pathwayStatusOf(a.id, notes[a.id]);
      if (status === "Ready") ready++;
      else if (status === "On Track") onTrack++;
      else if (status === "At Risk") atRisk++;
      else if (status === "Blocked") blocked++;
    }
    const pathValue =
      n === 0
        ? 0
        : Math.round(((ready + onTrack) / n) * 100);
    const pathDetail =
      n === 0
        ? "Add athletes to see who is coming up."
        : ready + blocked + atRisk === 0
          ? `${onTrack} athlete${onTrack === 1 ? "" : "s"} on track, nothing flagged.`
          : `${ready} ready, ${blocked} blocked, ${atRisk} at risk.`;

    /* ------------ Team make-up ------------- */
    // Coverage of the four position groups + light penalty for imbalance.
    const groupCounts: Record<string, number> = {
      Goalkeepers: 0,
      Defenders: 0,
      Midfielders: 0,
      Attackers: 0,
    };
    for (const a of roster) groupCounts[a.positionGroup]++;
    const filledGroups = Object.values(groupCounts).filter((c) => c > 0).length;
    const coverage = (filledGroups / 4) * 100;
    const missing = Object.entries(groupCounts)
      .filter(([, c]) => c === 0)
      .map(([g]) => g);
    // small imbalance penalty when one group dominates
    const maxG = Math.max(...Object.values(groupCounts), 0);
    const imbalance = n > 0 ? (maxG / n) * 20 : 0; // 0..20
    const squadValue =
      n === 0
        ? 0
        : Math.round(clamp(coverage - imbalance + 15));
    const squadDetail =
      n === 0
        ? "No shape yet — add athletes to see the make-up."
        : missing.length === 0
          ? `All four position groups covered.`
          : `Gap${missing.length === 1 ? "" : "s"} at ${missing.join(", ")}.`;

    /* -------------- Planning --------------- */
    // "Where we're heading" — contract stability. Fewer contracts expiring in
    // the next 12 months = higher score.
    const expiringSoon = roster.filter((a) => {
      const m = monthsUntil(a.contract.expiry);
      return m <= 12;
    }).length;
    const planValue =
      n === 0
        ? 0
        : Math.round(clamp(100 - (expiringSoon / n) * 100));
    const planDetail =
      n === 0
        ? "Nothing to plan yet."
        : expiringSoon === 0
          ? "No contracts expiring in the next 12 months."
          : `${expiringSoon} contract${expiringSoon === 1 ? "" : "s"} expiring within 12 months.`;

    return [
      {
        key: "performance",
        label: "How the team is playing",
        value: perfValue,
        detail: perfDetail,
        cta: "See performance",
        href: "/reviews",
        radius: 178,
      },
      {
        key: "pathway",
        label: "Who's coming up",
        value: pathValue,
        detail: pathDetail,
        cta: "See pathways",
        href: "/pathways",
        radius: 156,
      },
      {
        key: "squad",
        label: "Team make-up",
        value: squadValue,
        detail: squadDetail,
        cta: "See squad",
        href: "/squad",
        radius: 134,
      },
      {
        key: "planning",
        label: "Where we're heading",
        value: planValue,
        detail: planDetail,
        cta: "See decisions",
        href: "/decisions",
        radius: 112,
      },
    ];
  }, [roster, notes]);
}
