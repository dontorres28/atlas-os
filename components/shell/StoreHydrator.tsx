"use client";

import { useEffect } from "react";
import { useAtlas } from "@/data/store";
import { useUserStore } from "@/data/user-store";

export function StoreHydrator() {
  useEffect(() => {
    let cancelled = false;

    Promise.resolve(useAtlas.persist.rehydrate());
    Promise.resolve(useUserStore.persist.rehydrate()).then(() => {
      if (!cancelled) useUserStore.getState().markHydrated();
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
