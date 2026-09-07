"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useUserStore, type WatchStatus, type WatchedPlayer } from "@/data/user-store";
import { PrimaryButton } from "@/components/ui/Field";
import { SourceChips } from "@/components/ui/Sources";
import { WatchedPlayerModal } from "./WatchedPlayerModal";

/**
 * A "prospects on the radar" surface. Sporting director adds anyone
 * they're tracking (not on the roster). Status moves Monitoring →
 * Interested → Contacted → Passed as the scouting picture develops.
 */
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
    <section className="structural-surface atlas-enter p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
            Watchlist
          </div>
          <h2 className="display mt-4 text-[32px] leading-tight tracking-tightest text-white md:text-[38px]">
            Prospects on the radar
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-bone-500">
            {watchlist.length} tracked
          </span>
          <PrimaryButton onClick={() => setAddOpen(true)}>
            <Plus size={12} strokeWidth={1.6} />
            Add prospect
          </PrimaryButton>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="mt-8 text-[14px] tracking-tightish text-bone-400">
          Nobody on the radar yet. Add the first prospect the scouting team
          is tracking.
        </p>
      ) : (
        <ol className="mt-8 flex flex-col gap-2">
          {sorted.map((w) => (
            <li key={w.id}>
              <div
                onClick={() => setEditing(w)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setEditing(w);
                }}
                role="button"
                tabIndex={0}
                className="content-surface group flex cursor-pointer items-center gap-4 px-4 py-3.5 md:px-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="truncate text-[15px] tracking-tightish text-white">
                      {w.name}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-bone-500">
                      {w.position}, {w.age}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-[12px] tracking-tightish text-bone-400">
                    {w.currentClub}
                    {w.notes ? `, ${w.notes}` : ""}
                  </div>
                  {w.sources?.length ? (
                    <SourceChips sources={w.sources} className="mt-3" />
                  ) : null}
                </div>
                <StatusPill status={w.status} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remove ${w.name} from the watchlist?`)) {
                      removeWatched(w.id);
                    }
                  }}
                  className="shrink-0 text-bone-500 opacity-0 transition-opacity hover:text-signal-rose group-hover:opacity-100"
                  aria-label={`Remove ${w.name}`}
                >
                  <Trash2 size={14} strokeWidth={1.4} />
                </button>
              </div>
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

function StatusPill({ status }: { status: WatchStatus }) {
  const tone =
    status === "Interested"
      ? "bg-accent text-white border-accent"
      : status === "Contacted"
        ? "bg-signal-moss/20 text-signal-moss border-signal-moss/50"
        : status === "Passed"
          ? "bg-white/[0.06] text-bone-500 border-hairlineStrong"
          : "bg-signal-amber/20 text-signal-amber border-signal-amber/50";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${tone}`}
    >
      {status}
    </span>
  );
}
