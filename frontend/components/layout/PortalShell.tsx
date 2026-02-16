"use client";

import { usePortal } from "@/lib/portal/context";
import { Navigation } from "./Navigation";
import { AdminLayout } from "./AdminLayout";
import { VendorLayout } from "./VendorLayout";
import { DoctorLayout } from "./DoctorLayout";

/**
 * Renders the correct shell (nav + main) based on portal:
 * - admin.localhost -> AdminLayout
 * - vendor.localhost -> VendorLayout
 * - doctor.localhost -> DoctorLayout
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
  if (portal === "doctor") {
    return <DoctorLayout>{children}</DoctorLayout>;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
