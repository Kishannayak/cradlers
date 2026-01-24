// OrdersPage: Displays user's order history
// Shows list of past orders with status, items, and total
// Requires authentication - redirects to login if not logged in

// "use client" directive: This component needs to run in the browser
"use client";

// Import React hooks
import { useState, useEffect } from "react";
// Import Next.js router for navigation
import { useRouter } from "next/navigation";
// Import Next.js Link component
import Link from "next/link";
// Import auth store to check login status
import { useAuthStore } from "@/lib/user-state/auth-store";
// Import API client to fetch orders
import { api } from "@/lib/backend/client";
// Import Order type
import { Order } from "@/lib/user-data/api";
// Import utility functions
import { formatPrice } from "@/lib/helpers/cart";
// Import formatAgeRange (not used here but imported for potential use)
import { formatAgeRange } from "@/lib/settings/age-ranges";
// Import UI components
import { Loading } from "@/components/displays/Loading";
import { EmptyState } from "@/components/displays/EmptyState";
import { Badge } from "@/components/displays/Badge";

// OrdersPage component: The orders history page
export default function OrdersPage() {
  // Get router for navigation
  const router = useRouter();
  // Get current logged-in user
  const user = useAuthStore((state) => state.user);
  // State: Array of past orders
  const [orders, setOrders] = useState<Order[]>([]);
  // State: Whether we're loading orders
  const [loading, setLoading] = useState(true);

  // useEffect: Check authentication and load orders when component mounts
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/login?redirect=/account/orders");
      return;
    }
    // If logged in, load orders
    loadOrders();
  }, [user, router]); // Re-run if user or router changes

  // loadOrders function: Fetches user's order history from API
  const loadOrders = async () => {
    setLoading(true); // Show loading spinner
    try {
      // Call API to get user's orders
      const response = await api.getOrders();
      setOrders(response.orders); // Update state with orders
    } catch (error) {
      // If API call fails, log error
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false); // Always hide loading spinner
    }
  };

  // getStatusVariant function: Returns badge color based on order status
  const getStatusVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "default"; // Gray badge for pending orders
      case "confirmed":
        return "default"; // Gray badge for confirmed orders
      case "shipped":
        return "success"; // Green badge for shipped orders
      case "delivered":
        return "success"; // Green badge for delivered orders
      case "cancelled":
        return "disabled"; // Gray badge for cancelled orders
      default:
        return "default"; // Default to gray
    }
  };

  // If no user, don't render (will redirect)
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">View your order history</p>
      </div>

      {/* Conditional rendering based on loading/orders state */}
      {loading ? (
        // If loading, show spinner
        <div className="flex justify-center py-24">
          <Loading size="lg" />
        </div>
      ) : orders.length === 0 ? (
        // If no orders, show empty state
        <EmptyState
          title="No orders yet"
          description="Your order history will appear here"
          action={{
            label: "Browse Products",
            onClick: () => router.push("/products"), // Navigate to products
          }}
        />
      ) : (
        // If orders exist, show them in a list
        <div className="space-y-6">
          {/* space-y-6 = vertical spacing between order cards */}

          {/* Map through orders and display each one */}
          {orders.map((order) => (
            <Link
              key={order.id} // Unique key for React
              href={`/account/orders/${order.id}`} // Link to order detail page
              className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-soft-lg transition-smooth"
              // block = block-level element (full width)
              // hover:shadow-soft-lg = larger shadow on hover (card "lifts up")
              // transition-smooth = smooth animation
            >
              {/* Order header: order number, date, and status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  {/* Order number */}
                  <p className="text-sm text-gray-500 mb-1">
                    Order #{order.id}
                    {/* text-sm = small text
                        text-gray-500 = medium gray color */}
                  </p>
                  {/* Order date: formatted as readable date */}
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                    {/* toLocaleDateString() = converts ISO date to readable format like "12/24/2024" */}
                  </p>
                </div>
                {/* Status badge: shows order status with appropriate color */}
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  {/* Capitalize first letter: "pending" becomes "Pending" */}
                </Badge>
              </div>

              {/* Order items: list of products in the order */}
              <div className="space-y-2 mb-4">
                {/* space-y-2 = vertical spacing between items */}

                {/* Map through order items and display each one */}
                {order.items.map((item) => (
                  <div
                    key={item.id} // Unique key for React
                    className="flex justify-between text-gray-600"
                  >
                    <span>
                      {item.product_name} × {item.quantity}
                      {/* Product name and quantity */}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                    {/* Total price for this item (price × quantity) */}
                  </div>
                ))}
              </div>

              {/* Order footer: item count and total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                {/* pt-4 = padding top
                    border-t = top border (separator line) */}

                {/* Item count: shows number of items */}
                <span className="text-sm text-gray-500">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  {/* Pluralize "item" if count is not 1 */}
                </span>

                {/* Order total: formatted as currency */}
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
