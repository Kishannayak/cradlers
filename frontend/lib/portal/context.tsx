"use client";

import { createContext, useContext, ReactNode } from "react";

export type PortalType = "admin" | "vendor" | "shop";

const PortalContext = createContext<PortalType>("shop");

export function PortalProvider({
  portal,
  children,
}: {
  portal: PortalType;
  children: ReactNode;
}) {
  return (
    <PortalContext.Provider value={portal}>{children}</PortalContext.Provider>
  );
}

export function usePortal(): PortalType {
  const ctx = useContext(PortalContext);
  return ctx ?? "shop";
}
