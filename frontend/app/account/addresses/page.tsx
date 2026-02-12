// AddressesPage: Manage shipping addresses
// Users can view, add, edit, and delete shipping addresses
// Requires authentication - redirects to login if not logged in

// "use client" directive: This component needs to run in the browser
"use client";

// Import React hooks
import { useState, useEffect } from "react";
// Import Next.js router for navigation
import { useRouter } from "next/navigation";
// Import auth store to check login status
import { useAuthStore } from "@/lib/user-state/auth-store";
// Import API client to manage addresses
import { api } from "@/lib/backend/client";
// Import Address type
import { Address } from "@/lib/user-data/api";
// Import UI components
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/forms/Input";
import { Modal } from "@/components/forms/Modal";
import { BabyLoader } from "@/components/displays/BabyLoader";
import { EmptyState } from "@/components/displays/EmptyState";

// AddressesPage component: The addresses management page
export default function AddressesPage() {
  // Get router for navigation
  const router = useRouter();
  // Get current logged-in user
  const user = useAuthStore((state) => state.user);
  // State: Array of saved addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  // State: Whether we're loading addresses
  const [loading, setLoading] = useState(true);
  // State: Whether the add/edit modal is open
  const [showModal, setShowModal] = useState(false);
  // State: Which address is being edited (null if adding new)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  // State: Form data for address (used for both add and edit)
  const [formData, setFormData] = useState({
    street: "", // Street address
    city: "", // City name
    state: "", // State abbreviation
    zip: "", // ZIP code
    is_default: false, // Whether this is the default address
  });

  // useEffect: Check authentication and load addresses when component mounts
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/login?redirect=/account/addresses");
      return;
    }
    // If logged in, load addresses
    loadAddresses();
  }, [user, router]); // Re-run if user or router changes

  // loadAddresses function: Fetches all saved addresses from API
  const loadAddresses = async () => {
    setLoading(true); // Show loading spinner
    try {
      // Call API to get user's addresses
      const addressesData = await api.getAddresses();
      setAddresses(addressesData); // Update state with addresses
    } catch (error) {
      // If API call fails, log error
      console.error("Failed to load addresses:", error);
    } finally {
      setLoading(false); // Always hide loading spinner
    }
  };

  // handleOpenModal function: Opens modal for adding or editing address
  const handleOpenModal = (address?: Address) => {
    if (address) {
      // If address provided, we're editing
      setEditingAddress(address); // Store which address we're editing
      setFormData({
        // Pre-fill form with existing address data
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        is_default: address.is_default,
      });
    } else {
      // If no address provided, we're adding new
      setEditingAddress(null); // Clear editing state
      setFormData({
        // Start with empty form
        street: "",
        city: "",
        state: "",
        zip: "",
        // If this is the first address, make it default automatically
        is_default: addresses.length === 0,
      });
    }
    setShowModal(true); // Open the modal
  };

  // handleCloseModal function: Closes modal and resets form
  const handleCloseModal = () => {
    setShowModal(false); // Close modal
    setEditingAddress(null); // Clear editing state
    setFormData({
      // Reset form to empty
      street: "",
      city: "",
      state: "",
      zip: "",
      is_default: false,
    });
  };

  // handleSave function: Saves address (either creates new or updates existing)
  const handleSave = async () => {
    try {
      if (editingAddress) {
        // If editing, update existing address
        await api.updateAddress(editingAddress.id, formData);
      } else {
        // If not editing, create new address
        await api.createAddress(formData);
      }
      // Reload addresses to show the changes
      loadAddresses();
      // Close the modal
      handleCloseModal();
    } catch (error) {
      // If save fails, log error
      console.error("Failed to save address:", error);
    }
  };

  // handleDelete function: Deletes an address
  const handleDelete = async (addressId: string) => {
    // Confirm deletion with user (browser confirm dialog)
    if (!confirm("Are you sure you want to delete this address?")) return;
    // If user cancels, do nothing

    try {
      // Call API to delete address
      await api.deleteAddress(addressId);
      // Reload addresses to reflect deletion
      loadAddresses();
    } catch (error) {
      // If deletion fails, log error
      console.error("Failed to delete address:", error);
    }
  };

  // If no user, don't render (will redirect)
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header with "Add Address" button */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Addresses</h1>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Add Address</Button>
        {/* Opens modal for adding new address */}
      </div>

      {/* Conditional rendering based on loading/address state */}
      {loading ? (
        // If loading, show spinner
        <div className="flex justify-center py-24">
          <BabyLoader size="lg" />
        </div>
      ) : addresses.length === 0 ? (
        // If no addresses, show empty state
        <EmptyState
          title="No addresses saved"
          description="Add your first shipping address to get started"
          action={{
            label: "Add Address",
            onClick: () => handleOpenModal(), // Opens add modal
          }}
        />
      ) : (
        // If addresses exist, show them in a list
        <div className="space-y-4">
          {/* space-y-4 = vertical spacing between address cards */}

          {/* Map through addresses and display each one */}
          {addresses.map((address) => (
            <div
              key={address.id} // Unique key for React
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between">
                {/* flex = flexbox layout
                    items-start = align items to top
                    justify-between = space between address and buttons */}

                {/* Address information */}
                <div className="flex-1">
                  {/* flex-1 = takes remaining space */}
                  <div className="flex items-center gap-3 mb-2">
                    {/* Street address: bold */}
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {address.street}
                    </p>
                    {/* Show "Default" badge if this is the default address */}
                    {address.is_default && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  {/* City, state, ZIP: gray text */}
                  <p className="text-gray-600 dark:text-gray-300">
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>

                {/* Action buttons: Edit and Delete */}
                <div className="flex gap-2">
                  {/* Edit button: opens modal with address pre-filled */}
                  <Button
                    variant="ghost" // Transparent button style
                    size="sm" // Small button
                    onClick={() => handleOpenModal(address)} // Pass address to edit
                  >
                    Edit
                  </Button>

                  {/* Delete button: removes address */}
                  <Button
                    variant="ghost" // Transparent button style
                    size="sm" // Small button
                    onClick={() => handleDelete(address.id)} // Call delete function
                    className="text-red-600 hover:text-red-700"
                    // Red text (indicates destructive action)
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {/* Popup dialog for adding or editing an address */}
      <Modal
        isOpen={showModal} // Whether modal is visible
        onClose={handleCloseModal} // Function to close modal
        title={editingAddress ? "Edit Address" : "Add New Address"}
        // Title changes based on whether we're editing or adding
      >
        <div className="space-y-4">
          {/* space-y-4 = vertical spacing between form fields */}

          {/* Street address input */}
          <Input
            label="Street Address"
            value={formData.street}
            onChange={(e) =>
              setFormData({ ...formData, street: e.target.value })
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
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="San Francisco"
            />

            {/* State input */}
            <Input
              label="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              placeholder="CA"
            />
          </div>

          {/* ZIP code input */}
          <Input
            label="ZIP Code"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            placeholder="94102"
          />

          {/* Default address checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            {/* flex = flexbox layout
                items-center = vertically center
                gap-3 = space between checkbox and label
                cursor-pointer = pointer cursor (indicates clickable) */}
            <input
              type="checkbox"
              checked={formData.is_default} // Whether checkbox is checked
              onChange={(e) =>
                setFormData({ ...formData, is_default: e.target.checked })
              }
              // Update is_default when checkbox is toggled
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-primary-500 dark:focus:ring-primary-400"
              // w-5 h-5 = 20px × 20px checkbox
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Set as default address
            </span>
          </label>

          {/* Action buttons: Cancel and Save */}
          <div className="flex gap-3 pt-4">
            {/* Cancel button: closes modal without saving */}
            <Button
              variant="secondary" // Light button style
              className="flex-1" // Takes half the width
              onClick={handleCloseModal} // Close modal
            >
              Cancel
            </Button>

            {/* Save button: saves the address */}
            <Button
              className="flex-1" // Takes half the width
              onClick={handleSave} // Call function to save
              disabled={
                // Disable if any required field is empty
                !formData.street ||
                !formData.city ||
                !formData.state ||
                !formData.zip
              }
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
