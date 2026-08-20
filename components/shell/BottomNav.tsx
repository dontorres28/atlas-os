"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, Users, GitBranch, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview", Icon: LayoutGrid },
  { href: "/squad", label: "Squad", Icon: Users },
  { href: "/pathways", label: "Pathways", Icon: GitBranch },
  { href: "/decisions", label: "Decisions", Icon: ScrollText },
];

const SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 40,
  mass: 0.9,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="atlas-float pill-glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5"
      >
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[13px] tracking-tightish transition-colors duration-300 ease-atlas",
                active ? "" : "text-bone-300 hover:text-white",
              )}
              style={active ? { color: "#FEFEFE" } : undefined}
            >
              {active ? (
                <motion.span
                  layoutId="atlas-nav-pill"
                  className="absolute inset-0 rounded-full"
                  transition={SPRING}
                  style={{
                    background:
                      "linear-gradient(180deg, var(--accent-soft) 0%, var(--accent) 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 0 1px rgba(255,255,255,0.10), 0 8px 22px -8px rgba(24,61,168,0.7)",
                  }}
                />
              ) : null}
              <span className="relative z-10 flex items-center gap-2.5">
                <item.Icon
                  size={13}
                  strokeWidth={1.5}
                  className={cn(
                    "transition-colors duration-300 ease-atlas",
                    active ? "" : "text-bone-500 group-hover:text-white",
                  )}
                  style={active ? { color: "#FEFEFE" } : undefined}
                />
                <span>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
