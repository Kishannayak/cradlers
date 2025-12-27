// Loading component: A spinning circle animation shown while data is loading
// Provides visual feedback that something is happening (better UX than blank screen)

// Import React library
import React from "react";

// LoadingProps interface: Defines what properties this loading component accepts
interface LoadingProps {
  size?: "sm" | "md" | "lg"; // Optional: size of the spinner (small, medium, or large)
  className?: string; // Optional: extra CSS classes
}

// Loading component: The actual loading spinner component
export const Loading: React.FC<LoadingProps> = ({
  size = "md", // Default to medium size if not specified
  className = "", // Default to empty string for extra classes
}) => {
  // sizes object: Different width/height for different sizes
  const sizes = {
    sm: "w-4 h-4", // Small: 16px × 16px
    md: "w-8 h-8", // Medium: 32px × 32px
    lg: "w-12 h-12", // Large: 48px × 48px
  };

  // Return the loading spinner
  return (
    // Container div: centers the spinner
    <div className={`flex items-center justify-center ${className}`}>
      {/* Spinner circle: the actual spinning element */}
      <div
        className={`${sizes[size]} border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin`}
        // ${sizes[size]} = width and height based on size prop
        // border-4 = thick border (4px)
        // border-gray-200 = light gray border (most of the circle)
        // border-t-gray-900 = dark gray top border (creates the spinning effect)
        // rounded-full = perfect circle
        // animate-spin = Tailwind animation that rotates 360 degrees continuously
      />
    </div>
  );
};
