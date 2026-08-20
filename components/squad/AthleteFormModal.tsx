"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, GhostButton, PrimaryButton, Select, TextInput } from "@/components/ui/Field";
import { useUserStore, type NewAthlete } from "@/data/user-store";
import type { Athlete, Position, SquadTeam } from "@/lib/types";

const POSITIONS: Position[] = ["GK", "CB", "RB", "LB", "DM", "CM", "AM", "RW", "LW", "CF"];
const TEAMS: SquadTeam[] = ["First Team", "U21", "U19", "Loan"];

function ageFromDob(iso: string) {
  if (!iso) return 0;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age -= 1;
  return age;
}

/**
 * Single form used for both adding a new athlete and editing an existing one.
 * Pass `initial` to switch into edit mode.
 */
export function AthleteFormModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Athlete;
}) {
  const addAthlete = useUserStore((s) => s.addAthlete);
  const updateAthlete = useUserStore((s) => s.updateAthlete);
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [dob, setDob] = useState(initial?.dateOfBirth ?? "");
  const [nationality, setNationality] = useState(initial?.nationality ?? "");
  const [position, setPosition] = useState<Position>(initial?.position ?? "CB");
  const [team, setTeam] = useState<SquadTeam>(initial?.team ?? "First Team");
  const [contract, setContract] = useState(initial?.contract.expiry ?? "2027-06-30");

  // Reset the form whenever the modal opens with a different athlete.
  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setDob(initial?.dateOfBirth ?? "");
    setNationality(initial?.nationality ?? "");
    setPosition(initial?.position ?? "CB");
    setTeam(initial?.team ?? "First Team");
    setContract(initial?.contract.expiry ?? "2027-06-30");
  }, [open, initial]);

  function submit() {
    if (!name.trim() || !dob) return;
    const input: NewAthlete = {
      name: name.trim(),
      dateOfBirth: dob,
      age: ageFromDob(dob),
      nationality: nationality.trim() || "—",
      position,
      team,
      contractExpiry: contract,
    };

    if (isEdit && initial) {
      updateAthlete(initial.id, input);
    } else {
      addAthlete(input);
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      section="Squad"
      title={isEdit ? "Edit athlete" : "Add athlete"}
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
        <Field label="Date of birth">
          <TextInput
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </Field>
        <Field label="Nationality">
          <TextInput
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="Switzerland"
          />
        </Field>
        <Field label="Position">
          <Select
            value={position}
            onChange={(e) => setPosition(e.target.value as Position)}
          >
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Team">
          <Select value={team} onChange={(e) => setTeam(e.target.value as SquadTeam)}>
            {TEAMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Contract expiry">
          <TextInput
            type="date"
            value={contract}
            onChange={(e) => setContract(e.target.value)}
          />
        </Field>

        <div className="mt-8 flex items-center justify-end gap-3">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={!name.trim() || !dob}>
            {isEdit ? "Save changes" : "Add athlete"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
