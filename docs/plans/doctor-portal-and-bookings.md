# Doctor Portal and Appointment Booking (Phase 2)

**Order:** Frontend first (types + mock API), then backend; integrate by swapping mocks for real `sendApiRequest` in the client so the UI stays unchanged.

## Current state

- **Portals**: Shop (localhost), Admin (admin.localhost), Vendor (vendor.localhost). Portal resolved in [lib/portal/server.ts](../frontend/lib/portal/server.ts) and [lib/portal/context.tsx](../frontend/lib/portal/context.tsx); shell in [PortalShell.tsx](../frontend/components/layout/PortalShell.tsx).
- **Auth**: Backend [User](../backend/src/main/java/com/cradlers/model/User.java) has `role` (ADMIN, VENDOR; null = customer). [AuthService](../backend/src/main/java/com/cradlers/service/AuthService.java) normalizes role and supports bootstrap admin/vendor phones. Login handoff for admin/vendor subdomains exists in [AuthHandoffHandler](../frontend/components/auth/AuthHandoffHandler.tsx) and [LoginForm](../frontend/app/(auth)/login/LoginForm.tsx).
- **Backend**: No appointments, doctors, email, or QR today. API is JWT-authenticated; CORS uses `cors.allowed-origins` in [application.properties](../backend/src/main/resources/application.properties) (add doctor origin).

---

## Architecture (high level)

- **Customer**: On shop, browse/select doctor, pick slot, enter child details and optional notes → create appointment → backend sends confirmation email and returns (or stores) QR payload → user sees confirmation page and can download/print QR.
- **Doctor**: Logs in at doctor.localhost (DOCTOR role), sees dashboard; clinic scans QR to validate/check-in appointment (optional: mark as checked-in via API).

---

## 1. Backend (reference – implement in Phase B)

- **User**: Add role `DOCTOR`; Doctor profile and Appointment models; availability/slots; APIs: `GET /api/doctors`, `GET /api/doctors/:id/availability`, `POST /api/appointments`; doctor-only: `GET /api/doctor/me`, `GET /api/doctor/appointments`, `GET /api/doctor/stats`, `GET /api/doctor/reviews`, `PUT /api/doctor/appointments/:id`, scan endpoint. Email + QR (e.g. ZXing) on appointment create. CORS: add doctor origin.

---

## 2. Frontend – Doctor portal (doctor.localhost)

- **Portal type**: Add `"doctor"` to portal context and server; DoctorLayout with sidebar (Hello Dr. [Name], Overview, Appointments, Edit Appointment, Reviews, Q&A, Log out); PortalShell and PortalHome render DoctorLayout and DoctorDashboard when portal is doctor. Auth handoff for DOCTOR → doctor.localhost; `getPortalRoleFromHostname("doctor")` for doctor.localhost.
- **Doctor dashboard (Overview)**: Greeting, upcoming appointments list, remaining/video consult card, reviews card, customer growth graph, top consults/notes card, KPI row (Total Consultation, Today’s Available, Total Value), appointments table. Use mock data from API client.

---

## 3. Frontend – Customer booking (shop)

- Link “Doctor Consultations” on home to `/doctors` (or `/book-consultation`). Flow: choose doctor → choose slot → child + notes form (require login) → submit → confirmation page with QR (client-side from `qrPayload`). API client: mocks first, then `sendApiRequest`.

---

## 4. QR scan at clinic (doctor side)

- Doctor portal “Scan QR” page: browser QR scanner → `POST /api/doctor/appointments/scan` with payload; backend marks CHECKED_IN.

---

## 5. Implementation order: frontend first, then backend

Do **all frontend work first** using types and mock API responses. Integrate later by swapping mocks for `sendApiRequest` in the client.

### Phase A – Frontend (mocks)

