"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/user-state/auth-store";
import type { User } from "@/lib/user-data/api";

const AUTH_HANDOFF_PREFIX = "#auth_handoff=";

/**
 * When user is redirected to admin.localhost or vendor.localhost after login,
 * auth is passed in the URL hash (localStorage is not shared across subdomains).
 * This component reads the hash, restores auth to localStorage, and cleans the URL.
 */
export function AuthHandoffHandler() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash.startsWith(AUTH_HANDOFF_PREFIX)) return;

    try {
      const encoded = hash.slice(AUTH_HANDOFF_PREFIX.length);
      const decoded = decodeURIComponent(encoded);
      const data = JSON.parse(decoded) as { token: string; user: User };
      if (data.token && data.user) {
        setUser(data.user, data.token);
        // Remove hash from URL (clean and avoid leaking token)
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    } catch {
      // Invalid or tampered hash – ignore
    }
  }, [setUser]);

  return null;
}
