// LoginPage: Two-step authentication using phone number and OTP (One-Time Password)
// Step 1: User enters phone number, receives code via SMS
// Step 2: User enters the code to verify and log in

import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

// Wrap in Suspense so useSearchParams() works during static generation (Next.js 14)
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
      <div className="bg-gradient-card dark:bg-gradient-card-dark rounded-2xl border border-primary-200 dark:border-primary-800 p-8 shadow-soft dark:shadow-dark animate-pulse min-h-[320px]" />
    </div>
  );
}
