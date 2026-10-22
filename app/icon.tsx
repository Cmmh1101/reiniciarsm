import { brandIcon } from "@/lib/brandIcon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return brandIcon(32, 20, 6);
}
