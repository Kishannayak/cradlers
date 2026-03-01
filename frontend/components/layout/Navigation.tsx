// Navigation component: The top navigation bar that appears on every page
// Professional design with darker colors, gradient, and dark mode support

// "use client" directive: This component needs to run in the browser
// Needed because we use hooks (usePathname) and state management
"use client";

// Import Next.js Link component for navigation
import Link from "next/link";
// Import usePathname hook to detect current page
import { usePathname } from "next/navigation";
// Import cart store to get cart item count
import { useCartStore } from "@/lib/user-state/cart-store";
// Import auth store to check if user is logged in
import { useAuthStore } from "@/lib/user-state/auth-store";
// Import ThemeToggle component
import { ThemeToggle } from "./ThemeToggle";

// Navigation component: The actual navigation bar
export const Navigation = () => {
  // Get current page path (e.g., "/products", "/cart")
  const pathname = usePathname();
  // Get all items in the cart from the cart store
  const items = useCartStore((state) => state.items);
  // Get current logged-in user from auth store (null if not logged in)
  const user = useAuthStore((state) => state.user);

  // Calculate total number of items in cart (sum of all quantities)
  // reduce() loops through items and adds up quantities
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // Navigation: white/light bar, soft blue shadow (kid-app theme)
    <nav className="sticky top-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md border-b border-primary-100 dark:border-primary-800 shadow-soft dark:shadow-dark rounded-b-2xl">
      {/* sticky = stays at top when scrolling
          top-0 = stick to top of page
          z-40 = high z-index (appears above other content)
          bg-white/95 = white background with 95% opacity (light mode)
          dark:bg-gray-900/95 = dark background with 95% opacity (dark mode)
          backdrop-blur-md = blur the page content behind the nav
          border-b = bottom border
          border-primary-200 = darker lavender border (light mode)
          dark:border-primary-800 = darker purple border (dark mode)
          shadow-soft = subtle shadow (light mode)
          dark:shadow-dark = darker shadow (dark mode) */}

      {/* Container: centers content and limits width */}
      <div className="max-w-7xl mx-auto px-6">
        {/* max-w-7xl = maximum width (1280px)
            mx-auto = center horizontally
            px-6 = horizontal padding */}

        {/* Flex container: logo on left, links on right */}
        <div className="flex items-center justify-between h-16">
          {/* flex = flexbox layout
              items-center = vertically center items
              justify-between = space between logo and links
              h-16 = height 64px */}

          {/* Logo/Home link */}
          <Link
            href="/"
            className="text-2xl font-bold text-theme-accent dark:text-primary-300 hover:text-theme-accent-hover dark:hover:text-primary-200 transition-colors duration-200"
            // text-2xl = extra large text
            // font-bold = bold weight
            // bg-gradient-to-r = gradient from left to right
            // from-primary-600 to-primary-700 = darker purple gradient (light mode)
            // dark:from-primary-400 dark:to-primary-500 = lighter purple gradient (dark mode)
            // bg-clip-text text-transparent = gradient text effect
            // hover:from-primary-700 hover:to-primary-800 = darker gradient on hover (light mode)
            // dark:hover:from-primary-300 dark:hover:to-primary-400 = lighter gradient on hover (dark mode)
            // transition-all = smooth color change
          >
            Cradlers {/* Brand name */}
          </Link>

          {/* Right side: navigation links */}
          <div className="flex items-center gap-6">
            {/* gap-6 = space between links */}

            {/* Products link */}
            <Link
              href="/products" // Links to products page
              className={`text-sm font-medium transition-colors duration-200 ${
                // Check if current page is products page
                pathname?.startsWith("/products")
                  ? "text-primary-600 dark:text-primary-400" // Darker purple text if on products page (active state)
                  : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400" // Gray text otherwise, purple on hover
              }`}
            >
              Products
            </Link>

            {/* Cart link with item count badge */}
            <Link
              href="/cart" // Links to cart page
              className="relative text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              // relative = allows absolute positioning of badge
            >
              Cart
              {/* Show badge with item count if cart has items */}
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-theme-accent text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-soft">
                  {/* absolute = position relative to parent
                      -top-2 -right-2 = position slightly above and right of text
                      w-5 h-5 = 20px × 20px circle
                      bg-gradient-purple = purple gradient background
                      text-white = white text
                      text-xs = extra small text
                      font-semibold = semi-bold weight
                      rounded-full = perfect circle
                      flex items-center justify-center = center the number
                      shadow-baby = soft shadow */}
                  {cartItemCount} {/* Display the count */}
                </span>
              )}
            </Link>

            {/* Conditional: Show Account link if logged in, Login link if not */}
            {user ? (
              // User is logged in - show Account link
              <Link
                href="/account" // Links to account page
                className={`text-sm font-medium transition-colors duration-200 ${
                  // Check if current page is account page
                  pathname?.startsWith("/account")
                    ? "text-primary-600 dark:text-primary-400" // Darker purple text if on account page (active)
                    : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400" // Gray text otherwise, purple on hover
                }`}
              >
                Account
              </Link>
            ) : (
              // User is not logged in - show Login link
              <Link
                href="/login" // Links to login page
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Login
              </Link>
            )}

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
