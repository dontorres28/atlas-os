"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useOnboarding } from "@/data/onboarding";

/**
 * Client-side gate: on first mount, rehydrate the onboarding store from
 * localStorage. If the user hasn't completed onboarding and isn't already
 * inside it, send them there.
 */
export function OnboardingGate() {
  const pathname = usePathname();
  const router = useRouter();
  const completed = useOnboarding((s) => s.completed);
  const hydrated = useOnboarding((s) => s.hydrated);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(useOnboarding.persist.rehydrate()).then(() => {
      if (!cancelled) useOnboarding.getState().markHydrated();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (pathname?.startsWith("/onboarding")) return;
    if (!completed) router.replace("/onboarding");
  }, [hydrated, completed, pathname, router]);

  return null;
}
