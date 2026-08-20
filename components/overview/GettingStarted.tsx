"use client";

import Link from "next/link";
import { Plus, Upload, LayoutGrid } from "lucide-react";
import { PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useOnboarding } from "@/data/onboarding";

/**
 * Shown on the Overview when the club has no athletes on record and
 * has explicitly chosen a fresh start (demoMode = false).
 * Guides the user to their first meaningful action.
 */
export function GettingStarted() {
  const setDemoMode = useOnboarding((s) => s.setDemoMode);

  return (
    <section className="mx-auto max-w-[720px] pb-20 pt-8">
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
        Get started
      </div>
      <h2 className="display mt-6 text-[36px] leading-tight tracking-tightest text-white md:text-[44px]">
        Atlas is ready. Add your first athletes to bring it to life.
      </h2>
      <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed tracking-tightish text-bone-300">
        Squad State, Today, and the trend will populate as reviews, decisions and pathway status build up. You can start by adding one athlete or by pasting your roster.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link href="/squad">
          <PrimaryButton>
            <Plus size={12} strokeWidth={1.6} />
            Add an athlete
          </PrimaryButton>
        </Link>
        <Link href="/squad">
          <GhostButton>
            <Upload size={12} strokeWidth={1.6} />
            Import a roster
          </GhostButton>
        </Link>
      </div>

      <button
        onClick={() => setDemoMode(true)}
        className="mt-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bone-500 transition-colors hover:text-white"
      >
        <LayoutGrid size={11} strokeWidth={1.4} />
        Or explore Atlas with a sample squad
      </button>
    </section>
  );
}
