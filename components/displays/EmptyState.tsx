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
      {/* Icon container: circular background with an icon */}
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {/* w-16 h-16 = 64px × 64px circle
            rounded-full = perfect circle
            bg-gray-100 = light gray background
            flex items-center justify-center = center the icon inside */}
        
        {/* SVG icon: inbox/mail icon (represents empty state) */}
        <svg
          className="w-8 h-8 text-gray-400"
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
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      
      {/* Description: optional additional text */}
      {description && (
        <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>
        // text-center = center the text
        // max-w-sm = maximum width (so text doesn't stretch too wide)
      )}
      
      {/* Action button: optional button to help user */}
      {action && (
        <button
          onClick={action.onClick} // Run the onClick function when clicked
          className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-smooth"
          // px-6 py-3 = padding
          // bg-gray-900 = dark background
          // text-white = white text
          // rounded-xl = rounded corners
          // hover:bg-gray-800 = slightly lighter on hover
          // transition-smooth = smooth color change
        >
          {action.label} {/* Display the button text */}
        </button>
      )}
    </div>
  );
};
