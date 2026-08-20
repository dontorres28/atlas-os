"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, GhostButton, PrimaryButton, TextArea } from "@/components/ui/Field";
import { useUserStore, type NewAthlete } from "@/data/user-store";
import type { Position, SquadTeam } from "@/lib/types";

const TEMPLATE = `name,dob,nationality,position,team,contract
Luca Meier,2003-11-14,Switzerland,CB,First Team,2028-06-30
Noah Keller,2001-07-09,Switzerland,LW,First Team,2029-06-30
Matteo Ferrari,1998-05-01,Italy,CB,First Team,2027-06-30`;

const VALID_POSITIONS: Position[] = ["GK", "CB", "RB", "LB", "DM", "CM", "AM", "RW", "LW", "CF"];
const VALID_TEAMS: SquadTeam[] = ["First Team", "U21", "U19", "Loan"];

function ageFromDob(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age -= 1;
  return age;
}

function parseCsv(text: string): NewAthlete[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return [];

  const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
  const nameIdx = header.indexOf("name");
  const dobIdx = header.findIndex((h) => h === "dob" || h === "dateofbirth" || h === "date of birth");
  const natIdx = header.indexOf("nationality");
  const posIdx = header.indexOf("position");
  const teamIdx = header.indexOf("team");
  const contractIdx = header.findIndex((h) => h === "contract" || h === "contractexpiry" || h === "contract expiry");

  if (nameIdx === -1 || posIdx === -1) return [];

  const out: NewAthlete[] = [];
  for (const line of lines.slice(1)) {
    const cells = line.split(",").map((c) => c.trim());
    const name = cells[nameIdx];
    const posRaw = (cells[posIdx] ?? "").toUpperCase();
    if (!name || !VALID_POSITIONS.includes(posRaw as Position)) continue;

    const dob = cells[dobIdx] ?? "";
    const teamRaw = cells[teamIdx] ?? "First Team";
    const team: SquadTeam = VALID_TEAMS.includes(teamRaw as SquadTeam)
      ? (teamRaw as SquadTeam)
      : "First Team";

    out.push({
      name,
      dateOfBirth: dob,
      age: ageFromDob(dob),
      nationality: cells[natIdx] ?? "",
      position: posRaw as Position,
      team,
      contractExpiry: cells[contractIdx] ?? "2027-06-30",
    });
  }
  return out;
}

export function ImportRosterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const importAthletes = useUserStore((s) => s.importAthletes);
  const [text, setText] = useState(TEMPLATE);
  const parsed = useMemo(() => parseCsv(text), [text]);

  function submit() {
    if (parsed.length === 0) return;
    importAthletes(parsed);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} section="Squad" title="Import roster">
      <div>
        <p className="mb-6 text-[13px] leading-relaxed tracking-tightish text-bone-300">
          Paste a comma-separated roster. Required columns: <span className="text-white">name</span> and <span className="text-white">position</span>. Optional: dob, nationality, team, contract.
        </p>

        <Field label="CSV">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
          />
        </Field>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-[12px] tracking-tightish text-bone-400">
            {parsed.length} athlete{parsed.length === 1 ? "" : "s"} ready to import
          </span>
          <button
            onClick={() => setText(TEMPLATE)}
            className="text-[11px] uppercase tracking-[0.16em] text-bone-500 hover:text-white"
          >
            Reset template
          </button>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={parsed.length === 0}>
            Import {parsed.length ? `${parsed.length} athlete${parsed.length === 1 ? "" : "s"}` : ""}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
