export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trimmed string, or "" for anything that is not a string. */
export function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Trimmed string, or null when empty. For optional columns. */
export function optStr(value: unknown): string | null {
  const s = str(value);
  return s === "" ? null : s;
}

export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Images must come from this project's Storage bucket or from the site's own /public folder.
 * next/image only allows those hosts (next.config.ts), so anything else would break the page.
 */
export function isAllowedImageUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!base && value.startsWith(`${base}/storage/v1/object/public/`);
}

/** Storage object path for a public media URL, or null if the URL is not ours. */
export function mediaPathFromUrl(url: string | null | undefined): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prefix = `${base}/storage/v1/object/public/media/`;
  if (!url || !base || !url.startsWith(prefix)) return null;
  return decodeURIComponent(url.slice(prefix.length).split("?")[0]);
}
