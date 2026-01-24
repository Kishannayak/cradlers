# MongoDB Setup Guide

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps

# View logs
docker logs mongodb
```

**Stop MongoDB:**
```bash
docker stop mongodb
```

**Start MongoDB (if stopped):**
```bash
docker start mongodb
```

### Option 2: Local Installation

#### macOS (Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Windows
Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### Option 3: MongoDB Atlas (Cloud)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/cradlers
   ```

## Configuration

The backend is configured to connect to:
- **Local**: `mongodb://localhost:27017/cradlers`
- **Database**: `cradlers`

Update `src/main/resources/application.properties` if needed:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/cradlers
spring.data.mongodb.database=cradlers
```

## Verify Connection

### Using MongoDB Shell
```bash
# If using Docker
docker exec -it mongodb mongosh

# If installed locally
mongosh mongodb://localhost:27017
```

### Test Connection
```bash
# Check if MongoDB is accepting connections
nc -z localhost 27017 && echo "MongoDB is running" || echo "MongoDB is not running"
```

## Collections

The application automatically creates these collections:
- `users` - User accounts
- `otp_codes` - OTP verification codes
- `addresses` - User shipping addresses

## Troubleshooting

### Connection Refused
- **Docker**: Ensure container is running (`docker ps`)
- **Local**: Check if MongoDB service is running
- **Port**: Verify port 27017 is not blocked

### Authentication Errors
- **Local MongoDB**: Usually no authentication required by default
- **MongoDB Atlas**: Ensure your IP is whitelisted in Atlas dashboard

### Database Not Found
- MongoDB creates databases automatically on first write
- The `cradlers` database will be created when you first save data

## Useful Commands

### Docker
```bash
# View logs
docker logs mongodb

# Stop container
docker stop mongodb

# Remove container
docker rm -f mongodb

# Restart container
docker restart mongodb
```

### MongoDB Shell
```bash
# Connect
mongosh mongodb://localhost:27017

# List databases
show dbs

# Use database
use cradlers

# List collections
show collections

# View documents
db.users.find()
```
