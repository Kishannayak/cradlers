// ProductCard component: Displays a product in a card format on the product listing page
// Shows image, name, description, price, and age range - clickable to go to product detail page

// Import React library
import React from "react";
// Import Next.js Image component (optimized image loading)
import Image from "next/image";
// Import Next.js Link component (client-side navigation)
import Link from "next/link";
// Import Product type so TypeScript knows what product data looks like
import { Product } from "@/lib/user-data/api";
// Import function to format age range into readable text
import { formatAgeRange } from "@/lib/settings/age-ranges";
// Import function to format price as currency
import { formatPrice } from "@/lib/helpers/cart";
// Import Card component (the container)
import { Card } from "@/components/cards/Card";
// Import Badge component (for age range display)
import { Badge } from "@/components/displays/Badge";

// ProductCardProps interface: Defines what this component needs
interface ProductCardProps {
  product: Product; // Required: the product data to display
}

// ProductCard component: The actual product card
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    // Card component: wraps everything in a clickable card
    // href makes the whole card clickable - navigates to product detail page
    // className="group" enables group hover effects (image zoom on hover)
    <Card href={`/products/${product.id}`} className="group">
      {/* Image container: square aspect ratio, relative positioning for image */}
      <div className="relative aspect-square w-full overflow-hidden bg-primary-50 dark:bg-primary-900/30">
        {/* relative = allows absolute positioning of child (the image)
            aspect-square = maintains 1:1 aspect ratio (square)
            w-full = full width
            overflow-hidden = hide image parts that go outside
            bg-primary-50 = soft lavender background (light mode)
            dark:bg-primary-900/30 = dark purple background with opacity (dark mode) */}

        {/* Only show image if product has at least one image */}
        {product.images[0] && (
          <Image
            src={product.images[0]} // First image from product's image array
            alt={product.name} // Alt text for accessibility (screen readers)
            fill // Makes image fill the parent container
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            // object-cover = crop image to fill container while maintaining aspect ratio
            // transition-transform = smooth animation
            // duration-300 = 300ms animation
            // group-hover:scale-105 = zoom to 105% when hovering over the card (group)
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // Tells browser what size image to load based on screen size (performance optimization)
          />
        )}
      </div>

      {/* Content section: product info below the image */}
      <div className="p-6">
        {/* Age range badge */}
        <div className="mb-2">
          <Badge variant="default">
            {formatAgeRange(product.age_range)}
            {/* formatAgeRange converts age range data to readable text like "0-6 months" */}
          </Badge>
        </div>

        {/* Product name: heading */}
        <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2 line-clamp-2">
          {product.name}
          {/* text-lg = large text
              font-semibold = semi-bold weight
              text-primary-700 = soft purple (light mode)
              dark:text-primary-300 = lighter purple (dark mode)
              line-clamp-2 = limit to 2 lines, add ellipsis if longer */}
        </h3>

        {/* Product description */}
        <p className="text-sm text-primary-600 dark:text-primary-400 mb-4 line-clamp-2">
          {product.description}
          {/* text-sm = small text
              text-primary-600 = medium purple color (light mode)
              dark:text-primary-400 = lighter purple (dark mode)
              line-clamp-2 = limit to 2 lines */}
        </p>

        {/* Product price: formatted as currency */}
        <p className="text-xl font-semibold text-primary-700 dark:text-primary-300">
          {formatPrice(product.price)}
          {/* formatPrice converts number to "$49.99" format
              text-xl = extra large text
              font-semibold = semi-bold
              text-primary-700 = soft purple (light mode)
              dark:text-primary-300 = lighter purple (dark mode) */}
        </p>
      </div>
    </Card>
  );
};
