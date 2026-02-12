// This file contains helper functions for working with shopping cart data
// Utility functions are reusable pieces of code that do specific calculations or formatting

// Import CartItem type so we know what cart items look like
import { CartItem } from "@/lib/user-data/api";

// calculateSubtotal function: Adds up the total price of all items in the cart
// Takes an array of cart items and returns the sum of (price × quantity) for each item
export function calculateSubtotal(items: CartItem[]): number {
  // reduce() is like a loop that accumulates a value
  // Starts at 0, then for each item adds (price × quantity) to the sum
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, // For each item: add price × quantity to running total
    0 // Start with 0 (initial value)
  );
}

// formatPrice function: Converts a number into a formatted currency string
// Example: 49.99 becomes "$49.99" (with dollar sign and proper formatting)
export function formatPrice(price: number): string {
  // Intl.NumberFormat is a built-in JavaScript tool for formatting numbers
  return new Intl.NumberFormat("en-US", {
    style: "currency", // Format as currency (adds $ symbol)
    currency: "USD", // Use US Dollar currency
  }).format(price); // Apply formatting to the price number
}