1. **Types and API client (mocks)**  
   - Add Doctor, Appointment, Slot, Review (and related DTOs) to [lib/user-data/api.ts](../frontend/lib/user-data/api.ts), matching the planned backend contract.  
   - In [lib/backend/client.ts](../frontend/lib/backend/client.ts), add: `getDoctors()`, `getDoctorAvailability(doctorId, from, to)`, `createAppointment(payload)`, `getDoctorProfile()`, `getDoctorAppointments()`, `getDoctorStats()`, `getDoctorReviews()`. Each returns **mock data** only (no `sendApiRequest` yet).  
   - Document the expected request/response shape so the backend can be implemented to match.

2. **Doctor portal wiring**  
   - Add `"doctor"` to portal context and server; DoctorLayout with sidebar (Hello Dr. [Name], Overview, Appointments, Edit Appointment, Reviews, Q&A, Log out); PortalShell and PortalHome rendering doctor layout and DoctorDashboard when portal is doctor.  
   - Auth handoff for DOCTOR role (redirect to doctor.localhost) and `getPortalRoleFromHostname("doctor")` for doctor.localhost.

3. **Doctor dashboard (Overview)**  
   - Build full dashboard from sketch using mock data: greeting, upcoming appointments list, remaining/video consult card, reviews card, customer growth graph (placeholder or Recharts + mock series), top consults/notes card, KPI row, appointments table.  
   - Optional: placeholder pages for Appointments, Edit Appointment, Reviews, Q&A.

4. **Customer booking flow (shop)**  
   - Link “Doctor Consultations” on home to `/doctors` (or `/book-consultation`).  
   - Multi-step flow: choose doctor (mock `getDoctors`) → choose slot (mock `getDoctorAvailability`) → child + notes form (require login with return URL) → submit (mock `createAppointment` returns success + fake `qrPayload`).  
   - Confirmation page: appointment details and QR code (generate client-side from `qrPayload` with a small QR library).

5. **Doctor portal: Scan QR page (optional in Phase A)**  
   - Page that will call “scan” API; for now use mock success so layout and flow are in place.

### Phase B – Backend and integration

6. **Backend: models, roles, and public/booking APIs**  
   - User role DOCTOR + bootstrap; Doctor profile and Appointment (and optionally DoctorAvailability/slots) models and repos; `GET /api/doctors`, `GET /api/doctors/:id/availability`, `POST /api/appointments` (QR payload generation, stub then real email).  
   - CORS: add doctor origin.

7. **Backend: email and QR**  
   - Email service (SMTP or provider); send confirmation on appointment create; QR image generation (e.g. ZXing), attach or link in email.

8. **Backend: doctor-only APIs**  
   - `GET /api/doctor/me`, `GET /api/doctor/appointments`, `GET /api/doctor/stats`, `GET /api/doctor/reviews`, `PUT /api/doctor/appointments/:id`, and scan endpoint. Secure with JWT + DOCTOR role.

9. **Frontend: switch to real API**  
   - In [lib/backend/client.ts](../frontend/lib/backend/client.ts), replace mock implementations with `sendApiRequest` (and JWT where required). No UI or route changes if types and shapes match.

10. **Optional later**: Reviews entity/API, Edit Appointment (reschedule/cancel), Q&A, analytics endpoint for graph.

---

## 6. Files to add or touch (summary)

- **Portal**: `context.tsx`, `server.ts`, `PortalShell.tsx`, `PortalHome.tsx`, `api.ts` (getPortalRoleFromHostname), `AuthHandoffHandler.tsx`, `LoginForm.tsx`
- **Doctor UI**: New: `DoctorLayout.tsx`, `DoctorDashboard.tsx`, `(doctor)/appointments/page.tsx`, etc.
- **Shop booking**: New: `app/(shop)/doctors/page.tsx` (or `/book-consultation`), booking steps, confirmation page with QR
- **Backend**: New: `Doctor.java`, `Appointment.java`, DoctorAvailability/slot logic, repos, DoctorController, AppointmentController, email service, QR service; AuthService + User role; SecurityConfig CORS
- **API client**: `api.ts` (types), `client.ts` (doctor + appointment methods; mocks first, then `sendApiRequest`)

No change to existing vendor or admin flows beyond adding the doctor portal and shared CORS.
