# Frontend Setup Guide

## Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Environment Configuration

Create a `.env.local` file (optional):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, defaults to `http://localhost:8000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management

## Troubleshooting

### Port 3000 already in use
Change the port:
```bash
PORT=3001 npm run dev
```

### Dependencies installation fails
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
Ensure Node.js version is 18+:
```bash
node --version
```

