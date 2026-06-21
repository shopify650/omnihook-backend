import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#ff4f00",
        "on-primary": "#fffefb",
        ink: "#201515",
        "ink-soft": "#2f2a26",
        "ink-mid": "#36342e",
        body: "#605d52",
        "body-mid": "#939084",
        mute: "#c5c0b1",
        canvas: "#fffefb",
        "canvas-soft": "#f8f4f0",
        // Keep existing semantic states just in case
        success: "#00C851",
        error: "#FF3B30",
        warning: "#FF9500",
      },
      fontFamily: {
        display: ["Degular Display", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        md: "12px",
        pill: "9999px",
        full: "9999px",
      },
    },
  },
  plugins: [],
} satisfies Config
