"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, GhostButton, PrimaryButton, Select, TextInput } from "@/components/ui/Field";
import { SourceEditor } from "@/components/ui/Sources";
import {
  useUserStore,
  type NewWatchedPlayer,
  type WatchStatus,
  type WatchedPlayer,
} from "@/data/user-store";
import type { Evidence, Position } from "@/lib/types";

const POSITIONS: Position[] = ["GK", "CB", "RB", "LB", "DM", "CM", "AM", "RW", "LW", "CF"];
const STATUSES: WatchStatus[] = ["Monitoring", "Interested", "Contacted", "Passed"];
const FITS: Array<"High" | "Medium" | "Low"> = ["High", "Medium", "Low"];

/**
 * Add / edit a watched prospect. Pass `initial` to enter edit mode.
 */
export function WatchedPlayerModal({
  open,
  onClose,
  initial,
  defaultBriefCode,
}: {
  open: boolean;
  onClose: () => void;
  initial?: WatchedPlayer;
  /** When adding from within a specific brief section, prefill the link. */
  defaultBriefCode?: string;
}) {
  const addWatched = useUserStore((s) => s.addWatched);
  const updateWatched = useUserStore((s) => s.updateWatched);
  const isEdit = Boolean(initial);

  const [name, setName] = useState("");
  const [position, setPosition] = useState<Position>("CB");
  const [age, setAge] = useState<string>("");
  const [currentClub, setCurrentClub] = useState("");
  const [contractExpiry, setContractExpiry] = useState("");
  const [status, setStatus] = useState<WatchStatus>("Monitoring");
  const [fit, setFit] = useState<"High" | "Medium" | "Low">("Medium");
  const [notes, setNotes] = useState("");
  const [sources, setSources] = useState<Evidence[]>([]);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setPosition(initial?.position ?? "CB");
    setAge(initial?.age ? String(initial.age) : "");
    setCurrentClub(initial?.currentClub ?? "");
    setContractExpiry(initial?.contractExpiry ?? "");
    setStatus(initial?.status ?? "Monitoring");
    setFit(initial?.fit ?? "Medium");
    setNotes(initial?.notes ?? "");
    setSources(initial?.sources ?? []);
  }, [open, initial]);

  const ageNum = parseInt(age, 10);
  const canSubmit = name.trim().length > 0 && Number.isFinite(ageNum) && currentClub.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    const input: NewWatchedPlayer = {
      name: name.trim(),
      position,
      age: ageNum,
      currentClub: currentClub.trim(),
      contractExpiry: contractExpiry || undefined,
      status,
      fit,
      briefCode: initial?.briefCode ?? defaultBriefCode,
      notes: notes.trim() || undefined,
      sources: sources.length ? sources : undefined,
    };

    if (isEdit && initial) {
      updateWatched(initial.id, input);
    } else {
      addWatched(input);
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      section="Recruitment"
      title={isEdit ? "Edit prospect" : "Add prospect"}
    >
      <div>
        <Field label="Name">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoFocus
          />
        </Field>
        <Field label="Position">
          <Select value={position} onChange={(e) => setPosition(e.target.value as Position)}>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Age">
          <TextInput
            type="number"
            min={14}
            max={45}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="22"
          />
        </Field>
        <Field label="Current club">
          <TextInput
            value={currentClub}
            onChange={(e) => setCurrentClub(e.target.value)}
            placeholder="Club or academy"
          />
        </Field>
        <Field label="Contract expiry">
          <TextInput
            type="date"
            value={contractExpiry}
            onChange={(e) => setContractExpiry(e.target.value)}
          />
        </Field>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value as WatchStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Fit vs our need">
          <Select value={fit} onChange={(e) => setFit(e.target.value as typeof fit)}>
            {FITS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Notes">
          <TextInput
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Short note or scout observation"
          />
        </Field>
        <SourceEditor value={sources} onChange={setSources} label="Scouting evidence" />

        <div className="mt-8 flex items-center justify-end gap-3">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={!canSubmit}>
            {isEdit ? "Save changes" : "Add prospect"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
