# Backend Setup Guide

## Prerequisites

- **Java** 17 or higher
- **Maven** 3.6+
- **MongoDB** (see [MongoDB Setup](./MONGODB_SETUP.md))

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

## Running the Application

### Development Mode

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8000`

### Production Mode

```bash
mvn clean package
java -jar target/cradlers-backend-0.1.0.jar
```

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server
server.port=8000

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/cradlers

# JWT
jwt.secret=your-secret-key-change-in-production
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000
```

OTP is returned in the API response and shown on the login screen (no SMS).

## API Endpoints

### Authentication

- `POST /api/auth/otp` - Request OTP code
  ```json
  { "phone": "+1234567890" }
  ```

- `POST /api/auth/otp/verify` - Verify OTP code
  ```json
  { "phone": "+1234567890", "otp": "123456" }
  ```

## Testing the API

### Request OTP
```bash
curl -X POST http://localhost:8000/api/auth/otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:8000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "otp": "123456"}'
```

**Note:** In development, OTP codes are logged to the console.

## Tech Stack

- **Spring Boot 3.2.0** - Java framework
- **Spring Data MongoDB** - MongoDB integration
- **Spring Security** - Security framework
- **JWT** - Token-based authentication

## Troubleshooting

### Port 8000 already in use
Change the port in `application.properties`:
```properties
server.port=8001
```

### MongoDB connection failed
- Ensure MongoDB is running (see [MongoDB Setup](./MONGODB_SETUP.md))
- Check connection string in `application.properties`
- Verify MongoDB is accessible: `nc -z localhost 27017`

### Build errors
Ensure Java 17+ is installed:
```bash
java -version
```

### Maven not found
Install Maven:
```bash
# macOS
brew install maven

# Or use Maven Wrapper (if available)
./mvnw clean install
```
