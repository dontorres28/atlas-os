"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block border-t border-hairline py-4">
      <span className="label block pb-2">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full border-0 bg-transparent p-0 text-[14px] tracking-tightish text-white outline-none placeholder:text-bone-500 focus:outline-none";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={inputClass} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-[88px] resize-none leading-relaxed`}
    />
  );
}

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputClass} appearance-none bg-transparent`}
    >
      {children}
    </select>
  );
}

export function PrimaryButton({
  children,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="group inline-flex items-center gap-3 rounded-full border border-accent bg-accent px-5 py-2.5 text-[12px] tracking-tightish shadow-[0_8px_24px_-8px_rgba(24,61,168,0.7)] transition-colors duration-500 ease-atlas hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
      style={{ color: "#FEFEFE", ...style }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[12px] tracking-tightish text-bone-200 transition-colors duration-500 ease-atlas hover:border-hairlineStrong hover:text-white"
    >
      {children}
    </button>
  );
}
