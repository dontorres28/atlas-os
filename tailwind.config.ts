import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        ink: "var(--ink)",
        white: "var(--fg-strong)",
        warm: "var(--fg)",
        muted: "var(--muted)",
        hairlineRaw: "var(--hairline-raw)",

        hairline: "var(--hairline)",
        hairlineStrong: "var(--hairline-strong)",
        hairlineHi: "var(--hairline-hi)",

        bone: {
          50: "var(--bone-50)",
          100: "var(--bone-100)",
          200: "var(--bone-200)",
          300: "var(--bone-300)",
          400: "var(--bone-400)",
          500: "var(--bone-500)",
          600: "var(--bone-600)",
          700: "var(--bone-700)",
          800: "var(--bone-800)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          dim: "var(--accent-dim)",
          wash: "var(--accent-wash)",
        },

        signal: {
          amber: "#C69148",
          rose: "#B15864",
          moss: "#5F8168",
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["Satoshi", "Helvetica Neue", "Helvetica", "sans-serif"],
        mono: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tightish: "-0.015em",
      },
      transitionTimingFunction: {
        atlas: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        glass: "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(197,203,216,0.08) inset",
      },
    },
  },
  plugins: [],
};

export default config;
