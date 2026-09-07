"use client";

import { ExternalLink, Plus, X } from "lucide-react";
import { useState } from "react";
import type { Evidence } from "@/lib/types";

/**
 * Renders a row of source chips — the evidence layer that turns Atlas
 * claims from opinion into record. Chips with a URL open in a new tab;
 * chips without one show as a plain label ("Season debrief, 2026-05-30").
 */
export function SourceChips({
  sources,
  className,
}: {
  sources?: Evidence[];
  className?: string;
}) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {sources.map((s, i) => {
        const inner = (
          <>
            <span className="truncate">{s.label}</span>
            {s.url ? <ExternalLink size={10} strokeWidth={1.6} className="shrink-0" /> : null}
          </>
        );
        return s.url ? (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-[240px] items-center gap-1.5 rounded-full border border-hairline bg-white/[0.02] px-3 py-1 text-[11px] tracking-tightish text-bone-200 transition-colors hover:border-hairlineStrong hover:text-white"
          >
            {inner}
          </a>
        ) : (
          <span
            key={i}
            className="inline-flex max-w-[240px] items-center gap-1.5 rounded-full border border-hairline px-3 py-1 text-[11px] tracking-tightish text-bone-300"
          >
            {inner}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Compact inline editor for a sources list. Emits a new array via
 * `onChange` on every mutation, so the parent form stays a controlled
 * component. Deliberately minimal — one label + optional URL per row.
 */
export function SourceEditor({
  value,
  onChange,
  label = "Sources",
}: {
  value: Evidence[];
  onChange: (next: Evidence[]) => void;
  label?: string;
}) {
  const [draftLabel, setDraftLabel] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  function add() {
    if (!draftLabel.trim()) return;
    onChange([...value, { label: draftLabel.trim(), url: draftUrl.trim() || undefined }]);
    setDraftLabel("");
    setDraftUrl("");
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="border-t border-hairline py-4">
      <div className="label pb-2">{label}</div>

      {value.length > 0 ? (
        <ul className="mb-3 flex flex-col gap-1.5">
          {value.map((s, i) => (
            <li
              key={i}
              className="group flex items-center gap-3 rounded-lg border border-hairline px-3 py-2 text-[12px] tracking-tightish"
            >
              <span className="flex-1 truncate text-white">{s.label}</span>
              {s.url ? (
                <span className="truncate text-bone-500">{s.url}</span>
              ) : null}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-bone-500 opacity-0 transition-opacity hover:text-signal-rose group-hover:opacity-100"
                aria-label="Remove source"
              >
                <X size={12} strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
        <input
          type="text"
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value)}
          placeholder="Label — e.g. Season debrief"
          className="w-full border-0 border-b border-hairline bg-transparent p-0 pb-1 text-[13px] tracking-tightish text-white outline-none placeholder:text-bone-500 focus:border-hairlineStrong focus:outline-none"
        />
        <input
          type="url"
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          placeholder="URL (optional)"
          className="w-full border-0 border-b border-hairline bg-transparent p-0 pb-1 text-[13px] tracking-tightish text-white outline-none placeholder:text-bone-500 focus:border-hairlineStrong focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draftLabel.trim()}
          className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-bone-200 transition-colors hover:border-hairlineStrong hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={11} strokeWidth={1.5} />
          Add
        </button>
      </div>
    </div>
  );
}
