# Cradlers Project Structure Guide

This document explains the folder structure in simple, easy-to-understand terms.

## Main Folders

### `app/` - All Website Pages
This folder contains all the pages users can visit on the website.

#### `app/page.tsx`
- **What it is**: The homepage (first page users see)
- **URL**: `http://localhost:3000/`

#### `app/(shop)/` - Shopping Pages
The `(shop)` folder name is in parentheses, which means it's just for organization - it doesn't appear in the website URL.

- **`app/(shop)/products/page.tsx`**
  - **What it is**: Page showing all products
  - **URL**: `http://localhost:3000/products`
  - **What it does**: Lists products, lets users filter by age range

- **`app/(shop)/products/[id]/page.tsx`**
  - **What it is**: Page showing details for one specific product
  - **URL**: `http://localhost:3000/products/product-123` (the ID changes)
  - **What it does**: Shows product image, description, price, and "Add to Cart" button
  - **Note**: `[id]` means the product ID comes from the URL (dynamic route)

- **`app/(shop)/cart/page.tsx`**
  - **What it is**: Shopping cart page
  - **URL**: `http://localhost:3000/cart`
  - **What it does**: Shows items in cart, lets users change quantities or remove items

- **`app/(shop)/checkout/page.tsx`**
  - **What it is**: Checkout page (final step before placing order)
  - **URL**: `http://localhost:3000/checkout`
  - **What it does**: Lets user select shipping address and place order

#### `app/(auth)/` - Authentication Pages
The `(auth)` folder name is in parentheses, which means it's just for organization.

- **`app/(auth)/login/page.tsx`**
  - **What it is**: Login page
  - **URL**: `http://localhost:3000/login`
  - **What it does**: User enters phone number, receives code, enters code to log in

#### `app/account/` - User Account Pages
These pages require the user to be logged in.

- **`app/account/page.tsx`**
  - **What it is**: Account dashboard (main account page)
  - **URL**: `http://localhost:3000/account`
  - **What it does**: Shows user info and links to addresses/orders

- **`app/account/addresses/page.tsx`**
  - **What it is**: Address management page
  - **URL**: `http://localhost:3000/account/addresses`
  - **What it does**: Lets user add, edit, or delete shipping addresses

- **`app/account/orders/page.tsx`**
  - **What it is**: Order history page
  - **URL**: `http://localhost:3000/account/orders`
  - **What it does**: Shows list of all past orders

- **`app/account/orders/[id]/page.tsx`**
  - **What it is**: Order details page
  - **URL**: `http://localhost:3000/account/orders/order-123` (the ID changes)
  - **What it does**: Shows detailed information about one specific order

### `components/` - Reusable UI Pieces
These are building blocks used to build pages. Like LEGO pieces that can be reused.

#### `components/buttons/`
- **`Button.tsx`**: A reusable button component (can be styled different ways)

#### `components/cards/`
- **`Card.tsx`**: A container with rounded corners and shadow (used for product cards, content boxes)

#### `components/forms/`
- **`Input.tsx`**: A text input field with label and error message support
- **`Modal.tsx`**: A popup dialog that appears on top of the page (for forms, confirmations)

#### `components/displays/`
- **`Badge.tsx`**: A small colored label/tag (for age ranges, order status)
- **`Loading.tsx`**: A spinning circle animation (shown while data is loading)
- **`EmptyState.tsx`**: A friendly message when there's no data (empty cart, no products)

#### `components/shop/`
- **`ProductCard.tsx`**: A card that displays a product (image, name, price, age range)

#### `components/layout/`
- **`Navigation.tsx`**: The top navigation bar that appears on every page

### `lib/` - Helper Code and Data
This folder contains code that supports the pages but isn't a page itself.

#### `lib/backend/`
- **`client.ts`**: Handles all communication with the backend server
  - **What it does**: Sends requests to the backend, logs everything to console
  - **Why it helps**: Makes it easy to see what data is being sent/received

#### `lib/user-data/`
- **`api.ts`**: Defines the shape of all data (products, orders, users, etc.)
  - **What it does**: Tells TypeScript what data looks like
  - **Why it helps**: Prevents errors by ensuring data matches expected format

#### `lib/user-state/`
- **`cart-store.ts`**: Manages shopping cart data
  - **What it does**: Keeps track of items in cart, saves to browser storage
  - **Why it helps**: Cart persists even if user refreshes page

- **`auth-store.ts`**: Manages user login data
  - **What it does**: Keeps track of logged-in user, saves to browser storage
  - **Why it helps**: User stays logged in even after refreshing page

#### `lib/helpers/`
- **`cart.ts`**: Helper functions for cart calculations
  - **What it does**: Calculates cart total, formats prices as currency
  - **Why it helps**: Reusable code for price calculations

#### `lib/settings/`
- **`age-ranges.ts`**: Age range options and formatting
  - **What it does**: Defines age ranges (0-6 months, 6-12 months, etc.) and formats them
  - **Why it helps**: Keeps age range logic in one place

## File Naming Conventions

### `page.tsx`
- **Meaning**: This file creates a page that users can visit
- **Example**: `app/(shop)/products/page.tsx` creates the `/products` page

### `[id]` or `[something]`
- **Meaning**: This is a dynamic route - the value comes from the URL
- **Example**: `app/(shop)/products/[id]/page.tsx` means the product ID comes from the URL
- **URL Example**: `/products/product-123` where `product-123` is the `[id]`

### `layout.tsx`
- **Meaning**: Wraps pages with common elements (like navigation)
- **Example**: `app/layout.tsx` wraps all pages with the navigation bar

## How URLs Work

The folder structure determines the URL:

- `app/page.tsx` → `/` (homepage)
- `app/(shop)/products/page.tsx` → `/products`
- `app/(shop)/products/[id]/page.tsx` → `/products/any-id-here`
- `app/(shop)/cart/page.tsx` → `/cart`
- `app/(shop)/checkout/page.tsx` → `/checkout`
- `app/(auth)/login/page.tsx` → `/login`
- `app/account/page.tsx` → `/account`
- `app/account/addresses/page.tsx` → `/account/addresses`
- `app/account/orders/page.tsx` → `/account/orders`
- `app/account/orders/[id]/page.tsx` → `/account/orders/any-id-here`

**Important**: Folders in parentheses like `(shop)` and `(auth)` don't appear in URLs - they're just for organizing files.

## Summary

- **`app/`** = Pages users visit
- **`components/`** = Reusable UI pieces
- **`lib/`** = Helper code and data definitions
- **`(folder)`** = Organization only, doesn't affect URL
- **`[id]`** = Dynamic value from URL
- **`page.tsx`** = Creates a visitable page

