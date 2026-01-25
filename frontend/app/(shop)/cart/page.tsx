// CartPage: Displays all items in the user's shopping cart
// Users can update quantities, remove items, and proceed to checkout

// "use client" directive: This component needs to run in the browser
// Required because we use hooks, state management, and user interactions
"use client";

// Import React hooks
import { useState } from "react";
// Import Next.js router for navigation
import { useRouter } from "next/navigation";
// Import Next.js Image component for product images
import Image from "next/image";
// Import Next.js Link component for navigation
import Link from "next/link";
// Import cart store to access and modify cart items
import { useCartStore } from "@/lib/user-state/cart-store";
// Import API client to sync cart changes with backend
import { api } from "@/lib/backend/client";
// Import utility functions for price formatting and calculations
import { formatPrice, calculateSubtotal } from "@/lib/helpers/cart";
// Import UI components
import { Button } from "@/components/buttons/Button";
import { EmptyState } from "@/components/displays/EmptyState";
import { BabyLoader } from "@/components/displays/BabyLoader";

// CartPage component: The shopping cart page
export default function CartPage() {
  // Get router for navigation
  const router = useRouter();
  // Get cart items from store
  const items = useCartStore((state) => state.items);
  // Get function to update item quantity
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  // Get function to remove item from cart
  const removeItem = useCartStore((state) => state.removeItem);
  // State: Which item is currently being updated (shows loading spinner)
  const [updating, setUpdating] = useState<string | null>(null);
  // State: Which item is currently being removed (shows "Removing..." text)
  const [removing, setRemoving] = useState<string | null>(null);

  // Calculate total price of all items in cart
  const subtotal = calculateSubtotal(items);

  // handleUpdateQuantity function: Changes the quantity of a cart item
  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    // If quantity would be less than 1, remove the item instead
    if (quantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdating(itemId); // Show loading state for this item
    try {
      // Call API to update cart item on backend
      await api.updateCartItem(itemId, { quantity });
      // Update item in local store (updates UI immediately)
      updateItemQuantity(itemId, quantity);
    } catch (error) {
      // If update fails, log error
      console.error("Failed to update cart item:", error);
    } finally {
      setUpdating(null); // Always clear loading state
    }
  };

  // handleRemoveItem function: Removes an item from the cart completely
  const handleRemoveItem = async (itemId: string) => {
    setRemoving(itemId); // Show "Removing..." text
    try {
      // Call API to remove item from backend
      await api.removeCartItem(itemId);
      // Remove item from local store
      removeItem(itemId);
    } catch (error) {
      // If removal fails, log error
      console.error("Failed to remove cart item:", error);
    } finally {
      setRemoving(null); // Always clear loading state
    }
  };

  // If cart is empty, show empty state message
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <EmptyState
          title="Your cart is empty"
          description="Add some products to get started"
          action={{
            label: "Browse Products",
            onClick: () => router.push("/products"), // Navigate to products page
          }}
        />
      </div>
    );
  }

  // Main cart view
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Shopping Cart</h1>

      {/* Grid layout: cart items on left, order summary on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* grid = CSS grid
            grid-cols-1 = 1 column on mobile
            lg:grid-cols-3 = 3 columns on large screens
            gap-12 = space between columns */}

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* lg:col-span-2 = takes 2 of 3 columns on large screens
              space-y-6 = vertical spacing between items */}

          {/* Map through each cart item and display it */}
          {items.map((item) => (
            <div
              key={item.id} // Unique key for React
              className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-6"
              // bg-white = white background
              // rounded-2xl = rounded corners
              // p-6 = padding inside
              // flex = flexbox layout
              // gap-6 = space between image, info, and price
            >
              {/* Product Image */}
              <Link
                href={`/products/${item.product.id}`} // Link to product detail page
                className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100"
                // relative = allows absolute positioning of image
                // w-24 h-24 = 96px × 96px square
                // flex-shrink-0 = don't shrink when space is tight
                // rounded-xl = rounded corners
                // overflow-hidden = hide parts outside border
              >
                {/* Only show image if product has at least one image */}
                {item.product.images[0] && (
                  <Image
                    src={item.product.images[0]} // First product image
                    alt={item.product.name} // Alt text for accessibility
                    fill // Makes image fill the container
                    className="object-cover" // Crop to fill while maintaining aspect ratio
                    sizes="96px" // Tells browser image size (performance optimization)
                  />
                )}
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                {/* flex-1 = takes remaining space
                    min-w-0 = allows text to truncate properly */}

                {/* Product name: clickable link to product page */}
                <Link
                  href={`/products/${item.product.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-smooth mb-2"
                >
                  {item.product.name}
                </Link>

                {/* Product price per item */}
                <p className="text-gray-600 mb-4">
                  {formatPrice(item.product.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  {/* flex = flexbox layout
                      items-center = vertically center
                      gap-4 = space between controls */}

                  {/* Quantity selector: decrease, display, increase */}
                  <div className="flex items-center gap-2">
                    {/* Decrease button: subtracts 1 from quantity */}
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={updating === item.id || removing === item.id}
                      // Disable if this item is being updated or removed
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-smooth disabled:opacity-50"
                      // w-8 h-8 = 32px × 32px square button
                      // disabled:opacity-50 = make semi-transparent when disabled
                    >
                      {/* Minus icon */}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4" // Horizontal line
                        />
                      </svg>
                    </button>

                    {/* Quantity display: shows current quantity or loading spinner */}
                    <span className="w-8 text-center font-medium text-gray-900">
                      {updating === item.id ? (
                        <BabyLoader size="sm" /> // Show spinner while updating
                      ) : (
                        item.quantity // Show quantity number
                      )}
                    </span>

                    {/* Increase button: adds 1 to quantity */}
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={updating === item.id || removing === item.id}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-smooth disabled:opacity-50"
                    >
                      {/* Plus icon */}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4" // Plus sign
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Remove button: deletes item from cart */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removing === item.id}
                    className="text-sm text-red-600 hover:text-red-700 transition-smooth disabled:opacity-50"
                    // text-red-600 = red text (indicates destructive action)
                  >
                    {removing === item.id ? "Removing..." : "Remove"}
                    {/* Show "Removing..." while deleting, "Remove" otherwise */}
                  </button>
                </div>
              </div>

              {/* Item Total: price × quantity */}
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                  {/* Calculate total: price per item × quantity */}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          {/* lg:col-span-1 = takes 1 of 3 columns on large screens */}

          {/* Summary card: sticky so it stays visible when scrolling */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            {/* sticky top-24 = sticks to top when scrolling (24 = 96px from top) */}

            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Price breakdown */}
            <div className="space-y-4 mb-6">
              {/* space-y-4 = vertical spacing between items */}

              {/* Subtotal: sum of all items */}
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {/* Shipping: calculated later */}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
                {/* Shipping cost calculated during checkout process */}
              </div>

              {/* Total: currently same as subtotal (no shipping yet) */}
              <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold text-gray-900">
                {/* border-t = top border (separator line)
                    pt-4 = padding top */}
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Checkout button: navigates to checkout page */}
            <Button
              size="lg" // Large button
              className="w-full" // Full width
              onClick={() => router.push("/checkout")} // Navigate to checkout
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
