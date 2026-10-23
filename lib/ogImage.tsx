import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

export const OG_SIZE = { width: 1200, height: 630 };

const fileCache = new Map<string, Buffer>();
async function read(relative: string): Promise<Buffer> {
  let file = fileCache.get(relative);
  if (!file) {
    file = await readFile(path.join(process.cwd(), relative));
    fileCache.set(relative, file);
  }
  return file;
}
const dataUri = (mime: string, bytes: Buffer) => `data:${mime};base64,${bytes.toString("base64")}`;

/** The default social-sharing image: logo, tagline and photo on the brand's dark blue, in the visitor's language.
 * The fonts and images are read from the repo so it renders the same on every build, with no network call. */
export async function brandOgImage(locale: Locale) {
  const { site } = getDictionary(locale);
  const [bold, regular, logo, photo] = await Promise.all([
    read("assets/fonts/BricolageGrotesque-Bold.ttf"),
    read("assets/fonts/BricolageGrotesque-Regular.ttf"),
    read("public/images/brand/logo-light.png"),
    read("public/images/carla/hero-home-real.jpg"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#14192B",
          padding: "64px 72px",
          fontFamily: "Bricolage Grotesque",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: 640 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUri("image/png", logo)} alt="" width={220} height={110} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: 96, height: 5, backgroundColor: "#BE5A34", marginBottom: 28 }} />
            <div style={{ fontSize: 60, fontWeight: 700, color: "#EDE6D8", lineHeight: 1.08 }}>{site.tagline}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 400, color: "#D98A66" }}>{site.descriptor}</div>
            <div style={{ fontSize: 26, fontWeight: 400, color: "#EDE6D8", opacity: 0.75, marginTop: 8 }}>carlamontano.io</div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri("image/jpeg", photo)} alt="" width={400} height={500} style={{ objectFit: "cover", borderRadius: 4 }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bricolage Grotesque", data: bold, weight: 700, style: "normal" },
        { name: "Bricolage Grotesque", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
