# Cradlers

A modern e-commerce platform for premium kids products (ages 0-5).

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.6+
- **MongoDB** (local or cloud)
- **Docker** (optional, for MongoDB)

### Start the Application

1. **Start MongoDB** (see [MongoDB Setup](./backend/MONGODB_SETUP.md))
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Start Backend** (see [Backend Setup](./backend/SETUP.md))
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Backend runs on `http://localhost:8000`

3. **Start Frontend** (see [Frontend Setup](./frontend/SETUP.md))
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## 📚 Documentation

- **[Frontend Setup](./frontend/SETUP.md)** - Frontend installation and configuration
- **[Backend Setup](./backend/SETUP.md)** - Backend installation and configuration
- **[MongoDB Setup](./backend/MONGODB_SETUP.md)** - MongoDB installation and configuration

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MongoDB
- **Security**: Spring Security with JWT

## 🔐 Authentication & Roles

The application uses OTP-based authentication:
1. User enters phone number
2. Receives 6-digit OTP code (logged to backend console in development)
3. Enters OTP to verify and log in

**Roles** are assigned by portal (subdomain). Only **ADMIN** and **VENDOR** are stored; users with no role are customers.
- **ADMIN** — log in at `http://admin.localhost:3000` (admin portal)
- **VENDOR** — log in at `http://vendor.localhost:3000` (vendor portal)
- **Customer** — no role stored; log in at `http://localhost:3000` (shop) or anyone without ADMIN/VENDOR

New users get ADMIN or VENDOR only when signing up from admin/vendor portals; otherwise no role (customer). Add to `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows):
```
127.0.0.1 admin.localhost vendor.localhost
```
Then open `http://admin.localhost:3000` or `http://vendor.localhost:3000` for the respective dashboards.

## 📝 Environment Variables

### Frontend
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
```

### Backend
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/cradlers
jwt.secret=your-secret-key
# Include admin and vendor subdomains for CORS
cors.allowed-origins=http://localhost:3000,http://admin.localhost:3000,http://vendor.localhost:3000
```

## 🧪 Testing the Login Flow

1. Navigate to `http://localhost:3000/login`
2. Enter a phone number (e.g., `+1234567890`)
3. Check backend console logs for the OTP code
4. Enter the 6-digit OTP code
5. You should be logged in and redirected

## 📦 Project Structure

```
cradlers/
├── frontend/          # Next.js frontend application
├── backend/           # Spring Boot backend API
└── README.md          # This file
```

## 📄 License

Private - Cradlers
