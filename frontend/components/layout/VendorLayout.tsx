"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/user-state/auth-store";
import { ThemeToggle } from "./ThemeToggle";

export function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-emerald-50/95 dark:bg-emerald-950/95 backdrop-blur-md border-b border-emerald-200 dark:border-emerald-800 shadow-soft dark:shadow-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold text-emerald-800 dark:text-emerald-200"
            >
              Cradlers Vendor
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className={`text-sm font-medium ${
                  pathname === "/"
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
                }`}
              >
                Dashboard
              </Link>
              {user ? (
                <span className="text-sm text-emerald-700 dark:text-emerald-300">
                  {user.phone} ({user.role ?? "Customer"})
                </span>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:underline"
                >
                  Login
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="min-h-screen">{children}</main>
    </>
  );
}
