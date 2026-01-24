// Modal component: A popup dialog that appears on top of the page
// Used for forms, confirmations, etc. - blocks interaction with the page behind it

// "use client" directive: Tells Next.js this component needs to run in the browser (not just server)
// Needed because we're using browser APIs like document.body
"use client";

// Import React and useEffect hook
import React, { useEffect } from "react";

// ModalProps interface: Defines what properties this modal accepts
interface ModalProps {
  isOpen: boolean; // Whether the modal is currently visible
  onClose: () => void; // Function to call when user wants to close the modal
  title?: string; // Optional: title text at the top of the modal
  children: React.ReactNode; // Required: content to display inside the modal
}

// Modal component: The actual modal component
export const Modal: React.FC<ModalProps> = ({
  isOpen, // Whether modal should be visible
  onClose, // Function to close modal
  title, // Optional title
  children, // Content inside modal
}) => {
  // useEffect: Runs code when component mounts or when isOpen changes
  useEffect(() => {
    // If modal is open, prevent scrolling of the page behind it
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Hide scrollbar
    } else {
      document.body.style.overflow = "unset"; // Restore scrollbar
    }
    // Cleanup function: runs when component unmounts or before next effect
    // Ensures we always restore scrolling even if component is removed
    return () => {
      document.body.style.overflow = "unset"; // Restore scrollbar
    };
  }, [isOpen]); // Only run when isOpen changes

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Return the modal UI
  return (
    // Backdrop: dark overlay that covers the entire screen
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose} // Clicking the backdrop closes the modal
    >
      {/* fixed = position fixed (stays in place when scrolling)
          inset-0 = covers entire screen (top:0, right:0, bottom:0, left:0)
          z-50 = high z-index (appears on top of everything)
          flex items-center justify-center = center the modal content
          p-4 = padding around edges
          bg-black/40 = semi-transparent black background (40% opacity)
          backdrop-blur-sm = blur the page behind the modal */}
      
      {/* Modal content box: the actual dialog */}
      <div
        className="bg-white rounded-2xl shadow-soft-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        {/* bg-white = white background
            rounded-2xl = rounded corners
            shadow-soft-lg = large shadow
            max-w-md = maximum width (medium size)
            w-full = full width up to max
            max-h-[90vh] = maximum height (90% of viewport height)
            overflow-y-auto = scroll vertically if content is too tall
            stopPropagation = prevent click from bubbling up to backdrop */}
        
        {/* If title exists, show header with title and close button */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {/* Header row with title and close button */}
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {/* Close button (X icon) */}
            <button
              onClick={onClose} // Close modal when clicked
              className="text-gray-400 hover:text-gray-600 transition-smooth"
            >
              {/* SVG icon: X/close symbol */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" // Path that draws an X
                />
              </svg>
            </button>
          </div>
        )}
        {/* Modal body: the main content area */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
