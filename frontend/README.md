# Cradlers Phase 1 MVP Frontend

A premium e-commerce frontend for kids products (ages 0-5) built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Product Listing**: Age-based filtering with large, minimal product cards
- **Product Detail**: Clean product pages with add-to-cart functionality
- **Shopping Cart**: Manage items with quantity controls
- **Checkout**: Address selection and order placement
- **User Account**: OTP login, address management, and order history

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Design**: Apple-inspired minimal design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── (auth)/login/          # OTP login page
├── (shop)/
│   ├── products/          # Product listing
│   ├── products/[id]/     # Product detail
│   ├── cart/              # Shopping cart
│   └── checkout/          # Checkout flow
└── account/                # User account pages

lib/
├── backend/               # API client with logging
├── user-data/             # TypeScript types (snake_case for FastAPI)
├── user-state/            # Zustand stores
├── helpers/               # Utility functions
└── settings/              # Constants and age ranges

components/
├── buttons/               # Button components
├── cards/                 # Card components
├── forms/                 # Form components
├── displays/              # Display components (badges, loading, etc.)
├── shop/                  # Shop-specific components
└── layout/                # Layout components
```

## API Logging

All API interactions are logged to the console with:

- HTTP method
- Endpoint URL
- JSON payload

The API client sends real HTTP requests to the backend (so backend engineers can see them) but returns mock data to the frontend (so the frontend works even if the backend isn't ready).

## Design Principles

- **Minimal**: Clean, uncluttered interfaces
- **Whitespace**: Generous spacing between elements
- **Typography**: SF Pro-like font stack
- **Colors**: Neutral palette with warm undertones
- **Motion**: Smooth 150-200ms transitions
- **Premium Feel**: Subtle shadows, refined interactions

## Future Features (Phase 2)

The following features are visually present but disabled:

- Doctor consultations
- Babysitter services
- School programs
- Subscriptions

## Backend Integration

The frontend is designed to work with a FastAPI backend. All API payloads use `snake_case` to match Python/Pydantic conventions.

Update the `API_BASE_URL` in `lib/backend/client.ts` when connecting to the backend:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

## Build for Production

```bash
npm run build
npm start
```

## License

Private - Cradlers
