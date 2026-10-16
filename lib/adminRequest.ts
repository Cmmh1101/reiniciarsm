import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { adminError } from "@/lib/admin/apiError";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/** 1–`max` unique valid ids, or null. */
export function readUuidList(value: unknown, max = 500): string[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > max || !value.every(isUuid)) return null;
  return [...new Set(value)];
}

/**
 * Guard for admin write endpoints: the caller must be the signed-in admin, and a browser request
 * must come from this site (blocks cross-site request forgery on top of the SameSite cookie).
 * Returns an error response to send back, or null when the request may proceed.
 */
export async function guardAdminWrite(request: Request): Promise<NextResponse | null> {
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (!host || new URL(origin).host !== host) return adminError(403, "Forbidden.", "Acceso denegado.");
  }
  const admin = await getAdminUser();
  if (!admin) return adminError(401, "Unauthorized.", "No autorizado.");
  return null;
}
