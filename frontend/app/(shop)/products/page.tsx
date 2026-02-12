// ProductsPage: Displays a list of products with age-based filtering
// Users can filter products by age range (0-6 months, 6-12 months, etc.)

// "use client" directive: This component needs to run in the browser
// Required because we use React hooks (useState, useEffect) and interact with the user
"use client";

// Import React hooks for managing component state and side effects
import { useState, useEffect } from "react";
// Import Product type so TypeScript knows what product data looks like
import { Product } from "@/lib/user-data/api";
// Import API client to fetch products from backend
import { api } from "@/lib/backend/client";
// Import age range constants and formatting function
import { AGE_RANGES, formatAgeRange } from "@/lib/settings/age-ranges";
// Import ProductCard component to display each product
import { ProductCard } from "@/components/shop/ProductCard";
// Import BabyLoader component for loading state
import { BabyLoader } from "@/components/displays/BabyLoader";
// Import EmptyState component for when no products found
import { EmptyState } from "@/components/displays/EmptyState";
// Import Badge component (not used here but imported for potential use)
import { Badge } from "@/components/displays/Badge";

// ProductsPage component: The main products listing page
export default function ProductsPage() {
  // State: Array of products to display
  const [products, setProducts] = useState<Product[]>([]);
  // State: Whether we're currently loading products (shows spinner)
  const [loading, setLoading] = useState(true);
  // State: Which age range filter is selected (null = show all ages)
  const [selectedAgeRange, setSelectedAgeRange] = useState<
    (typeof AGE_RANGES)[0]["value"] | null
  >(null);
  // TypeScript: This type means "the value type from the first item in AGE_RANGES array, or null"

  // useEffect: Runs code when component first loads or when selectedAgeRange changes
  useEffect(() => {
    loadProducts(); // Fetch products whenever age filter changes
  }, [selectedAgeRange]); // Dependency: re-run when selectedAgeRange changes

  // loadProducts function: Fetches products from the API
  const loadProducts = async () => {
    setLoading(true); // Show loading spinner
    try {
      // Call API to get products, optionally filtered by age range
      const response = await api.getProducts({
        age_range: selectedAgeRange || undefined, // Pass age range if selected, otherwise undefined (show all)
      });
      setProducts(response.products); // Update state with fetched products
    } catch (error) {
      // If API call fails, log error to console
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false); // Always hide loading spinner, even if there was an error
    }
  };

  return (
    // Main container: centers content and adds padding
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* max-w-7xl = maximum width (1280px)
          mx-auto = center horizontally
          px-6 = horizontal padding
          py-12 = vertical padding */}

      {/* Page header: title and description */}
      <div className="mb-12">
        {/* mb-12 = margin bottom (spacing below) */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Products</h1>
        {/* text-4xl = extra large text
            font-bold = bold weight
            text-gray-900 = dark text (light mode)
            dark:text-gray-100 = light text (dark mode)
            mb-4 = margin bottom */}
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover premium products for your little one
          {/* text-lg = large text
              text-gray-600 = medium gray color (light mode)
              dark:text-gray-300 = light gray (dark mode) */}
        </p>
      </div>

      {/* Age Range Filters */}
      {/* Buttons to filter products by age range */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3">
          {/* flex = flexbox layout
              flex-wrap = wrap to next line if needed
              gap-3 = space between buttons */}

          {/* "All Ages" button: clears the filter */}
          <button
            onClick={() => setSelectedAgeRange(null)} // Clear filter when clicked
            className={`px-6 py-3 rounded-xl font-medium transition-smooth ${
              // Conditional styling: gradient if selected, light if not
              selectedAgeRange === null
                ? "bg-gradient-purple text-white shadow-baby" // Selected: darker purple gradient, white text
                : "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800" // Not selected: light lavender (adapts to dark mode)
            }`}
          >
            All Ages
          </button>

          {/* Map through each age range and create a filter button */}
          {AGE_RANGES.map((range) => (
            <button
              key={range.label} // React needs unique key for each item in array
              onClick={() => setSelectedAgeRange(range.value)} // Set this age range as selected
              className={`px-6 py-3 rounded-xl font-medium transition-smooth ${
                // Check if this age range is currently selected
                selectedAgeRange?.min_months === range.value.min_months &&
                selectedAgeRange?.max_months === range.value.max_months
                  ? "bg-gradient-purple text-white shadow-baby" // Selected: darker purple gradient
                  : "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800" // Not selected: light lavender style (adapts to dark mode)
              }`}
            >
              {range.label} {/* Display age range label like "0-6 months" */}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {/* Conditional rendering: show different content based on state */}
      {loading ? (
        // If loading, show spinner
        <div className="flex justify-center py-24">
          {/* flex justify-center = center horizontally
              py-24 = vertical padding */}
          <BabyLoader size="lg" /> {/* Large loading spinner */}
        </div>
      ) : products.length === 0 ? (
        // If not loading but no products found, show empty state
        <EmptyState
          title="No products found"
          description="Try selecting a different age range"
        />
      ) : (
        // If products exist, show them in a grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* grid = CSS grid layout
              grid-cols-1 = 1 column on mobile
              md:grid-cols-2 = 2 columns on medium screens
              lg:grid-cols-3 = 3 columns on large screens
              gap-8 = space between grid items */}

          {/* Map through products array and render a ProductCard for each */}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
            // key={product.id} = unique identifier for React
            // product={product} = pass product data to ProductCard component
          ))}
        </div>
      )}
    </div>
  );
}
