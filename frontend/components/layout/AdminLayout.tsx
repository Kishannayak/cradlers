"use client";

import { useAuthStore } from "@/lib/user-state/auth-store";
import { DashboardLayout } from "./DashboardLayout";

const ADMIN_NAV = [
  { href: "/", label: "Overview" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const name = user?.phone ? user.phone.slice(-4) : "Admin";
  const greeting = user ? `Hello ${name}.` : "Hello.";

  return (
    <DashboardLayout
      title="Cradlers Admin"
      navLinks={ADMIN_NAV}
      greeting={greeting}
    >
      {children}
    </DashboardLayout>
  );
}
