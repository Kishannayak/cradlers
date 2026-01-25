// Card component: A reusable container with rounded corners and shadow
// Professional design with gradient effects

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
    "bg-gradient-card rounded-2xl border border-primary-200 shadow-soft transition-all duration-200 hover:shadow-soft-lg hover:border-primary-300 overflow-hidden";
  // bg-gradient-card = subtle gradient background
  // rounded-2xl = very rounded corners
  // border border-primary-200 = darker lavender border
  // shadow-soft = subtle shadow with purple tint
  // transition-all = smooth animation for all properties
  // duration-200 = 200ms transition
  // hover:shadow-soft-lg = larger shadow when hovering (makes card "lift up")
  // hover:border-primary-300 = slightly darker border on hover
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
