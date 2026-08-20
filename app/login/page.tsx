"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { AtlasWordmark } from "@/components/shell/AtlasMark";
import { PrimaryButton } from "@/components/ui/Field";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Phase = "idle" | "sent" | "error";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [pending, startTransition] = useTransition();

  function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setPhase("error");
        setErrorMsg(error.message);
      } else {
        setPhase("sent");
      }
    });
  }

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-10 py-5">
        <AtlasWordmark size={16} />
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[420px] flex-col justify-center px-10 pb-24">
        {phase === "sent" ? (
          <div className="atlas-enter">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
              Check your inbox
            </div>
            <h1 className="display mt-6 text-[36px] leading-tight tracking-tightest text-white">
              A sign-in link is on its way.
            </h1>
            <p className="mt-6 text-[14px] leading-relaxed tracking-tightish text-bone-300">
              We sent a magic link to{" "}
              <span className="text-white">{email}</span>. Open it on this
              device and Atlas will let you in.
            </p>
            <button
              onClick={() => {
                setPhase("idle");
                setEmail("");
              }}
              className="mt-10 text-[12px] uppercase tracking-[0.16em] text-bone-400 transition-colors hover:text-white"
            >
              ← Use a different address
            </button>
          </div>
        ) : (
          <div className="atlas-enter">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
              Sign in
            </div>
            <h1 className="display mt-6 text-[36px] leading-tight tracking-tightest text-white">
              Welcome to Atlas.
            </h1>
            <p className="mt-6 text-[14px] leading-relaxed tracking-tightish text-bone-300">
              Enter your email and we&rsquo;ll send you a one-time sign-in
              link. No passwords to remember.
            </p>

            <form onSubmit={sendLink} className="mt-10">
              <label className="block border-t border-hairline py-4">
                <span className="label block pb-2">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@club.com"
                  className="w-full border-0 bg-transparent p-0 text-[14px] tracking-tightish text-white outline-none placeholder:text-bone-500 focus:outline-none"
                />
              </label>

              <div className="mt-8 flex items-center gap-4">
                <PrimaryButton type="submit" disabled={pending || !email.trim()}>
                  {pending ? "Sending…" : "Send sign-in link"}
                </PrimaryButton>
              </div>

              {phase === "error" && errorMsg ? (
                <p className="mt-6 text-[12px] tracking-tightish text-signal-rose">
                  {errorMsg}
                </p>
              ) : null}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
