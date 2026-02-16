"use client";

import { useState } from "react";
import { Button } from "@/components/buttons/Button";

export default function ScanQRPage() {
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");

  const handleMockScan = () => {
    setResult("success");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-2">Scan QR at clinic</h1>
      <p className="text-primary-600 dark:text-primary-400 mb-6">
        Use this page to scan a patient&apos;s QR code for check-in. Camera and API integration will be added when the backend is ready.
      </p>
      <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl border border-primary-200 dark:border-primary-800 p-8 text-center shadow-soft dark:shadow-dark">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm mb-4">
          Camera / scanner placeholder
        </div>
        <Button onClick={handleMockScan}>Simulate successful scan</Button>
      </div>
      {result === "success" && (
        <p className="mt-4 text-center text-green-600 dark:text-green-400 font-medium">Check-in successful (mock).</p>
      )}
    </div>
  );
}
