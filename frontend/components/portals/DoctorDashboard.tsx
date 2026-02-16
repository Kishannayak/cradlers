"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/backend/client";
import type { Doctor, Appointment, Review, DoctorStats } from "@/lib/user-data/api";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function DoctorDashboard() {
  const [profile, setProfile] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      try {
        const [profileRes, appointmentsRes, reviewsRes, statsRes] = await Promise.allSettled([
          api.getDoctorProfile(),
          api.getDoctorAppointments(),
          api.getDoctorReviews(),
          api.getDoctorStats(),
        ]);
        if (cancelled) return;

        let err: string | null = null;
        if (profileRes.status === "fulfilled") setProfile(profileRes.value);
        else err = profileRes.reason?.message ?? "Could not load profile.";
        if (appointmentsRes.status === "fulfilled") setAppointments(appointmentsRes.value);
        else if (!err) err = appointmentsRes.reason?.message ?? "Could not load appointments.";
        if (reviewsRes.status === "fulfilled") setReviews(reviewsRes.value);
        if (statsRes.status === "fulfilled") setStats(statsRes.value);
        if (err) setError(err);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <p className="text-primary-600 dark:text-primary-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error && !profile && appointments.length === 0) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">Couldn’t load dashboard</h2>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">{error}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
            • Start the backend: <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">./mvnw spring-boot:run</code> in the backend folder<br />
            • Open this page from <strong>doctor.localhost</strong> (e.g. http://doctor.localhost:3000) and log in with a doctor phone number
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const doctorName = profile?.display_name ?? "Doctor";
  const upcoming = appointments.slice(0, 6);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300">Hello {doctorName}.</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
            <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-3">Appointments</h2>
            <ul className="space-y-2">
              {upcoming.map((apt) => (
                <li key={apt.id} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>{apt.customer_name ?? apt.child_name}</span>
                  <span>{formatTime(apt.slot_start)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
            <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">Video consult appointments</h2>
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">Remaining appointments today</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{upcoming.length} scheduled</p>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
            <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-3">Reviews</h2>
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm text-primary-600 dark:text-primary-400">({reviews.length} reviews)</span>
            </div>
            <ul className="space-y-2">
              {reviews.slice(0, 5).map((r) => (
                <li key={r.id} className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>{r.patient_name}:</strong> {r.comment}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
            <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-3">Customer Graph</h2>
            <div className="h-32 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary-400 dark:bg-primary-600 rounded-t min-w-0"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">Consultations over time</p>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
            <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-3">Top Doctor Consults / Bookings Notes</h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Dr. Jeff – Allowance</li>
              <li>Dr. Harris – Manpower</li>
              <li>Dr. Ali – Baby Hospital</li>
              <li>Dr. Rock – Clean Hospital</li>
            </ul>
          </section>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
            <p className="text-sm text-primary-600 dark:text-primary-400">Total Consultation</p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{stats.total_consultations} people</p>
          </div>
          <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
            <p className="text-sm text-primary-600 dark:text-primary-400">Today&apos;s Available</p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{stats.today_available} people</p>
          </div>
          <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft dark:shadow-dark">
            <p className="text-sm text-primary-600 dark:text-primary-400">Total Value</p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{stats.total_value.toLocaleString()} F</p>
          </div>
        </div>
      )}

      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-primary-200 dark:border-primary-800 overflow-hidden shadow-soft dark:shadow-dark">
        <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 p-4 border-b border-primary-200 dark:border-primary-800">Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Time</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-t border-primary-100 dark:border-primary-800 text-gray-700 dark:text-gray-300">
                  <td className="p-3">{apt.customer_name ?? apt.child_name}</td>
                  <td className="p-3">{formatTime(apt.slot_start)}</td>
                  <td className="p-3">{new Date(apt.slot_start).toLocaleDateString()}</td>
                  <td className="p-3">{apt.status}</td>
                  <td className="p-3">{apt.price ?? 0} F</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
