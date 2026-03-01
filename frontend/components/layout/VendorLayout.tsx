"use client";

import { useAuthStore } from "@/lib/user-state/auth-store";
import { DashboardLayout } from "./DashboardLayout";

const VENDOR_NAV = [
  { href: "/", label: "Overview" },
];

export function VendorLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const name = user?.phone ? user.phone.slice(-4) : "Vendor";
  const greeting = user ? `Hello ${name}.` : "Hello.";

  return (
    <DashboardLayout
      title="Cradlers Vendor"
      navLinks={VENDOR_NAV}
      greeting={greeting}
    >
      {children}
    </DashboardLayout>
  );
}
