"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Athlete } from "@/lib/types";
import { useAtlas } from "@/data/store";
import { cyclesForAthlete } from "@/data/cycles";
import { formatDateLong, todayISO } from "@/lib/utils";
import { Section } from "../ui/Section";
import { Modal } from "../ui/Modal";
import { Field, GhostButton, PrimaryButton, Select, TextArea, TextInput } from "../ui/Field";

export function ReviewBlock({ athlete }: { athlete: Athlete }) {
  const reviewsFor = useAtlas((s) => s.reviewsFor);
  const addReview = useAtlas((s) => s.addReview);
  const list = reviewsFor(athlete.id);
  const latest = list[0];
  const cycles = cyclesForAthlete(athlete.id);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [reviewer, setReviewer] = useState("Technical Director");
  const [assessment, setAssessment] = useState("");
  const [priority, setPriority] = useState(athlete.developmentPriority);
  const [next, setNext] = useState("");
  const [cycleId, setCycleId] = useState<string>("");

  function submit() {
    if (!assessment.trim()) return;
    addReview({
      athleteId: athlete.id,
      date,
      reviewer,
      assessment: assessment.trim(),
      developmentPriority: priority.trim(),
      nextReviewDate: next || undefined,
      cycleId: cycleId || undefined,
    });
    setAssessment("");
    setNext("");
    setCycleId("");
    setOpen(false);
  }

  return (
    <Section
      title="Review"
      aside={
        list.length
          ? list.length === 1
            ? "One review on record."
            : `${list.length} reviews on record.`
          : "No reviews yet."
      }
      delay={0.18}
    >
      {latest ? (
        <div>
          <MetaRow k="Date" v={formatDateLong(latest.date)} />
          <MetaRow k="Reviewer" v={latest.reviewer} />
          <div className="grid grid-cols-12 gap-4 border-t border-hairline py-5">
            <div className="col-span-3 label">Assessment</div>
            <div className="col-span-9 text-[16px] leading-relaxed tracking-tightish text-white">
              {latest.assessment}
            </div>
          </div>
          <MetaRow k="Development priority" v={latest.developmentPriority} />
          {list.length > 1 ? (
            <details className="mt-8 border-t border-hairline">
              <summary className="cursor-pointer py-5 text-[13px] tracking-tightish text-bone-400 hover:text-white">
                {list.length - 1} earlier review{list.length - 1 === 1 ? "" : "s"}
              </summary>
              <ol className="pb-2">
                {list.slice(1).map((r) => (
                  <li key={r.id} className="grid grid-cols-12 gap-4 border-t border-hairline py-4">
                    <div className="col-span-3 text-[13px] text-bone-300">
                      {formatDateLong(r.date)}
                    </div>
                    <div className="col-span-3 text-[13px] tracking-tightish text-bone-200">
                      {r.reviewer}
                    </div>
                    <div className="col-span-6 text-[13px] tracking-tightish text-bone-300">
                      {r.assessment}
                    </div>
                  </li>
                ))}
              </ol>
            </details>
          ) : null}
        </div>
      ) : (
        <div className="border-t border-hairlineStrong py-10 text-[14px] tracking-tightish text-bone-400">
          No review recorded yet.
        </div>
      )}

      <div className="mt-10 flex items-center gap-3">
        <PrimaryButton onClick={() => setOpen(true)}>
          <Plus size={12} strokeWidth={1.6} />
          Add Review
        </PrimaryButton>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} section="Review" title="Add Review">
        <div>
          <Field label="Review date">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Reviewer">
            <Select value={reviewer} onChange={(e) => setReviewer(e.target.value)}>
              <option>Technical Director</option>
              <option>Sporting Director</option>
              <option>Head Coach</option>
              <option>Head of Performance</option>
              <option>Academy Director</option>
            </Select>
          </Field>
          <Field label="Assessment">
            <TextArea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="What you saw in the last window, in your own words."
            />
          </Field>
          <Field label="Development priority">
            <TextInput value={priority} onChange={(e) => setPriority(e.target.value)} />
          </Field>
          <Field label="Next review date">
            <TextInput type="date" value={next} onChange={(e) => setNext(e.target.value)} />
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
          <div className="mt-8 flex items-center justify-end gap-3">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton onClick={submit} disabled={!assessment.trim()}>
              Save Review
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </Section>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-12 gap-4 border-t border-hairline py-5 first:border-hairlineStrong">
      <div className="col-span-3 label">{k}</div>
      <div className="col-span-9 text-[13px] tracking-tightish text-white">{v}</div>
    </div>
  );
}
