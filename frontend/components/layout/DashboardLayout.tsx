"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/user-state/auth-store";
import { ThemeToggle } from "./ThemeToggle";

export type NavItem = { href: string; label: string };

type DashboardLayoutProps = {
  /** Portal title in sidebar e.g. "Cradlers Doctor" */
  title: string;
  /** Nav links for sidebar */
  navLinks: NavItem[];
  /** Greeting text e.g. "Hello Dr. John," */
  greeting: string;
  children: React.ReactNode;
};

/**
 * Shared dashboard layout: sidebar + main with search bar and kid-friendly theme.
 * Same look for Doctor, Admin, and Vendor portals.
 */
export function DashboardLayout({ title, navLinks, greeting, children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar: white card style, rounded right, kid theme */}
      <aside className="w-60 shrink-0 flex flex-col bg-white/98 dark:bg-gray-900/95 border-r border-primary-100 dark:border-primary-800 shadow-soft dark:shadow-dark rounded-r-3xl overflow-hidden">
        {/* Logo with teddy bear icon */}
        <div className="p-5 border-b border-primary-100 dark:border-primary-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-theme-accent dark:text-primary-300 hover:text-theme-accent-hover"
          >
            <span className="text-2xl" aria-hidden>🧸</span>
            <span>{title}</span>
          </Link>
        </div>
        {/* Greeting */}
        <div className="px-5 py-4 border-b border-primary-100 dark:border-primary-800">
          <p className="text-sm font-medium text-primary-700 dark:text-primary-300">{greeting}</p>
        </div>
        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-200 ${
                pathname === href
                  ? "bg-theme-accent text-white shadow-soft"
                  : "text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-700 dark:hover:text-primary-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Decorative kid block at bottom of sidebar */}
        <div className="p-3 border-t border-primary-100 dark:border-primary-800 flex items-center justify-center gap-1 text-primary-300 dark:text-primary-600">
          <span className="text-xl" aria-hidden>🧸</span>
          <span className="text-xs font-medium text-primary-400 dark:text-primary-500">A · B</span>
        </div>
        {/* User / Login / Theme / Logout */}
        <div className="p-3 border-t border-primary-100 dark:border-primary-800 space-y-1">
          <div className="flex items-center justify-between px-2 py-1">
            {user ? (
              <span className="text-xs text-theme-muted dark:text-primary-400 truncate max-w-[120px]" title={user.phone}>
                {user.phone}
              </span>
            ) : (
              <Link href="/login" className="text-sm font-medium text-theme-accent dark:text-primary-400 hover:underline">
                Log in
              </Link>
            )}
            <ThemeToggle />
          </div>
          {user && (
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors"
            >
              Log out
            </button>
          )}
        </div>
      </aside>

      {/* Main: kid-friendly background + top bar (search + profile) + content */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen dashboard-main-bg">
        {/* Top bar: search + profile (same as reference dashboard) */}
        <header className="shrink-0 flex items-center justify-between gap-4 px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-primary-100 dark:border-primary-800">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 dark:text-primary-500 text-sm" aria-hidden>🔍</span>
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-primary-100 dark:border-primary-800 bg-white dark:bg-gray-800 text-primary-800 dark:text-primary-200 placeholder:text-primary-400 dark:placeholder:text-primary-500 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent"
                aria-label="Search"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-200 dark:bg-primary-700 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-200">
              {user?.phone ? user.phone.slice(-2) : "?"}
            </div>
          </div>
        </header>
        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
