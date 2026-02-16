"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/user-state/auth-store";
import { ThemeToggle } from "./ThemeToggle";

export function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/appointments", label: "Appointments" },
    { href: "/appointments/edit", label: "Edit Appointment" },
    { href: "/scan", label: "Scan QR" },
    { href: "/reviews", label: "Reviews" },
    { href: "/qa", label: "Q&A" },
  ];

  const doctorName = user?.role === "DOCTOR" ? (user.phone ? `Dr. ${user.phone.slice(-4)}` : "Doctor") : "Doctor";

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 bg-primary-50/95 dark:bg-primary-900/30 border-r border-primary-200 dark:border-primary-800 flex flex-col shadow-soft dark:shadow-dark">
        <div className="p-4 border-b border-primary-200 dark:border-primary-800">
          <Link href="/" className="text-lg font-bold text-primary-700 dark:text-primary-300">
            Cradlers Doctor
          </Link>
        </div>
        <div className="p-4 border-b border-primary-200 dark:border-primary-800">
          <p className="text-sm font-medium text-primary-700 dark:text-primary-300">Hello {doctorName}.</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                pathname === href
                  ? "bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-100"
                  : "text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-700 dark:hover:text-primary-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-primary-200 dark:border-primary-800 flex items-center justify-between">
          {user ? (
            <span className="text-xs text-primary-600 dark:text-primary-400 truncate">{user.phone}</span>
          ) : (
            <Link href="/login" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
              Log in
            </Link>
          )}
          <ThemeToggle />
        </div>
        {user && (
          <div className="p-2">
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50"
            >
              Log out
            </button>
          </div>
        )}
      </aside>
      <main className="flex-1 min-w-0 bg-transparent">{children}</main>
    </div>
  );
}
