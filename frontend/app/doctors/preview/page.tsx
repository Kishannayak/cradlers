"use client";

import Link from "next/link";
import { DoctorLayout } from "@/components/layout/DoctorLayout";
import { DoctorDashboard } from "@/components/portals/DoctorDashboard";

/**
 * Preview the doctor dashboard without logging in or using doctor.localhost.
 * Open: http://localhost:3000/doctors/preview
 */
export default function DoctorPreviewPage() {
  return (
    <>
      <div className="bg-amber-100 dark:bg-amber-900/50 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-center text-sm text-amber-800 dark:text-amber-200">
        Preview mode — doctor dashboard (no login required).{" "}
        <Link href="/" className="underline font-medium">Back to shop</Link>
      </div>
      <DoctorLayout>
        <DoctorDashboard />
      </DoctorLayout>
    </>
  );
}
