"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import {
  CLUB_TYPES,
  METHODOLOGY_STYLES,
  PRIORITIES,
  ROLES,
  useOnboarding,
  type ClubType,
  type MethodologyStyle,
  type Priority,
  type Role,
  type Step,
} from "@/data/onboarding";
import { SPORTS, sportById, type SportId } from "@/data/sports";
import { OnboardingProgress } from "./OnboardingProgress";
import { PrimaryButton, GhostButton } from "@/components/ui/Field";

const stepTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

export function OnboardingFlow() {
  const router = useRouter();
  const step = useOnboarding((s) => s.step);
  const hydrated = useOnboarding((s) => s.hydrated);
  const completed = useOnboarding((s) => s.completed);

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
    if (hydrated && completed) router.replace("/");
  }, [hydrated, completed, router]);

  const setStep = useOnboarding((s) => s.setStep);
  const goto = (n: Step) => setStep(n);

  const canNext = useCanContinue(step);

  function next() {
    if (!canNext) return;
    if (step < 6) goto((step + 1) as Step);
  }
  function back() {
    if (step > 1) goto((step - 1) as Step);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && step < 6 && canNext) {
        const t = e.target as HTMLElement | null;
        if (t && t.tagName === "TEXTAREA") return;
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, canNext]);

  if (!hydrated) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      <OnboardingProgress step={step} />

      <div className="mx-auto flex min-h-screen max-w-[720px] flex-col justify-center px-6 pb-40 pt-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
            transition={stepTransition}
          >
            {step === 1 ? <StepSport /> : null}
            {step === 2 ? <StepYou /> : null}
            {step === 3 ? <StepClub /> : null}
            {step === 4 ? <StepStructure /> : null}
            {step === 5 ? <StepMethodology /> : null}
            {step === 6 ? <StepReady /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 6 ? (
        <FlowFooter
          step={step}
          canNext={canNext}
          onBack={back}
          onNext={next}
        />
      ) : null}
    </div>
  );
}

function useCanContinue(step: Step) {
  const sport = useOnboarding((s) => s.sport);
  const user = useOnboarding((s) => s.user);
  const club = useOnboarding((s) => s.club);
  const structure = useOnboarding((s) => s.structure);
  const methodology = useOnboarding((s) => s.methodology);

  if (step === 1) return Boolean(sport);
  if (step === 2) return Boolean(user.name.trim() && user.role);
  if (step === 3) return Boolean(club.name.trim() && club.type);
  if (step === 4) return structure.length >= 1;
  if (step === 5)
    return Boolean(methodology.style && methodology.priorities.length >= 1);
  return true;
}

/* ---------- Step 01 · Sport ---------- */

