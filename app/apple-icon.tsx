import { brandIcon } from "@/lib/brandIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself, so the square is left full-bleed.
export default function AppleIcon() {
  return brandIcon(180, 104, 0);
}
