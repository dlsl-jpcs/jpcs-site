import { createHash } from "node:crypto";

/** Salted SHA-256 of the caller's IP, used only for rate limiting. Null when no IP header is present. */
export function hashIp(req: Request): string | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
  if (!ip) return null;
  const salt = process.env.CONTACT_IP_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
