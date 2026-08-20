"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { AtlasWordmark } from "./AtlasMark";
import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-10 py-5">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="group flex items-center transition-transform duration-500 ease-atlas hover:-translate-y-[1px]"
            >
              <AtlasWordmark size={16} />
            </Link>

            <div className="hidden items-center gap-10 md:flex">
              <ContextPicker label="FC Nordheim" />
              <ContextPicker label="2026–27" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-3 rounded-full border border-hairline bg-white/[0.02] px-4 py-2 text-bone-300 transition-colors duration-500 ease-atlas hover:border-hairlineStrong hover:text-white"
            >
              <Search size={12} strokeWidth={1.5} />
              <span className="hidden text-[12px] tracking-tightish sm:inline">
                Search Atlas
              </span>
              <span className="mono text-[10px] tracking-[0.14em] text-bone-500">
                ⌘K
              </span>
            </button>
            <ThemeToggle />
            <UserBadge />
          </div>
        </div>
      </header>

      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function ContextPicker({ label }: { label: string }) {
  return (
    <button className="group flex items-center gap-2 text-left text-bone-200 transition-colors duration-500 ease-atlas hover:text-white">
      <span className="text-[13px] tracking-tightish">{label}</span>
      <ChevronDown size={11} strokeWidth={1.4} className="text-bone-500 transition-colors group-hover:text-bone-200" />
    </button>
  );
}

function UserBadge() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right md:block">
        <div className="text-[12px] tracking-tightish text-white">J. Baumann</div>
      </div>
      <div className="grid h-9 w-9 place-items-center rounded-full border border-hairlineStrong bg-ink/40 text-[11px] font-medium tracking-tightish text-white">
        JB
      </div>
    </div>
  );
}
