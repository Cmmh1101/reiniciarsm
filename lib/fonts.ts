import { Bricolage_Grotesque, IBM_Plex_Mono, Inter } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

/** Self-hosted by next/font (no render-blocking request to Google). Applied on <html> so the
 * --font-* variables that Tailwind and globals.css already read resolve to the loaded faces. */
export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
