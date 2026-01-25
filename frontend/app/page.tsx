// HomePage: The landing page users see when they first visit the site
// Shows hero section with call-to-action and preview of future features

// Import Next.js Link component for navigation
import Link from "next/link";
// Import Button component for the call-to-action
import { Button } from "@/components/buttons/Button";

// HomePage component: The actual homepage
export default function HomePage() {
  return (
    // Main container: centers content and adds padding
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* max-w-7xl = maximum width (1280px) so content doesn't stretch too wide
          mx-auto = center horizontally
          px-6 = horizontal padding
          py-24 = vertical padding (top and bottom) */}

      {/* Hero section: main heading and call-to-action */}
      <div className="text-center mb-16">
        {/* text-center = center all text
            mb-16 = margin bottom (spacing below) */}

        {/* Main heading: large, bold title */}
        <h1 className="text-5xl font-bold text-primary-700 dark:text-primary-300 mb-6">
          Premium Products for Little Ones
          {/* text-5xl = extra extra large text
              font-bold = bold weight
              text-primary-700 = soft purple (light mode)
              dark:text-primary-300 = lighter purple (dark mode)
              mb-6 = margin bottom */}
        </h1>

        {/* Subheading: description text */}
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Curated collection of high-quality products designed for children ages
          0-5
          {/* text-xl = extra large text
              text-gray-600 = medium gray color
              max-w-2xl = maximum width (so text doesn't stretch too wide)
              mx-auto = center horizontally
              mb-12 = margin bottom */}
        </p>

        {/* Call-to-action button: links to products page */}
        <Link href="/products">
          <Button size="lg">Shop Now</Button>
          {/* size="lg" = large button */}
        </Link>
      </div>

      {/* Future Features - Disabled */}
      {/* Grid of feature cards: shows upcoming features that aren't available yet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
        {/* grid = CSS grid layout
            grid-cols-1 = 1 column on mobile
            md:grid-cols-2 = 2 columns on medium screens
            lg:grid-cols-4 = 4 columns on large screens
            gap-6 = space between grid items
            mt-24 = margin top (spacing above) */}

        {/* Doctor Consultations card */}
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 opacity-60 shadow-soft dark:shadow-dark">
          {/* bg-primary-50 = light lavender background (matching GIF)
              rounded-2xl = rounded corners
              p-8 = padding inside
              border border-primary-200 = soft lavender border (matching GIF)
              opacity-60 = 60% opacity (makes it look disabled/grayed out)
              shadow-soft = subtle shadow */}

          {/* Icon container: circular background with icon */}
          <div className="w-12 h-12 bg-primary-200 dark:bg-primary-800 rounded-xl mb-4 flex items-center justify-center">
            {/* SVG icon: checkmark/medical icon */}
            <svg
              className="w-6 h-6 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Feature title */}
          <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
            Doctor Consultations
          </h3>

          {/* "Coming Soon" text */}
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">Coming Soon</p>

          {/* Phase badge */}
          <span className="inline-block px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            Phase 2
          </span>
        </div>

        {/* Babysitter Services card (same structure as above) */}
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 opacity-60 shadow-soft dark:shadow-dark">
          <div className="w-12 h-12 bg-primary-200 dark:bg-primary-800 rounded-xl mb-4 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
            Babysitter Services
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">Coming Soon</p>
          <span className="inline-block px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            Phase 2
          </span>
        </div>

        {/* School Programs card (same structure) */}
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 opacity-60 shadow-soft dark:shadow-dark">
          <div className="w-12 h-12 bg-primary-200 dark:bg-primary-800 rounded-xl mb-4 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
            School Programs
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">Coming Soon</p>
          <span className="inline-block px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            Phase 2
          </span>
        </div>

        {/* Subscriptions card (same structure) */}
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 opacity-60 shadow-soft dark:shadow-dark">
          <div className="w-12 h-12 bg-primary-200 dark:bg-primary-800 rounded-xl mb-4 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
            Subscriptions
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">Coming Soon</p>
          <span className="inline-block px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            Phase 2
          </span>
        </div>
      </div>
    </div>
  );
}
