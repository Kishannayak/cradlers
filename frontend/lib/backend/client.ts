// This file handles all communication with the backend API
// It logs every request so developers can see what's being sent
// Sends actual HTTP requests to backend (so backend engineer can see them)
// But returns mock data to frontend (so frontend works even if backend isn't ready)

// Import all the type definitions we need from the types file
import {
  GetProductsRequest,
  GetProductsResponse,
  GetProductResponse,
  GetCartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  CheckoutRequest,
  CheckoutResponse,
  OTPLoginRequest,
  OTPVerifyRequest,
  OTPVerifyResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
  GetOrdersResponse,
  Address,
  Product,
  CartItem,
  Order,
  Doctor,
  Slot,
  Appointment,
  Review,
  DoctorStats,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
} from "@/lib/user-data/api";

// API_BASE_URL: The address where our backend server lives
// process.env.NEXT_PUBLIC_API_URL checks if we set a custom URL in environment variables
// If not set, defaults to localhost:8000 (where FastAPI typically runs)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ApiRequestOptions interface: Defines what information we need to log about each API request
interface ApiRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE"; // HTTP method: GET = read, POST = create, PUT = update, DELETE = remove
  endpoint: string; // The API path, e.g., "/api/products" or "/api/cart"
  payload?: unknown; // Optional: data we're sending to the server (for POST/PUT requests)
  queryParams?: Record<string, string | number | undefined>; // Optional: URL parameters like ?age=6&category=toys
}

// getAuthToken function: Gets the authentication token from localStorage
// This token is needed for authenticated requests (cart, addresses, orders)
function getAuthToken(): string | null {
  try {
    // Try to read the auth store from localStorage
    const authData = localStorage.getItem("cradlers-auth");
    if (authData) {
      // Parse the stored JSON data
      const parsed = JSON.parse(authData);
      // Return the token if it exists
      return parsed.state?.token || null;
    }
  } catch (error) {
    // If anything goes wrong (no localStorage, invalid JSON, etc.), return null
    // This is fine - some requests don't need authentication
  }
  return null;
}

