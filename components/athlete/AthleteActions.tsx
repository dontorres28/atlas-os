"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Athlete } from "@/lib/types";
import { useUserStore, type PathwayNote } from "@/data/user-store";
import { GhostButton, PrimaryButton, Select, TextInput } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { AthleteFormModal } from "@/components/squad/AthleteFormModal";

const STATUSES: PathwayNote["status"][] = ["Ready", "On Track", "At Risk", "Blocked"];

/**
 * Actions available for user-owned athletes: edit, remove, and set
 * their pathway status. Seeded demo athletes stay read-only.
 */
export function AthleteActions({ athlete }: { athlete: Athlete }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const userAthletes = useUserStore((s) => s.athletes);
  const removeAthlete = useUserStore((s) => s.removeAthlete);
  const pathwayNotes = useUserStore((s) => s.pathwayNotes);
  const setPathwayNote = useUserStore((s) => s.setPathwayNote);

  const owned = userAthletes.some((a) => a.id === athlete.id);
  if (!owned) return null;

  const note = pathwayNotes[athlete.id];
  const status = note?.status ?? "On Track";
  const nextStep = note?.nextStep ?? "";
  const blocker = note?.blocker ?? "";

  function remove() {
    removeAthlete(athlete.id);
    router.replace("/squad");
  }

  function updateNote(patch: Partial<PathwayNote>) {
    setPathwayNote(athlete.id, {
      status: patch.status ?? status,
      nextStep: patch.nextStep ?? nextStep,
      blocker: patch.blocker ?? blocker,
    });
  }

  return (
    <section className="border-t border-hairline py-16">
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
        Pathway status
      </div>

      {/* Status chip row */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = status === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => updateNote({ status: s })}
              className={
                "rounded-full border px-4 py-2 text-[13px] tracking-tightish transition-all duration-300 ease-atlas " +
                (active
                  ? "border-accent bg-accent"
                  : "border-hairlineStrong text-bone-200 hover:border-white hover:text-white")
              }
              style={active ? { color: "#FEFEFE" } : undefined}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-500">
            Next expected step
          </span>
          <TextInput
            value={nextStep}
            onChange={(e) => updateNote({ nextStep: e.target.value })}
            placeholder="What's the next move for this athlete?"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-500">
            Blocking factor
          </span>
          <TextInput
            value={blocker}
            onChange={(e) => updateNote({ blocker: e.target.value })}
            placeholder="Anything stopping them from moving forward?"
          />
        </label>
      </div>

      <div className="mt-14 border-t border-hairline pt-10">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
          Athlete record
        </div>
        <div className="mt-6 flex items-center gap-3">
          <PrimaryButton onClick={() => setEditOpen(true)}>
            <Pencil size={12} strokeWidth={1.6} />
            Edit
          </PrimaryButton>
          <GhostButton onClick={() => setConfirmOpen(true)}>
            <Trash2 size={12} strokeWidth={1.6} />
            Remove athlete
          </GhostButton>
        </div>
      </div>

      <AthleteFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={athlete}
      />

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        section="Squad"
        title="Remove athlete"
      >
        <p className="text-[15px] leading-relaxed tracking-tightish text-bone-100">
          Remove <span className="text-white">{athlete.name}</span> from the squad?
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-bone-400">
          This cannot be undone. Reviews and decisions recorded against them stay in the ledger.
        </p>
        <div className="mt-8 flex items-center justify-end gap-3">
          <GhostButton onClick={() => setConfirmOpen(false)}>Cancel</GhostButton>
          <PrimaryButton onClick={remove}>Remove</PrimaryButton>
        </div>
      </Modal>
    </section>
  );
}
