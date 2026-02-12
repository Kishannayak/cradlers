// CheckoutPage: Final step where user selects shipping address and places order
// Requires user to be logged in - redirects to login if not authenticated

// "use client" directive: This component needs to run in the browser
"use client";

// Import React hooks
import { useState, useEffect } from "react";
// Import Next.js router for navigation
import { useRouter } from "next/navigation";
// Import cart store to access cart items and clear cart after order
import { useCartStore } from "@/lib/user-state/cart-store";
// Import auth store to check if user is logged in
import { useAuthStore } from "@/lib/user-state/auth-store";
// Import API client to fetch addresses and place order
import { api } from "@/lib/backend/client";
// Import Address type
import { Address } from "@/lib/user-data/api";
// Import utility functions
import { formatPrice, calculateSubtotal } from "@/lib/helpers/cart";
// Import UI components
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/forms/Input";
import { Modal } from "@/components/forms/Modal";
import { BabyLoader } from "@/components/displays/BabyLoader";

// CheckoutPage component: The checkout page
export default function CheckoutPage() {
  // Get router for navigation
  const router = useRouter();
  // Get cart items
  const items = useCartStore((state) => state.items);
  // Get function to clear cart after successful order
  const clearCart = useCartStore((state) => state.clearCart);
  // Get current logged-in user
  const user = useAuthStore((state) => state.user);
  // State: Array of saved shipping addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  // State: Which address is selected for shipping
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  // State: Whether the "add address" modal is open
  const [showAddressModal, setShowAddressModal] = useState(false);
  // State: Whether we're loading addresses
  const [loading, setLoading] = useState(true);
  // State: Whether we're currently placing the order
  const [placingOrder, setPlacingOrder] = useState(false);
  // State: Form data for new address
  const [newAddress, setNewAddress] = useState({
    street: "", // Street address
    city: "", // City name
    state: "", // State abbreviation
    zip: "", // ZIP code
  });

  // Calculate total price of all items
  const subtotal = calculateSubtotal(items);

  // useEffect: Check authentication and load addresses when component mounts
  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      // Include redirect parameter so user comes back here after logging in
      router.push("/login?redirect=/checkout");
      return;
    }
    // If user is logged in, load their saved addresses
    loadAddresses();
  }, [user, router]); // Re-run if user or router changes

  // loadAddresses function: Fetches user's saved addresses from API
  const loadAddresses = async () => {
    setLoading(true); // Show loading spinner
    try {
      // Call API to get user's addresses
      const addressesData = await api.getAddresses();
      setAddresses(addressesData); // Update state with addresses

      // Try to find default address (marked as is_default)
      const defaultAddress = addressesData.find((addr) => addr.is_default);
      if (defaultAddress) {
        // If default address exists, select it automatically
        setSelectedAddressId(defaultAddress.id);
      } else if (addressesData.length > 0) {
        // If no default but addresses exist, select the first one
        setSelectedAddressId(addressesData[0].id);
      }
    } catch (error) {
      // If API call fails, log error
      console.error("Failed to load addresses:", error);
    } finally {
      setLoading(false); // Always hide loading spinner
    }
  };

  // handleCreateAddress function: Creates a new shipping address
  const handleCreateAddress = async () => {
    try {
      // Call API to create new address
      const address = await api.createAddress({
        ...newAddress, // Spread all form fields (street, city, state, zip)
        // If this is the first address, make it the default
        is_default: addresses.length === 0,
      });
      // Add new address to the list
      setAddresses([...addresses, address]);
      // Automatically select the newly created address
      setSelectedAddressId(address.id);
      // Clear the form
      setNewAddress({ street: "", city: "", state: "", zip: "" });
      // Close the modal
      setShowAddressModal(false);
    } catch (error) {
      // If creation fails, log error
      console.error("Failed to create address:", error);
    }
  };

  // handlePlaceOrder function: Processes the order and creates it
  const handlePlaceOrder = async () => {
    // Validate that an address is selected
    if (!selectedAddressId) {
      alert("Please select a shipping address");
      return;
    }

    setPlacingOrder(true); // Show "Placing Order..." text
    try {
      // Call API to create the order
      const response = await api.checkout({
        shipping_address_id: selectedAddressId, // Which address to ship to
        payment_method: "card", // Placeholder for Phase 1 (no real payment yet)
      });
      // Clear the cart (items have been converted to an order)
      clearCart();
      // Navigate to order confirmation page
      router.push(`/account/orders/${response.order.id}`);
    } catch (error) {
      // If order fails, log error and show alert
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false); // Always clear loading state
    }
  };

  // If cart is empty, show message
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Your cart is empty
        </h1>
        <Button onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  // Main checkout view
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12">Checkout</h1>

      <div className="space-y-12">
        {/* space-y-12 = vertical spacing between sections */}

        {/* Shipping Address Section */}
        <div>
          {/* Header with "Add New Address" button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Shipping Address
            </h2>
            <Button
              variant="ghost" // Transparent button style
              size="sm" // Small button
              onClick={() => setShowAddressModal(true)} // Open modal
            >
              + Add New Address
            </Button>
          </div>

          {/* Conditional rendering based on loading/address state */}
          {loading ? (
            // If loading, show spinner
            <div className="flex justify-center py-8">
              <BabyLoader size="md" />
            </div>
          ) : addresses.length === 0 ? (
            // If no addresses, show message with button to add one
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 mb-4">No addresses saved</p>
              <Button onClick={() => setShowAddressModal(true)}>
                Add Address
              </Button>
            </div>
          ) : (
            // If addresses exist, show them as selectable cards
            <div className="space-y-4">
              {/* Map through addresses and create selectable cards */}
              {addresses.map((address) => (
                <label
                  key={address.id} // Unique key for React
                  className={`block p-6 rounded-2xl border-2 cursor-pointer transition-smooth ${
                    // Conditional styling: highlight selected address
                    selectedAddressId === address.id
                      ? "border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30" // Selected: purple border, light background
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600" // Not selected: light border, darker on hover
                  }`}
                  // block = block-level element
                  // cursor-pointer = show pointer cursor (indicates clickable)
                >
                  {/* Hidden radio button: controls selection */}
                  <input
                    type="radio"
                    name="address" // All radio buttons share same name (only one can be selected)
                    value={address.id} // Value is the address ID
                    checked={selectedAddressId === address.id} // Checked if this is selected
                    onChange={(e) => setSelectedAddressId(e.target.value)} // Update selection
                    className="sr-only" // Screen reader only (visually hidden)
                  />

                  {/* Address display */}
                  <div className="flex items-start justify-between">
                    <div>
                      {/* Street address: bold */}
                      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {address.street}
                      </p>
                      {/* City, state, ZIP: gray text */}
                      <p className="text-gray-600 dark:text-gray-300">
                        {address.city}, {address.state} {address.zip}
                      </p>
                    </div>
                    {/* Show "Default" badge if this is the default address */}
                    {address.is_default && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Order Summary
          </h2>

          {/* List of items in order */}
          <div className="space-y-4 mb-6">
            {/* Map through cart items and show each one */}
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>
                  {item.product.name} × {item.quantity}
                  {/* Product name and quantity */}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
                {/* Total price for this item */}
              </div>
            ))}

            {/* Total: sum of all items */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-semibold text-gray-900 dark:text-gray-100">
              {/* border-t = top border (separator line) */}
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          {/* Place Order button */}
          <Button
            size="lg" // Large button
            className="w-full" // Full width
            onClick={handlePlaceOrder} // Call function when clicked
            disabled={placingOrder || !selectedAddressId}
            // Disable if placing order or no address selected
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
            {/* Show "Placing Order..." while processing, "Place Order" otherwise */}
          </Button>
        </div>
      </div>

      {/* Add Address Modal */}
      {/* Popup dialog for adding a new address */}
      <Modal
        isOpen={showAddressModal} // Whether modal is visible
        onClose={() => setShowAddressModal(false)} // Function to close modal
        title="Add New Address"
      >
        <div className="space-y-4">
          {/* Street address input */}
          <Input
            label="Street Address"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
            // Update street field when user types
            placeholder="123 Main St"
          />

          {/* City and State: side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* grid = CSS grid
                grid-cols-2 = 2 columns
                gap-4 = space between */}

            {/* City input */}
            <Input
              label="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              placeholder="San Francisco"
            />

            {/* State input */}
            <Input
              label="State"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
              placeholder="CA"
            />
          </div>

          {/* ZIP code input */}
          <Input
            label="ZIP Code"
            value={newAddress.zip}
            onChange={(e) =>
              setNewAddress({ ...newAddress, zip: e.target.value })
            }
            placeholder="94102"
          />

          {/* Action buttons: Cancel and Save */}
          <div className="flex gap-3 pt-4">
            {/* Cancel button: closes modal without saving */}
            <Button
              variant="secondary" // Light button style
              className="flex-1" // Takes half the width
              onClick={() => setShowAddressModal(false)} // Close modal
            >
              Cancel
            </Button>

            {/* Save button: creates the address */}
            <Button
              className="flex-1" // Takes half the width
              onClick={handleCreateAddress} // Call function to save
              disabled={
                // Disable if any required field is empty
                !newAddress.street ||
                !newAddress.city ||
                !newAddress.state ||
                !newAddress.zip
              }
            >
              Save Address
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
