// This file manages the shopping cart state using Zustand (a state management library)
// State management means keeping track of what's in the cart across the entire app
// Zustand is simpler than Redux and perfect for this use case

// Import Zustand's create function to build our store
import { create } from "zustand";
// Import persist middleware - this saves cart data to browser's localStorage
// So if user refreshes page, their cart items don't disappear
import { persist } from "zustand/middleware";
// Import CartItem type so TypeScript knows what cart items look like
import { CartItem } from "@/lib/user-data/api";

// CartStore interface: Defines what our cart store can do
interface CartStore {
  items: CartItem[]; // Array of items currently in the cart
  addItem: (item: CartItem) => void; // Function to add an item to cart
  updateItemQuantity: (itemId: string, quantity: number) => void; // Function to change quantity
  removeItem: (itemId: string) => void; // Function to remove an item completely
  clearCart: () => void; // Function to empty the entire cart (after checkout)
}

// useCartStore: This is the hook we'll use in components to access cart data
// create() builds a new store, persist() wraps it to save to localStorage
export const useCartStore = create<CartStore>()(
  persist(
    // (set) => defines how to update the store state
    (set) => ({
      // Initial state: start with empty cart
      items: [],

      // addItem function: Adds a product to the cart
      addItem: (item) =>
        set((state) => {
          // Check if this exact product (same ID and variant) is already in cart
          const existingItem = state.items.find(
            (i) =>
              i.product_id === item.product_id && // Same product
              i.variant === item.variant // Same variant (color/size)
          );

          // If item already exists, increase its quantity instead of adding duplicate
          if (existingItem) {
            return {
              // Map through all items
              items: state.items.map(
                (i) =>
                  // If this is the existing item, update its quantity
                  i.id === existingItem.id
                    ? { ...i, quantity: i.quantity + item.quantity } // Add new quantity to existing
                    : i // Keep other items unchanged
              ),
            };
          }
          // If item doesn't exist, add it as a new cart item
          return { items: [...state.items, item] };
        }),

      // updateItemQuantity function: Changes how many of an item the user wants
      updateItemQuantity: (itemId, quantity) =>
        set((state) => ({
          // Map through all items
          items: state.items.map(
            (item) =>
              // If this is the item we're updating, change its quantity
              item.id === itemId ? { ...item, quantity } : item // Keep others unchanged
          ),
        })),

      // removeItem function: Completely removes an item from the cart
      removeItem: (itemId) =>
        set((state) => ({
          // Filter out the item with matching ID (keep all others)
          items: state.items.filter((item) => item.id !== itemId),
        })),

      // clearCart function: Empties the entire cart (used after successful checkout)
      clearCart: () => set({ items: [] }), // Set items to empty array
    }),
    {
      // Persist configuration: tells Zustand how to save to localStorage
      name: "cradlers-cart", // Key name in localStorage (so we can find it later)
    }
  )
);
