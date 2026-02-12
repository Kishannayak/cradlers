// Input component: A styled text input field with label and error message support
// Makes all text inputs look consistent throughout the app - with dark mode support

// Import React library
import React from "react";

// InputProps interface: Defines what properties this input accepts
// extends React.InputHTMLAttributes means it can accept all standard HTML input attributes
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional: text label above the input
  error?: string; // Optional: error message to display below the input
}

// Input component: The actual input component
export const Input: React.FC<InputProps> = ({
  label, // Optional label text
  error, // Optional error message
  className = "", // Default to empty string for extra classes
  ...props // Spread operator: capture all other input props (type, placeholder, value, onChange, etc.)
}) => {
  return (
    <div className="w-full">
      {/* If label exists, show it above the input */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {/* Display the label text */}
        </label>
      )}
      {/* The actual input field */}
      <input
        className={`
          w-full px-4 py-3 rounded-xl border transition-smooth
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
          ${error ? "border-red-300 dark:border-red-600 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}
          ${className}
        `}
        // w-full = full width
        // px-4 py-3 = padding inside the input
        // rounded-xl = rounded corners
        // border = border around input
        // bg-white dark:bg-gray-800 = white background (light mode), dark gray (dark mode)
        // text-gray-900 dark:text-gray-100 = dark text (light mode), light text (dark mode)
        // transition-smooth = smooth animation
        // focus:outline-none = remove default browser outline
        // focus:ring-2 = add ring when focused
        // focus:ring-primary-500 = purple ring color when focused (light mode)
        // dark:focus:ring-primary-400 = lighter purple ring (dark mode)
        // focus:border-transparent = hide border when focused (ring replaces it)
        // disabled:bg-gray-100 = light gray background when disabled (light mode)
        // dark:disabled:bg-gray-700 = darker gray background when disabled (dark mode)
        // disabled:cursor-not-allowed = show "not allowed" cursor when disabled
        // If error exists, use red border and red focus ring, otherwise use gray
        // Spread all other props (type, placeholder, value, onChange, etc.)
        {...props}
      />
      {/* If error message exists, display it below the input in red */}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
