"use client";

import { useAuthStore } from "@/lib/user-state/auth-store";
import { DashboardLayout } from "./DashboardLayout";

const DOCTOR_NAV = [
  { href: "/", label: "Overview" },
  { href: "/appointments", label: "Appointments" },
  { href: "/appointments/edit", label: "Edit Appointment" },
  { href: "/scan", label: "Scan QR" },
  { href: "/reviews", label: "Reviews" },
  { href: "/qa", label: "Q&A" },
];

export function DoctorLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const doctorName = user?.role === "DOCTOR" ? (user.phone ? `Dr. ${user.phone.slice(-4)}` : "Doctor") : "Doctor";

  return (
    <DashboardLayout
      title="Cradlers Doctor"
      navLinks={DOCTOR_NAV}
      greeting={`Hello ${doctorName}.`}
    >
      {children}
    </DashboardLayout>
  );
}
