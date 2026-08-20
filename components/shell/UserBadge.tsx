"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Signed-in user badge with a hover-triggered menu carrying the
 * account email and a sign-out action. Falls back to a name-only
 * pill while the auth state is still loading.
 */
export function UserBadge({ fallbackName = "J. Baumann" }: { fallbackName?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = (email ?? fallbackName)
    .split(/[@.\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "JB";

  const displayName = email ? email.split("@")[0] : fallbackName;

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="hidden text-right md:block">
          <div className="text-[12px] tracking-tightish text-white">
            {displayName}
          </div>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full border border-hairlineStrong bg-ink/40 text-[11px] font-medium tracking-tightish text-white">
          {initials}
        </div>
      </button>

      {open && (
        <div className="solid-glass absolute right-0 top-[calc(100%+8px)] w-[240px] rounded-2xl p-2">
          <div className="border-b border-hairline px-4 py-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
              Signed in as
            </div>
            <div className="mt-1 truncate text-[13px] tracking-tightish text-white">
              {email ?? fallbackName}
            </div>
          </div>
          <button
            onClick={signOut}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[13px] tracking-tightish text-bone-200 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut size={13} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
