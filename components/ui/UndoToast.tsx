"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";

/**
 * Global toast slot used exclusively for the Undo pattern (Apple §16
 * Agency: forgiveness over confirmation). A destructive action commits
 * immediately, then this toast gives the user a ~6-second window to
 * take it back. If the timer runs out the action stays committed.
 */
type ToastState = {
  id: number;
  message: string;
  onUndo: () => void;
  duration: number;
};

type ToastAPI = {
  show: (opts: { message: string; onUndo: () => void; duration?: number }) => void;
};

const UndoToastContext = createContext<ToastAPI | null>(null);

export function useUndoToast() {
  const ctx = useContext(UndoToastContext);
  if (!ctx) {
    throw new Error(
      "useUndoToast must be used inside <UndoToaster> (mounted in AppShell).",
    );
  }
  return ctx;
}

export function UndoToaster({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setToast(null);
  }, []);

  const show = useCallback<ToastAPI["show"]>(
    ({ message, onUndo, duration = 6000 }) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const id = Date.now();
      setToast({ id, message, onUndo, duration });
      timerRef.current = setTimeout(() => {
        setToast((cur) => (cur?.id === id ? null : cur));
      }, duration);
    },
    [],
  );

  function handleUndo() {
    if (!toast) return;
    toast.onUndo();
    dismiss();
  }

  return (
    <UndoToastContext.Provider value={{ show }}>
      {children}
      {mounted
        ? createPortal(
            <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
              <AnimatePresence>
                {toast ? (
                  <motion.div
                    key={toast.id}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                    transition={
                      reduce
                        ? { duration: 0.15 }
                        : { type: "spring", bounce: 0, duration: 0.3 }
                    }
                    className="solid-glass pointer-events-auto relative flex min-w-[260px] max-w-[420px] items-center gap-3 overflow-hidden rounded-full py-2 pl-4 pr-2"
                  >
                    <span className="flex-1 truncate text-[13px] tracking-tightish text-bone-100">
                      {toast.message}
                    </span>
                    <button
                      onClick={handleUndo}
                      className="press-scale inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent-soft"
                    >
                      <RotateCcw size={11} strokeWidth={2} />
                      Undo
                    </button>
                    <motion.span
                      key={`bar-${toast.id}`}
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{
                        duration: toast.duration / 1000,
                        ease: "linear",
                      }}
                      style={{ transformOrigin: "left center" }}
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-accent-tint/60"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </UndoToastContext.Provider>
  );
}
