// This file defines the shape of data that flows between frontend and backend
// TypeScript types matching FastAPI/Pydantic schemas
// All properties use snake_case to align with Python backend (Python uses snake_case, JavaScript uses camelCase)

// Product interface: Defines what a product looks like in our system
export interface Product {
  id: string; // Unique identifier for the product, like a barcode number
  name: string; // The product's display name, e.g., "Premium Baby Stroller"
  description: string; // Detailed information about what the product is and its features
  price: number; // How much the product costs in dollars (stored as a number, not text)
  age_range: AgeRange; // Which age group this product is suitable for (see AgeRange below)
  images: string[]; // Array of image URLs - can have multiple photos of the product
  category: string; // What type of product it is, e.g., "toys", "clothing", "furniture"
  in_stock: boolean; // True if we have it available, false if sold out
  created_at: string; // When this product was added to our system (ISO date format)
}

// AgeRange interface: Defines the age range a product is suitable for
export interface AgeRange {
  min_months: number; // Minimum age in months (0 means newborn)
  max_months: number; // Maximum age in months (60 = 5 years old)
}

// CartItem interface: Represents an item that a user has added to their shopping cart
export interface CartItem {
  id: string; // Unique ID for this specific cart item (different from product ID)
  product_id: string; // Links back to which product this is
  product: Product; // The full product information (so we can show name, price, image)
  quantity: number; // How many of this item the user wants to buy
  variant?: string; // Optional: if product comes in different colors/sizes, which one
  created_at: string; // When this item was added to the cart
}

// User interface: Stores information about a logged-in user
export interface User {
  id: string; // Unique user identifier
  phone: string; // User's phone number (used for login via OTP)
  email?: string; // Optional email address (the ? means it might not exist)
  addresses: Address[]; // List of shipping addresses the user has saved
  created_at: string; // When the user account was created
}

// Address interface: A shipping address that belongs to a user
export interface Address {
  id: string; // Unique identifier for this address
  street: string; // Street address, e.g., "123 Main Street"
  city: string; // City name
  state: string; // State abbreviation, e.g., "CA" for California
  zip: string; // ZIP/postal code
  is_default: boolean; // True if this is the user's primary/default shipping address
  created_at: string; // When this address was added
}

// Order interface: Represents a completed purchase
export interface Order {
  id: string; // Unique order number (like a receipt number)
  items: OrderItem[]; // List of products that were purchased in this order
  total: number; // Total amount paid for this order
  status: OrderStatus; // Current status: pending, confirmed, shipped, delivered, or cancelled
  shipping_address: Address; // Where the order should be delivered
  created_at: string; // When the order was placed
}

// OrderItem interface: A single product within an order (simpler than CartItem)
export interface OrderItem {
  id: string; // Unique ID for this order item
  product_id: string; // Which product was ordered
  product_name: string; // Product name (stored here so we don't need full product data)
  quantity: number; // How many were ordered
  price: number; // Price per item at time of purchase (prices might change later)
}

// OrderStatus type: Defines the possible states an order can be in
// This is a union type - order status can ONLY be one of these exact strings
export type OrderStatus =
  | "pending" // Order was just placed, waiting for confirmation
  | "confirmed" // Order is confirmed and being prepared
  | "shipped" // Order has been sent out for delivery
  | "delivered" // Order has arrived at customer's address
  | "cancelled"; // Order was cancelled

// Request/Response types for API endpoints
// These define what data we send TO the backend and what we get BACK

// GetProductsRequest: What we send when asking for a list of products
export interface GetProductsRequest {
  age_range?: AgeRange; // Optional filter: only show products for this age range
  category?: string; // Optional filter: only show products in this category
  limit?: number; // Optional: maximum number of products to return
  offset?: number; // Optional: skip this many products (for pagination)
}

// GetProductsResponse: What the backend sends back with a list of products
export interface GetProductsResponse {
  products: Product[]; // Array of product objects
  total: number; // Total number of products available (before pagination)
}

// GetProductResponse: Response when asking for a single product's details
export interface GetProductResponse {
  product: Product; // The full product information
}

// GetCartResponse: What we get back when asking for the user's cart
export interface GetCartResponse {
  items: CartItem[]; // All items currently in the cart
  subtotal: number; // Total price of all items before taxes/shipping
}

// AddToCartRequest: What we send when adding a product to the cart
export interface AddToCartRequest {
  product_id: string; // Which product to add
  quantity: number; // How many to add
  variant?: string; // Optional: which variant (color, size, etc.)
}

// UpdateCartItemRequest: What we send when changing quantity of a cart item
export interface UpdateCartItemRequest {
  quantity: number; // New quantity (replaces the old quantity)
}

// CheckoutRequest: What we send when the user wants to place an order
export interface CheckoutRequest {
  shipping_address_id: string; // Which saved address to ship to
  payment_method: string; // How they're paying (e.g., "card", "paypal")
}

// CheckoutResponse: What we get back after placing an order
export interface CheckoutResponse {
  order: Order; // The newly created order with all its details
}

// OTPLoginRequest: What we send when requesting a login code
export interface OTPLoginRequest {
  phone: string; // User's phone number to send the code to
}

// OTPVerifyRequest: What we send when user enters the code they received
export interface OTPVerifyRequest {
  phone: string; // Same phone number from the request
  otp: string; // The code the user received (One-Time Password)
}

// OTPVerifyResponse: What we get back if the code is correct
export interface OTPVerifyResponse {
  user: User; // The logged-in user's information
  token: string; // Authentication token (like a temporary password) to prove they're logged in
}

// CreateAddressRequest: What we send when adding a new shipping address
export interface CreateAddressRequest {
  street: string; // Street address
  city: string; // City
  state: string; // State
  zip: string; // ZIP code
  is_default?: boolean; // Optional: set this as the default address
}

// UpdateAddressRequest: What we send when editing an existing address
// All fields are optional because we might only change one thing
export interface UpdateAddressRequest {
  street?: string; // Optional: new street address
  city?: string; // Optional: new city
  state?: string; // Optional: new state
  zip?: string; // Optional: new ZIP code
  is_default?: boolean; // Optional: change whether it's the default
}

// GetOrdersResponse: What we get back when asking for user's order history
export interface GetOrdersResponse {
  orders: Order[]; // Array of all past orders
  total: number; // Total number of orders (useful for pagination)
}
