"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      role="switch"
      aria-checked={isLight}
      className="group relative inline-flex h-8 w-[60px] items-center rounded-full border border-hairline bg-white/[0.02] transition-colors duration-500 ease-atlas hover:border-hairlineStrong"
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Sliding knob */}
      <motion.div
        aria-hidden
        className="absolute top-[3px] left-[3px] grid h-[26px] w-[26px] place-items-center rounded-full"
        animate={{
          x: isLight ? 0 : 28,
          backgroundColor: isLight ? "var(--accent)" : "var(--bone-700)",
        }}
        transition={{
          type: "spring",
          stiffness: 480,
          damping: 34,
          mass: 0.9,
        }}
        style={{
          boxShadow: isLight
            ? "0 4px 14px -4px rgba(24, 61, 168, 0.55)"
            : "0 4px 14px -4px rgba(0, 0, 0, 0.5)",
        }}
      >
        <motion.div
          key={isLight ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {isLight ? (
            <Sun size={13} strokeWidth={2} color="#FEFEFE" />
          ) : (
            <Moon size={13} strokeWidth={2} color="#F3F4F7" />
          )}
        </motion.div>
      </motion.div>

      {/* Static icons underneath, so the inactive side still reads clearly */}
      <span
        aria-hidden
        className={`pointer-events-none absolute left-[9px] top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isLight ? "opacity-0" : "opacity-90"
        }`}
      >
        <Sun size={11} strokeWidth={1.8} color="#FEFEFE" />
      </span>
      <span
        aria-hidden
        className={`pointer-events-none absolute right-[9px] top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isLight ? "opacity-80" : "opacity-0"
        }`}
      >
        <Moon size={11} strokeWidth={1.8} color="#0A131F" />
      </span>
    </button>
  );
}
