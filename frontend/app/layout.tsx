// RootLayout: The main layout component that wraps every page
// This is where we set up the HTML structure, navigation, and global styles
// In Next.js App Router, this file applies to all pages automatically

import type { Metadata } from "next";

// Force dynamic rendering so root and all pages are always server-rendered (avoids 404 on /)
export const dynamic = "force-dynamic";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { Chatbot } from "@/components/chat/Chatbot";
import { getPortalFromHeaders } from "@/lib/portal/server";
import { PortalProvider } from "@/lib/portal/context";
import { PortalShell } from "@/components/layout/PortalShell";
import { AuthHandoffHandler } from "@/components/auth/AuthHandoffHandler";

// Metadata: Information about the site for search engines and browser tabs
export const metadata: Metadata = {
  title: "Cradlers - Premium Kids Products", // Text shown in browser tab
  description: "Curated products for children ages 0-5", // Description for search engines
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const portal = await getPortalFromHeaders();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <PortalProvider portal={portal}>
            <AuthHandoffHandler />
            <PortalShell>{children}</PortalShell>
            <Chatbot />
          </PortalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
