import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--c-void)",
        surface: "var(--c-surface)",
        surface2: "#12142400",
        line: "rgba(255,255,255,0.08)",
        primary: {
          DEFAULT: "#6D5DFC",
          50: "#EEECFF",
          400: "#8B7CFF",
          500: "#6D5DFC",
          600: "#5844F0"
        },
        violet: {
          DEFAULT: "#A855F7",
          500: "#A855F7"
        },
        electric: {
          DEFAULT: "#3B82F6",
          500: "#3B82F6"
        },
        signal: "#22D3EE",
        gold: "#FBBF24",
        ink: "var(--c-ink)",
        muted: "var(--c-muted)",
        // Premium dark marketplace palette — overrides the default Tailwind
        // slate scale so every existing `dark:bg-slate-900` / `border-slate-800`
        // class across the app automatically renders in the new premium tones,
        // without having to touch every component individually.
        slate: {
          50: "#F8FAFC",
          100: "#EEF1F6",
          200: "#DDE3EC",
          300: "#94A3B8",
          400: "#7C8CA5",
          500: "#64748B",
          600: "#4B5768",
          700: "#2A3444",
          800: "#151B26",
          900: "#0B0F17",
          950: "#070A0F"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(circle at 20% 20%, rgba(109,93,252,0.35), transparent 55%)",
        "aurora-2":
          "radial-gradient(circle at 80% 30%, rgba(168,85,247,0.30), transparent 55%)",
        "aurora-3":
          "radial-gradient(circle at 50% 90%, rgba(34,211,238,0.18), transparent 55%)",
        "gradient-brand": "linear-gradient(135deg, #6D5DFC 0%, #A855F7 55%, #3B82F6 100%)",
        "gradient-brand-soft":
          "linear-gradient(135deg, rgba(109,93,252,0.16) 0%, rgba(168,85,247,0.16) 100%)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(109,93,252,0.45)",
        "glow-lg": "0 0 0 1px rgba(255,255,255,0.06), 0 30px 90px -20px rgba(168,85,247,0.5)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,-20px) scale(1.05)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        drift: "drift 14s ease-in-out infinite",
        "drift-slow": "drift 22s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
