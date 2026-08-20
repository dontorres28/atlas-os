"use client";

import { AthleteFormModal } from "./AthleteFormModal";

/** Compatibility shim — the unified form lives in AthleteFormModal. */
export function AddAthleteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <AthleteFormModal open={open} onClose={onClose} />;
}
