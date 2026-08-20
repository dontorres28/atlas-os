"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { StoreHydrator } from "./StoreHydrator";
import { OnboardingGate } from "./OnboardingGate";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname?.startsWith("/onboarding") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/auth");

  if (bare) {
    return (
      <div className="min-h-screen text-bone-100">
        {children}
        <StoreHydrator />
        <OnboardingGate />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-bone-100">
      <TopBar />
      <main className="mx-auto max-w-[1360px] px-10 pb-40 pt-4 md:px-14 lg:px-20">
        {children}
      </main>
      <footer className="mx-auto max-w-[1360px] border-t border-hairline px-10 pb-40 pt-10 md:px-14 lg:px-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-500">
              Atlas OS
            </span>
            <span className="text-[11px] text-bone-500">
              Squad intelligence, v0.1
            </span>
          </div>
          <div className="text-[11px] text-bone-500">
            An operating layer for high-performance sport.
          </div>
        </div>
      </footer>
      <BottomNav />
      <StoreHydrator />
      <OnboardingGate />
    </div>
  );
}
