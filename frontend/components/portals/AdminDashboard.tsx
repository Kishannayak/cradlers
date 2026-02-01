"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/user-state/auth-store";
import { Button } from "@/components/buttons/Button";

export function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-amber-800 dark:text-amber-200 mb-6">
          Admin Dashboard
        </h1>
        <p className="text-xl text-amber-700/80 dark:text-amber-300/80 max-w-2xl mx-auto mb-12">
          Manage Cradlers from admin.localhost. Log in with your admin account to
          get the ADMIN role.
        </p>
        {user ? (
          <p className="text-lg text-amber-700 dark:text-amber-300">
            Logged in as {user.phone} — Role: <strong>{user.role ?? "Customer"}</strong>
          </p>
        ) : (
          <Link href="/login">
            <Button size="lg">Admin Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
