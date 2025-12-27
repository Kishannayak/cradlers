// Card component: A reusable container with rounded corners and shadow
// Used for product cards, content boxes, etc. - gives a clean, modern look

// Import React library
import React from "react";
// Import Next.js Link component for client-side navigation (faster than regular links)
import Link from "next/link";

// CardProps interface: Defines what properties this card component accepts
interface CardProps {
  children: React.ReactNode; // Required: content to display inside the card
  href?: string; // Optional: if provided, the card becomes a clickable link
  className?: string; // Optional: extra CSS classes to add
  onClick?: () => void; // Optional: function to run when card is clicked
}

// Card component: The actual card component
export const Card: React.FC<CardProps> = ({
  children, // Content inside the card
  href, // Optional link URL
  className = "", // Default to empty string if no extra classes
  onClick, // Optional click handler
}) => {
  // baseStyles: CSS classes that all cards have
  const baseStyles =
    "bg-white rounded-2xl border border-gray-200 shadow-soft transition-smooth hover:shadow-soft-lg overflow-hidden";
  // bg-white = white background
  // rounded-2xl = very rounded corners
  // border border-gray-200 = light gray border
  // shadow-soft = subtle shadow
  // transition-smooth = smooth animation
  // hover:shadow-soft-lg = larger shadow when hovering (makes card "lift up")
  // overflow-hidden = hide content that goes outside the card

  // Create the card content (a div with the styles)
  const content = (
    <div className={`${baseStyles} ${className}`} onClick={onClick}>
      {children} {/* Display the content */}
    </div>
  );

  // If href is provided, wrap the card in a Link (makes it clickable and navigates)
  if (href) {
    return (
      <Link href={href} className="block">
        {content} {/* The card content inside the link */}
      </Link>
    );
  }

  // If no href, just return the card content as-is
  return content;
};
