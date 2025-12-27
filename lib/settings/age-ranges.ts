// This file defines the age ranges we use for filtering products
// Constants are values that don't change - we define them once and reuse them

// Import AgeRange type so TypeScript knows what age ranges look like
import { AgeRange } from "@/lib/user-data/api";

// AGE_RANGES: An array of all the age range options users can filter by
// Each object has a label (what users see) and a value (the actual age range data)
export const AGE_RANGES: { label: string; value: AgeRange }[] = [
  { label: "0-6 months", value: { min_months: 0, max_months: 6 } }, // Newborn to 6 months
  { label: "6-12 months", value: { min_months: 6, max_months: 12 } }, // 6 months to 1 year
  { label: "1-2 years", value: { min_months: 12, max_months: 24 } }, // 1 year to 2 years
  { label: "2-5 years", value: { min_months: 24, max_months: 60 } }, // 2 years to 5 years
];

// formatAgeRange function: Converts age range data into a readable string
// Takes an AgeRange object and returns a user-friendly label like "0-6 months"
export const formatAgeRange = (ageRange: AgeRange): string => {
  // Destructure: pull out min_months and max_months from the ageRange object
  const { min_months, max_months } = ageRange;

  // Check for our standard age ranges and return the matching label
  if (min_months === 0 && max_months === 6) return "0-6 months";
  if (min_months === 6 && max_months === 12) return "6-12 months";
  if (min_months === 12 && max_months === 24) return "1-2 years";
  if (min_months === 24 && max_months === 60) return "2-5 years";

  // Fallback formatting: If it doesn't match our standard ranges, format it dynamically
  // If age is less than 12 months, show in months
  if (min_months < 12) {
    return `${min_months}-${max_months} months`; // Example: "3-9 months"
  }
  // If age is 12+ months, convert to years for readability
  const minYears = Math.floor(min_months / 12); // Divide by 12 and round down (e.g., 18 months = 1 year)
  const maxYears = Math.floor(max_months / 12); // Same for max
  return `${minYears}-${maxYears} years`; // Example: "2-3 years"
};
