"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Athlete, DecisionArea, DecisionStatus } from "@/lib/types";
import { useAtlas } from "@/data/store";
import { cyclesForAthlete } from "@/data/cycles";
import { formatDateLong, todayISO } from "@/lib/utils";
import { Section } from "../ui/Section";
import { Modal } from "../ui/Modal";
import { Field, GhostButton, PrimaryButton, Select, TextArea, TextInput } from "../ui/Field";

const AREAS: DecisionArea[] = ["Contract", "Pathway", "Development", "Role", "Loan"];
const STATUSES: DecisionStatus[] = ["Pending", "Active", "Confirmed", "Deferred", "Rejected"];

function statusColor(s: DecisionStatus) {
  switch (s) {
    case "Confirmed":
    case "Closed":
      return "text-signal-moss";
    case "Active":
      return "text-accent-tint";
    case "Pending":
      return "text-signal-amber";
    case "Rejected":
      return "text-signal-rose";
    default:
      return "text-bone-400";
  }
}

export function DecisionsBlock({ athlete }: { athlete: Athlete }) {
  const decisionsFor = useAtlas((s) => s.decisionsFor);
  const addDecision = useAtlas((s) => s.addDecision);
  const list = decisionsFor(athlete.id);
  const cycles = cyclesForAthlete(athlete.id);

  const [open, setOpen] = useState(false);
  const [area, setArea] = useState<DecisionArea>("Pathway");
  const [summary, setSummary] = useState("");
  const [rationale, setRationale] = useState("");
  const [owner, setOwner] = useState("Technical Director");
  const [date, setDate] = useState(todayISO());
  const [expected, setExpected] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [cycleId, setCycleId] = useState<string>("");
  const [status, setStatus] = useState<DecisionStatus>("Active");

  function submit() {
    if (!summary.trim()) return;
    addDecision({
      athleteId: athlete.id,
      area,
      summary: summary.trim(),
      rationale: rationale.trim() || undefined,
      owner,
      date,
      expectedOutcome: expected.trim() || undefined,
      reviewDate: reviewDate || undefined,
      cycleId: cycleId || undefined,
      status,
    });
    setSummary("");
    setRationale("");
    setExpected("");
    setReviewDate("");
    setCycleId("");
    setOpen(false);
  }

  return (
    <Section
      title="Decisions"
      aside={
        list.length
          ? "What was decided, why, and how it turned out."
          : "Nothing on record yet."
      }
      delay={0.21}
    >
      {list.length === 0 ? (
        <div className="border-t border-hairlineStrong py-10 text-[14px] tracking-tightish text-bone-400">
          No sporting decisions recorded yet.
        </div>
      ) : (
        <ol>
          {list.map((d) => (
            <li
              key={d.id}
              className="border-t border-hairline first:border-hairlineStrong last:border-b"
            >
              <Link
                href={`/decisions/${d.id}`}
                className="group block py-7 transition-colors duration-500 ease-atlas hover:bg-white/[0.02]"
              >
                <div className="grid grid-cols-12 items-baseline gap-4">
                  <span className="col-span-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent-tint">
                    Decision {d.code}
                  </span>
                  <span className="col-span-7 text-[17px] leading-relaxed tracking-tightish text-white">
                    {d.summary}
                  </span>
                  <span className="col-span-2 text-right text-[13px] text-bone-300">
                    {formatDateLong(d.date)}
                  </span>
                  <span
                    className={`col-span-1 text-right text-[11px] uppercase tracking-[0.16em] ${statusColor(
                      d.status,
                    )}`}
                  >
                    {d.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-12 gap-4">
                  <span className="col-span-2 text-[10px] uppercase tracking-[0.18em] text-bone-500">
                    {d.area}
                  </span>
                  <div className="col-span-7 meta text-bone-300">
                    <span>{d.owner}</span>
                    {d.expectedOutcome ? (
                      <span className="ml-6">Expected: {d.expectedOutcome}</span>
                    ) : null}
                    {d.reviewDate ? (
                      <span className="ml-6">
                        Review {formatDateLong(d.reviewDate)}
                      </span>
                    ) : null}
                  </div>
                  <span className="col-span-3 text-right meta text-bone-400">
                    {d.outcome
                      ? `Outcome recorded. ${d.outcome.verdict}.`
                      : "Awaiting outcome."}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-10 flex items-center gap-3">
        <PrimaryButton onClick={() => setOpen(true)}>
          <Plus size={12} strokeWidth={1.6} />
          Record Decision
        </PrimaryButton>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} section="Decision" title="Record Decision">
        <div>
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
            <TextInput type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
          </Field>
          {cycles.length ? (
            <Field label="Related cycle">
              <Select value={cycleId} onChange={(e) => setCycleId(e.target.value)}>
                <option value="">None</option>
                {cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.monthLabel}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as DecisionStatus)}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <div className="mt-8 flex items-center justify-end gap-3">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton onClick={submit} disabled={!summary.trim()}>
              Save Decision
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </Section>
  );
}