// sendApiRequest function: Sends actual HTTP request to backend and returns response
async function sendApiRequest<T = unknown>(options: ApiRequestOptions): Promise<T> {
  // Destructure: pull out the individual values from the options object
  const { method, endpoint, payload, queryParams } = options;

  // Start building the full URL by combining base URL with endpoint
  let fullUrl = `${API_BASE_URL}${endpoint}`;

  // If we have query parameters (like ?min_months=0&max_months=6), add them to the URL
  if (queryParams) {
    // URLSearchParams is a built-in tool that formats query strings correctly
    const params = new URLSearchParams();
    // Loop through each key-value pair in queryParams
    Object.entries(queryParams).forEach(([key, value]) => {
      // Only add parameters that have a value (skip undefined ones)
      if (value !== undefined) {
        // Convert value to string and add it to the params
        params.append(key, String(value));
      }
    });
    // Convert params object into a query string like "?min_months=0&max_months=6"
    const queryString = params.toString();
    // If we have any parameters, append them to the URL
    if (queryString) {
      fullUrl += `?${queryString}`;
    }
  }

  // Prepare headers for the HTTP request
  const headers: HeadersInit = {
    "Content-Type": "application/json", // Tell server we're sending JSON
  };

  // Get authentication token if available
  const token = getAuthToken();
  if (token) {
    // Add authorization header if user is logged in
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Prepare the fetch options
  const fetchOptions: RequestInit = {
    method, // GET, POST, PUT, DELETE
    headers, // Include content type and auth token
  };

  // If we have a payload (for POST/PUT requests), add it to the request body
  if (payload) {
    fetchOptions.body = JSON.stringify(payload); // Convert object to JSON string
  }

  // Send the request and wait for response
  let response: Response;
  try {
    response = await fetch(fullUrl, fetchOptions);
  } catch (e) {
    const msg =
      e instanceof TypeError && (e.message === "Failed to fetch" || e.message?.includes("fetch"))
        ? `Cannot reach the API at ${fullUrl}. Make sure the backend is running (e.g. \`./mvnw spring-boot:run\` in the backend folder).`
        : e instanceof Error
          ? e.message
          : "Network request failed.";
    throw new Error(msg);
  }

  // If response is not ok, throw an error
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  // For requests that don't return data (like DELETE), return void
  if (response.status === 204 || method === "DELETE") {
    return undefined as T;
  }

  // Parse and return JSON response
  return response.json() as Promise<T>;
}

// logApiRequest function: Prints API request details to the browser console
// This helps developers debug and see exactly what data is being sent to the backend
async function logApiRequest(options: ApiRequestOptions): Promise<void> {
  // Destructure: pull out the individual values from the options object
  const { method, endpoint, payload, queryParams } = options;

  // Start building the full URL by combining base URL with endpoint
  let fullUrl = `${API_BASE_URL}${endpoint}`;

  // If we have query parameters (like ?min_months=0&max_months=6), add them to the URL
  if (queryParams) {
    // URLSearchParams is a built-in tool that formats query strings correctly
    const params = new URLSearchParams();
    // Loop through each key-value pair in queryParams
    Object.entries(queryParams).forEach(([key, value]) => {
      // Only add parameters that have a value (skip undefined ones)
      if (value !== undefined) {
        // Convert value to string and add it to the params
        params.append(key, String(value));
      }
    });
    // Convert params object into a query string like "?min_months=0&max_months=6"
    const queryString = params.toString();
    // If we have any parameters, append them to the URL
    if (queryString) {
      fullUrl += `?${queryString}`;
    }
  }

  // Print a visual separator line to make console logs easier to read
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📡 API Request"); // Emoji makes it easy to spot in console
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Method:", method); // Shows GET, POST, PUT, or DELETE
  console.log("Endpoint:", fullUrl); // Shows the complete URL
  // If we're sending data (payload), print it in a readable JSON format
  if (payload) {
    // JSON.stringify with null and 2 makes it pretty-printed (indented)
    console.log("Payload:", JSON.stringify(payload, null, 2));
  }
  // Close the separator
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// Mock data generators
// generateMockProduct: Creates fake product data for development/testing
// This lets us build the frontend without needing a real backend running
function generateMockProduct(id: string): Product {
  // Array of possible age ranges for products
  const ageRanges = [
    { min_months: 0, max_months: 6 }, // 0-6 months
    { min_months: 6, max_months: 12 }, // 6-12 months
    { min_months: 12, max_months: 24 }, // 1-2 years
    { min_months: 24, max_months: 60 }, // 2-5 years
  ];
  // Pick a random age range from the array
  // Math.random() gives 0-1, multiply by length, floor rounds down
  const ageRange = ageRanges[Math.floor(Math.random() * ageRanges.length)];

  // Return a product object with fake data
  return {
    id, // Use the ID passed in
    name: `Product ${id}`, // Simple name like "Product prod-1"
    description: "Premium quality product designed for your little one.", // Generic description
    // Random price between $20 and $119 (Math.random() * 100 gives 0-100, add 20)
    price: Math.floor(Math.random() * 100) + 20,
    age_range: ageRange, // The randomly selected age range
    // Use picsum.photos service to get a random placeholder image
    images: [`https://picsum.photos/800/600?random=${id}`],
    category: "toys", // Default category
    in_stock: true, // Always in stock for mock data
    // Current date/time in ISO format (standard date format)
    created_at: new Date().toISOString(),
  };
}

// API functions
// This object contains all the functions we can call to interact with the backend
export const api = {
  // Products section: Functions for getting product information

  // getProducts: Fetches a list of products, optionally filtered by age range
  async getProducts(
    request: GetProductsRequest = {} // Optional parameter, defaults to empty object
  ): Promise<GetProductsResponse> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "GET", // GET means we're reading data, not changing anything
      endpoint: "/api/products", // The API path for products
      // If user specified an age range filter, add it as query parameters
      queryParams: request.age_range
        ? {
            min_months: request.age_range.min_months, // Minimum age in months
            max_months: request.age_range.max_months, // Maximum age in months
          }
        : undefined, // No filter if age_range wasn't provided
    });

    // Return mock data (frontend uses this, backend still sees the request)
    // Array.from creates an array, { length: 8 } makes it 8 items long
    // (_, i) => means for each item, call this function with index i
    const products = Array.from(
      { length: 8 },
      (_, i) => generateMockProduct(`prod-${i + 1}`) // Create product with ID like "prod-1", "prod-2", etc.
    );
    // Return the products and total count
    return { products, total: products.length };
  },

  // getProduct: Fetches details for a single product by its ID
  async getProduct(id: string): Promise<GetProductResponse> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "GET", // Reading data
      endpoint: `/api/products/${id}`, // URL includes the product ID, e.g., "/api/products/prod-1"
    });

    // Return mock data (frontend uses this, backend still sees the request)
    return { product: generateMockProduct(id) };
  },

  // Cart section: Functions for managing the shopping cart

  // getCart: Retrieves all items currently in the user's cart
  async getCart(): Promise<GetCartResponse> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "GET", // Reading cart data
      endpoint: "/api/cart", // Cart endpoint
    });

    // Return mock data (frontend uses this, backend still sees the request)
    return { items: [], subtotal: 0 };
  },

  // addToCart: Adds a product to the shopping cart
  async addToCart(request: AddToCartRequest): Promise<CartItem> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "POST", // POST means we're creating/adding something
      endpoint: "/api/cart", // Cart endpoint
      payload: request, // The product ID, quantity, and optional variant
    });

    // Return mock data (frontend uses this, backend still sees the request)
    const product = generateMockProduct(request.product_id);
    return {
      id: `cart-item-${Date.now()}`, // Unique ID using current timestamp
      product_id: request.product_id, // Which product was added
      product, // Full product details
      quantity: request.quantity, // How many they want
      variant: request.variant, // Optional variant (color, size, etc.)
      created_at: new Date().toISOString(), // When it was added
    };
  },

  // updateCartItem: Changes the quantity of an item already in the cart
  async updateCartItem(
    itemId: string, // Which cart item to update
    request: UpdateCartItemRequest // Contains the new quantity
  ): Promise<CartItem> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "PUT", // PUT means we're updating existing data
      endpoint: `/api/cart/${itemId}`, // URL includes the cart item ID
      payload: request, // The new quantity
    });

    // Return mock data (frontend uses this, backend still sees the request)
    const product = generateMockProduct("prod-1");
    return {
      id: itemId, // Same ID (we're updating, not creating new)
      product_id: product.id, // Product ID
      product, // Product details
      quantity: request.quantity, // Updated quantity
      created_at: new Date().toISOString(), // Timestamp
    };
  },

  // removeCartItem: Removes an item from the cart completely
  async removeCartItem(itemId: string): Promise<void> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "DELETE", // DELETE means we're removing something
      endpoint: `/api/cart/${itemId}`, // URL includes the item ID to delete
    });
    // Returns nothing (void) - item is just removed
  },

  // Checkout section: Functions for completing a purchase

  // checkout: Processes the order and creates it in the system
  async checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "POST", // Creating a new order
      endpoint: "/api/checkout", // Checkout endpoint
      payload: request, // Shipping address ID and payment method
    });

    // Return mock data (frontend uses this, backend still sees the request)
    const mockOrder: Order = {
      id: `order-${Date.now()}`, // Unique order ID using timestamp
      items: [], // Empty items array (in real app, would have cart items)
      total: 0, // Total price (in real app, calculated from items)
      status: "pending", // Order starts as pending
      shipping_address: {
        id: request.shipping_address_id, // The address ID from the request
        street: "123 Main St", // Mock address data
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        is_default: true, // Mark as default
        created_at: new Date().toISOString(), // Timestamp
      },
      created_at: new Date().toISOString(), // When order was created
    };

    return { order: mockOrder };
  },

  // Auth section: Functions for user authentication

  // requestOTP: Request OTP for phone; backend returns the OTP so we can show it on screen
  async requestOTP(request: OTPLoginRequest): Promise<{ message: string; otp: string }> {
    await logApiRequest({
      method: "POST",
      endpoint: "/api/auth/otp",
      payload: request,
    });
    const response = await sendApiRequest<{ message: string; otp: string }>({
      method: "POST",
      endpoint: "/api/auth/otp",
      payload: request,
    });
    return response;
  },

  // verifyOTP: Checks if the code the user entered is correct
  async verifyOTP(request: OTPVerifyRequest): Promise<OTPVerifyResponse> {
    // Log the request
    await logApiRequest({
      method: "POST", // Verifying the code
      endpoint: "/api/auth/otp/verify", // OTP verification endpoint
      payload: request, // Contains phone number and the code they entered
    });

    // Send actual request to backend and get response
    // Backend returns snake_case (created_at) matching frontend interface
    const response = await sendApiRequest<OTPVerifyResponse>({
      method: "POST",
      endpoint: "/api/auth/otp/verify",
      payload: request,
    });

    // Backend response already matches frontend interface (snake_case)
    // Just ensure addresses array is present
    return {
      user: {
        ...response.user,
        addresses: response.user.addresses || [], // Ensure addresses array exists
      },
      token: response.token,
    };
  },

  // Addresses section: Functions for managing shipping addresses

  // getAddresses: Gets all saved addresses for the logged-in user
  async getAddresses(): Promise<Address[]> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "GET", // Reading addresses
      endpoint: "/api/account/addresses", // Addresses endpoint
    });

    // Return mock data (frontend uses this, backend still sees the request)
    return [];
  },

  // createAddress: Adds a new shipping address to the user's account
  async createAddress(request: CreateAddressRequest): Promise<Address> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "POST", // Creating a new address
      endpoint: "/api/account/addresses", // Addresses endpoint
      payload: request, // Contains street, city, state, zip, and optional is_default flag
    });

    // Return mock data (frontend uses this, backend still sees the request)
    return {
      id: `addr-${Date.now()}`, // Unique address ID using timestamp
      ...request, // Spread operator: copy all properties from request (street, city, state, zip)
      // If is_default wasn't provided, default to false
      is_default: request.is_default ?? false,
      created_at: new Date().toISOString(), // When address was created
    };
  },

  // updateAddress: Modifies an existing address (e.g., change street or set as default)
  async updateAddress(
    addressId: string, // Which address to update
    request: UpdateAddressRequest // Contains the fields to change (all optional)
  ): Promise<Address> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "PUT", // Updating existing address
      endpoint: `/api/account/addresses/${addressId}`, // URL includes address ID
      payload: request, // Contains only the fields being changed
    });

    // Return mock data (frontend uses this, backend still sees the request)
    return {
      id: addressId, // Same ID (updating, not creating)
      // Use new value if provided, otherwise use mock default values
      street: request.street || "123 Main St",
      city: request.city || "San Francisco",
      state: request.state || "CA",
      zip: request.zip || "94102",
      // Use new is_default value if provided, otherwise default to false
      is_default: request.is_default ?? false,
      created_at: new Date().toISOString(), // Timestamp
    };
  },

  // deleteAddress: Removes an address from the user's saved addresses
  async deleteAddress(addressId: string): Promise<void> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "DELETE", // Deleting the address
      endpoint: `/api/account/addresses/${addressId}`, // URL includes address ID to delete
    });
    // Returns nothing - address is just removed
  },

  // Orders section: Functions for viewing order history

  // getOrders: Gets all past orders for the logged-in user
  async getOrders(): Promise<GetOrdersResponse> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "GET", // Reading order history
      endpoint: "/api/account/orders", // Orders endpoint
    });

    // Return mock data (frontend uses this, backend still sees the request)
    return { orders: [], total: 0 };
  },

  // getOrder: Gets detailed information about a specific order
  async getOrder(orderId: string): Promise<Order> {
    // Log and send request to backend (so backend engineer can see it)
    await logApiRequest({
      method: "GET", // Reading order details
      endpoint: `/api/account/orders/${orderId}`, // URL includes order ID
    });

    // Return mock data (frontend uses this, backend still sees the request)
    return {
      id: orderId, // The order ID from the request
      items: [
        // Mock order items array
        {
          id: "item-1", // Item ID
          product_id: "prod-1", // Which product was ordered
          product_name: "Premium Baby Product", // Product name
          quantity: 2, // How many were ordered
          price: 49.99, // Price per item
        },
      ],
      total: 99.98, // Total order amount (2 × $49.99)
      status: "pending", // Order status
      shipping_address: {
        // Mock shipping address
        id: "addr-1",
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        is_default: true,
        created_at: new Date().toISOString(),
      },
      created_at: new Date().toISOString(), // When order was placed
    };
  },

  // ----- Doctors & Appointments – mock only (landing pages, no backend/DB) -----

  async getDoctors(): Promise<Doctor[]> {
    await logApiRequest({ method: "GET", endpoint: "/api/doctors" });
    return [
      { id: "doc-1", display_name: "Dr. John", specialty: "Pediatrics", consultation_price: 1000, created_at: new Date().toISOString() },
      { id: "doc-2", display_name: "Dr. Sarah", specialty: "Child Development", consultation_price: 1200, created_at: new Date().toISOString() },
    ];
  },

  async getDoctorAvailability(doctorId: string, from?: string, to?: string): Promise<Slot[]> {
    await logApiRequest({ method: "GET", endpoint: `/api/doctors/${doctorId}/availability`, queryParams: from && to ? { from, to } : undefined });
    const slots: Slot[] = [];
    const start = from ? new Date(from) : new Date();
    const end = to ? new Date(to) : new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      ["09:00", "09:30", "10:00", "11:00", "16:00", "16:30", "17:00"].forEach((time) => {
        const [h, m] = time.split(":").map(Number);
        const slotStart = new Date(d);
        slotStart.setHours(h, m, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
        if (slotStart >= start && slotEnd <= end) slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
      });
    }
    return slots.slice(0, 14);
  },

  async createAppointment(request: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    await logApiRequest({ method: "POST", endpoint: "/api/appointments", payload: request });
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctor_id: request.doctor_id,
      customer_user_id: "customer-1",
      child_name: request.child_name,
      child_age_months: request.child_age_months,
      notes: request.notes,
      slot_start: request.slot_start,
      slot_end: request.slot_end,
      status: "CONFIRMED",
      qr_payload: `apt-${Date.now()}:mock-token`,
      created_at: new Date().toISOString(),
      price: 1000,
    };
    return { appointment, qr_payload: appointment.qr_payload ?? "" };
  },

  async getDoctorProfile(): Promise<Doctor> {
    await logApiRequest({ method: "GET", endpoint: "/api/doctor/me" });
    return { id: "doc-1", display_name: "Dr. John", specialty: "Pediatrics", consultation_price: 1000, created_at: new Date().toISOString() };
  },

  async getDoctorAppointments(_params?: { from?: string; to?: string; status?: string }): Promise<Appointment[]> {
    await logApiRequest({ method: "GET", endpoint: "/api/doctor/appointments" });
    const base = new Date();
    base.setHours(9, 0, 0, 0);
    return [
      { id: "apt-1", doctor_id: "doc-1", customer_user_id: "u1", child_name: "Lisa", slot_start: new Date(base).toISOString(), slot_end: new Date(base.getTime() + 30 * 60000).toISOString(), status: "CONFIRMED", created_at: new Date().toISOString(), customer_name: "Lisa", price: 1000 },
      { id: "apt-2", doctor_id: "doc-1", customer_user_id: "u2", child_name: "Sanjay", slot_start: new Date(base.getTime() + 30 * 60000).toISOString(), slot_end: new Date(base.getTime() + 60 * 60000).toISOString(), status: "CONFIRMED", created_at: new Date().toISOString(), customer_name: "Sanjay", price: 1000 },
    ];
  },

  async getDoctorStats(): Promise<DoctorStats> {
    await logApiRequest({ method: "GET", endpoint: "/api/doctor/stats" });
    return { total_consultations: 350, today_available: 10, total_value: 50000 };
  },

  async getDoctorReviews(): Promise<Review[]> {
    await logApiRequest({ method: "GET", endpoint: "/api/doctor/reviews" });
    return [
      { id: "r1", appointment_id: "apt-4", rating: 5, comment: "Good Doctor", patient_name: "Jessica", created_at: new Date().toISOString() },
      { id: "r2", appointment_id: "apt-5", rating: 5, comment: "Best Doctor", patient_name: "Tony", created_at: new Date().toISOString() },
    ];
  },
};
