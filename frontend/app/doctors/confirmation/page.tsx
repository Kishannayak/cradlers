"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/buttons/Button";
import type { Appointment, Doctor } from "@/lib/user-data/api";

const BOOKING_CONFIRM_KEY = "cradlers-booking-confirmation";

type Stored = {
  appointment: Appointment;
  qr_payload: string;
  doctor: Doctor;
};

export default function DoctorsConfirmationPage() {
  const [data, setData] = useState<Stored | null>(null);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    const raw = sessionStorage.getItem(BOOKING_CONFIRM_KEY);
    if (raw) {
      try {
        setData(JSON.parse(raw) as Stored);
        sessionStorage.removeItem(BOOKING_CONFIRM_KEY);
      } catch {
        setData(null);
      }
    }
  }, []);

  if (data === null) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">No booking found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Your session may have expired. Please book again.</p>
        <Link href="/doctors">
          <Button>Book a consultation</Button>
        </Link>
      </div>
    );
  }

  const { appointment, qr_payload, doctor } = data;

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300 mb-2">Appointment confirmed</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Show this QR code at the doctor&apos;s clinic.</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-sm mb-6">
        <p className="font-medium text-gray-900 dark:text-gray-100">{doctor.display_name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {new Date(appointment.slot_start).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Child: {appointment.child_name}</p>

        <div className="mt-6 flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <QRCodeSVG value={qr_payload} size={180} level="M" />
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">Scan at clinic for check-in</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/doctors">
          <Button variant="secondary" className="w-full sm:w-auto">Book another</Button>
        </Link>
        <Link href="/">
          <Button className="w-full sm:w-auto">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
