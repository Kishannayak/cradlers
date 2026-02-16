"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/backend/client";
import { useAuthStore } from "@/lib/user-state/auth-store";
import type { Doctor, Slot } from "@/lib/user-data/api";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/forms/Input";

const BOOKING_CONFIRM_KEY = "cradlers-booking-confirmation";
const BOOKING_STATE_KEY = "cradlers-booking-state";

type Step = 1 | 2 | 3 | 4;

export default function DoctorsBookingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState<Step>(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [childName, setChildName] = useState("");
  const [childAgeMonths, setChildAgeMonths] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDoctors().then(setDoctors);
  }, []);

  useEffect(() => {
    if (step === 2 && selectedDoctor) {
      const from = new Date();
      const to = new Date();
      to.setDate(to.getDate() + 14);
      api.getDoctorAvailability(selectedDoctor.id, from.toISOString(), to.toISOString()).then(setSlots);
    }
  }, [step, selectedDoctor]);

  useEffect(() => {
    if (step === 3 && !user) {
      if (typeof sessionStorage !== "undefined" && selectedDoctor && selectedSlot) {
        sessionStorage.setItem(BOOKING_STATE_KEY, JSON.stringify({ selectedDoctor, selectedSlot }));
      }
      router.push(`/login?redirect=${encodeURIComponent("/doctors")}`);
    }
  }, [step, user, router, selectedDoctor, selectedSlot]);

  useEffect(() => {
    if (user && selectedDoctor === null && typeof sessionStorage !== "undefined") {
      const raw = sessionStorage.getItem(BOOKING_STATE_KEY);
      if (raw) {
        try {
          const { selectedDoctor: d, selectedSlot: s } = JSON.parse(raw);
          sessionStorage.removeItem(BOOKING_STATE_KEY);
          if (d && s) {
            setSelectedDoctor(d);
            setSelectedSlot(s);
            setStep(3);
            setSlots([s]);
          }
        } catch {
          sessionStorage.removeItem(BOOKING_STATE_KEY);
        }
      }
    }
  }, [user, selectedDoctor]);

  const handleSelectDoctor = (d: Doctor) => {
    setSelectedDoctor(d);
    setSelectedSlot(null);
    setStep(2);
  };

  const handleSelectSlot = (s: Slot) => {
    setSelectedSlot(s);
    setStep(3);
  };

  const handleSubmitChild = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedDoctor || !selectedSlot) return;
    const age = childAgeMonths ? parseInt(childAgeMonths, 10) : undefined;
    if (childAgeMonths && (isNaN(age!) || age! < 0 || age! > 60)) {
      setError("Please enter a valid age in months (0–60).");
      return;
    }
    setStep(4);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedSlot) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.createAppointment({
        doctor_id: selectedDoctor.id,
        slot_start: selectedSlot.start,
        slot_end: selectedSlot.end,
        child_name: childName,
        child_age_months: childAgeMonths ? parseInt(childAgeMonths, 10) : undefined,
        notes: notes || undefined,
      });
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(
          BOOKING_CONFIRM_KEY,
          JSON.stringify({
            appointment: res.appointment,
            qr_payload: res.qr_payload,
            doctor: selectedDoctor,
          })
        );
      }
      router.push("/doctors/confirmation");
    } catch {
      setError("Failed to book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ageMonths = childAgeMonths ? parseInt(childAgeMonths, 10) : undefined;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300 mb-2">Book a doctor consultation</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Choose a doctor, pick a time, and add your child&apos;s details.</p>

      {step === 1 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Choose a doctor</h2>
          <div className="space-y-3">
            {doctors.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectDoctor(d)}
                className="w-full text-left p-4 rounded-xl border border-primary-200 dark:border-primary-800 bg-white dark:bg-gray-800 hover:border-primary-400 dark:hover:border-primary-600 transition-colors"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">{d.display_name}</p>
                {d.specialty && <p className="text-sm text-gray-600 dark:text-gray-400">{d.specialty}</p>}
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">{d.consultation_price} F per consultation</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && selectedDoctor && (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <button type="button" onClick={() => setStep(1)} className="underline hover:no-underline">
              Back to doctors
            </button>
            {" · "}
            {selectedDoctor.display_name}
          </p>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Choose a time</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((s) => (
              <button
                key={`${s.start}-${s.end}`}
                type="button"
                onClick={() => handleSelectSlot(s)}
                className="p-3 rounded-lg border border-primary-200 dark:border-primary-800 bg-white dark:bg-gray-800 hover:border-primary-500 text-sm"
              >
                {new Date(s.start).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                <br />
                {new Date(s.start).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true })}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && selectedDoctor && selectedSlot && (
        <form onSubmit={handleSubmitChild}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <button type="button" onClick={() => setStep(2)} className="underline hover:no-underline">
              Back to times
            </button>
            {" · "}
            {selectedDoctor.display_name} · {new Date(selectedSlot.start).toLocaleString()}
          </p>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Child details</h2>
          <div className="space-y-4">
            <Input
              label="Child's name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
              placeholder="e.g. Emma"
            />
            <Input
              label="Age (months)"
              type="number"
              min={0}
              max={60}
              value={childAgeMonths}
              onChange={(e) => setChildAgeMonths(e.target.value)}
              placeholder="e.g. 24 for 2 years"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Child-specific needs (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes for the doctor..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="mt-6">
            Continue to confirm
          </Button>
        </form>
      )}

      {step === 4 && selectedDoctor && selectedSlot && (
        <form onSubmit={handleConfirmBooking}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Confirm booking</h2>
          <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-4 mb-4 space-y-2 text-sm">
            <p><strong>Doctor:</strong> {selectedDoctor.display_name}</p>
            <p><strong>Date & time:</strong> {new Date(selectedSlot.start).toLocaleString()}</p>
            <p><strong>Child:</strong> {childName}{ageMonths != null ? ` (${ageMonths} months)` : ""}</p>
            {notes && <p><strong>Notes:</strong> {notes}</p>}
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep(3)} disabled={loading}>
              Back
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Booking…" : "Confirm booking"}
            </Button>
          </div>
        </form>
      )}

      <p className="mt-8 text-center">
        <Link href="/" className="text-primary-600 dark:text-primary-400 hover:underline">Back to home</Link>
      </p>
    </div>
  );
}
