"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/backend/client";
import { getPortalRoleFromHostname } from "@/lib/user-data/api";
import type { User } from "@/lib/user-data/api";
import { useAuthStore } from "@/lib/user-state/auth-store";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/forms/Input";
import { BabyLoader } from "@/components/displays/BabyLoader";
import { getPhonePlaceholder } from "@/lib/helpers/phone-placeholder";

const DEV_USER_PHONE = "+15550000000";

function getDevUser(role?: "ADMIN" | "VENDOR" | "DOCTOR" | null): User {
  return {
    id: "dev-user-id",
    phone: DEV_USER_PHONE,
    role: role ?? null,
    addresses: [],
    created_at: new Date().toISOString(),
  };
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const setUser = useAuthStore((state) => state.setUser);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [displayedOtp, setDisplayedOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDevLogin = () => {
    const portal = typeof window !== "undefined" ? getPortalRoleFromHostname(window.location.hostname) : undefined;
    const role = portal === "admin" ? "ADMIN" : portal === "vendor" ? "VENDOR" : portal === "doctor" ? "DOCTOR" : null;
    const user = getDevUser(role ?? undefined);
    const token = "dev-token-no-otp";
    setUser(user, token);
    const port = typeof window !== "undefined" ? window.location.port || "3000" : "3000";
    if (portal === "admin") {
      window.location.href = `http://admin.localhost:${port}/`;
      return;
    }
    if (portal === "vendor") {
      window.location.href = `http://vendor.localhost:${port}/`;
      return;
    }
    if (portal === "doctor") {
      window.location.href = `http://doctor.localhost:${port}/`;
      return;
    }
    router.push(redirect);
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDisplayedOtp(null);
    setLoading(true);
    try {
      const res = await api.requestOTP({ phone });
      setDisplayedOtp(res.otp ?? null);
      setStep("otp");
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const portalRole =
        typeof window !== "undefined" ? getPortalRoleFromHostname(window.location.hostname) : undefined;
      const response = await api.verifyOTP({ phone, otp, role: portalRole });
      setUser(response.user, response.token);
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
      if (role === "DOCTOR") {
        window.location.href = `http://doctor.localhost:${port}/${authHash}`;
        return;
      }
      router.push(redirect);
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {step === "phone"
            ? "Enter your phone number to continue"
            : "Enter the OTP sent to your phone"}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800/95 rounded-3xl border border-primary-100 dark:border-primary-800 p-8 shadow-soft dark:shadow-dark space-y-6">
        {/* One-click dev login only in development */}
        {process.env.NODE_ENV === "development" && (
          <>
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={handleDevLogin}
            >
              Login
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary-200 dark:border-primary-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-800 px-2 text-primary-500 dark:text-primary-400">or use OTP</span>
              </div>
            </div>
          </>
        )}
        {step === "phone" ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={getPhonePlaceholder()}
              required
              disabled={loading}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || !phone}
            >
              {loading ? <BabyLoader size="sm" /> : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {displayedOtp && (
              <div className="rounded-2xl bg-primary-50 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-700 p-4 text-center">
                <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">Your OTP</p>
                <p className="text-2xl font-bold tracking-widest text-primary-700 dark:text-primary-300">{displayedOtp}</p>
                <p className="text-xs text-primary-500 dark:text-primary-500 mt-1">Enter it below to verify</p>
              </div>
            )}
            <Input
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              disabled={loading}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setDisplayedOtp(null);
                  setError("");
                }}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={loading || otp.length !== 6}
              >
                {loading ? <BabyLoader size="sm" /> : "Verify"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
