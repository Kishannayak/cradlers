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

## 🔐 Authentication

The application uses OTP-based authentication:
1. User enters phone number
2. Receives 6-digit OTP code (logged to backend console in development)
3. Enters OTP to verify and log in

## 📝 Environment Variables

### Frontend
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
```

### Backend
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/cradlers
jwt.secret=your-secret-key
cors.allowed-origins=http://localhost:3000
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
