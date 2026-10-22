import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// The site's title font (Bricolage Grotesque) in the brand colors: cream "C", terracotta "M" on ink.
// The font file lives in the repo so the icon renders the same on every build, with no network call.
export async function brandIcon(size: number, fontSize: number, radius: number) {
  const font = await readFile(path.join(process.cwd(), "assets/fonts/BricolageGrotesque-Bold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#14192B",
          borderRadius: radius,
          fontFamily: "Bricolage Grotesque",
          fontWeight: 700,
          fontSize,
          letterSpacing: -fontSize * 0.04,
        }}
      >
        <span style={{ color: "#EDE6D8" }}>C</span>
        <span style={{ color: "#D98A66" }}>M</span>
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Bricolage Grotesque", data: font, weight: 700, style: "normal" }] }
  );
}
