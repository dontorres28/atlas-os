"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { DecisionArea, DecisionStatus, Evidence } from "@/lib/types";
import { useAtlas } from "@/data/store";
import { useRoster } from "@/data/use-roster";
import { todayISO } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import {
  Field,
  GhostButton,
  PrimaryButton,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui/Field";
import { SourceEditor } from "@/components/ui/Sources";

const AREAS: DecisionArea[] = ["Contract", "Pathway", "Development", "Role", "Loan"];
const STATUSES: DecisionStatus[] = ["Pending", "Active", "Confirmed", "Deferred", "Rejected"];

/**
 * "Record decision" entry point for the Decisions list page. Mirrors the
 * DecisionsBlock modal on an athlete profile, but adds an athlete select
 * at the top so a Sporting Director can log a decision without first
 * navigating into a player.
 */
export function RecordDecisionButton() {
  const addDecision = useAtlas((s) => s.addDecision);
  const roster = useRoster();

  const [open, setOpen] = useState(false);
  const [athleteId, setAthleteId] = useState<string>("");
  const [area, setArea] = useState<DecisionArea>("Pathway");
  const [summary, setSummary] = useState("");
  const [rationale, setRationale] = useState("");
  const [owner, setOwner] = useState("Technical Director");
  const [date, setDate] = useState(todayISO());
  const [expected, setExpected] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [status, setStatus] = useState<DecisionStatus>("Active");
  const [sources, setSources] = useState<Evidence[]>([]);

  function reset() {
    setAthleteId("");
    setSummary("");
    setRationale("");
    setExpected("");
    setReviewDate("");
    setSources([]);
  }

  function submit() {
    if (!athleteId || !summary.trim()) return;
    addDecision({
      athleteId,
      area,
      summary: summary.trim(),
      rationale: rationale.trim() || undefined,
      owner,
      date,
      expectedOutcome: expected.trim() || undefined,
      reviewDate: reviewDate || undefined,
      status,
      sources: sources.length ? sources : undefined,
    });
    reset();
    setOpen(false);
  }

  const canSubmit = athleteId !== "" && summary.trim().length > 0;

  return (
    <>
      <PrimaryButton onClick={() => setOpen(true)}>
        <Plus size={12} strokeWidth={1.6} />
        Record decision
      </PrimaryButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        section="Decision"
        title="Record decision"
      >
        <div>
          <Field label="Athlete">
            <Select
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
            >
              <option value="">Pick an athlete</option>
              {roster.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}, {a.positionLabel}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Area">
            <Select value={area} onChange={(e) => setArea(e.target.value as DecisionArea)}>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </Select>
          </Field>
          <Field label="Decision">
            <TextArea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What is being decided, in one clear sentence."
            />
          </Field>
          <Field label="Rationale">
            <TextArea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Why the club is making this call."
            />
          </Field>
          <Field label="Owner">
            <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
              <option>Sporting Director</option>
              <option>Technical Director</option>
              <option>Head Coach</option>
              <option>Head of Performance</option>
              <option>Academy Director</option>
            </Select>
          </Field>
          <Field label="Date">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Expected outcome">
            <TextInput
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              placeholder="What success looks like."
            />
          </Field>
          <Field label="Review date">
            <TextInput
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as DecisionStatus)}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <SourceEditor value={sources} onChange={setSources} />

          <div className="mt-8 flex items-center justify-end gap-3">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton onClick={submit} disabled={!canSubmit}>
              Save decision
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
