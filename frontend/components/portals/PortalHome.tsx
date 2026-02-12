"use client";

import { usePortal } from "@/lib/portal/context";
import { AdminDashboard } from "./AdminDashboard";
import { VendorDashboard } from "./VendorDashboard";
import Link from "next/link";
import { Button } from "@/components/buttons/Button";

/**
 * Renders the correct home content based on portal:
 * admin.localhost -> AdminDashboard, vendor.localhost -> VendorDashboard, else shop home.
 */
export function PortalHome() {
  const portal = usePortal();

  if (portal === "admin") {
    return <AdminDashboard />;
  }
  if (portal === "vendor") {
    return <VendorDashboard />;
  }

  // Shop home (default)
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary-700 dark:text-primary-300 mb-6">
          Premium Products for Little Ones
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Curated collection of high-quality products designed for children ages 0-5
        </p>
        <Link href="/products">
          <Button size="lg">Shop Now</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 opacity-60 shadow-soft dark:shadow-dark">
          <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
            Doctor Consultations
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">Coming Soon</p>
          <span className="inline-block px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            Phase 2
          </span>
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 opacity-60 shadow-soft dark:shadow-dark">
          <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
            Babysitter Services
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">Coming Soon</p>
          <span className="inline-block px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            Phase 2
          </span>
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 opacity-60 shadow-soft dark:shadow-dark">
          <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
            School Programs
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">Coming Soon</p>
          <span className="inline-block px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            Phase 2
          </span>
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 opacity-60 shadow-soft dark:shadow-dark">
          <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
            Subscriptions
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">Coming Soon</p>
          <span className="inline-block px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            Phase 2
          </span>
        </div>
      </div>
    </div>
  );
}
