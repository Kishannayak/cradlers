"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/user-state/auth-store";
import { ThemeToggle } from "./ThemeToggle";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-amber-50/95 dark:bg-amber-950/95 backdrop-blur-md border-b border-amber-200 dark:border-amber-800 shadow-soft dark:shadow-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold text-amber-800 dark:text-amber-200"
            >
              Cradlers Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className={`text-sm font-medium ${
                  pathname === "/"
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
                }`}
              >
                Dashboard
              </Link>
              {user ? (
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  {user.phone} ({user.role ?? "Customer"})
                </span>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-amber-700 dark:text-amber-300 hover:underline"
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
