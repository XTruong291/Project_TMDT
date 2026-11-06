/**
 * Utility functions for handling image URLs safely across the application.
 */

export function cleanImageUrl(url: string): string {
  if (!url) return "";
  let trimmed = url.trim();
  try {
    // Detect Google Search wrappers: /imgres, /url, etc.
    if (
      trimmed.includes("google.") &&
      (trimmed.includes("/imgres") ||
        trimmed.includes("/url") ||
        trimmed.includes("search?") ||
        trimmed.includes("/imglanding"))
    ) {
      const parsed = new URL(trimmed);
      const extracted =
        parsed.searchParams.get("imgurl") ||
        parsed.searchParams.get("url") ||
        parsed.searchParams.get("src");
      if (extracted) {
        trimmed = decodeURIComponent(extracted).trim();
      }
    }
  } catch {
    // Keep trimmed string if parsing fails
  }
  return trimmed;
}

