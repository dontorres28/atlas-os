"use client";

import { Segmented } from "./Segmented";

export type PillFilterOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

/** Legacy shim — the underlying control is now Segmented. */
export function PillFilter<T extends string>({
  value,
  onChange,
  options,
  align = "left",
}: {
  value: T;
  onChange: (v: T) => void;
  options: PillFilterOption<T>[];
  align?: "left" | "center";
}) {
  return (
    <Segmented
      value={value}
      onChange={onChange}
      options={options}
      align={align}
    />
  );
}
