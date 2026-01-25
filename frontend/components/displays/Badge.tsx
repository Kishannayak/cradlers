// Badge component: A small colored label/tag for displaying status or categories
// Used for things like age ranges, order status, etc.

// Import React library
import React from "react";

// BadgeProps interface: Defines what properties this badge accepts
interface BadgeProps {
  children: React.ReactNode; // Required: text to display inside the badge
  variant?: "default" | "success" | "warning" | "disabled"; // Optional: color style
  className?: string; // Optional: extra CSS classes
}

// Badge component: The actual badge component
export const Badge: React.FC<BadgeProps> = ({
  children, // Text content
  variant = "default", // Default to default style if not specified
  className = "", // Default to empty string for extra classes
}) => {
  // variants object: Different color combinations for different badge types
  const variants = {
    default: "bg-gradient-primary text-primary-700", // Lavender gradient background, darker purple text
    success: "bg-success-100 text-success-600", // Green background, dark green text (positive/success)
    warning: "bg-warning-100 text-warning-600", // Yellow background, dark yellow text (warning/caution)
    disabled: "bg-gray-200 text-gray-500", // Light gray background, gray text (disabled/inactive)
  };

  // Return the badge element
  return (
    <span
      // Combine CSS classes: base styles + variant colors + any custom classes
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
      // inline-flex = display as inline flexbox (stays in line with text)
      // items-center = vertically center content
      // px-3 py-1 = horizontal and vertical padding
      // rounded-full = fully rounded (pill shape)
      // text-sm = small text size
      // font-medium = medium font weight
    >
      {children} {/* Display the badge text */}
    </span>
  );
};
