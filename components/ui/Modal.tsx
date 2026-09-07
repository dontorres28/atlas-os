"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Modal that adapts to viewport:
 *  - Wider than 640px → centered card (Apple: dialog materials).
 *  - Narrower → bottom sheet that slides up (mobile-native pattern,
 *    Vaul-style). Drag handle at the top, rounded top corners, and
 *    a scrollable content area so tall forms don't blow out the sheet.
 *
 * Spring physics on enter/exit (Apple §4 — critically damped, no
 * overshoot) so the surface feels physical, not scripted.
 */
export function Modal({
  open,
  onClose,
  title,
  section,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  section: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const spring = { type: "spring" as const, bounce: 0, duration: 0.35 };
  const sheetSpring = { type: "spring" as const, bounce: 0, duration: 0.3 };

  const overlay = (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={
            isMobile
              ? "fixed inset-0 z-[100] flex items-end justify-center"
              : "fixed inset-0 z-[100] flex items-start justify-center px-6 pt-[10vh]"
          }
          style={{ backgroundColor: "var(--canvas)" }}
          onClick={onClose}
        >
          {isMobile ? (
            <motion.div
              key="sheet"
              initial={reduce ? { opacity: 0 } : { y: "100%" }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: "100%" }}
              transition={reduce ? { duration: 0.15 } : sheetSpring}
              drag={reduce ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 500) onClose();
              }}
              onClick={(e) => e.stopPropagation()}
              className="solid-glass flex max-h-[92vh] w-full flex-col rounded-t-2xl"
            >
              <div className="flex justify-center pt-3">
                <span className="h-[4px] w-[42px] rounded-full bg-hairlineStrong" />
              </div>
              <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
                    {section}
                  </span>
                  <span className="text-[15px] tracking-tightish text-white">
                    {title}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-bone-400 transition-colors hover:text-white"
                  aria-label="Close"
                >
                  <X size={16} strokeWidth={1.4} />
                </button>
              </div>
              <div className="overflow-y-auto px-6 pb-8 pt-5">{children}</div>
            </motion.div>
          ) : (
            <motion.div
              key="dialog"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -8 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -6 }}
              transition={reduce ? { duration: 0.15 } : spring}
              onClick={(e) => e.stopPropagation()}
              className="solid-glass w-full max-w-xl rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-hairline px-8 py-5">
                <div className="flex items-baseline gap-6">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-tint">
                    {section}
                  </span>
                  <span className="text-[15px] tracking-tightish text-white">
                    {title}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-bone-400 transition-colors hover:text-white"
                  aria-label="Close"
                >
                  <X size={16} strokeWidth={1.4} />
                </button>
              </div>
              <div className="px-8 py-7">{children}</div>
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(overlay, document.body);
}
