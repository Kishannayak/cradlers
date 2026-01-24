# Cradlers

A modern e-commerce platform for premium kids products (ages 0-5).

## Project Structure

This project is organized into two main directories:

### `frontend/`
Next.js 14 application with React and TypeScript. Contains all UI components, pages, and frontend logic.

**Key Features:**
- Product browsing and filtering
- Shopping cart management
- OTP-based authentication
- Address management
- Order history

**Tech Stack:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)

### `backend/`
Backend API server (to be implemented). The frontend expects a REST API with endpoints for products, cart, authentication, addresses, and orders.

**See `backend/README.md` for API contract details.**

## Getting Started

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`.

### Backend Development

See `backend/README.md` for setup instructions.

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to `http://localhost:8000`)

## Documentation

- `frontend/PROJECT_STRUCTURE.md` - Detailed frontend structure guide
- `backend/README.md` - Backend API documentation

