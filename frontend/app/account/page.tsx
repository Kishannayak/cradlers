// AccountPage: User's account dashboard
// Shows account information and quick links to addresses and orders
// Requires authentication - redirects to login if not logged in

// "use client" directive: This component needs to run in the browser
"use client";

// Import React hooks
import { useEffect } from "react";
// Import Next.js router for navigation
import { useRouter } from "next/navigation";
// Import Next.js Link component
import Link from "next/link";
// Import auth store to check login status and logout
import { useAuthStore } from "@/lib/user-state/auth-store";
// Import Button component
import { Button } from "@/components/buttons/Button";

// AccountPage component: The account dashboard
export default function AccountPage() {
  // Get router for navigation
  const router = useRouter();
  // Get current logged-in user from auth store
  const user = useAuthStore((state) => state.user);
  // Get logout function from auth store
  const logout = useAuthStore((state) => state.logout);

  // useEffect: Check if user is logged in when component mounts
  useEffect(() => {
    // If no user is logged in, redirect to login page
    if (!user) {
      // Include redirect parameter so user comes back here after logging in
      router.push("/login?redirect=/account");
    }
  }, [user, router]); // Re-run if user or router changes

  // If no user, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // handleLogout function: Logs the user out
  const handleLogout = () => {
    logout(); // Clear user data from store
    router.push("/"); // Navigate to homepage
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* max-w-4xl = maximum width
          mx-auto = center horizontally
          px-6 = horizontal padding
          py-12 = vertical padding */}

      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Account</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account settings</p>
      </div>

      <div className="space-y-6">
        {/* space-y-6 = vertical spacing between sections */}

        {/* User Info Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          {/* bg-white = white background
              rounded-2xl = rounded corners
              border = border around
              p-6 = padding inside */}

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account Information
          </h2>

          {/* User details */}
          <div className="space-y-3">
            {/* space-y-3 = vertical spacing between info items */}

            {/* Phone number */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              {/* text-sm = small text
                  text-gray-500 = medium gray color (label) */}
              <p className="text-gray-900 dark:text-gray-100 font-medium">{user.phone}</p>
              {/* text-gray-900 = dark text (value)
                  font-medium = medium weight */}
            </div>

            {/* Email: only show if user has an email */}
            {user.email && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links Section */}
        {/* Grid of clickable cards linking to account features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* grid = CSS grid
              grid-cols-1 = 1 column on mobile
              md:grid-cols-2 = 2 columns on medium screens
              gap-6 = space between cards */}

          {/* Addresses link card */}
          <Link href="/account/addresses">
            {/* Link makes entire card clickable */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-soft-lg dark:hover:shadow-dark-lg transition-smooth cursor-pointer">
              {/* bg-white dark:bg-gray-800 = white background (light mode), dark gray (dark mode)
                  hover:shadow-soft-lg = larger shadow on hover (light mode)
                  dark:hover:shadow-dark-lg = larger dark shadow on hover (dark mode)
                  transition-smooth = smooth animation
                  cursor-pointer = pointer cursor (indicates clickable) */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Addresses
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Manage your shipping addresses
              </p>
            </div>
          </Link>

          {/* Orders link card */}
          <Link href="/account/orders">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-soft-lg dark:hover:shadow-dark-lg transition-smooth cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Orders
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">View your order history</p>
            </div>
          </Link>
        </div>

        {/* Logout Section */}
        <div className="pt-6">
          {/* pt-6 = padding top (spacing above) */}
          <Button variant="secondary" onClick={handleLogout}>
            {/* variant="secondary" = light button style */}
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
