// OrderDetailPage: Shows detailed information about a specific order
// Displays order items, total, shipping address, and status
// [id] in filename means this is a dynamic route - order ID comes from URL
// Requires authentication - redirects to login if not logged in

// "use client" directive: This component needs to run in the browser
"use client";

// Import React hooks
import { useState, useEffect } from "react";
// Import Next.js hooks for URL parameters and navigation
import { useParams, useRouter } from "next/navigation";
// Import auth store to check login status
import { useAuthStore } from "@/lib/user-state/auth-store";
// Import API client to fetch order details
import { api } from "@/lib/backend/client";
// Import Order type
import { Order } from "@/lib/user-data/api";
// Import utility function for price formatting
import { formatPrice } from "@/lib/helpers/cart";
// Import UI components
import { Badge } from "@/components/displays/Badge";
import { BabyLoader } from "@/components/displays/BabyLoader";
import { Button } from "@/components/buttons/Button";

// OrderDetailPage component: The order detail page
export default function OrderDetailPage() {
  // Get URL parameters (the [id] from the route)
  const params = useParams();
  // Get router for navigation
  const router = useRouter();
  // Get current logged-in user
  const user = useAuthStore((state) => state.user);
  // Extract order ID from URL parameters
  const orderId = params.id as string;
  // State: The order data (null until loaded)
  const [order, setOrder] = useState<Order | null>(null);
  // State: Whether we're loading order data
  const [loading, setLoading] = useState(true);

  // useEffect: Check authentication and load order when component mounts
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/login?redirect=/account/orders");
      return;
    }
    // If logged in, load order details
    loadOrder();
  }, [user, router, orderId]); // Re-run if user, router, or orderId changes

  // loadOrder function: Fetches order details from API
  const loadOrder = async () => {
    setLoading(true); // Show loading spinner
    try {
      // Call API to get order details
      const orderData = await api.getOrder(orderId);
      setOrder(orderData); // Update state with order data
    } catch (error) {
      // If API call fails, log error
      console.error("Failed to load order:", error);
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

  // If loading, show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* min-h-screen = minimum height of full screen (centers spinner vertically) */}
        <BabyLoader size="lg" />
      </div>
    );
  }

  // Main order detail view
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back button: returns to orders list */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        {/* variant="ghost" = transparent button style
            router.back() = go back to previous page */}
        ← Back to Orders
      </Button>

      {/* Order details card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        {/* bg-white = white background
            rounded-2xl = rounded corners
            border = border around
            p-8 = padding inside */}

        {/* Order header: order number, status, and date */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {/* Order number: large heading */}
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{orderId}
            </h1>
            {/* Status badge: only show if order is loaded */}
            {order && (
              <Badge variant={getStatusVariant(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                {/* Capitalize first letter: "pending" becomes "Pending" */}
              </Badge>
            )}
          </div>
          {/* Order date: only show if order is loaded */}
          {order && (
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString()}
              {/* Format date as readable string like "12/24/2024" */}
            </p>
          )}
        </div>

        {/* Conditional rendering: show order details or "not found" message */}
        {order ? (
          // If order exists, show full details
          <>
            {/* Order Items Section */}
            <div className="space-y-4 mb-8">
              {/* space-y-4 = vertical spacing between items */}
              <h2 className="text-xl font-semibold text-gray-900">Items</h2>

              {/* Map through order items and display each one */}
              {order.items.map((item) => (
                <div
                  key={item.id} // Unique key for React
                  className="flex justify-between py-4 border-b border-gray-200 last:border-0"
                  // flex = flexbox layout
                  // justify-between = space between name and price
                  // py-4 = vertical padding
                  // border-b = bottom border (separator line)
                  // last:border-0 = remove border from last item
                >
                  {/* Item details */}
                  <div>
                    {/* Product name: bold */}
                    <p className="font-medium text-gray-900">
                      {item.product_name}
                    </p>
                    {/* Quantity: small gray text */}
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  {/* Item total: price × quantity */}
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Total Section */}
            <div className="pt-6 border-t border-gray-200">
              {/* pt-6 = padding top
                  border-t = top border (separator line) */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                {/* Order total: large, bold */}
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* Shipping Address Section */}
            {/* Only show if order has a shipping address */}
            {order.shipping_address && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                {/* mt-8 = margin top (spacing above)
                    pt-8 = padding top (spacing inside)
                    border-t = top border (separator line) */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                {/* Address formatted as multi-line text */}
                <p className="text-gray-600">
                  {order.shipping_address.street}
                  <br /> {/* Line break */}
                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                  {order.shipping_address.zip}
                </p>
              </div>
            )}
          </>
        ) : (
          // If order not found, show message
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Order not found</p>
            <Button onClick={() => router.push("/account/orders")}>
              Back to Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
