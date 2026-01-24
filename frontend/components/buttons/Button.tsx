// Button component: A reusable button with different styles and sizes
// This makes it easy to have consistent buttons throughout the app

// Import React library (needed for all React components)
import React from "react";

// ButtonProps interface: Defines what properties this button component accepts
// extends React.ButtonHTMLAttributes means it can accept all standard HTML button attributes too
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"; // Optional: button style (dark, light, or transparent)
  size?: "sm" | "md" | "lg"; // Optional: button size (small, medium, or large)
  children: React.ReactNode; // Required: the text or content inside the button
}

// Button component: The actual button component we export
// React.FC means "React Function Component" - tells TypeScript this is a React component
export const Button: React.FC<ButtonProps> = ({
  variant = "primary", // Default to primary style if not specified
  size = "md", // Default to medium size if not specified
  className = "", // Default to empty string if no extra classes provided
  children, // The content to display inside the button
  ...props // Spread operator: capture any other props (like onClick, disabled, etc.)
}) => {
  // baseStyles: CSS classes that apply to all buttons regardless of variant/size
  const baseStyles =
    "font-medium rounded-xl transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  // font-medium = medium weight text
  // rounded-xl = rounded corners
  // transition-smooth = smooth animation when hovering/clicking
  // focus:outline-none = remove default browser outline
  // focus:ring-2 = add a ring when button is focused (keyboard navigation)
  // disabled:opacity-50 = make button semi-transparent when disabled
  // disabled:cursor-not-allowed = show "not allowed" cursor when disabled

  // variants object: Different color/styles for different button types
  const variants = {
    primary:
      "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 active:bg-gray-700",
    // primary = dark button: black background, white text, darker on hover, even darker when clicked
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300",
    // secondary = light button: light gray background, dark text, slightly darker on hover
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200",
    // ghost = transparent button: no background, gray text, light background on hover
  };

  // sizes object: Different padding and text sizes
  const sizes = {
    sm: "px-4 py-2 text-sm", // Small: less padding, smaller text
    md: "px-6 py-3 text-base", // Medium: medium padding, normal text
    lg: "px-8 py-4 text-lg", // Large: more padding, larger text
  };

  // Return the actual button element
  return (
    <button
      // Combine all the CSS classes: base styles + variant styles + size styles + any custom classes
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      // Spread props: pass through any other attributes (onClick, disabled, type, etc.)
      {...props}
    >
      {children} {/* Display the content inside the button */}
    </button>
  );
};
