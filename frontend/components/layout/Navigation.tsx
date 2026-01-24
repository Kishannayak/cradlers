// Navigation component: The top navigation bar that appears on every page
// Shows logo, menu links, cart count, and login/account link

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
    // Navigation bar: sticky at top, with backdrop blur effect
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      {/* sticky = stays at top when scrolling
          top-0 = stick to top of page
          z-40 = high z-index (appears above other content)
          bg-white/80 = white background with 80% opacity (semi-transparent)
          backdrop-blur-md = blur the page content behind the nav
          border-b = bottom border
          border-gray-200 = light gray border */}

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
            href="/" // Links to homepage
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-smooth"
            // text-2xl = extra large text
            // font-bold = bold weight
            // hover:text-gray-700 = slightly lighter on hover
            // transition-smooth = smooth color change
          >
            Cradlers {/* Brand name */}
          </Link>

          {/* Right side: navigation links */}
          <div className="flex items-center gap-8">
            {/* gap-8 = space between links */}

            {/* Products link */}
            <Link
              href="/products" // Links to products page
              className={`text-sm font-medium transition-smooth ${
                // Check if current page is products page
                pathname?.startsWith("/products")
                  ? "text-gray-900" // Dark text if on products page (active state)
                  : "text-gray-600 hover:text-gray-900" // Gray text otherwise, darker on hover
              }`}
            >
              Products
            </Link>

            {/* Cart link with item count badge */}
            <Link
              href="/cart" // Links to cart page
              className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-smooth"
              // relative = allows absolute positioning of badge
            >
              Cart
              {/* Show badge with item count if cart has items */}
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                  {/* absolute = position relative to parent
                      -top-2 -right-2 = position slightly above and right of text
                      w-5 h-5 = 20px × 20px circle
                      bg-gray-900 = dark background
                      text-white = white text
                      text-xs = extra small text
                      rounded-full = perfect circle
                      flex items-center justify-center = center the number */}
                  {cartItemCount} {/* Display the count */}
                </span>
              )}
            </Link>

            {/* Conditional: Show Account link if logged in, Login link if not */}
            {user ? (
              // User is logged in - show Account link
              <Link
                href="/account" // Links to account page
                className={`text-sm font-medium transition-smooth ${
                  // Check if current page is account page
                  pathname?.startsWith("/account")
                    ? "text-gray-900" // Dark text if on account page (active)
                    : "text-gray-600 hover:text-gray-900" // Gray text otherwise
                }`}
              >
                Account
              </Link>
            ) : (
              // User is not logged in - show Login link
              <Link
                href="/login" // Links to login page
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-smooth"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
