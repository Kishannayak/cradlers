// EmptyState component: Shows a friendly message when there's no data to display
// Used for empty cart, no products found, no orders, etc. - better than showing nothing

// Import React library
import React from "react";

// EmptyStateProps interface: Defines what properties this component accepts
interface EmptyStateProps {
  title: string; // Required: main heading text (e.g., "Your cart is empty")
  description?: string; // Optional: additional explanation text
  action?: {
    // Optional: button to help user take action
    label: string; // Text on the button
    onClick: () => void; // Function to run when button is clicked
  };
}

// EmptyState component: The actual empty state component
export const EmptyState: React.FC<EmptyStateProps> = ({
  title, // Main heading
  description, // Optional description
  action, // Optional action button
}) => {
  return (
    // Container: centers everything vertically and horizontally
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon container: circular background with gradient */}
      <div className="w-16 h-16 rounded-full bg-gradient-primary dark:bg-gradient-dark flex items-center justify-center mb-4 shadow-soft dark:shadow-dark">
        {/* w-16 h-16 = 64px × 64px circle
            rounded-full = perfect circle
            bg-gradient-primary = lavender gradient background (light mode)
            dark:bg-gradient-dark = dark purple gradient (dark mode)
            flex items-center justify-center = center the icon inside
            shadow-soft = subtle shadow (light mode)
            dark:shadow-dark = darker shadow (dark mode) */}
        
        {/* SVG icon: inbox/mail icon (represents empty state) */}
        <svg
          className="w-8 h-8 text-primary-600 dark:text-primary-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {/* Path that draws an inbox icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      
      {/* Title: main heading */}
      <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">{title}</h3>
      
      {/* Description: optional additional text */}
      {description && (
        <p className="text-primary-600 dark:text-primary-400 text-center max-w-sm mb-6">{description}</p>
        // text-center = center the text
        // max-w-sm = maximum width (so text doesn't stretch too wide)
      )}
      
      {/* Action button: optional button to help user */}
      {action && (
        <button
          onClick={action.onClick} // Run the onClick function when clicked
          className="px-6 py-3 bg-gradient-purple text-white rounded-xl hover:opacity-90 transition-smooth shadow-baby"
          // px-6 py-3 = padding
          // bg-gradient-purple = darker purple gradient background
          // text-white = white text
          // rounded-xl = rounded corners
          // hover:opacity-90 = slightly transparent on hover
          // transition-smooth = smooth color change
          // shadow-baby = soft shadow
        >
          {action.label} {/* Display the button text */}
        </button>
      )}
    </div>
  );
};