function StepSport() {
  const sport = useOnboarding((s) => s.sport);
  const setSport = useOnboarding((s) => s.setSport);

  return (
    <div>
      <StepLabel>Sport</StepLabel>
      <StepTitle>Which sport does your club run?</StepTitle>
      <StepSubtitle>
        Everything after this, from the pathway to the data providers we can connect, configures around it.
      </StepSubtitle>

      <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2">
        {SPORTS.map((s) => {
          const active = sport === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSport(s.id as SportId)}
              className={
                "group flex flex-col items-start gap-2 rounded-2xl border px-6 py-5 text-left transition-all duration-300 ease-atlas " +
                (active
                  ? "border-accent bg-accent-wash"
                  : "border-hairlineStrong hover:border-white/40 hover:bg-white/[0.02]")
              }
            >
              <div className="flex w-full items-baseline justify-between">
                <span
                  className={
                    "display text-[22px] tracking-tightish " +
                    (active ? "text-white" : "text-white")
                  }
                >
                  {s.label}
                </span>
                {active ? (
                  <span className="text-[10px] uppercase tracking-[0.22em] text-accent-tint">
                    Selected
                  </span>
                ) : null}
              </div>
              <span className="text-[12px] tracking-tightish text-bone-400">
                {s.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 02 · You ---------- */

function StepYou() {
  const user = useOnboarding((s) => s.user);
  const setUser = useOnboarding((s) => s.setUser);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <StepLabel>You</StepLabel>
      <StepTitle>Welcome to Atlas OS.</StepTitle>
      <StepSubtitle>Let's set up your sporting environment.</StepSubtitle>

      <Field label="Name">
        <input
          ref={inputRef}
          value={user.name}
          onChange={(e) => setUser({ name: e.target.value })}
          placeholder="Julián Baumann"
          className={INPUT_CLS}
        />
      </Field>

      <Field label="Role">
        <ChipGroup>
          {ROLES.map((r) => (
            <Chip
              key={r}
              active={user.role === r}
              onClick={() => setUser({ role: r as Role })}
            >
              {r}
            </Chip>
          ))}
        </ChipGroup>
      </Field>
    </div>
  );
}

/* ---------- Step 03 · Club ---------- */

function StepClub() {
  const club = useOnboarding((s) => s.club);
  const setClub = useOnboarding((s) => s.setClub);
  const sport = useOnboarding((s) => s.sport);
  const profile = sportById(sport);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <StepLabel>Club</StepLabel>
      <StepTitle>Tell us about your club.</StepTitle>
      <StepSubtitle>
        {profile
          ? `Primary team structure for your ${profile.label.toLowerCase()} organisation.`
          : "Primary team structure."}
      </StepSubtitle>

      <Field label="Club name">
        <input
          ref={inputRef}
          value={club.name}
          onChange={(e) => setClub({ name: e.target.value })}
          placeholder={
            profile?.id === "ice-hockey"
              ? "SC Bern"
              : profile?.id === "basketball"
                ? "Bàsquet Manresa"
                : profile?.id === "rugby"
                  ? "Toulon RC"
                  : "FC Nordheim"
          }
          className={INPUT_CLS}
        />
      </Field>

      <Field label="Club type">
        <ChipGroup>
          {CLUB_TYPES.map((t) => (
            <Chip
              key={t}
              active={club.type === t}
              onClick={() => setClub({ type: t as ClubType })}
            >
              {t}
            </Chip>
          ))}
        </ChipGroup>
      </Field>
    </div>
  );
}

/* ---------- Step 04 · Structure ---------- */

function StepStructure() {
  const structure = useOnboarding((s) => s.structure);
  const setStructure = useOnboarding((s) => s.setStructure);
  const sport = useOnboarding((s) => s.sport);
  const profile = sportById(sport);
  const [draft, setDraft] = useState("");

  function remove(i: number) {
    setStructure(structure.filter((_, idx) => idx !== i));
  }
  function add() {
    const v = draft.trim();
    if (!v) return;
    if (structure.includes(v)) return;
    setStructure([...structure, v]);
    setDraft("");
  }
  function resetToDefault() {
    if (profile) setStructure([...profile.defaultStages]);
  }

  return (
    <div>
      <StepLabel>Structure</StepLabel>
      <StepTitle>How is your club structured?</StepTitle>
      <StepSubtitle>
        {profile
          ? `The default follows a typical ${profile.label.toLowerCase()} pathway. Adjust it to match your organisation.`
          : "Add or remove stages so this matches how your club operates."}
      </StepSubtitle>

      <div className="mt-14">
        <ol>
          {structure.map((stage, i) => (
            <li key={stage}>
              <div className="group grid grid-cols-[24px_1fr_24px] items-center gap-4 border-t border-hairline py-5 last:border-b">
                <span className="text-[11px] tracking-[0.16em] text-bone-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[19px] tracking-tightish text-white">
                  {stage}
                </span>
                <button
                  onClick={() => remove(i)}
                  aria-label={`Remove ${stage}`}
                  className="text-bone-500 transition-colors hover:text-signal-rose"
                >
                  <X size={14} strokeWidth={1.6} />
                </button>
              </div>
              {i < structure.length - 1 ? (
                <div className="flex items-center pl-8 py-1 text-[13px] text-bone-500">
                  ↓
                </div>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex items-center gap-3 border-t border-hairlineStrong pt-6">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="Add another stage"
            className={INPUT_CLS + " flex-1"}
          />
          <button
            onClick={add}
            disabled={!draft.trim()}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-accent-tint transition-colors hover:text-white disabled:opacity-30"
          >
            <Plus size={12} strokeWidth={1.6} />
            Add stage
          </button>
        </div>

        {profile ? (
          <button
            onClick={resetToDefault}
            className="mt-6 text-[11px] uppercase tracking-[0.16em] text-bone-500 transition-colors hover:text-bone-200"
          >
            Reset to {profile.label.toLowerCase()} default
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- Step 05 · Methodology ---------- */

function StepMethodology() {
  const methodology = useOnboarding((s) => s.methodology);
  const setMethodology = useOnboarding((s) => s.setMethodology);
  const togglePriority = useOnboarding((s) => s.togglePriority);

  return (
    <div>
      <StepLabel>Methodology</StepLabel>
      <StepTitle>How does your club define development?</StepTitle>
      <StepSubtitle>You can refine the framework later.</StepSubtitle>

      <Field label="Style">
        <ChipGroup>
          {METHODOLOGY_STYLES.map((s) => (
            <Chip
              key={s}
              active={methodology.style === s}
              onClick={() => setMethodology({ style: s as MethodologyStyle })}
            >
              {s}
            </Chip>
          ))}
        </ChipGroup>
      </Field>

      <Field
        label="What matters most"
        hint={`Choose up to three. ${methodology.priorities.length} of 3 selected.`}
      >
        <ChipGroup>
          {PRIORITIES.map((p) => {
            const active = methodology.priorities.includes(p);
            const disabled = !active && methodology.priorities.length >= 3;
            return (
              <Chip
                key={p}
                active={active}
                disabled={disabled}
                onClick={() => togglePriority(p as Priority)}
              >
                {p}
              </Chip>
            );
          })}
        </ChipGroup>
      </Field>
    </div>
  );
}

/* ---------- Step 06 · Ready ---------- */

function StepReady() {
  const complete = useOnboarding((s) => s.complete);
  const setDemoMode = useOnboarding((s) => s.setDemoMode);
  const sport = useOnboarding((s) => s.sport);
  const profile = sportById(sport);
  const router = useRouter();
  const [revealed, setRevealed] = useState(0);
  const [ready, setReady] = useState(false);
  const [pathChoice, setPathChoice] = useState<"demo" | "fresh">("demo");

  const items = [
    "Sport profile",
    "Sporting structure",
    "Squad environment",
    "Pathway",
    "Review cycles",
    "Club profile",
  ];

  useEffect(() => {
    let cancel = false;
    let i = 0;
    const step = () => {
      if (cancel) return;
      i += 1;
      setRevealed(i);
      if (i < items.length) {
        setTimeout(step, 300);
      } else {
        setTimeout(() => !cancel && setReady(true), 400);
      }
    };
    setTimeout(step, 220);
    return () => {
      cancel = true;
    };
  }, []);

  function enter() {
    setDemoMode(pathChoice === "demo");
    complete();
    router.replace("/");
  }

  return (
    <div>
      <StepLabel>Ready</StepLabel>
      <StepTitle>
        {ready ? "Your Atlas is ready." : "Building your Atlas."}
      </StepTitle>
      <StepSubtitle>
        {ready
          ? "You can add players, decisions and reviews once you are inside."
          : "Setting up the initial sporting environment."}
      </StepSubtitle>

      <ol className="mt-14">
        {items.map((item, i) => {
          const shown = i < revealed;
          return (
            <li
              key={item}
              className="grid grid-cols-[28px_1fr] items-baseline gap-4 border-t border-hairline py-5 last:border-b"
            >
              <span
                className={`transition-colors duration-500 ease-atlas ${
                  shown ? "text-accent-tint" : "text-bone-700"
                }`}
              >
                {shown ? <Check size={14} strokeWidth={2} /> : <span className="inline-block h-[10px] w-[10px] rounded-full border border-hairlineStrong" />}
              </span>
              <motion.span
                initial={{ opacity: 0.3 }}
                animate={{ opacity: shown ? 1 : 0.3 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`text-[17px] tracking-tightish ${shown ? "text-white" : "text-bone-500"}`}
              >
                {item}
              </motion.span>
            </li>
          );
        })}
      </ol>

      {ready ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 border-t border-hairline pt-8"
        >
          <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-bone-500">
            Where would you like to start?
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <PathChoice
              active={pathChoice === "fresh"}
              onClick={() => setPathChoice("fresh")}
              title="Start with my own roster"
              hint="Empty squad. Add athletes manually or paste your roster."
            />
            <PathChoice
              active={pathChoice === "demo"}
              onClick={() => setPathChoice("demo")}
              title="Explore with a sample squad"
              hint="Preloaded football squad so you can look around first."
            />
          </div>

          {profile && pathChoice === "fresh" ? (
            <div className="mt-6 text-[12px] leading-relaxed text-bone-500">
              You can connect {profile.integrations.slice(0, 2).join(" or ")} later to sync automatically.
            </div>
          ) : null}
        </motion.div>
      ) : null}

      <div className="mt-14">
        <PrimaryButton onClick={enter} disabled={!ready}>
          Enter Atlas
          <ArrowRight size={14} strokeWidth={1.4} />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ---------- Building blocks ---------- */

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
      {children}
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="display mt-6 text-[42px] leading-tight tracking-tightest text-white md:text-[52px]">
      {children}
    </h1>
  );
}

function StepSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed tracking-tightish text-bone-300">
      {children}
    </p>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-12">
      <div className="flex items-baseline justify-between">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bone-400">
          {label}
        </div>
        {hint ? (
          <div className="text-[11px] tracking-tightish text-bone-500">{hint}</div>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

const INPUT_CLS =
  "w-full border-0 border-b border-hairlineStrong bg-transparent pb-3 text-[24px] tracking-tightish text-white outline-none placeholder:text-bone-600 focus:border-accent focus:outline-none";

function ChipGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function PathChoice({
  active,
  onClick,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "group flex flex-col items-start gap-2 rounded-2xl border px-6 py-5 text-left transition-all duration-300 ease-atlas " +
        (active
          ? "border-accent bg-accent-wash"
          : "border-hairlineStrong hover:border-white/40 hover:bg-white/[0.02]")
      }
    >
      <div className="flex w-full items-baseline justify-between">
        <span className="display text-[17px] tracking-tightish text-white">
          {title}
        </span>
        {active ? (
          <span className="text-[10px] uppercase tracking-[0.22em] text-accent-tint">
            Selected
          </span>
        ) : null}
      </div>
      <span className="text-[12px] tracking-tightish text-bone-400">{hint}</span>
    </button>
  );
}

function Chip({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        "rounded-full border px-4 py-2 text-[13px] tracking-tightish transition-all duration-300 ease-atlas " +
        (active
          ? "border-accent bg-accent"
          : disabled
            ? "border-hairline text-bone-600"
            : "border-hairlineStrong text-bone-200 hover:border-white hover:text-white")
      }
      style={active ? { color: "#FEFEFE" } : undefined}
    >
      {children}
    </button>
  );
}

function FlowFooter({
  step,
  canNext,
  onBack,
  onNext,
}: {
  step: Step;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-[720px] items-center justify-between px-6 py-5">
        <div>
          {step === 1 ? (
            <span />
          ) : (
            <GhostButton onClick={onBack}>
              <ArrowLeft size={12} strokeWidth={1.4} />
              Back
            </GhostButton>
          )}
        </div>

        <div className="text-[10px] uppercase tracking-[0.18em] text-bone-500">
          Press enter to continue
        </div>

        <PrimaryButton onClick={onNext} disabled={!canNext}>
          Continue
          <ArrowRight size={14} strokeWidth={1.4} />
        </PrimaryButton>
      </div>
    </div>
  );
}
