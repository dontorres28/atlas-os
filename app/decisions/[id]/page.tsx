"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAtlas } from "@/data/store";
import { athletes } from "@/data/athletes";
import { getCycle } from "@/data/cycles";
import { formatDateLong } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Field, GhostButton, PrimaryButton, Select, TextArea } from "@/components/ui/Field";
import type { DecisionOutcome } from "@/lib/types";

const VERDICTS: DecisionOutcome["verdict"][] = [
  "Achieved",
  "Partially Achieved",
  "Not Achieved",
];

const TODAY = "2026-08-17";

export default function DecisionDetail() {
  const params = useParams<{ id: string }>();
  const getDecision = useAtlas((s) => s.getDecision);
  const recordOutcome = useAtlas((s) => s.recordDecisionOutcome);
  const decision = getDecision(params.id);
  if (!decision) return notFound();

  const athlete = athletes.find((a) => a.id === decision.athleteId);
  const cycle = decision.cycleId ? getCycle(decision.cycleId) : undefined;
  const overdue =
    !decision.outcome && decision.reviewDate && decision.reviewDate < TODAY;

  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState<DecisionOutcome["verdict"]>("Achieved");
  const [actual, setActual] = useState("");
  const [evidence, setEvidence] = useState("");

  function submit() {
    if (!actual.trim()) return;
    recordOutcome(decision.id, {
      verdict,
      actual: actual.trim(),
      evidence: evidence.trim() || undefined,
    });
    setActual("");
    setEvidence("");
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        section={`Decision ${decision.code}`}
        title={decision.summary}
        meta={`${decision.area}. Owned by ${decision.owner}. Recorded ${formatDateLong(decision.date)}.`}
        actions={
          <Link
            href="/decisions"
            className="text-[11px] uppercase tracking-[0.16em] text-bone-400 hover:text-white"
          >
            Ledger
          </Link>
        }
      />

      {overdue ? (
        <div className="border-b border-hairline py-6">
          <div className="inline-flex items-center gap-4 rounded-full border border-signal-rose/40 bg-signal-rose/10 px-5 py-2.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-signal-rose">
              Overdue for review
            </span>
            <span className="meta text-bone-200">
              Expected {formatDateLong(decision.reviewDate!)}
            </span>
          </div>
        </div>
      ) : null}

      <section className="grid grid-cols-12 gap-8 border-b border-hairline py-16 md:gap-12">
        <div className="col-span-12 md:col-span-3">
          <h2 className="display text-[22px] tracking-tightish text-white">Rationale</h2>
        </div>
        <div className="col-span-12 md:col-span-9 text-[18px] leading-relaxed tracking-tightish text-white">
          {decision.rationale ?? "No rationale recorded."}
        </div>
      </section>

      <section className="grid grid-cols-12 gap-8 border-b border-hairline py-16 md:gap-12">
        <div className="col-span-12 md:col-span-3">
          <h2 className="display text-[22px] tracking-tightish text-white">Record</h2>
        </div>
        <div className="col-span-12 md:col-span-9">
          <dl>
            <Row k="Athlete" v={athlete ? athlete.name : ""} href={athlete ? `/squad/${athlete.id}` : undefined} />
            <Row k="Area" v={decision.area} />
            <Row k="Owner" v={decision.owner} />
            <Row k="Date" v={formatDateLong(decision.date)} />
            <Row
              k="Expected outcome"
              v={decision.expectedOutcome ?? "Not set."}
            />
            <Row
              k="Review date"
              v={decision.reviewDate ? formatDateLong(decision.reviewDate) : "Not scheduled."}
            />
            <Row
              k="Cycle"
              v={cycle ? cycle.name : "None"}
              href={cycle ? `/cycles/${cycle.id}` : undefined}
            />
            <Row k="Status" v={decision.status} />
          </dl>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-8 py-16 md:gap-12">
        <div className="col-span-12 md:col-span-3">
          <h2 className="display text-[22px] tracking-tightish text-white">Outcome</h2>
          <p className="meta mt-4 max-w-[30ch]">
            What actually happened, so the next decision can start from what the last one taught us.
          </p>
        </div>
        <div className="col-span-12 md:col-span-9">
          {decision.outcome ? (
            <dl>
              <Row k="Verdict" v={decision.outcome.verdict} />
              <Row k="Actual" v={decision.outcome.actual} />
              <Row
                k="Evidence"
                v={decision.outcome.evidence ?? "None recorded."}
              />
              <Row
                k="Recorded"
                v={formatDateLong(decision.outcome.recordedAt)}
              />
            </dl>
          ) : (
            <div className="border-t border-hairlineStrong py-10 text-[14px] tracking-tightish text-bone-300">
              No outcome recorded yet.
              {decision.expectedOutcome ? (
                <>
                  {" "}
                  Original expectation:{" "}
                  <span className="text-white">{decision.expectedOutcome}</span>
                </>
              ) : null}
            </div>
          )}

          {!decision.outcome ? (
            <div className="mt-10 flex items-center gap-3">
              <PrimaryButton onClick={() => setOpen(true)}>
                Record outcome
              </PrimaryButton>
            </div>
          ) : null}
        </div>
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        section="Decision review"
        title={`Review Decision ${decision.code}`}
      >
        <div>
          <div className="border-t border-hairlineStrong pt-4">
            <div className="label">Original expectation</div>
            <div className="mt-2 text-[14px] tracking-tightish text-white">
              {decision.expectedOutcome ?? "Not set."}
            </div>
          </div>
          <Field label="Actual outcome">
            <TextArea
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              placeholder="What actually happened."
            />
          </Field>
          <Field label="Verdict">
            <Select
              value={verdict}
              onChange={(e) =>
                setVerdict(e.target.value as DecisionOutcome["verdict"])
              }
            >
              {VERDICTS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Evidence">
            <TextArea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Where this reading comes from. A report, a meeting, a dataset."
            />
          </Field>
          <div className="mt-8 flex items-center justify-end gap-3">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton onClick={submit} disabled={!actual.trim()}>
              Record outcome
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </>
  );
}

function Row({ k, v, href }: { k: string; v: string; href?: string }) {
  return (
    <div className="grid grid-cols-12 gap-4 border-t border-hairline py-4 first:border-hairlineStrong">
      <dt className="col-span-3 label">{k}</dt>
      {href ? (
        <Link
          href={href}
          className="col-span-9 text-[14px] tracking-tightish text-white transition-colors hover:text-accent-tint"
        >
          {v}
        </Link>
      ) : (
        <dd className="col-span-9 text-[14px] tracking-tightish text-white">{v}</dd>
      )}
    </div>
  );
}
