"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useUserStore, type WatchStatus, type WatchedPlayer } from "@/data/user-store";
import { PrimaryButton, GhostButton } from "@/components/ui/Field";
import { StateDot } from "@/components/ui/StateDot";
import { SourceChips } from "@/components/ui/Sources";
import { WatchedPlayerModal } from "./WatchedPlayerModal";

/**
 * A "prospects on the radar" table, sitting below the recruitment briefs.
 * Sporting director adds anyone they're tracking (not yet on the roster);
 * status moves Monitoring → Interested → Contacted → Passed as picture
 * develops.
 */
function toneForStatus(s: WatchStatus): "accent" | "moss" | "amber" | "muted" {
  switch (s) {
    case "Interested":
      return "accent";
    case "Contacted":
      return "moss";
    case "Passed":
      return "muted";
    case "Monitoring":
    default:
      return "amber";
  }
}

function statusOrder(s: WatchStatus) {
  return { Interested: 0, Contacted: 1, Monitoring: 2, Passed: 3 }[s];
}

export function Watchlist() {
  const watchlist = useUserStore((s) => s.watchlist);
  const hydrated = useUserStore((s) => s.hydrated);
  const removeWatched = useUserStore((s) => s.removeWatched);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<WatchedPlayer | null>(null);

  const sorted = useMemo(
    () => [...watchlist].sort((a, b) => statusOrder(a.status) - statusOrder(b.status)),
    [watchlist],
  );

  if (!hydrated) {
    return <section className="border-t border-hairline py-16" aria-busy="true" />;
  }

  return (
    <section className="atlas-enter border-t border-hairline py-16">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
            Watchlist
          </div>
          <h2 className="display mt-6 text-[44px] leading-none tracking-tightest text-white md:text-[56px]">
            Prospects on the radar
          </h2>
          <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed tracking-tightish text-bone-200">
            Players outside the roster the club is tracking. Move them
            through Monitoring, Interested, Contacted, Passed as the
            picture develops.
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3">
        <PrimaryButton onClick={() => setAddOpen(true)}>
          <Plus size={12} strokeWidth={1.6} />
          Add prospect
        </PrimaryButton>
        <span className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
          {watchlist.length} tracked
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="mt-14 text-[14px] tracking-tightish text-bone-400">
          Nobody on the radar yet. Add the first prospect the scouting team
          is tracking.
        </p>
      ) : (
        <ol className="mt-14">
          {sorted.map((w) => (
            <li
              key={w.id}
              className="group grid grid-cols-[16px_1.5fr_0.7fr_0.7fr_0.7fr_36px] items-baseline gap-6 border-t border-hairline py-5 last:border-b"
            >
              <span className="mt-1">
                <StateDot tone={toneForStatus(w.status)} size={10} />
              </span>
              <button
                onClick={() => setEditing(w)}
                className="text-left"
              >
                <div className="text-[16px] tracking-tightish text-white transition-colors group-hover:text-accent-tint">
                  {w.name}
                </div>
                <div className="mt-1 text-[12px] tracking-tightish text-bone-400">
                  {w.currentClub}
                  {w.notes ? `, ${w.notes}` : ""}
                </div>
                {w.sources?.length ? (
                  <SourceChips sources={w.sources} className="mt-3" />
                ) : null}
              </button>
              <div className="text-[13px] tracking-tightish text-bone-200">
                {w.position}, {w.age}
              </div>
              <div className="text-[13px] tracking-tightish text-bone-300">
                {w.status}
              </div>
              <div
                className={`text-[13px] tracking-tightish ${
                  w.fit === "High"
                    ? "text-accent-tint"
                    : w.fit === "Low"
                      ? "text-bone-500"
                      : "text-bone-200"
                }`}
              >
                {w.fit ? `${w.fit} fit` : "—"}
              </div>
              <button
                onClick={() => {
                  if (confirm(`Remove ${w.name} from the watchlist?`)) {
                    removeWatched(w.id);
                  }
                }}
                className="justify-self-end text-bone-500 opacity-0 transition-opacity hover:text-signal-rose group-hover:opacity-100"
                aria-label={`Remove ${w.name}`}
              >
                <Trash2 size={14} strokeWidth={1.4} />
              </button>
            </li>
          ))}
        </ol>
      )}

      <WatchedPlayerModal open={addOpen} onClose={() => setAddOpen(false)} />
      <WatchedPlayerModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        initial={editing ?? undefined}
      />
    </section>
  );
}
