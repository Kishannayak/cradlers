// Button component: A reusable button with different styles and sizes
// Professional design with darker colors, gradients, and dark mode support

// Import React library (needed for all React components)
import React from "react";

// ButtonProps interface: Defines what properties this button component accepts
// extends React.ButtonHTMLAttributes means it can accept all standard HTML button attributes too
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline"; // Optional: button style
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
    "font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  // font-semibold = semi-bold weight (professional)
  // rounded-xl = rounded corners
  // transition-all = smooth animation for all properties
  // duration-200 = 200ms transition
  // focus:outline-none = remove default browser outline
  // focus:ring-2 = add a ring when button is focused (keyboard navigation)
  // disabled:opacity-50 = make button semi-transparent when disabled
  // disabled:cursor-not-allowed = show "not allowed" cursor when disabled

  // variants object: Different color/styles for different button types
  const variants = {
    primary:
      "bg-gradient-purple text-white hover:opacity-90 focus:ring-primary-500 active:opacity-80 shadow-baby hover:shadow-baby-lg",
    // primary = gradient purple button: darker purple gradient, white text
    secondary:
      "bg-gradient-secondary text-primary-700 dark:text-primary-300 hover:opacity-90 focus:ring-secondary-300 active:opacity-80 border border-secondary-200 dark:border-secondary-700 shadow-soft dark:shadow-dark",
    // secondary = gradient peach button: peach gradient, purple text (adapts to dark mode)
    ghost:
      "bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:ring-primary-200 dark:focus:ring-primary-700 active:bg-primary-100 dark:active:bg-primary-900/50",
    // ghost = transparent button: no background, purple text, light purple background on hover
    outline:
      "bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-500 dark:border-primary-400 hover:bg-gradient-soft dark:hover:bg-primary-900/20 focus:ring-primary-500 dark:focus:ring-primary-400 active:bg-primary-50 dark:active:bg-primary-900/30",
    // outline = outlined button: white/dark background, purple border and text, gradient on hover
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
