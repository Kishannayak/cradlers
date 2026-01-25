import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Baby Products E-commerce Palette - Darker with Gradient Feel
        // Primary: Deeper Lavender/Purple (darker version of GIF colors)
        primary: {
          50: "#F3EDFF",   // Lightest lavender
          100: "#D9C7F0",  // Light lavender (darker than before)
          200: "#C4A8E5",  // Medium lavender (darker pacifier color)
          300: "#AF89DA",
          400: "#9A6ACF",
          500: "#854BC4",  // Main purple (darker)
          600: "#6B3CA0",  // Darker purple
          700: "#512D7C",  // Deep purple
          800: "#371E58",  // Very dark purple
          900: "#1D0F34",  // Darkest purple
        },
        // Secondary: Deeper Peach/Pink (darker version)
        secondary: {
          50: "#FFF0EB",   // Lightest peach
          100: "#FFD9CC",  // Light peach (darker baby skin)
          200: "#FFC2AD",  // Medium peach
          300: "#FFAB8E",
          400: "#FF946F",
          500: "#FF7D50",  // Main coral (darker)
          600: "#CC643F",  // Darker coral
          700: "#994B2F",  // Deep coral
          800: "#66321F",  // Very dark coral
          900: "#33190F",  // Darkest coral
        },
        // Accent: Cream/White
        accent: {
          50: "#FFFFFF",   // Pure white
          100: "#FFF8F0",  // Cream white
          200: "#FFF1E0",  // Light cream
          300: "#FFEAD0",  // Medium cream
        },
        // Neutral: Warm, soft grays
        gray: {
          50: "#FAFAFA",   // Pure white alternative
          100: "#F5F5F5",  // Very light gray
          200: "#E5E5E5",  // Light gray
          300: "#D4D4D4",  // Medium light gray
          400: "#A3A3A3",  // Medium gray
          500: "#737373",  // Base gray
          600: "#525252",  // Dark gray
          700: "#404040",  // Darker gray
          800: "#262626",  // Very dark gray
          900: "#171717",  // Almost black
        },
        // Success: Soft green
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          500: "#22C55E",
          600: "#16A34A",
        },
        // Warning: Soft amber
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
        },
        // Error: Soft red
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#EF4444",
          600: "#DC2626",
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #D9C7F0 0%, #C4A8E5 50%, #AF89DA 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FFD9CC 0%, #FFC2AD 50%, #FFAB8E 100%)',
        'gradient-purple': 'linear-gradient(135deg, #854BC4 0%, #6B3CA0 50%, #512D7C 100%)',
        'gradient-soft': 'linear-gradient(135deg, #F3EDFF 0%, #FFF8F0 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #F3EDFF 100%)',
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "system-ui",
          "sans-serif",
        ],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(133, 75, 196, 0.15)",
        "soft-lg": "0 4px 16px rgba(133, 75, 196, 0.2)",
        "baby": "0 2px 12px rgba(133, 75, 196, 0.18)",
        "baby-lg": "0 8px 24px rgba(133, 75, 196, 0.22)",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
