"use client";

import { usePortal } from "@/lib/portal/context";
import { Navigation } from "./Navigation";
import { AdminLayout } from "./AdminLayout";
import { VendorLayout } from "./VendorLayout";

/**
 * Renders the correct shell (nav + main) based on portal:
 * - admin.localhost -> AdminLayout
 * - vendor.localhost -> VendorLayout
 * - localhost -> shop Navigation + main
 */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const portal = usePortal();

  if (portal === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }
  if (portal === "vendor") {
    return <VendorLayout>{children}</VendorLayout>;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
