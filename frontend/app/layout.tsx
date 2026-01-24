// RootLayout: The main layout component that wraps every page
// This is where we set up the HTML structure, navigation, and global styles
// In Next.js App Router, this file applies to all pages automatically

// Import Metadata type for setting page metadata (title, description for SEO)
import type { Metadata } from "next";
// Import global CSS styles (Tailwind and custom styles)
import "./globals.css";
// Import Navigation component (the top navigation bar)
import { Navigation } from "@/components/layout/Navigation";

// Metadata: Information about the site for search engines and browser tabs
export const metadata: Metadata = {
  title: "Cradlers - Premium Kids Products", // Text shown in browser tab
  description: "Curated products for children ages 0-5", // Description for search engines
};

// RootLayout: The main layout component
// This function receives children (the page content) and wraps it with navigation
export default function RootLayout({
  children, // The page content that will be displayed (changes based on current route)
}: {
  children: React.ReactNode; // TypeScript: children can be any React content
}) {
  return (
    // HTML structure: root html element
    <html lang="en">
      {/* lang="en" = tells browser this page is in English */}
      
      {/* Body: contains all visible content */}
      <body>
        {/* Navigation: the top navigation bar (appears on every page) */}
        <Navigation />
        
        {/* Main content area: where page content goes */}
        <main className="min-h-screen">
          {/* min-h-screen = minimum height of full screen (ensures content fills viewport)
              {children} = the actual page content (homepage, products, cart, etc.) */}
          {children}
        </main>
      </body>
    </html>
  );
}
