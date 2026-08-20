"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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

  useEffect(() => {
    setMounted(true);
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

  const overlay = (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-6 pt-[10vh]"
          style={{ backgroundColor: "var(--canvas)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
                className="text-bone-400 transition-colors duration-300 hover:text-white"
                aria-label="Close"
              >
                <X size={16} strokeWidth={1.4} />
              </button>
            </div>
            <div className="px-8 py-7">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(overlay, document.body);
}
