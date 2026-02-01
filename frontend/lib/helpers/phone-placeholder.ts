/**
 * Region-aware phone number placeholders.
 * Uses browser locale (navigator.language) to show the right format, e.g. +91 for India, +1 for US.
 */

// Country code (e.g. IN, US) -> placeholder text for phone input
const PLACEHOLDERS: Record<string, string> = {
  IN: "+91 98765 43210",
  US: "+1 (555) 000-0000",
  GB: "+44 7700 900000",
  AE: "+971 50 000 0000",
  SA: "+966 50 000 0000",
  AU: "+61 400 000 000",
  CA: "+1 (555) 000-0000",
  DE: "+49 151 00000000",
  FR: "+33 6 00 00 00 00",
  SG: "+65 9123 4567",
  MY: "+60 12-345 6789",
  PK: "+92 300 0000000",
  BD: "+880 1XXX-XXXXXX",
  LK: "+94 71 000 0000",
  NP: "+977 9800000000",
  default: "+1 (555) 000-0000",
};

/**
 * Get country code from browser locale (e.g. "en-IN" -> "IN", "en-US" -> "US").
 * Safe to call in SSR; returns "default" when not in browser.
 */
function getCountryFromLocale(): string {
  if (typeof navigator === "undefined") return "default";
  const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "";
  const parts = lang.split("-");
  if (parts.length >= 2) return parts[1].toUpperCase();
  // Try Intl as fallback (e.g. some browsers)
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const localeParts = locale.split("-");
    if (localeParts.length >= 2) return localeParts[1].toUpperCase();
  } catch {
    // ignore
  }
  return "default";
}

/**
 * Returns a phone number placeholder for the user's region (login, forms, etc.).
 * E.g. India -> "+91 98765 43210", US -> "+1 (555) 000-0000".
 */
export function getPhonePlaceholder(): string {
  const country = getCountryFromLocale();
  return PLACEHOLDERS[country] ?? PLACEHOLDERS.default;
}
