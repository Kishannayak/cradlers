# Cradlers Backend

This directory contains the backend API server for the Cradlers application.

## Overview

The backend API handles:
- Product management
- Shopping cart operations
- User authentication (OTP-based)
- Address management
- Order processing
- Checkout functionality

## API Endpoints

The frontend expects the following API endpoints:

### Products
- `GET /api/products` - Get list of products (with optional age range filtering)
- `GET /api/products/{id}` - Get product details

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{itemId}` - Update cart item
- `DELETE /api/cart/{itemId}` - Remove cart item

### Checkout
- `POST /api/checkout` - Process order

### Authentication
- `POST /api/auth/otp` - Request OTP code
- `POST /api/auth/otp/verify` - Verify OTP code

### Addresses
- `GET /api/account/addresses` - Get user addresses
- `POST /api/account/addresses` - Create address
- `PUT /api/account/addresses/{id}` - Update address
- `DELETE /api/account/addresses/{id}` - Delete address

### Orders
- `GET /api/account/orders` - Get user orders
- `GET /api/account/orders/{id}` - Get order details

## API Contract

See `../frontend/lib/user-data/api.ts` for TypeScript type definitions that define the expected request/response formats.

## Development

The frontend is configured to connect to `http://localhost:8000` by default (configurable via `NEXT_PUBLIC_API_URL` environment variable).

## Next Steps

1. Set up your backend framework (FastAPI, Express, etc.)
2. Implement the API endpoints according to the contract defined in `../frontend/lib/user-data/api.ts`
3. Set up database models and migrations
4. Implement authentication middleware
5. Add environment configuration

