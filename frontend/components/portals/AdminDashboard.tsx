"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/user-state/auth-store";
import { Button } from "@/components/buttons/Button";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800/95 rounded-3xl border border-primary-100 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
      <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{value}</p>
        <span className="text-3xl opacity-80" aria-hidden>{icon}</span>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const name = user?.phone ? user.phone.slice(-4) : "Admin";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300">Hello {name}.</h1>

      {!user ? (
        <div className="bg-white dark:bg-gray-800/95 rounded-3xl border border-primary-100 dark:border-primary-800 p-8 shadow-soft dark:shadow-dark text-center max-w-xl mx-auto">
          <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">Admin Dashboard</h2>
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-6">
            Manage Cradlers from admin.localhost. Log in with your admin account to get the ADMIN role.
          </p>
          <Link href="/login">
            <Button size="lg">Admin Login</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Users" value="—" icon="👥" />
            <StatCard label="Active Sessions" value="—" icon="🔐" />
            <StatCard label="System Health" value="OK" icon="✅" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-gray-800/95 rounded-3xl border border-primary-100 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
              <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-3">Recent Activity</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">Activity log will appear here.</p>
            </section>
            <section className="bg-white dark:bg-gray-800/95 rounded-3xl border border-primary-100 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
              <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-3">Quick Actions</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Manage Users</Button>
                <Button variant="outline" size="sm">Settings</Button>
              </div>
            </section>
          </div>

          <section className="bg-white dark:bg-gray-800/95 rounded-3xl border border-primary-100 dark:border-primary-800 overflow-hidden shadow-soft dark:shadow-dark">
            <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 p-4 border-b border-primary-100 dark:border-primary-800">
              Logged in
            </h2>
            <div className="p-4">
              <p className="text-sm text-primary-600 dark:text-primary-400">
                {user.phone} — Role: <strong>{user.role ?? "Customer"}</strong>
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
