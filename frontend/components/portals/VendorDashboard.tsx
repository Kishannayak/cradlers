"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/user-state/auth-store";
import { Button } from "@/components/buttons/Button";

export function VendorDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">
          Vendor Dashboard
        </h1>
        <p className="text-xl text-emerald-700/80 dark:text-emerald-300/80 max-w-2xl mx-auto mb-12">
          Manage your vendor account from vendor.localhost. Log in here to get the
          VENDOR role.
        </p>
        {user ? (
          <p className="text-lg text-emerald-700 dark:text-emerald-300">
            Logged in as {user.phone} — Role: <strong>{user.role ?? "Customer"}</strong>
          </p>
        ) : (
          <Link href="/login">
            <Button size="lg">Vendor Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
