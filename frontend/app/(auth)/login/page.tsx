// LoginPage: Two-step authentication using phone number and OTP (One-Time Password)
// Step 1: User enters phone number, receives code via SMS
// Step 2: User enters the code to verify and log in

// "use client" directive: This component needs to run in the browser
"use client";

// Import React hooks
import { useState, useEffect } from "react";
// Import Next.js hooks for navigation and URL parameters
import { useRouter, useSearchParams } from "next/navigation";
// Import API client to request and verify OTP
import { api } from "@/lib/backend/client";
// Import portal role from hostname (admin.localhost -> admin, vendor.localhost -> vendor)
import { getPortalRoleFromHostname } from "@/lib/user-data/api";
// Import auth store to save user data after login
import { useAuthStore } from "@/lib/user-state/auth-store";
// Import UI components
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/forms/Input";
import { BabyLoader } from "@/components/displays/BabyLoader";
// Region-aware phone placeholder (e.g. +91 for India, +1 for US)
import { getPhonePlaceholder } from "@/lib/helpers/phone-placeholder";

// LoginPage component: The login page
export default function LoginPage() {
  // Get router for navigation
  const router = useRouter();
  // Get URL search parameters (for redirect after login)
  const searchParams = useSearchParams();
  // Get redirect URL from query string, or default to account page
  const redirect = searchParams.get("redirect") || "/account";
  // Get function to save user data after successful login
  const setUser = useAuthStore((state) => state.setUser);
  // State: Which step of login we're on ("phone" or "otp")
  const [step, setStep] = useState<"phone" | "otp">("phone");
  // State: Phone number user entered
  const [phone, setPhone] = useState("");
  // State: OTP code user entered
  const [otp, setOtp] = useState("");
  // State: Whether we're currently processing (shows loading spinner)
  const [loading, setLoading] = useState(false);
  // State: Error message to display (if login fails)
  const [error, setError] = useState("");

  // handleRequestOTP function: Sends OTP code to user's phone
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from submitting normally (page refresh)
    setError(""); // Clear any previous errors
    setLoading(true); // Show loading spinner

    try {
      // Call API to send OTP code to phone number
      await api.requestOTP({ phone });
      // If successful, move to OTP verification step
      setStep("otp");
    } catch (err) {
      // If sending fails, show error message
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false); // Always hide loading spinner
    }
  };

  // handleVerifyOTP function: Verifies the OTP code and logs user in
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setError(""); // Clear any previous errors
    setLoading(true); // Show loading spinner

    try {
      // Role from hostname: admin.localhost -> admin, vendor.localhost -> vendor (for new user creation)
      const portalRole =
        typeof window !== "undefined" ? getPortalRoleFromHostname(window.location.hostname) : undefined;
      // Call API to verify the OTP code (include role so backend assigns it for new users)
      const response = await api.verifyOTP({ phone, otp, role: portalRole });
      // If code is correct, save user data and token
      setUser(response.user, response.token);
      // Redirect based on role: ADMIN → admin portal, VENDOR → vendor portal, else requested path
      // Pass auth in hash so admin/vendor subdomain can restore it (localStorage is not shared)
      const role = response.user.role;
      const port = typeof window !== "undefined" ? window.location.port || "3000" : "3000";
      const authHash = `#auth_handoff=${encodeURIComponent(JSON.stringify({ token: response.token, user: response.user }))}`;
      if (role === "ADMIN") {
        window.location.href = `http://admin.localhost:${port}/${authHash}`;
        return;
      }
      if (role === "VENDOR") {
        window.location.href = `http://vendor.localhost:${port}/${authHash}`;
        return;
      }
      router.push(redirect);
    } catch (err) {
      // If verification fails, show error message
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false); // Always hide loading spinner
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      {/* max-w-md = maximum width (medium size)
          mx-auto = center horizontally
          px-6 = horizontal padding
          py-24 = vertical padding */}

      {/* Page header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {/* Conditional text based on current step */}
          {step === "phone"
            ? "Enter your phone number to continue"
            : "Enter the OTP sent to your phone"}
        </p>
      </div>

      {/* Login form card */}
      <div className="bg-gradient-card dark:bg-gradient-card-dark rounded-2xl border border-primary-200 dark:border-primary-800 p-8 shadow-soft dark:shadow-dark">
        {/* Conditional rendering: show phone form or OTP form */}
        {step === "phone" ? (
          // Step 1: Phone number form
          <form onSubmit={handleRequestOTP} className="space-y-6">
            {/* space-y-6 = vertical spacing between form elements */}

            {/* Phone number input */}
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={getPhonePlaceholder()}
              required
              disabled={loading} // Disable while processing
            />

            {/* Error message: shown if request fails */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Submit button: sends OTP */}
            <Button
              type="submit" // Form submit button
              size="lg" // Large button
              className="w-full" // Full width
              disabled={loading || !phone}
              // Disable if loading or phone number is empty
            >
              {loading ? <BabyLoader size="sm" /> : "Send OTP"}
              {/* Show spinner while loading, "Send OTP" otherwise */}
            </Button>
          </form>
        ) : (
          // Step 2: OTP verification form
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP code input */}
            <Input
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={
                (e) =>
                  // Only allow digits, limit to 6 characters
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                // replace(/\D/g, "") = remove all non-digit characters
                // slice(0, 6) = limit to first 6 characters
              }
              placeholder="000000"
              maxLength={6} // HTML5 max length validation
              required // Field must be filled
              disabled={loading} // Disable while processing
            />

            {/* Error message: shown if verification fails */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Action buttons: Back and Verify */}
            <div className="flex gap-3">
              {/* flex = flexbox layout
                  gap-3 = space between buttons */}

              {/* Back button: returns to phone step */}
              <Button
                type="button" // Regular button (not form submit)
                variant="secondary" // Light button style
                className="flex-1" // Takes half the width
                onClick={() => {
                  setStep("phone"); // Go back to phone step
                  setOtp(""); // Clear OTP input
                  setError(""); // Clear any errors
                }}
                disabled={loading} // Disable while processing
              >
                Back
              </Button>

              {/* Verify button: checks OTP code */}
              <Button
                type="submit" // Form submit button
                size="lg" // Large button
                className="flex-1" // Takes half the width
                disabled={loading || otp.length !== 6}
                // Disable if loading or OTP is not 6 digits
              >
                {loading ? <BabyLoader size="sm" /> : "Verify"}
                {/* Show spinner while loading, "Verify" otherwise */}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
