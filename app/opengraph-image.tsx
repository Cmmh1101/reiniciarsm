import { ImageResponse } from "next/og";
import { brandOgImage } from "@/lib/ogImage";

export const alt = "Carla Montaño — Reiniciar Sin Mapa / NEXT YOU™";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(brandOgImage(), { ...size });
}
