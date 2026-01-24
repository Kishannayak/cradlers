// Input component: A styled text input field with label and error message support
// Makes all text inputs look consistent throughout the app

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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {/* Display the label text */}
        </label>
      )}
      {/* The actual input field */}
      <input
        className={`
          w-full px-4 py-3 rounded-xl border transition-smooth
          focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? "border-red-300 focus:ring-red-500" : "border-gray-300"}
          ${className}
        `}
        // w-full = full width
        // px-4 py-3 = padding inside the input
        // rounded-xl = rounded corners
        // border = border around input
        // transition-smooth = smooth animation
        // focus:outline-none = remove default browser outline
        // focus:ring-2 = add ring when focused
        // focus:ring-gray-900 = dark ring color when focused
        // focus:border-transparent = hide border when focused (ring replaces it)
        // disabled:bg-gray-100 = light gray background when disabled
        // disabled:cursor-not-allowed = show "not allowed" cursor when disabled
        // If error exists, use red border and red focus ring, otherwise use gray
        // Spread all other props (type, placeholder, value, onChange, etc.)
        {...props}
      />
      {/* If error message exists, display it below the input in red */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
