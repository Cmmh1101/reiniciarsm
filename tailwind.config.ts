import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14192B",
        "ink-soft": "#212844",
        paper: "#EDE6D8",
        "paper-soft": "#E1D6C2",
        clay: "#BE5A34",
        "clay-soft": "#D98A66",
        sage: "#6E7F5C",
        gold: "#C9A227",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
