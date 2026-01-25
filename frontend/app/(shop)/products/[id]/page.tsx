// ProductDetailPage: Shows detailed information about a single product
// Users can view product details, select quantity, and add to cart
// [id] in the filename means this is a dynamic route - the product ID comes from the URL

// "use client" directive: This component needs to run in the browser
// Required because we use hooks, navigation, and interact with the user
"use client";

// Import React hooks for state management and side effects
import { useState, useEffect } from "react";
// Import Next.js hooks for getting URL parameters and navigation
import { useParams, useRouter } from "next/navigation";
// Import Next.js Image component (optimized image loading)
import Image from "next/image";
// Import Product type
import { Product } from "@/lib/user-data/api";
// Import API client to fetch product data
import { api } from "@/lib/backend/client";
// Import cart store to add items to cart
import { useCartStore } from "@/lib/user-state/cart-store";
// Import function to format age range
import { formatAgeRange } from "@/lib/settings/age-ranges";
// Import function to format price as currency
import { formatPrice } from "@/lib/helpers/cart";
// Import UI components
import { Button } from "@/components/buttons/Button";
import { Badge } from "@/components/displays/Badge";
import { BabyLoader } from "@/components/displays/BabyLoader";

// ProductDetailPage component: The product detail page
export default function ProductDetailPage() {
  // Get URL parameters (the [id] from the route)
  const params = useParams();
  // Get router for navigation
  const router = useRouter();
  // Extract product ID from URL parameters
  const productId = params.id as string;
  // State: The product data (null until loaded)
  const [product, setProduct] = useState<Product | null>(null);
  // State: Whether we're loading product data
  const [loading, setLoading] = useState(true);
  // State: Quantity user wants to buy (starts at 1)
  const [quantity, setQuantity] = useState(1);
  // State: Whether we're currently adding item to cart (shows "Adding..." text)
  const [addingToCart, setAddingToCart] = useState(false);
  // Get addItem function from cart store
  const addItem = useCartStore((state) => state.addItem);

  // useEffect: Load product data when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      // Only load if we have a product ID
      loadProduct();
    }
  }, [productId]); // Re-run when productId changes

  // loadProduct function: Fetches product details from API
  const loadProduct = async () => {
    setLoading(true); // Show loading spinner
    try {
      // Call API to get product details
      const response = await api.getProduct(productId);
      setProduct(response.product); // Update state with product data
    } catch (error) {
      // If API call fails, log error
      console.error("Failed to load product:", error);
    } finally {
      setLoading(false); // Always hide loading spinner
    }
  };

  // handleAddToCart function: Adds product to shopping cart
  const handleAddToCart = async () => {
    if (!product) return; // Don't do anything if product doesn't exist

    setAddingToCart(true); // Show "Adding..." text
    try {
      // Call API to add item to cart
      const cartItem = await api.addToCart({
        product_id: product.id, // Which product
        quantity, // How many
      });
      // Add item to local cart store (updates cart count in navigation)
      addItem(cartItem);
      // Navigate to cart page
      router.push("/cart");
    } catch (error) {
      // If adding to cart fails, log error
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingToCart(false); // Always hide "Adding..." text
    }
  };

  // If loading, show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* min-h-screen = minimum height of full screen (centers spinner vertically) */}
        <BabyLoader size="lg" />
      </div>
    );
  }

  // If product not found, show error message
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product not found
        </h1>
        <Button onClick={() => router.push("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  // Main product detail view
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Grid layout: image on left, info on right (stacks on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* grid = CSS grid
            grid-cols-1 = 1 column on mobile
            lg:grid-cols-2 = 2 columns on large screens
            gap-12 = space between columns */}

        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
          {/* relative = allows absolute positioning of child (image)
              aspect-square = maintains 1:1 aspect ratio (square)
              w-full = full width
              overflow-hidden = hide parts that go outside
              rounded-2xl = rounded corners
              bg-gray-100 = light gray background (shows while image loads) */}

          {/* Only show image if product has at least one image */}
          {product.images[0] && (
            <Image
              src={product.images[0]} // First product image
              alt={product.name} // Alt text for accessibility
              fill // Makes image fill the container
              className="object-cover" // Crop to fill while maintaining aspect ratio
              priority // Load this image with high priority (above the fold)
              sizes="(max-width: 1024px) 100vw, 50vw"
              // Tells browser what size to load based on screen size (performance)
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* flex flex-col = vertical flexbox layout */}

          {/* Age range badge */}
          <div className="mb-4">
            <Badge variant="default">
              {formatAgeRange(product.age_range)}
              {/* Convert age range data to readable text like "0-6 months" */}
            </Badge>
          </div>

          {/* Product name: large heading */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Product price: large, bold */}
          <p className="text-3xl font-semibold text-gray-900 mb-8">
            {formatPrice(product.price)}
            {/* Convert number to "$49.99" format */}
          </p>

          {/* Description section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
              {/* leading-relaxed = more line spacing for readability */}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            {/* Flex container: decrease button, quantity display, increase button */}
            <div className="flex items-center gap-4">
              {/* Decrease button: subtracts 1 from quantity */}
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                // Math.max(1, ...) ensures quantity never goes below 1
                className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-smooth"
                // w-10 h-10 = 40px × 40px square button
                // rounded-xl = rounded corners
                // flex items-center justify-center = center the minus icon
                // hover:bg-gray-100 = light gray background on hover
              >
                {/* Minus icon (horizontal line) */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4" // Horizontal line
                  />
                </svg>
              </button>

              {/* Quantity display: shows current quantity */}
              <span className="text-lg font-medium text-gray-900 w-12 text-center">
                {quantity}
                {/* w-12 = fixed width so layout doesn't shift
                    text-center = center the number */}
              </span>

              {/* Increase button: adds 1 to quantity */}
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-smooth"
              >
                {/* Plus icon (horizontal and vertical lines) */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4" // Plus sign (vertical and horizontal lines)
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg" // Large button
            onClick={handleAddToCart} // Call function when clicked
            disabled={addingToCart || !product.in_stock}
            // Disable if currently adding or product is out of stock
            className="w-full" // Full width button
          >
            {/* Conditional text based on state */}
            {addingToCart
              ? "Adding..." // Show while adding
              : product.in_stock
              ? "Add to Cart" // Show if in stock
              : "Out of Stock"}{" "}
            {/* Show if out of stock */}
          </Button>

          {/* Related Products - Disabled for Phase 1 */}
          {/* Placeholder section for future feature */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            {/* mt-16 = margin top (spacing above)
                pt-16 = padding top (spacing inside)
                border-t = top border (separator line) */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Related Products
            </h2>
            <p className="text-gray-500 text-sm">Coming in Phase 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
