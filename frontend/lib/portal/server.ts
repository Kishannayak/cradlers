import { headers } from "next/headers";
import type { PortalType } from "./context";

/**
 * Resolve portal from request host (server-side).
 * admin.localhost -> "admin", vendor.localhost -> "vendor", else "shop".
 */
export async function getPortalFromHeaders(): Promise<PortalType> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  if (host.startsWith("admin.localhost")) return "admin";
  if (host.startsWith("vendor.localhost")) return "vendor";
  return "shop";
}
