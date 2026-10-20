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
        // Darker terracotta and green for TEXT and for button backgrounds: the brand clay on paper is only 3.6:1,
        // below the 4.5:1 that WCAG AA asks for in small text. The original clay stays for decoration.
        "clay-deep": "#984222",
        "clay-soft": "#D98A66",
        sage: "#6E7F5C",
        "sage-deep": "#566647",
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
