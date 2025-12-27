// This file manages user authentication state using Zustand
// It keeps track of whether a user is logged in and their information
// Also persists to localStorage so login persists across page refreshes

// Import Zustand's create function to build our store
import { create } from "zustand";
// Import persist middleware to save auth data to browser's localStorage
import { persist } from "zustand/middleware";
// Import User type so TypeScript knows what user data looks like
import { User } from "@/lib/user-data/api";

// AuthStore interface: Defines what our auth store can do
interface AuthStore {
  user: User | null; // Current logged-in user, or null if not logged in
  token: string | null; // Authentication token (like a temporary password) to prove user is logged in
  setUser: (user: User, token: string) => void; // Function to log a user in
  logout: () => void; // Function to log the user out
}

// useAuthStore: This is the hook we'll use in components to access auth data
// create() builds a new store, persist() wraps it to save to localStorage
export const useAuthStore = create<AuthStore>()(
  persist(
    // (set) => defines how to update the store state
    (set) => ({
      // Initial state: no user logged in
      user: null, // No user initially
      token: null, // No token initially

      // setUser function: Logs a user in by storing their info and token
      setUser: (user, token) => set({ user, token }), // Update both user and token

      // logout function: Logs the user out by clearing their info
      logout: () => set({ user: null, token: null }), // Clear both user and token
    }),
    {
      // Persist configuration: tells Zustand how to save to localStorage
      name: "cradlers-auth", // Key name in localStorage (so we can find it later)
    }
  )
);
