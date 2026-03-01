import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Kids Doctor App theme: soft sky blue, white cards, gentle accents
        theme: {
          bg: "#E8F4FC",       // Page background (soft light blue)
          "bg-subtle": "#D6EEFA", // Slightly deeper for sidebar/sections
          card: "#FFFFFF",
          accent: "#0EA5E9",   // Sky blue for buttons/active (sky-500)
          "accent-hover": "#0284C7", // Darker on hover (sky-600)
          muted: "#64748B",    // Slate-500 for secondary text
          star: "#FBBF24",     // Amber for star ratings
        },
        // Primary: Soft blue palette (replaces purple for cohesive kid-app feel)
        primary: {
          50: "#E0F2FE",   // Sky-50
          100: "#BAE6FD",  // Sky-100
          200: "#7DD3FC",  // Sky-200
          300: "#38BDF8",  // Sky-300
          400: "#0EA5E9",  // Sky-500
          500: "#0284C7",  // Sky-600
          600: "#0369A1",  // Sky-700
          700: "#075985",  // Sky-800
          800: "#0C4A6E",  // Sky-900
          900: "#082F49",  // Sky-950
        },
        // Secondary: Soft peach/warm (for cards, badges)
        secondary: {
          50: "#FFF7ED",   // Orange-50
          100: "#FFEDD5",  // Orange-100
          200: "#FED7AA",  // Orange-200
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",  // Orange-500
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        // Accent: Cream/White
        accent: {
          50: "#FFFFFF",
          100: "#FFF8F0",
          200: "#FFF1E0",
          300: "#FFEAD0",
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
        'gradient-primary': 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 50%, #0EA5E9 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 50%, #FDBA74 100%)',
        'gradient-purple': 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
        'gradient-soft': 'linear-gradient(135deg, #E0F2FE 0%, #E8F4FC 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #F8FCFF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #082F49 0%, #0C4A6E 50%, #075985 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, #0C4A6E 0%, #082F49 100%)',
        'kid-pattern': 'radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(56, 189, 248, 0.04) 0%, transparent 40%)',
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
        soft: "0 2px 8px rgba(14, 165, 233, 0.12)",
        "soft-lg": "0 4px 20px rgba(14, 165, 233, 0.15)",
        baby: "0 2px 12px rgba(14, 165, 233, 0.14)",
        "baby-lg": "0 8px 24px rgba(14, 165, 233, 0.18)",
        dark: "0 2px 8px rgba(0, 0, 0, 0.25)",
        "dark-lg": "0 4px 16px rgba(0, 0, 0, 0.35)",
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
